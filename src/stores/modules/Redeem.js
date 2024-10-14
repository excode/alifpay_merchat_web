import config from '@/config'
import { listError } from '@/lib/functions'
import { deleteData, getData, patchData, postData } from '@/lib/httpRequest'
import { defineStore } from 'pinia'
  export const useRedeemStore = defineStore('Redeem', {
    state:() => ({
      redeems: [],
      sugredeems: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      redeem : {}
      }),
      
      actions: {
        async getRedeem(request = {}) {
            this.loading =true 
            const response = await getData( '/redeem',request,true,config.refServerURI);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.redeems = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.redeems = response
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
          async getRedeemAll(request = {}) {
            this.loading =true 
            const response = await getData( '/redeem/all',request,true,config.refServerURI);
            if(response["errors"]==undefined) {
              this.redeems = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateRedeemValue(id,newValue,colName) {
            const index = this.redeems.findIndex(redeem => redeem.id === id)
            
            if (index !== -1) {
               let _redeem = this.redeems[index];
                this.redeems.splice(index, 1, {..._redeem,[colName]:newValue});
            }
          }, 
          async getRedeemSuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/redeem/suggestions',request,true,config.refServerURI);
            if(response["errors"]==undefined) {
              this.sugredeems = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getRedeemDetails (Id = '') {
            this.loading = true
            const response = await getData('/redeem/'+ Id);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.redeem = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async addRedeem (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/redeem/alifpay', request ,true,config.refServerURI)
            if(response["errors"]==undefined || response["errors"]==null) {
                var newID= response.id
                this.redeems.unshift({...request,id:newID,_id:newID})
                this.loading = false
                this.curdLoading = false
                this.error = null
          } else{
            this.error = listError(response["errors"]) 
            this.loading = false
            this.curdLoading =false 
          }
          },
          async  updateRedeem (request = {}) {
            const id = request.id
            delete request.id
            this.curdLoading =true 
            const response = await  patchData( '/redeem/'+ id, request,true,config.refServerURI )
            if(response["errors"]==undefined || response["errors"]==null) {
             
                const index = this.redeems.findIndex(redeem => redeem.id === id)
                if (index !== -1) {
                    this.redeems.splice(index, 1, {...request,id:id,_id:id});
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
          async deleteRedeem (id) {
            this.loading =true 
            const response = await  deleteData( '/redeem/'+ id,true,config.refServerURI )
            if(response["errors"]==undefined || response["errors"]==null) {
              (this.redeems = this.redeems.filter(redeem => redeem.id !== id))
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else{
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          }
      },
   
  })
   
    