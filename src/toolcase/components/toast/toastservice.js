/**
 * 在使用本服务之前需要在对应页面的sass页面里面引入对应的样式
 * 需要在scss中引入微信的toast相关的样式文件：
 * @import "../../../node_modules/weui-sass/src/style/widget/weui_tips/weui_toast.scss";
 */
export default class ToastService {

  static getInstance(){
    const toastService = new ToastService();
    return toastService;
  }

  constructor(){

  }

/**
 * 显示加载的loading效果
 * @return {[type]} [description]
 */
  showLoadingToast() {
    if (!$("#hhmk_id_toast_prefix_loading")||$("#hhmk_id_toast_prefix_loading").length < 1) {
      $("body").append("<div id=\"hhmk_id_toast_prefix_loading\" class=\"weui_loading_toast\" style=\"display:none;\">"+
          "<div class=\"weui_mask_transparent\"></div>"+
          "<div class=\"weui_toast\">"+
              "<div class=\"weui_loading\">"+
                  "<div class=\"weui_loading_leaf weui_loading_leaf_0\"></div>"+
                  "<div class=\"weui_loading_leaf weui_loading_leaf_1\"></div>"+
                  "<div class=\"weui_loading_leaf weui_loading_leaf_2\"></div>"+
                  "<div class=\"weui_loading_leaf weui_loading_leaf_3\"></div>"+
                  "<div class=\"weui_loading_leaf weui_loading_leaf_4\"></div>"+
                  "<div class=\"weui_loading_leaf weui_loading_leaf_5\"></div>"+
                  "<div class=\"weui_loading_leaf weui_loading_leaf_6\"></div>"+
                  "<div class=\"weui_loading_leaf weui_loading_leaf_7\"></div>"+
                  "<div class=\"weui_loading_leaf weui_loading_leaf_8\"></div>"+
                  "<div class=\"weui_loading_leaf weui_loading_leaf_9\"></div>"+
                  "<div class=\"weui_loading_leaf weui_loading_leaf_10\"></div>"+
                  "<div class=\"weui_loading_leaf weui_loading_leaf_11\"></div>"+
              "</div>"+
              "<p class=\"weui_toast_content\">数据加载中</p>"+
          "</div>"+
      "</div>");
    }

    $("#hhmk_id_toast_prefix_loading").show();
  }

  /**
   * 隐藏loading效果
   * @return {[type]} [description]
   */
  hideLoadingToast(){
    $("#hhmk_id_toast_prefix_loading").hide();
  }

  /**
   * 显示成功toast
   * @return {[type]} [description]
   */
  showSuccessToast() {
    if ($("#hhmk_id_toast_prefix_success").length < 1) {
       $("body").append("<div id=\"hhmk_id_toast_prefix_success\" style=\"display: none;\"><div class=\"weui_mask_transparent\"></div><div class=\"weui_toast\"><i class=\"weui_icon_toast\"></i><p class=\"weui_toast_content\">已完成</p></div></div>");
    }
    $("#hhmk_id_toast_prefix_success").show();
  }

  hideSuccessToast(){
    $("#hhmk_id_toast_prefix_success").hide();
  }
}
