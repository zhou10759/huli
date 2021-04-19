<template>
  <div class="subOrder">
    <div class="form">
      <div class="form-items">
        <span class="form-items-title">项目金额：</span>
        <input type="text" v-model="projectList.projectMoney" class="form-items-input" />
        <span class="form-items-tips">元</span>
      </div>
      <div class="form-items">
        <span class="form-items-title">项目时长：</span>
        <input type="text" v-model="projectList.projectTime" class="form-items-input" />
        <span class="form-items-tips">分/次</span>
      </div>
      <div class="form-items">
        <span class="form-items-title">项目次数：</span>
        <input type="text" v-model="projectList.projectNum" class="form-items-input" />
        <span class="form-items-tips">次</span>
      </div>
      <div class="form-items">
        <span class="form-items-title">姓名：</span>
        <input type="text" v-model="projectList.name" class="form-items-input" />
        <span class="form-items-tips"></span>
      </div>
      <div class="form-bg">
        <div style="margin-bottom: 15px">赠送：</div>
        <div class="form-items">
          <span class="form-items-title">项目时长：</span>
          <input type="text" v-model="projectList.name" class="form-items-input" />
          <span class="form-items-tips">分/次</span>
        </div>
        <div class="form-items">
          <span class="form-items-title">项目次数：</span>
          <input type="text" v-model="projectList.name" class="form-items-input" />
          <span class="form-items-tips">次</span>
        </div>
      </div>
      <div class="form-items">
        <span class="form-items-title">备注：</span>
        <textarea v-model="projectList.remarks" name="" id="" cols="30" rows="4"></textarea>
      </div>
    </div>
    <div class="form-sub">
      <button>下单</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
    };
  },
};
</script>

<style socpe>
.subOrder {
  text-align: left;
  padding: 30px;
  background-color: #f5f5f5;
  height: 100vh;
}
.form-bg {
  background-color: #ddd;
  padding: 15px;
  margin: 20px 0;
  border-radius: 20px;
}
.form-items-title {
  display: inline-block;
  width: 160px;
}
.form-sub {
  margin-top: 150px;
  text-align: center;
}
.form-sub button {
  width: 200px;
  height: 60px;
  background-color: #07c160;
  border: 1px solid #07c160;
  color: #fff;
  transition: opacity 0.2s;
  position: relative;
}
.form-sub button:active::before {
  opacity: 0.1;
}
.form-sub button::before {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background-color: #000;
  border: inherit;
  border-color: #000;
  border-radius: inherit;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  opacity: 0;
  content: " ";
}
</style>