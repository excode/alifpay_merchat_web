
    
    const customRoutes=[
        
        
            {
                path: '/secure/users',
                name: 'users',
                component: () => import('@/views/secure/users/index.vue')
            },
            {
                path: '/secure/users/:id',
                name: 'users.details',
                component: () => import('@/views/secure/users/details.vue')
            }
            ,

            {
                path: '/secure/categories',
                name: 'categories',
                component: () => import('@/views/secure/categories/index.vue')
            },
            {
                path: '/secure/categories/:id',
                name: 'categories.details',
                component: () => import('@/views/secure/categories/details.vue')
            }
            ,

            {
                path: '/secure/currencies',
                name: 'currencies',
                component: () => import('@/views/secure/currencies/index.vue')
            },
            {
                path: '/secure/currencies/:id',
                name: 'currencies.details',
                component: () => import('@/views/secure/currencies/details.vue')
            }
            ,

            {
                path: '/secure/distributor',
                name: 'distributor',
                component: () => import('@/views/secure/distributor/index.vue')
            },
            {
                path: '/secure/distributor/:id',
                name: 'distributor.details',
                component: () => import('@/views/secure/distributor/details.vue')
            }
            ,

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
            ,

            {
                path: '/secure/product',
                name: 'product',
                component: () => import('@/views/secure/product/index.vue')
            },
            {
                path: '/secure/product/:id',
                name: 'product.details',
                component: () => import('@/views/secure/product/details.vue')
            }
            ,

            {
                path: '/secure/product/dataview',
                name: 'product.dataview',
                component: () => import('@/views/secure/product/dataview.vue')
            },

            {
                path: '/secure/productblog',
                name: 'productblog',
                component: () => import('@/views/secure/productblog/index.vue')
            },
            {
                path: '/secure/productblog/:id',
                name: 'productblog.details',
                component: () => import('@/views/secure/productblog/details.vue')
            }
            ,

            {
                path: '/secure/productblog/dataview',
                name: 'productblog.dataview',
                component: () => import('@/views/secure/productblog/dataview.vue')
            },

            {
                path: '/secure/productnew',
                name: 'productnew',
                component: () => import('@/views/secure/productnew/index.vue')
            },
            {
                path: '/secure/productnew/:id',
                name: 'productnew.details',
                component: () => import('@/views/secure/productnew/details.vue')
            }
            ,

            {
                path: '/secure/productnew/dataview',
                name: 'productnew.dataview',
                component: () => import('@/views/secure/productnew/dataview.vue')
            },

            {
                path: '/secure/promotion',
                name: 'promotion',
                component: () => import('@/views/secure/promotion/index.vue')
            },
            {
                path: '/secure/promotion/:id',
                name: 'promotion.details',
                component: () => import('@/views/secure/promotion/details.vue')
            }
            ,

            {
                path: '/secure/promotion/dataview',
                name: 'promotion.dataview',
                component: () => import('@/views/secure/promotion/dataview.vue')
            },

            {
                path: '/secure/redeemoption',
                name: 'redeemoption',
                component: () => import('@/views/secure/redeemoption/index.vue')
            },
            {
                path: '/secure/redeemoption/:id',
                name: 'redeemoption.details',
                component: () => import('@/views/secure/redeemoption/details.vue')
            }
            ,

            {
                path: '/secure/redeemoption/dataview',
                name: 'redeemoption.dataview',
                component: () => import('@/views/secure/redeemoption/dataview.vue')
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
            }
            ,

            {
                path: '/secure/sell',
                name: 'sell',
                component: () => import('@/views/secure/sell/index.vue')
            },
            {
                path: '/secure/sell/:id',
                name: 'sell.details',
                component: () => import('@/views/secure/sell/details.vue')
            }
            ,

            {
                path: '/secure/transaction',
                name: 'transaction',
                component: () => import('@/views/secure/transaction/index.vue')
            },
            {
                path: '/secure/transaction/:id',
                name: 'transaction.details',
                component: () => import('@/views/secure/transaction/details.vue')
            }
            
    ]
    export default customRoutes;
            