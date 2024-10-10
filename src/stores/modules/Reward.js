import config from '@/config'
import { listError } from '@/lib/functions'
import { deleteData, getData, patchData, postData } from '@/lib/httpRequest'
import { defineStore } from 'pinia'
  export const useRewardStore = defineStore('Reward', {
    state:() => ({
      rewards: [],
      sugrewards: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      reward : {}
      }),
      
      actions: {
        async getReward(request = {}) {
            this.loading =true 
            const response = await getData( '/reward',request,true,config.refServerURI);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.rewards = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.rewards = response
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
          async getRewardAll(request = {}) {
            this.loading =true 
            const response = await getData( '/reward/all',request,true,config.refServerURI);
            if(response["errors"]==undefined) {
              this.rewards = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateRewardValue(id,newValue,colName) {
            const index = this.rewards.findIndex(reward => reward.id === id)
            
            if (index !== -1) {
               let _reward = this.rewards[index];
                this.rewards.splice(index, 1, {..._reward,[colName]:newValue});
            }
          }, 
          async getRewardSuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/reward/suggestions',request,true,config.refServerURI);
            if(response["errors"]==undefined) {
              this.sugrewards = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getRewardDetails (Id = '') {
            this.loading = true
            const response = await getData('/reward/'+ Id,{},true,config.refServerURI);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.reward = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async addReward (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/reward', request ,true,config.refServerURI)
            if(response["errors"]==undefined || response["errors"]==null) {
                var newID= response.id
                this.rewards.unshift({...request,id:newID,_id:newID})
                this.loading = false
                this.curdLoading = false
                this.error = null
          } else{
            this.error = listError(response["errors"]) 
            this.loading = false
            this.curdLoading =false 
          }
          },
          async  updateReward (request = {}) {
            const id = request.id
            delete request.id
            this.curdLoading =true 
            const response = await  patchData( '/reward/'+ id, request,true,config.refServerURI )
            if(response["errors"]==undefined || response["errors"]==null) {
             
                const index = this.rewards.findIndex(reward => reward.id === id)
                if (index !== -1) {
                    this.rewards.splice(index, 1, {...request,id:id,_id:id});
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
          async deleteReward (id) {
            this.loading =true 
            const response = await  deleteData( '/reward/'+ id,true,config.refServerURI )
            if(response["errors"]==undefined || response["errors"]==null) {
              (this.rewards = this.rewards.filter(reward => reward.id !== id))
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
   
    