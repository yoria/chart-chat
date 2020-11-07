<template>
  <div>
    <div class="container" style="text-align: center">
      <h1>Chachatへようこそ</h1>
      <h2>管理者からメッセージ</h2>
      <img src="/administrator.jpg" style="width: 20%; height: auto" />
      <p>
        ChachatはFXや株などの投資・投機をしている方向けに作ったWebアプリです.
      </p>
      <p>
        「チャートを見ながらみんなでチャットをしたら面白いのでは？」というアイデアの元作りました.
      </p>
      <p>
        批判を覚悟で言いますが,
        <strong>私はFXをゲーム・エンタメとして捉えています.</strong>
      </p>
      <p>
        既にYahooファイナンスやtrading
        viewでこのWebサービスと同じようなことをやっています.
      </p>
      <p>
        既存のサービスとの差別化は,
        <strong>革新的なUI(ユーザーインターフェース)</strong>です.
      </p>

      <p>まだまだβ版なので, 機能に関しては物足りない部分もあると思います.</p>
      <p>需要があり次第拡大していきますので,</p>
      <h2>これから追加する機能</h2>
    </div>
    <v-footer style="padding: 0px">
      <v-card flat tile width="100%" class="red lighten-1 text-center">
        <v-card-text>
          <v-btn text>
            <router-link to="/tos" class="white--text">利用規約</router-link>
          </v-btn>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text class="white--text">
          <strong>&copy; 2020 chachat</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </div>
</template>
<script>
export default {};
</script>