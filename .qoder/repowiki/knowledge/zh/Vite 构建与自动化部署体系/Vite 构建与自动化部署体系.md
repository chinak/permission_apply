---
kind: build_system
name: Vite 构建与自动化部署体系
category: build_system
scope:
    - '**'
source_files:
    - package.json
    - vite.config.ts
    - pnpm-workspace.yaml
    - deploy.ps1
    - deploy/deploy.sh
    - deploy/nginx.conf
---

## 1. 核心构建系统
项目采用 **Vite** 作为前端构建工具，配合 **pnpm workspace** 进行多包管理。虽然配置了 `pnpm-workspace.yaml`，但当前根目录与子模块（如 `permission_apply`）的依赖高度一致，主要通过统一的 `vite.config.ts` 处理 React 编译、Tailwind CSS 集成及自定义资源解析。

- **构建命令**：通过 `npm run build` 触发 Vite 生产环境打包，输出至 `dist/` 目录。
- **开发环境**：使用 `npm run dev` 启动本地开发服务器，支持热更新（HMR）。
- **插件生态**：集成了 `@vitejs/plugin-react` 和 `@tailwindcss/vite`，并包含自定义的 `figmaAssetResolver` 插件以处理设计稿导入的资源。

## 2. 部署流程与自动化
项目提供了跨平台的自动化部署方案，支持从构建到远程服务器同步的全流程操作。

- **Windows 环境**：通过根目录的 `deploy.ps1` 脚本实现一键部署。该脚本执行顺序为：本地构建 -> 校验产物 -> 通过 `scp` 上传至远程服务器 -> 通过 `ssh` 触发 Nginx 重载。
- **Linux/Unix 环境**：提供 `deploy/deploy.sh` 脚本，侧重于服务器端的版本备份、文件替换、权限设置（适配 `nginx` 或 `www-data` 用户）以及 Nginx 配置文件的动态生成与语法测试。
- **Nginx 配置**：在 `deploy/nginx.conf` 中定义了标准的 SPA 路由回退策略、Gzip 压缩优化、静态资源长期缓存策略以及基础的安全响应头（如 `X-Frame-Options`）。

## 3. 架构约定与规范
- **产物管理**：构建产物统一存放在根目录的 `dist/` 文件夹，部署脚本直接针对该目录进行操作。
- **环境隔离**：通过 `pnpm` 的 `overrides` 字段强制锁定 `vite` 版本为 `6.3.5`，确保多模块间构建环境的一致性。
- **路径别名**：在 `vite.config.ts` 中配置了 `@` 指向 `./src`，简化模块导入路径。

## 4. 开发者注意事项
- **部署前准备**：在执行 `deploy.ps1` 前，需确认脚本内的 `$SERVER_IP` 和 `$DEPLOY_PATH` 已根据目标服务器环境完成配置。
- **服务器端权限**：运行 `deploy.sh` 需要 root 或 sudo 权限，以确保能正确修改 `/var/www` 目录权限并重载 Nginx 服务。
- **SPA 路由支持**：后端 Nginx 必须配置 `try_files $uri $uri/ /index.html;`，否则刷新非首页路由时将出现 404 错误。