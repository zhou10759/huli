<template>
  <div class="customer">
    <div class="customer-header">
      <div class="header-left">顾客姓名：{{userInfo.userName}}</div>
      <div class="header-header-right">
        <van-button
          color="linear-gradient(to right, #6F6F6F , #414141)"
          round
          block
          @click="quitLogin"
        >退出登陆</van-button>
      </div>
    </div>
    <div class="header-equipment">
      <span>设 备：</span>
      <van-field
        readonly
        clickable
        is-link
        name="picker"
        :value="equipmentId"
        placeholder="选择设备"
        @click="showEquipmentPicker = true"
      />
      <van-popup v-model="showEquipmentPicker" position="bottom">
        <van-picker
          title="选择设备"
          show-toolbar
          :columns="equipment"
          @confirm="equipmentToggle"
          @cancel="showEquipmentPicker = false"
        />
      </van-popup>
    </div>
    <div class="line"></div>
    <div class="customer-order">
      <div class="order-header">
        <div
          :class="activeNav===i? 'active_nav':''"
          v-for="(el,i) in ['已消耗','未消耗']"
          :key="i"
          @click="toggleActiveNav(i)"
        >{{el}}</div>
      </div>
      <div class="order-list">
        <div
          :class="'list-items '+(activeNav ? ( el.selected?'selected' :'no_selected'): '')"
          v-for="(el,i) in orderList"
          :key="i"
          @click="selectedView(i)"
        >
          <div class="items-left">
            <div class="items-name">{{el.orderName}}</div>
            <div class="items-money">套餐金额：{{el.price}}元</div>
            <div class="items-type">{{el.orderType =="0" ? "固定模式":"自定义模式"}}</div>
          </div>
          <div class="items-right">
            <div class="items-frequency">次数：{{el.times }}/{{el.totalTimes}}</div>
            <div class="items-date">{{el.createTime }}</div>
            <div style="float:right;"><van-tag type="danger" v-if="el.parentId!=0">送</van-tag></div>
            <!-- <div class="items-operation" v-show="activeNav===1"    @click.stop="operationEquipment(el,0)">
              <Debounce :time="300" isDebounce>
                <van-button
                  color="linear-gradient(to right, #6F6F6F , #414141)"
                  round
                  block
                  @click="operationEquipment(el,0)"
                >我要美力</van-button>
              </Debounce>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-btn">
      <div class="bottom-btn-view">
        <van-button
          color="linear-gradient(to right, #6F6F6F , #414141)"
          round
          block
          @click="operationEquipment(el,1)"
        >我要美力</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  userOrder,
  sendOrder,
  equipmentListByUser
} from "../../api/index/index";
import { Toast, Dialog } from "vant";

export default {
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      activeNav: 0,
      orderList: [],
      showEquipmentPicker: false,
      equipmentId: "",
      equipment: [],
      equipmentData: []
    };
  },
  created() {
    document.title = "订单详情";
    this.getUserOrder();
    this.getEquipmentList();
    // this.getProjectList(0);
    // console.log(api);
  },
  methods: {
    selectedView(i) {
      //选中view
      if (!this.activeNav) return;
      this.$set(this.orderList[i], "selected", !this.orderList[i].selected);
    },
    getEquipmentList() {
      equipmentListByUser({
        businessId: this.userInfo.businessId,
        type: 1
      }).then(res => {
        if (res.code == "000000" && res.data.length > 0) {
          this.equipmentId = res.data[0].equipmentId;
          this.equipment = res.data.map(el => el.equipmentId);
          this.equipmentData = res.data;
          // res.data.map(el => {
          //   if (el.equipmentId == this.userInfo.equipmentId) {
          //     this.remainingTime = el.surplusTime;
          //   }
          // });
        }
      });
    },
    equipmentToggle(val) {
      this.equipmentId = val;
      // this.$set(this.userInfo, "equipmentId", val);
      // this.equipmentData.map(el => {
      //   if (el.equipmentId == val) {
      //     this.remainingTime = el.surplusTime;
      //   }
      // });
      // localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
      // this.equipmentVal = val;
      this.showEquipmentPicker = false;
    },
    operationEquipment(arr, status) {
      let that = this;
      let selectedNum = 0;
      this.orderList.map(items => {
        if (items.selected) {
          selectedNum++;
        }
      });
      console.log("this.orderList", this.orderList, selectedNum);
      if ((status == 1 && selectedNum == 0) || this.activeNav == 0) {
        Toast.fail("请选择要美力的套餐！");
        return;
      }
      Dialog.confirm({
        title: "提示",
        message: "是否开始美力"
      })
        .then(() => {
          // on confirm
          if (!that.equipmentId) {
            Toast.fail("未选择设备！");
            return;
          }
          let data = {};
          console.log(status);
          if (status == 0) {
            data = {
              numberId: arr.numberId,
              orderId: arr.orderId,
              everyTime: arr.everyTime,
              equipmentId: that.equipmentId
            };
          } else if (status == 1) {
            let list = this.orderList.filter(items=>items.selected);
            let totalTime = 0;
            list.map(items => {
              totalTime += items.everyTime;
            });
            data = {
              numberId: list.filter(items => items.selected).map(items=>items.numberId).join(","),
              orderId: list[0].orderId,
              everyTime: totalTime,
              equipmentId: that.equipmentId
            };
            // debugger;
            // console.log("______________________________", data);
            // return;
          }
          sendOrder(data).then(res => {
            if (res.code == "000000") {
              Toast.success("美力开始！");
              that.getUserOrder();
            } else if (res.code == "000001") {
              Toast.fail("当前设备正在使用，请等待！");
            } else {
              Toast.fail(res.msg);
            }
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    getUserOrder() {
      // const toast = Toast.loading({
      //   duration: 0, // 持续展示 toast
      //   forbidClick: true,
      //   message: "加载中...."
      // });
      userOrder({
        userName: this.userInfo.userName,
        userPhone: this.userInfo.userPhone,
        businessId: this.userInfo.businessId
      }).then(res => {
        // Toast.clear();
        if ((res.code = "000000")) {
          console.log("asdasddasasdasdasdasdsda", this.activeNav, res.data);
          if (this.activeNav == 0) {
            res.data.consumed.map(items => (items.selected = false));
            this.orderList = res.data.consumed || [];
          } else {
            res.data.notConsumed.map(items => (items.selected = false));
            this.orderList = res.data.notConsumed || [];
          }
        }
      });
    },
    quitLogin() {
      //退出登录
      localStorage.removeItem("userInfo");
      this.$router.replace("/")
      //  window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2902d0ead8bf9e42&redirect_uri=${encodeURIComponent(
      //     window.location.href == "http://localhost:8080/#/"
      //       ? "http://massage.1mmkj.com/massage/#/"
      //       : "http://massage.1mmkj.com/massage/#/"
      //   )}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
    },
    toggleActiveNav(i) {
      this.activeNav = i;
      this.getUserOrder();
    }
  }
};
</script>
<style scope>
.customer .van-tag{
  padding: 6px 14px;
  font-size: 24px;
  border-radius: 30px;
}
.bottom-btn {
  height: 100px;
  width: 100%;
  border-top: 2px solid #999;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 30px;
  box-sizing: border-box;
}
.bottom-btn-view {
  height: 80px;
  width: 200px;
  /* float: right;
  line-height: 100px; */
}
.customer{
  padding-bottom: 100px;
}
.customer .header-equipment .van-cell {
  height: 100%;
  width: 330px;
  border: 1px solid rgba(217, 217, 217, 1);
}
.customer .header-equipment .van-icon {
  font-size: 24px;
  line-height: 40px;
}
.customer .header-equipment {
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  padding: 21px 30px;
  height: 60px;
  text-align: left;
}
.customer .header-equipment .van-cell {
  line-height: 60px;
}
.customer .header-equipment > span {
  /* display: inline-block; */
  text-align-last: justify;
  -moz-text-align-last: justify; /*兼容firefox*/
  text-align: justify;
  text-justify: distribute-all-lines; /*兼容ie*/
  display: block; /*ie下需设为block*/
  min-width: 150px;
}
.customer {
}
.customer .customer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 21px 30px;
}
.header-left {
  font-size: 30px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(73, 73, 73, 1);
  text-align: left;
}
.header-header-right {
  width: 150px;
  height: 60px;
}
.customer-order {
  padding: 0 50px;
}
.order-header {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100px;
  border-bottom: 2px solid #f5f5f5;
}
.order-header > div {
  font-size: 30px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(151, 151, 151, 1);
  height: 100%;
  line-height: 100px;
}
.order-header > .active_nav {
  color: #494949;
  border-bottom: 4px solid #494949;
}
.no_selected::before {
  content: "";
  height: 30px;
  width: 30px;
  position: absolute;
  left: -40px;
  border-radius: 50%;
  border: 2px solid #999;
}
.selected::before {
  content: "";
  height: 30px;
  width: 30px;
  position: absolute;
  left: -40px;
  border-radius: 50%;
  background-image: url("../../../static/xuanzhong.png");
  background-size: 100% 100%;
  border: 0;
}
.list-items {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 0;
  border-bottom: 2px solid #f5f5f5;
}
.items-left {
  box-sizing: border-box;
  width: 380px;
  min-height: 190px;
  background: rgba(66, 66, 66, 1);
  border-radius: 10px;
  padding: 30px;
}
.items-left .items-name {
  text-align: left;
  font-size: 24px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: rgba(255, 255, 255, 1);
}
.items-left .items-money {
  text-align: left;
  font-size: 20px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  margin: 20px 0;
}
.items-left .items-type {
  text-align: left;
  font-size: 20px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}
.items-frequency {
  text-align: right;
  font-size: 24px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(102, 102, 102, 1);
  /* margin-bottom: 22px; */
}
.items-date {
  text-align: right;
  font-size: 20px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  margin: 22px 0 30px 0;
}
.items-operation {
  width: 180px;
  height: 60px;
}
.van-toast {
  min-width: 300px;
  min-height: 150px;
}
.van-toast div {
  line-height: 50px;
}
.customer .van-button--round {
  border-radius: 8px;
}
</style>