#!/bin/bash

# CloudCharts AI 重构启动器 (Linux/macOS)

set -e

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  CloudCharts AI 重构启动器                                  ║"
echo "║  一键启动 AI 驱动的现代化重构                                ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# 日志函数
log() {
    echo -e "${GREEN}✅ ${RESET}$1"
}

log_warn() {
    echo -e "${YELLOW}⚠️  ${RESET}$1"
}

log_error() {
    echo -e "${RED}❌ ${RESET}$1"
}

log_info() {
    echo -e "${CYAN}ℹ️  ${RESET}$1"
}

# 检查 Node.js
if ! command -v node &> /dev/null; then
    log_error "未找到 Node.js，请安装 Node.js 20+"
    exit 1
fi

NODE_VERSION=$(node --version | sed 's/v//')
NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)

if [ "$NODE_MAJOR" -lt 20 ]; then
    log_warn "Node.js 版本 $NODE_VERSION 较旧，建议升级到 20+"
    read -p "是否继续? [y/N] " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

log "Node.js 版本: $NODE_VERSION"

# 检查项目
if [ ! -f "package.json" ]; then
    log_error "未找到 package.json，请在 CloudCharts 项目根目录运行"
    exit 1
fi

if [ ! -d "AI-SKILLS" ]; then
    log_error "未找到 AI-SKILLS 目录"
    exit 1
fi

log "项目检查通过"
echo ""

# 选择模式
echo "请选择执行模式:"
echo "  1. 完整自动化 (推荐新手)"
echo "  2. 分阶段执行 (推荐谨慎)"
echo "  3. 单个任务 (专家模式)"
echo "  4. 查看文档"
echo ""
read -p "输入选项 (1-4): " choice

case $choice in
    1)
        echo ""
        echo -e "${CYAN}🚀 开始完整自动化重构...${RESET}"
        echo ""
        
        log_info "[1/5] 安装依赖..."
        npm install
        if [ $? -ne 0 ]; then exit 1; fi
        
        echo ""
        log_info "[2/5] 迁移构建工具..."
        node AI-SKILLS/scripts/migrate-build.js
        if [ $? -ne 0 ]; then exit 1; fi
        
        echo ""
        log_info "[3/5] 测试构建..."
        npm run build
        if [ $? -ne 0 ]; then exit 1; fi
        
        echo ""
        log_info "[4/5] 运行测试..."
        npm test
        if [ $? -ne 0 ]; then exit 1; fi
        
        echo ""
        log_info "[5/5] 生成报告..."
        node AI-SKILLS/scripts/generate-report.js
        if [ $? -ne 0 ]; then exit 1; fi
        
        echo ""
        log "完成！查看 reports/REFACTOR-REPORT.md"
        ;;
        
    2)
        echo ""
        echo -e "${CYAN}📋 分阶段执行模式${RESET}"
        echo ""
        echo "请选择阶段:"
        echo "  1. 构建工具迁移"
        echo "  2. React 18 升级"
        echo "  3. G2 5.x 升级"
        echo "  4. Hooks 迁移"
        echo "  5. AI 体系建立"
        echo "  6. 测试与验证"
        echo "  7. 文档生成"
        echo ""
        read -p "输入阶段 (1-7): " phase
        
        case $phase in
            1) node AI-SKILLS/scripts/migrate-build.js ;;
            2) npm install react@^18.2.0 react-dom@^18.2.0 ;;
            3) node AI-SKILLS/scripts/migrate-g2.js ;;
            4) echo "阶段4需要手动检查代码" ;;
            5) openskills install ./AI-SKILLS ;;
            6) npm test ;;
            7) npm run docs ;;
            *) echo "无效选项" ;;
        esac
        ;;
        
    3)
        echo ""
        echo -e "${CYAN}🔧 专家模式${RESET}"
        echo ""
        echo "请选择任务:"
        echo "  1. 添加新组件"
        echo "  2. 修复 Bug"
        echo "  3. 性能优化"
        echo "  4. 生成文档"
        echo "  5. 运行测试"
        echo ""
        read -p "输入选项 (1-5): " task
        
        case $task in
            1) openskills run cloud-charts-dev --task="add-component" ;;
            2) openskills run cloud-charts-dev --task="fix-bug" ;;
            3) openskills run cloud-charts-testing --task="performance-test" ;;
            4) openskills run cloud-charts-docs --task="generate-api-docs" ;;
            5) npm test ;;
            *) echo "无效选项" ;;
        esac
        ;;
        
    4)
        echo ""
        echo -e "${CYAN}📖 查看文档${RESET}"
        echo ""
        echo "可用文档:"
        echo "  1. AI-知识库文档.md"
        echo "  2. 重构计划书.md"
        echo "  3. 实施指南.md"
        echo "  4. 快速参考卡.md"
        echo "  5. AI-SKILLS/README.md"
        echo "  6. AI-SKILLS/使用指南.md"
        echo ""
        read -p "输入选项 (1-6): " doc
        
        case $doc in
            1) cat AI-知识库文档.md ;;
            2) cat 重构计划书.md ;;
            3) cat 实施指南.md ;;
            4) cat 快速参考卡.md ;;
            5) cat AI-SKILLS/README.md ;;
            6) cat AI-SKILLS/使用指南.md ;;
            *) echo "无效选项" ;;
        esac
        ;;
        
    *)
        echo "无效选项"
        ;;
esac

echo ""
echo -e "${GREEN}🎉 完成！${RESET}"
echo ""

