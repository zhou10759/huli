<template>
  <div class="allOrder">
    <div class="distribution-nav">
      <div class="header-name">合伙人ID: {{ userPhone }}</div>
      <div class="distribution-quit">
        <img src="../../../static/quit.png" @click="quit()" alt />
      </div>
    </div>
    <div class="line" style="margin-top:40px;"></div>
    <div class="search-toggle">
      <van-radio-group v-model="searchType" direction="horizontal">
        <van-radio name="1">订单名称</van-radio>
        <van-radio name="2">项目名称</van-radio>
      </van-radio-group>
    </div>
    <div class="allOrder-search">
      <div class="search-view">
        <img src="../../../static/search.png" alt />
        <input
          type="text"
          :placeholder="
            '搜索' +
            (searchType === '1'
              ? '订单名称'
              : searchType === '2'
              ? '项目名称'
              : '')
          "
          v-model="searchName"
        />
      </div>
      <div class="search-btn">
        <van-button
          color="linear-gradient(to right, #6F6F6F , #414141)"
          round
          block
          @click="getOrderAll()"
          >搜索</van-button
        >
      </div>
    </div>
    <div class="order-list" v-if="orderList.length > 0">
      <div class="order-items" v-for="(el, i) in orderList" :key="el.id">
        <div class="items-content">
          <div>
            {{ el.orderName }}
            <van-tag type="danger" v-if="el.parentId != 0">送</van-tag>
          </div>
          <div>{{ el.createTime }}</div>
        </div>
        <div class="items-content">
          <div>套餐金额：{{ el.price }}元</div>
          <div>剩余次数：{{ el.times }}/{{ el.totalTimes }}</div>
        </div>
        <div class="items-content">
          <div>
            <van-button
              color="linear-gradient(to right, #6F6F6F , #414141)"
              round
              block
              >{{ el.orderType == 0 ? "固定模式" : "自定义模式" }}</van-button
            >
          </div>
          <div>{{ el.userName }}</div>
        </div>
        <div class="items-remarks">
          <div :class="el.status == 0 ? 'yichu' : ''">
            备注：{{ el.remarks || "无备注" }}
          </div>
          <img
            @click="remarksMore(i)"
            :src="
              el.status === 0
                ? '../../../static/shouqi.png'
                : '../../../static/zhankai.png'
            "
            alt
          />
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
import { findOrder } from "../../api/index/index";
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
      userId: this.$route.query.userId,
      searchType: "1",
    };
  },
  created() {
    this.userPhone = JSON.parse(localStorage.getItem("userInfo")).userPhone;
    this.getOrderAll();
  },
  methods: {
    remarksMore(i) {
      this.$set(
        this.orderList[i],
        "status",
        this.orderList[i].status === 0 ? 1 : 0
      );
    },
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
      findOrder({
        page: this.currentPage,
        pageSize: this.pageSize,
        userId: this.userId,
        projectName: this.searchType === "2" ? this.searchName : "",
        orderName: this.searchType === "1" ? this.searchName : "",
      }).then((res) => {
        Toast.clear();
        if (res.code == "0" && res.data.length > 0) {
          res.data.map((el, i) => {
            el.status = 0;
          });
          this.orderList = res.data;
          this.total = res.count
        }
      });
    },
    currentPageChange() {
      this.getOrderAll();
    },
  },
};
</script>
<style scoped>
.header-name{
  color: #fff;
}
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
.allOrder .van-tag {
  padding: 6px 14px;
  font-size: 24px;
  border-radius: 30px;
}
.allOrder-header {
  display: flex;
  padding: 30px;
  align-items: center;
  justify-content: space-between;
}
.header-quit {
  width: 150px;
  height: 60px;
}
.line {
  height: 30px;
  background-color: #f8f8f8;
}
.allOrder-search {
  display: flex;
  justify-content: space-between;
  padding: 30px;
  height: 126px;
  box-sizing: border-box;
}
.search-toggle {
  padding: 10px 30px;
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
  padding: 30px;
  border: 2px solid #666;
  margin-bottom: 20px;
  border-radius: 20px;
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
.allOrder >>> .van-radio__icon {
  height: 1em;
  font-size: 0.466667rem;
  line-height: 1.2em;
}
.allOrder >>> .van-empty__image {
  width: 4.133333rem;
  height: 4.133333rem;
}
.allOrder >>> .van-empty__description {
  font-size: 0.366667rem;
}
.items-remarks .zhankai {
}
.items-remarks .shouqi {
}
</style>