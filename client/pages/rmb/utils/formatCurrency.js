
// const rmbReg = /^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/;
module.exports = function formatCurrency(value, len = 4) {
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
