
    
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
                path: '/secure/merchantInfo',
                name: 'merchantInfo',
                component: () => import('@/views/secure/merchantInfo/index.vue')
            },
            {
                path: '/secure/merchantInfo/:id',
                name: 'merchantInfo.details',
                component: () => import('@/views/secure/merchantInfo/details.vue')
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
           
    ]
    export default customRoutes;
            