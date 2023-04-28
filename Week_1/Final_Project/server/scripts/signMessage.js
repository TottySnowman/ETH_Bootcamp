const secp = require("ethereum-cryptography/secp256k1");
async function signTx(message, private_key)
{
    let crypto = secp.sign(message, private_key, {recovered: true} )
    return crypto;
}

module.exports = signTx;