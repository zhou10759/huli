<template>
  <div class="distribution">
    <div class="distribution-nav">
      <div class="distribution-order">
        <van-button
          plain
          hairline
          type="primary"
          round
          block
          @click="addTeacher()"
          >添加老师</van-button
        >
      </div>
      <div class="distribution-quit">
        <img src="../../../static/quit.png" @click="quit()" alt />
      </div>
    </div>
    <div class="line"></div>
    <div class="order-list">
      <div class="order-items" v-for="(el, i) in teacherList" :key="i">
        <div>
          <div style="text-align: left">
            <span class="items-title">姓名：</span> {{ el.userName }}
          </div>
          <div style="text-align: left">
            <span class="items-title">手机号：</span> {{ el.phone }}
          </div>
          <div style="text-align: left">
            <span class="items-title">密码：</span> {{ el.password }}
          </div>
        </div>
        <div>
          <van-button
            square
            type="danger"
            text="删除"
            @click="deleteTeacher(el.userId)"
          />
          <van-button
            square
            type="primary"
            text="修改"
            @click="updateTeacher(el)"
          />
        </div>
      </div>
    </div>
    <van-pagination
      v-model="currentPage"
      :total-items="total"
      :items-per-page="5"
      @change="currentPageChange"
    />
    <van-popup v-model="show" closeable>
      <div class="teacher-message">
        <div class="teacher-message-title">{{ title }}</div>
        <div>
          <van-form @submit="onSubmit">
            <van-field
              v-model="userMessage.userName"
              name="用户名"
              label="用户名"
              placeholder="用户名"
              :rules="[{ required: true, message: '请填写用户名' }]"
            />
            <van-field
              v-model="userMessage.phone"
              type="phone"
              name="手机号"
              label="手机号"
              placeholder="手机号"
              :rules="[{ pattern: phoneReg, message: '老师ID格式错误' }]"
            />
            <van-field
              v-model="userMessage.password"
              type="password"
              name="密码"
              label="密码"
              placeholder="密码"
              :rules="[{ required: true, message: '请填写密码' }]"
            />
            <div style="margin: 16px">
              <van-button round block type="info" native-type="submit">
                提交
              </van-button>
            </div>
          </van-form>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  orderListByBusiness,
  businessAdd,
  deleteBusiness,
  updateBusiness,
  findBusinessManage,
} from "../../api/index/index";
import { Toast, Dialog } from "vant";
export default {
  data() {
    return {
      userPhone: "",
      teacherList: [],
      searchName: "",
      userMessage: {
        userName: "",
        phone: "",
        password: "",
        type: 2,
        teacherType: 1,
        userId: JSON.parse(localStorage.getItem("userInfo")).userId,
        id: JSON.parse(localStorage.getItem("userInfo")).provincialId,
      },
      messageStatus: "",
      currentPage: 1,
      total: 0,
      pageSize: 5,
      phoneReg: /^1[3456789]\d{9}$/,
      loading: false,
      finished: false,
      show: false,
      title: "",
    };
  },
  created() {
    this.userPhone = JSON.parse(localStorage.getItem("userInfo")).userPhone;
    this.getTeacherAll();
  },
  methods: {
    quit() {
      localStorage.removeItem("userInfo");
      this.$router.replace("/");
    },
    getTeacherAll() {
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "加载中....",
      });
      findBusinessManage({
        page: this.currentPage,
        pageSize: this.pageSize,
        type: 2,
        teacherType: JSON.parse(localStorage.getItem("userInfo")).teacherType,
        userId: JSON.parse(localStorage.getItem("userInfo")).userId,
      }).then((res) => {
        Toast.clear();
        if (res.code == "0" && res.data.length > 0) {
          this.teacherList = res.data;
          this.total = res.count;
        }
      });
    },
    onSubmit() {
      //添加、修改老师
      if (this.title === "添加老师信息") {
        businessAdd(this.userMessage).then((res) => {
          if (res.code == "0") {
            this.show = false;
            this.userMessage = {
              userName: "",
              phone: "",
              password: "",
              type: 2,
              teacherType: 1,
              userId: JSON.parse(localStorage.getItem("userInfo")).userId,
              id: JSON.parse(localStorage.getItem("userInfo")).provincialId,
            };
            Toast.success("添加成功");
            this.getTeacherAll();
          } else {
            Toast.success(res.msg);
          }
        });
      } else if (this.title === "修改老师信息") {
         updateBusiness(this.userMessage).then((res) => {
          if (res.code == "0") {
            this.show = false;
            this.userMessage = {
              userName: "",
              phone: "",
              password: "",
              type: 2,
              teacherType: 1,
              userId: JSON.parse(localStorage.getItem("userInfo")).userId,
              id: JSON.parse(localStorage.getItem("userInfo")).provincialId,
            };
            Toast.success("修改成功");
            this.getTeacherAll();
          } else {
            Toast.success(res.msg);
          }
        });
      }
    },
    currentPageChange(val) {
      //当前页面修改
      this.getTeacherAll()
    },
    addTeacher() {
      this.show = true;
      this.title = "添加老师信息";
    },
    deleteTeacher(id) {
      let that = this;
      Dialog.confirm({
        title: "提示",
        message: "是否要删除该老师",
      })
        .then(() => {
          // on confirm
          deleteBusiness({
            userId: id,
          }).then((res) => {
            if (res.code == "0") {
              Toast.success("删除成功");
              this.getTeacherAll();
            }
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    updateTeacher(row) {
      this.userMessage = row;
      this.show = true;
      this.title = "修改老师信息";
    },
  },
};
</script>

<style>
.distribution-nav {
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
.distribution-order {
  width: 200px;
  height: 100%;
}
.distribution-btn {
  display: flex;
  justify-content: space-between;
  width: 300px;
  height: 100%;
}
.distribution-btn .van-button--block {
  width: 145px;
}
.distribution-nav .van-button--round {
  border-radius: 20px;
}
.distribution-nav .van-button::before {
  border-radius: 20px;
}
.distribution-nav .van-button::after {
  border: 0;
}
.distribution-quit img {
  width: 50px;
  height: 40px;
  /* border-radius: 50%; */
}

.line {
  margin-top: 100px;
  height: 30px;
  background-color: #f8f8f8;
}
.allOrder-search {
  /* margin-top: 100px; */
  display: flex;
  justify-content: space-between;
  padding: 30px;
  height: 126px;
  box-sizing: border-box;
}
.search-view {
  width: 80%;
  background: rgba(247, 247, 247, 1);
  border-radius: 20px;
  display: flex;
  border: 1px solid #f7f7f7;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
  overflow: hidden;
}
.search-view img {
  width: 34px;
  height: 34px;
  margin-right: 10px;
}
.search-view input {
  border: 0;
  height: 100%;
  background: rgba(247, 247, 247, 1);
  flex: 1;
}
.search-btn {
  width: 15%;
}
.order-list {
  padding: 30px;
}
.order-items {
  padding: 15px;
  border: 2px solid #666;
  margin-bottom: 20px;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.items-content {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.items-content:last-child {
  margin-bottom: 0;
}
.items-remarks {
  display: flex;
  justify-content: space-between;
}
.items-remarks div {
  text-align: left;
  width: 90%;
}
.items-remarks .yichu {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.items-remarks img {
  width: 30px;
  height: 30px;
}
.teacher-message {
  width: 500px;
}
.teacher-message .van-cell {
  line-height: 1.64rem;
}
.teacher-message .van-field__label {
  width: 2rem;
}
.teacher-message .van-button--normal {
  padding: 10px 0.2rem;
}
.teacher-message-title {
  padding: 10px 0;
  font-weight: bold;
}
.items-title {
  display: inline-block;
  width: 120px;
  text-align: justify;
  text-align-last: justify;
}
</style>