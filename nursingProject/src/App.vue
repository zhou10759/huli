<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { Toast } from "vant";
import { getOpenId } from "./api/index/index";
import getQueryString from "./utils/getQeury";
export default {
  name: "App",
  created() {
    // let code = getQueryString("code");
    // // console.log("asdasd",window.location.href)
    // if (code == null || code === "") {
    //   // console.log("asdasd",code)
    //   window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2902d0ead8bf9e42&redirect_uri=${encodeURIComponent(
    //     window.location.href == "http://localhost:8080/#/"? 'http://massage.1mmkj.com/massage/#/': window.location.href
    //   )}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
    // } else {
    //   // this.getOpenId()
    //   sessionStorage.setItem("code",code)
    // }
    // console.log(localStorage.getItem("userInfo"));
    // if (localStorage.getItem("userInfo")) {
    //   let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    //   Toast.success("登录中...");
    //   if (userInfo.type === 0) {
    //     this.$router.push("customerPage");
    //   } else if (userInfo.type === 1) {
    //     this.$router.push("businessPage");
    //   } else if (userInfo.type === 2) {
    //     this.$router.push("teacher");
    //   }
    // } else {
    //   this.$router.push("/");
    // }
  }
};
</script>

<style>
.van-dialog {
  width: 500px !important;
  min-height: 200px !important;
  /* position: relative; */
}
/* .van-dialog__header {
  line-height: 64px;
}
.van-dialog__content {
  height: 100px; 
 } */
.van-dialog__message {
  line-height: 40px !important;
  font-size: 28px !important;
}
/* .van-dialog__footer--buttons {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 80px;
} */
* {
  font-size: 28px;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
#app .van-picker__title {
  font-size: 32px;
}
#app .van-picker__cancel,
#app .van-picker__confirm {
  /* padding: 0 10px; */
  font-size: 32px;
}
.van-cell:not(:last-child)::after {
  border-bottom: 2px solid #dedede;
}
#app .van-field__control {
  height: 100%;
}
#app .van-button--block {
  height: 100%;
}
.van-cell {
  height: 138px;
}
.van-field__body {
  height: 100%;
}
.van-button--block {
  height: 100%;
}
.line {
  height: 30px;
  width: 100%;
  background-color: #f8f8f8;
}
.van-toast {
  min-width: 200px;
  min-height: 80px;
}
.content-search /deep/ .van-icon {
  font-size: 48px;
}
.business .header-equipment /deep/ .van-icon {
  font-size: 24px;
  line-height: 40px;
}
.business .header-equipment /deep/ .van-cell {
  line-height: 60px;
}
</style>
