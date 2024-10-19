import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [vue(
            {
                template: {
                  compilerOptions: {
                    isCustomElement: (tag) => ['md-linedivider'].includes(tag),
                  }
                }
              }
        )],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        optimizeDeps: {
          include: ['@fawmi/vue-google-maps','fast-deep-equal'],
        },
    };
});
