import config from '@/config'
import { listError } from '@/lib/functions'
import { getData } from '@/lib/httpRequest'
import { defineStore } from 'pinia'
  export const useNetworkStore = defineStore('Network', {
    state:() => ({
        referrals: [],
        levelNodes: [],
        levelNodes_n: [],
        binarary: {},
        error: null,
        totalpages:0,
        totalRecords:0,
        page:0,
        loading:false,
        curdLoading:false,
        referral : {}
      }),
      
      actions: {
        async getUsers(request = {}) {
            this.loading =true 
            const response = await getData( '/hierarchy/ref/u',request,true,config.refServerURI);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.referrals = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.referrals = response
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
          async getLevelNodes(request = {}) {
            this.loading =true 
            const response = await getData( '/hierarchy/all/level3/u?productId=66e665de966efc2edaa97cf0',request,true,config.refServerURI);
            if(response["errors"]==undefined) {
             
              if (typeof response === 'string') {
                try {
                  // Parse response string to JSON
                  this.levelNodes = [JSON.parse(response)];
                } catch (error) {
                  console.error("Failed to parse response JSON:", error);
                }
              } else {
                // If the response is already a JSON object
                this.levelNodes = [response];
              }
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          async getLevelNodes2(username,isRoot=true,request = {}) {
            this.loading =true 
            const response = await getData( `/hierarchy/single/level/${username}?productId=66e665de966efc2edaa97cf0`,request,true,config.refServerURI);
            let mResponse=[];
            if(response["errors"]==undefined) {
             
              if (typeof response === 'string') {
                try {
                  // Parse response string to JSON
                  mResponse = JSON.parse(response);
                } catch (error) {
                  console.error("Failed to parse response JSON:", error);
                }
              } else {
                mResponse=this.convertToPrimeVueTree(response);
                // If the response is already a JSON object
                if(isRoot){
                  this.levelNodes = mResponse;
                }else{
                  this.levelNodes_n = mResponse;
                }
              }
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          //hierarchy/placement/reg/u
          async placementRequest(request={}) {
            this.loading =true 
            let postData ={...request,productid:"66e665de966efc2edaa97cf0"}
            const response = await postData( '/hierarchy/placement/reg/u',postData,true,config.refServerURI);
            if(response["errors"]==undefined) {
             
              if (typeof response === 'string') {
                try {
                  // Parse response string to JSON
                  this.binarary = JSON.parse(response);
                } catch (error) {
                  console.error("Failed to parse response JSON:", error);
                }
              } else {
                // If the response is already a JSON object
                this.binarary = response;
              }
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          async getBinarayNodes(request="") {
            this.loading =true 
            let userName=""
            if(request!=""){
              userName=request
            }
            const response = await getData( '/hierarchy/all/org_chart2/u?productId=66e665de966efc2edaa97cf0&xI='+userName,{},true,config.refServerURI);
            if(response["errors"]==undefined) {
             
              if (typeof response === 'string') {
                try {
                  // Parse response string to JSON
                  this.binarary = JSON.parse(response);
                } catch (error) {
                  console.error("Failed to parse response JSON:", error);
                }
              } else {
                // If the response is already a JSON object
                this.binarary = response;
              }
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
           convertToPrimeVueTree(users) {
          const rootMap = {};
          const tree = [];

          for (const user of users) {
            const node = {
              key: user.id,
              label: user.username,
              leaf: false,
              data: { userType: user.userType }
            };
              tree.push(node);
 /*
            if (!rootMap[user.parentId]) {
              rootMap[user.parentId] = {
                key: user.parentId,
                label: user.parentId,
                children: []
              };
              tree.push(rootMap[user.parentId]);
            }
*/

           // rootMap[user.parentId].children.push(node);
          }

  return tree;
}
        
      },
   
  })
   
    