/**
 * 弹出框的设计,采用微信的弹出框样式，使用的时候需要在页面的sass里面引入微信弹出框的相应样式：
 * @import "../../../node_modules/weui-sass/src/style/widget/weui_tips/weui_dialog.scss";
 */
export default class DialogService {
  static getInstance(){
    const dialogService = new DialogService();
    return dialogService;
  }

  constructor(){

  }

  alertDialog(title='提示', content) {
      if (!$("#hhmk_id_toast_prefix_alert_dialog") || $("#hhmk_id_toast_prefix_alert_dialog").length < 1) {
        $("body").append('<div id="hhmk_id_toast_prefix_alert_dialog" class="weui_dialog_alert" style="display: none;">'+
            '<div class="weui_mask"></div>'+
            '<div class="weui_dialog">'+
                '<div class="weui_dialog_hd"><strong class="weui_dialog_title">弹窗标题</strong></div>'+
                '<div class="weui_dialog_bd">弹窗内容，告知当前页面信息等</div>'+
                '<div class="weui_dialog_ft">'+
                    '<a href="javascript:;" class="weui_btn_dialog primary">确定</a>'+
                '</div>'+
            '</div>'+
        '</div>');
      }

      /*$("#hhmk_id_toast_prefix_alert_dialog .weui_dialog_title").html(title);
      $("#hhmk_id_toast_prefix_alert_dialog .weui_dialog_bd").html(content);*/

      $("#hhmk_id_toast_prefix_alert_dialog").show();
      $('#hhmk_id_toast_prefix_alert_dialog').find('.weui_btn_dialog').on('click', function () {
          $('#hhmk_id_toast_prefix_alert_dialog').hide();
      });
  }

  closeAlertDialog() {
    $("#hhmk_id_toast_prefix_alert_dialog").hide();
  }
}
