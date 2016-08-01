import {SESSIONSTORAGE,LOCALSTORAGE} from '../common/scripts/config';
/**
 *获取缓存中的tokenId
 * @return {[type]} [description]
 */
export function getTokenId(){
  let tokenId = SESSIONSTORAGE.getItem("tokenId");
  try {
    if (!tokenId && LOCALSTORAGE) {
      let tokenIdStr = LOCALSTORAGE.getItem("tokenId");
      let tokenIdObj = null;
      if (tokenIdStr) {
        tokenIdObj = $.parseJSON(tokenIdStr);
        if (tokenIdObj && ((new Date().getTime() - tokenIdObj.timeMillis) <= 24 * 60 * 60 * 1000)) {
          if (isTokenLegal(tokenIdObj.tokenId)) {
            return tokenIdObj.tokenId;
          } else {
            /** 如果有tokenId但是值不合法，那么需要把不合法的tokenId从缓存中清除掉 **/
            clearTokenId();
            return null;
          }
        }
      }
    } else {
      return null;
    }
  } catch(e) {
    console.log(e);
  }
  if (isTokenLegal(tokenId)) {
    return tokenId;
  } else {
    clearTokenId();
    return null;
  }
}

export function setTokenId(tokenId) {
  if (!isTokenLegal(tokenId)) {
    return;
  }
  SESSIONSTORAGE.setItem("tokenId", tokenId);
  try{
    if (LOCALSTORAGE) {
      let obj = new Object();
      obj.tokenId = tokenId;
      obj.timeMillis = new Date().getTime();
      LOCALSTORAGE.setItem("tokenId",JSON.stringify(obj));
    }
  } catch(e) {
    alert(e);
  }
  return false;
}

/**
 * 判断获得的tokenId是不是合法
 * @param  {[type]}  tokenId 当前tokenId
 * @return {Boolean}         [description]
 */
export function isTokenLegal(tokenId) {
  if (!tokenId || tokenId.indexOf("Patient-") < 0) {
    return false;
  }
  return true;
}

export function clearTokenId() {
  SESSIONSTORAGE.removeItem("tokenId");
  LOCALSTORAGE.removeItem("tokenId");
}
