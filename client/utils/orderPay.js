import api from '../config/api';
import { getQueryString } from './stringUtil';

var app = getApp();

const mini = {
  // {type:3,orderIds:orderIds}
  getOrderPayInfo(param, callback) {
  // 微信支付需添加openId
  Object.assign(param, {
    wxopenid: app.getData('userInfo').wechat_open_id,
  })
  console.log(app.getData('userInfo'));
    wx.showLoading({
        title: "正在加载",
        mask: true
      }
    );
    api.orderPay(param, (res) => {
      this.requestPayment(param.orderIds, res.data.paymentId, res.data.mergeType, res.data, callback);
    }, (err) => {
      // console.log(JSON.stringify(e));
      if (err && err.errmsg) {
        wx.showToast(`${err.errmsg}`);
      } else {
        wx.showToast('数据请求失败');
      }
      if (callback) {
        callback(false, {
          action: 'order-list',
          type: 1,
        });
        return;
      }
      this.forward('order-list', {
        type: 1,
        replace: true,
      });
      return true;
    });
  },
  requestPayment(orderId, paymentId, mergeType, pay, callback) {
    const that = this;
    wx.showLoading({
      title: "正在加载",
      mask: true
    });
    wx.requestPayment({
      ...pay,
      success: (res) => {
        if (res.errMsg != 'requestPayment:ok') {
          if (callback) {
            callback(false, { action: 'order-list', type: 1 });
            return;
          }
          this.forward('order-list', { type: 1, replace: true });
          return;
        }
        this.postMessage('order-list', {
          needRefresh: true,
        });
        api.orderPayConfirm({
          paymentId,
          mergeType,
        }, (res) => {
          switch (mergeType) {
            case 1:
            case 2:
            case 3: {
              if (callback) {
                callback(true, { action: 'order-list', type: 2 });
                return;
              }
              that.forward('order-list', { type: 2, replace: true });
              break;
            }
            case 4:
            case 8: {
              const pinEventId = getQueryString(res.data.url, 'pineventid');
              if (!pinEventId) {
                if (callback) {
                  callback(true, { action: 'order-list', type: 0 });
                  break;
                }
                that.forward('order-list', { type: 0, replace: true });
                break;
              }
              if (callback) {
                callback(true, { action: 'couple-share', pinEventId });
                return;
              }
              that.forward('couple-share', { id: pinEventId, replace: true });
              break;
            }
            default: {
              if (callback) {
                callback(true, { action: 'order-list', type: 0 });
                return;
              }
              that.forward('order-list', {
                type: 0,
                replace: true,
              });
              break;
            }
          }
          // } else {
          //   if (callback) {
          //     callback(false, { action: 'order-list', type: 1 });
          //     return;
          //   }
          //   that.forward('order-list', {
          //     type: 1,
          //     replace: true,
          //   });
          // }
        }, (err) => {
          if (callback) {
            callback(false, { action: 'order-list', type: 0 });
            return;
          }
          that.forward('order-list', {
            type: 0,
            replace: true,
          });
          return true;
        });
      },
      fail: (res) => {
        wx.hideLoading();
        if (callback) {
          callback(false, {
            action: 'order-list',
            type: 1,
          });
          return;
        }
        this.forward('order-list', {
          type: 1,
          replace: true,
        });
      },
      complete: (res) => {
        console.log(JSON.stringify(res));
      },
    });
  },
  onPayComplete(status, data, callback) {
    if (callback) {
      callback(status, { ...data });
      return;
    }
    this.forward(data.action || 'order-list', { ...data, replace: true });
  },
};

module.exports = mini;
