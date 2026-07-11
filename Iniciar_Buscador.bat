@echo off
title UniScoop - Servidor local
color 0B
echo ==========================================
echo    BUSCADOR DE OPORTUNIDADES UNIVERSITARIAS
echo ==========================================
echo.
echo Arrancando el servidor local...
echo El navegador se abrira automaticamente en unos segundos.
echo.
echo Por favor, NO CIERRES esta ventana negra mientras uses la aplicacion.
echo Para apagar el servidor, simplemente cierra esta ventana.
echo.
cd /d "%~dp0"
start "" http://localhost:5180
call npm run dev
pause
