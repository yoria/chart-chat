<template>
  <div
    class="tradingview-widget-container border-bottom"
    id="trandingview-widget"
  >
    <div id="tradingview_0685e"></div>
    <div class="tradingview-widget-copyright bg-dark" id="widget-bottom">
      <small
        >TradingView提供の<a
          href="https://jp.tradingview.com/symbols/NASDAQ-AAPL/"
          rel="noopener"
          target="_blank"
          class="text-primary"
          >{{ stock }}チャート</a
        >
      </small>
    </div>
  </div>
</template>
<script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
<script>
export default {
  props: ["stock"],
  watch: {
    stock: {
      handler: function () {
        this.setTradingViewWidget();
      },
    },
  },
  mounted: function () {
    this.setTradingViewWidget();
  },
  methods: {
    setTradingViewWidget() {
      let language;
      if (navigator.browserLanguage != null) {
        // Internet Explorer, Opera
        language = navigator.browserLanguage.substr(0, 2);
      } else if (navigator.userLanguage != null) {
        // Internet Explorer
        language = navigator.userLanguage.substr(0, 2);
      } else if (navigator.language != null) {
        // Chrome, Firefox, Opera
        language = navigator.language.substr(0, 2);
      } else {
        language = "en";
      }
      new TradingView.widget({
        /*
        "width": navigator.userAgent.match(/iPhone|Android.+Mobile/) ? document.documentElement.clientWidth : window.innerWidth * 7 / 12,
        "height": navigator.userAgent.match(/iPhone|Android.+Mobile/) ? document.documentElement.clientHeight : window.innerHeight * 10 / 12,
        /*"height": navigator.userAgent.match(/iPhone|Android.+Mobile/) ? window.innerWidth * 11 / 16 : window.innerHeight * 10 / 12,*/
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        symbol: this.stock,
        interval: "1",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: language,
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: false,
        save_image: false,
        hide_legend: true,
        container_id: "tradingview_0685e",
      });
    },
  },
};
</script>
<style>
#trandingview-widget {
  z-index: 500;
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
}
</style>