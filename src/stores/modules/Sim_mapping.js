import { listError } from '@/lib/functions'
  import {getData,postData,deleteData,patchData} from '@/lib/httpRequest'
import config from '@/config';
  import { defineStore } from 'pinia'
  export const useSim_mappingStore = defineStore('Sim_mapping', {
    state:() => ({
      sim_mappings: [],
      sugsim_mappings: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      sim_mapping : {}
      }),
      
      actions: {
        async getSim_mapping(request = {}) {
            this.loading =true 
            const response = await getData( '/apu/sim_mapping',request,true,config.mypaURL);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.sim_mappings = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.sim_mappings = response
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
          async getSim_mappingAll(request = {}) {
            this.loading =true 
            const response = await getData( '/sim_mapping/all',request);
            if(response["errors"]==undefined) {
              this.sim_mappings = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateSim_mappingValue(id,newValue,colName) {
            const index = this.sim_mappings.findIndex(sim_mapping => sim_mapping.id === id)
            
            if (index !== -1) {
               let _sim_mapping = this.sim_mappings[index];
                this.sim_mappings.splice(index, 1, {..._sim_mapping,[colName]:newValue});
            }
          }, 
          async getSim_mappingSuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/sim_mapping/suggestions',request);
            if(response["errors"]==undefined) {
              this.sugsim_mappings = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getSim_mappingDetails (Id = '') {
            this.loading = true
            const response = await getData('/sim_mapping/'+ Id);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.sim_mapping = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async addSim_mapping (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/apu/sim_mapping', request,true,config.mypaURL)
            if(response["errors"]==undefined || response["errors"]==null) {
                var newID= response.id
                this.sim_mappings.unshift({...request,id:newID,_id:newID})
                this.loading = false
                this.curdLoading = false
                this.error = null
          } else{
            this.error = listError(response["errors"]) 
            this.loading = false
            this.curdLoading =false 
          }
          },
          async  updateSim_mapping (request = {}) {
            const id = request.id
            delete request.id
            this.curdLoading =true 
            const response = await  patchData( '/sim_mapping/'+ id, request )
            if(response["errors"]==undefined || response["errors"]==null) {
             
                const index = this.sim_mappings.findIndex(sim_mapping => sim_mapping.id === id)
                if (index !== -1) {
                    this.sim_mappings.splice(index, 1, {...request,id:id,_id:id});
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
          async deleteSim_mapping (id) {
            this.loading =true 
            const response = await  deleteData( '/sim_mapping/'+ id )
            if(response["errors"]==undefined || response["errors"]==null) {
              (this.sim_mappings = this.sim_mappings.filter(sim_mapping => sim_mapping.id !== id))
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
   
    