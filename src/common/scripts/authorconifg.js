/**
 * 方法权限配置
 * map配置为：key表示要访问的方法，value表示要的权限，
 * 目前是两种：tokenId（需要tokenId方能访问),anonymous(可匿名访问)
 */
export authorMap = {
  'webchatGetUserInfo':'tokenId',
  'commonNoticeList':'anonymous'
}
