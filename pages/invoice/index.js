// pages/invoice/index.js
import { regPhone, regEmail } from '../../utils/reg.js';
const app = getApp();
Page({
  data: {
    phone: '',
    email: '',
    code:'',
    title:'',
    active: 0,
  },
  onShow: function () {
    const __data = app.getOrderMsg('invoice');
    if ( __data ) {
      const { code ='', title='', phone ='', email ='' } = __data;
      let index = 0;
      if ( code && title ) {
        index = 1;
      }
      this.setData({
        title: title,
        code: code,
        phone: phone,
        email: email,
        active: index,
      })
    }
  },
  chooseInvoice() {
    app.setOrderMsg('invoice', {
      type: 0,
    } );
    wx.navigateBack();
  },
  onChangePhone( $event ) {
    const phone = $event.detail;
    this.setData({'phone': phone })
  },
  onChangeEmail( $event ) {
    const email = $event.detail;
    this.setData({'email': email })
  },
  onChangeTitle( $event ) {
    const title = $event.detail;
    this.setData({'title': title })
  }, 
  onChangeCode( $event ) {
    const code = $event.detail;
    this.setData({'code': code })
  },
  checkButton() {
    // 校验可以先不做
    if ( !this.data.email ) {
      wx.showToast({
        title: '请填写邮箱',
        icon: 'error',
        duration: 2000
      });
      return false;
    }
    if ( !this.data.phone ) {
      wx.showToast({
        title: '请填写手机号',
        icon: 'error',
        duration: 2000
      });
      return false;
    }
    if ( this.data.active === 1 ) {
      if ( !this.data.title ) {
        wx.showToast({
          title: '请填写公司抬头',
          icon: 'error',
          duration: 2000
        });
        return false;
      }
      if ( !this.data.code ) {
        wx.showToast({
          title: '请填写公司税号',
          icon: 'error',
          duration: 2000
        });
        return false;
      }
    }
    return true;
  },
  onChange( $event ) {
    const { index } = $event.detail;
    this.setData({
      active: index,
    })
  },
  save() {
    const __status = this.checkButton();
    if ( !__status ) {
      return null;
    }
    const phone = this.data.phone;
    if (!regPhone(phone)) {
      wx.showToast({
        title: '手机号错误',
        icon: 'error',
        duration: 2000
      });
      return null;
    }
    const email = this.data.email;
    if (!regEmail(email)) {
      wx.showToast({
        title: '邮箱错误',
        icon: 'error',
        duration: 2000
      });
      return null;
    }
    const __data = {
      phone: this.data.phone,
      email: this.data.email,
      type: 1, //  type == 1 个人； type == 2 公司
    }
    if ( this.data.active === 1 ) {
      if ( !this.data.code ) {
        wx.showToast({
          title: '税号未填写',
          icon: 'error',
          duration: 2000
        });
        return null;
      }
      if ( !this.data.title ) {
        wx.showToast({
          title: '抬头未填写',
          icon: 'error',
          duration: 2000
        });
        return null;
      }
      __data['code'] = this.data.code;
      __data['title'] = this.data.title;
      __data['type'] = 2;
    }
    console.log(__data)
    app.setOrderMsg('invoice', __data);
    wx.navigateBack();
  }
})