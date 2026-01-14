@echo off
chcp 65001 >nul
echo ==========================================
echo       正在启动高岛易断---略筮法...
echo ==========================================

if exist "node_modules" (
    echo [1/3] 检测到依赖已安装，跳过安装步骤...
) else (
    echo [1/3] 未检测到依赖，正在执行首次安装...
    call npm install
)

echo [2/3] 正在启动浏览器...
start http://localhost:3000

echo [3/3] 正在启动开发服务器...
echo 请勿关闭此窗口
echo.
npm run dev

pause
