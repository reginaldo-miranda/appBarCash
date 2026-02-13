@echo off
TITLE BarApp Launcher

echo ==========================================
echo      INICIANDO SISTEMA BAR APP
echo ==========================================
echo Diretorio Atual: "%CD%"
echo.
echo Pressione ENTER para tentar iniciar...
pause

:: Forcar mudanca para o diretorio do script
cd /d "%~dp0"
echo Novo Diretorio: "%CD%"

echo.
echo [1/2] PROCURANDO API...

if exist "api\server.js" (
    echo - API ENCONTRADA (Relativa)
    cd api
    if not exist "node_modules" (
        echo [AVISO] 'node_modules' nao encontrado. Tentando instalar...
        call npm install --omit=dev
    )
    REM Tenta rodar direto com node para evitar erro do npm
    start "BarApp API Server" cmd /k "node server.js || pause"
    cd ..
    goto PROCURAR_DESKTOP
)

if exist "C:\sistema\api\server.js" (
    echo - API ENCONTRADA (Absoluta C:\sistema\api)
    cd /d "C:\sistema\api"
    if not exist "node_modules" (
        echo [AVISO] 'node_modules' nao encontrado. Tentando instalar...
        call npm install --omit=dev
    )
    REM Tenta rodar direto com node
    start "BarApp API Server" cmd /k "node server.js || pause"
    goto PROCURAR_DESKTOP
)

echo [ERRO] API NAO ENCONTRADA!
echo Verifique se a pasta 'api' esta junto com este arquivo ou em C:\sistema\api
echo.
pause

:PROCURAR_DESKTOP
echo.
echo [2/2] PROCURANDO DESKTOP...
timeout /t 2 /nobreak >nul

if exist "desktop\dist\win-unpacked\AppBarCash.exe" (
    echo - DESKTOP ENCONTRADO (Relativo)
    start "" "desktop\dist\win-unpacked\AppBarCash.exe"
    goto FIM
)

if exist "C:\sistema\desktop\dist\win-unpacked\AppBarCash.exe" (
    echo - DESKTOP ENCONTRADO (Absoluto C:\sistema\...)
    start "" "C:\sistema\desktop\dist\win-unpacked\AppBarCash.exe"
    goto FIM
)

if exist "desktop\AppBarCash.exe" (
    echo - DESKTOP ENCONTRADO (Raiz desktop)
    start "" "desktop\AppBarCash.exe"
    goto FIM
)

echo [ERRO] Executavel Desktop nao encontrado.
echo Mas a API esta rodando!
echo.
echo Voce pode acessar o sistema pelo navegador:
echo - Neste computador: http://localhost:4000
echo - Na rede: http://IP-DO-COMPUTADOR:4000
echo.
echo (Para descobrir o IP, digite 'ipconfig' em outra janela)
echo.
pause

:FIM
exit
