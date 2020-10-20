import axios from 'axios'
import qs from 'qs'
const Axios = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? '/message' : 'http://massage.1mmkj.com',
    timeout: 20000,
    responseType: 'json',
    withCredentials: true, // 是否允许带cookie这些
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    }
})

let CancelToken = axios.CancelToken

// POST传参序列化(添加请求拦截器)
Axios.interceptors.request.use(
    config => {
        // 在发送请求之前做某件事
        if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
            config.data = qs.stringify(config.data)
        }
        return config
    },
    error => {
        return Promise.reject(error.data.error.message)
    }
)

// 返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
    res => {
        if (res.data) {
            return new Promise((resolve) => {
                resolve(res.data)
            })
        } else {
            return Promise.reject('请求异常')
        }
    },
    error => {
        if (error.message) {
            return Promise.reject(error.message)
        }
        // 返回 response 里的错误信息
        const errorInfo = error.data.error ? error.data.error.message : error.data
        return Promise.reject(errorInfo)
    }
)

export default Axios