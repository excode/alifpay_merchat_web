import { listError } from '@/lib/functions'
  import {getData,postData,deleteData,patchData} from '@/lib/httpRequest'
  import { defineStore } from 'pinia'
  export const useBankaccountStore = defineStore('Bankaccount', {
    state:() => ({
      bankaccounts: [],
      sugbankaccounts: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      bankaccount : {}
      }),
      
      actions: {
        async getBankaccount(request = {}) {
            this.loading =true 
            const response = await getData( '/bankaccount2',request);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.bankaccounts = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.bankaccounts = response
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
          async getBankaccountAll(request = {}) {
            this.loading =true 
            const response = await getData( '/bankaccount2/all',request);
            if(response["errors"]==undefined) {
              this.bankaccounts = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateBankaccountValue(id,newValue,colName) {
            const index = this.bankaccounts.findIndex(bankaccount => bankaccount.id === id)
            
            if (index !== -1) {
               let _bankaccount = this.bankaccounts[index];
                this.bankaccounts.splice(index, 1, {..._bankaccount,[colName]:newValue});
            }
          }, 
          async getBankaccountSuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/bankaccount2/suggestions',request);
            if(response["errors"]==undefined) {
              this.sugbankaccounts = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getBankaccountDetails (Id = '') {
            this.loading = true
            const response = await getData('/bankaccount2/'+ Id);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.bankaccount = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async addBankaccount (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/bankaccount2', request )
            if(response["errors"]==undefined || response["errors"]==null) {
                var newID= response.id
                this.bankaccounts.unshift({...request,id:newID,_id:newID})
                this.loading = false
                this.curdLoading = false
                this.error = null
          } else{
            this.error = listError(response["errors"]) 
            this.loading = false
            this.curdLoading =false 
          }
          },
          async  updateBankaccount (request = {}) {
            const id = request.id
            delete request.id
            this.curdLoading =true 
            const response = await  patchData( '/bankaccount2/'+ id, request )
            if(response["errors"]==undefined || response["errors"]==null) {
             
                const index = this.bankaccounts.findIndex(bankaccount => bankaccount.id === id)
                if (index !== -1) {
                    this.bankaccounts.splice(index, 1, {...request,id:id,_id:id});
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
          async deleteBankaccount (id) {
            this.loading =true 
            const response = await  deleteData( '/bankaccount2/'+ id )
            if(response["errors"]==undefined || response["errors"]==null) {
              (this.bankaccounts = this.bankaccounts.filter(bankaccount => bankaccount.id !== id))
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
   
    