import { GAODE_KEY } from '../config/index.js';
const amapFile = require('./amap-wx.js');

import { citys } from '../config/outfile.js';
const DefaultCitys = citys.map( v => { return v.list });
const __CityCode = DefaultCitys.reduce( function(a,b) { return a.concat(b) });


export function GetLocation( type ='address' ) {
  return new Promise(( reslve, reject ) => {
    const myAmapFun = new amapFile.AMapWX({ key: GAODE_KEY });
    myAmapFun.getRegeo({
      success: ( data ) => {
        console.log(data);
        const __data = data[0];
        const { name, regeocodeData = null } = __data;
        if ( type === 'city') {
          if ( regeocodeData ) {
            const { addressComponent = {} } = regeocodeData;
            const { city,province } = addressComponent;
            if ( typeof(city) == String) {
              if ( city ) {
                reslve( 
                  {
                    city: city
                  }
                 );
              }
            } else {
              reslve( 
                {
                  city: province
                }
               );
            }
            
          } 
        }
        if ( name ) {
          const { addressComponent = {} } = regeocodeData;
          const { city, province } = addressComponent;
          if ( typeof(city) == String) {
            reslve( {
              location: name,
              city: city,
            } )
          } else {
            reslve( {
              location: name,
              city: province,
            } )
          }
          
        } else {
          reject( 'no location')
        }
      },
      fail: (err) => {
        //失败回调
        reject( err )
      }
    })
  })
}
 
export function GetCityCode( city ) {
  if ( !city ) { return []; }
  const __data = [];
  for ( let i = 0 ; i < __CityCode.length ; i ++ ) {
    const __city = __CityCode[i];
    const { name } = __city;
    if ( name.indexOf( city ) > -1 || city.indexOf( name ) > -1) {
      __data.push(__city);
    }
  }
  return __data;
}