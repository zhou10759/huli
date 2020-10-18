<template>
  <div class="add_equipment">
    <div class="line"></div>
    <div class="add_equipment-form">
      <div class="form-items">
        <div class="form-title">老 师 I D</div>
        <van-cell-group>
          <van-field v-model="teacherId" placeholder="请输入老师ID" />
        </van-cell-group>
      </div>
      <div class="form-items">
        <div class="form-title">商 家 选 择</div>
        <van-field
          readonly
          clickable
          name="picker"
          :value="businessId"
          placeholder="商家选择"
          @click="showPicker1 = true"
        />
        <van-popup v-model="showPicker1" position="bottom">
          <van-picker
            show-toolbar
            :columns="businessList"
            @confirm="businessToggle"
            @cancel="showPicker1=false"
          />
        </van-popup>
      </div>
      <div class="form-items">
        <div class="form-title">设 备 选 择</div>
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
            :loading="teacherPickerLoading"
            show-toolbar
            :columns="equipmentList"
            @confirm="equipmentToggle"
            @cancel="showPicker2 = false"
          />
        </van-popup>
      </div>
    </div>
    <div class="add_equipment-sub">
      <van-button
        color="linear-gradient(to right, #6F6F6F , #414141)"
        round
        block
        @click="addEquipment"
      >确定添加</van-button>
    </div>
  </div>
</template>
<script>
import {
  addEquipment,
  businessList,
  equipmentList
} from "../../api/index/index";
import { Toast } from "vant";
export default {
  data() {
    return {
      teacherId: "",
      businessId: "",
      equipmentId: "",
      businessList: [],
      businessListData: [],
      equipmentList: [],
      showPicker1: false,
      showPicker2: false,
      teacherPickerLoading: true
    };
  },
  created() {
    document.title = "添加设备";
    this.getbusinessList();
  },
  methods: {
    addEquipment() {
      if (!this.teacherId) {
        Toast.fail("请输入老师id");
        return;
      }
      if (!this.businessId) {
        Toast.fail("请选择商家");
        return;
      }
      if (!this.equipmentId) {
        Toast.fail("请选择设备");
        return;
      }
      addEquipment({
        businessId: this.getBusinessId(),
        teacherId: this.teacherId,
        equipmentId: this.equipmentId
      }).then(res => {
        if (res.code == "000000") {
         Toast.success("添加成功")
         this.teacherId = "";
         this.equipmentId = "";
         this.businessId = "";
        } else {
             Toast.fail(res.msg)
        }
      });
    },
    getBusinessId() {
      let businessId = "";
      this.businessListData.map((el, i) => {
        if (el.businessName === this.businessId) {
          businessId = el.businessId;
        }
      });
      return businessId;
    },
    openEquipmentList() {
      if (this.businessId) {
        this.showPicker2 = true;
        this.getEquipmentList({ businessId: this.getBusinessId(), type: 0 });
      } else {
        Toast.fail("请先选择商家");
      }
    },
    getbusinessList() {
      businessList().then(res => {
        if (res.code == "000000") {
          this.businessListData = res.data.length > 0 ? res.data : [];
          this.businessList =
            res.data.length > 0 ? res.data.map(el => el.businessName) : [];
        }
      });
    },
    getEquipmentList(data) {
      equipmentList(data).then(res => {
        if (res.code == "000000") {
          this.equipmentListData = res.data.length > 0 ? res.data : [];
          this.equipmentList =
            res.data.length > 0 ? res.data.map(el => el.equipmentId) : [];
          this.teacherPickerLoading = false;
        }
      });
    },
    businessToggle(val) {
      this.businessId = val;
      this.showPicker1 = false;
    },
    equipmentToggle(val) {
      this.equipmentId = val;
      this.showPicker2 = false;
    }
  }
};
</script>
<style scope >
.add_equipment {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  text-align: left;
  height: 100%;
  background-color: rgba(248, 248, 248, 1);
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
  display: block; /*ie下需设为block*/
}
.form-items .van-cell {
  height: 80px;
  line-height: 70px;
  background: rgba(244, 244, 244, 1);
  border-radius: 20px;
}
.form-items {
  margin-bottom: 30px;
}
.add_equipment-sub {
  width: 650px;
  height: 100px;
  border-radius: 58px;
  position: fixed;
  bottom: 50px;
  left: 50%;
  margin-left: -325px;
}
</style>