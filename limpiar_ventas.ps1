# Script para eliminar archivos duplicados de ventas
# Mantiene solo el archivo principal ventas.html

# Ruta del directorio del proyecto
$directorio = Split-Path -Parent $MyInvocation.MyCommand.Path

# Archivos de ventas a eliminar (todos excepto ventas.html)
$archivosAEliminar = @(
    "ventas-nuevo.html",
    "ventas-nuevo-diseno.html",
    "ventas-nueva.html",
    "ventas-nueva-version.html",
    "ventas-fixed.html",
    "ventas-backup-20250930-095653.html",
    "ventas-backup-20250930-110806.html",
    "ventas.html.bak"
)

# Eliminar archivos
$eliminados = 0
foreach ($archivo in $archivosAEliminar) {
    $rutaCompleta = Join-Path -Path $directorio -ChildPath $archivo
    if (Test-Path $rutaCompleta) {
        try {
            Remove-Item -Path $rutaCompleta -Force
            Write-Host "Eliminado: $archivo" -ForegroundColor Red
            $eliminados++
        } catch {
            Write-Host "Error al eliminar $archivo : $_" -ForegroundColor Yellow
        }
    }
}

# Mostrar resumen
Write-Host "`nResumen de limpieza:" -ForegroundColor Cyan
if ($eliminados -gt 0) {
    Write-Host "Se eliminaron $eliminados archivos duplicados de ventas" -ForegroundColor Green
} else {
    Write-Host "No se encontraron archivos duplicados para eliminar" -ForegroundColor Yellow
}

Write-Host "`nSe ha conservado el archivo original: ventas.html" -ForegroundColor Green
Write-Host "`nProceso completado. Presiona cualquier tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
