import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { MessageBox, Message } from 'element-ui'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    email: '',
    role: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        if (response.code === '0') {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve(data)
          Message({
            message: '登录成功',
            type: 'success'
          })
        }
        else {
          Message({
            message: response.msg,
            type: 'error'
          });
          reject(response.msg)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        if (response.code === '0') {
          const { data } = response
          const { userName: name, avatar, email, role:role } = data
          if (!role || role.length <= 0) {
            reject('getInfo: role must be a non-null array!')
          }
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_EMAIL', email)
          commit('SET_ROLE', role)
          resolve(data)
        } else {
          reject(response.msg)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },


  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

