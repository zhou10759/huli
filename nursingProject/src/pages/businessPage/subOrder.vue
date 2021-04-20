<template>
  <div class="subOrder">
    <div class="order-name">{{OrderName}}</div>
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
            :disabled="teacherType === 1"
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
      <div class="form-bg">
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
      <div class="form-items">
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
import { submitOrder } from "../../api/index/index";
import { Toast } from "vant";
export default {
  data() {
    return {
      OrderName: this.$route.query.projectName,
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
        remarks: this.projectList.remarks,
      };
      if (this.projectList.giveTotalTimes && this.projectList.giveEveryTime) {
        query.give = 1;
        (query.giveTotalTimes = this.projectList.giveTotalTimes),
          (query.giveEveryTime = this.projectList.giveEveryTime),
          (query.giveProjectTime =
            this.projectList.giveTotalTimes * this.projectList.giveEveryTime);
      } else {
        query.give = 0;
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
  },
};
</script>

<style socpe>
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
.order-name{
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  background-color: #ddd;
  padding: 15px 0;
}
</style>