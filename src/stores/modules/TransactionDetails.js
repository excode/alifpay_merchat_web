import config from '@/config'
import { listError } from '@/lib/functions'
import { deleteData, getData, patchData, postData } from '@/lib/httpRequest'
import { defineStore } from 'pinia'
  export const useTransactionDetailsStore = defineStore('TransactionDetails', {
    state:() => ({
      transactionDetailss: [],
      sugtransactionDetailss: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      transactionDetails : {}
      }),
      
      actions: {
        async getTransactionDetails(request = {}) {
            this.loading =true 
            const response = await getData( '/transactionDetails',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.transactionDetailss = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.transactionDetailss = response
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
          async getTransactionDetailsAll(request = {}) {
            this.loading =true 
            const response = await getData( '/transactionDetails/all',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              this.transactionDetailss = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateTransactionDetailsValue(id,newValue,colName) {
            const index = this.transactionDetailss.findIndex(transactionDetails => transactionDetails.id === id)
            
            if (index !== -1) {
               let _transactionDetails = this.transactionDetailss[index];
                this.transactionDetailss.splice(index, 1, {..._transactionDetails,[colName]:newValue});
            }
          }, 
          async getTransactionDetailsSuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/transactionDetails/suggestions',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              this.sugtransactionDetailss = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getTransactionDetailsDetails (Id = '') {
            this.loading = true
            const response = await getData('/transactionDetails/'+ Id,true,config.serverURIMer);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.transactionDetails = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async addTransactionDetails (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/transactionDetails', request,true,config.serverURIMer )
            if(response["errors"]==undefined || response["errors"]==null) {
                var newID= response.id
                this.transactionDetailss.unshift({...request,id:newID,_id:newID})
                this.loading = false
                this.curdLoading = false
                this.error = null
          } else{
            this.error = listError(response["errors"]) 
            this.loading = false
            this.curdLoading =false 
          }
          },
          async  updateTransactionDetails (request = {}) {
            const id = request.id
            delete request.id
            this.curdLoading =true 
            const response = await  patchData( '/transactionDetails/'+ id, request,true,config.serverURIMer )
            if(response["errors"]==undefined || response["errors"]==null) {
             
                const index = this.transactionDetailss.findIndex(transactionDetails => transactionDetails.id === id)
                if (index !== -1) {
                    this.transactionDetailss.splice(index, 1, {...request,id:id,_id:id});
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
          async deleteTransactionDetails (id) {
            this.loading =true 
            const response = await  deleteData( '/transactionDetails/'+ id,true,config.serverURIMer )
            if(response["errors"]==undefined || response["errors"]==null) {
              (this.transactionDetailss = this.transactionDetailss.filter(transactionDetails => transactionDetails.id !== id))
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
   
    