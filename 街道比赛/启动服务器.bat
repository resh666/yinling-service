@echo off
chcp 65001 >nul
title 社区银龄生活管家服务项目
color 0A
echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║       社区银龄生活管家服务项目                        ║
echo  ║       正在启动服务器...                               ║
echo  ╚══════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo [信息] 获取本地IP地址...
python get_ip.py
echo.

for /f "tokens=2 delims=: " %%i in ('ipconfig ^| findstr /i "IPv4" ^| findstr /v "127.0.0.1"') do (
    set "LAN_IP=%%i"
    goto :found_ip
)

:found_ip
echo [信息] 正在启动HTTP服务器...
echo [信息] 端口: 3000
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   请在浏览器访问以下地址：
echo.
echo   本地访问: http://localhost:3000
echo   局域网访问: http://%LAN_IP%:3000
echo.
echo   手机扫描二维码即可访问！
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo [提示] 按 Ctrl+C 停止服务器
echo.

python -m http.server 3000 --bind 0.0.0.0

pause
