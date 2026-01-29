import { listError } from '@/lib/functions'
  import {getData,postData,deleteData,patchData} from '@/lib/httpRequest'
  import { defineStore } from 'pinia'
import config from '@/config';
  export const useTopupsStore = defineStore('Topups', {
    state:() => ({
      topupss: [],
      sugtopupss: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      topups : {}
      }),
      
      actions: {
        async getTopups(request = {}) {
            this.loading =true 
            const response = await getData( '/apu/topups',request,true,config.mypaURL);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.topupss = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.topupss = response
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
          async getTopupsAll(request = {}) {
            this.loading =true 
            const response = await getData( '/topups/all',request);
            if(response["errors"]==undefined) {
              this.topupss = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateTopupsValue(id,newValue,colName) {
            const index = this.topupss.findIndex(topups => topups.id === id)
            
            if (index !== -1) {
               let _topups = this.topupss[index];
                this.topupss.splice(index, 1, {..._topups,[colName]:newValue});
            }
          }, 
          async getTopupsSuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/topups/suggestions',request);
            if(response["errors"]==undefined) {
              this.sugtopupss = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getTopupsDetails (Id = '') {
            this.loading = true
            const response = await getData('/topups/'+ Id);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.topups = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async addTopups (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/topups', request )
            if(response["errors"]==undefined || response["errors"]==null) {
                var newID= response.id
                this.topupss.unshift({...request,id:newID,_id:newID})
                this.loading = false
                this.curdLoading = false
                this.error = null
          } else{
            this.error = listError(response["errors"]) 
            this.loading = false
            this.curdLoading =false 
          }
          },
          async  updateTopups (request = {}) {
            const id = request.id
            delete request.id
            this.curdLoading =true 
            const response = await  patchData( '/topups/'+ id, request )
            if(response["errors"]==undefined || response["errors"]==null) {
             
                const index = this.topupss.findIndex(topups => topups.id === id)
                if (index !== -1) {
                    this.topupss.splice(index, 1, {...request,id:id,_id:id});
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
          async deleteTopups (id) {
            this.loading =true 
            const response = await  deleteData( '/topups/'+ id )
            if(response["errors"]==undefined || response["errors"]==null) {
              (this.topupss = this.topupss.filter(topups => topups.id !== id))
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
   
    