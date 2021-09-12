const code_reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
const phone_reg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
const email_reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

export function  regCode( cardNo ) {
  return code_reg.test(cardNo)
}

export function  regPhone( phone ) {
  return phone_reg.test(phone)
}

export function  regEmail( email ) {
  return email_reg.test(email)
}