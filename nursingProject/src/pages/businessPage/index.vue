<template>
  <div class="business">
    <div class="business-header">
      <div class="header-left">
        <div class="header-left-name">
          <span>店家名称：</span>
          {{ userInfo.userName }}
        </div>
        <div class="header-equipment">
          <span>设 备：</span>
          <van-field
            readonly
            clickable
            is-link
            name="picker"
            :value="userInfo.equipmentId"
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
      </div>
      <div class="header-right">
        <van-button
          color="linear-gradient(to right, #6F6F6F , #414141)"
          round
          block
          @click="quitLogin"
          >退出登陆</van-button
        >
      </div>
    </div>
    <div class="experience-content">
      <div class="experience-btn">
        <van-button
          color="linear-gradient(to right, #6F6F6F , #414141)"
          round
          block
          @click="openEquipment"
          >系统刷新</van-button
        >
      </div>
      <div class="experience-btn">
        <van-button
          color="linear-gradient(to right, #6F6F6F , #414141)"
          block
          round
          @click="$router.push('businessOrderList')"
          >订单列表</van-button
        >
      </div>
      <!-- <div class="experience-date">剩余体验时长：{{remainingTime||0}}分钟</div> -->
    </div>
    <div class="line"></div>
    <div class="business-content">
      <!-- <div class="content-search">
        <van-search v-model="searchVal" placeholder="请输入项目名称" @search="onSearch"></van-search>
        <div class="search-btn">
          <van-button
            color="linear-gradient(to right, #6F6F6F , #414141)"
            round
            block
            @click="onSearch(searchVal)"
          >搜索</van-button>
        </div>
      </div> -->
      <div class="content-list">
        <div class="list-sidebar">
          <div
            class="sidebar-items"
            v-for="(el, i) in sidebarList"
            @click="toogleSidebar(i, el)"
            :key="i"
          >
            <div
              :class="
                (el.selected ? 'active-sidebar-items-name' : '') +
                '    sidebar-items-name'
              "
            >
              {{ el.projectName }}
            </div>
            <img :src="el.projectImg || './static/icon.png'" alt />
            <!-- <div class="sidebar-items-name">
              {{ el.projectName }}
            </div> -->
            <!-- <img :src="el.projectImg || './static/icon.png'" alt /> -->
          </div>
        </div>
        <div class="list-classification">
          <div class="second_level_title" v-show="list1.length > 0">
            二级分类
          </div>
          <div class="second_level_content">
            <div class="second_level_items" v-for="(el, i) in list1" :key="i">
              <van-button
                :color="
                  el.selected
                    ? 'linear-gradient(to right, #EFEFEF , #D7D7D7)'
                    : 'linear-gradient(to right, #6F6F6F , #414141)'
                "
                round
                block
                @click="toggleSecondLevel(i, el, 1)"
                >{{ el.projectName }}</van-button
              >
            </div>
          </div>
          <!-- <div class="second_level_title" v-show="list2.length > 0">
            三级分类
          </div>
          <div class="level_three_content">
            <div class="level_three_items" v-for="(el, i) in list2" :key="i">
              <van-button
                :color="
                  el.selected
                    ? 'linear-gradient(to right, #EFEFEF , #D7D7D7)'
                    : 'linear-gradient(to right, #6F6F6F , #414141)'
                "
                round
                block
                @click="toggleSecondLevel(i, el, 2)"
                >{{ el.projectName }}</van-button
              >
            </div>
          </div>
          <div class="second_level_title" v-show="list3.length > 0">
            四级分类
          </div>
          <div class="level_three_content">
            <div class="level_three_items" v-for="(el, i) in list3" :key="i">
              <van-button
                :color="
                  el.selected
                    ? 'linear-gradient(to right, #EFEFEF , #D7D7D7)'
                    : 'linear-gradient(to right, #6F6F6F , #414141)'
                "
                round
                block
                @click="toggleSecondLevel(i, el, 3)"
                >{{ el.projectName }}</van-button
              >
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  projectList,
  equipmentList,
  selectProjectList,
  businessSendOrder,
  moneyUnsettled,
} from "../../api/index/index";
import { Toast, Dialog } from "vant";
export default {
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      showEquipmentPicker: false,
      equipment: [],
      equipmentData: [],
      searchVal: "",
      sidebarList: [],
      list1: [],
      list2: [],
      list3: [],
      sidebarActive: 0,
      second_level_active: 0,
      second_level_active1: 0,
      remainingTime: 0,
      moenyTotal: 0,
    };
  },
  created() {
    document.title = "商家主页";
    this.getEquipmentList();
    this.getProjectList();
    this.getMoneyUnsettled();
    // this.getDate();
    // console.log(new Date().getDate());
  },
  methods: {
    getMoneyUnsettled() {
      moneyUnsettled({
        businessId: this.userInfo.businessId,
      }).then((res) => {
        if (res.code == "000000") {
          this.moenyTotal = res.data;
          this.getDate();
        }
      });
    },
    getDate() {
      let num = new Date().getDate() - 26;
      if (num >= 0 && num < 3 && this.moenyTotal.achievement == 0) {
        Dialog.confirm({
          title: "提示",
          message: `美力时间不够了，请尽快给我补充些美力吧。未结算总业绩额：${
            this.moenyTotal.money
          }元  锁机倒计时：${3 - num}天`,
        })
          .then(() => {})
          .catch(() => {
            // on cancel
          });
      }
    },
    openEquipment() {
      if (this.remainingTime < 0) {
        Toast("设备体验时间已过期！");
        return;
      }
      businessSendOrder({
        equipmentId: this.userInfo.equipmentId,
      }).then((res) => {
        if (res.code === "000000") {
          Toast.success("开启成功！");
        } else {
          Toast.fail(res.msg);
        }
      });
    },
    getEquipmentList() {
      equipmentList({
        businessId: this.userInfo.businessId,
        type: 1,
      }).then((res) => {
        if (res.code == "000000") {
          this.equipment = res.data.map((el) => el.equipmentId);
          this.equipmentData = res.data;
          res.data.map((el) => {
            if (el.equipmentId == this.userInfo.equipmentId) {
              this.remainingTime = el.surplusTime;
            }
          });
        }
      });
    },
    getProjectList(parentId = 0) {
      let that = this;
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "加载中.....",
      });
      return new Promise((resolve, reject) => {
        projectList({ parentId }).then((res) => {
          Toast.clear();
          if (res.code === "000000") {
            if (res.data.length > 0) {
              if (parentId == 0) {
                res.data.map((el) => (el.selected = false));
                that.sidebarList = res.data;
                // debugger
              }
              resolve(res.data);
            } else {
              this.$router.push({
                path: "projectDetails",
                query: { projectId: parentId },
              });
            }
          }
        });
      });
    },
    equipmentToggle(val) {
      this.$set(this.userInfo, "equipmentId", val);
      this.equipmentData.map((el) => {
        if (el.equipmentId == val) {
          this.remainingTime = el.surplusTime;
        }
      });
      localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
      // this.equipmentVal = val;
      this.showEquipmentPicker = false;
    },
    quitLogin() {
      //退出登录
      localStorage.removeItem("userInfo");
      this.$router.replace("/");
    },
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
    async toogleSidebar(i, el) {
      this.sidebarList.map((el) => (el.selected = false));
      el.selected = true;
      console.log(el.parentId);
      this.list1 = await this.getProjectList(el.projectId);
      this.list2 = [];
      this.list3 = [];
      // this.sidebarActive = i;
      console.log(this.sidebarList);
    },
    async toggleSecondLevel(i, el, type) {
      if (type == 1) {
        this.list1.map((el) => (el.selected = false));
        el.selected = true;
        this.list2 = await this.getProjectList(el.projectId);
        this.$router.push({ path: "subOrder", query: { projectName: el.projectName } });
        this.list3 = [];
      } else if (type == 2) {
        this.list2.map((el) => (el.selected = false));
        el.selected = true;
        this.list3 = await this.getProjectList(el.projectId);
      } else if (type == 3) {
        this.list3.map((el) => (el.selected = false));
        el.selected = true;
        await this.getProjectList(el.projectId);
      }
    },
  },
};
</script>
<style scope>
.content-search /deep/ .van-icon {
  font-size: 48px;
}
.business .header-equipment /deep/ .van-icon {
  font-size: 24px;
  line-height: 40px;
}
.business .van-button--round {
  border-radius: 20px;
}
.second_level_title {
  text-align: left;
}
.business-header .van-cell {
  height: 100%;
  width: 330px;
  border: 1px solid rgba(217, 217, 217, 1);
}
.business-header {
  display: flex;
  justify-content: space-between;
  padding: 21px 30px;
  font-size: 30px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(73, 73, 73, 1);
}
.business .header-equipment {
  display: flex;
}
.header-right {
  width: 150px;
  height: 60px;
}
.header-left {
  flex: 1;
}
.header-left-name {
  margin-bottom: 30px;
}
.business .header-left-name,
.business .header-equipment {
  height: 60px;
  text-align: left;
  display: flex;
  align-items: center;
}
.business .header-equipment /deep/ .van-cell {
  line-height: 60px;
}
/* .content-search /deep/  .van-cell {
  line-height: 126px;
} */
.header-left-name span,
.business .header-equipment > span {
  display: inline-block;
  min-width: 150px;
  text-align: justify;
  text-align-last: justify;
}
.content-search {
  padding: 30px;
  height: 126px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
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
.van-search {
  width: 570px;
}
.search-btn {
  width: 100px;
}
.content-list {
  display: flex;
}
.list-sidebar {
  width: 197px;
  box-shadow: 0px 3px 10px 0px rgba(200, 200, 200, 0.5);
  padding: 30px 0;
  /* padding: 30px; */
  /* text-align: left;
  padding: 30px; */
}
/* .sidebar-items {
  display: inline-block;
  height: 100px;
  width: 42%;
  box-shadow: 0px 3px 10px 0px rgba(200, 200, 200, 0.5);
  margin: 20px;
  text-align: center;
  line-height: 100px;
} */
.sidebar-items .sidebar-items-name {
  font-size: 28px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(102, 102, 102, 1);
  margin-bottom: 10px;
}
.sidebar-items .active-sidebar-items-name {
  font-weight: 600;
  color: rgba(51, 51, 51, 1);
}
.sidebar-items .active-sidebar-items-name::before {
  content: "";
  width: 10px;
  height: 46px;
  background: linear-gradient(
    180deg,
    rgba(111, 111, 111, 1) 0%,
    rgba(65, 65, 65, 1) 100%
  );
  border-radius: 5px;
  position: absolute;
  left: 0;
}
.sidebar-items img {
  width: 112px;
  height: 80px;
  margin-bottom: 30px;
}
.list-classification {
  padding: 32px;
  flex: 1;
}
.second_level_title,
.level_three_title {
  font-size: 28px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  margin-bottom: 30px;
}
.second_level_content,
.level_three_content {
  display: flex;
  /* justify-content: space-between; */
  flex-wrap: wrap;
}
.second_level_content .second_level_items,
.level_three_content .level_three_items {
  min-width: 138px;
  height: 60px;
  margin-bottom: 30px;
  margin-right: 20px;
}
.experience-content {
  display: flex;
  align-items: center;
  padding: 0 30px 30px 30px;
}
.experience-btn {
  width: 240px;
  height: 60px;
  margin-right: 30px;
}
.experience-date {
  flex: 1;
  text-align: right;
  font-size: 30px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(73, 73, 73, 1);
}
</style>