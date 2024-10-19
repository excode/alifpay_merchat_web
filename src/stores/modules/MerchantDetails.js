import config from '@/config'
import { listError } from '@/lib/functions'
import { deleteData, getData, patchData, postData } from '@/lib/httpRequest'
import { defineStore } from 'pinia'
  export const useMerchantDetailsStore = defineStore('MerchantDetails', {
    state:() => ({
      merchantDetailss: [],
      sugmerchantDetailss: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      merchantDetails : {}
      }),
      
      actions: {
        async getMerchantDetails(request = {}) {
            this.loading =true 
            const response = await getData( '/merchantDetails',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.merchantDetailss = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.merchantDetailss = response
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
          async getMerchantDetailsAll(request = {}) {
            this.loading =true 
            const response = await getData( '/merchantDetails/all',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              this.merchantDetailss = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateMerchantDetailsValue(id,newValue,colName) {
            const index = this.merchantDetailss.findIndex(merchantDetails => merchantDetails.id === id)
            
            if (index !== -1) {
               let _merchantDetails = this.merchantDetailss[index];
                this.merchantDetailss.splice(index, 1, {..._merchantDetails,[colName]:newValue});
            }
          }, 
          async getMerchantDetailsSuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/merchantDetails/suggestions',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              this.sugmerchantDetailss = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getMerchantDetailsDetails (Id = '') {
            this.loading = true
            const response = await getData('/merchantDetails/'+ Id,{},true,config.serverURIMer);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.merchantDetails = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async addMerchantDetails (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/merchantDetails', request ,true,config.serverURIMer)
            if(response["errors"]==undefined || response["errors"]==null) {
                var newID= response.id
                this.merchantDetailss.unshift({...request,id:newID,_id:newID})
                this.loading = false
                this.curdLoading = false
                this.error = null
          } else{
            this.error = listError(response["errors"]) 
            this.loading = false
            this.curdLoading =false 
          }
          },
          async  updateMerchantDetails (request = {}) {
            const id = request.id
            delete request.id
            this.curdLoading =true 
            const response = await  patchData( '/merchantDetails/'+ id, request,true,config.serverURIMer )
            if(response["errors"]==undefined || response["errors"]==null) {
             
                const index = this.merchantDetailss.findIndex(merchantDetails => merchantDetails.id === id)
                if (index !== -1) {
                    this.merchantDetailss.splice(index, 1, {...request,id:id,_id:id});
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
          async deleteMerchantDetails (id) {
            this.loading =true 
            const response = await  deleteData( '/merchantDetails/'+ id,true,config.serverURIMer )
            if(response["errors"]==undefined || response["errors"]==null) {
              (this.merchantDetailss = this.merchantDetailss.filter(merchantDetails => merchantDetails.id !== id))
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else{
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async sendApplication (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/merchantDetails/sendApplication', request,true,config.serverURIMer )
            if(response["errors"]==undefined || response["errors"]==null) {
               
                this.loading = false
                this.curdLoading = false
                this.error = null
          } else{
            this.error = listError(response["errors"]) 
            this.loading = false
            this.curdLoading =false 
          }
          },
      },
   
  })
   
    