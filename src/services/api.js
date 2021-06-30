//跨域代理前缀
const API_PROXY_PREFIX='/question'
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  LOGIN: `${BASE_URL}/admin_login/`,
  ROUTES: `${BASE_URL}/routes`,
  GOODS: `${BASE_URL}/goods`,
  GOODS_COLUMNS: `${BASE_URL}/columns`,
  GET_ALL_QUESTION: `${BASE_URL}/get_all_question/`,
  GET_QUESTION_DETAIL: `${BASE_URL}/get_question_detail/`,
  DELETE_QUESTION: `${BASE_URL}/delete_question/`,
  GET_ALL_GAOGUAN: `${BASE_URL}/get_gaoguanmail/`,
  DELETE_GAOGUAN: `${BASE_URL}/delete_gaoguan/`,
  GET_GAOGUAN_DETAIL: `${BASE_URL}/get_gaoguan_detail/`,
  EXPORT_GAOGUAN: `${BASE_URL}/export_gaoguan/`,
  DELETE_ANSWER: `${BASE_URL}/delete_answer/`,
}
