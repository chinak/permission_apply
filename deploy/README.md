# 国泰君安期货移仓业务管理系统 - 部署指南

## 一、项目已构建完成

构建产物在 `dist/` 目录下，包含：
- `index.html` — 入口页面
- `assets/index-*.js` — JavaScript 主文件
- `assets/index-*.css` — 样式文件

## 二、部署步骤

### 方法一：使用部署脚本（推荐）

1. **上传文件到服务器**

   将以下文件/目录上传到服务器（如 `/root/deploy/`）：
   ```
   deploy/
   ├── dist/              # 构建产物
   ├── nginx.conf         # Nginx 配置模板
   └── deploy.sh          # 自动部署脚本
   ```

   上传命令示例（在本地 PowerShell 执行）：
   ```powershell
   # 使用 scp 上传（需安装 OpenSSH 或使用 WinSCP）
   scp -r d:\trae_projects\management_platform\deploy root@你的服务器IP:/root/deploy
   ```

   或使用 WinSCP / Xftp 等工具上传 `deploy` 文件夹。

2. **修改配置**

   登录服务器，编辑 `deploy.sh`，修改以下变量：
   ```bash
   SERVER_NAME="your-domain.com"     # 改为你的域名或公网 IP
   DEPLOY_DIR="/var/www/management-platform"  # 部署路径（可保持默认）
   ```

3. **执行部署**
   ```bash
   cd /root/deploy
   sudo bash deploy.sh
   ```

4. **访问验证**

   脚本执行完成后，在浏览器访问 `http://你的域名或IP` 即可。

---

### 方法二：手动部署

1. **上传 dist 目录到服务器**

   ```bash
   scp -r d:\trae_projects\management_platform\dist root@服务器IP:/var/www/management-platform
   ```

2. **创建 Nginx 配置文件**

   在服务器上创建 `/etc/nginx/conf.d/management-platform.conf`：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;  # 改为你的域名或 IP

       root /var/www/management-platform;
       index index.html;

       # gzip 压缩
       gzip on;
       gzip_types text/plain text/css application/json application/javascript;

       # 静态资源缓存
       location /assets/ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # SPA 路由支持
       location / {
           try_files $uri $uri/ /index.html;
       }

       # index.html 不缓存
       location = /index.html {
           add_header Cache-Control "no-cache, no-store, must-revalidate";
       }
   }
   ```

3. **测试并重载 Nginx**
   ```bash
   nginx -t
   systemctl reload nginx
   ```

4. **访问验证**

   浏览器打开 `http://你的域名或IP`

---

## 三、HTTPS 配置（可选）

如需 HTTPS，在 Nginx 配置中取消 SSL 相关注释，并配置证书：

1. **申请 SSL 证书**（阿里云/腾讯云可免费申请）

2. **上传证书到服务器**，例如 `/etc/nginx/ssl/`

3. **修改 nginx.conf**，取消以下注释：
   ```nginx
   listen 443 ssl;
   ssl_certificate     /etc/nginx/ssl/your-domain.com.pem;
   ssl_certificate_key /etc/nginx/ssl/your-domain.com.key;
   ```

4. **重载 Nginx**
   ```bash
   nginx -t && systemctl reload nginx
   ```

---

## 四、后续更新

代码修改后，重新构建并部署：

```bash
# 1. 本地构建
npm run build

# 2. 上传新的 dist 到服务器
scp -r dist/* root@服务器IP:/var/www/management-platform/

# 3. 无需重启 Nginx（index.html 设置了不缓存）
```

或重新执行 `deploy.sh` 脚本（会自动备份旧版本）。
