import config from '@/config'
import { listError } from '@/lib/functions'
import { deleteData, getData, patchData, postData } from '@/lib/httpRequest'
import { defineStore } from 'pinia'
  export const useTransactionsStore = defineStore('Transactions', {
    state:() => ({
      transactionss: [],
      sugtransactionss: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      transactions : {}
      }),
      
      actions: {
        async getTransactions(request = {}) {
            this.loading =true 
            const response = await getData( '/transactions',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.transactionss = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.transactionss = response
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
          async getTransactionsAll(request = {}) {
            this.loading =true 
            const response = await getData( '/transactions/all',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              this.transactionss = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateTransactionsValue(id,newValue,colName) {
            const index = this.transactionss.findIndex(transactions => transactions.id === id)
            
            if (index !== -1) {
               let _transactions = this.transactionss[index];
                this.transactionss.splice(index, 1, {..._transactions,[colName]:newValue});
            }
          }, 
          async getTransactionsSuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/transactions/suggestions',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              this.sugtransactionss = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getTransactionsDetails (Id = '') {
            this.loading = true
            const response = await getData('/transactions/'+ Id,{},true,config.serverURIMer);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.transactions = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async addTransactions (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/transactions', request ,true,config.serverURIMer)
            if(response["errors"]==undefined || response["errors"]==null) {
                var newID= response.id
                this.transactionss.unshift({...request,id:newID,_id:newID})
                this.loading = false
                this.curdLoading = false
                this.error = null
          } else{
            this.error = listError(response["errors"]) 
            this.loading = false
            this.curdLoading =false 
          }
          },
          async  updateTransactions (request = {}) {
            const id = request.id
            delete request.id
            this.curdLoading =true 
            const response = await  patchData( '/transactions/'+ id, request ,true,config.serverURIMer)
            if(response["errors"]==undefined || response["errors"]==null) {
             
                const index = this.transactionss.findIndex(transactions => transactions.id === id)
                if (index !== -1) {
                    this.transactionss.splice(index, 1, {...request,id:id,_id:id});
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
          async deleteTransactions (id) {
            this.loading =true 
            const response = await  deleteData( '/transactions/'+ id ,true,config.serverURIMer)
            if(response["errors"]==undefined || response["errors"]==null) {
              (this.transactionss = this.transactionss.filter(transactions => transactions.id !== id))
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
   
    