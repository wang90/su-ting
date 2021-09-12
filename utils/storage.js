export async function SetStorage( key, value ) {
  return new Promise(( relosve, rejcet ) => {
      try {
        wx.setStorageSync( key, JSON.stringify( value ))
      } catch (e) { 
        relosve('setStorageSync fail');
      }
  })
}
export async function GetStorage( key ) {
 return new Promise(( relosve, rejcet ) => {
    wx.getStorage({
      key: key,
      success ( res )  {
        const __val = res.data;
        relosve( JSON.parse(__val) );
      },
      fail( err ) {
        rejcet( err )
      }
    })
  })
}

export async function  ClearStorage(params) {
  return new Promise(( relosve, rejcet ) => {
    try {
      wx.clearStorageSync()
      relosve();
    } catch(e) {
      rejcet()
      // Do something when catch error
    }
  })
}

