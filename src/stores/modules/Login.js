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
            //console.log(request)
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
                refresh: response.refreshToken
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
  