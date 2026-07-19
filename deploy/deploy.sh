#!/bin/bash
# ============================================
# 国泰君安期货移仓业务管理系统 - 部署脚本
# ============================================
# 使用方法:
#   1. 将 dist 目录和此脚本上传到服务器
#   2. 修改下面的变量配置
#   3. 执行: bash deploy.sh
# ============================================

# ===== 配置区域（根据实际情况修改）=====
# 部署目录
DEPLOY_DIR="/var/www/management-platform"
# Nginx 配置文件目录（根据系统不同可能为 /etc/nginx/conf.d/ 或 /etc/nginx/sites-available/）
NGINX_CONF_DIR="/etc/nginx/conf.d"
# 网站域名或 IP
SERVER_NAME="your-domain.com"
# =========================================

echo "=========================================="
echo "  移仓业务管理系统 - 部署脚本"
echo "=========================================="
echo ""

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
  echo "❌ 请使用 root 用户或 sudo 执行此脚本"
  echo "   sudo bash deploy.sh"
  exit 1
fi

# 检查 dist 目录是否存在
if [ ! -d "./dist" ]; then
  echo "❌ 未找到 dist 目录，请确保在包含 dist 的目录下执行"
  exit 1
fi

echo "1. 创建部署目录..."
mkdir -p "$DEPLOY_DIR"
echo "   ✓ 部署目录: $DEPLOY_DIR"

echo ""
echo "2. 备份旧版本..."
if [ -d "$DEPLOY_DIR.bak" ]; then
  rm -rf "$DEPLOY_DIR.bak"
fi
if [ -d "$DEPLOY_DIR" ] && [ "$(ls -A $DEPLOY_DIR)" ]; then
  mv "$DEPLOY_DIR" "$DEPLOY_DIR.bak"
  echo "   ✓ 旧版本已备份到: $DEPLOY_DIR.bak"
else
  echo "   - 首次部署，无需备份"
fi

echo ""
echo "3. 复制新文件..."
cp -r ./dist/* "$DEPLOY_DIR/"
echo "   ✓ 文件已复制到: $DEPLOY_DIR"

echo ""
echo "4. 设置权限..."
chown -R nginx:nginx "$DEPLOY_DIR" 2>/dev/null || chown -R www-data:www-data "$DEPLOY_DIR" 2>/dev/null || true
chmod -R 755 "$DEPLOY_DIR"
echo "   ✓ 权限已设置"

echo ""
echo "5. 配置 Nginx..."
if [ -f "./nginx.conf" ]; then
  # 替换配置中的域名
  sed "s/your-domain.com/$SERVER_NAME/g" ./nginx.conf > "$NGINX_CONF_DIR/management-platform.conf"
  echo "   ✓ Nginx 配置已写入: $NGINX_CONF_DIR/management-platform.conf"
else
  echo "   ⚠ 未找到 nginx.conf，请手动配置 Nginx"
fi

echo ""
echo "6. 测试 Nginx 配置..."
if nginx -t; then
  echo "   ✓ Nginx 配置测试通过"
else
  echo "   ❌ Nginx 配置测试失败，请检查配置"
  echo "   尝试恢复备份..."
  if [ -d "$DEPLOY_DIR.bak" ]; then
    rm -rf "$DEPLOY_DIR"
    mv "$DEPLOY_DIR.bak" "$DEPLOY_DIR"
    echo "   ✓ 已恢复备份"
  fi
  exit 1
fi

echo ""
echo "7. 重载 Nginx..."
systemctl reload nginx 2>/dev/null || nginx -s reload 2>/dev/null
echo "   ✓ Nginx 已重载"

echo ""
echo "=========================================="
echo "  ✅ 部署完成！"
echo "=========================================="
echo ""
echo "访问地址: http://$SERVER_NAME"
echo ""
echo "如需 HTTPS，请配置 SSL 证书并取消 nginx.conf 中的 SSL 注释"
echo ""
echo "Nginx 配置文件: $NGINX_CONF_DIR/management-platform.conf"
echo "网站文件目录:   $DEPLOY_DIR"
echo ""
