
import promisify from './promisify';
// import pages from './pages';
import mixins from './mixins';
import pullList from './pullList';
import orderPay from './orderPay';
import formatNum from './formatNum';
import { map, mapTo } from './map';

function noop() {}

function urlfix(url, paramsUrl = '') {
  let fixUrl = url;
  if (paramsUrl) {
    fixUrl = url + (url.indexOf('?') === -1 ? '?' : '&') + paramsUrl;
  }
  return fixUrl;
}

const regMobile = /^1[34578][0-9]{9}$/; // 缓存正则变量，可以优化性能
function isMobile(mobile) {  // 手机号正则检测
  return regMobile.test(mobile);
}

function formatTime(time) {  // 时间戳转YYYY-MM-DD
  const date = new Date(+time * 1000);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

//noDealTime默认为不传，会自动把时间处理成 11:02:01 格式，传了会把前面的0去掉
function formatDateAndTime(time,noDealTime) {
  const date = new Date(+time * 1000);
  if(noDealTime){
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${handleNumber(date.getHours())}:${handleNumber(date.getMinutes())}:${handleNumber(date.getSeconds())}`;
}

//处理时间格式，小于10的在前面加0
function handleNumber(num){
  return (num < 10 && num >= 0) ? ('0'+num) : num;
}

// 从html字符串中匹配<img>标签，再匹配src属性
function regImgs(html, isGlobal) {
  // 匹配图片（g表示匹配所有结果i表示区分大小写）
  const imgReg = new RegExp('<img.*?(?:>|\/>)', (isGlobal ? 'ig' : 'i') );
  // 匹配src属性
  const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
  const arr = html.match(imgReg);
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const src = arr[i].match(srcReg);
    // 获取图片地址
    if (src[1]) {
      result.push(src[1]);
      // alert('已匹配的图片地址'+(i+1)+'：'+src[1]);
    }
  }

  return result;
}

const mini = {
  promisify,
  // pages,
  mixins,
  pullList,
  noop,
  urlfix,
  isMobile,
  formatTime,
  formatNum,
  regImgs,
  orderPay,
  formatDateAndTime,
  map,
  mapTo,
};

module.exports = mini;

