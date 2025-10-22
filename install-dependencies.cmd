@echo off
echo Instalando dependencias del proyecto...

:: Verificar si Node.js está instalado
node -v >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js no está instalado o no está en el PATH.
    echo Por favor, instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

:: Verificar si npm está instalado
npm -v >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: npm no está instalado o no está en el PATH.
    echo Por favor, instala Node.js que incluye npm.
    pause
    exit /b 1
)

echo Instalando dependencias con npm...
call npm install

if %ERRORLEVEL% neq 0 (
    echo Error al instalar las dependencias con npm.
    echo Intentando con yarn...
    
    :: Verificar si yarn está instalado
    yarn -v >nul 2>&1
    if %ERRORLEVEL% neq 0 (
        echo Error: Yarn no está instalado. Instálalo con: npm install -g yarn
    ) else (
        call yarn install
        if %ERRORLEVEL% neq 0 (
            echo Error al instalar las dependencias con yarn.
            pause
            exit /b 1
        )
    )
)

echo Instalando dependencias de desarrollo...
call npm install --save-dev @types/node @types/react @types/react-dom

echo Configurando Prisma...
call npx prisma generate

echo ¡Instalación completada con éxito!
echo.
echo Para iniciar el servidor de desarrollo, ejecuta:
echo npm run dev
echo.
pause
