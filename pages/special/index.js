// pages/special/index.js
import { GetSpecialList } from '../../apis/index.js';
const app = getApp();

Page({
  data: {
    list: [],
    status: 1,
    msg_title: '获取数据中',
    type: '',
  },
  onLoad: function ( options ) {
    const type = options.type;
    if ( type === 'choose') {
      this.setData({ type: 'choose' })
    } 
  },
  onShow: function() {
    this.getSpecialList();
  },
  getSpecialList() {
    GetSpecialList( this.data.status ).then( res => {
      const { status, data } = res;
      if ( status == 200 ) {
        const { listData = [] } = data;
        // listData.push(
        //   {        
        //     "couponId": "65555",
        //     "couponMoney":"33",
        //     "couponName": "优惠奖励",
        //     "couponType": 1,
        //     "phone": "15910412414",
        //   },
        //   {        
        //     "couponId": "655515",
        //     "couponMoney":"33",
        //     "couponName": "优惠奖励",
        //     "couponType": 1,
        //     "phone": "15910412414",
        //   }
        // )
        let __listData = listData;
        let curCouponId = '';
        if ( this.data.type === 'choose') {
          const __data = app.getOrderMsg('special');

          if ( __data ) {
            curCouponId = __data.couponId;
          }
        }
        __listData = listData.map( v => {
          v.active = v.couponId === curCouponId ? true : false;
          return v;  
        })

        const __data = { 
          'list': __listData,
          'msg_title': __listData.length === 0  ? '暂无优惠卷': '',
        }
        this.setData( __data )
      }
    })
  },
  choose( $event ) {
    if ( this.data.type !== 'choose' ) {
      return null;
    }
    const cardid = $event.currentTarget.dataset.cardid;

    this.checkActive( cardid );
  },
  chooseSpecial() {
    const __data = this.data.list;
    const __list = __data.map( v => {
      v.active = false;
      return v;
    })
    this.setData({
      'list': __list,
      'type': 1, 
    })
    app.setOrderMsg('special', {
      'type': 0,
    } );
    wx.navigateBack();
  },
  checkActive( cardid = '' ) {
    const __data = this.data.list;
    const __list = __data.map( v => {
      v.active =  v.couponId === cardid ? true: false;
      return v;
    })
    const curSpecials = __list.filter( v => v.active === true )

    if (curSpecials[0])  {
      const __t = curSpecials[0];
      app.setOrderMsg('special', {
        "couponId": __t.couponId,
        "couponMoney": __t.couponMoney,
        "couponName": __t.couponName,
        "couponType": __t.couponType,
        "phone": __t.phone,
      } );
    } else {
      app.setOrderMsg('special', null );
    }
    this.setData({'list': __list })
  },
  finished() {
    wx.navigateBack();
  }
})