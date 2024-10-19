import config from '@/config'
import { listError } from '@/lib/functions'
import { deleteData, getData, patchData, postData } from '@/lib/httpRequest'
import { defineStore } from 'pinia'
  export const useBusinessCategoryStore = defineStore('BusinessCategory', {
    state:() => ({
      businessCategorys: [],
      sugbusinessCategorys: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      businessCategory : {}
      }),
      
      actions: {
        async getBusinessCategory(request = {}) {
            this.loading =true 
            const response = await getData( '/businessCategory',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.businessCategorys = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.businessCategorys = response
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
          async getBusinessCategoryAll(request = {}) {
            this.loading =true 
            const response = await getData( '/businessCategory/all',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              this.businessCategorys = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateBusinessCategoryValue(id,newValue,colName) {
            const index = this.businessCategorys.findIndex(businessCategory => businessCategory.id === id)
            
            if (index !== -1) {
               let _businessCategory = this.businessCategorys[index];
                this.businessCategorys.splice(index, 1, {..._businessCategory,[colName]:newValue});
            }
          }, 
          async getBusinessCategorySuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/businessCategory/suggestions',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              this.sugbusinessCategorys = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getBusinessCategoryDetails (Id = '') {
            this.loading = true
            const response = await getData('/businessCategory/'+ Id,{},true,config.serverURIMer);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.businessCategory = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async addBusinessCategory (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/businessCategory', request,true,config.serverURIMer )
            if(response["errors"]==undefined || response["errors"]==null) {
                var newID= response.id
                this.businessCategorys.unshift({...request,id:newID,_id:newID})
                this.loading = false
                this.curdLoading = false
                this.error = null
          } else{
            this.error = listError(response["errors"]) 
            this.loading = false
            this.curdLoading =false 
          }
          },
          async  updateBusinessCategory (request = {}) {
            const id = request.id
            delete request.id
            this.curdLoading =true 
            const response = await  patchData( '/businessCategory/'+ id, request,true,config.serverURIMer )
            if(response["errors"]==undefined || response["errors"]==null) {
             
                const index = this.businessCategorys.findIndex(businessCategory => businessCategory.id === id)
                if (index !== -1) {
                    this.businessCategorys.splice(index, 1, {...request,id:id,_id:id});
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
          async deleteBusinessCategory (id) {
            this.loading =true 
            const response = await  deleteData( '/businessCategory/'+ id ,true,config.serverURIMer)
            if(response["errors"]==undefined || response["errors"]==null) {
              (this.businessCategorys = this.businessCategorys.filter(businessCategory => businessCategory.id !== id))
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
   
    