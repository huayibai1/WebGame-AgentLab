# GameVerse AI

本地预览推荐直接双击：

```text
start-preview.bat
```

如果 Next 预览已经在运行，脚本会直接打开浏览器，不会重启服务器。

如果预览没有运行，脚本会启动 Next 开发服务器：

```text
http://127.0.0.1:3000/
```

这个模式会保留 `.next` 缓存，所以再次启动会更快，也能自动显示后续 React/Next 页面更新。

如果遇到 `Cannot find module './819.js'` 这类 Next chunk 缓存错误，再双击：

```text
repair-preview.bat
```

它会停止本项目的 Next dev server、清理 `.next`，然后干净重启预览。

手动命令：

```powershell
npm install
npm run dev -- -H 127.0.0.1 -p 3000
npm test
```

