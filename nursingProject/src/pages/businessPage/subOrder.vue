<template>
  <div class="subOrder">
    <div class="form">
      <div class="form-items">
        <span class="form-items-title">项目金额：</span>
        <input
          type="text"
          v-model="projectList.projectMoney"
          class="form-items-input"
        />
        <span class="form-items-tips">元</span>
      </div>
      <div class="form-items">
        <span class="form-items-title">项目时长：</span>
        <input
          type="text"
          v-model="projectList.projectTime"
          class="form-items-input"
        />
        <span class="form-items-tips">分/次</span>
      </div>
      <div class="form-items">
        <span class="form-items-title">项目次数：</span>
        <input
          type="text"
          v-model="projectList.projectNum"
          class="form-items-input"
        />
        <span class="form-items-tips">次</span>
      </div>
      <div class="form-items">
        <span class="form-items-title">姓名：</span>
        <input
          type="text"
          v-model="projectList.name"
          class="form-items-input"
        />
        <span class="form-items-tips"></span>
      </div>
      <div class="form-items">
        <span class="form-items-title">手机号：</span>
        <input
          type="text"
          v-model="projectList.phone"
          class="form-items-input"
        />
        <span class="form-items-tips"></span>
      </div>
      <div class="form-bg">
        <div style="margin-bottom: 15px">赠送：（须填写项目时长、次数，否则不生效）</div>
        <div class="form-items">
          <span class="form-items-title">项目时长：</span>
          <input
            type="text"
            v-model="projectList.giveEveryTime"
            class="form-items-input"
          />
          <span class="form-items-tips">分/次</span>
        </div>
        <div class="form-items">
          <span class="form-items-title">项目次数：</span>
          <input
            type="text"
            v-model="projectList.giveTotalTimes"
            class="form-items-input"
          />
          <span class="form-items-tips">次</span>
        </div>
      </div>
      <div class="form-items">
        <span class="form-items-title">备注：</span>
        <textarea
          v-model="projectList.remarks"
          name=""
          id=""
          cols="30"
          rows="4"
        ></textarea>
      </div>
    </div>
    <div class="form-sub">
      <button @click="subOrder()">下单</button>
    </div>
  </div>
</template>

<script>
import { submitOrder } from "../../api/index/index";
import { Toast } from "vant";
export default {
  data() {
    return {
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
    };
  },
  methods: {
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
        remarks: this.projectList.remarks
      };
      if(this.projectList.giveTotalTimes&&this.projectList.giveEveryTime){
        query.give = 1;
        query.giveTotalTimes =this.projectList.giveTotalTimes,
        query.giveEveryTime = this.projectList.giveEveryTime,
        query.giveProjectTime =  this.projectList.giveTotalTimes * this.projectList.giveEveryTime
      }else{
         query.give = 0;
      }
      submitOrder(query).then((res) => {
          if (res.code == "000000") {
            Toast.success("购买成功！");
            this.show = true;
          } else {
            Toast.fail(res.msg);
          }
        })
    }
  }
};
</script>

<style socpe>
.subOrder {
  text-align: left;
  padding: 30px;
  background-color: #f5f5f5;
  height: 100vh;
}
.form-bg {
  background-color: #ddd;
  padding: 15px;
  margin: 20px 0;
  border-radius: 20px;
}
.form-items {
  margin-bottom: 20px;
}
.form-items-title {
  display: inline-block;
  width: 160px;
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
</style>