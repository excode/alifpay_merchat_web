import { listError } from '@/lib/functions'
import { deleteData, getData, patchData, postData } from '@/lib/httpRequest'
import { defineStore } from 'pinia'
  export const useMerchantInfoStore = defineStore('MerchantInfo', {
    state:() => ({
      merchantInfos: [],
      sugmerchantInfos: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      merchantInfo : {}
      }),
      
      actions: {
        async getMerchantInfo(request = {}) {
            this.loading =true 
            const response = await getData( '/merchantInfo',request);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.merchantInfos = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.merchantInfos = response
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
          async getMerchantInfoAll(request = {}) {
            this.loading =true 
            const response = await getData( '/merchantInfo/all',request);
            if(response["errors"]==undefined) {
              this.merchantInfos = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateMerchantInfoValue(id,newValue,colName) {
            const index = this.merchantInfos.findIndex(merchantInfo => merchantInfo.id === id)
            
            if (index !== -1) {
               let _merchantInfo = this.merchantInfos[index];
                this.merchantInfos.splice(index, 1, {..._merchantInfo,[colName]:newValue});
            }
          }, 
          async getMerchantInfoSuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/merchantInfo/suggestions',request);
            if(response["errors"]==undefined) {
              this.sugmerchantInfos = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getMerchantInfoDetails (Id = '') {
            this.loading = true
            const response = await getData('/merchantInfo/'+ Id);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.merchantInfo = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async addMerchantInfo (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/merchantInfo', request )
            if(response["errors"]==undefined || response["errors"]==null) {
                var newID= response.id
                this.merchantInfos.unshift({...request,id:newID,_id:newID})
                this.loading = false
                this.curdLoading = false
                this.error = null
          } else{
            this.error = listError(response["errors"]) 
            this.loading = false
            this.curdLoading =false 
          }
          },
          async  updateMerchantInfo (request = {}) {
            const id = request.id
            delete request.id
            this.curdLoading =true 
            const response = await  patchData( '/merchantInfo/'+ id, request )
            if(response["errors"]==undefined || response["errors"]==null) {
             
                const index = this.merchantInfos.findIndex(merchantInfo => merchantInfo.id === id)
                if (index !== -1) {
                    this.merchantInfos.splice(index, 1, {...request,id:id,_id:id});
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
          async deleteMerchantInfo (id) {
            this.loading =true 
            const response = await  deleteData( '/merchantInfo/'+ id )
            if(response["errors"]==undefined || response["errors"]==null) {
              (this.merchantInfos = this.merchantInfos.filter(merchantInfo => merchantInfo.id !== id))
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
            const response = await  postData( '/merchantInfo/sendApplication', request )
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
   
    