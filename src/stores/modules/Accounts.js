import { listError } from '@/lib/functions'
import { getData, postData } from '@/lib/httpRequest'
import { defineStore } from 'pinia'
  export const useAccountsStore = defineStore('Accounts', {
    state:() => ({
      accountss: [],
      sugaccountss: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      accounts : {}
      }),
      
      actions: {
        async getAccounts(request = {}) {
            this.loading =true 
            const response = await getData( '/accounts',request);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.accountss = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.accountss = response
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
          async getAccountsAll(request = {}) {
            this.loading =true 
            const response = await getData( '/accounts/all',request);
            if(response["errors"]==undefined) {
              this.accountss = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateAccountsValue(id,newValue,colName) {
            const index = this.accountss.findIndex(accounts => accounts.id === id)
            
            if (index !== -1) {
               let _accounts = this.accountss[index];
                this.accountss.splice(index, 1, {..._accounts,[colName]:newValue});
            }
          }, 
          async getAccountsSuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/accounts/suggestions',request);
            if(response["errors"]==undefined) {
              this.sugaccountss = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getAccountsDetails (Id = '') {
            this.loading = true
            const response = await getData('/accounts/'+ Id);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.accounts = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async addAccounts (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/accounts/reg', request )
            if(response["errors"]==undefined || response["errors"]==null) {
                var newID= response.id
                this.accountss.unshift({...request,id:newID,_id:newID,uid:'0'})
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
   
    