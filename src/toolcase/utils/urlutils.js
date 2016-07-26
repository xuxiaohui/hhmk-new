/** 与链接url有关的能力 **/
/**
 * 读取url参数信息
 * @param  {[type]} str [参数的key值]
 * @return {[type]}     [description]
 */
export function getParamObj(keystr){
    let param = window.location.search.replace('?', '').split('&');
    for(let i=0,length=param.length;i<length;i++){
        let str = param[i].split('=');
        if (str[0] == keystr) {
          return str[1]
        }
    }
    return null;
}

/**
 * 获得参数数组
 * @return {[type]} [description]
 */
export function getParamsArr() {
    let param = window.location.search.replace('?', '').split('&');
    let arr = [];
    for(let i=0;i<param.length;i++){
        let str = param[i].split('=');
        arr[str[0]] = str[1];
    }
    return arr;
}

/**
 * 获得html文件的名字
 * @return {[type]} [description]
 */
export function getHtmlName(){
  return window.location.pathname.split('/').pop().split('.')[0];
}

/**
 * 需要套传的渠道参数
 * @return {[type]} [description]
 */
export function getPipeParams(){
  var pipeParams = ['vHMC','vHMP'];
  var paramValue = null;
  var retObj = {};
  var urlStr = [];
  pipeParams.forEach(function(item){
    paramValue = getParamsArr()[item];
    if (paramValue) {
      retObj[item] = paramValue;
      urlStr.push(item + "=" + paramValue);
    }
  });
  return {
    obj:retObj,
    url:urlStr.join("&")
  };
}


/**
 * 给链接加上渠道参数
 * @param  {[type]} url    [要处理的url]
 * @param  {[type]} params [必须是拼接好的,如:abc=123&def=456，与getPipeParams结合起来使用]
 * @return {[type]}        [description]
 */
export function getRetUrl(url,params){
  if (!$.trim(params)) {
    return url;
  }
  if (url.indexOf('?') >= 0) {
    return url + "&" + params;
  }
  return url + "?" + params;
}
