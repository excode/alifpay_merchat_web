import { listError } from '@/lib/functions'
  import {getData,postData,deleteData,patchData} from '@/lib/httpRequest'
  import { defineStore } from 'pinia'
  export const useBankStore = defineStore('Bank', {
    state:() => ({
      banks: [],
      sugbanks: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      bank : {}
      }),
      
      actions: {
        async getBank(request = {}) {
            this.loading =true 
            const response = await getData( '/bank',request);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.banks = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.banks = response
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
          async getBankAll(request = {}) {
            this.loading =true 
            const response = await getData( '/bank/all',request);
            if(response["errors"]==undefined) {
              this.banks = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateBankValue(id,newValue,colName) {
            const index = this.banks.findIndex(bank => bank.id === id)
            
            if (index !== -1) {
               let _bank = this.banks[index];
                this.banks.splice(index, 1, {..._bank,[colName]:newValue});
            }
          }, 
          async getBankSuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/bank/suggestions',request);
            if(response["errors"]==undefined) {
              this.sugbanks = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getBankDetails (Id = '') {
            this.loading = true
            const response = await getData('/bank/'+ Id);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.bank = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async addBank (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/bank', request )
            if(response["errors"]==undefined || response["errors"]==null) {
                var newID= response.id
                this.banks.unshift({...request,id:newID,_id:newID})
                this.loading = false
                this.curdLoading = false
                this.error = null
          } else{
            this.error = listError(response["errors"]) 
            this.loading = false
            this.curdLoading =false 
          }
          },
          async  updateBank (request = {}) {
            const id = request.id
            delete request.id
            this.curdLoading =true 
            const response = await  patchData( '/bank/'+ id, request )
            if(response["errors"]==undefined || response["errors"]==null) {
             
                const index = this.banks.findIndex(bank => bank.id === id)
                if (index !== -1) {
                    this.banks.splice(index, 1, {...request,id:id,_id:id});
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
          async deleteBank (id) {
            this.loading =true 
            const response = await  deleteData( '/bank/'+ id )
            if(response["errors"]==undefined || response["errors"]==null) {
              (this.banks = this.banks.filter(bank => bank.id !== id))
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
   
    