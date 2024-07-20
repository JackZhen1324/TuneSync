// 封装后的axios
import axios from 'axios'
import { TIMEOUT } from './config'

const instance = axios.create({
	timeout: TIMEOUT,
})

// 请求拦截器 在发起http请求之前的一些操作
// 1、发送请求之前，加载一些组件
// 2、某些请求需要携带token，如果说没有没有携带，直接跳转到登录页面
instance.interceptors.request.use(
	(config) => {
		config.params = {
			api_key: 'cff50af5e282bff668e6439cc947756f',
			format: 'json',
			...config.params,
		}

		return config
	},
	(err) => {
		return err
	},
)

// 响应拦截器
instance.interceptors.response.use(
	({ data }) => {
		return data
	},
	(err) => {
		if (err && err.response) {
			console.log('err && err.response', err && err.response)

			switch (err.response.status) {
				case 400:
					console.log('请求错误')
					break
				case 401:
					console.log('未认证')
					break
				default:
					console.log('其他信息错误')
			}
		}
	},
)

export default instance