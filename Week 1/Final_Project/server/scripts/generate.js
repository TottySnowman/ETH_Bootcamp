const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils")

let private_key, public_key, address;

for(let x = 0; x < 3; x++)
{
    private_key = secp.utils.randomPrivateKey();
    public_key = secp.getPublicKey(private_key);
    address = public_key.slice(1);
    address = address.slice(12);
    console.log('private key: ', toHex(private_key));
    console.log('full public key: ', toHex(public_key));
    console.log('ETH address: ', toHex(address));
}