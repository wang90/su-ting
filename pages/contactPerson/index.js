// pages/contactPerson/index.js
import { GetPersionList } from '../../apis/index.js';

const app = getApp();
Page({
  data: {
    list: [],
    type: '',
  },
  onLoad: function ( options ) {
    const __type = options.type;
    if ( __type  === 'choose') {
      this.setData({
        type: 'choose',
      })
      wx.setNavigationBarTitle({
        title: '添加入住人',
      })
    }
  },
  onShow: function () {
    this.getPersionList();
  },
  getPersionList() {
    GetPersionList().then( res => {
      const { status, data } = res;
      if ( status == 200 ) {
        const { listData } = data;
        if ( listData.length > 0 ) {
          let ids = [];
          if ( this.data.type === 'choose') {
            const __data = app.getOrderMsg('persion')
            ids = __data.map( v => v.checkId);
          }
          const __listData = listData.map( v => {
            v.active = ids.indexOf(v.checkId) === -1 ? false: true;
            return v;
          } )
         
          this.setData({ 'list': __listData })
        }
      }
    })
  },
  choosePersion( $event ) {
    const __id = $event.currentTarget.dataset.persionid;
    if ( this.data.type === 'choose') {
      const __listData = this.data.list.map( v => {
        if ( v.checkId !== __id ) {
          return v;
        }
        const __active = v.active;
        v.active = !__active;
        return v;
      } )
      const __actives = __listData.filter(v=>v.active === true);
      app.setOrderMsg('persion', __actives);
      this.setData({ 'list': __listData })
    } else {
      if ( __id ) {
        this.toPage( __id );
      } else {
        this.toPage();
      }
    }
  },
  editorPersion( $event ) {
    const __id = $event.currentTarget.dataset.persionid;
    if ( __id ) {
      this.toPage( __id );
    } else {
      this.toPage();
    }
  },
  addPersion() {
    this.toPage();
  },
  toPage( __id = null ) {
    let __query = '';
    if ( this.data.type === 'choose' ) {
      __query = __id ? `?_id=${ __id }&type=choose`: '?type=choose';
    } else {
      __query = __id ? `?_id=${ __id }`: '';
    }
    const __url = `/pages/contactPersonItem/index${ __query }`;
    wx.navigateTo({
      url: __url,
    })
  },
  back() {
    wx.navigateBack();
  }
})