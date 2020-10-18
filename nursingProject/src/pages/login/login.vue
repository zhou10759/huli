<template>
  <div class="login">
    <div class="login-header">
      <div class="header-btn" v-for="(el,i) in navBar" :key="i">
        <van-button
          @click="toggleIdentity(i)"
          round
          block
          :color="actionIndex===i?'#494949':''"
        >{{el}}</van-button>
      </div>
    </div>
    <div class="login-content">
      <div class="content-form">
        <!-- 顾客登录 -->
        <div class="form-customer" v-show="actionIndex==0">
          <van-form @submit="onCustomerSubmit">
            <van-field
              v-model="customerList.userName"
              name="userName"
              placeholder="请输入姓名"
              :rules="[{ required: true, message: '请填写姓名' }]"
            />
            <van-field
              type="tel"
              v-model="customerList.userPhone"
              name="userPhone"
              placeholder="请输入手机号码"
              :rules="[{ pattern: phoneReg, message: '手机号格式不正确' }]"
            />
            <van-field
              readonly
              clickable
              name="businessId"
              :value="customerList.businessId"
              placeholder="商家选择"
              :rules="[{ required: true, message: '请选择商家' }]"
              @click="getbusinessData(0)"
            />
            <van-popup v-model="showCustomerPicker" position="bottom">
              <van-picker
                show-toolbar
                :loading="loading"
                :columns="business"
                @confirm="customerToggle"
                @cancel="showCustomerPicker = false"
              />
            </van-popup>
            <div class="login-sub">
              <van-button
                color="linear-gradient(to right, #6F6F6F , #414141)"
                round
                block
                native-type="submit"
              >提交</van-button>
            </div>
          </van-form>
        </div>
        <!-- 商家登录 -->
        <div class="form-business" v-show="actionIndex==1">
          <van-form @submit="onBusinessSubmit">
            <van-field
              v-model="customerList.businessId"
              name="password"
              type="password"
              placeholder="请输入商家身份码"
              :rules="[{ required: true, message: '请输入商家身份码' }]"
            />
            <van-field
              readonly
              clickable
              name="businessId"
              :value="businessList.businessName"
              placeholder="商家选择名称"
              :rules="[{ required: true, message: '请选择商家' }]"
              @click="getbusinessData(1)"
            />
            <van-popup v-model="showBusinessPicker" position="bottom">
              <van-picker
                show-toolbar
                :loading="loading"
                :columns="business"
                @confirm="businessToggle"
                @cancel="showBusinessPicker = false"
              />
            </van-popup>
            <div class="login-sub">
              <van-button
                color="linear-gradient(to right, #6F6F6F , #414141)"
                round
                block
                native-type="submit"
              >提交</van-button>
            </div>
          </van-form>
        </div>
        <!-- 老师登录 -->
        <div class="form-teacher" v-show="actionIndex==2">
          <!-- <van-form @submit="onTeacherSubmit"> -->
          <van-field
            v-model="teacherList.userPhone"
            name="userPhone"
            placeholder="请输入老师ID"
            :rules="[{ pattern: phoneReg, message: '老师ID格式错误' }]"
          />
          <van-field
            v-model="teacherList.password"
            name="password"
            type="password"
            placeholder="请输入老师身份码"
            :rules="[{ required: true, message: '请输入老师身份码' }]"
          />
          <Search :businessList="businessData" v-on:changeBusinessVal="changeBusinessVal" />
          <!-- <van-field
              readonly
              clickable
              name="businessId"
              :value="teacherList.business"
              placeholder="商家选择"
              @click="showTeacherPicker1 = true"
            />
            <van-popup v-model="showTeacherPicker1" position="bottom">
              <van-picker
                show-toolbar
                :columns="business"
                @confirm="teacherBusinessToggle"
                @cancel="showTeacherPicker1 = false"
              />
          </van-popup>-->
          <!-- <van-field
              readonly
              clickable
              name="equipmentId"
              :value="teacherList.equipmentId"
              placeholder="设备ID显示选择"
              @click="openEquipmentList"
            />
            <van-popup v-model="showTeacherPicker2" position="bottom">
              <van-picker
                show-toolbar
                :columns="equipmentList"
                @confirm="teacherEquipmentToggle"
                @cancel="showTeacherPicker2 = false"
                :loading="teacherPickerLoading"
              />
          </van-popup>-->
          <div class="login-sub btn1">
            <van-button
              color="linear-gradient(to right, #6F6F6F , #414141)"
              round
              block
              @click="onTeacherSubmit"
            >提交</van-button>
          </div>
          <div class="login-sub btn2">
            <van-button
              color="linear-gradient(to right, #6F6F6F , #414141)"
              round
              block
              @click="jumpEquipment"
            >添加设备</van-button>
          </div>
          <!-- </van-form> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  businessList,
  equipmentList,
  login,
  orderUser,
  getOpenId,
} from "../../api/index/index";
import getQueryString from "../../utils/getQeury";
import { Toast } from "vant";
import Search from "../../components/Search";
export default {
  components: { Search },
  data() {
    return {
      navBar: ["顾客", "商家", "老师"],
      actionIndex: 0,
      customerList: {
        userName: "",
        userPhone: "",
        type: "",
        businessId: "",
      },
      businessList: {
        businessName: "",
        businessId: "",
      },
      teacherList: {
        userPhone: "",
        password: "",
        businessId: "",
        type: 2,
        // equipmentId: ""
      },
      showCustomerPicker: false,
      showBusinessPicker: false,
      showTeacherPicker1: false,
      showTeacherPicker2: false,
      business: [],
      businessData: [],
      equipmentList: [],
      equipmentListData: [],
      teacherPickerLoading: true,
      phoneReg: /^1[3456789]\d{9}$/,
      businessId: "",
      loading: true,
      openId: "",
    };
  },
  created() {
    document.title = "登录";
    if (this.actionIndex == 2) {
      this.getbusinessList();
    }
  },
  methods: {
    getbusinessData(logo) {
      let data = {};
      if (
        logo == 0 &&
        !this.customerList.userName &&
        !this.customerList.userPhone
      ) {
        Toast.fail("请输入完整内容");
        return;
      } else if (logo == 1 && !this.customerList.businessId) {
        Toast.fail("请输入完整内容");
        return;
      }
      if (logo == 0) {
        data = {
          type: 0,
          userName: this.customerList.userName,
          userPhone: this.customerList.userPhone,
        };
        this.showCustomerPicker = true;
      } else if (logo == 1) {
        data = {
          type: 1,
          password: this.customerList.businessId,
        };
        this.showBusinessPicker = true;
      }
      orderUser(data).then((res) => {
        this.loading = false;
        if (res.code == "000000") {
          this.businessData = res.data.length > 0 ? res.data : [];
          this.business =
            res.data.length > 0 ? res.data.map((el) => el.businessName) : [];
        }
      });
    },
    changeBusinessVal(val) {
      this.$set(this.teacherList, "businessId", val);
      // this.businessId = val;
      // return val;
    },
    openEquipmentList() {
      let businessId = "";
      if (this.teacherList.business) {
        this.showTeacherPicker2 = true;
        this.businessData.map((el, i) => {
          if (el.businessName === this.teacherList.business) {
            businessId = el.businessId;
          }
        });
        this.getEquipmentList({ businessId, type: 1 });
      } else {
        Toast.fail("请先选择商家");
      }
    },
    formatData(type, data) {
      let newData = JSON.parse(JSON.stringify(data));
      console.log("newData", newData);
      if (type === 1) {
        //顾客
        newData.type = 0;
        // newData.openId = this.openId;
        this.businessData.map((el, i) => {
          if (el.businessName === newData.businessId) {
            newData.businessId = el.businessId;
          }
        });
        return newData;
      } else if (type === 2) {
        //顾客
        newData.type = 1;
        this.businessData.map((el, i) => {
          if (el.businessName === newData.businessId) {
            newData.businessId = el.businessId;
          }
        });
        return newData;
      } else if (type === 3) {
        // newData.type = 2;
        // console.log("老师登录————————", this.teacherList);
        return;
        // this.businessData.map((el, i) => {
        //   if (el.businessName === newData.businessId) {
        //     newData.businessId = el.businessId;
        //   }
        // });
        // let list = this.changeBusinessVal();
        // newData.businessId = this.changeBusinessVal();
        return newData;
      }
    },
    getbusinessList() {
      businessList().then((res) => {
        if (res.code == "000000") {
          this.businessData = res.data.length > 0 ? res.data : [];
          this.business =
            res.data.length > 0 ? res.data.map((el) => el.businessName) : [];
        }
      });
    },
    getEquipmentList(data) {
      equipmentList(data).then((res) => {
        if (res.code == "000000") {
          this.equipmentListData = res.data.length > 0 ? res.data : [];
          this.equipmentList =
            res.data.length > 0 ? res.data.map((el) => el.equipmentId) : [];
          this.teacherPickerLoading = false;
        }
      });
    },
    toggleIdentity(i) {
      this.actionIndex = i;
      this.customerList = {
        name: "",
        phone: "",
        business: "",
      };
      this.businessList = {
        businessName: "",
        businessId: "",
      };
      this.teacherList = {
        userPhone: "",
        password: "",
        businessId: "",
        type: 2,
        // equipmentId: ""
      };
      if (i == 2) {
        this.getbusinessList();
      }
    },
    customerToggle(value) {
      this.$set(this.customerList, "businessId", value);
      this.showCustomerPicker = false;
    },
    businessToggle(value) {
      // this.value = value;
      this.$set(this.businessList, "businessName", value);
      this.showBusinessPicker = false;
    },
    teacherBusinessToggle(value) {
      // this.value = value;
      this.$set(this.teacherList, "business", value);
      this.showTeacherPicker1 = false;
    },
    teacherEquipmentToggle(value) {
      // this.value = value;
      this.$set(this.teacherList, "equipmentId", value);
      this.showTeacherPicker2 = false;
    },
    async onCustomerSubmit(values) {
      // 顾客登录
      let that = this;
      // let { code, data } = await getOpenId({
      //   code: sessionStorage.getItem("code"),
      // });
      // let isOverdue = false;
      // if (code == "000000") {
      //   this.openId = data;
        // isOverdue = false;
        login(this.formatData(1, values)).then((res) => {
          if (res.code === "000000") {
            localStorage.setItem("userInfo", JSON.stringify(res.data.userInfo));
            Toast.success({
              duration: 500,
              message: "登录成功",
              onClose: function () {
                that.$router.push("customerPage");
              },
            });
          } else {
            Toast.fail(res.msg);
          }
        });
      // } else if (code == "000001") {
      //   // isOverdue = true;
      //   Toast.fail("code已过期，立即重新获取");
      //   setTimeout(
      //      function () {
      //       window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2902d0ead8bf9e42&redirect_uri=${encodeURIComponent(
      //         window.location.href == "http://localhost:8080/#/"
      //           ? "http://massage.1mmkj.com/massage/#/"
      //           : "http://massage.1mmkj.com/massage/#/"
      //       )}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
      //     },
      //     1000
      //   );
      // }
      // if (isOverdue) {
      //   return;
      // }
      // return;
      // values.openId = sessionStorage.getItem("openId",openId)
      // this.$router.push("customerPage");
    },
    onBusinessSubmit(values) {
      // 商家登录
      let that = this;
      login(this.formatData(2, values)).then((res) => {
        if (res.code === "000000") {
          localStorage.setItem("userInfo", JSON.stringify(res.data.userInfo));
          Toast.success({
            duration: 500,
            message: "登录成功",
            onClose: function () {
              that.$router.push("businessPage");
            },
          });
          // setTimeout(() => {
          //   that.$router.push("businessPage");
          // }, 500);
        } else {
          Toast.fail(res.msg);
        }
      });
      // this.$router.push("businessPage");
    },
    onTeacherSubmit(values) {
      // 老师登录
      let that = this;
      if (!this.teacherList.userPhone) {
        Toast.fail("手机号码有误！");
        return;
      }
      if (!this.teacherList.password) {
        Toast.fail("密码有误！");
        return;
      }
      if (!this.teacherList.businessId) {
        Toast.fail("商家名有误！");
        return;
      }
      login(this.teacherList).then((res) => {
        if (res.code === "000000") {
          localStorage.setItem("userInfo", JSON.stringify(res.data.userInfo));
          // Toast.success("登录成功！");
          Toast.success({
            duration: 500,
            message: "登录成功",
            onClose: function () {
              that.$router.push("teacher");
            },
          });
          // setTimeout(() => {
          //   that.$router.push("teacher");
          // }, 500);
        } else {
          Toast.fail(res.msg);
        }
      });
    },
    jumpEquipment() {
      this.$router.push("addEquipment");
    },
  },
};
</script>

<style  scope>
.login .van-field__body {
  height: 90%;
}
/* .van-cell{
  line-height: ;
} */
.login {
  margin-top: 60px;
}
.login .van-cell {
  height: 150px;
  line-height: 150px;
}
.login-header {
  padding: 0 175px;
}
.header-btn {
  height: 80px;
  margin-bottom: 40px;
  font-size: 32px;
}
.header-btn .van-button--round {
  border-radius: 20px;
  box-shadow: 0px 2px 7px 0px rgba(0, 0, 0, 0.31);
}
.login-content {
  padding: 0 50px;
}
.form-customer .login-sub {
  margin: 160px 16px 0 16px;
}
.form-business .login-sub {
  margin: 300px 16px 0 16px;
}
.form-teacher .btn1 {
  margin: 80px 16px 0 16px;
}
.form-teacher .btn2 {
  margin: 40px 16px 0 16px;
}
.login-sub {
  height: 100px;
  font-size: 36px;
  font-weight: 600;
}
</style>