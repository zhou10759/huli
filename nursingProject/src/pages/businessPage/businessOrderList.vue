<template>
  <div class="business-order">
    <div class="content-search">
      <van-search v-model="searchVal" placeholder="请输入项目名称"></van-search>
      <div class="search-btn">
        <van-button
          color="linear-gradient(to right, #6F6F6F , #414141)"
          round
          block
          @click="getList('search')"
          >搜索</van-button
        >
      </div>
    </div>
    <div class="order-list">
      <van-list
        style="height: 500px; overflow: scroll"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        offset="50"
      >
        <div class="order-items" v-for="el in orderList" :key="el.id">
          <div class="order-items-projectName">{{ el.orderName }}</div>
          <div class="order-items-line">
            <span class="order-items-line-money"
              >套餐金额：{{ el.price }}元</span
            >
            <span class="order-items-line-name">{{ el.userName }}</span>
          </div>
          <div class="order-items-line">
            <span class="order-items-line-num"
              >次数：{{ el.times }}/{{ el.totalTimes }}</span
            >
            <span class="order-items-line-phone"
              >手机尾号：{{ el.userPhone }}</span
            >
          </div>
          <div class="order-items-line">
            <span class="order-items-line-give">{{
              el.give ? "赠送" : ""
            }}</span>
            <span class="order-items-line-phone">{{ el.createTime }}</span>
          </div>
          <div class="order-items-remarks">备注：{{ el.remarks || "" }}</div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import { findOrder } from "../../api/index/index";
export default {
  data() {
    return {
      searchVal: "",
      orderList: [],
      finished: false,
      loading: false,
      page: 1,
      total: 0,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList(val) {
      this.loading = true;
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      findOrder({
        page: val === "search" ? 1 : this.page,
        pageSize: 6,
        userId: userInfo.businessId,
        orderName: this.searchVal || "",
      }).then((res) => {
        if (val === "search") {
          this.orderList = res.data;
          this.total = res.count;
          this.loading = false;
          this.finished = false;
        } else {
          this.orderList = res.data.concat(...this.orderList);
          this.total = res.count;
          // 加载状态结束
          this.loading = false;
          if (this.orderList.length >= this.total) {
            this.finished = true;
          }
        }
      });
    },
    onLoad() {
      this.page++;
      this.getList();
    },
  },
};
</script>

<style>
.content-search {
  padding: 30px;
  height: 126px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  background-color: #ddd;
}
.content-search .van-search {
  padding: 0;
  border-radius: 20px;
}
.content-search .van-search,
.content-search .van-search__content,
.content-search .van-cell {
  height: 100%;
  align-items: center;
}
.order-list {
  padding: 30px;
  text-align: left;
}
.order-items {
  box-shadow: 0px 3px 10px 0px rgba(200, 200, 200, 0.5);
  padding: 15px 30px;
  margin-bottom: 30px;
}
.order-items-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.order-items-line-give {
  color: red;
}
.order-items-projectName {
  margin-bottom: 15px;
  font-weight: bold;
}
</style>