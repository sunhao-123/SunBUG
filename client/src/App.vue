<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import config from "../package.json";
import { getClientVersion, getServiceVersion } from "./api";
export default {
  mounted() {
    console.clear()
    console.log("%cSUNBUG 音乐聊天室", "color: #CE9178; font-size: 18px");
    console.log(`%c致敬 HAMM BBBUG`, "color: #DCDCAA; font-size: 18px");
    console.log(
      "%cCopyright © 2022 Classmate-Sun",
      "color: #4FB9FE; font-size: 18px"
    );
    console.log("%cClassmate-Sun 孙同学 www.sun0623.top", "color: #B5CEA8; font-size: 18px");
  },
};
</script>

<style lang="less">
.tableboxtop50 {
  position: relative;
  top: -30px;
}
.app{
  height: 100%;
}
</style>
