import { listError } from '@/lib/functions'
  import {getData,postData,deleteData,patchData} from '@/lib/httpRequest'
  import { defineStore } from 'pinia'
  export const useSimsStore = defineStore('Sims', {
    state:() => ({
      simss: [],
      sugsimss: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      sims : {}
      }),
      
      actions: {
        async getSims(request = {}) {
            this.loading =true 
            const response = await getData( '/sims',request);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.simss = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.simss = response
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
          async getSimsAll(request = {}) {
            this.loading =true 
            const response = await getData( '/sims/all',request);
            if(response["errors"]==undefined) {
              this.simss = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateSimsValue(id,newValue,colName) {
            const index = this.simss.findIndex(sims => sims.id === id)
            
            if (index !== -1) {
               let _sims = this.simss[index];
                this.simss.splice(index, 1, {..._sims,[colName]:newValue});
            }
          }, 
          async getSimsSuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/sims/suggestions',request);
            if(response["errors"]==undefined) {
              this.sugsimss = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getSimsDetails (Id = '') {
            this.loading = true
            const response = await getData('/sims/'+ Id);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.sims = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async addSims (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/sims', request )
            if(response["errors"]==undefined || response["errors"]==null) {
                var newID= response.id
                this.simss.unshift({...request,id:newID,_id:newID})
                this.loading = false
                this.curdLoading = false
                this.error = null
          } else{
            this.error = listError(response["errors"]) 
            this.loading = false
            this.curdLoading =false 
          }
          },
          async  updateSims (request = {}) {
            const id = request.id
            delete request.id
            this.curdLoading =true 
            const response = await  patchData( '/sims/'+ id, request )
            if(response["errors"]==undefined || response["errors"]==null) {
             
                const index = this.simss.findIndex(sims => sims.id === id)
                if (index !== -1) {
                    this.simss.splice(index, 1, {...request,id:id,_id:id});
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
          async deleteSims (id) {
            this.loading =true 
            const response = await  deleteData( '/sims/'+ id )
            if(response["errors"]==undefined || response["errors"]==null) {
              (this.simss = this.simss.filter(sims => sims.id !== id))
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
   
    