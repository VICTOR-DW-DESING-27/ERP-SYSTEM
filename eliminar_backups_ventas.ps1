# Script para eliminar archivos de respaldo de ventas
# Eliminará todos los archivos que coincidan con el patrón *venta*backup*

# Ruta del directorio del proyecto
$directorio = Split-Path -Parent $MyInvocation.MyCommand.Path

# Encontrar archivos de respaldo de ventas
$archivosBackup = Get-ChildItem -Path $directorio -Filter "*venta*backup*" -File

if ($archivosBackup.Count -eq 0) {
    Write-Host "No se encontraron archivos de respaldo de ventas para eliminar." -ForegroundColor Yellow
    exit
}

# Mostrar archivos que se eliminarán
Write-Host "Se eliminarán los siguientes archivos de respaldo:" -ForegroundColor Yellow
$archivosBackup | ForEach-Object {
    Write-Host "- $($_.Name)" -ForegroundColor Red
}

# Confirmar antes de eliminar
$confirmacion = Read-Host "`n¿Desea continuar con la eliminación? (S/N)"

if ($confirmacion -eq 'S' -or $confirmacion -eq 's') {
    # Eliminar archivos
    $eliminados = 0
    $errores = 0
    
    foreach ($archivo in $archivosBackup) {
        try {
            Remove-Item -Path $archivo.FullName -Force
            Write-Host "Eliminado: $($archivo.Name)" -ForegroundColor Green
            $eliminados++
        } catch {
            Write-Host "Error al eliminar $($archivo.Name): $_" -ForegroundColor Red
            $errores++
        }
    }
    
    # Mostrar resumen
    Write-Host "`nResumen:" -ForegroundColor Cyan
    Write-Host "- Archivos eliminados: $eliminados" -ForegroundColor Green
    if ($errores -gt 0) {
        Write-Host "- Errores: $errores" -ForegroundColor Red
    }
} else {
    Write-Host "`nOperación cancelada. No se eliminó ningún archivo." -ForegroundColor Yellow
}

Write-Host "`nPresiona cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
