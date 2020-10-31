import Vue from 'vue'
import dayjs from 'dayjs'
// 加载中文语言包
import 'dayjs/locale/zh-cn'
// 引入插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 配置插件
dayjs.extend(relativeTime)
// 全局使用
dayjs.locale('zh-cn')
// 定义全局过滤器
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})
