import http from '../utils/http.js';
import { BASE_URL } from '../config/index.js';


const app = getApp();

function Getuid() {
  return app.getUid();
}

const appId = 'wxf8b1b52d36c49216'

export function HomeListApi() {
  return http({ 
    url:'/homeModule/findHoursePerfect',
    method:'POST', 
    data:{ 'operId': Getuid() }})
}

export function HomeSortListApi( json ) {
  const { 
    page = 1 , 
    pageSize = 10, 
    orderIndex = 1,
    cityid = null, 
    rzsj = null, 
    tfsj= null,
    start  = null,
    end = null,
    peopleNumUp= null,
    peopleNumDown = null,
    housResoTypeArray = null,
    houseTypeArray = null,
    lendTypeArray = null,
    amenitiesArray = null,
    pricePointDown = null,
    pricePointUp  = null, } = json;
  const data = {
    'pageSize': pageSize,
    'pageNumb': page,
  }
  if ( orderIndex === 2 ) {
    data['orderIndex'] = 1 
  } else if ( orderIndex === 3 ) {
    data['orderIndex'] = 2
  } else if ( orderIndex === 4 ) {
    data['orderIndex'] = 3
  }
  if ( Getuid() ) {
    data['operId'] = Getuid();
  }
  if ( cityid ) {
    data['cityId'] = cityid
  }
  if ( start ) {
    data['tfsj'] = start
  }
  if ( end ) {
    data['rzsj'] = end;
  }
  if ( housResoTypeArray ) {
    data['housResoTypeArray'] = housResoTypeArray;
  }
  if ( houseTypeArray ) {
    data['houseTypeArray'] =houseTypeArray;
  }
  if ( lendTypeArray ) {
    data['lendTypeArray'] = lendTypeArray;
  }
  if ( amenitiesArray ) {
    data['amenitiesArray'] = amenitiesArray;
  }
  if ( pricePointDown !==null ) {
    data['pricePointDown'] = pricePointDown;
  } 
  if (pricePointUp !== null ) {
    data['pricePointUp'] = pricePointUp;
  }
  if ( peopleNumUp !== null ) {
    data['peopleNumUp'] = peopleNumUp;
  }
  if ( peopleNumDown !== null ) {
    data['peopleNumDown'] = peopleNumDown;
  }
  return http({ 
    url:'/homeModule/findHomeInfoList',
    method:'POST', 
    data: data })
}

export function GetSearchCodeApi() {
  return http({ 
    url:'/homeModule/getSearchCodeInfo',
    method:'GET' })
}

export function GetHouseMsg( houseid ) {
  const data = {
    'housResoId': houseid,
    'operId': Getuid(),
  }
  return http({ 
    url:'/homeModule/findHourseDetails',
    data: data,
    method:'POST' })
}


export function GetOpenID( code ) {
  return http({
    url: '/common/loginModel/wei-xin/user-info',
    data: {
      code: code,
      appId: appId,
    },
    method: 'POST',
  })
}
export function WxLogin( json ) {
  const { phone = '', unionid, nickName, openid, avatarUrl } = json;
  const data ={
    unionId: unionid,
    nickName: nickName,
    openId: openid,
    avatarUrl: avatarUrl,
  }
  if ( phone !=='') {
    data['phone'] = phone
  }
  return http({
    url: '/common/loginModel/wei-xin/login',
    data: data,
    method: 'POST',
  })
}

export function SmsPhone( phone, messType = '01' ) {
  return http({
    url: '/common/loginModel/sendCode',
    data: {
      mobile: phone,
      messType: messType,
    },
    method: 'POST',
  })
}
export function PhoneLoginApi( phone, code, user ) {
  const { openid='', nickName='', avatarUrl='', unionid=''} = user;
  return http({
    url: '/common/loginModel/phone/code',
    data: {
      phone: phone,
      code: code,
      unionId: unionid,
      nickName: nickName,
      openId: openid,
      avatarUrl: avatarUrl,
    },
    method: 'POST',
  })
}
export function GetPhone( __data ) { 
  const {  sessionKey, encryptedData, iv } = __data;
  return http({
    url: '/common/loginModel/wei-xin/phone',
    data: {
      appId: appId,
      sessionKey: sessionKey,
      encryptedData: encryptedData,
      iv: iv,
    },
    method: 'POST',
  })
}



export function AddMessageApi(__json) {
  const { cityid, title, value } = __json;
  return http({
    url: '/workOrder/addWorkOrder',
    data: {
      operId: Getuid(),
      cityCode: cityid,
      title: title,
      content: value,
    },
    method: 'POST',
  })
}

export function EditorPerional( __json ) {
  const { name, phone, code, sex, checkid, birthday } = __json;
  return http({
    url: '/myModule/editConservationInfo',
    data: {
      id:checkid,
      operId: Getuid(),
      name:name,
      phone: phone, 
      certNo: code, 
      sex	: sex,
      birthday: birthday,
    },
    method: 'POST',
  })
}

export function GetMessageList(pageNumb= 1,pageSize = 10) {
  return http({
    url:'/messageModule/findMessageList',
    data: {
      operId: Getuid(),
      pageSize: pageSize,
      pageNumb: pageNumb,
    },
    method: 'POST',
  })
}

export function GetTalkList( __json ) {
  const { cityCode, status = -1, pageNumb = 1,pageSize = 10  } = __json;
  return http({
    url:'/workOrder/findWorkOrderList',
    data: {
      operId: Getuid(),
      pageSize: pageSize,
      pageNumb: pageNumb,
      cityCode: cityCode,
      status: status,
    },
    method: 'GET',
  })
}


export function BecomeLandlord(__json) {
  const { value, title, phone, address , persion } = __json;
  return http({
    url:'/homeModule/addhousing',
    data: {
      operId: Getuid(),
      content: value,
      title: title,
      linkman: persion,
      fullAdress: address,
      phone: phone
    },
    method: 'POST',
  })
}

export function AddFeedApi( __json ) {
  const { value, phone } = __json;
  return http({
    url:'/common/loginModel/addFeedbackInfo',
    data: {
      operId: Getuid(),
      contents: value,
      mobile: phone,
      email: '33@qq.com',
    },
    method: 'POST',
  })
}

export function GetPersionList() {
  const data = {
    operId: Getuid(),
    pageSize: -1,
    pageNumb: 1,
  }
  return http({
    url:'/myModule/findConservationList',
    method: 'POST',
    data: data,
  })
}

export function AddPersionApi( __json ) {
  const { name, phone, code, sex, birthday = '2017-07-24'  } = __json
  return http({
    url:'/myModule/addConservationInfo',
    method: 'POST',
    data: {
      operId: Getuid(),
      name: name,
      phone: phone,
      certNo: code,
      sex: sex,
      birthday: birthday,
    },
  })
}

export function DelPersionApi( __id ) {
  return http({
    url:'/myModule/deleteConservation',
    method: 'POST',
    data: {
      operId: Getuid(),
      checkId: __id,
    },
  })
}

export function GetSpecialList( status = 1 ) {
  // status: 1 可用 
  // status: 2 不可用
  return http({
    url:'/common/loginModel/coupon-list',
    method: 'GET',
    data: {
      userId: Getuid(),
      status: status,
      operId: Getuid(),
    },
  })
}

export function AddHouseOrder( __json ) {
  const { houseid, 
    start_timer,
    end_timer, 
    persions = [], 
    couponId = '', 
    discountId, 
    phone,
    name='',
    invoice = null,
    orderTotal = '',
  } = __json;
  const __data = {
    operId: Getuid(),
    housResoId:  houseid,
    rzsj: start_timer,
    tfsj: end_timer,
    phone: phone,
    name: name,
    orderTotal: orderTotal,
  }
  if ( persions ) {
    __data['checkArray'] = JSON.stringify(persions);
  }
  if ( invoice ) {
    // type == 0 不开发票 
    // type == 1 个人
    // type == 2 公司
    const { title, code, phone, email , type } = invoice;
    console.log( invoice )
    if ( type === 1 || type === 2 ) {
      __data['invoiceEmail'] = email;
      __data['invoicePhone'] = phone;
      __data['invoiceTitle'] = type;
      __data['invoiceType'] =  1;
      if ( invoice.type === 2 ) {
        __data['companyTitle'] = title;
        __data['invoiceID'] = code;
      }
    }
  }
  if ( couponId ) {
    __data['couponId'] = couponId;
  }
  if ( discountId ) {
    __data['discountId'] = discountId;
  }

  return http({
    url:'/orderGoodsInfo/add-order',
    method: 'POST',
    data: __data,
  })
}

export function GetCollectList( page = 1 ) {
  const pageSize = 10;
  return http({
    url:'/homeModule/findHourseCollectList',
    method: 'POST',
    data: {
      operId: Getuid(),
      pageSize:  pageSize,
      pageNumb: page,
    },
  })
}

export function HouseCollectApi( __json ) {
  const { houseid, type } = __json;
  return http({
    url:'/homeModule/cancelCollect',
    method: 'POST',
    data: {
      operId: Getuid(),
      housResoId:  houseid,
      isType: type,
    },
  })
}

export function GetCutomerPhone() {
  return http({
    url:'/common/loginModel/servicePhone',
    method: 'POST',
  })
}

export function GetQusetionService( msgId ) {
  return http({
    url:'/workOrder/findWorkOrderDetail',
    method: 'GET',
    data: {
      workOrderId:msgId,
      operId: Getuid(),
    }
  })
}
export function SendService( msgId, value ) {
  return http({
    url:'/workOrder/addWorkOrderReply',
    method: 'POST',
    data: {
      workOrderId:msgId,
      operId: Getuid(),
      content: value,
    }
  })
}

export function  GetPendingApi( page , pageSize = 10  ) {
  return http({
    url:'/orderGoodsInfo/findOrderProgressList',
    method: 'POST',
    data: {
      operId: Getuid(),
      pageNumb: page,
      pageSize: pageSize
    }
  })
}
export function GetFinished( page , pageSize = 10 ) {
  return http({
    url:'/orderGoodsInfo/findFinishOrderList',
    method: 'POST',
    data: {
      operId: Getuid(),
      pageNumb: page,
      pageSize: pageSize
    }
  })
}

export function GetCheckOutPwd(orderId) {
  return http({
    url:'/orderGoodsInfo/findOrderAffirm',
    method: 'POST',
    data: {
      operId: Getuid(),
      orderId: orderId,
    }
  })
}
export function PayForMoney( orderId ) {
  const __data = {
    operId: Getuid(),
    orderId: orderId,
    payType: '1',
    tradeType:'JSAPI'
  }
  return http({
    url:'/orderGoodsInfo/addPayInfo',
    method: 'POST',
    data: __data,
  })
}
export function GetHouseOrder( orderId ) {
  return http({
    url:'/orderGoodsInfo/findOrderDetail',
    method: 'POST',
    data: {
      operId: Getuid(),
      orderId: orderId,
    }
  })
}
export function CancelOrderApi( orderId ) {
  return http({
    url:'/orderGoodsInfo/updateHourseCancelInfo',
    method: 'POST',
    data: {
      operId: Getuid(),
      orderId: orderId,
    }
  })
}

export function GetRecommendHomeList( __json ) {
  const { houseid, page = 1, pageSize = 10 } = __json;
  return http({
    url:'/homeModule/recommendHomeInfo',
    method: 'POST',
    data: {
      operId: Getuid(),
      houseId: houseid,
      pageSize: page,
      pageNumb: pageSize,
    }
  })
}
export function  DiscountHouseMoney( __json ) {
  const { 
    zheKouId = null, 
    couponID = null, 
    tntegralCnt = null , 
    houseid, 
    startTime, endTime } = __json;
  const data = {
    operId: Getuid(),
    houseId: houseid,
    startTime: startTime,
    endTime: endTime,
  }
  if ( tntegralCnt ) {
    data['tntegralCnt'] = tntegralCnt;
  }
  if ( couponID ) {
    data['couponID'] = couponID;
  }
  if ( zheKouId ) {
    data['zheKouId'] = zheKouId;
  }
  return http({
    url:'/orderGoodsInfo/calculate-price',
    method: 'POST',
    data: data,
  })
}

export function  ReadEmptyMessage( type ) {
  const data ={
    operateType: type,
    operId: Getuid(),
  }
  return http({
    url: '/messageModule/readEmptyMessage',
    method: 'POST',
    data: data,
  })
}

export function GetAllCommentList( houseid, page ) {
  const data = { 
    housResoId: houseid,
    pageSize: 10,
    pageNumb: page,
  }
  return http({
    url: '/homeModule/findCommentList',
    method: 'POST',
    data: data,
  })
}

export function  GetPlatformExplainInfo( type = '01') {
  // 码值：协议类型：
  // 01：退款条约，
  // 02：经营规范，
  // 03：常见问题；
  // 04：用户指南;
  // 05 : 关于我们;
  // 06 : 提现协议:
  // 07 : 优惠卷规则说明;
  // 08 : 退房条约;
  // 09 : 积分说明;
  // 10 : 用户注册协议;
  // 11: 发票须知
  const data = {
    type: type,
  }
  return http({
    url: '/common/loginModel/findPlatformExplainInfo',
    method: 'POST',
    data: data,
  })
}

export function GetHouseDiscount( houseId, startTime, endTime ) {
  const data = {
    houseId: houseId,
    startTime: startTime,
    endTime: endTime,
  }
  return http({
    url: '/homeModule/house-discount',
    method: 'GET',
    data: data,
  })
}

export function  AddHistoryApi(houseId) {
  if ( Getuid() ) {
    const data = {
      operId: Getuid(),
      housResoId: houseId
    }
    return http({
      url: '/homeModule/addHouserHistoryInfo',
      method: 'POST',
      data: data,
    })
  }
  return new Promise((relove, reject)=> {
    reject('not uid')
  })
}

export function  AddAuthenticationInfo(json) {
  const { name, code, pre, last, man, type = '01',birthday  } = json;
  const data = {
    operId: Getuid(),
    name: name,
    certNo: code,
    frontSrc: pre,
    sideSrc: last,
    handSrc: man,
    userType: type,
    birthday: birthday,
  }
  return http({
    url: '/myModule/addAuthenticationInfo',
    method: 'POST',
    data: data,
  })
}

export function  UpfileApi( url ) {
  return new Promise(( reslove, reject ) => {
    wx.uploadFile({
      url: BASE_URL + '/common/loginModel/upload-avatar',
      filePath: url,
      name: 'file',
      success (res){
        const data = JSON.parse(res.data);
        reslove(data);
      },
      fail(err) {
        reject(err);
      }
    })
  })
}

export function  UpUserImageApi (src) {
  return http({
    url: '/common/loginModel/addPictureInfo',
    method: 'POST',
    data: {
      operId: Getuid(),
      photoType: '01',
      imgsrc: src,
    },
  })
}

export function  AddOrderRefundInfo(orderId) {
  return http({
    url: '/orderGoodsInfo/addOrderRefundInfo',
    method: 'POST',
    data: {
      operId: Getuid(),
      orderId: orderId,
    }
  })
}


export function  CheckOrderRefundInfo(orderId) {
  return http({
    url: '/orderGoodsInfo/addCheckedHotelInfo',
    method: 'POST',
    data: {
      operId: Getuid(),
      orderId: orderId,
    }
  })
}


export function GetUserAuthon() { 
  return http({
    url: '/common/loginModel/getUserOtherInfo',
    method: 'POST',
    data: {
      operId: Getuid(),
    }
  })
}

export function CancelRefundApply( orderid ) {
  return http({
    url: '/orderGoodsInfo/cancelRefundApply',
    method: 'POST',
    data: {
      operId: Getuid(),
      orderId: orderid,
    }
  })
}