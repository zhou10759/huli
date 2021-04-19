<template>
  <div class="business-order">
    <div class="content-search">
      <van-search
        v-model="searchVal"
        placeholder="请输入项目名称"
        @search="onSearch"
      ></van-search>
      <div class="search-btn">
        <van-button
          color="linear-gradient(to right, #6F6F6F , #414141)"
          round
          block
          @click="onSearch(searchVal)"
          >搜索</van-button
        >
      </div>
    </div>
    <div class="order-list">
      <div class="order-items" v-for="el in orderList" :key="el.id">
        <div class="order-items-projectName">{{ el.projectName }}</div>
        <div class="order-items-line">
          <span class="order-items-line-money"
            >套餐金额：{{ el.projectMoney }}元</span
          >
          <span class="order-items-line-name">{{ el.name }}</span>
        </div>
        <div class="order-items-line">
          <span class="order-items-line-num"
            >次数：{{ el.projectNum }}/{{ el.projectTotalNum }}</span
          >
          <span class="order-items-line-phone"
            >手机尾号：{{ el.phone ? el.phone.substr(-4) : "" }}</span
          >
        </div>
        <div class="order-items-line">
          <span class="order-items-line-give">{{ el.give ? "赠送" : "" }}</span>
          <span class="order-items-line-phone">{{ el.createTime }}</span>
        </div>
        <div class="order-items-remarks">备注：{{ el.remarks }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { selectProjectList } from "../../api/index/index";
export default {
  data() {
    return {
      searchVal: "",
      orderList: [
        {
          id: 1,
          projectName: "浅层护理",
          projectMoney: 4000,
          projectNum: 4,
          projectTotalNum: 10,
          name: "猪石头",
          phone: "18268186295",
          createTime: "2014/4/14",
          give: true,
          remarks: "这个项目是一个赠送的项目",
        },
          {
          id: 2,
          projectName: "浅层护理",
          projectMoney: 4000,
          projectNum: 4,
          projectTotalNum: 10,
          name: "猪石头",
          phone: "18268186295",
          createTime: "2014/4/14",
          give: false,
          remarks: "这个项目是一个赠送的项目",
        },
      ],
    };
  },
  methods: {
    onSearch(val) {
      // console.log(val)
      // return;
      selectProjectList({
        projectName: val,
      }).then((res) => {
        if (res.code == "000000") {
          if (res.data.length > 0) {
            this.$router.push({
              path: "projectDetails",
              query: { projectId: res.data[0].projectId },
            });
          } else {
            Toast.fail("暂无搜索内容！");
          }
        } else {
          Toast.fail(res.msg);
        }
      });
    },
  },
};
</script>

<style>
.content-search /deep/ .van-icon {
  font-size: 48px;
}
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
.order-items-line-give{
    color: red;
}
.order-items-projectName{
    margin-bottom: 15px;
    font-weight: bold;
}
</style>