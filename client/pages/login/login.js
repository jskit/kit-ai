
// 此页面作为一个权限检测页面
import api from '../../config/api';
import {
  mixins,
} from '../../utils/index';

const app = getApp();

Page({
  ...mixins,
  data: {
    content: '正在登录中...',
    cantry: false,
  },
  onLoad(query) {
    // wx.alert({
    //   title: JSON.stringify(query),
    // });
    this.onPageInit(query);
  },
  onShow() {
    wx.showLoading();
    this.goLogin();
  },
  onUnload() {
    // 页面被关闭时
    // app.checkAuth();
  },
  sendRefreshMessage() {
    const { ref, needRefresh } = this.pageQuery;
    if (ref && needRefresh) {
      this.postMessage(ref, {
        needRefresh: true,
      });
    }
  },
  login(data) {
    api.login({
      type: 2,
      ...data,
    }, (res) => {
      const { data } = res;
      const userId = data.user_id;
      // data.userId = userId;
      if (userId) {
        this.sendRefreshMessage();
        this.setData({
          content: '登录成功!',
          cantry: false,
        });
        app.updateData({
          userInfo: data,
        });
        console.log('登录成功');
      } else {
        wx.showToast('用户登录信息有误，请重新登录');
        this.setData({
          content: '用户登录信息有误!',
          cantry: true,
        });
      }
      this.loginBack();
    }, (err) => {
      this.setData({
        content: '登录失败!',
        cantry: true,
      });
      // this.loginBack();
      return true;
      // console.log(err);
    });
  },
  loginBack() {
    setTimeout(() => {
      wx.navigateBack();
    }, 800);
  },
  goLogin() {
    // 登录前，先清除下之前登录相关的缓存数据
    app.resetData();
    this.getAuth((data) => {
      // res = {
      //   authErrorScopes: {},
      //   authSuccessScopes: [],
      //   authCode: '',
      // }
      this.login(data);
    }, (err) => {
      // console.log(err);
      const step = parseInt(this.data.step || 2, 10);
      this.back(step > 1 ? step : null);
    });
  },
  getAuth(resolve, reject) {
    const that = this;
    wx.login({
      success(auth) {
        if (auth.code) {
          wx.getUserInfo({
            withCredentials: true,
            lang: 'zh_CN',
            success(res) {
              console.info(res);
              resolve({
                code: auth.code,
                // userInfo: res.userInfo,
                encryptedData: encodeURIComponent(res.encryptedData),
                iv: encodeURIComponent(res.iv),
              });
              console.log(res);
            },
            fail(err = {}) {
              // {errMsg: "getUserInfo:fail auth deny"}
              if (err.errMsg === 'getUserInfo:fail auth deny') {
                // 获取用户信息授权失败，展示引导
                that.setData({
                  content: '获取用户信息授权失败，你需要开启授权：右上角 -> 点击“关于好食期” -> 右上角 -> 点击“设置” -> 允许使用“用户信息”',
                  cantry: false,
                });
              } else {
                wx.showToast(err.errMsg);
                that.loginBack();
              }
            },
          });
        } else {
          wx.showToast('未获取到授权码');
        }
      },
      fail(err) {
        // console.log(err);
        // wx.alert({
        //   title: 'err: ' + JSON.stringify(err),
        // });
        const message = '获取授权失败，前重新授权';
        wx.showToast(message);
        reject(message);
      },
    });
  },
  onClick(e) {
    const { type } = e.currentTarget.dataset;
    switch (type) {
      case 'login':
        this.goLogin();
        break;
      default:
        // do nothing
        break;
    }
  },
});
