const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./User.js");
const PVE = require("./PVE.js");
const PVP = require("./PVP.js");
const NFT = require("./NFT.js");

const db_init = () => {
  const dbName = process.env.DB_NAME;
  const dbHost = process.env.DB_HOST; // or the appropriate host if different
  const dbPort = process.env.DB_PORT; // or the appropriate port if different
  const mongoURI = `mongodb://${dbHost}:${dbPort}/${dbName}`;
  return new Promise(async (resolve, reject) => {
    mongoose
      .connect(mongoURI)
      .then(() => {
        console.log(`Connected to MongoDB "${dbName}"...`);
        resolve();
      })
      .catch((err) => {
        console.error("Could not connect to MongoDB...", err);
        reject();
      });
  });
};

// export const updateUser = (params) => {
//   return new Promise(async (resolve, reject) => {
//     User.findOne({ chatid: params.chatid }).then(async (user) => {
//       if (!user) {
//         user = new User();
//       }

//       user.chatid = params.chatid;
//       user.username = params.username ?? "";
//       user.depositWallet = params.depositWallet;

//       await user.save();

//       resolve(user);
//     });
//   });
// };

// export const removeUser = (params) => {
//   return new Promise((resolve, reject) => {
//     User.deleteOne({ chatid: params.chatid }).then(() => {
//       resolve(true);
//     });
//   });
// };

// export async function selectUsers(params = {}) {
//   return new Promise(async (resolve, reject) => {
//     User.find(params).then(async (users) => {
//       resolve(users);
//     });
//   });
// }

// export async function countUsers(params = {}) {
//   return new Promise(async (resolve, reject) => {
//     User.countDocuments(params).then(async (users) => {
//       resolve(users);
//     });
//   });
// }

// export async function selectUser(params) {
//   return new Promise(async (resolve, reject) => {
//     User.findOne(params).then(async (user) => {
//       resolve(user);
//     });
//   });
// }

// export async function deleteUser(params) {
//   return new Promise(async (resolve, reject) => {
//     User.deleteOne(params).then(async (user) => {
//       resolve(user);
//     });
//   });
// }

// export const registToken = (params) => {
//   return new Promise(async (resolve, reject) => {
//     const item = new VolumeToken();
//     item.timestamp = new Date().getTime();
//     item.chatid = params.chatid;
//     item.addr = params.addr;
//     item.baseAddr = params.baseAddr;
//     item.symbol = params.symbol;
//     item.baseSymbol = params.baseSymbol;
//     item.decimal = params.decimal;
//     item.baseDecimal = params.baseDecimal;
//     item.currentVolume = 0;
//     item.targetVolume = 1;
//     item.solAmount = 3;
//     item.workingTime = 0;
//     item.lastWorkedTime = 0;
//     item.delayTime = 5;
//     item.status = false;
//     item.lookupTableAddr = '';
//     item.reqCount = 0;
//     await item.save();
//     resolve(item);
//   });
// };

// export const removeToken = (params) => {
//   return new Promise((resolve, reject) => {
//     VolumeToken.deleteOne(params).then(() => {
//       resolve(true);
//     });
//   });
// };

// export async function selectTokens(params = {}, limit = 0) {
//   return new Promise(async (resolve, reject) => {
//     if (limit) {
//       VolumeToken.find(params)
//         .limit(limit)
//         .then(async (dcas) => {
//           resolve(dcas);
//         });
//     } else {
//       VolumeToken.find(params).then(async (dcas) => {
//         resolve(dcas);
//       });
//     }
//   });
// }

// export async function selectToken(params) {
//   return new Promise(async (resolve, reject) => {
//     VolumeToken.findOne(params).then(async (user) => {
//       resolve(user);
//     });
//   });
// }

// export async function updateToken(params) {
//   return new Promise(async (resolve, reject) => {
//     VolumeToken.updateOne(params).then(async (user) => {
//       resolve(user);
//     });
//   });
// }

// export async function selectTaxHistory(params) {
//   return new Promise(async (resolve, reject) => {
//     TaxHistory.findOne(params).then(async (history) => {
//       resolve(history);
//     });
//   });
// }

// export async function updateTaxHistory(params, query) {
//   return new Promise(async (resolve, reject) => {
//     TaxHistory.updateOne(params, query).then(async (history) => {
//       resolve(history);
//     });
//   });
// }

// export async function selectTaxHistories(params) {
//   return new Promise(async (resolve, reject) => {
//     TaxHistory.find(params).then(async (histories) => {
//       resolve(histories);
//     });
//   });
// }

// export async function addTaxHistory(params) {
//   return new Promise(async (resolve, reject) => {
//     const item = new TaxHistory();
//     item.timestamp = new Date().getTime();

//     item.chatid = params.chatid;
//     item.addr = params.solUp;
//     item.amount = params.solDown;

//     await item.save();

//     resolve(item);
//   });
// }

// export async function addTrxHistory(params = {}) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let item = new TrxHistory();

//       item.chatid = params.chatid;
//       item.solAmount = params.solAmount;
//       item.tokenAmount = params.tokenAmount;
//       item.mode = params.mode;
//       item.trxId = params.trxId;
//       item.timestamp = new Date().getTime();

//       await item.save();

//       resolve(true);
//     } catch (err) {
//       resolve(false);
//     }
//   });
// }

// export async function addWallet(params) {
//   return new Promise(async (resolve, reject) => {
//     const item = new Wallet();
//     item.timestamp = new Date().getTime();

//     item.prvKey = params.prvKey;
//     await item.save();

//     resolve(item);
//   });
// }

// export async function countWallets(params = {}) {
//   return new Promise(async (resolve, reject) => {
//     Wallet.countDocuments(params).then(async (dcas) => {
//       resolve(dcas);
//     });
//   });
// }

// export async function selectWallets(params = {}, limit = 0) {
//   return new Promise(async (resolve, reject) => {
//     if (limit) {
//       Wallet.find(params)
//         .limit(limit)
//         .then(async (dcas) => {
//           resolve(dcas);
//         });
//     } else {
//       Wallet.find(params).then(async (dcas) => {
//         resolve(dcas);
//       });
//     }
//   });
// }

// export async function addWhiteList(params) {
//   return new Promise(async (resolve, reject) => {
//     const item = new WhiteList();
//     item.timestamp = new Date().getTime();

//     item.limitTokenCount = params.limitTokenCount;
//     item.chatid = params.chatid;

//     await item.save();

//     resolve(item);
//   });
// }

// export async function selectWhiteLists(params = {}) {
//   return new Promise(async (resolve, reject) => {
//     WhiteList.find(params).then(async (dcas) => {
//       resolve(dcas);
//     });
//   });
// }
module.exports = { db_init };