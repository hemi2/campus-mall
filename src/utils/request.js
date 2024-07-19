import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'

//部署模式
// axios.defaults.baseURL = "http://192.168.3.32:9090/api"; 
// axios.defaults.baseURL = "http://localhost:9090/api"; 

//开发模式
axios.defaults.baseURL = "http://192.168.3.32:8082/api";

// 创建一个axios对象出来
const request = axios.create({
    timeout: 5000
})

// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(config => {

    if (store.getters.token) {
        // let each request carry token
        // ['X-Token'] is a custom headers key
        // please modify it according to the actual situation
        config.headers['token'] = getToken()
    }

    return config
}, error => {
    return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        // response.data即为后端返回的Result
        let res = response.data;
        // 兼容服务端返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        return res;
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)


export default request