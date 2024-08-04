import { listError } from '@/lib/functions'
import { deleteData, getData, patchData, postData } from '@/lib/httpRequest'
import { defineStore } from 'pinia'
  export const useFundtransferStore = defineStore('Fundtransfer', {
    state:() => ({
      fundtransfers: [],
      sugfundtransfers: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      fundtransfer : {},
      summary:{}
      }),
      
      actions: {
        async getFundtransfer(request = {}) {
            this.loading =true 
            const response = await getData( '/fundtransfer',request);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.fundtransfers = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.fundtransfers = response
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
          async getFundtransferAll(request = {}) {
            this.loading =true 
            const response = await getData( '/fundtransfer/all',request);
            if(response["errors"]==undefined) {
              this.fundtransfers = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          async getFundtransferSummary(request = {}) {
            this.loading =true 
            const response = await getData( '/fundtransfer/summary',request);
            if(response["errors"]==undefined) {
              this.summary = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateFundtransferValue(id,newValue,colName) {
            const index = this.fundtransfers.findIndex(fundtransfer => fundtransfer.id === id)
            
            if (index !== -1) {
               let _fundtransfer = this.fundtransfers[index];
                this.fundtransfers.splice(index, 1, {..._fundtransfer,[colName]:newValue});
            }
          }, 
          async getFundtransferSuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/fundtransfer/suggestions',request);
            if(response["errors"]==undefined) {
              this.sugfundtransfers = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getFundtransferDetails (Id = '') {
            this.loading = true
            const response = await getData('/fundtransfer/'+ Id);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.fundtransfer = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async addFundtransfer (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/fundtransfer', request )
            if(response["errors"]==undefined || response["errors"]==null) {
                var newID= response.id
                this.fundtransfers.unshift({...request,id:newID,_id:newID})
                this.loading = false
                this.curdLoading = false
                this.error = null
          } else{
            this.error = listError(response["errors"]) 
            this.loading = false
            this.curdLoading =false 
          }
          },
          async  updateFundtransfer (request = {}) {
            const id = request.id
            delete request.id
            this.curdLoading =true 
            const response = await  patchData( '/fundtransfer/'+ id, request )
            if(response["errors"]==undefined || response["errors"]==null) {
             
                const index = this.fundtransfers.findIndex(fundtransfer => fundtransfer.id === id)
                if (index !== -1) {
                    this.fundtransfers.splice(index, 1, {...request,id:id,_id:id});
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
          async deleteFundtransfer (id) {
            this.loading =true 
            const response = await  deleteData( '/fundtransfer/'+ id )
            if(response["errors"]==undefined || response["errors"]==null) {
              (this.fundtransfers = this.fundtransfers.filter(fundtransfer => fundtransfer.id !== id))
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
   
    