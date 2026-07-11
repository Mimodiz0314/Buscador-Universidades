@echo off
setlocal
title UniScoop - Actualizar Estados con IA
color 0B

echo.
echo  ======================================================
echo   BUSCADOR U - Actualizador Automático de Admisiones
echo  ======================================================
echo.
echo  [1/3] Ejecutando Bot de IA para buscar nuevas fechas...
node --env-file=.env scripts/update_admission_statuses.js
if errorlevel 1 (
  echo.
  echo  [ERROR] El script de IA fallo. Revisa la consola.
  pause
  exit /b 1
)

echo.
echo  [2/3] Guardando nueva informacion de admisiones...
git add src/data/estados.json
git commit -m "bot: actualiza estados de admisiones via IA local" || echo  (No hubo cambios reales)

echo.
echo  [3/3] Quieres publicar estos cambios en la web ahora?
echo        (Si dices que no, igual quedaron guardados para el proximo Deploy)
echo.
set /p pub="Publicar ahora? (S/N): "
if /I "%pub%"=="S" (
   call Deploy_Buscador.bat
)

echo.
echo  ==========================================
echo   Proceso finalizado!
echo  ==========================================
pause
