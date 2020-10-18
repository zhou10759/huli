<template>
  <div class="projectDetails" v-if="loading">
    <div class="projectDetails-swipe">
      <van-swipe @change="onChange" :height="290" :show-indicators="false">
        <van-swipe-item v-for="(el,i) in list.rotationChart" :key="i">
          <img
            :src="el"
            v-show="el.split('.')[el.split('.').length-1]=='jpg'||el.split('.')[el.split('.').length-1]=='png'||el.split('.')[el.split('.').length-1]=='jpeg'"
            alt
            class="swiper-items"
            @click="imagePreview(i)"
          />
          <video
            :src="el"
            :ref="'video'+i"
            preload="metadata"
            muted
            loop
            width="100%"
            height="290"
            v-show="el.split('.')[el.split('.').length-1]=='mp4'"
          ></video>
        </van-swipe-item>
        <template #indicator></template>
      </van-swipe>
      <div class="custom-indicator">{{ current + 1 }}/{{list.rotationChart.length}}</div>
    </div>
    <div class="projectDetails-desc">
      <!-- <div class="desc-title">{{list.projectName }}</div> -->
      <div class="desc-content" v-html="list.text"></div>
    </div>
    <div class="line"></div>
    <div class="project-message">
      <div class="message-items">
        <span class="items-title">项 目 名 称 ：</span>
        <span>{{list.projectName}}</span>
      </div>
      <div class="message-items">
        <span class="items-title">金 &nbsp;&nbsp; &nbsp; &nbsp;额：</span>
        <span>{{list.price }}￥</span>
      </div>
      <div class="message-items">
        <span class="items-title">时 &nbsp;&nbsp; &nbsp; &nbsp;长：</span>
        <span>{{list.everyTimes }}分钟/次</span>
      </div>
      <div class="message-items">
        <span class="items-title">次&nbsp;&nbsp; &nbsp; &nbsp; 数：</span>
        <span>{{list.totalTimes }}次</span>
      </div>
    </div>
    <div class="line"></div>
    <div class="project-form">
      <div class="form-items">
        <div class="form-title">姓 &nbsp;&nbsp; &nbsp; &nbsp;名</div>
        <van-cell-group>
          <van-field v-model="name" placeholder="请输入姓名" />
        </van-cell-group>
      </div>
      <div class="form-items">
        <div class="form-title">手 机 尾 号</div>
        <van-cell-group>
          <van-field type="tel" v-model="phone" maxlength="4" placeholder="请输入手机尾号后4位" />
        </van-cell-group>
      </div>
    </div>
    <div class="project-sub">
      <van-button
        color="linear-gradient(to right, #6F6F6F , #414141)"
        round
        block
        @click="nowPay"
      >立即购买</van-button>
    </div>
    <van-overlay :show="show" @click="hienToast">
      <div class="wrapper" @click.stop>
        <div class="block">
          <div class="block-header">
            <div class="block-header-title">支付成功</div>
            <img src="../../../static/chose.png" alt @click="hienToast" />
          </div>
          <div class="block-content">
            <div class="block-content-items">
              <span class="block-content-items-title">顾客姓名：</span>
              <span>{{name}}</span>
            </div>
            <div class="block-content-items">
              <span class="block-content-items-title">项&nbsp;目&nbsp;名：</span>
              <span>{{list.projectName}}</span>
            </div>
            <div class="block-content-items">
              <span class="block-content-items-title">时&nbsp;&nbsp;长：</span>
              <span>{{list.everyTimes}}分钟/次</span>
            </div>
            <div class="block-content-items">
              <span class="block-content-items-title">次&nbsp;&nbsp;数：</span>
              <span>{{list.totalTimes}}次</span>
            </div>
            <div class="block-content-items">
              <span class="block-content-items-title">支付金额：</span>
              <span>{{list.price}}￥</span>
            </div>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>
<script>
import { projectDetails, submitOrder } from "../../api/index/index";
import { Dialog, ImagePreview, Toast } from "vant";
// import { ImagePreview } from 'vant';
export default {
  data() {
    return {
      current: 0,
      list: {
        //         swiperList: [
        //           require("../../../static/1.jpg"),
        //           require("../../../static/1.jpg"),
        //           require("../../../static/1.jpg")
        //         ],
        //         name: "激光美容方式",
        //         desc: `<p>
        //   强脉冲光（IPL）&nbsp;</p><p>强脉冲光主要用于减少油脂分泌，治疗毛细血管扩张以及维护皮肤角质。采用强脉冲光治疗白头粉刺一般需要3次以上，治疗周期为一个月。并且强脉冲光有嫩肤的功效，消除粉刺的同时还能皮肤更加细嫩。&nbsp;</p><p>帕罗玛晶钻光&nbsp;</p><p>帕罗玛1540点阵激光主要用于减少油脂分泌，缩小毛孔，激发胶原蛋白增生。采用帕罗玛1540一般需要治疗3次以上，治疗时间间隔也是一个月。根据具体情况采用不一样的激光方式。
        // </p>`,
        //         projectName: "全员护理-面部-去黑头-女性",
        //         projectMoney: 2000,
        //         projectDate: 45,
        //         projectNumber: 1
      },
      name: "",
      phone: "",
      show: false,
      loading: false,
      autoplay: false
    };
  },
  created() {
    document.title = "项目详情";
    this.loading = false;
    projectDetails({ projectId: this.$route.query.projectId }).then(res => {
      this.loading = true;
      if ((res.code = "000000")) {
        res.data.rotationChart = res.data.rotationChart
          ? res.data.rotationChart.split(",")
          : [];
        res.data.rotationChart.push(
          ...(res.data.rotationVideo ? res.data.rotationVideo.split(",") : "")
        );
        console.log("res.data.rotationChart", res.data.rotationChart);
        console.log(res.data);
        this.list = res.data;
      }
    });
  },
  methods: {
    hienToast() {
      this.show = false;
      this.name = "";
      this.phone = "";
    },
    onChange(index) {
      this.current = index;
      // let key = 'video'+index;
      // console.log( this.$refs[key])
      // if (
      //   this.list.rotationChart[index].split(".")[this.list.rotationChart[index].split(".").length - 1] == "mp4"
      // ) {
      //   // var video = document.getElementById("video"+index);
      //   // console.log(video)
      //   this.$refs[key][0].play();
      // } else {
      //   console.log("不是视频")
      //   //  var video = document.getElementById("video");
      //    this.$refs[key][0].pause();
      // }
    },
    imagePreview(i) {
      ImagePreview({
        images: this.list.rotationChart,
        startPosition: i
      });
    },
    nowPay() {
      if (!this.name) {
        Toast.fail("请输入用户姓名");
        return;
      }
      if (!this.phone) {
        Toast.fail("请输入用户手机号");
        return;
      }
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      submitOrder({
        orderName: this.list.projectName,
        orderType: 0,
        price: this.list.price,
        totalTimes: this.list.totalTimes,
        businessId: userInfo.businessId,
        userName: this.name,
        userPhone: this.phone,
        everyTime: this.list.everyTimes,
        projectTime: this.list.totalTimes * this.list.everyTimes,
        equipmentId: userInfo.equipmentId
      }).then(res => {
        if (res.code == "000000") {
          Toast.success("购买成功！");
          this.show = true;
        } else {
          Toast.fail(res.msg);
        }
      });
    }
  }
};
</script>
<style  scoped>
.projectDetails {
  background-color: #f8f8f8;
}
.custom-indicator {
  z-index: 999;
  position: absolute;
  right: 20px;
  bottom: 20px;
  padding: 8px 20px;
  font-size: 12px;
  color: rgba(255, 255, 255, 1);
  background: rgba(0, 0, 0, 0.27);
  border-radius: 30px;
}
.projectDetails-swipe {
  background-color: #fff;
}
.projectDetails-swipe,
.swiper-items {
  height: 580px;
  width: 100%;
  position: relative;
}
.projectDetails {
  text-align: left;
}
.projectDetails-desc,
.project-message,
.project-form {
  padding: 30px;
  background-color: #ffffff;
}
.desc-title {
  font-size: 32px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: rgba(73, 73, 73, 1);
}
.items-title,
.form-title {
  display: inline-block;
  width: 160px;
  font-size: 24px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: rgba(51, 51, 51, 1);
  margin-bottom: 30px;
  /* text-align: justify;
  text-align-last: justify; */
  text-align-last: justify;
  -moz-text-align-last: justify; /*兼容firefox*/
  text-align: justify;
  text-justify: distribute-all-lines; /*兼容ie*/
}
.form-items .van-cell {
  height: 80px;
  background: rgba(244, 244, 244, 1);
  border-radius: 20px;
}
.form-items {
  margin-bottom: 30px;
}
.project-sub {
  margin: 50px auto;
  width: 650px;
  height: 100px;
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 650px;
  min-height: 420px;
  padding: 30px;
  border-radius: 24px;
  box-sizing: border-box;
  background-color: #fff;
}
.block-header {
  display: flex;
  justify-content: center;
  /* align-items: center; */
  height: 60px;
  position: relative;
  border-bottom: 1px solid #dfdfdf;
}
.block-header-title {
  font-size: 32px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: rgba(51, 51, 51, 1);
}
.block-header img {
  width: 25px;
  height: 25px;
  position: absolute;
  right: 0px;
  top: 0px;
}
.block-content-items {
  margin-top: 30px;
}
.block-content-items-title {
  display: inline-block;
  width: 120px;
  font-size: 24px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: rgba(51, 51, 51, 1);
  /* text-align: justify;
  text-align-last: justify; */
  text-align-last: justify;
  -moz-text-align-last: justify; /*兼容firefox*/
  text-align: justify;
  text-justify: distribute-all-lines; /*兼容ie*/
}
.projectDetails .van-field__body {
  height: 100%;
}
</style>