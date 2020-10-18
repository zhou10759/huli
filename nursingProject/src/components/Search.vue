<template>
  <div class="search">
    <div class="search-items">
      <div>
        <van-cell-group>
          <van-field v-model="businessVal" type="businessId" placeholder="请输入商家" @input="getVal" />
        </van-cell-group>
      </div>
      <div v-show="isShow" class="business-list">
        <van-list v-model="loading" :finished="finished" finished-text @load="onLoad">
          <van-cell v-for="item in list" :key="item" :title="item" @click="toggleVal(item)" />
        </van-list>
      </div>
      <!-- <div v-if="isShow">1111</div> -->
    </div>
  </div>
</template>
<script>
export default {
  name: "search",
  props: {
    businessList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      businessVal: "",
      list: [],
      loading: false,
      finished: true,
      isShowList: false
    };
  },
  watch: {
    businessVal: function(newVal, oldVal) {
      let businessId = this.$props.businessList.filter((el, i) => {
       return  el.businessName === newVal 
      });
      console.log("watch触发",businessId);
      this.$emit("changeBusinessVal", businessId.length>0? businessId[0].businessId : null);
    }
  },
  computed: {
    isShow: function() {
      return this.list.length > 0 && this.businessVal.length > 0 ? true : false;
    }
  },
  methods: {
    getVal(val) {
      // console.log(e)
      this.businessVal = val;
      this.list = this.$props.businessList
        .map(el => el.businessName)
        .filter(el => el.includes(val));
      //   console.log("watch触发");
    },
    onLoad() {
      // 异步更新数据
      //   // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      //   setTimeout(() => {
      //     for (let i = 0; i < 10; i++) {
      //       this.list.push(this.list.length + 1);
      //     }
      //     // 加载状态结束
      //     this.loading = false;
      //     // 数据全部加载完成
      //     if (this.list.length >= 40) {
      //       this.finished = true;
      //     }
      //   }, 1000);
    },
    toggleVal(val) {
      this.list = [];
      this.businessVal = val;
      //   console.log("this.isShowList", this.isShowList);
      //   console.log("isShow", this.isShow);
    }
  }
};
</script>

<style scoped>
.business-list {
  height: 200px;
  overflow-y: scroll;
  border: 1px solid #6f6f6f;
}
 .business-list >>> .van-list .van-cell {
  height: 100px;
  line-height: 100px;
}
</style>