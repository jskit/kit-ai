
// import _request from '../utils/request';
// import env from './env';
// import { version } from '../app.json';

import env from './env';
import _request from '../utils/request';
import { stringify } from '../utils/stringUtil';

// console.log(_request)
// console.log("_request")

const version = '2.8.0';

const regHttp = /^https?/i;

function request(url, options, success, fail) {
  const originUrl = regHttp.test(url) ? url : `${env.apiBaseUrl}${url}`;
  return _request(originUrl, options, success, fail);
}

/**
 * API 命名规则
 * - 使用 camelCase 命名格式（小驼峰命名）
 * - 命名尽量对应 RESTful 风格，`${动作}${资源}`
 * - 假数据增加 fake 前缀
 * - 便捷易用大于规则，程序是给人看的
 *
 * - 主站流程使用默认，不带标识
 * - 积分相关应有标识 point
 * - 拼团相关应有标识 couple
 */

const modelApis = {
  // 初始化配置
  test: '/test',
  getConfig: '/common/initconfig',
  // 积分兑换
  getPointIndex: '/point/index',
  getPointList: '/point/skulist',
  getPointDetail: '/point/iteminfo',
  getPointDetaiMore: '/product/productdetail',
  getRList: '/point/recommenditems',
  // 专题
  getPointTopicInfo: '/point/topicinfo',
  getPointTopicList: '/point/topicbuskulist',
  // 主站专题
  getTopicInfo: '/product/topicskusinfo',
  getTopicList: '/product/topicskulist',
  // 个人中心
  getProfile: '/user/usercenter',
  // 拼团相关
  getCoupleList: '/product/coupleskulist',
  getCoupleDetail: '/product/coupleskudetail',
  getMerchantList: '/merchant/coupleskulist',
  coupleOrderInit: 'POST /order/coupleorderinit',
  coupleOrderList: '/user/usercouplelist',
  coupleOrderDetail: '/user/usercoupleorderdetail',
  coupleUserList: '/market/pinactivitiesuserlist', // 分享页拼团头像列表
  coupleShareDetail: '/user/coupleactivitiedetail', // 分享详情

  // 首页
  getIndex: '/common/index',

  // 主流程
  orderInit: 'POST /order/orderinit',
  orderSubmit: 'POST /order/submitorder',
  orderPay: 'POST /order/orderpay',
  orderPayConfirm: '/order/orderpayconfirm', // 确认支付状态
  getUserOrders: '/order/getuserorders', // 订单列表
  getNeedCommentOrders: '/order/waitcommentlist', // 待评论
  getUserRefundorders: '/order/userrefundorder', // 退款
  getUserServiceOrders: '/order/userserviceorders', // 售后
  orderCancel: 'POST /order/cancelorder', // 取消订单
  orderDetail: '/order/orderdetail',
  confirmReceived: 'POST /order/userorderconfirm', // 确认收货
  orderComplaint: 'POST /refund/complaint', // 订单申诉
  // 积分订单相关
  pointOrderInit: 'POST /tradecenter/pointorderpreview',
  pointOrderSubmit: 'POST /tradecenter/pointordersubmit',
  pointOrderCancel: 'POST /tradecenter/ordercancel',
  pointOrderList: '/tradecenter/orderlist',
  pointOrderDetail: '/tradecenter/orderinfo',
  pointOrderSuccess: '/tradecenter/ordersuccess',

  // 退款相关
  refundInit: '/refund/init',
  refundDetail: '/refund/detail',
  refundApply: 'POST /refund/apply',
  // 登录注销
  login: 'POST /user/login',
  logout: 'POST /user/logout',
  // 地址管理
  addressList: '/user/addresslist',
  addAddress: 'POST /user/addaddress',
  updateAddress: 'POST /user/updateaddress',
  setDefaultAddress: 'POST /user/setdefaultaddress',
  deleteAddress: 'POST /user/deleteaddress',
  provinceList: '/nation/provincelist',
  cityList: '/nation/citylist',
  districtList: '/nation/districtlist',
  // 查看物流
  getDelivery: '/order/deliverymessage',
  // 获取七牛 token
  getQiniuToken: '/common/qiniutoken',
  // udesk
  getUdesk: '/user/getudesk',
};

const commonParams = {
  token: '',
  uid: '',
  zoneId: '857',  // 当前收货省份
  uuid: '',       // 用户唯一标志
  udid: '',       // 设备唯一标志
  timestamp: '',  // 时间
  channel: 'wxapp', // 渠道
  // cpsName: '',    // 废弃
  spm: 'wxapp',
  v: version,  // 系统版本，用于获取最新版数据
  terminal: 'wxapp',// 系统版本，用于获取最新版数据
  device: '',     // 设备
  swidth: '',     // 屏幕宽度
  sheight: '',    // 屏幕高度
  /* eslint appx/no-appx-globals: 0 */
  location: '',   // 地理位置
  net: '',        // 网络
  appid: 'wxa090d3923fde0d4b',
};

// console.log(Object.keys(modelApis))

const models = Object.keys(modelApis).reduce((api, key) => {
  /* eslint no-param-reassign: 0 */
  const val = modelApis[key];
  const [url, method = 'GET'] = val.split(/\s+/).reverse();
  // method = method.toUpperCase();
  // let originUrl = regHttp.test(url) ? url : `${env.apiBaseUrl}${url}`;
  switch (method) {
    case 'POST':
      // originUrl = `${originUrl}`;
      api[key] = (params, success, fail) => {
        return request(url, {
          method,
          data: Object.assign({}, getCommonParams(), params),
        }, success, fail);
      };
      break;
    case 'GET':
    default:
      api[key] = (params, success, fail) => {
        params = Object.assign({}, getCommonParams(), params)
        return request(`${url}?${stringify(params)}`, {}, success, fail);
      };
      break;
  }
  return api;
}, {});

function setCommonParams(params) {
  return Object.assign(commonParams, params);
}

function getCommonParams() {
  return { ...commonParams };
}

models.getCommonParams = getCommonParams;
models.setCommonParams = setCommonParams;

console.log(models);

module.exports = models;
