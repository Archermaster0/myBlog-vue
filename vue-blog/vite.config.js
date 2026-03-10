import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ['vue', 'vuex', 'vue-router'],
      resolvers: [VantResolver(), ElementPlusResolver()],
    }),
    Components({
      //按需引入组件
      dirs: ['src/components'], // 按需加载的文件夹
      resolvers: [VantResolver(), ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        // 在这里修改静态资源路径
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        // 最小化拆分包
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
        //构建异步快
        // manualChunks: {
        //   'group-user': [
        //     './src/UserDetails',
        //     './src/UserDashboard',
        //     './src/UserProfileEdit',
        //   ],
        // },
      },
    },
    // 打包环境移除console.log，debugger
    // terserOptions: {
    //   compress: {
    //     drop_console: true,
    //     drop_debugger: true
    //   }
    // },
  },
  base: './', // 这里更改打包相对绝对路径
  minify: true, // 是否压缩代码
  sourceMap: true, // 是否生成sourceMap
})
