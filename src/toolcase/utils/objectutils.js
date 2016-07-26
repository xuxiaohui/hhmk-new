/**
 * 将参数中为空的信息删除掉
 * @param  {[type]} params [对应的参数]
 * @return {[type]}        [description]
 */
export function clearParams(params) {
  if (!params || $.isEmptyObject(params)) return params;
  /** 删除失效的查询属性 **/
  for (let items in params) {
    if (!params[items] && params[items]!=0) {
      delete params[items]
    }
  }
  return params
}
