import config from '@/config'
import { listError } from '@/lib/functions'
import { deleteData, getData, patchData, postData } from '@/lib/httpRequest'
import { defineStore } from 'pinia'
  export const useMerchantDocumentsStore = defineStore('MerchantDocuments', {
    state:() => ({
      merchantDocumentss: [],
      sugmerchantDocumentss: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      merchantDocuments : {}
      }),
      
      actions: {
        async getMerchantDocuments(request = {}) {
            this.loading =true 
            const response = await getData( '/merchantDocuments',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.merchantDocumentss = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.merchantDocumentss = response
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
          async getMerchantDocumentsAll(request = {}) {
            this.loading =true 
            const response = await getData( '/merchantDocuments/all',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              this.merchantDocumentss = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateMerchantDocumentsValue(id,newValue,colName) {
            const index = this.merchantDocumentss.findIndex(merchantDocuments => merchantDocuments.id === id)
            
            if (index !== -1) {
               let _merchantDocuments = this.merchantDocumentss[index];
                this.merchantDocumentss.splice(index, 1, {..._merchantDocuments,[colName]:newValue});
            }
          }, 
          async getMerchantDocumentsSuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/merchantDocuments/suggestions',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              this.sugmerchantDocumentss = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getMerchantDocumentsDetails (Id = '') {
            this.loading = true
            const response = await getData('/merchantDocuments/'+ Id,{},true,config.serverURIMer);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.merchantDocuments = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async addMerchantDocuments (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/merchantDocuments', request,true,config.serverURIMer )
            if(response["errors"]==undefined || response["errors"]==null) {
                var newID= response.id
                this.merchantDocumentss.unshift({...request,id:newID,_id:newID})
                this.loading = false
                this.curdLoading = false
                this.error = null
          } else{
            this.error = listError(response["errors"]) 
            this.loading = false
            this.curdLoading =false 
          }
          },
          async  updateMerchantDocuments (request = {}) {
            const id = request.id
            delete request.id
            this.curdLoading =true 
            const response = await  patchData( '/merchantDocuments/'+ id, request ,true,config.serverURIMer)
            if(response["errors"]==undefined || response["errors"]==null) {
             
                const index = this.merchantDocumentss.findIndex(merchantDocuments => merchantDocuments.id === id)
                if (index !== -1) {
                    this.merchantDocumentss.splice(index, 1, {...request,id:id,_id:id});
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
          async deleteMerchantDocuments (id) {
            this.loading =true 
            const response = await  deleteData( '/merchantDocuments/'+ id ,true,config.serverURIMer)
            if(response["errors"]==undefined || response["errors"]==null) {
              (this.merchantDocumentss = this.merchantDocumentss.filter(merchantDocuments => merchantDocuments.id !== id))
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
   
    