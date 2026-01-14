#!/bin/bash
case "$1" in
    start)
        echo "Starting Quiz App..."
        docker stop quiz-app 2>/dev/null
        docker rm quiz-app 2>/dev/null
        docker run -d -p 3001:80 --name quiz-app quiz-app-nginx
        echo "✅ Running at: http://localhost:3001"
        ;;
    stop)
        echo "Stopping Quiz App..."
        docker stop quiz-app 2>/dev/null
        docker rm quiz-app 2>/dev/null
        echo "✅ Stopped"
        ;;
    status)
        if docker ps | grep -q quiz-app; then
            echo "✅ Quiz App is RUNNING"
            echo "🌐 URL: http://localhost:3001"
            docker ps | grep quiz-app
        else
            echo "❌ Quiz App is STOPPED"
        fi
        ;;
    logs)
        docker logs quiz-app
        ;;
    restart)
        $0 stop
        $0 start
        ;;
    *)
        echo "Usage: $0 {start|stop|status|logs|restart}"
        echo ""
        echo "Your Quiz App is ready! Current status:"
        if docker ps | grep -q quiz-app; then
            echo "✅ RUNNING at http://localhost:3001"
        else
            echo "❌ STOPPED - Run: $0 start"
        fi
        ;;
esac
