import { listError } from '@/lib/functions'
  import {getData,postData,deleteData,patchData} from '@/lib/httpRequest'
  import { defineStore } from 'pinia'
  export const useOwnerDetailsStore = defineStore('OwnerDetails', {
    state:() => ({
      ownerDetailss: [],
      sugownerDetailss: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      ownerDetails : {}
      }),
      
      actions: {
        async getOwnerDetails(request = {}) {
            this.loading =true 
            const response = await getData( '/ownerDetails',request);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.ownerDetailss = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.ownerDetailss = response
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
          async getOwnerDetailsAll(request = {}) {
            this.loading =true 
            const response = await getData( '/ownerDetails/all',request);
            if(response["errors"]==undefined) {
              this.ownerDetailss = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateOwnerDetailsValue(id,newValue,colName) {
            const index = this.ownerDetailss.findIndex(ownerDetails => ownerDetails.id === id)
            
            if (index !== -1) {
               let _ownerDetails = this.ownerDetailss[index];
                this.ownerDetailss.splice(index, 1, {..._ownerDetails,[colName]:newValue});
            }
          }, 
          async getOwnerDetailsSuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/ownerDetails/suggestions',request);
            if(response["errors"]==undefined) {
              this.sugownerDetailss = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getOwnerDetailsDetails (Id = '') {
            this.loading = true
            const response = await getData('/ownerDetails/'+ Id);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.ownerDetails = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async addOwnerDetails (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/ownerDetails', request )
            if(response["errors"]==undefined || response["errors"]==null) {
                var newID= response.id
                this.ownerDetailss.unshift({...request,id:newID,_id:newID})
                this.loading = false
                this.curdLoading = false
                this.error = null
          } else{
            this.error = listError(response["errors"]) 
            this.loading = false
            this.curdLoading =false 
          }
          },
          async  updateOwnerDetails (request = {}) {
            const id = request.id
            delete request.id
            this.curdLoading =true 
            const response = await  patchData( '/ownerDetails/'+ id, request )
            if(response["errors"]==undefined || response["errors"]==null) {
             
                const index = this.ownerDetailss.findIndex(ownerDetails => ownerDetails.id === id)
                if (index !== -1) {
                    this.ownerDetailss.splice(index, 1, {...request,id:id,_id:id});
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
          async deleteOwnerDetails (id) {
            this.loading =true 
            const response = await  deleteData( '/ownerDetails/'+ id )
            if(response["errors"]==undefined || response["errors"]==null) {
              (this.ownerDetailss = this.ownerDetailss.filter(ownerDetails => ownerDetails.id !== id))
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
   
    