module.exports = {
    login,
    register,
}

async function login(req) {
    const { username, password } = req.body;
    if ( username === undefined || username === "" )
        throw {code: '02', message: "Username is null"}
    if ( password === undefined || password === "" )
        throw {code: '02', message: "Password is null"}
}

async function register(req) {
    const { username, password, email } = req.body;
    if ( username === undefined || username === "" )
        throw {code: '02', message: "Username is null"}
    if ( password === undefined || password === "" )
        throw {code: '02', message: "Password is null"}
}