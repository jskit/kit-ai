// pages/calculator/calculator.js
// import convertCurrency from './convertCurrency';

const defaultValue = {
  input: '0',
  formatInput: '0',
  output: '0',
  styleSmall: '',
};

// const rmbReg = /^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/;
function formatCurrency(value, len = 4) {
  // return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  // 人民币更适用四位分割
  let num = (value || 0).toString();
  const index = num.indexOf('.');
  let cents;
  if (index > -1) {
    // 有小数点时
    cents = num.substr(index);
    num = num.substring(0, index);
  }
  let result = '';
  while (num.length > len) {
    result = ',' + num.slice(-len) + result;
    num = num.slice(0, num.length - len);
  }
  if (num) { result = num + result; }
  return !cents ? result : `${result}${cents}`;
}

Page({
  data: {
    ...defaultValue,
  },

  onTap(e) {
    let { value = '' } = e.target.dataset;
    // 不同按键处理逻辑
    // -1 代表无效按键，直接返回
    if (value == -1) return false;

    switch (String(value)) {
      // 小数点
      case '.':
        this.handleDecimalPoint();
        break;
      // 删除键
      case 'D':
        this.handleDeleteKey();
        break;
      // 清空键
      case 'C':
        this.handleClearKey();
        break;
      // 确认键
      case 'S':
        this.handleConfirmKey();
        break;
      default:
        this.handleNumberKey(value);
        break;
    }
  },

  // 处理小数点
  handleDecimalPoint() {
    let { input } = this.data;
    // 如果包含小数点，直接返回
    if (input.indexOf('.') > -1) return false;
    // 如果小数点是第一位，补0
    if (!input.length) {
      input = '0.';
    } else {
      input += '.';
    }
    this.updateValue(input);
  },

  // 删除键
  handleDeleteKey() {
    let { input } = this.data;
    // 如果没有输入，直接返回
    if (!input.length) return false;
    // 否则删除最后一个
    input = input.substring(0, input.length - 1);
    this.updateValue(input);
  },

  // 清空键
  handleClearKey() {
    this.setData({
      ...defaultValue,
    });
  },

  /**
   * 数字键
   * 如果有小数点，最多输入两位数字
   * 如果没有小数点
   *    判断第一位输入的是否是0，是则下面只能输入小数点
   * 杜绝 00 这种无效数字
   * 否则就直接追加在当前值后
   *
   * @param {any} money
   * @returns
   */
  handleNumberKey(newValue) {
    let { input } = this.data;

    // 没有小数点
    if ( input.indexOf('.') === -1 ) {
      // 如果当前为0，则直接等于输入值
      if (input === '0' && input.length == 1) {
        // 排除再输入0
        if (Number(newValue.charAt(0)) === 0) return;
        input = newValue;
      } else {
        input += newValue;
      };
    } else {
      // 如果有小数点且小数点位数不小于2
      if (input.substring(input.indexOf('.') + 1).length < 2) {
        input += newValue;
      } else {
        wx.showToast('最多两位小数');
      }
    }
    this.updateValue(input);
  },

  updateValue(newValue) {
    const { input } = this.data;
    if (newValue === input) return;
    if (newValue.split('.')[0].length > 12) {
    // if (newValue.length > 12) {
      wx.showToast('你的钱太多了');
      return;
    };
    const output = convertCurrency(newValue);
    this.setData({
      input: newValue,
      formatInput: formatCurrency(newValue),
      output,
      styleSmall: output.length > 10 ? 'small' : '',
    });
  },
});
