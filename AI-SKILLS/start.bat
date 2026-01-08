@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  CloudCharts AI 重构启动器                                  ║
echo ║  一键启动 AI 驱动的现代化重构                                ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: 检查 Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 Node.js
    echo    请安装 Node.js 20+ : https://nodejs.org/
    pause
    exit /b 1
)

:: 检查 Node 版本
for /f "tokens=2 delims=v" %%v in ('node --version') do set NODE_VERSION=%%v
for /f "tokens=1 delims=." %%v in ("%NODE_VERSION%") do set NODE_MAJOR=%%v

if %NODE_MAJOR% lss 20 (
    echo ⚠️  警告: Node.js 版本 %NODE_VERSION% 较旧
    echo    建议升级到 20+ 以获得最佳体验
    echo.
    choice /c YN /M "是否继续"
    if errorlevel 2 exit /b 1
)

echo ✅ Node.js 版本: %NODE_VERSION%
echo.

:: 检查项目
if not exist "package.json" (
    echo ❌ 错误: 未找到 package.json
    echo    请在 CloudCharts 项目根目录运行此脚本
    pause
    exit /b 1
)

:: 检查 AI-SKILLS 目录
if not exist "AI-SKILLS" (
    echo ❌ 错误: 未找到 AI-SKILLS 目录
    echo    请确保 AI-SKILLS 文件夹存在于项目根目录
    pause
    exit /b 1
)

echo ✅ 项目检查通过
echo.

:: 询问执行模式
echo 请选择执行模式:
echo   1. 完整自动化 (推荐新手)
echo   2. 分阶段执行 (推荐谨慎)
echo   3. 单个任务 (专家模式)
echo   4. 查看文档
echo.
set /p choice="输入选项 (1-4): "

if "%choice%"=="1" (
    echo.
    echo 🚀 开始完整自动化重构...
    echo.
    
    echo [1/5] 安装依赖...
    call npm install
    if errorlevel 1 goto :error
    
    echo.
    echo [2/5] 迁移构建工具...
    node AI-SKILLS\scripts\migrate-build.js
    if errorlevel 1 goto :error
    
    echo.
    echo [3/5] 测试构建...
    call npm run build
    if errorlevel 1 goto :error
    
    echo.
    echo [4/5] 运行测试...
    call npm test
    if errorlevel 1 goto :error
    
    echo.
    echo [5/5] 生成报告...
    node AI-SKILLS\scripts\generate-report.js
    if errorlevel 1 goto :error
    
    echo.
    echo ✅ 完成！查看 reports/REFACTOR-REPORT.md
    
) else if "%choice%"=="2" (
    echo.
    echo 📋 分阶段执行模式
    echo.
    echo 请选择阶段:
    echo   1. 构建工具迁移
    echo   2. React 18 升级
    echo   3. G2 5.x 升级
    echo   4. Hooks 迁移
    echo   5. AI 体系建立
    echo   6. 测试与验证
    echo   7. 文档生成
    echo.
    set /p phase="输入阶段 (1-7): "
    
    if "%phase%"=="1" (
        node AI-SKILLS\scripts\migrate-build.js
    ) else if "%phase%"=="2" (
        call npm install react@^18.2.0 react-dom@^18.2.0
    ) else if "%phase%"=="3" (
        node AI-SKILLS\scripts\migrate-g2.js
    ) else if "%phase%"=="4" (
        echo 阶段4需要手动检查代码
    ) else if "%phase%"=="5" (
        openskills install ./AI-SKILLS
    ) else if "%phase%"=="6" (
        call npm test
    ) else if "%phase%"=="7" (
        call npm run docs
    ) else (
        echo 无效选项
    )

) else if "%choice%"=="3" (
    echo.
    echo 🔧 专家模式
    echo.
    echo 请选择任务:
    echo   1. 添加新组件
    echo   2. 修复 Bug
    echo   3. 性能优化
    echo   4. 生成文档
    echo   5. 运行测试
    echo.
    set /p task="输入选项 (1-5): "
    
    if "%task%"=="1" (
        openskills run cloud-charts-dev --task="add-component"
    ) else if "%task%"=="2" (
        openskills run cloud-charts-dev --task="fix-bug"
    ) else if "%task%"=="3" (
        openskills run cloud-charts-testing --task="performance-test"
    ) else if "%task%"=="4" (
        openskills run cloud-charts-docs --task="generate-api-docs"
    ) else if "%task%"=="5" (
        call npm test
    ) else (
        echo 无效选项
    )

) else if "%choice%"=="4" (
    echo.
    echo 📖 查看文档
    echo.
    echo 可用文档:
    echo   1. AI-知识库文档.md
    echo   2. 重构计划书.md
    echo   3. 实施指南.md
    echo   4. 快速参考卡.md
    echo   5. AI-SKILLS/README.md
    echo   6. AI-SKILLS/使用指南.md
    echo.
    set /p doc="输入选项 (1-6): "
    
    if "%doc%"=="1" start AI-知识库文档.md
    if "%doc%"=="2" start 重构计划书.md
    if "%doc%"=="3" start 实施指南.md
    if "%doc%"=="4" start 快速参考卡.md
    if "%doc%"=="5" start AI-SKILLS\README.md
    if "%doc%"=="6" start AI-SKILLS\使用指南.md

) else (
    echo 无效选项
)

echo.
echo 按任意键退出...
pause >nul
exit /b 0

:error
echo.
echo ❌ 执行失败，请检查错误信息
echo.
pause
exit /b 1

