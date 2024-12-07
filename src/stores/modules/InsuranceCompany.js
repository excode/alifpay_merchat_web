import { listError } from '@/lib/functions'
  import {getData,postData,deleteData,patchData} from '@/lib/httpRequest'
  import { defineStore } from 'pinia'
  export const useInsuranceCompanyStore = defineStore('InsuranceCompany', {
    state:() => ({
      insuranceCompanys: [],
      suginsuranceCompanys: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      insuranceCompany : {}
      }),
      
      actions: {
        async getInsuranceCompany(request = {}) {
            this.loading =true 
            const response = await getData( '/insuranceCompany',request);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.insuranceCompanys = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.insuranceCompanys = response
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
          async getInsuranceCompanyAll(request = {}) {
            this.loading =true 
            const response = await getData( '/insuranceCompany/all',request);
            if(response["errors"]==undefined) {
              this.insuranceCompanys = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateInsuranceCompanyValue(id,newValue,colName) {
            const index = this.insuranceCompanys.findIndex(insuranceCompany => insuranceCompany.id === id)
            
            if (index !== -1) {
               let _insuranceCompany = this.insuranceCompanys[index];
                this.insuranceCompanys.splice(index, 1, {..._insuranceCompany,[colName]:newValue});
            }
          }, 
          async getInsuranceCompanySuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/insuranceCompany/suggestions',request);
            if(response["errors"]==undefined) {
              this.suginsuranceCompanys = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getInsuranceCompanyDetails (Id = '') {
            this.loading = true
            const response = await getData('/insuranceCompany/'+ Id);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.insuranceCompany = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async addInsuranceCompany (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/insuranceCompany', request )
            if(response["errors"]==undefined || response["errors"]==null) {
                var newID= response.id
                this.insuranceCompanys.unshift({...request,id:newID,_id:newID})
                this.loading = false
                this.curdLoading = false
                this.error = null
          } else{
            this.error = listError(response["errors"]) 
            this.loading = false
            this.curdLoading =false 
          }
          },
          async  updateInsuranceCompany (request = {}) {
            const id = request.id
            delete request.id
            this.curdLoading =true 
            const response = await  patchData( '/insuranceCompany/'+ id, request )
            if(response["errors"]==undefined || response["errors"]==null) {
             
                const index = this.insuranceCompanys.findIndex(insuranceCompany => insuranceCompany.id === id)
                if (index !== -1) {
                    this.insuranceCompanys.splice(index, 1, {...request,id:id,_id:id});
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
          async deleteInsuranceCompany (id) {
            this.loading =true 
            const response = await  deleteData( '/insuranceCompany/'+ id )
            if(response["errors"]==undefined || response["errors"]==null) {
              (this.insuranceCompanys = this.insuranceCompanys.filter(insuranceCompany => insuranceCompany.id !== id))
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
   
    