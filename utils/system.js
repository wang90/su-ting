export  function GetSysInfo() {
  return new Promise((reslove, reject) => {
    wx.getSystemInfo({
      success: e => {
        const custom = wx.getMenuButtonBoundingClientRect(); 
        reslove( {
          statusBar: e.statusBarHeight,
          custom: custom,
          customBar: custom.bottom + custom.top - e.statusBarHeight
        })
      },
      fail() {
        reject('error')
      }
    })
  })
}