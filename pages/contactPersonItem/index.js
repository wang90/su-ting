// pages/contactPersonItem/index.js
import {  GetPersionList, EditorPerional, AddPersionApi, DelPersionApi } from '../../apis/index.js';
import { formatDate } from '../../utils/date.js';
import { regCode, regPhone } from '../../utils/reg.js';

const app = getApp();
Page({
  data: {
    phone: '',
    code: '',
    sex: 1,
    name: '',
    active: false,
    isEdit: false,
    _id: '',
    type: '',
    persionid: '',
    currentDate: new Date(1990,1,1).getTime(),
    minDate: new Date(1922, 1, 1).getTime(),
    maxDate: new Date().getTime(),
    showdate: false,
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
  onLoad: function ( options ) {
    const __id = options._id;
    const __type = options.type;
    this.setData({
      type: __type,
      persionid: __id,
    })
    if ( __id ) {
      wx.showLoading({
        title: '加载中',
        persionid: __id,
      })
      this.getList( __id );
    }
  },
  getList( __id ) {
    GetPersionList().then(res => {
      const { status, data } = res;
      if ( status == 200 ) {
        const { listData = [] } = data;
        const _users = listData.filter( v => v.checkId === __id );
        if ( _users[0] ) {
          const user = _users[0];
          const { certNo, name, phone, sex, birthday } = user;
          const __data = {
            phone: phone,
            code: certNo,
            name: name,
            sex: sex,
            isEdit: true,
            _id: __id,
            birthday: birthday,
          }
          if ( birthday ) {
            __data['currentDate'] = new Date(birthday).getTime();
          }
          this.setData( __data );
        }
      }
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
    })
  },
  onChangePhone( $event ) {
    const phone = $event.detail;
    this.setData({'phone': phone })
    this.checkButton();
  },
  onChangeCode( $event ) {
    const code = $event.detail;
    this.setData({'code': code })
    this.checkButton();
  },
  onChangeName( $event ) {
    const name = $event.detail;
    this.setData({'name': name })
    this.checkButton();
  },
  onChangeSex($event) {
    const sex = $event.detail;
    this.setData({'sex': sex })
  },
  checkButton() {
    const name = this.data.name;
    const phone = this.data.phone;
    const code = this.data.code;
    if ( name && phone && code ) {
      this.setData({'active' : true })
    } else {
      this.setData({'active' : false })
    }
  },
  deletePersion() {
    const __this = this;
    wx.showModal({
      title: '提示',
      content: '确定删除该常用入住人',
      success (res) {
        if (res.confirm) {
          const __id = __this.data._id;
          __this.deletePersionHttp( __id );
        }
      }
    })
  },
  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
  deletePersionHttp( __id ) {
    DelPersionApi( __id  ).then( res => {
      const { status, data } = res;
      if ( status == 200 ) {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000
        });
        if ( this.data.type === 'choose') {
          const __persions = app.getOrderMsg('persion');
          const __data = __persions.map( v => {
            if (v.checkId === this.data.persionid ) {
              v.name = this.data.name;
              v.phone = this.data.phone;
              v.certNo = this.data.code;
              v.sex = this.data.sex;
              v.active = false;
            }
            return v;
          })
          const __d =  __data.filter( v=> v.active === true );
          app.setOrderMsg('persion', __d);
        }
        wx.navigateBack();
      } else {
        wx.showToast({
          title: '删除失败',
          icon: 'error',
          duration: 2000
        });
      }
    })
  },
  chooseSave() {
    const name = this.data.name;
    const phone = this.data.phone;
    const code = this.data.code;
    if ( !regCode(code)){
      wx.showToast({
        title: '身份证号错误',
        icon: 'error',
        duration: 2000
      });
      return null;
    }
    if (!regPhone(phone)) {
      wx.showToast({
        title: '手机号错误',
        icon: 'error',
        duration: 2000
      });
      return null;
    }

    const isEditor = this.data.isEdit;
    if ( isEditor ) {
        this.editorPersion();
    } else {
      this.addPersion();
    }
  },
  editorPersion() {
    EditorPerional({ 
      checkid: this.data.persionid,
      name: this.data.name,
      phone: this.data.phone,
      code: this.data.code,
      sex: this.data.sex,
      birthday:this.data.birthday,
    }).then( res => {
      const { status , data } = res;
      if ( status == 200 ) {
        wx.showToast({
          title: this.data.isEdit ? '修改成功': '创建成功',
          icon: 'success',
          duration: 2000
        });
        if ( this.data.type === 'choose') {
          const __persions = app.getOrderMsg('persion');
          const __data = __persions.map( v => {
            if (v.checkId === this.data.persionid ) {
              v.name = this.data.name;
              v.phone = this.data.phone;
              v.certNo = this.data.code;
              v.sex = this.data.sex;
            }
            return v;
          })
          app.setOrderMsg('persion', __data);
        }
        wx.navigateBack();
      } else {
        wx.showToast({
          title: this.data.isEdit ? '修改失败': '创建失败',
          icon: 'error',
          duration: 2000
        })
      }
    })
  },
  addPersion() {
    AddPersionApi({ 
      name: this.data.name,
      phone: this.data.phone,
      code: this.data.code,
      sex: this.data.sex,
      birthday: this.data.birthday,
    }).then( res => {
      const { status , data } = res;
      if ( status == 200 ) {
        wx.showToast({
          title: this.data.isEdit ? '修改成功': '创建成功',
          icon: 'success',
          duration: 2000
        });
        if ( this.data.type === 'choose') {
          const __persions = app.getOrderMsg('persion');
          const __data = __persions.map( v => {
            if (v.checkId === this.data.persionid ) {
              v.name = this.data.name;
              v.phone = this.data.phone;
              v.certNo = this.data.code;
              v.sex = this.data.sex;
            }
            return v;
          })
          app.setOrderMsg('persion', __data);
        }
        wx.navigateBack();
      } else {
        wx.showToast({
          title: this.data.isEdit ? '修改失败': '创建失败',
          icon: 'error',
          duration: 2000
        })
      }
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