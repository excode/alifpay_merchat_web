import config from '@/config'
import { listError } from '@/lib/functions'
import { deleteData, getData, patchData, postData } from '@/lib/httpRequest'
import { defineStore } from 'pinia'
  export const useProductsStore = defineStore('Products', {
    state:() => ({
      productss: [],
      categories:[],
      sugproductss: [],
      error: null,
      totalpages:0,
      totalRecords:0,
      page:0,
      loading:false,
      curdLoading:false,
      products : {}
      }),
      
      actions: {
        async getProducts(request = {}) {
            this.loading =true 
            const response = await getData( '/products',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              
              if(response.docs){
                this.productss = response.docs
                this.totalRecords = response.count
                this.totalpages = Math.ceil(response.count / response.perpage )
                this.page = response.page
              }else{
                this.productss = response
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
          async getProductsAll(request = {}) {
            this.loading =true 
            const response = await getData( '/products/all',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              this.productss = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          async getCategories(request = {}) {
            this.loading =true 
            const response = await getData( '/products/category',request,true,config.serverURIMer);
            if(response["errors"]==undefined) {
              this.categories = response
              this.loading = false
              this.error = null
            } else {
            
                this.error = listError(response["errors"]) 
                this.loading = false
            }
          },
          updateProductsValue(id,newValue,colName) {
            const index = this.productss.findIndex(products => products.id === id)
            
            if (index !== -1) {
               let _products = this.productss[index];
                this.productss.splice(index, 1, {..._products,[colName]:newValue});
            }
          }, 
          async getProductsSuggestions(request = {}) {
            this.loading =true 
            const response = await getData( '/products/suggestions',request);
            if(response["errors"]==undefined) {
              this.sugproductss = response
              this.loading = false
              this.curdLoading = false
              this.error = null
            } else {
            
              this.error = listError(response["errors"]) 
              this.loading = false
              this.curdLoading = false
            }
          },
          async getProductsDetails (Id = '') {
            this.loading = true
            const response = await getData('/products/'+ Id,{},true,config.serverURIMer);
            if(response["errors"]==undefined || response["errors"]==null) {
                this.products = response
                this.loading = false
                this.curdLoading = false
                this.error = null
            } else {
                this.error = listError(response["errors"]) 
                this.loading = false
                this.curdLoading = false
            }
          },
          async addProducts (request = {}) {
            this.curdLoading =true 
            const response = await  postData( '/products', request,true,config.serverURIMer )
            if(response["errors"]==undefined || response["errors"]==null) {
                var newID= response.id
                this.productss.unshift({...request,id:newID,_id:newID})
                if (!this.categories.includes(request.category)) {
                  this.categories.push(request.category);
                }
                
                this.loading = false
                this.curdLoading = false
                this.error = null
          } else{
            this.error = listError(response["errors"]) 
            this.loading = false
            this.curdLoading =false 
          }
          },
          async  updateProducts (request = {}) {
            const id = request.id
            delete request.id
            this.curdLoading =true 
            const response = await  patchData( '/products/'+ id, request,true,config.serverURIMer )
            if(response["errors"]==undefined || response["errors"]==null) {
             
                const index = this.productss.findIndex(products => products.id === id)
                if (index !== -1) {
                    this.productss.splice(index, 1, {...request,id:id,_id:id});
                }
                if (!this.categories.includes(request.category)) {
                  this.categories.push(request.category);
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
          async deleteProducts (id) {
            this.loading =true 
            const response = await  deleteData( '/products/'+ id ,true,config.serverURIMer)
            if(response["errors"]==undefined || response["errors"]==null) {
              (this.productss = this.productss.filter(products => products.id !== id))
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
   
    