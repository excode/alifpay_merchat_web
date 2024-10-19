import config from '@/config'
import { listError } from '@/lib/functions'
import { deleteData, getData, patchData, postData } from '@/lib/httpRequest'
import { defineStore } from 'pinia'
  export const useBusinessTypeStore = defineStore('BusinessType', {
    state:() => ({
      businessTypes: [],
      sugbusinessTypes: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      businessType : {}
      }),
      
      actions: {
        async getBusinessType(request = {}) {
            this.loading =true 
            const response = await getData( '/businessType',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.businessTypes = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.businessTypes = response
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
          async getBusinessTypeAll(request = {}) {
            this.loading =true 
            const response = await getData( '/businessType/all',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              this.businessTypes = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateBusinessTypeValue(id,newValue,colName) {
            const index = this.businessTypes.findIndex(businessType => businessType.id === id)
            
            if (index !== -1) {
               let _businessType = this.businessTypes[index];
                this.businessTypes.splice(index, 1, {..._businessType,[colName]:newValue});
            }
          }, 
          async getBusinessTypeSuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/businessType/suggestions',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              this.sugbusinessTypes = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getBusinessTypeDetails (Id = '') {
            this.loading = true
            const response = await getData('/businessType/'+ Id,{},true,config.serverURIMer);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.businessType = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async addBusinessType (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/businessType', request,true,config.serverURIMer )
            if(response["errors"]==undefined || response["errors"]==null) {
                var newID= response.id
                this.businessTypes.unshift({...request,id:newID,_id:newID})
                this.loading = false
                this.curdLoading = false
                this.error = null
          } else{
            this.error = listError(response["errors"]) 
            this.loading = false
            this.curdLoading =false 
          }
          },
          async  updateBusinessType (request = {}) {
            const id = request.id
            delete request.id
            this.curdLoading =true 
            const response = await  patchData( '/businessType/'+ id, request,true,config.serverURIMer )
            if(response["errors"]==undefined || response["errors"]==null) {
             
                const index = this.businessTypes.findIndex(businessType => businessType.id === id)
                if (index !== -1) {
                    this.businessTypes.splice(index, 1, {...request,id:id,_id:id});
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
          async deleteBusinessType (id) {
            this.loading =true 
            const response = await  deleteData( '/businessType/'+ id ,true,config.serverURIMer)
            if(response["errors"]==undefined || response["errors"]==null) {
              (this.businessTypes = this.businessTypes.filter(businessType => businessType.id !== id))
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
   
    