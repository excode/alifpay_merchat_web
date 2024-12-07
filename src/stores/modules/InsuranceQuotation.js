import { listError } from '@/lib/functions'
  import {getData,postData,deleteData,patchData} from '@/lib/httpRequest'
  import { defineStore } from 'pinia'
  export const useInsuranceQuotationStore = defineStore('InsuranceQuotation', {
    state:() => ({
      insuranceQuotations: [],
      suginsuranceQuotations: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      insuranceQuotation : {}
      }),
      
      actions: {
        async getInsuranceQuotation(request = {}) {
            this.loading =true 
            const response = await getData( '/insuranceQuotation',request);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.insuranceQuotations = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.insuranceQuotations = response
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
          async getInsuranceQuotationAll(request = {}) {
            this.loading =true 
            const response = await getData( '/insuranceQuotation/all',request);
            if(response["errors"]==undefined) {
              this.insuranceQuotations = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateInsuranceQuotationValue(id,newValue,colName) {
            const index = this.insuranceQuotations.findIndex(insuranceQuotation => insuranceQuotation.id === id)
            
            if (index !== -1) {
               let _insuranceQuotation = this.insuranceQuotations[index];
                this.insuranceQuotations.splice(index, 1, {..._insuranceQuotation,[colName]:newValue});
            }
          }, 
          async getInsuranceQuotationSuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/insuranceQuotation/suggestions',request);
            if(response["errors"]==undefined) {
              this.suginsuranceQuotations = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getInsuranceQuotationDetails (Id = '') {
            this.loading = true
            const response = await getData('/insuranceQuotation/'+ Id);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.insuranceQuotation = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async addInsuranceQuotation (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/insuranceQuotation', request )
            if(response["errors"]==undefined || response["errors"]==null) {
                var newID= response.id
                this.insuranceQuotations.unshift({...request,id:newID,_id:newID})
                this.loading = false
                this.curdLoading = false
                this.error = null
          } else{
            this.error = listError(response["errors"]) 
            this.loading = false
            this.curdLoading =false 
          }
          },
          async  updateInsuranceQuotation (request = {}) {
            const id = request.id
            delete request.id
            this.curdLoading =true 
            const response = await  patchData( '/insuranceQuotation/'+ id, request )
            if(response["errors"]==undefined || response["errors"]==null) {
             
                const index = this.insuranceQuotations.findIndex(insuranceQuotation => insuranceQuotation.id === id)
                if (index !== -1) {
                    this.insuranceQuotations.splice(index, 1, {...request,id:id,_id:id});
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
          async deleteInsuranceQuotation (id) {
            this.loading =true 
            const response = await  deleteData( '/insuranceQuotation/'+ id )
            if(response["errors"]==undefined || response["errors"]==null) {
              (this.insuranceQuotations = this.insuranceQuotations.filter(insuranceQuotation => insuranceQuotation.id !== id))
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
   
    