import config from '@/config'
import { listError } from '@/lib/functions'
import { deleteData, getData, patchData, postData } from '@/lib/httpRequest'
import router from '@/router/'
import { defineStore } from 'pinia'
  export const useStoresStore = defineStore('Stores', {
    state:() => ({
      storess: [],
      sugstoress: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      stores : {},
      loading_otp:false
      }),
      
      actions: {
        async getStores(request = {}) {
            this.loading =true 
            const response = await getData( '/stores',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.storess = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.storess = response
                this.totalRecords = response.length
                this.totalpages = 1
                this.page = 1
              }
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async getStoresAll(request = {}) {
            this.loading =true 
            const response = await getData( '/stores/all',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              this.storess = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateStoresValue(id,newValue,colName) {
            const index = this.storess.findIndex(stores => stores.id === id)
            
            if (index !== -1) {
               let _stores = this.storess[index];
                this.storess.splice(index, 1, {..._stores,[colName]:newValue});
            }
          }, 
          async getStoresSuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/stores/suggestions',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              this.sugstoress = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getStoresDetails (Id = '') {
            this.loading = true
            const response = await getData('/stores/'+ Id,{},true,config.serverURIMer);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.stores = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async addStores (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/stores', request,true,config.serverURIMer )
            if(response["errors"]==undefined || response["errors"]==null) {
                var newID= response.id
                this.storess.unshift({...request,id:newID,_id:newID})
                this.loading = false
                this.curdLoading = false
                this.error = null
                router.push('/secure/stores/'+newID);
             
          } else{
            this.error = listError(response["errors"]) 
            this.loading = false
            this.curdLoading =false 
          }
          },
          async  updateStores (request = {}) {
            const id = request.id
            delete request.id
            this.curdLoading =true 
            const response = await  patchData( '/stores/'+ id, request,true,config.serverURIMer )
            if(response["errors"]==undefined || response["errors"]==null) {
             
                const index = this.storess.findIndex(stores => stores.id === id)
                if (index !== -1) {
                    this.storess.splice(index, 1, {...request,id:id,_id:id});
                }
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else{
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async deleteStores (id) {
            this.loading =true 
            const response = await  deleteData( '/stores/'+ id,true,config.serverURIMer )
            if(response["errors"]==undefined || response["errors"]==null) {
              (this.storess = this.storess.filter(stores => stores.id !== id))
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else{
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async sendRequestOTP2(username) {
            if(username){
              this.loading_otp =true 
              const response = await patchData( '/users/request/otp2/'+username,{});
              if(response["errors"]==undefined) {
                this.loading_otp = false
                this.error=null
              } else {
                this.error=listError(response["errors"])
                this.loading_otp = false
              
              }
            }else{
              this.loading_otp = false
              this.error="username is empty"
            }
          },
          async updateStoreWallet(request = {}) {
            this.loading_otp =true 
            const response = await patchData( '/stores/wallet/'+ request.storeId,request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              this.loading_otp = false
              this.error=null;
            } else {
              this.error=listError(response["errors"])
              this.loading_otp = false
            
            }
          }
      },
   
  })
   
    