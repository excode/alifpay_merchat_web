
const apiUrl = import.meta.env.VITE_API_URL;
const apiUrlWallet = import.meta.env.VITE_API_URL_WALLET;
const apiUrlRef = import.meta.env.VITE_API_URL_REF;
const apiUrlMer = import.meta.env.VITE_API_URL_MERCHANT;
export default {
serverURI:apiUrl,
serverURIRef:apiUrlWallet,
refServerURI: apiUrlRef,
serverURIMer: apiUrlMer,
title:'AlifPay Cashback',
fixedLayout: false,
hideLogoOnMobile: false,
multiLanguageSupport:false,
jwt_secret: "654321"
}

/*

serverURI:'https://alifpaymerchant-cuf6fvekhngcbmd9.southeastasia-01.azurewebsites.net',
serverURIRef:'https://wallet-uat.alifpay.com.my',
refServerURI: 'https://winmarchant.azurewebsites.net',
*/