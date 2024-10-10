
    
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
            }
           
    ]
    export default customRoutes;
            