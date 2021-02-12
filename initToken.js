const {
  Client,
  PrivateKey,
  Hbar,
  TokenCreateTransaction,
  AccountId,
} = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {
  const myAccountId = AccountId.fromString(
    process.env.VUE_APP_BRIDGE_HEDERA_ACCOUNT_ID
  );
  const myPrivateKey = PrivateKey.fromString(
    process.env.BRIDGE_HEDERA_PRIVATE_KEY
  );

  if (myAccountId == null || myPrivateKey == null) {
    throw new Error(
      "Environment variables VUE_APP_BRIDGE_HEDERA_ACCOUNT_ID and BRIDGE_HEDERA_PRIVATE_KEY must be present"
    );
  }

  const client = Client.forTestnet();

  client.setOperator(myAccountId, myPrivateKey);

  const transaction = await new TokenCreateTransaction()
    .setTokenName("Hedera Wrapped Ethereum")
    .setTokenSymbol("hETH")
    .setInitialSupply(0)
    .setDecimals(18)
    .setTreasuryAccountId(myAccountId)
    .setAdminKey(myPrivateKey.publicKey)
    .setSupplyKey(myPrivateKey.publicKey)
    .setAutoRenewAccountId(myAccountId)
    .setMaxTransactionFee(new Hbar(30))
    .freezeWith(client);

  const signTx = await (await transaction.sign(myPrivateKey)).sign(
    myPrivateKey
  );

  const txResponse = await signTx.execute(client);

  const receipt = await txResponse.getReceipt(client);

  const tokenId = receipt.tokenId;

  console.log("Token initialized with token ID: " + tokenId);
}
main();
