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
        // icon 颜色 #0f8ee9
        // {
        //   icon: '../../img/view.png',
        //   title: '汇率转换',
        //   page: 'index',
        //   status: '',
        // },
        // {
        //   icon: '../../img/basic.png',
        //   title: '房贷计算',
        //   page: 'index',
        //   status: 'todo',
        // },
        // {
        //   icon: '../../img/form.png',
        //   title: '个人所得税',
        //   page: 'index',
        //   status: 'todo',
        // },
        {
          icon: '../../img/rmb.png',
          title: '人民币大写',
          page: 'rmb',
          status: 'done',
        },
        // {
        //   icon: '../../img/navigator.png',
        //   title: '计算器',
        //   page: 'index',
        //   status: 'todo',
        // },
        // {
        //   icon: '../../img/api_device.png',
        //   title: '科学计算器',
        //   page: 'index',
        //   status: '',
        // },
        // {
        //   icon: '../../img/map.png',
        //   title: '亲戚称呼计算',
        //   page: 'index',
        //   status: 'todo',
        // },
        // {
        //   icon: '../../img/canvas.png',
        //   title: '手机号归属地查询',
        //   page: 'phone',
        //   status: '',
        // },
        // {
        //   icon: '../../img/canvas.png',
        //   title: '银行卡开户行查询', // 查询银行卡卡种及开户行
        //   page: 'bank',
        //   status: '',
        // },
        // {
        //   icon: '../../img/map.png',
        //   title: '获取本机公网、内网IP',
        //   page: 'ip',
        //   status: '',
        // },
        // {
        //   icon: '../../img/canvas.png',
        //   title: '排行榜',
        //   page: 'rank',
        //   status: '',
        // },
        // {
        //   icon: '../../img/canvas.png',
        //   title: '读书',
        //   page: 'book',
        //   status: '',
        // },
        // {
        //   icon: '../../img/canvas.png',
        //   title: '长度转换',
        //   page: 'index',
        //   status: '',
        // },
        // {
        //   icon: '../../img/media.png',
        //   title: '面积转换',
        //   page: 'index',
        //   status: '',
        // },
        // {
        //   icon: '../../img/icon_component_HL.png',
        //   title: '体积转换',
        //   page: 'index',
        //   status: '',
        // },
        // {
        //   icon: '../../img/api_rsa.png',
        //   title: '温度转换',
        //   page: 'index',
        //   status: '',
        // },
        // {
        //   icon: '../../img/api_network.png',
        //   title: '速度转换',
        //   page: 'index',
        //   status: '',
        // },
        // {
        //   icon: '../../img/biz_collapse.png',
        //   title: '时间转换',
        //   page: 'index',
        //   status: '',
        // },
        // {
        //   icon: '../../img/biz_grid.png',
        //   title: '重量转换',
        //   page: 'index',
        //   status: '',
        // },
      ],
    },
  },

  onGridItemTap(e) {
    const {
      page,
      index,
      query = this.data.pages.list[index].query,
    } = e.currentTarget.dataset;
    // const page = this.data.pages.list[e.currentTarget.dataset.index].page;
    // 注意要防止双击行为
    this.forward(page, query);
  },
});
