@echo off
cd /d "%~dp0"
title Juego de verbos irregulares
echo.
echo  Juego de verbos irregulares
echo  ---------------------------
echo  En este computador:  http://localhost:5200
echo.
echo  En los celulares conectados a la misma red wifi, escriba:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do for /f "tokens=1" %%b in ("%%a") do echo     http://%%b:5200
echo.
echo  Deje esta ventana abierta mientras se juega. Para apagar el juego, cierrela.
echo.
where python >nul 2>nul
if errorlevel 1 (
  echo  No se encontro Python. Instalelo desde python.org, o abra index.html con doble clic
  echo  para jugar solo en este computador.
  pause
  exit /b
)
start "" http://localhost:5200
python servidor.py 5200
