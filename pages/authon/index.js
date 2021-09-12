// pages/authon/index.js
import { AddAuthenticationInfo, UpfileApi, GetUserAuthon } from '../../apis/index.js';
import { formatDate } from '../../utils/date.js';
import { regCode } from '../../utils/reg.js';
Page({
  data: {
    code: '',
    name: '',
    imageMan: '',
    imageLast: '',
    imagePre:'',
    width:250,//宽度
    height: 250,//高度
    upfiletips: false,
    curType: '',
    currentDate: new Date(1990,1,1).getTime(),
    minDate: new Date(1922, 1, 1).getTime(),
    maxDate: new Date().getTime(),
    showdate: false,
    birthday: '',
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } 
      if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },
  onShow() {
    wx.showLoading({
      title: '加载中...',
    })
    GetUserAuthon().then( res => {
      const { status, data } = res;
      if ( status == '200' ) {
        console.log(data);
        wx.hideLoading();
        const { fdStatus= '', fkStatus = '' } = data;
        if ( fkStatus == 1 ){
          wx.showModal({
            title: '提示',
            content: '您的认证正在审核中...',
            showCancel: false,
            confirmText: '我知道了',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateBack();
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else if ( fkStatus == 2 ) {
          wx.showModal({
            title: '提示',
            content: '您的认证未通过',
            showCancel: false,
            confirmText: '重新提交',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else if ( fkStatus ==  3 ) {
          wx.showModal({
            title: '提示',
            content: '您的认证已通过，无需再次提交',
            showCancel: false,
            confirmText: '关闭',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateBack();
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    }).catch(() => {
      wx.hideLoading();
    })
  },
  onChangeName( $event ) {
    const name = $event.detail;
    this.setData({'name': name })
    this.checkButton();
  },
  onChangeCode( $event ) {
    const code = $event.detail;
    this.setData({'code': code })
    this.checkButton();
  },
  checkButton() {},
  chooseImage( $event ) {
    const { currentTarget } = $event;
    const { dataset } = currentTarget;
    const { type } = dataset;
    if ( type === 'last' || type === 'pre' ) {
      this.setData({
        width: 280,
        height: 180,
        curType: type,
      })
    } else {
      this.setData({
        width: 280,
        height: 392,
        curType: type,
      })
    }
    this.upfile();
  },
  upfile() {
    //获取到image-cropper实例
    this.setData({'upfiletips': true })
    this.cropper = this.selectComponent("#image-cropper");
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
      const  type = this.data.curType;
      wx.showLoading({
        title: '上传中',
      })
      UpfileApi( url ).then( res=> {
        const { data, status } = res;
        wx.hideLoading();
        if ( status == '200' ) {
          const __url = data.url;
          if ( type == 'last' ) {
            this.setData({
              imageLast: __url,
              upfiletips: false,
            })
          } else if ( type =='man') {
            this.setData({
              imageMan: __url,
              upfiletips: false 
            })
          } else if ( type == 'pre') {
            this.setData({
              imagePre: __url,
              upfiletips: false,
            })
          }
        } else {
          wx.showToast({
            title: '上传失败',
            icon: 'error',
            duration: 2000
          })
        }
        this.setData({
          curType: '',
        })
      }).catch( err => {
        wx.hideLoading();
        this.setData({
          curType: '',
        })
        wx.showToast({
          title: '上传失败',
          icon: 'error',
          duration: 2000
        })
      }) 
  },
  sumbit() {
    const code = this.data.code;
    if (!this.data.name) {
      wx.showToast({
        title: '用户名未填写',
        icon: 'error',
        duration: 2000
      });
      return null;
    }
    if ( !regCode(code)){
      wx.showToast({
        title: '身份证号错误',
        icon: 'error',
        duration: 2000
      });
      return null;
    }
    if ( !this.data.birthday) {
      wx.showToast({
        title: '未填写生日',
        icon: 'error',
        duration: 2000
      });
      return null;
    }
    if ( !this.data.imageLast || !this.data.imageMan || !this.data.imagePre) {
      wx.showToast({
        title: '证件上传不完整',
        icon: 'error',
        duration: 2000
      });
      return null;
    }

    AddAuthenticationInfo( {
      name: this.data.name,
      code: this.data.code,
      pre: this.data.imagePre,
      last: this.data.imageLast,
      man: this.data.imageMan, 
      birthday: this.data.birthday,
    }).then( res => {
      const { status , data } = res;
      if ( status == '200') {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        });
        setTimeout(() => {
          wx.navigateBack();
        },500);
      } else {
        const { errorMessage = '提交失败' } = data;
        wx.showToast({
          title: errorMessage,
          icon: 'error',
          duration: 2000
        });
      }
    }).catch(err => {
      console.log(err);
    })
  },
  chooseBirthday() {
    this.setData({'showdate': true })
  },
  confirmDate($event) {
    const __date = $event.detail;
    const __str = formatDate(__date);
    this.setData({
      'birthday': __str,
      'showdate': false,
    })
  },
  cancelDate($event) {
    this.setData({
      'showdate': false,
    })
  }
})