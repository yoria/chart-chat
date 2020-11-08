<template>
  <v-app>
    <div class="dropdown" id="symbol-dropdown" :style="style.symbolDropdown">
      <button
        type="button"
        id="dropdown1"
        class="btn btn-dark rounded-circle p-0 text-light"
        style="width: 5rem; height: 5rem"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Symbols
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdown1">
        <router-link class="dropdown-item" to="/">Chachat</router-link>
        <div class="dropdown-divider"></div>

        <div v-for="symbol in allSymbols" :key="symbol.index">
          <router-link
            v-if="symbol != 'divLine'"
            class="dropdown-item"
            :class="{ active: stock === symbol }"
            :to="{ name: 'symbols', params: { symbol: symbol } }"
            >{{ symbol }}</router-link
          >
          <div v-else class="dropdown-divider"></div>
        </div>
        <div>
          <router-link class="dropdown-item" to="/user">ユーザー</router-link>
        </div>
      </div>
    </div>
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      allSymbols: [
        "AAPL",
        "MSFT",
        "AMZN",
        "divLine",
        "DJI",
        "divLine",
        "USDJPY",
        "EURUSD",
        "GBPUSD",
        "AUDUSD",
        "divLine",
        "XAUUSD",
        "USOIL",
        "divLine",
      ],
      style: {
        symbolDropdown: {
          zIndex: 1500,
          position: "fixed",
          top: "10px",
          right: "10px",
        },
      },
    };
  },
  mounted: function () {},
};
</script>
