const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
require("dotenv").config();
const {
  AccountId,
  PrivateKey,
  Client,
  PublicKey,
  AccountCreateTransaction,
  Hbar,
} = require("@hashgraph/sdk");

exports.generateAccountId = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      let key = req.body.publicKey;
      if (!key) {
        res.status(400).json({ status: "missing parameters" });
      }
      let publicKey = PublicKey.fromString(key);
      let treasuryAccountId = AccountId.fromString(
        process.env.VUE_APP_BRIDGE_HEDERA_ACCOUNT_ID
      );
      let hederaPrivateKey = PrivateKey.fromString(
        process.env.BRIDGE_HEDERA_PRIVATE_KEY
      );
      const client = Client.forTestnet();
      client.setOperator(treasuryAccountId, hederaPrivateKey);
      let txReceipt = await createAccount(client, publicKey);
      let newAccountId = txReceipt.accountId.toString();
      res.status(200).json({ status: "success", accountId: newAccountId });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: error,
      });
    }
  });
});

async function createAccount(client, publicKey) {
  const txResponse = await new AccountCreateTransaction()
    .setKey(publicKey)
    .setInitialBalance(new Hbar(100))
    .execute(client);
  const txReceipt = await txResponse.getReceipt(client);
  return txReceipt;
}
