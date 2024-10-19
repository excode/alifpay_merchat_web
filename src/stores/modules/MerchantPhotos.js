import config from '@/config'
import { listError } from '@/lib/functions'
import { deleteData, getData, patchData, postData } from '@/lib/httpRequest'
import { defineStore } from 'pinia'
  export const useMerchantPhotosStore = defineStore('MerchantPhotos', {
    state:() => ({
      merchantPhotoss: [],
      sugmerchantPhotoss: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      merchantPhotos : {}
      }),
      
      actions: {
        async getMerchantPhotos(request = {}) {
            this.loading =true 
            const response = await getData( '/merchantPhotos',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.merchantPhotoss = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.merchantPhotoss = response
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
          async getMerchantPhotosAll(request = {}) {
            this.loading =true 
            const response = await getData( '/merchantPhotos/all',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              this.merchantPhotoss = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateMerchantPhotosValue(id,newValue,colName) {
            const index = this.merchantPhotoss.findIndex(merchantPhotos => merchantPhotos.id === id)
            
            if (index !== -1) {
               let _merchantPhotos = this.merchantPhotoss[index];
                this.merchantPhotoss.splice(index, 1, {..._merchantPhotos,[colName]:newValue});
            }
          }, 
          async getMerchantPhotosSuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/merchantPhotos/suggestions',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              this.sugmerchantPhotoss = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getMerchantPhotosDetails (Id = '') {
            this.loading = true
            const response = await getData('/merchantPhotos/'+ Id,{},true,config.serverURIMer);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.merchantPhotos = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async addMerchantPhotos (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/merchantPhotos', request,true,config.serverURIMer )
            if(response["errors"]==undefined || response["errors"]==null) {
                var newID= response.id
                this.merchantPhotoss.unshift({...request,id:newID,_id:newID})
                this.loading = false
                this.curdLoading = false
                this.error = null
          } else{
            this.error = listError(response["errors"]) 
            this.loading = false
            this.curdLoading =false 
          }
          },
          async  updateMerchantPhotos (request = {}) {
            const id = request.id
            delete request.id
            this.curdLoading =true 
            const response = await  patchData( '/merchantPhotos/'+ id, request,true,config.serverURIMer )
            if(response["errors"]==undefined || response["errors"]==null) {
             
                const index = this.merchantPhotoss.findIndex(merchantPhotos => merchantPhotos.id === id)
                if (index !== -1) {
                    this.merchantPhotoss.splice(index, 1, {...request,id:id,_id:id});
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
          async deleteMerchantPhotos (id) {
            this.loading =true 
            const response = await  deleteData( '/merchantPhotos/'+ id,true,config.serverURIMer )
            if(response["errors"]==undefined || response["errors"]==null) {
              (this.merchantPhotoss = this.merchantPhotoss.filter(merchantPhotos => merchantPhotos.id !== id))
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
   
    