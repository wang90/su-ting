export  function GetSysInfo() {
  let capsuleObj = wx.getMenuButtonBoundingClientRect();
  // console.log("==胶囊信息==");
  console.log(capsuleObj);
  return new Promise((reslove, reject) => {
    wx.getSystemInfo({
      success: e => {
        const custom = wx.getMenuButtonBoundingClientRect(); 
        reslove( {
          statusBar: e.statusBarHeight,
          custom: custom,
          customBar: custom.bottom + custom.top - e.statusBarHeight,
          capsuleObj: capsuleObj,
          statusBarHeight: e.statusBarHeight,
        })
      },
      fail() {
        reject('error')
      }
    })
  })
}