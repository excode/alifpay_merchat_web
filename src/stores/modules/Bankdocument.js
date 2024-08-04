import { listError } from '@/lib/functions'
  import {getData,postData,deleteData,patchData} from '@/lib/httpRequest'
  import { defineStore } from 'pinia'
  export const useBankdocumentStore = defineStore('Bankdocument', {
    state:() => ({
      bankdocuments: [],
      sugbankdocuments: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      bankdocument : {}
      }),
      
      actions: {
        async getBankdocument(request = {}) {
            this.loading =true 
            const response = await getData( '/bankdocument',request);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.bankdocuments = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.bankdocuments = response
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
          async getBankdocumentAll(request = {}) {
            this.loading =true 
            const response = await getData( '/bankdocument/all',request);
            if(response["errors"]==undefined) {
              this.bankdocuments = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateBankdocumentValue(id,newValue,colName) {
            const index = this.bankdocuments.findIndex(bankdocument => bankdocument.id === id)
            
            if (index !== -1) {
               let _bankdocument = this.bankdocuments[index];
                this.bankdocuments.splice(index, 1, {..._bankdocument,[colName]:newValue});
            }
          }, 
          async getBankdocumentSuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/bankdocument/suggestions',request);
            if(response["errors"]==undefined) {
              this.sugbankdocuments = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getBankdocumentDetails (Id = '') {
            this.loading = true
            const response = await getData('/bankdocument/'+ Id);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.bankdocument = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async addBankdocument (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/bankdocument', request )
            if(response["errors"]==undefined || response["errors"]==null) {
                var newID= response.id
                this.bankdocuments.unshift({...request,id:newID,_id:newID})
                this.loading = false
                this.curdLoading = false
                this.error = null
          } else{
            this.error = listError(response["errors"]) 
            this.loading = false
            this.curdLoading =false 
          }
          },
          async  updateBankdocument (request = {}) {
            const id = request.id
            delete request.id
            this.curdLoading =true 
            const response = await  patchData( '/bankdocument/'+ id, request )
            if(response["errors"]==undefined || response["errors"]==null) {
             
                const index = this.bankdocuments.findIndex(bankdocument => bankdocument.id === id)
                if (index !== -1) {
                    this.bankdocuments.splice(index, 1, {...request,id:id,_id:id});
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
          async deleteBankdocument (id) {
            this.loading =true 
            const response = await  deleteData( '/bankdocument/'+ id )
            if(response["errors"]==undefined || response["errors"]==null) {
              (this.bankdocuments = this.bankdocuments.filter(bankdocument => bankdocument.id !== id))
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
   
    