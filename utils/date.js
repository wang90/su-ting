export function datedifference( sDate1, sDate2 ) {    //sDate1和sDate2是2006-12-18格式  
  sDate1 = sDate1.replace(/-/g, '/')
  sDate2 = sDate2.replace(/-/g, '/')
  const __sDate1 = Date.parse(sDate1);
  const __sDate2 = Date.parse(sDate2);

  const _date = __sDate2 - __sDate1;
  const dateSpan = Math.abs(_date);
  return Math.floor(dateSpan / (24 * 3600 * 1000));
};

export function strToDate( dateJson ) {
  if ( !dateJson ) return null;
  const __json = dateJson.split('-');
  return `${ __json[1] }月${ __json[2] }日`;
}
export function  dateToStr( date) {
  const str = new Date(date);
  const __month =  str.getMonth() + 1;
  const __day = str.getDate();
  return `${ str.getFullYear() }-${ __month < 10 ? `0${ __month }`: __month }-${ __day < 10 ? `0${ __day }`: __day }`;
}

export function toDayStr( str ) {
  const __date = str.split('-');
  if ( __date.length === 3 ) {
    return `${ __date[0] }年${ __date[1] }月${ __date[2] }日`
  }
  return str;
}


export function strToObect( dateJson ) {
  const __json = dateJson.split('-').join('/');
  return new Date(__json)
}

export function formatDate(date, type ='-') {
  var date = new Date(date);
  var YY = date.getFullYear() + type;
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + type;
  var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  // var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  // var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  // var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return YY + MM + DD;
}

export function dateToSimp(datestr) {
  const date = new Date( datestr );
  const simp = date.getTime(); 
  return simp;   
}