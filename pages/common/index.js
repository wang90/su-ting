import { GetHouseMsg, GetAllCommentList, DiscountHouseMoney } from '../../apis/index.js';
const app = getApp();
Page({
  data: {
    houseid:'',
    level: 5,
    page: 1,
    list: [],
  },
  onLoad( option ) {
    const houseid = option._id;
    if ( houseid ) {
      this.setData({
        'houseid': houseid,
      });
      this.getHouseMsg();
      // this.checktCount();
      this.getList();
    } 
  },
  onReachBottom: function () {
    this.addList();
  },
  getList() {
    GetAllCommentList( this.data.houseid, this.data.page ).then( res => {
      const { status, data } = res; 
      if ( status == '200' ) {
        const __list = this.data.list || [];
        const { listData } = data;
        this.setData({
          list: __list.concat(listData),
        })
      }
    })
  },
  addList() {
    const __page = this.data.page;
    this.setData({page: __page + 1 })
    this.getList();
  },
  checktCount() {
    const __dates = app.getTimer();
    const { start, end } = __dates;
    DiscountHouseMoney({
      houseid: this.data.houseid,
      startTime: start,
      endTime: end,
    }).then( res => {
      const { status, data } = res;
      if ( status == 200 ) {
        const { originalPrice } =data;
        this.setData({
          // customMoney: newMoney,
          datePrice: originalPrice,
        })
      }
    })
  },
  getHouseMsg() {
    GetHouseMsg( this.data.houseid ).then( res => {
      const { status, data } = res;
      if ( status == 200 ) {
        const { 
          title,
          comment = null,
          special= null,
          customMoney = '',
          datePrice } = data;
        const { commentLevel } = comment;
        this.setData({
          'title': title,
          'level': commentLevel,
          'customMoney':customMoney,
          // 'datePrice': datePrice,
        })
        wx.setNavigationBarTitle({
          title: title,
        })
      }
    }).catch( err => {})
  },
  onShareAppMessage() {
    return {
      title: this.data.title,
      path: `./pages/house/index?_id=${ this.data.houseid }`,
    }
  }
})