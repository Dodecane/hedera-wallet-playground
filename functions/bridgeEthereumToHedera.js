const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
require("dotenv").config();
const axios = require("axios");
const {
  AccountId,
  PrivateKey,
  Client,
  TokenId,
  TokenMintTransaction,
  TransferTransaction,
} = require("@hashgraph/sdk");
var Web3 = require("web3");

exports.bridgeEthereumToHedera = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      let txHash = req.body.txHash;
      let recipient = req.body.recipientAccountId;
      if (!txHash || !recipient) {
        res.status(400).json({ status: "missing parameters" });
      }
      let recipientAccountId = AccountId.fromString(recipient);
      await listenEthTx(txHash);
      let value = await getEthTxValue(txHash);
      let treasuryAccountId = AccountId.fromString(
        process.env.VUE_APP_BRIDGE_HEDERA_ACCOUNT_ID
      );
      let privateKey = PrivateKey.fromString(
        process.env.BRIDGE_HEDERA_PRIVATE_KEY
      );
      let hethTokenId = TokenId.fromString(process.env.VUE_APP_HETH_TOKEN_ID);
      const client = Client.forTestnet();
      client.setOperator(treasuryAccountId, privateKey);
      let txReceipt = await mintToken(client, hethTokenId, value);
      console.log(txReceipt);
      let txReceipt2 = await sendToken(
        client,
        hethTokenId,
        treasuryAccountId,
        recipientAccountId,
        value
      );
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

function listenEthTx(txHash) {
  return new Promise((resolve, reject) => {
    let listener = setInterval(function() {
      axios
        .get(
          `https://api-ropsten.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${txHash}&apikey=${process.env.ETHERSCAN_API_KEY}`
        )
        .then((res) => {
          if (res.data.status === "1") {
            clearInterval(listener);
            resolve();
          }
        });
    }, 500);
  });
}

async function getEthTxValue(txHash) {
  var web3 = new Web3(
    new Web3.providers.WebsocketProvider(
      `wss://ropsten.infura.io/ws/v3/${process.env.INFURA_PROJECT_ID}`
    )
  );
  let txDetails = await web3.eth.getTransaction(txHash);
  return txDetails.value;
}

async function mintToken(client, tokenId, value) {
  const txResponse = await new TokenMintTransaction()
    .setTokenId(tokenId)
    .setAmount(value)
    .execute(client);
  return txResponse;
}

async function sendToken(
  client,
  tokenId,
  senderAccountId,
  recipientAccountId,
  value
) {
  const txResponse = await new TransferTransaction()
    .addTokenTransfer(tokenId, senderAccountId, value * -1)
    .addTokenTransfer(tokenId, recipientAccountId, value)
    .execute(client);
  return txResponse;
}
