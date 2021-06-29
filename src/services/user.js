import {LOGIN, ROUTES} from '@/services/api'
import {request, METHOD, removeAuthorization} from '@/utils/request'
import Cookie from "js-cookie";
import axios from "axios";

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(name, password) {
  await request(LOGIN, METHOD.GET, {
  })
  let csrf_token = Cookie.get(axios.defaults.csrfHeaderName)
  console.log(csrf_token)
  var searchParams = new URLSearchParams();
  searchParams.append('csrfmiddlewaretoken', csrf_token)
  searchParams.append('admin_user', name)
  searchParams.append('admin_pwd', password)
  return request(LOGIN, METHOD.POST, searchParams)
}

export async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET)
}

/**
 * 退出登录
 */
export function logout() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  removeAuthorization()
}
export default {
  login,
  logout,
  getRoutesConfig
}
