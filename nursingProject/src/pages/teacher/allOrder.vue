<template>
  <div class="allOrder">
    <div class="allOrder-header">
      <div class="header-name">老师ID: {{userPhone}}</div>
      <div class="header-quit">
        <van-button
          color="linear-gradient(to right, #6F6F6F , #414141)"
          round
          block
          @click="quit"
        >退出登陆</van-button>
      </div>
    </div>
    <div class="line"></div>
    <div class="allOrder-search">
      <div class="search-view">
        <img src="../../../static/search.png" alt />
        <input type="text" placeholder="搜索项目名、订单类型、顾客姓名" v-model="searchName" />
      </div>
      <div class="search-btn">
        <van-button
          color="linear-gradient(to right, #6F6F6F , #414141)"
          round
          block
          @click="getOrderAll()"
        >搜索</van-button>
      </div>
    </div>
    <div class="order-list">
      <div class="order-items" v-for="(el,i) in orderList" :key="el.id">
        <div class="items-content">
          <div>{{el.orderName}} <van-tag type="danger" v-if="el.parentId!=0">送</van-tag></div>
          <div>{{el.createTime}}</div>
        </div>
        <div class="items-content">
          <div>套餐金额：{{el.price}}元</div>
          <div>剩余次数：{{el.times}}/{{el.totalTimes}}</div>
        </div>
        <div class="items-content">
          <div>
            <van-button
              color="linear-gradient(to right, #6F6F6F , #414141)"
              round
              block
            >{{el.orderType==0?"固定模式":"自定义模式"}}</van-button>
          </div>
          <div>{{el.userName}}</div>
        </div>
        <div class="items-remarks">
          <div :class="el.status==0?'yichu':''">备注：{{el.remarks||"无备注"}}</div>
          <img
            @click="remarksMore(i)"
            :src="el.status===0?'../../../static/shouqi.png':'../../../static/zhankai.png'"
            alt
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { orderListByBusiness } from "../../api/index/index";
import { Toast } from "vant";
export default {
  data() {
    return {
      userPhone: "",
      orderList: [
        {
          orderName: "全身护理-面部-去黑头",
          price: "1000",
          createTime: "2020-4-7",
          times: 6,
          totalTimes: 10,
          projectType: "自定义项目",
          memberName: "张三"
        },
        {
          orderName: "全身护理-面部-去黑头",
          price: "1000",
          createTime: "2020-4-7",
          times: 6,
          totalTimes: 10,
          projectType: "自定义项目",
          memberName: "张三"
        },
        {
          orderName: "全身护理-面部-去黑头",
          price: "1000",
          createTime: "2020-4-7",
          times: 6,
          totalTimes: 10,
          projectType: "自定义项目",
          memberName: "张三"
        },
        {
          orderName: "全身护理-面部-去黑头",
          price: "1000",
          createTime: "2020-4-7",
          times: 6,
          totalTimes: 10,
          projectType: "自定义项目",
          memberName: "张三"
        }
      ],
      searchName: "",
      loading: false,
      finished: false
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
        message: "加载中...."
      });
      orderListByBusiness({
        businessId: JSON.parse(localStorage.getItem("userInfo")).businessId,
        searchName: this.searchName || ""
      }).then(res => {
        Toast.clear();
        if (res.code == "000000" && res.data.length > 0) {
          res.data.map((el, i) => {
            el.status = 0;
          });
          this.orderList = res.data;
        }
      });
    }
  }
};
</script>
<style scoped>
.allOrder .van-tag{
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
.items-remarks .zhankai {
}
.items-remarks .shouqi {
}
</style>