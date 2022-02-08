<template>
  <div class="subOrder">
    <div class="add-nav" v-if="type">
      <div class="add-order">
        <van-button
          plain
          hairline
          type="primary"
          round
          block
          @click="$router.push('allOrder')"
          >所有订单</van-button
        >
      </div>
      <!-- <div class="add-btn" v-if="teacherType == 0">
        <van-button
          plain
          hairline
          type="primary"
          round
          block
          @click="
            showPicker2 = true;
            isBtnStatus = 0;
          "
          >到店</van-button
        >
        <van-button
          plain
          hairline
          type="primary"
          round
          block
          @click="
            showPicker2 = true;
            isBtnStatus = 1;
          "
          >离店</van-button
        >
        <van-popup v-model="showPicker2" position="bottom">
          <van-picker
            show-toolbar
            :columns="equipment"
            @confirm="equipmentToggle"
            @cancel="showPicker2 = false"
          />
        </van-popup>
      </div> -->
      <div class="add-quit">
        <img src="../../../static/quit.png" @click="quit()" alt />
      </div>
    </div>
    <div class="projectDetails-swipe" v-if="list.rotationChart.length">
      <van-swipe @change="onChange" :height="290" :show-indicators="false">
        <van-swipe-item v-for="(el,i) in list.rotationChart" :key="i">
          <img
            :src="el"
            v-if="el.split('.')[el.split('.').length-1]=='jpg'||el.split('.')[el.split('.').length-1]=='png'||el.split('.')[el.split('.').length-1]=='jpeg'"
            alt
            style="width:100%;height:100%;"
            class="swiper-items"
            @click="imagePreview(i)"
          />
          <video
            :src="el"
            :poster="el"
            :ref="'video'+i"
            preload="metadata"
            autoplay
            muted
            loop
            width="100%"
            height="290"
            v-if="el.split('.')[el.split('.').length-1]=='mp4'"
          ></video>
        </van-swipe-item>
        <template #indicator></template>
      </van-swipe>
      <div class="custom-indicator">{{ current + 1 }}/{{list.rotationChart.length}}</div>
    </div>
    <div class="order-name">{{ list.projectName }}</div>
    <div class="form">
      <div class="form-items">
        <div class="form-title">项 目 金 额</div>
        <van-cell-group>
          <van-field
            type="number"
            v-model="projectList.projectMoney"
            placeholder="请输入项目金额"
          />
        </van-cell-group>
      </div>
      <div class="form-items">
        <div class="form-title">项 目 时 长</div>
        <van-cell-group>
          <van-field
            type="digit"
            v-model="projectList.projectTime"
            placeholder="请输入项目时长"
          />
        </van-cell-group>
        <!-- <input
          type="text"
          v-model="projectList.projectTime"
          class="form-items-input"
        /> -->
        <!-- <span class="form-items-tips">分/次</span> -->
      </div>
      <div class="form-items">
        <div class="form-title">项 目 次 数</div>
        <van-cell-group>
          <van-field
            type="digit"
            v-model="projectList.projectNum"
            placeholder="请输入项目次数"
          />
        </van-cell-group>
      </div>
      <div class="form-items">
        <div class="form-title">姓 &nbsp;&nbsp; &nbsp; &nbsp; 名</div>
        <van-cell-group>
          <van-field v-model="projectList.name" placeholder="请输入姓名" />
        </van-cell-group>
      </div>
      <div class="form-items">
        <div class="form-title">手 机 尾 号</div>
        <van-cell-group>
          <van-field
            v-model="projectList.phone"
            type="tel"
            maxlength="4"
            placeholder="请输入手机尾号后4位"
          />
        </van-cell-group>
      </div>
      <div class="form-items">
        <div class="form-title">项 目 优 惠</div>
        <van-cell-group>
          <van-checkbox v-model="projectList.give">送</van-checkbox>
        </van-cell-group>
      </div>
      <div class="form-bg" v-show="projectList.give">
        <div style="margin-bottom: 15px">
          赠送：（须填写项目时长、次数，否则不生效）
        </div>
        <div class="form-items">
          <div class="form-title">项 目 时 长</div>
          <van-cell-group>
            <van-field
              type="digit"
              v-model="projectList.giveEveryTime"
              placeholder="请输入项目时长"
            />
          </van-cell-group>
          <!-- <span class="form-items-tips">分/次</span> -->
        </div>
        <div class="form-items">
          <div class="form-title">项 目 次 数</div>
          <van-cell-group>
            <van-field
              type="digit"
              v-model="projectList.giveTotalTimes"
              placeholder="请输入项目次数"
            />
          </van-cell-group>
        </div>
      </div>
      <div class="form-textarea">
        <div class="form-title">备 注</div>
        <van-cell-group>
          <van-field
            v-model="projectList.remarks"
            rows="3"
            autosize
            type="textarea"
            maxlength="100"
            placeholder="请输入备注"
          />
        </van-cell-group>
      </div>
    </div>
    <div class="form-sub">
      <button @click="subOrder()">下单</button>
    </div>
  </div>
</template>

<script>
import { submitOrder,projectDetails } from "../../api/index/index";
import { Toast,ImagePreview } from "vant";
export default {
  name: 'subOrder',
  data() {
    return {
      OrderName: this.$route.query.projectName,
       type: this.$route.query.type,
      projectList: {
        name: "",
        phone: "",
        projectNum: "",
        projectTime: "",
        projectMoney: "",
        remarks: "",
        give: false,
        giveOrderName: "",
        giveTotalTimes: "",
        giveEveryTime: "",
        giveProjectTime: "",
      },
      teacherType: '',
      list: [],
      current: 0,
    };
  },
  created() {
    document.title = "项目详情";
    this.teacherType =  JSON.parse(localStorage.getItem("userInfo")).teacherType || ""
    this.loading = false;
    projectDetails({ projectId: this.$route.query.projectId }).then(res => {
      this.loading = true;
      if ((res.code === "000000")) {
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
    subOrder() {
      if (!this.projectList.name) {
        Toast.fail("请输入用户姓名");
        return;
      }
      if (!this.projectList.phone) {
        Toast.fail("请输入用户手机号");
        return;
      }
      if (!this.projectList.projectNum) {
        Toast.fail("请输入项目次数");
        return;
      }
      if (!this.projectList.projectTime) {
        Toast.fail("请输入项目时长");
        return;
      }
      if (!this.projectList.projectMoney) {
        Toast.fail("请输入项目金额");
        return;
      }
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let query = {
        orderName: this.$route.query.projectName,
        orderType: 0,
        price: this.projectList.projectMoney,
        totalTimes: this.projectList.projectNum,
        businessId: userInfo.businessId,
        userName: this.projectList.name,
        userPhone: this.projectList.phone,
        everyTime: this.projectList.projectTime,
        projectTime: this.projectList.projectNum * this.projectList.projectTime,
        equipmentId: userInfo.equipmentId,
        remarks: this.projectList.remarks,
      };
      query.give = this.projectList.give ? 1 : 0;
      if (this.projectList.give) {
        (query.giveTotalTimes = this.projectList.giveTotalTimes),
          (query.giveEveryTime = this.projectList.giveEveryTime),
          (query.giveProjectTime =
            this.projectList.giveTotalTimes * this.projectList.giveEveryTime);
      }
      submitOrder(query).then((res) => {
        if (res.code == "000000") {
          Toast.success("购买成功！");
          this.show = true;
        } else {
          Toast.fail(res.msg);
        }
      });
    },
     quitLogin() {
      //退出登录
      localStorage.removeItem("userInfo");
      this.$router.replace("/");
    },
  },
};
</script>

<style socpe>
.swiper-items{
  width: 100%;
  height: auto;
}
.content-search .van-icon {
  font-size: 48px;
}
.subOrder .van-icon {
  font-size: 24px;
  line-height: 40px;
}
.subOrder .van-cell {
  line-height: 60px;
}
.subOrder .van-checkbox__icon {
  font-size: 32px;
}
.subOrder {
  text-align: left;
  padding: 30px;
  /* background-color: #f5f5f5; */
  height: 100vh;
}
.form-bg {
  background-color: #ddd;
  padding: 15px;
  margin: 20px 0;
  border-radius: 20px;
}
/* .form-items {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}
.form-items input {
  width: 300px;
}
.form-items-title {
  display: inline-block;
  width: 160px;
} */
.form-title {
  display: inline-block;
  width: 120px;
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
.form-textarea .van-cell {
  background: rgba(244, 244, 244, 1);
  border-radius: 20px;
  /* line-height: 15px; */
}
.form-textarea .van-cell textarea {
  line-height: 40px;
}
.form-items {
  margin-bottom: 30px;
}
.form-sub {
  margin-top: 150px;
  text-align: center;
}
.form-sub button {
  width: 200px;
  height: 60px;
  background-color: #07c160;
  border: 1px solid #07c160;
  color: #fff;
  transition: opacity 0.2s;
  position: relative;
}
.form-sub button:active::before {
  opacity: 0.1;
}
.form-sub button::before {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background-color: #000;
  border: inherit;
  border-color: #000;
  border-radius: inherit;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  opacity: 0;
  content: " ";
}
.order-name {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  background-color: #ddd;
  padding: 15px 0;
}
.add-nav {
  position: fixed;
  top: 0;
  left: 0;
  background: linear-gradient(
    90deg,
    rgba(111, 111, 111, 1) 0%,
    rgba(65, 65, 65, 1) 100%
  );
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  box-sizing: border-box;
  z-index: 9999;
}
.add-order {
  width: 200px;
  height: 100%;
}
.add-btn {
  display: flex;
  justify-content: space-between;
  width: 300px;
  height: 100%;
}
.add-btn .van-button--block {
  width: 145px;
}
.add-nav .van-button--round {
  border-radius: 20px;
}
.add-nav .van-button::before {
  border-radius: 20px;
}
.add-nav .van-button::after {
  border: 0;
}
.add-quit img {
  width: 50px;
  height: 40px;
  /* border-radius: 50%; */
}
</style>