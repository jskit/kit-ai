
import { allPages, defaultPage } from './pages';
import urlMap from './urlMap';
import { stringify } from './stringUtil';
// import api from '../config/api';

const messages = {};
let msgPages = {};

// mixin 方法，提供混入
// 绑定事件或触发类事件 全用 on 开头
// 自调用事件，不用 on 开头
const mixins = {
  // onLog() {
  //   // 日志方法
  //   console.log('log');
  // },
  onShareAppMessage() {
    return this.getShareInfo();
  },
  /**
   * onLoad 内调用，会检测 pageName 以及 query
   *
   * - 保存 query 数据(数据全保存在 this.data 下)
   * - 初始化分享信息
   *   - 先设置 shareInfo 为 true; 启用分享
   *   - 随后可以更新分享信息保存在 this.shareInfo
   *
   * @param {any} query
   */
  onPageInit(query) {
    // if (!this._data) this._data = {};
    this.setQuery(query);

    // 是否要所有页面全开启分享信息
    // if (this.data.shareInfo) {
    //   this.onShareAppMessage = () => {
    //     console.log('设置分享信息');
    //     console.log(this.getShareInfo());
    //     return this.getShareInfo();
    //   };
    // } else {
    //   delete this.onShareAppMessage;
    // }
    // wx.on('')
    // wx.onUserCaptureScreen(() => {
    //   wx.showToast('收到用户截屏事件');
    // });
    // {
    //   isConnected: false,
    //   networkType: none, // wiki 4g
    // }
    // wx.onNetworkStatusChange((res) => {
    //   console.log(res);
    //   if (res.isConnected) {
    //     wx.showToast('呀，网络丢了~~');
    //   }
    // });

    // 这里有问题
    const pagesArr = getCurrentPages();
    msgPages = {};
    pagesArr.forEach((pageItem, index) => {
      const { pageName, pageId, route } = pageItem;
      // 弱实现，消息标识只记录同类的第一个页面
      if (!msgPages[pageName]) {
        const msgKey = `${pageName}:${pageId}`;
        msgPages[pageName] = msgKey;
        const message = messages[msgKey];
        // if (message && message.needRefresh) {
        //   pageItem.refresh();
        //   delete messages[msgKey];
        // }
      }
    });
    console.log(msgPages);

    // console.log($global);
    // wx.alert({
    //   title: `${$global.appImpl.$launchTime}`,
    // });
    // api.getProfile({}, (res) => {
    //   console.log('userInfo');
    //   console.log(res.data);
    // }, (err) => {
    //   console.log(err);
    // });
  },

  setHeaderTitle(title) {
    wx.setNavigationBarTitle({
      title,
    });
  },

  setQuery(query = {}) {
    const pageName = this.getPageName();
    Object.assign(this, {
      pageName,
      pageId: Date.now(),
      pageQuery: query,
    });
    if (!pageName) {
      console.error('页面不存在');
    }
  },

  // page.json 支持 optionMenu 配置导航图标，点击后触发 onOptionMenuClick
  onOptionMenuClick(e) {
    console.log('optionMenu', e);
  },

  getPageName() {
    const { pageName, route = '' } = this;
    return pageName || route.split('/').reverse()[0] || defaultPage;
  },

  getShareInfo() {
    const { shareInfo } = this.data;
    // const { pageQuery = {} } = this;
    // let { pageUrl } = wx.getCurPageUrl(this.getPageName(), this.pageQuery);
    // if (!shareInfo || shareInfo === false) {
    //   pageUrl = defaultPage;
    // }
    return Object.assign({
      title: '好食期',
      desc: '专注食品特卖平台，品牌食品2折起~',
      // imageUrl: 'https://static.doweidu.com/static/hsq/images/logo_fdfe8f30f2.png', // 默认可以设置 logo
      // path: pageUrl,
      success() {
        // wx.showToast('分享成功');
      },
      fail() {
        // wx.showToast('分享失败');
      },
    }, shareInfo);
  },

  // 绑定跳转
  onUrlPage(e) {
    const { url, index } = e.currentTarget.dataset;
    console.log(`${(url || '无需跳转')}, ${index}`);
    const map = urlMap(url);
    const currentPage = this.getPageName();
    // if(!map.page && currentPage !== pages.defaultPage) {
    //   map.page = pages.defaultPage;
    // }
    console.log(`jump: ${map.page} <- ${url}`)
    if (!map.page || map.page === currentPage) {
      console.log('暂不支持跳转当前页面');
      return;
    };
    wx.goPage(map.page, map.query);
  },

  // 页面跳转
  forward(page, query = {}) {
    console.log('forward: ', page);
    if (page === 'login' || query.refresh) {
      Object.assign(query, {
        ref: this.getPageName(),
        needRefresh: true,
      });
    }
    wx.goPage(page, query);
  },

  back(step, query = {}) {
    let opts;
    if (typeof step === 'number' || typeof step === 'undefined') {
      opts = {
        delta: step || 1,
      };
    } else if (typeof step === 'string') {
      opts = {
        url: `${step}?${stringify(query)}`,
      };
    }
    wx.navigateBack(opts);
  },

  refresh() {
    console.info('need refresh => do onLoad();');
    this.onLoad();
  },

  postMessage(page, opts = {}) {
    if (!allPages[page] && !msgPages[page] || page === this.getPageName() ) {
      console.info(`无法给 ${page} 页面发消息`);
      return;
    }
    const msgKey = msgPages[page];
    if (!messages[msgKey]) messages[msgKey] = {};
    Object.assign(messages[msgKey], opts);
    const msg = messages[msgKey];
    return messages[msgKey];
  },

  onMessage() {
    const page = this.getPageName();
    const msgKey = msgPages[page];
    let message;
    if (allPages[page] || messages[msgKey]) {
      message = messages[msgKey] || {};
      delete messages[msgKey];
      if (message.needRefresh) {
        // wx.showToast('触发刷新');
        this.refresh();
        delete messages[msgKey];
        // wx.trigger({
        //   hsq: 'refresh',
        // });
      }
    }
    return message || {};
  },
  goService() {
    // data
    var detailData = this.data.detailData;
    var nowPageName = this.getPageName();
    var data = {};
    switch (nowPageName){
      case 'detail':
        data = {
          accountid: detailData.merchant_id,
          id: detailData.id,
          title: detailData.name,
          price: detailData.price,
          marketPrice: detailData.market_price,
          thumbnail: detailData.thumbnail,
          detailType: nowPageName == 'detail' ? 1 : 2,
          h5Link: detailData.h5Link || '',
          unit: detailData.unit || 1,
          name: detailData.merchantInfo.name,
          udeskMId: detailData.merchantInfo.udesk_merchant_id || '',
        }
        break;
      case 'profile':
        data = {}
        break;
      case 'order-detail':
        data = {
          accountid: detailData.merchant_id || '',
          name: detailData.merchantName || '',
          udeskMId: detailData.udesk_merchant_id || '',
        }
        break;
      default:
        // do nothing
    }
    this._compact(data);
    this.forward('service', data);
  },
  // 处理对象
  _compact(obj){
    for (var item in obj){
      obj[item] = decodeURIComponent(obj[item]);
      if(!obj[item]){
        delete obj[item];
      }
    }
    return obj;
  },
  dealParams(params) {
    var str = ''
    for (var item in params) {
      str += encodeURIComponent(item) + '=' + encodeURIComponent(params[item]) + '&'
    }
    return str
  }
};

module.exports = mixins;

