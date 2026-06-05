#!/usr/bin/env bash
###############################################################################
# 启星智谷 · 药物出海评估平台 —— 服务器端「域名 + HTTPS」一键脚本
#
# 适用：腾讯云 Lighthouse「WordPress 镜像」(Nginx，网站根目录为
#       /usr/local/lighthouse/softwares/wordpress)
#
# 作用：为指定域名用 Let's Encrypt 免费签发 HTTPS 证书，并让 Nginx 同时通过
#       https://你的域名/  和  https://你的域名/drug-demo/  对外服务，
#       80 端口自动跳转到 443。
#
# 用法（在服务器上以 root 执行）：
#       bash server-setup-https.sh  你的域名  [你的邮箱]
#   例：bash server-setup-https.sh  drug.qixingzhigu.com  admin@qixingzhigu.com
#
# 前提：① 域名的 DNS A 记录已解析到本服务器公网 IP 62.234.75.97
#       ② 安全组/防火墙已放行 80 与 443 端口
###############################################################################
set -euo pipefail

DOMAIN="${1:-}"
EMAIL="${2:-}"
WEBROOT="/usr/local/lighthouse/softwares/wordpress"

red()   { printf "\033[31m%s\033[0m\n" "$*"; }
green() { printf "\033[32m%s\033[0m\n" "$*"; }
yellow(){ printf "\033[33m%s\033[0m\n" "$*"; }

if [[ -z "$DOMAIN" ]]; then
  red "用法: bash server-setup-https.sh 你的域名 [邮箱]"
  exit 1
fi

green "==> 1/6 检查域名解析是否指向本机 ..."
SERVER_IP="$(curl -s https://api.ipify.org || echo '')"
DOMAIN_IP="$(getent hosts "$DOMAIN" | awk '{print $1}' | head -n1 || echo '')"
echo "    本机公网 IP : ${SERVER_IP:-未知}"
echo "    域名解析 IP : ${DOMAIN_IP:-未解析}"
if [[ -n "$SERVER_IP" && -n "$DOMAIN_IP" && "$SERVER_IP" != "$DOMAIN_IP" ]]; then
  yellow "    [警告] 域名解析 IP 与本机不一致，证书签发可能失败。"
  yellow "          请先在域名服务商把 A 记录指向 $SERVER_IP，等待解析生效后再运行。"
fi

green "==> 2/6 安装 certbot ..."
if ! command -v certbot >/dev/null 2>&1; then
  if   command -v dnf    >/dev/null 2>&1; then dnf install -y certbot || true
  elif command -v yum    >/dev/null 2>&1; then yum install -y epel-release >/dev/null 2>&1 || true; yum install -y certbot || true
  elif command -v apt-get>/dev/null 2>&1; then apt-get update -y && apt-get install -y certbot || true
  fi
fi
if ! command -v certbot >/dev/null 2>&1; then
  if command -v snap >/dev/null 2>&1; then
    snap install --classic certbot || true
    ln -sf /snap/bin/certbot /usr/bin/certbot || true
  fi
fi
command -v certbot >/dev/null 2>&1 || { red "certbot 安装失败，请手动安装后重试。"; exit 1; }
green "    certbot 已就绪：$(certbot --version 2>&1 | head -n1)"

green "==> 3/6 通过 webroot 方式申请证书（不改动现有 Nginx 配置即可验证）..."
mkdir -p "$WEBROOT/.well-known/acme-challenge"
chmod -R a+rX "$WEBROOT/.well-known"
EMAIL_ARG="--register-unsafely-without-email"
[[ -n "$EMAIL" ]] && EMAIL_ARG="-m $EMAIL"
certbot certonly --webroot -w "$WEBROOT" -d "$DOMAIN" \
  --non-interactive --agree-tos $EMAIL_ARG --keep-until-expiring
CERT_DIR="/etc/letsencrypt/live/$DOMAIN"
[[ -f "$CERT_DIR/fullchain.pem" ]] || { red "未找到证书文件，签发失败。"; exit 1; }
green "    证书已签发：$CERT_DIR/fullchain.pem"

green "==> 4/6 定位 Nginx 配置目录 ..."
NGINX_BIN="$(command -v nginx || echo /usr/local/lighthouse/softwares/nginx/sbin/nginx)"
[[ -x "$NGINX_BIN" ]] || NGINX_BIN="$(ls /usr/local/lighthouse/softwares/nginx/sbin/nginx 2>/dev/null || true)"
[[ -x "$NGINX_BIN" ]] || { red "未找到 nginx 可执行文件，请手动配置 HTTPS。"; exit 1; }
MAIN_CONF="$("$NGINX_BIN" -t 2>&1 | grep -oE '/[^ ]*nginx\.conf' | head -n1 || true)"
[[ -n "$MAIN_CONF" ]] || MAIN_CONF="/usr/local/lighthouse/softwares/nginx/conf/nginx.conf"
CONF_DIR="$(dirname "$MAIN_CONF")"
echo "    nginx 可执行 : $NGINX_BIN"
echo "    主配置文件   : $MAIN_CONF"

# 找到一个被 http{} include 的目录用来放置我们的 server 块
INCLUDE_DIR=""
for d in "$CONF_DIR/conf.d" "$CONF_DIR/vhost" "$CONF_DIR/sites-enabled"; do
  if grep -qE "include\s+.*$(basename "$d")/" "$MAIN_CONF" 2>/dev/null; then INCLUDE_DIR="$d"; break; fi
done
if [[ -z "$INCLUDE_DIR" ]]; then
  INCLUDE_DIR="$CONF_DIR/conf.d"
  mkdir -p "$INCLUDE_DIR"
  if ! grep -q "include $INCLUDE_DIR/\*.conf;" "$MAIN_CONF"; then
    yellow "    主配置未 include conf.d，自动在 http{} 内追加 include 指令。"
    sed -i "0,/http\s*{/s//http {\n    include $INCLUDE_DIR\/*.conf;/" "$MAIN_CONF"
  fi
fi
green "    HTTPS server 块将写入：$INCLUDE_DIR/drug-demo-ssl.conf"

green "==> 5/6 探测 php-fpm 套接字（决定是否在新域名上同时跑 WordPress）..."
PHP_SOCK="$(ls /usr/local/lighthouse/softwares/php*/var/run/php-fpm.sock \
             /run/php/php*-fpm.sock /var/run/php-fpm/*.sock 2>/dev/null | head -n1 || true)"
if [[ -z "$PHP_SOCK" ]]; then
  # 从正在运行的进程里再尝试一次
  PHP_SOCK="$(ss -lxp 2>/dev/null | grep -oE '/[^ ]*php[^ ]*\.sock' | head -n1 || true)"
fi
if [[ -n "$PHP_SOCK" ]]; then
  green "    探测到 php-fpm：$PHP_SOCK（新域名将同时提供 WordPress + DEMO）"
  WP_BLOCK=$(cat <<EOF

    # 其余路径交给原 WordPress（PHP）处理
    location / {
        try_files \$uri \$uri/ /index.php?\$args;
    }
    location ~ \\.php\$ {
        include fastcgi_params;
        fastcgi_pass unix:$PHP_SOCK;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
    }
EOF
)
else
  yellow "    未探测到 php-fpm；为安全起见，新域名仅静态服务（不猜测 PHP 路径，避免拖垮 WordPress）。"
  yellow "    https://$DOMAIN/drug-demo/ 一定可用；如需在该域名跑 WordPress，请手动补 php location。"
  WP_BLOCK=$(cat <<EOF

    location / {
        try_files \$uri \$uri/ /drug-demo/index.html;
    }
EOF
)
fi

green "    写入 HTTPS 站点配置 ..."
cat > "$INCLUDE_DIR/drug-demo-ssl.conf" <<EOF
# 由 server-setup-https.sh 生成 —— 启星智谷 药物出海评估平台 HTTPS
server {
    listen 80;
    server_name $DOMAIN;
    # ACME 续期验证走 webroot，其余一律跳转 HTTPS
    location /.well-known/acme-challenge/ { root $WEBROOT; }
    location / { return 301 https://\$host\$request_uri; }
}
server {
    listen 443 ssl;
    http2 on;
    server_name $DOMAIN;

    ssl_certificate     $CERT_DIR/fullchain.pem;
    ssl_certificate_key $CERT_DIR/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root $WEBROOT;
    index index.php index.html;

    # 子目录：药物出海评估 DEMO（静态 SPA）
    location /drug-demo/ {
        try_files \$uri \$uri/ /drug-demo/index.html;
    }
$WP_BLOCK
}
EOF

green "==> 6/6 校验并重载 Nginx ..."
if "$NGINX_BIN" -t; then
  "$NGINX_BIN" -s reload || systemctl reload nginx || service nginx reload || true
  green "==============================================================="
  green " 完成！现在可访问："
  green "   https://$DOMAIN/            (WordPress 主站)"
  green "   https://$DOMAIN/drug-demo/  (药物出海评估平台)"
  green " 证书会由 certbot 定时任务自动续期（90 天）。"
  green "==============================================================="
else
  red "Nginx 配置测试未通过，未重载。请检查上面的报错；"
  red "可删除 $INCLUDE_DIR/drug-demo-ssl.conf 后恢复原状。"
  exit 1
fi
