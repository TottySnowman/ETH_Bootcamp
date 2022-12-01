const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const accounts = require("../server/constants/accounts");
const hashing = require("./scripts/hashMessage");
const sign = require("./scripts/signMessage");
app.use(cors());
app.use(express.json());

const balances = {
  [accounts[0].address]: 100,
  [accounts[1].address]: 50,
  [accounts[2].address]: 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { sender, recipient, amount } = req.body;
  let privateKeySender = getPrivateKeyByAddress(sender);
  let transaction = {
    senderAddress: sender,
    recipientAddress: recipient,
    amount: amount,
    timestamp: new Date().getTime()
  }

let hash = hashing(JSON.stringify(transaction));
let [signature, recoveryBit] = await sign(hash, privateKeySender);
console.log(signature)
  /* setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  } */
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function getPrivateKeyByAddress(address){
  let senderAccount = accounts.find(el=> el.address === address);
  return senderAccount.private_key;
}