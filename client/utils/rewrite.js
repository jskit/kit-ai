// 针对 my 挂载的方法进行覆写或扩展，优化增强调用方法
// const mini = require('./mini');
import urlParse from './url-parse/index';
// import h5Map from './h5Map';
import { stringify } from './stringUtil';
import { allPages, tabPages } from './pages';

// const urlParse = URL;

// 对wx变量进行处理
const mini = Object.assign({}, wx);
wx = mini;

if (!wx.alert) {
  wx.alert = function(msg) {
    wx.showToast(msg);
  }
}

// export function delayPromise(ms) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// }

function myRewrite(func, opts, funcName) {
  const funcTemp = func;
  return (options) => {
    let op = options;
    if (funcName === 'showToast' && !op) {
      // showToast content 必须要有值
      op = '数据出错';
    }
    if (funcName === 'showLoading' && !op) {
      // showToast content 必须要有值
      op = '正在加载中';
    }
    if (typeof op === 'string') {
      op = Object.assign({
        title: op,
      }, opts);
    }
    funcTemp(op);
  };
}

function rewrite() {
  // 需要对wx变量处理
  console.log('覆写 wx.showToast，wx.showLoading 方法，需要先处理下wx');

  wx.showToast = myRewrite(wx.showToast, {
    icon: 'none',
    duration: 2000,
    mask: true,
  }, 'showToast');
  wx.showLoading = myRewrite(wx.showLoading, {
    // delay: 2000,
    mask: true,
  }, 'showLoading');

  wx.showErrPage = (message = '', replace = true) => {
    wx.goPage('error', {
      message,
      replace,
    });
  };

  wx.getCurPageUrl = (url = '', params = {}) => {
    let query = { ...params };
    let urlArr = url.split('?');
    let pageName = urlArr[0];
    if (!pageName) return;
    let pagePath = allPages[pageName];
    query = !urlArr[1] ? stringify(query) :
         [stringify(query), urlArr[1]].join('&');
    if (!pagePath) {
      // return {};
      // 提取处理 外部 url 数据
      // const remoteUrl = urlParse(url);
      // const { hash, search } = remoteUrl;
      // console.log(search);
      // let h5PageName = hash;
      // if (/\?/.test(hash)) {
      //   [h5PageName] = hash.split('?');
      // }
      // pageName = h5Map[h5PageName.replace(/#/g, '')];
      // pagePath = allPages[pageName];
      // if(!pagePath) {
      //   wx.showToast('此链接不支持跳转');
      //   return;
      // }
    }
    query = query ? `?${query}` : '';
    return {
      pageName,
      query,
      pagePath: `${pagePath}`,
      pageUrl: `${pagePath}${query}`,
    };
  };
  /**
   * 扩展页面跳转方法，支持内部跳转以及H5 url 映射到小程序内部跳转
   *
   * @param {any} url
   * @param {any} [query={}]
   * @returns
   */
  wx.goPage = (url, query = {}) => {
    if (!url) return;
    const { replace, back } = query;
    let type = replace ? 'replace' : (back ? 'back' : '');
    /* eslint no-param-reassign: 0 */
    delete query.replace;
    delete query.back;
    const { pageName, pagePath, pageUrl } = wx.getCurPageUrl(url, query) || {};
    if (!pagePath) return;
    let page = { url: `../../${pageUrl}` };
    if (tabPages[pageName]) {
      type = 'switch';
      page = { url: `../../${pagePath}` };
    }
    // 注意跳转当前页是无用的
    switch (type) {
      case 'replace':
        wx.redirectTo(page);
        break;
      case 'back':
        wx.navigateBack(page);
        break;
      case 'switch':
        // wx.switchTab: url 不支持 queryString
        wx.switchTab(page);
        break;
      default:
        /* eslint no-undef: 0 */
        if (getCurrentPages().length >= 9) {
          wx.redirectTo(page);
        } else {
          // navigateTo, redirectTo 只能打开非 tabBar 页面。
          // switchTab 只能打开 tabBar 页面。
          wx.navigateTo(page);
        }
        break;
    }
  };
}

module.exports = rewrite;


// // es6 Promise.done() / Promise.finally()
// Promise.prototype.finally = function (callback) {
//   let P = this.constructor;
//   return this.then(
//     value  => P.resolve(callback()).then(() => value),
//     reason => P.resolve(callback()).then(() => { throw reason })
//   );
// };
// if (typeof Promise.prototype.done === 'undefined') {
//   Promise.prototype.done = function (onFulfilled, onRejected) {
//     this.then(onFulfilled, onRejected).catch(function (error) {
//       setTimeout(function () {
//         throw error;
//       }, 0);
//     });
//   };
// }
// var promise = Promise.resolve();
// promise.done(function () {
//   JSON.parse('this is not json');    // => SyntaxError: JSON.parse
// });
