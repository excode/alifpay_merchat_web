import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import customRoutes from './customRoutes';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            redirect: to => {
                const userData = localStorage.getItem('users');
                const authInfo = userData ? JSON.parse(userData) : {};
                // If user is already logged in, redirect to /secure, otherwise to /auth/login
                return authInfo.token ? '/secure' : '/auth/login';
            },
            name: 'landing',
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/secure/Dashboard.vue')
                },
            ]
        },
        {
            path: '/secure',
            component: AppLayout,
            children: [
            {
                path: '/secure',
                name: 'dashboard',
                component: () => import('@/views/secure/Dashboard.vue')
            },
            ...customRoutes
            ]
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
       
        {
            path: '/auth/otp',
            name: 'otp',
            component: () => import('@/views/pages/auth/OTP.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        /** Sample  ROTUES Start FROM Here */
        /**  This routes were included in the  template which should be removed in  production version */
      
        
       
        
    ]
});
router.beforeEach(async (to, from, next) => {
  
    const securePages = ['secure'];
    const authRequired = to.path.includes(securePages);
    let userData =localStorage.getItem('users')
    let authInfo = userData?JSON.parse(userData):{};
    //console.log(authInfo);
    if (authRequired && authInfo.token==undefined && to.name !== 'login') {
        next({ name: 'login' })
  
    }else{
        next()
    }
});
export default router;
