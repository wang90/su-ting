// pages/order/index.js
import { GetHouseOrder, CancelOrderApi, DiscountHouseMoney, AddOrderRefundInfo, CheckOrderRefundInfo, CancelRefundApply } from '../../apis/index.js';
const app = getApp();
Page({
  data: {
    orderid: '',
    days: '',
    latitude: '',
    longitude:'',
    invoice: null,
  },
  onLoad: function (options) {
    const orderid = options._id;
    if ( orderid ) {
      this.setData({
        'orderid': orderid,
      });
      this.getHouseMsg();
    } 
  },
  getHouseMsg() {
    GetHouseOrder( this.data.orderid ).then( res => {
      const { status, data } = res;
      if ( status == 200 ) {
        let { 
          createDate,
          housResoId,
          title, imgsrcSL, square, 
          isType, fwcx, description, 
          customMoney, yajin,xzxb = 0,tfsj ='',rzsj ='',
          kzrs = '', srcs= '',gdtcw ='',checkOurTreaty,
          orderState,
          huxing,
          cuzutype,
          lendTypeName,
          checkArray = [],
          days,
          orderTotal,
          couponMoney,
          subtotal,
          lat = '',
          lon='',
          comment = null,
          furnishArray = [],
          housPicArray =[],
          fpFatt='',
          fpPhone='',
          fpEmail='',
          fpStatus='',
          fpTaxCode = '',
          isFyFp = 0,
          fpCompanyNames = '',} = data;
        let invoice = null;
        if ( fpFatt ) {
          invoice = {
            type: fpFatt,// 1个人 2公司
            fatt: isFyFp,
            phone: fpPhone,
            email: fpEmail,
            name: fpCompanyNames,
            status: fpStatus, // 0：无 1：未开 2：已开
            code: fpTaxCode,
          }
        }
        // 1:订房-待确认  可以取消订单
        // 2:待支付  可以取消订单
        // 3:待入住  可以退款
        // 4:退房-待确认 
        // 5:入住中 可以退房
        // 6:待评价 
        // 7:已失效 
        // 8:退款-待确认 可以取消退款
        // 9:退款-已确认 
        // 10:已完成 
        // orderState = 6;
        this.setData({
          'invoice': invoice,
          'createDate': createDate,
          'orderState': orderState,
          'title': title,
          'lendTypeName': lendTypeName,
          'image': imgsrcSL,
          'square': square,
          'collected': isType,
          'fwcx': fwcx,
          'days': days,
          'description': description,
          'customMoney': customMoney,
          'comment': comment,
          'furnishArray': furnishArray,
          'housePicArray': housPicArray,
          'yajin': yajin,
          'xzxb': xzxb,
          'rzsj': rzsj,
          'kzrs': kzrs, 
          'srcs': srcs,
          'tfsj': tfsj,
          'huxing':huxing,
          'gdtcw': gdtcw,
          'checkOurTreaty':checkOurTreaty,
          'cuzutype': cuzutype,
          'checkArray': checkArray,
          'orderTotal': orderTotal,
          'couponMoney': couponMoney,
          'subtotal': subtotal,
          'latitude': lat,
          'longitude':lon,
        })

        // housResoId
        this.checktCount(housResoId);
      }
    }).catch( err => {
    })
  },
  toSearch() {
    wx.redirectTo({
      url: `/pages/houselist/index`
    })
  },
  cancelOrder() {
    CancelOrderApi( this.data.orderid ).then( res=> {
      const { status } = res;
      if ( status == '200' ) {
        wx.showToast({
          title: '取消订单待审核',
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateBack();
        },500);
      } else {
        const { errorMessage  = '取消订单失败' } = data;
        wx.showToast({
          title: errorMessage,
          icon: 'error',
          duration: 2000
        })
      }
    })
  },
  copyOrderCode() {
    wx.setClipboardData({
      data: this.data.orderid, //这个是要复制的数据
      success (res) {
        wx.getClipboardData({
          success (res) {
            wx.showToast({
              title: '订单号复制成功！',
              icon: 'success',
              duration: 2000
            })
          },
          fail() {
            wx.showToast({
              title: '订单号复制失败！',
              icon: 'error',
              duration: 2000
            })
          }
        })
      }
    })
  },
  checktCount( houseid  ) {
    const __dates = app.getTimer();
    const { start, end } = __dates;
    DiscountHouseMoney({
      houseid: houseid,
      startTime: start,
      endTime: end,
    }).then( res => {
      const { status, data } = res;
      if ( status == 200 ) {
        const { newMoney, originalPrice, details } =data;
        this.setData({
          customMoney: newMoney,
          datePrice: originalPrice,
          moneyDetails: details,
        })
      }
    })
  },
  toOrderRefund() {
    console.log('申请退款')
    AddOrderRefundInfo( this.data.orderid ).then( res => {
      const { status, data } = res;
      if ( status == 200 ) { 
        wx.showToast({
          title: '提交成功！',
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateBack();
        },500);
      } else {
        wx.showToast({
          title: '提交失败！',
          icon: 'errpr',
          duration: 2000
        })
      }
    }).catch(err=> {
      wx.showToast({
        title: '提交失败！',
        icon: 'errpr',
        duration: 2000
      })
    })
  },
  checkOrderRefundInfo() {
    CheckOrderRefundInfo( this.data.orderid).then( res => {
      const { status, data } = res;
      if ( status == 200 ) { 
        wx.showToast({
          title: '提交成功！',
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateBack();
        },500);
      } else {
        wx.showToast({
          title: '提交失败！',
          icon: 'errpr',
          duration: 2000
        })
      }
    }).catch(err=> {
      wx.showToast({
        title: '提交失败！',
        icon: 'errpr',
        duration: 2000
      })
    })
  },
  cancelApply() {
    CancelRefundApply(this.data.orderId).then( res => {
      const { status, data } = res;
      if ( status == 200 ) {
        wx.showToast({
          title: '申请提交成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateBack();
        },500);
      } else {
        const { errorMessage ='取消失败' } = data;
        wx.showToast({
          title: errorMessage,
          icon: 'error',
          duration: 2000
        })
      }
    })
  }
})