  const { Liquidity, Token, TokenAmount, Percent, SPL_ACCOUNT_LAYOUT, BigNumberish, TxVersion } = require( "@raydium-io/raydium-sdk");
const {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddressSync,
  getMint,
  NATIVE_MINT,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  transferChecked,
} = require("@solana/spl-token");

const REWARD_TOKEN = '43uhykFm8Y9gLvHrWs7r7w1HCKu6vikDi7j394FaSfNz'

const { PublicKey } = require('@solana/web3.js');

/** Address of the SPL Token program */
// const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
/** Address of the SPL Token 2022 program */
// const TOKEN_2022_PROGRAM_ID = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');
/** Address of the SPL Associated Token Account program */
// const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
/** Address of the special mint for wrapped native SOL in spl-token */
// const NATIVE_MINT = new PublicKey('So11111111111111111111111111111111111111112');
/** Address of the special mint for wrapped native SOL in spl-token-2022 */
const NATIVE_MINT_2022 = new PublicKey('9pan9bMn5HatX4EJdBwg9VgCa7Uz5HL8N1m5D3NdXejP');


let latestBlockHash = "";
let latestBlockHashDate = 0;
async function getLatestBlockHash() {
  if (Date.now() - latestBlockHashDate > 10000) {
    latestBlockHash = (await G.conn().getLatestBlockhash()).blockhash;
    latestBlockHashDate = Date.now();
  }
  return latestBlockHash;
}

async function transfer_token(conn, payer, receiver, token, amount) {
  G.log("❔ reward token should trasfered to", payer.publicKey.toBase58());
  try {
    const mint = new PublicKey(token);
    const fromATA = getAssociatedTokenAddressSync(mint, payer.publicKey);
    const toATA = getAssociatedTokenAddressSync(mint, receiver);

    let instructions = [];
    const info = await conn.getAccountInfo(toATA);
    if (!info) {
      instructions.push(createAssociatedTokenAccountInstruction(payer.publicKey, toATA, receiver, mint));
    }
    instructions.push(createTransferInstruction(fromATA, toATA, payer.publicKey, amount));
    const tx = new Transaction().add(...instructions);
    await sendAndConfirmTransaction(conn, tx, [payer]);
    G.log("✅ reward token trasfered", payer.publicKey.toBase58(), tx.signatures[0].signature);
    return true;
  } catch (err) {
    // G.log(err);
  }
  return false;
}


const getWalletTokenAccount = async (conn, wallet, isToken2022 = true) => {
  // assert(conn);

  const walletTokenAccount = await conn.getTokenAccountsByOwner(wallet, {
    programId: isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID,
  });

  return walletTokenAccount.value.map((i) => ({
    pubkey: i.pubkey,
    programId: i.account.owner,
    accountInfo: SPL_ACCOUNT_LAYOUT.decode(i.account.data),
  }));
};

const getWalletTokenBalance = async (conn, wallet, mint, decimal = 0) => {
  const walletTokenAccounts = await getWalletTokenAccount(conn, new PublicKey(wallet), false);
  let tokenBalance = 0;
  if (walletTokenAccounts && walletTokenAccounts.length > 0) {
    for (const acc of walletTokenAccounts) {
      if (acc.accountInfo.mint.toBase58() === mint) {
        if (!decimal) decimal = (await getMint(conn, new PublicKey(mint))).decimals;
        tokenBalance = Number(acc.accountInfo.amount) / 10 ** decimal;
        break;
      }
    }
  }
  return tokenBalance;
};

const getWalletSOLBalance_bn = async (conn, wallet) => {
  try {
    let balance = await conn.getBalance(new PublicKey(wallet));
    return balance;
  } catch (error) {
    // G.log(error);
  }
  return BigInt(0);
};

const getWalletSOLBalance = async (conn, wallet) => {
  try {
    let balance = (await conn.getBalance(new PublicKey(wallet))) / LAMPORTS_PER_SOL;
    return balance;
  } catch (error) {
    // G.log(error);
  }
  return 0;
};


module.exports = {
  REWARD_TOKEN,
  getLatestBlockHash,
  transfer_token,
  getWalletTokenAccount,
  getWalletTokenBalance,
  getWalletSOLBalance_bn,
  getWalletSOLBalance
};