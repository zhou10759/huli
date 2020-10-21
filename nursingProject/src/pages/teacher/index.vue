<template>
  <div class="teacher">
    <div class="add-nav">
      <div class="add-order">
        <van-button
          plain
          hairline
          type="primary"
          round
          block
          @click="$router.push('allOrder')"
          >所有订单</van-button
        >
      </div>
      <div class="add-btn" v-if="teacherType===0">
        <van-button
          plain
          hairline
          type="primary"
          round
          block
          @click="
            showPicker2 = true;
            isBtnStatus = 0;
          "
          >到店</van-button
        >
        <van-button
          plain
          hairline
          type="primary"
          round
          block
          @click="
            showPicker2 = true;
            isBtnStatus = 1;
          "
          >离店</van-button
        >
        <van-popup v-model="showPicker2" position="bottom">
          <van-picker
            show-toolbar
            :columns="equipmentList"
            @confirm="equipmentToggle"
            @cancel="showPicker2 = false"
          />
        </van-popup>
      </div>
      <div class="add-quit">
        <img src="../../../static/quit.png" @click="quit()" alt />
      </div>
    </div>
    <div class="add-equipment">
      <!-- <div class="line"></div> -->
      <div class="add_equipment-form">
        <div class="form-items">
          <div class="form-title">老师ID</div>
          <van-cell-group>
            <van-field
              v-model="teacherId"
              :disabled="true"
              placeholder="请输入老师ID"
            />
          </van-cell-group>
        </div>
        <!-- <div class="form-items">
          <div class="form-title">商家选择</div>
          <van-field
            readonly
            clickable
            name="picker"
            :value="business"
            placeholder="商家选择"
            @click="showPicker1 = true"
          />
          <van-popup v-model="showPicker1" position="bottom">
            <van-picker
              show-toolbar
              :columns="businessList"
              @confirm="businessToggle"
              @cancel="showPicker1 = false"
            />
          </van-popup>
        </div>
        <div class="form-items">
          <div class="form-title">设备选择</div>
          <van-field
            readonly
            clickable
            name="picker"
            :value="equipmentId"
            placeholder="选择设备id"
            @click="openEquipmentList"
          />
          <van-popup v-model="showPicker2" position="bottom">
            <van-picker
              show-toolbar
              :columns="equipmentList"
              @confirm="equipmentToggle"
              @cancel="showPicker2 = false"
            />
          </van-popup>
        </div>-->
      </div>
    </div>
    <div class="project-message">
      <div class="form-items">
        <div class="form-title">体 验 订 单</div>
        <van-cell-group>
          <van-checkbox v-model="experience">是否为体验订单</van-checkbox>
        </van-cell-group>
      </div>
      <div class="form-items">
        <div class="form-title">姓 &nbsp;&nbsp; &nbsp; &nbsp; 名</div>
        <van-cell-group>
          <van-field v-model="projectList.name" placeholder="请输入姓名" />
        </van-cell-group>
      </div>
      <div class="form-items">
        <div class="form-title">手 机 尾 号</div>
        <van-cell-group>
          <van-field
            v-model="projectList.phone"
            type="tel"
            maxlength="4"
            placeholder="请输入手机尾号后4位"
          />
        </van-cell-group>
      </div>
      <template v-if="!experience">
        <div class="form-items">
          <div class="form-title">项 目 名 称</div>
          <van-cell-group>
            <van-field
              v-model="projectList.projectName"
              placeholder="请输入项目名称"
            />
          </van-cell-group>
        </div>
         <div class="form-items">
          <div class="form-title">项 目 金 额</div>
          <van-cell-group>
            <van-field
              type="number"
              v-model="projectList.projectMoney"
              placeholder="请输入项目金额"
            />
          </van-cell-group>
        </div>
        <div class="form-items">
          <div class="form-title">项 目 次 数</div>
          <van-cell-group>
            <van-field
              type="digit"
              v-model="projectList.projectNum"
              placeholder="请输入项目次数"
            />
          </van-cell-group>
        </div>
        <div class="form-items">
          <div class="form-title">项 目 时 长</div>
          <van-cell-group>
            <van-field
              type="digit"
              v-model="projectList.projectTime"
              placeholder="请输入项目时长"
            />
          </van-cell-group>
        </div>
        <div class="form-textarea">
          <div class="form-title">备 &nbsp;&nbsp; &nbsp; &nbsp; 注</div>
          <van-cell-group>
            <van-field
              v-model="projectList.remarks"
              rows="3"
              autosize
              type="textarea"
              maxlength="100"
              placeholder="请输入备注"
            />
          </van-cell-group>
        </div>
        <div class="form-items">
          <div class="form-title">项 目 优 惠</div>
          <van-cell-group>
            <van-checkbox v-model="projectList.give">送</van-checkbox>
          </van-cell-group>
        </div>
        <div v-show="projectList.give">
          <div class="form-items">
            <div class="form-title">项 目 名 称</div>
            <van-cell-group>
              <van-field
                v-model="projectList.giveOrderName"
                placeholder="请输入项目名称"
              />
            </van-cell-group>
          </div>
          <div class="form-items">
            <div class="form-title">项 目 次 数</div>
            <van-cell-group>
              <van-field
                type="digit"
                v-model="projectList.giveTotalTimes"
                placeholder="请输入项目次数"
              />
            </van-cell-group>
          </div>
          <div class="form-items">
            <div class="form-title">项 目 时 长</div>
            <van-cell-group>
              <van-field
                type="digit"
                v-model="projectList.giveEveryTime"
                placeholder="请输入项目时长"
              />
            </van-cell-group>
          </div>
        </div>
        <div class="form-date">
          总时长：{{ projectList.projectNum * projectList.projectTime }}分钟
        </div>
      </template>
    </div>
    <div class="custom-btn">
      <Debounce :time="500" isDebounce>
        <van-button
          color="linear-gradient(to right, #6F6F6F , #414141)"
          round
          block
          @click="addOrder"
          >确定</van-button
        >
      </Debounce>
    </div>
  </div>
</template>
<script>
import {
  submitOrder,
  businessList,
  equipmentList,
  teacherToShop,
  rangeList,
} from "../../api/index/index";
import { Toast } from "vant";
export default {
  data() {
    return {
      teacherId: "",
      business: "",
      // equipmentId: "",
      businessId: "",
      businessList: [],
      businessData: [],
      equipmentList: [],
      equipmentListData: [],
      showPicker1: false,
      showPicker2: false,
      projectList: {
        name: "",
        phone: "",
        projectName: "",
        projectNum: "",
        projectTime: "",
        projectMoney: "",
        remarks: "",
        give: false,
        giveOrderName: "",
        giveTotalTimes: "",
        giveEveryTime: "",
        giveProjectTime: "",
      },
      experience: false,
      isBtnStatus: null, //0为到店 1为离店
      teacherType: JSON.parse(localStorage.getItem("userInfo")).teacherType
    };
  },
  watch: {
    "projectList.projectMoney": {
      handler: function (val, oldval) {
        //do something
        if (JSON.parse(localStorage.getItem("userInfo")).teacherType === 1) {
          //经销商老师
          rangeList({
            price: parseInt(val),
            provincialId: JSON.parse(localStorage.getItem("userInfo"))
              .provincialId,
          }).then((res) => {
            if (res.code === "000000") {
              this.projectList.projectNum = res.data.totalTimes;
              this.projectList.projectTime = res.data.everyTime;
            } else if (res.code === "000001") {
              this.projectList.projectNum = "";
              this.projectList.projectTime = "";
            }
          });
        }
      },
    },
  },
  created() {
    document.title = "老师自定义模式";
    this.teacherId = JSON.parse(localStorage.getItem("userInfo")).userPhone;
    this.business = JSON.parse(localStorage.getItem("userInfo")).businessId;
    // console.log("this.teacherId",this.teacherId,this.business)
    // this.getbusinessList();
    this.openEquipmentList();
  },
  methods: {
    quit() {
      localStorage.removeItem("userInfo");
      this.$router.replace("/");
    },
    openEquipmentList() {
      let businessId = this.business;
      // if (this.business) {
      //   this.showPicker2 = true;
      //   this.businessData.map((el, i) => {
      //     if (el.businessName === this.business) {
      //       businessId = el.businessId;
      //     }
      //   });
      this.getEquipmentList({ businessId, type: 1 });
      // } else {
      //   Toast.fail("请先选择商家");
      // }
    },
    // getbusinessList() {
    //   businessList().then(res => {
    //     if (res.code == "000000") {
    //       this.businessData = res.data.length > 0 ? res.data : [];
    //       this.businessList =
    //         res.data.length > 0 ? res.data.map(el => el.businessName) : [];
    //     }
    //   });
    // },
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
    businessToggle(val) {
      let businessId = "";
      this.businessData.map((el, i) => {
        if (el.businessName === val) {
          businessId = el.businessId;
        }
      });
      this.business = val;
      this.businessId = businessId;
      this.showPicker1 = false;
    },
    async equipmentToggle(val) {
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "操作中",
      });
      this.equipmentId = val;
      let res = await teacherToShop({
        equipmentId: val,
        type: this.isBtnStatus,
      });
      Toast.clear();
      if (res.code === "000000") {
        Toast.success("操作成功");
      } else {
        Toast.fail(res.msg);
      }
      this.showPicker2 = false;
    },
    addOrder() {
      let that = this;
      let query = {};
      if (this.experience) {
        if (!this.projectList.name) {
          Toast.fail("请输入用户姓名");
          return;
        }
        if (!this.projectList.phone) {
          Toast.fail("请输入用户手机号");
          return;
        }
        query = {
          userName: this.projectList.name,
          userPhone: this.projectList.phone,
          experience: 1,
          teacherType: JSON.parse(localStorage.getItem("userInfo")).teacherType,
          equipmentId: this.equipmentId,
          teacherId: this.teacherId,
          orderType: 1,
          businessId: this.business,
          give: 0,
        };
      } else {
        if (!this.projectList.name) {
          Toast.fail("请输入用户姓名");
          return;
        }
        if (!this.projectList.phone) {
          Toast.fail("请输入用户手机号");
          return;
        }
        if (!this.projectList.projectName) {
          Toast.fail("请输入项目名称");
          return;
        }
        if (!this.projectList.projectNum) {
          Toast.fail("请输入项目次数");
          return;
        }
        if (!this.projectList.projectTime) {
          Toast.fail("请输入项目时长");
          return;
        }
        if (!this.projectList.projectMoney) {
          Toast.fail("请输入项目金额");
          return;
        }
        query = {
          orderName: this.projectList.projectName,
          orderType: 1,
          price: this.projectList.projectMoney,
          totalTimes: this.projectList.projectNum,
          businessId: this.business,
          userName: this.projectList.name,
          userPhone: this.projectList.phone,
          everyTime: this.projectList.projectTime,
          projectTime:
            this.projectList.projectNum * this.projectList.projectTime,
          equipmentId: this.equipmentId,
          teacherId: this.teacherId,
          remarks: this.projectList.remarks,
          teacherType: JSON.parse(localStorage.getItem("userInfo")).teacherType,
        };
        query.give = this.projectList.give ? 1 : 0;
      }
      if (this.projectList.give) {
        if (!this.projectList.giveOrderName) {
          Toast.fail("请输入项目次数");
          return;
        }
        if (!this.projectList.giveTotalTimes) {
          Toast.fail("请输入项目次数");
          return;
        }
        if (!this.projectList.giveEveryTime) {
          Toast.fail("请输入项目时长");
          return;
        }
        query.giveOrderName = this.projectList.giveOrderName;
        query.giveTotalTimes = +this.projectList.giveTotalTimes;
        query.giveEveryTime = +this.projectList.giveEveryTime;
        query.giveProjectTime =
          this.projectList.giveTotalTimes * this.projectList.giveEveryTime;
      }
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      submitOrder(query).then((res) => {
        if (res.code == "000000") {
          // console.log("条用成功")
          Toast.success("购买成功！");
          // this.teacherId = "";
          // this.business = "";
          // this.equipmentId = "";
          this.projectList = {
            name: "",
            phone: "",
            projectName: "",
            projectNum: "",
            projectTime: "",
            projectMoney: "",
            projectList: "",
          };
        } else {
          Toast.fail(res.msg);
        }
      });
    },
  },
};
</script>
<style >
.teacher .van-checkbox__icon {
  font-size: 32px;
}
.add-nav {
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
.add-order {
  width: 200px;
  height: 100%;
}
.add-btn {
  display: flex;
  justify-content: space-between;
  width: 300px;
  height: 100%;
}
.add-btn .van-button--block {
  width: 145px;
}
.add-nav .van-button--round {
  border-radius: 20px;
}
.add-nav .van-button::before {
  border-radius: 20px;
}
.add-nav .van-button::after {
  border: 0;
}
.add-quit img {
  width: 50px;
  height: 40px;
  /* border-radius: 50%; */
}
.add-equipment {
  margin-bottom: 70px;
}
.teacher {
  text-align: left;
  background: #f8f8f8;
  padding-top: 100px;
}
.add_equipment-form {
  padding: 30px;
  background-color: #fff;
}
.form-title {
  display: inline-block;
  width: 120px;
  font-size: 24px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: rgba(51, 51, 51, 1);
  margin-bottom: 30px;
  /* text-align: justify;
  text-align-last: justify; */
  text-align-last: justify;
  -moz-text-align-last: justify; /*兼容firefox*/
  text-align: justify;
  text-justify: distribute-all-lines; /*兼容ie*/
}
.form-items .van-cell {
  height: 80px;
  background: rgba(244, 244, 244, 1);
  border-radius: 20px;
}
/* .form-textarea .van-cell {
  height: 180px;
} */
.form-textarea .van-cell {
  background: rgba(244, 244, 244, 1);
  border-radius: 20px;
  /* line-height: 15px; */
}
.form-textarea .van-cell textarea {
  line-height: 40px;
}
.form-items {
  margin-bottom: 30px;
}
.custom-btn {
  width: 650px;
  height: 100px;
  border-radius: 58px;
  padding: 50px 0;
  margin: 0 auto;
}
.project-message {
  padding: 30px;
  background-color: #fff;
}
</style>