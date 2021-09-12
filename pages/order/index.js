// pages/order/index.js
import { GetHouseMsg, AddHouseOrder, GetSpecialList, GetHouseDiscount, DiscountHouseMoney  } from '../../apis/index.js';
const app = getApp();
Page({
  data: {
    houseid: '',
    status: 1,  // 0 成功 1进行中, -1 失败
    startTimer: '',
    endTimer: '',
    days: '',
    city: '',
    specials: [],
    persion: [],
    tfsj:'',
    rzsj:'',
    invoice: null,
    special: null,
    specialMoney: '',
    discounts:[],
    moneyDetails: [],
    explanTips: false,
    currentDiscount: null,
    discountTips: true,
    tips:true,
  },
  onLoad: function ( options) {
    const houseid = options._id;
    if ( houseid ) {
      this.setData({
        'houseid': houseid,
      });
      this.getHouseMsg();
    } else {
      wx.showModal({
        title: '提示',
        content: '改订单不存在,点我返回',
        showCancel: false,
        confirmText: '关闭',
        success () {
          wx.navigateBack();
        }
      })
    }
  },
  onShow() {
    wx.showLoading({
      title: '加载中',
    })
    if ( this.data.houseid ) {
      this.getDate();
      this.getCity();
      const __data = app.getOrderMsg();
      const { persion = [], special = null, invoice = null } = __data;
      this.setData({
        persion: persion, // 入住人
        special: special, // 优惠卷
        invoice: invoice, // 发票
      })

      this.getSpecialList();
      this.getHouseDiscount(() => {
        this.checktCount();
      });
    }
  },
  getHouseDiscount( callback = null ) {
    GetHouseDiscount( this.data.houseid, this.data.start, this.data.end ).then( res => {
      const { status, data = []} = res;
      if ( status == '200' ) {
        if ( data.length > 0 ) {
          const currentDiscount = data[0];
          this.setData({
            discounts: data,
            currentDiscount: currentDiscount,
          })
        }
      } 
      if ( typeof( callback ) === 'function'){
        callback();
      }
    }).catch( err=> {
      if ( typeof( callback ) === 'function'){
        callback();
      }
    })
  },
  getCity() {
    const __city = app.getCity();
    const { city, cityid } = __city;
    if ( city ) {
      this.setData({
        city: city
      })
    }
  },
  getDate() {
    const __dates = app.getTimer();
    if ( __dates) {
      const { start, end, days } = __dates;
      const __start = start.split('-');
      const __end = end.split('-');
      this.setData({
        startTimer: `${ __start.join('.') }`,
        endTimer:  `${ __end.join('.') }`,
        start: start,
        end: end,
        days: days,
      })
    } else {
      this.setData({
        startTimer: '-',
        endTimer:  '-',
        start: '',
        end: '',
        days: '-',
      })
    }
   
  },
  getHouseMsg() {
    GetHouseMsg( this.data.houseid ).then( res => {
      const { status, data } = res;
      if ( status == 200 ) {
        const { 
          title, imgsrcSL, square, 
          isType, fwcx, description, 
          yajin,xzxb = 0,tfsj ='',rzsj ='',
          kzrs = '', srcs= '',gdtcw ='',checkOurTreaty,
          huxing,
          cuzutype,
          comment = null, furnishArray = [],housPicArray =[] } = data;
        this.setData({
          'title': title,
          'image': imgsrcSL,
          'square': square,
          'collected': isType,
          'fwcx': fwcx,
          'description': description,
          'comment': comment,
          'furnishArray': furnishArray,
          'housePicArray': housPicArray,
          'yajin': yajin,
          'xzxb': xzxb,
          'rzsj': rzsj,
          'kzrs': kzrs, 
          'huxing': huxing,
          'srcs': srcs,
          'tfsj': tfsj,
          "kzrs": kzrs,
          'gdtcw': gdtcw,
          'checkOurTreaty':checkOurTreaty,
          'cuzutype': cuzutype,
        })
        wx.setNavigationBarTitle({
          title: title,
        })
      }
    }).catch( err => {})
  },
  addInvoice() {
    if (this.data.status === 0 ) {
      return null;
    }
    wx.navigateTo({
      url: `/pages/invoice/index?type=choose`
    })
  },
  addPersion() {
    if (this.data.status === 0 ) {
      return null;
    }
    wx.navigateTo({
      url: `/pages/invoice/index?type=choose`
    })
  },
  addSpecial() {
    if (this.data.status === 0 ) {
      return null;
    }
    wx.navigateTo({
      url: `/pages/special/index?type=choose`
    })
  },
  editPesion( $event ) {
    if (this.data.status === 0 ) {
      return null;
    }
    const persionid = $event.currentTarget.dataset.persionid;
    if ( persionid ) {
      const __query = persionid ? `&_id=${ persionid }`: '';
      wx.navigateTo({
        url: `/pages/contactPersonItem/index?type=choose${ __query }`
      })
    } else {
      wx.navigateTo({
        url: `/pages/contactPerson/index?type=choose`
      })
    }
  },
  toDate() {
    if (this.data.status === 0 ) {
      return null;
    }
    wx.navigateTo({
      url: `/pages/datepage/index?houseid=${ this.data.houseid }&topage=order`
    })
  },
  chooseUrl() {
    this.setData({
      'explanTips': true,
    })
  },
  getSpecialList() {
    GetSpecialList().then( res => {
      const { status, data } = res;
      if ( status == '200' ) {
        const { listData = [] } = data;
        this.setData({
          specials: listData,
        })
      }
    })
  },
  addOrder() {
    if ( this.data.persion.length === 0 ) {
      wx.showToast({
        title: '请填写入住人信息',
        icon: 'error',
        duration: 2000
      })
      return null;
    }

    if ( this.data.persion.length > this.data.kzrs) {
      wx.showToast({
        title: '入住人数大于可住人数',
        icon: 'error',
        duration: 2000
      })
      return null;
    }
    const __dates = app.getTimer();
    const { start, end } = __dates;;
    const __persion = this.data.persion;
    const persions  = __persion.map( v => {
      return { 
        checkId: v.checkId,
        name: v.name,
        phone: v.phone,
      };
    })
    const __data = {
      invoice: null,
      houseid: this.data.houseid,
      start_timer: start,
      end_timer: end,
      persions: persions,
      phone: __persion[0].phone,
      name: __persion[0].name,
      orderTotal: this.data.customMoney, 
    }
    if ( this.data.special ) {
      const special = this.data.special;
      __data['couponId'] = special.couponId;
      __data['discountId'] = special.discountId;
    }
    if ( this.data.invoice ) {
      const invoice = this.data.invoice || null;
      __data['invoice'] = invoice;
    }
    if ( this.data.currentDiscount ) {
      __data['discountId'] = this.data.currentDiscount.id;
    }

    if ( this.data.tips  == false) {
      return null;
    }
    this.setData({
      tips: false,
    })
    wx.showLoading({
      title: '订单生成中',
    })

    AddHouseOrder( __data ).then( res => {
      const { status, data } = res;
      this.setData({
        tips: true,
      })
      wx.hideLoading()
      if ( status == '200' ) {
        const { orderId } = data;
        if ( orderId) {
          this.setData({
            'status': 0,
            'orderId': orderId,
          })
        } else {
          const { errorMessage  } = data;
          wx.showToast({
            title: `${ errorMessage }`,
            icon: 'error',
            duration: 2000
          })
        }
        
      } else {
        const { errorMessage  } = data;
        wx.showToast({
          title: `${ errorMessage }`,
          icon: 'error',
          duration: 2000
        })
      }
    }).catch(()=>{
      this.setData({
        tips: true,
      })
      wx.hideLoading()
    })
  },
  toOrderItem() {
    const orderId = this.data.orderId;
    wx.redirectTo({  
      url: `/pages/orderitem/index?_id=${ orderId }`
    })
  },
  checktCount() {
    const __dates = app.getTimer();
    const __data = {
      houseid: this.data.houseid,
    };
    if ( __dates ) {
      const { start, end } = __dates;
      __data['startTime'] =  start;
      __data['endTime'] = end;
    }
    
    if ( this.data.special ) {
      const { couponId } = this.data.special;
      __data['couponID'] = couponId;
    }
    if ( this.data.currentDiscount) {
      __data['zheKouId'] = this.data.currentDiscount.id;
    }

    DiscountHouseMoney( __data ).then( res => {
      const { status, data } = res;
      wx.hideLoading();
      if ( status == 200 ) {
        const { newMoney, originalPrice, details = [] } =data;
        this.setData({
          customMoney: newMoney,
          datePrice: originalPrice,
          moneyDetails: details,
          resultCustMoney: ( originalPrice - newMoney ).toFixed(2)
        })
      } else {
        wx.showToast({
          title: '计算失败',
          icon: 'error',
          duration: 2000
        })
        
      }
    
    })
  },
  chooseDiscount($event) {
    const discountid = $event.currentTarget.dataset.discountid;
    const __tips = !this.data.discountTips;
    if ( discountid === undefined) {
      this.setData({
        discountTips: __tips,
      })
    } else {
      const cur = this.data.discounts.filter((v)=> v.id === discountid);
      if ( cur.length > 0 ) {
        const __cur = cur[0];
        this.setData({
          currentDiscount: __cur,
          discountTips: false,
        })
        wx.showLoading({
          title: '计算中',
        })
        this.checktCount();
      }
    }
  }
})