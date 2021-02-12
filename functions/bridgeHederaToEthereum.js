const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
require("dotenv").config();
const {
  AccountId,
  PrivateKey,
  Client,
  TokenId,
  TokenBurnTransaction,
} = require("@hashgraph/sdk");
var Web3 = require("web3");
const Tx = require("ethereumjs-tx").Transaction;

exports.bridgeHederaToEthereum = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      let value = req.body.hethSent;
      let recipientAddress = req.body.recipientAddress;
      if (!recipientAddress || !value) {
        res.status(400).json({ status: "missing parameters" });
      }
      let treasuryAccountId = AccountId.fromString(
        process.env.VUE_APP_BRIDGE_HEDERA_ACCOUNT_ID
      );
      let hederaPrivateKey = PrivateKey.fromString(
        process.env.BRIDGE_HEDERA_PRIVATE_KEY
      );
      let hethTokenId = TokenId.fromString(process.env.VUE_APP_HETH_TOKEN_ID);
      const client = Client.forTestnet();
      client.setOperator(treasuryAccountId, hederaPrivateKey);
      let txReceipt = await burnToken(client, hethTokenId, value);
      console.log(txReceipt);
      let txReceipt2 = await sendEth(recipientAddress, value);
      console.log(txReceipt2);
      res.status(200).json({ status: "success" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: error,
      });
    }
  });
});

async function burnToken(client, tokenId, value) {
  const txResponse = await new TokenBurnTransaction()
    .setTokenId(tokenId)
    .setAmount(value)
    .execute(client);
  return txResponse;
}

async function sendEth(recipientAddress, value) {
  var web3 = new Web3(
    new Web3.providers.WebsocketProvider(
      `wss://ropsten.infura.io/ws/v3/${process.env.INFURA_PROJECT_ID}`
    )
  );
  let treasuryAddress = process.env.VUE_APP_BRIDGE_ETH_ADDRESS;
  let privateKey = Buffer.from(process.env.BRIDGE_ETH_PRIVATE_KEY, "hex");
  let txCount = await web3.eth.getTransactionCount(treasuryAddress);
  const txObject = {
    nonce: web3.utils.toHex(txCount),
    to: recipientAddress,
    value: web3.utils.toHex(web3.utils.toWei(value.toString(), "wei")),
    gasLimit: web3.utils.toHex(21000),
    gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
  };
  const tx = new Tx(txObject, { chain: "ropsten" });
  tx.sign(privateKey);

  const serializedTransaction = tx.serialize();
  const raw = "0x" + serializedTransaction.toString("hex");

  let result = await web3.eth.sendSignedTransaction(raw);
  return result;
}
