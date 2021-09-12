const app = getApp();

Page({
  data: {
    isLogin: false,
    avatar: '',
    nickname: '',
    showCall: false,
  },
  onLoad() {
    const statusBar = app.globalData.statusBar;
    const customBar = app.globalData.customBar;
    this.setData({
      statusBar: statusBar,
      customBar: customBar,
    })
  },
  onShow: function () {
    const uid = app.getUid();
    const data = {
      'isLogin': uid? true: false,
    }
    if ( uid ) {
      const { nickName, avatarUrl, } = app.getUserInfo();
      data['nickname'] = nickName;
      data['avatar'] = avatarUrl;
    }
    this.setData( data )
  },
  toLogin() {
    wx.navigateTo({
      url: `/pages/login/index`
    })
  },
  toPage($event) {
    // if ( !this.data.isLogin) {  
    //   this.toLogin();
    //   return null;
    // }
    const pageid = $event.currentTarget.dataset.pageid;

    const pages = {
      landlord:'mineLandlord', //成为房东
      feed:'feed', // 反馈
      customer:'customer', // 联系客服
      special:'special', // 优惠卷
      collect: 'collect', // 收藏
      person: 'contactPerson', // 联系人
      account: 'mineAcccount',
      authon: 'authon', // 认证
    }
    const page = pages[pageid];
    if ( page === 'customer') {
      this.chooseCall();
    } else if  ( page ) {
      wx.navigateTo({
        url: `/pages/${ page }/index`
      })
    }
  },
  chooseCall() {
    this.setData({'showCall': true })
  },
})