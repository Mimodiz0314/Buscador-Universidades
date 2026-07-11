@echo off
setlocal
title Buscador U - Deploy a Vercel (seguro)
color 0A

echo.
echo  ==========================================
echo   BUSCADOR U - Deploy SEGURO a produccion
echo  ==========================================
echo.

cd /d "%~dp0"

REM --- Autor del commit valido (Vercel bloquea con COMMIT_AUTHOR_REQUIRED) ---
git config user.email "miltonmoralesdiaz@gmail.com"
git config user.name  "Mimodiz0314"

REM ==========================================================
REM  PUERTA 1 de 2 - PRUEBAS. Si fallan, NO se publica nada.
REM ==========================================================
echo  [1/4] Corriendo pruebas (tests)...
call npm run test
if errorlevel 1 (
  echo.
  echo  [DETENIDO] Las pruebas FALLARON. No se sube nada a la web.
  pause
  exit /b 1
)

REM ==========================================================
REM  PUERTA 2 de 2 - BUILD. Si no compila, NO se publica nada.
REM ==========================================================
echo.
echo  [2/4] Compilando la app (build)...
call npm run build
if errorlevel 1 (
  echo.
  echo  [DETENIDO] El BUILD fallo. No se sube nada.
  pause
  exit /b 1
)

REM ==========================================================
REM  Todo verde -> guardamos en Git y publicamos
REM ==========================================================
echo.
echo  [3/4] Guardando cambios en Git...
git add -A
git commit -m "deploy: actualizacion desde script local" || echo  (sin cambios nuevos para guardar)
git remote get-url origin >nul 2>&1 && git push origin HEAD || echo  (sin remoto GitHub configurado; solo commit local)

echo.
echo  [4/4] Publicando en Vercel (produccion)...
call npx vercel --prod --yes
if errorlevel 1 (
  echo.
  echo  [ERROR] El deploy a Vercel fallo. Revisa el mensaje de arriba.
  pause
  exit /b 1
)

echo.
echo  ==========================================
echo   Listo! Si no ves los cambios, Ctrl+F5.
echo  ==========================================
pause
