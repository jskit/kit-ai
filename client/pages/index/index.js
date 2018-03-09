// pages/index/index.js
import lifecycle from '../../components/lifecycle/lifecycle';
import api from '../../config/api';
import {
  mixins,
} from '../../utils/index';

Page({
  ...lifecycle,
  ...mixins,
  data: {
    pageName: 'index',
    pageInfo: {
      pageId: 0,
    },
    hidden: true,
    curIndex: 0,
    pages: {
      onItemTap: 'onGridItemTap',
      list: [
        {
          icon: '../../img/view.png',
          title: '汇率转换',
          page: 'index',
          status: 'todo',
        },
        {
          icon: '../../img/basic.png',
          title: '房贷计算',
          page: 'index',
          status: 'todo',
        },
        {
          icon: '../../img/form.png',
          title: '个人所得税',
          page: 'index',
          status: 'todo',
        },
        {
          icon: '../../img/feedback.png',
          title: '人民币大写',
          page: 'rmb',
          status: 'doing',
        },
        {
          icon: '../../img/navigator.png',
          title: '计算器',
          page: 'index',
          status: 'todo',
        },
        {
          icon: '../../img/media.png',
          title: '科学计算器',
          page: 'index',
          status: 'todo',
        },
        {
          icon: '../../img/map.png',
          title: '亲戚称呼计算',
          page: 'index',
          status: 'todo',
        },
        {
          icon: '../../img/canvas.png',
          title: '长度转换',
          page: 'index',
          status: 'todo',
        },
        {
          icon: '../../img/view.png',
          title: '面积转换',
          page: 'index',
          status: 'todo',
        },
        {
          icon: '../../img/view.png',
          title: '体积转换',
          page: 'index',
          status: 'todo',
        },
        {
          icon: '../../img/view.png',
          title: '温度转换',
          page: 'index',
          status: 'todo',
        },
        {
          icon: '../../img/view.png',
          title: '速度转换',
          page: 'index',
          status: 'todo',
        },
        {
          icon: '../../img/view.png',
          title: '时间转换',
          page: 'index',
          status: 'todo',
        },
        {
          icon: '../../img/view.png',
          title: '重量转换',
          page: 'index',
          status: 'todo',
        },
      ]
    },
  },

  onGridItemTap(e) {
    const {
      page,
      index,
      query = this.data.pages.list[index].query,
    } = e.currentTarget.dataset;
    // const page = this.data.pages.list[e.currentTarget.dataset.index].page;
    this.forward(page, query);
  },
});
