import { listError } from '@/lib/functions'
  import {getData,postData,deleteData,patchData} from '@/lib/httpRequest'
  import { defineStore } from 'pinia'
  export const useUsersStore = defineStore('Users', {
    state:() => ({
      userss: [],
      suguserss: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      users : {}
      }),
      
      actions: {
        async getUsers(request = {}) {
            this.loading =true 
            const response = await getData( '/users',request);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.userss = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.userss = response
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
          async getUsersAll(request = {}) {
            this.loading =true 
            const response = await getData( '/users/all',request);
            if(response["errors"]==undefined) {
              this.userss = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateUsersValue(id,newValue,colName) {
            const index = this.userss.findIndex(users => users.id === id)
            
            if (index !== -1) {
               let _users = this.userss[index];
                this.userss.splice(index, 1, {..._users,[colName]:newValue});
            }
          }, 
          async getUsersSuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/users/suggestions',request);
            if(response["errors"]==undefined) {
              this.suguserss = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getUsersDetails (Id = '') {
            this.loading = true
            const response = await getData('/users/'+ Id);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.users = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async addUsers (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/users', request )
            if(response["errors"]==undefined || response["errors"]==null) {
                var newID= response.id
                this.userss.unshift({...request,id:newID,_id:newID})
                this.loading = false
                this.curdLoading = false
                this.error = null
          } else{
            this.error = listError(response["errors"]) 
            this.loading = false
            this.curdLoading =false 
          }
          },
          async  updateUsers (request = {}) {
            const id = request.id
            delete request.id
            this.curdLoading =true 
            const response = await  patchData( '/users/'+ id, request )
            if(response["errors"]==undefined || response["errors"]==null) {
             
                const index = this.userss.findIndex(users => users.id === id)
                if (index !== -1) {
                    this.userss.splice(index, 1, {...request,id:id,_id:id});
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
          async deleteUsers (id) {
            this.loading =true 
            const response = await  deleteData( '/users/'+ id )
            if(response["errors"]==undefined || response["errors"]==null) {
              (this.userss = this.userss.filter(users => users.id !== id))
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
   
    