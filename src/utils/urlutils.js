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
