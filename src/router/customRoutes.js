
    
    const customRoutes=[
        
    
            {
                path: '/secure/bankaccount',
                name: 'bankaccount',
                component: () => import('@/views/secure/bankaccount/index.vue')
            },
            {
                path: '/secure/bankaccount/:id',
                name: 'bankaccount.details',
                component: () => import('@/views/secure/bankaccount/details.vue')
            }
            ,

            {
                path: '/secure/bankdocument',
                name: 'bankdocument',
                component: () => import('@/views/secure/bankdocument/index.vue')
            },
            {
                path: '/secure/bankdocument/:id',
                name: 'bankdocument.details',
                component: () => import('@/views/secure/bankdocument/details.vue')
            }
            ,

            {
                path: '/secure/fundtransfer',
                name: 'fundtransfer',
                component: () => import('@/views/secure/fundtransfer/index.vue')
            },
            {
                path: '/secure/fundtransfer/:id',
                name: 'fundtransfer.details',
                component: () => import('@/views/secure/fundtransfer/details.vue')
            }
            ,

            
            {
                path: '/secure/referral',
                name: 'user.referral',
                component: () => import('@/views/secure/referral/index.vue')
            }
            ,

            {
                path: '/secure/binarary',
                name: 'user.binarary',
                component: () => import('@/views/secure/binarary/index.vue')
            },
            {
                path: '/secure/redeem',
                name: 'redeem',
                component: () => import('@/views/secure/redeem/index.vue')
            },
            {
                path: '/secure/redeem/:id',
                name: 'redeem.details',
                component: () => import('@/views/secure/redeem/details.vue')
            }
            ,

            {
                path: '/secure/reward',
                name: 'reward',
                component: () => import('@/views/secure/reward/index.vue')
            },
            {
                path: '/secure/reward/:id',
                name: 'reward.details',
                component: () => import('@/views/secure/reward/details.vue')
            },
            {
                path: '/secure/hierarchy',
                name: 'hierarchy',
                component: () => import('@/views/secure/hierarchy/index.vue')
            },
            {
                path: '/secure/hierarchy/:id',
                name: 'hierarchy.details',
                component: () => import('@/views/secure/hierarchy/details.vue')
            },

            //NEXT
            
           
            {
                path: '/secure/merchantDetails',
                name: 'merchantDetails',
                component: () => import('@/views/secure/merchantDetails/index.vue')
            },
            {
                path: '/secure/merchantDetails/:id',
                name: 'merchantDetails.details',
                component: () => import('@/views/secure/merchantDetails/details.vue')
            }
            ,

            {
                path: '/secure/ownerDetails',
                name: 'ownerDetails',
                component: () => import('@/views/secure/ownerDetails/index.vue')
            },
            {
                path: '/secure/ownerDetails/:id',
                name: 'ownerDetails.details',
                component: () => import('@/views/secure/ownerDetails/details.vue')
            }
            ,

            {
                path: '/secure/ownerDetails/dataview',
                name: 'ownerDetails.dataview',
                component: () => import('@/views/secure/ownerDetails/dataview.vue')
            },

            {
                path: '/secure/transactionDetails',
                name: 'transactionDetails',
                component: () => import('@/views/secure/transactionDetails/index.vue')
            },
            {
                path: '/secure/transactionDetails/:id',
                name: 'transactionDetails.details',
                component: () => import('@/views/secure/transactionDetails/details.vue')
            }
           ,
           

            {
                path: '/secure/merchantDocuments',
                name: 'merchantDocuments',
                component: () => import('@/views/secure/merchantDocuments/index.vue')
            },
            {
                path: '/secure/merchantDocuments/:id',
                name: 'merchantDocuments.details',
                component: () => import('@/views/secure/merchantDocuments/details.vue')
            }
            ,

            {
                path: '/secure/merchantPhotos',
                name: 'merchantPhotos',
                component: () => import('@/views/secure/merchantPhotos/index.vue')
            },
            {
                path: '/secure/merchantPhotos/:id',
                name: 'merchantPhotos.details',
                component: () => import('@/views/secure/merchantPhotos/details.vue')
            }
            ,

            {
                path: '/secure/merchantPhotos/dataview',
                name: 'merchantPhotos.dataview',
                component: () => import('@/views/secure/merchantPhotos/dataview.vue')
            },

            {
                path: '/secure/products',
                name: 'products',
                component: () => import('@/views/secure/products/index.vue')
            },
            {
                path: '/secure/products/:id',
                name: 'products.details',
                component: () => import('@/views/secure/products/details.vue')
            }
            ,

            {
                path: '/secure/products/dataview',
                name: 'products.dataview',
                component: () => import('@/views/secure/products/dataview.vue')
            },

            {
                path: '/secure/stores',
                name: 'stores',
                component: () => import('@/views/secure/stores/index.vue')
            },
            {
                path: '/secure/stores/:id',
                name: 'stores.details',
                component: () => import('@/views/secure/stores/details.vue')
            }
            ,

            //END NEXT

           
    ]
    export default customRoutes;
            