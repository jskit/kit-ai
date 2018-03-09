/**
 * @fileOverview 微信小程序的入口文件
 */

import { openIdUrl } from './config';

import api from './config/api';
import rewrite from './utils/rewrite';
// import { default as MiniApp, test } from './utils/MiniApp';
// import MiniApp from './utils/MiniApp';

// console.log(MiniApp);
// test(123);
// 覆写小程序内部分方法(要启动时就调用执行)
rewrite();

const defalutGlobalData = {
  addressInfo: {},
  userInfo: {},   // 用户信息
  systemInfo: {}, // 系统信息
  netInfo: {},    // 网络信息
  addressId: null,
  qnInfo: {}, // 七牛 token 等
  location: '',
};
let globalData = { ...defalutGlobalData };
// 初始化
wx.getStorage({
  key: 'globalData',
  success(res) {
    Object.assign(globalData, res.data);
  },
});

console.log('wx:', wx)

App({
  onLaunch() {
    console.log('App Launch')
    wx.getSystemInfo({
      success: (res) => {
        this.updateData({
          systemInfo: res,
        });
      },
    });
    wx.getLocation({
      cacheTimeout: 300,
      success: (res) => {
        this.updateData({
          location: `${res.longitude},${res.latitude}`,
        });
      },
      fail: (err = {}) => {
        // {
        //   error: 11,
        //   errorMessage: 'xxx',
        // }
        this.updateData({
          location: '',
        });
        wx.alert({
          title: `${err.error}: ${err.errorMessage}`,
        });
      },
    });
    // 保持屏幕常亮
    // wx.setKeepScreenOn({
    //   keepScreenOn: true,
    // });
  },
  onShow() {
    console.log('App Show')
    // wx.showToast('demo testing');
    wx.getNetworkType({
      success: (res) => {
        console.log(res);
        // if (!res.networkAvailable) {
        //   wx.showToast('网络不可用，请稍后重试...');
        // }
        this.updateData({
          netInfo: res,
        });
      },
    });
    // this.checkAuth();
  },
  onHide() {
    console.log('App Hide')
  },
  globalData: {
    hasLogin: false,
    openid: null
  },
  // lazy loading openid
  getUserOpenId(callback) {
    var self = this

    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      wx.login({
        success: function(data) {
          wx.request({
            url: openIdUrl,
            data: {
              code: data.code
            },
            success: function(res) {
              console.log('拉取openid成功', res)
              self.globalData.openid = res.data.openid
              callback(null, self.globalData.openid)
            },
            fail: function(res) {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
              callback(res)
            }
          })
        },
        fail: function(err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  },

  checkAuth() {
    console.info('globalData');
    console.info(globalData);
    // 是否登录状态，判断 token 以及 userId;
    const { userInfo = {} } = this.getData();
    if (userInfo.token && userInfo.user_id) {
      // console.log('用户已登录');
      // wx.showToast('您已登录');
      return true;
    }
    // this.goLogin();
  },
  goLogin() {
    wx.goPage('login');
  },
  updateData(options = {}, reset) {
    if (reset) {
      globalData = { ...defalutGlobalData };
      wx.removeStorage({
        key: 'globalData',
        success() {
          console.log('reset 数据成功');
        },
      });
    } else {
      Object.assign(globalData, options);
      wx.setStorage({
        key: 'globalData',
        data: globalData,
        success() {
          console.log('写入数据成功');
        },
      });
    }
    const data = this.getData();
    this.updateCommonParams(data);
    return data;
  },
  updateCommonParams(data = {}) {
    const {
      userInfo = {},
      systemInfo = {},
      netInfo = {},
    } = data;
    api.setCommonParams({
      token: userInfo.token,
      uid: userInfo.user_id,
      uuid: userInfo.user_id,
      terminal: 'wxapp', // 系统版本，用于获取最新版数据
      device: systemInfo.brand,      // 设备
      swidth: systemInfo.windowWidth,      // 屏幕宽度
      sheight: systemInfo.windowHeight,    // 屏幕高度
      // location: '',   // 地理位置
      net: netInfo.networkType,        // 网络
    });
  },
  resetData() {
    this.updateData(null, true);
  },
  getData(key) {
    return globalData[key] ? { ...globalData[key] } : { ...globalData };
  },
  getUserInfo() {
    const { userInfo = {} } = this.getData();
    return userInfo;
  },
});
