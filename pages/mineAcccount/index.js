import { UpfileApi, UpUserImageApi } from '../../apis/index.js';
const app = getApp();

Page({
  data: {
    width:250,//宽度
    height: 250,//高度
    upfiletips: false,
    avatar: '',
    nickname: '',
    phone: '-'
  },
  onShow: function () {
    const uid = app.getUid();
    const data = {
      'isLogin': uid? true: false,
    }
    if ( uid ) {
      const { nickName, avatarUrl, phone } = app.getUserInfo();
      data['nickname'] = nickName;
      data['avatar'] = avatarUrl;
      data['data'] = phone;
    }
    this.setData( data )
  },
  upfile() {
    //获取到image-cropper实例
    this.setData({'upfiletips': true })
    this.cropper = this.selectComponent("#image-cropper");
    //开始裁剪
  },
  cropperload(e){
    setTimeout(() => {
      if ( this.cropper &&  typeof(this.cropper.upload == 'function')) {
        this.cropper.upload();
      }
    },500)
  },
  loadimage(e){
      wx.hideLoading();
  },
  clickcut(e) {
      const  { url } = e.detail;
      wx.showLoading({
        title: '上传中',
      })
      UpfileApi( url ).then( res => {
        const { status, data } = res;
        wx.hideLoading()
        if ( status == '200' ) {
          const { url = '' } = data;
          if ( url ) {
            UpUserImageApi( url) .then( res=> {
              const { status } = res;
              if ( status == '200' ) {
                this.setData({ upfiletips: false , avatar: url })
                app.setUserInfo({ avatarUrl:url, })
                wx.showToast({
                  title: '更新成功',
                  icon: 'success',
                  duration: 2000
                })
              } else{
                this.setData({ upfiletips: false })
                wx.showToast({
                  title: '保存失败',
                  icon: 'error',
                  duration: 2000
                })
              }
            })
          } else {
            this.setData({ upfiletips: false })
            wx.showToast({
              title: '上传失败',
              icon: 'error',
              duration: 2000
            })
          }
        } else {
          this.setData({ upfiletips: false })
          wx.showToast({
            title: '上传失败',
            icon: 'error',
            duration: 2000
          })
        }
      }).catch( err => {
        wx.hideLoading();
        wx.showToast({
          title: '上传失败',
          icon: 'error',
          duration: 2000
        })
        this.setData({ upfiletips: false })
      })
  },
  changeAccount() {
      app.clearUserInfo();
      wx.navigateTo({
        url: `/pages/login/index`
      })
  }
})