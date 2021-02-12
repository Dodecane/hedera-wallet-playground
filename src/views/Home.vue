<template>
  <section class="section section-shaped section-lg my-0">
    <div class="shape shape-style-1 bg-gradient-dark">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="container pt-lg-md">
      <div class="row justify-content-center">
        <div class="col-lg-12">
          <h1 class="display-2 text-white text-center">
            <span>Welcome to the Hedera Wallet Playground!</span>
          </h1>
          <p class="lead text-white text-center">
            Click on any of the tiles below to get started
          </p>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-lg-8 align-self-center">
          <router-link to="/tokenizer">
            <card
              type="gradient-default"
              shadow
              hover
              body-classes="px-lg-4 py-lg-4 text-white"
              class="h-50 mb-4 border-0"
            >
              <h1 class="display-4 text-white text-center">
                <span>Have something to tokenize?</span>
              </h1>
              <p class="lead text-white text-center">
                Check out the asset tokenizer
              </p>
            </card>
          </router-link>
          <router-link to="/bridge">
            <card
              type="gradient-primary"
              shadow
              hover
              body-classes="px-lg-4 py-lg-4 text-white"
              class="h-50 border-0"
            >
              <h1 class="display-4 text-white text-center">
                <span>Wish to use your Ethereum on Hedera Hashgraph?</span>
              </h1>
              <p class="lead text-white text-center">
                Check out the Ethereum to Hedera Hashgraph bridge
              </p>
            </card></router-link
          >
        </div>
        <div class="col-lg-4">
          <router-link to="/faucet">
            <card
              type="gradient-info"
              shadow
              hover
              body-classes="px-lg-4 py-lg-4 text-white"
              class="h-100 border-0"
            >
              <h1 class="display-4 text-white text-center">
                <span>Need a Testnet account ID?</span>
              </h1>
              <p class="lead text-white text-center">
                Get one from the Hedera Hashgraph Test Network account faucet
              </p>
            </card></router-link
          >
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {};
</script>
<style></style>
