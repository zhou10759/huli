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
          @click="$router.push('teacherList')"
          >老师列表</van-button
        >
      </div>
      <div class="header-name" >合伙人ID: {{ userPhone }}</div>
      <div class="distribution-quit">
        <img src="../../../static/quit.png" @click="quit()" alt />
      </div>
    </div>
    <div class="line" style="margin-top: 30px;"></div>
    <div class="order-list" v-if="orderList.length > 0">
      <div
        class="distribution-items"
        v-for="el in orderList"
        :key="el.id"
        @click="
          $router.push({ path: 'teacherOrder', query: { userId: el.userId } })
        "
      >
        <div>
          <div>
            <span>店铺名称：{{ el.userName }}</span>
          </div>
          <div>
            <span>店铺地址：{{ el.address }}</span>
          </div>
          <div>
            <span>创建时间：{{ el.createTime }}</span>
          </div>
        </div>
        <div>
          <div>
            <span>手机号：{{ el.phone }}</span>
          </div>
          <div>
            <span>密码：{{ el.password }}</span>
          </div>
        </div>
      </div>
    </div>
    <van-empty description="暂无数据" v-else> </van-empty>
    <van-pagination
      v-model="currentPage"
      :total-items="total"
      :items-per-page="5"
      @change="currentPageChange"
    />
  </div>
</template>

<script>
import { findBusinessManage } from "../../api/index/index";
import { Toast } from "vant";
export default {
  data() {
    return {
      userPhone: "",
      orderList: [],
      searchName: "",
      loading: false,
      finished: false,
      currentPage: 1,
      total: 0,
      pageSize: 5,
    };
  },
  created() {
    this.userPhone = JSON.parse(localStorage.getItem("userInfo")).userPhone;
    this.getOrderAll();
  },
  methods: {
    quit() {
      localStorage.removeItem("userInfo");
      this.$router.replace("/");
    },
    getOrderAll() {
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "加载中....",
      });
      findBusinessManage({
        page: this.currentPage,
        pageSize: this.pageSize,
        type: 1,
        agentId: JSON.parse(localStorage.getItem("userInfo")).provincialId,
      }).then((res) => {
        Toast.clear();
        if (res.code == "0" && res.data.length > 0) {
          this.orderList = res.data;
          this.total = res.count;
        }
      });
    },
    currentPageChange() {
      this.getOrderAll();
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
.distribution-items {
  padding: 30px;
  border: 2px solid #666;
  margin-bottom: 20px;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  text-align: left;
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

.distribution .van-empty__image {
  width: 4.133333rem;
  height: 4.133333rem;
}
.distribution .van-empty__description {
  font-size: 0.366667rem;
}
.header-name{
  color: #fff;
}
</style>