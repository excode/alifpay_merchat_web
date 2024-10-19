import config from '@/config'
import { listError } from '@/lib/functions'
import { postData } from '@/lib/httpRequest'
import router from '@/router/'
import { defineStore } from 'pinia'
import VueJwtDecode from 'vue-jwt-decode'
function maskEmail(email) {
  const [localPart, domain] = email.split('@');
  const maskedLocalPart = localPart.length > 2 ? localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1] : '*'.repeat(localPart.length);
  return `${maskedLocalPart}@${domain}`;
}
function loggedProcedure(){

}
  export const useLoginStore = defineStore('Login', {
    state:() => ({
      logged:0,
      loading:false,
      token:'',
      userPreInfo:JSON.parse(localStorage.getItem('preLogin')??"{}"),
      userInfo :  JSON.parse(localStorage.getItem('users')??"{}"),
      error:[]
      }),
      
      actions: {
        async login(request = {}) {
            this.loading =true 
            let refreshToken =localStorage.getItem(request.username.trim()+'_refreshToken2')
            let useRefresh = false;
            request={...request,"_x":"0"}
            if(refreshToken && refreshToken.length>10){
              request={...request,"_x":1}
              useRefresh=true
            }
            
            const response = await postData( '/auth',request,false);
            //console.log(request)
            if(response["errors"]==undefined || response["errors"]==null) {
              
            this.error = null
            this.loading =false
            this.token = response.accessToken
            //localStorage.setItem('users', JSON.stringify(this.userInfo ))
            //router.push('/secure');
            console.log()
            localStorage.setItem('preLogin', JSON.stringify({...response,username:request.username} ))
           
            if(useRefresh){
              let requestRefresh={refresh_token:refreshToken}
              const responseRefresh = await postData( '/refreshMytoken',requestRefresh,false);
            
              console.log("STEP1")
              if(responseRefresh["errors"]==undefined || responseRefresh["errors"]==null) {
                const decode = VueJwtDecode.decode(responseRefresh.accessToken) 
                // console.log("STEP2")
               // console.log(decode)
                  this.userInfo = {
                    name: decode.name,
                    mobileno: decode.mobile,
                    username: decode.username,
                    email: decode.email,
                    userType: decode.userType,
                    userId: decode.userId,
                    introducer: decode.introducer,
                    token: responseRefresh.accessToken,
                    refresh: responseRefresh.refreshToken
                }
               
                this.error = null
                this.loading =false
                this.token = responseRefresh.accessToken
                localStorage.setItem('users', JSON.stringify(this.userInfo ))
                localStorage.setItem(decode.username+'_refreshToken2',responseRefresh.refreshToken)
                router.push('/secure');
              }else{
                router.push('/auth/otp');
              }
            }else{
              router.push('/auth/otp');
            }
            
            
          } else {
               // console.log(response["errors"]);
                this.error = listError(response["errors"]) 
                this.loading = false
          
            }
          },
          async verifyOTP(request = {}) {
            this.loading =true 
            const response = await postData( '/authVerify',request,false);
          
            if(response["errors"]==undefined || response["errors"]==null) {
             

              
              this.logged = 1
              const decode = VueJwtDecode.decode(response.accessToken) 
            // console.log(decode)
            
              this.userInfo = {
                name: decode.name,
                mobileno: decode.mobile,
                username: decode.username,
                email: decode.email,
                userType: decode.userType,
                userId: decode.userId,
                introducer: decode.introducer,
                token: response.accessToken,
                refresh: response.refreshToken
            }
            
            this.error = null
            this.loading =false
            this.token = response.accessToken
            localStorage.setItem('users', JSON.stringify(this.userInfo ))
            localStorage.setItem(decode.username+'_refreshToken',response.refreshToken)
            router.push('/secure');
            
          } else {
               // console.log(response["errors"]);
                this.error = listError(response["errors"]) 
                this.loading = false
          
            }
          },
         
          async forgetPassword(request = {}) {
            this.loading =true 
            const response = await postData( '/resendOTPFP',request,false,config.userServerURI);
            if(response["errors"]==undefined || response["errors"]==null) {
            localStorage.setItem('preLogin', JSON.stringify({...response,username:request.contactNumber} ))  
            this.error = null
            this.loading =false
            router.push('/auth/reset-password');
            
          } else {
               // console.log(response["errors"]);
                this.error = listError(response["errors"]) 
                this.loading = false
          
            }
          },
          async resetPassword(request = {}) {
            this.loading =true 
            const response = await postData( '/changePassword2',request,false);
            if(response["errors"]==undefined || response["errors"]==null) {

            this.error = null
            this.loading =false
            router.push('/auth/login');
           
            
          } else {
               // console.log(response["errors"]);
                this.error = listError(response["errors"]) 
                this.loading = false
          
            }
          },
          async changePassword(request = {}) {
            this.loading =true 
            const response = await postData( '/changePassword',request);
            if(response["errors"]==undefined || response["errors"]==null) {
            this.logOut(); 
            
            
          } else {
               // console.log(response["errors"]);
                this.error = listError(response["errors"]) 
                this.loading = false
          
            }
          },
          getUserInfo(){
           let userData =localStorage.getItem('users')
           this.userInfo = userData?JSON.parse(userData):{};
          },
          getPreUserInfo(){
            //console.log("WHERE userData")
            let userData =localStorage.getItem('preLogin')
           
            
            if(userData){
             let dataObj = userData?JSON.parse(userData):{};
            this.userPreInfo = {...dataObj,"masked":maskEmail(dataObj.email)};
           
            }
           },
          async logOut (Id = '') {
            let refreshToken =this.userInfo.refresh;
            localStorage.removeItem('users')
            this.userInfo = {}
            this.token = ''
            this.logged = 0
            this.loading = false
            localStorage.setItem('refreshToken',refreshToken)
            router.push('/auth/login');
          },
           goRegister (Id = '') {
            this.loading = false
            router.push('/auth/register');
          },
           goLogin (Id = '') {
            this.loading = false
            router.push('/auth/login');
          },
          goForgetPassword (Id = '') {
            this.loading = false
            router.push('/auth/forget-password');
          },
         
      },
   
  })
  

  /*

import { listError } from '@/lib/functions';
import { postData } from '@/lib/httpRequest';
import router from '@/router/';
import { defineStore } from 'pinia';
import VueJwtDecode from 'vue-jwt-decode';
function maskEmail(email) {
  const [localPart, domain] = email.split('@');
  const maskedLocalPart = localPart.length > 2 ? localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1] : '*'.repeat(localPart.length);
  return `${maskedLocalPart}@${domain}`;
}
  export const useLoginStore = defineStore('Login', {
    state:() => ({
      logged:0,
      loading:false,
      token:'',
      userPreInfo:JSON.parse(localStorage.getItem('preLogin')??"{}"),
      userInfo :  JSON.parse(localStorage.getItem('users')??"{}"),
      error:[]
      }),
      
      actions: {
        async login(request = {}) {
            
            this.loading =true 
            request={...request,"_x":"0"}
            const response = await postData( '/auth',request,false);
            console.log(request)
            if(response["errors"]==undefined || response["errors"]==null) {
              console.log(response)
              localStorage.setItem('preLogin', JSON.stringify(response ))
              router.push('/auth/otp');
           
            this.error = null
            this.loading =false
        
          } else {
               // console.log(response["errors"]);
                this.error = listError(response["errors"]) 
                this.loading = false
          
            }
          },
          async verifyOTP(request = {}) {
            this.loading =true 
            const response = await postData( '/authVerify',request,false);
          
            if(response["errors"]==undefined || response["errors"]==null) {
             

              
              this.logged = 1
              const decode = VueJwtDecode.decode(response.accessToken) 
             console.log(decode)
            
              this.userInfo = {
                name: decode.name,
                mobileno: decode.mobile,
                email: decode.email,
                userId: decode.userId,
                uid: response.uid,
                token: response.accessToken,
                refresh: response.refreshToken,
                userType:decode.userType
            }
            
            this.error = null
            this.loading =false
            this.token = response.accessToken
            localStorage.setItem('users', JSON.stringify(this.userInfo ))
            router.push('/secure');
            
          } else {
               // console.log(response["errors"]);
                this.error = listError(response["errors"]) 
                this.loading = false
          
            }
          },
          getUserInfo(){
           let userData =localStorage.getItem('users')
           this.userInfo = userData?JSON.parse(userData):{};
          },
          getPreUserInfo(){
            console.log("WHERE userData")
            let userData =localStorage.getItem('preLogin')
           
            
            if(userData){
             let dataObj = userData?JSON.parse(userData):{};
            this.userPreInfo = {...dataObj,"masked":maskEmail(dataObj.email)};
           
            }
           },
          async logOut (Id = '') {
            localStorage.removeItem('users')
            this.userInfo = {}
            this.token = ''
            this.logged = 0
            this.loading = false
            router.push('/auth/login');
          },
         
      },
   
  })
  
  */