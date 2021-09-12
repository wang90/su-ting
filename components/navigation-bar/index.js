const app = getApp();

Component({
  properties: {
    opacity: { // 1 为显示 0 隐藏
      type :Number,
      value: 1,
    },
    left: {
      type: String,
      value: '',
    },
    title: {
      type: String,
      value: '速庭'
    },
    background: {
      type:String,
      value: "#fff",
    }
  },
  attached() {
    const statusBar = app.globalData.statusBar || 40;
    const customBar = app.globalData.customBar || 40;
    this.setData({
      statusBar: statusBar,
      customBar: customBar,
    })
  },
  data: {},
  methods: {
    goBack(){
      wx.navigateBack({
        delta: 1,
        success() {},
        fail(err) {
          console.log(err)
          wx.reLaunch({
            url: '/pages/home/index'
          })
        }
      });
    }
  }
})