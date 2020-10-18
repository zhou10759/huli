import axios from "../config.js"

// 商家列表
export function businessList(data) {
  const url = "/massage/api/business/businessList"
  return axios.post(url, data)
}

// 设备列表
export function equipmentList({businessId,type}) {
  const url = `/massage/api/equipment/equipmentList?businessId=${businessId}&type=${type}`
  return axios.get(url)
}

// 老师添加设备
export function addEquipment(data) {
  const url = "/massage/api/equipment/addEquipment"
  return axios.post(url, data)
}

// 项目列表
export function projectList({parentId}) {
  const url = "/massage/api/project/projectList?parentId="+parentId
  return axios.get(url)
}

// 项目查询
export function selectProjectList({projectName }) {
  const url = "/massage/api/project/selectProjectList?projectName="+projectName
  return axios.get (url)
}

// 项目详情
export function projectDetails({projectId}) {
  const url = "/massage/api/project/projectDetails?projectId="+projectId 
  return axios.get(url)
}

// 用户登陆
export function login(data) {
  const url = "/massage/api/user/login"
  return axios.post(url, data)
}

// 用户订单
export function userOrder(data) {
  const url = "/massage/api/user/userOrder"
  return axios.post(url, data)
}

// 创建订单
export function submitOrder(data) {
  const url = "/massage/api/user/submitOrder"
  return axios.post(url, data)
}


// 发送请求指令
export function sendOrder(data) {
  const url = "/massage/api/user/sendOrder"
  return axios.post(url, data)
}


// 商家发起请求
export function businessSendOrder(data) {
  const url = "/massage/api/user/businessSendOrder"
  return axios.post(url, data)
}

//用户选择设备 /api/equipment/equipmentListByUser
export function equipmentListByUser({businessId,type}) {
  const url = `/massage/api/equipment/equipmentListByUser?businessId=${businessId}&type=${type}`
  return axios.get(url)
}

//到店离店 
export function teacherToShop(data) {
  const url = `/massage/api/user/teacherToShop`
  return axios.post(url, data)
}

//商家、顾客 商家选择 
export function orderUser(data) {
  const url = `/massage/api/user/orderUser`
  return axios.post(url, data)
}

//老师获取全部列表
export function orderListByBusiness(data) {
  const url = `/massage/api/business/orderListByBusiness`
  return axios.post(url, data)
}

//老师获取全部列表
export function moneyUnsettled(data) {
  const url = `/massage/api/business/moneyUnsettled`
  return axios.post(url, data)
}

//获取openid
export function getOpenId(data) {
  const url = `/massage/api/user/getOpenId`
  return axios.post(url, data)
}



