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
        まだβ版なので, 使用者が多い<u
          >iPhone6, iPhone7, iPhone8, PCでの利用を想定しています.</u
        >
      </p>
      <p>
        これ以外の端末だと使いにくいかもしれないです.
        需要があり次第改善していきます.
      </p>
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