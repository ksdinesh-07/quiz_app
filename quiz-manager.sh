#!/bin/bash
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

case "$1" in
    start)
        echo -e "${GREEN}🚀 Starting Quiz App...${NC}"
        docker stop quiz-app 2>/dev/null
        docker rm quiz-app 2>/dev/null
        docker build -t quiz-app-nginx -f Dockerfile.nginx . --quiet
        docker run -d -p 3001:80 --name quiz-app quiz-app-nginx
        echo -e "${GREEN}✅ Quiz App running at:${NC} ${BLUE}http://localhost:3001${NC}"
        ;;
    stop)
        echo -e "${GREEN}🛑 Stopping Quiz App...${NC}"
        docker stop quiz-app 2>/dev/null
        docker rm quiz-app 2>/dev/null
        echo "✅ Stopped"
        ;;
    status)
        if docker ps | grep -q quiz-app; then
            echo -e "${GREEN}✅ Quiz App is RUNNING${NC}"
            echo -e "🌐 URL: ${BLUE}http://localhost:3001${NC}"
            echo "Container: $(docker ps --format '{{.Names}} {{.Status}} {{.Ports}}' | grep quiz-app)"
        else
            echo -e "❌ Quiz App is STOPPED"
            echo "Run: ./quiz-manager.sh start"
        fi
        ;;
    logs)
        echo "Container logs:"
        docker logs quiz-app
        ;;
    open)
        echo -e "${GREEN}🌐 Opening Quiz App in browser...${NC}"
        xdg-open "http://localhost:3001" 2>/dev/null || \
        firefox "http://localhost:3001" 2>/dev/null || \
        echo "Please open: http://localhost:3001"
        ;;
    test)
        echo "Testing Quiz App..."
        curl -s -o /dev/null -w "HTML: %{http_code}\n" http://localhost:3001/
        curl -s -o /dev/null -w "CSS:  %{http_code}\n" http://localhost:3001/style.css
        curl -s -o /dev/null -w "JS:   %{http_code}\n" http://localhost:3001/script.js
        ;;
    *)
        echo -e "${BLUE}📋 Quiz App Manager${NC}"
        echo "====================="
        echo "Usage: ./quiz-manager.sh {start|stop|status|logs|open|test}"
        echo ""
        ./quiz-manager.sh status
        echo ""
        echo -e "${GREEN}🎯 Your Quiz App is ready!${NC}"
        ;;
esac
