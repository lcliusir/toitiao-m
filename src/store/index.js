import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage'

Vue.use(Vuex)

const TAKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    // 获取token
    user: getItem(TAKEN_KEY)
  },
  mutations: {
    setUser(state, data) {
      state.user = data
      // 保存token
      setItem(TAKEN_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
