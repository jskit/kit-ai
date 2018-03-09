const pullList = {
  // 滚动记载常用配置
  pullParamsDefault: {
    pageNum: 1,
    pageLimit: 20,
    needPagination: 1,
  },
  pullParams: {},
  hasMore: true,
  pullModel: null,
  bottomLoading: true,

  // 下拉刷新
  onPullDownRefresh() {
    // this.initPullList();
    if (typeof this.refresh === 'function') {
      this.refresh();
    }
  },

  // 加载更多
  onScrollToLower() {
    console.log('触发滚动加载');
    if (!this.hasMore) {
      // wx.hideLoading();
      console.log('没有更多数据了');
      return;
    }

    // Object.assign(this.pullParams);

    // this.pullModel = api.getPointList
    this.pullModel({
      ...this.pullParamsDefault,
      ...this.pullParams,
    }, (res) => {
      this.stopPullDownRefresh();
      this.setData({
        timestamp: res.timestamp,
        diffTime: res.timestamp * 1000 - Date.now(),
      });
      this.dealData(res.data);
    }, (err) => {
      this.stopPullDownRefresh();
      console.log(err);
      if (err.errno === 510010) {
        this.forward('login');
        return true;
      }
    });
  },

  stopPullDownRefresh() {
    if (this.pullParams.pageNum === 1) {
      wx.stopPullDownRefresh();
    }
  },

  dealData(data = {}) {
    const { pageNum } = this.pullParams;
    this.hasMore = data.totalPage > pageNum;
    if (pageNum === 1) {
      this.setData({
        list: [],
      });
    }
    if (this.hasMore) {
      this.pullParams.pageNum += 1;
    }
    this.setData({
      bottomLoading: this.hasMore,
      showFooter: !this.hasMore,
    });
    if (typeof this.dealList === 'function') {
      const { list = [] } = data;
      let temp = [];
      if (list.length) {
        temp = this.dealList(list) || [];
        if (!temp) {
          wx.showToast('处理数据返回格式有问题');
          return;
        }
      } else {
        console.log('无数据');
        this.setData({
          list: [],
        });
        return;
      }
      /* eslint no-param-reassign: 0 */
      data.list = temp;
    }
    const { list = [] } = this.data;
    this.setData({
      list: [
        ...list,
        ...data.list,
      ],
    });

    if (typeof this.afterPullData === 'function') {
      this.afterPullData();
    }
  },
  initPullList() {
    this.pullParams.pageNum = 1;
    this.hasMore = true;
  },
};

module.exports = pullList;

