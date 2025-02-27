# vite-plugin-zip
vite插件，自动根据vite.config.ts配置中的build.outDir路径进行压缩为zip，且压缩完成后自动git提交


## 安装与使用

*   Node.js 版本建议`v18.16.0`，要求`Node 18+` 版本以上

```bash
npm i vite-plugin-auto-zip-git -D
```

*   vite.config.ts配置
```
import vitePluginAutoZipGit from 'vite-plugin-auto-zip-git'

export default defineConfig({
  plugins: [
    vitePluginAutoZipGit()
  ],
  build:{
    outDir:'autoZip'
  },
})
```