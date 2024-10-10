import config from '@/config'
import { listError } from '@/lib/functions'
import { deleteData, getData, postData } from '@/lib/httpRequest'
import { defineStore } from 'pinia'
  export const useHierarchyStore = defineStore('Hierarchy', {
    state:() => ({
      hierarchys: [],
      sughierarchys: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      hierarchy : {}
      }),
      
      actions: {
        async getHierarchy(request = {}) {
            this.loading =true 
            const response = await getData( '/hierarchy',request,true,config.refServerURI);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.hierarchys = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.hierarchys = response
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
          async getHierarchyAll(request = {}) {
            this.loading =true 
            const response = await getData( '/hierarchy/wallets',request,true,config.refServerURI);
            if(response["errors"]==undefined) {
              this.hierarchys = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateHierarchyValue(id,newValue,colName) {
            const index = this.hierarchys.findIndex(hierarchy => hierarchy.id === id)
            
            if (index !== -1) {
               let _hierarchy = this.hierarchys[index];
                this.hierarchys.splice(index, 1, {..._hierarchy,[colName]:newValue});
            }
          }, 
          async getHierarchySuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/hierarchy/suggestions',request,true,config.refServerURI);
            if(response["errors"]==undefined) {
              this.sughierarchys = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getHierarchyDetails (Id = '') {
            this.loading = true
            const response = await getData('/hierarchy/'+ Id);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.hierarchy = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          
          async  updateHierarchy (request = {}) {
            const id = request.id
            delete request.id
            this.curdLoading =true 
            console.log(request)
            const response = await  postData( '/hierarchy/placement/reg/u', request,true,config.refServerURI )
            if(response["errors"]==undefined || response["errors"]==null) {
             
                const index = this.hierarchys.findIndex(hierarchy => hierarchy.id === id)
                if (index !== -1) {
                    this.hierarchys.splice(index, 1, {...request,id:id,_id:id});
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
          async deleteHierarchy (id) {
            this.loading =true 
            const response = await  deleteData( '/hierarchy/'+ id,true,config.refServerURI )
            if(response["errors"]==undefined || response["errors"]==null) {
              (this.hierarchys = this.hierarchys.filter(hierarchy => hierarchy.id !== id))
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
   
    