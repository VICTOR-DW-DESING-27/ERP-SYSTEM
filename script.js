// Datos de ejemplo para el dashboard
const dashboardData = {
  stats: [
    { id: 1, title: 'Ventas del Mes', value: '$24,000', change: '+12%', changeType: 'increase', icon: 'dollar-sign' },
    { id: 2, title: 'Clientes Nuevos', value: '48', change: '+8%', changeType: 'increase', icon: 'users' },
    { id: 3, title: 'Productos en Stock', value: '1,234', change: '-2%', changeType: 'decrease', icon: 'box' },
    { id: 4, title: 'Órdenes Pendientes', value: '12', change: '+4%', changeType: 'increase', icon: 'clipboard-list' },
  ],
  recentSales: [
    { id: 1, customer: 'Juan Pérez', products: 3, total: 1200, status: 'completed', date: '2023-05-15' },
    { id: 2, customer: 'María García', products: 5, total: 850, status: 'completed', date: '2023-05-14' },
    { id: 3, customer: 'Carlos López', products: 2, total: 450, status: 'pending', date: '2023-05-14' },
    { id: 4, customer: 'Ana Martínez', products: 1, total: 120, status: 'completed', date: '2023-05-13' },
  ],
  recentActivity: [
    { id: 1, user: 'Juan Pérez', action: 'realizó una venta', amount: '$1,200', time: 'Hace 5 minutos' },
    { id: 2, user: 'María García', action: 'actualizó el inventario', details: '15 productos', time: 'Hace 1 hora' },
    { id: 3, user: 'Carlos López', action: 'registró un nuevo cliente', details: 'Empresa XYZ', time: 'Hace 2 horas' },
    { id: 4, user: 'Ana Martínez', action: 'generó un reporte', details: 'Ventas del mes', time: 'Hace 3 horas' },
  ]
};

// Inicialización del dashboard
document.addEventListener('DOMContentLoaded', function() {
  // Cargar estadísticas
  loadStats();
  
  // Cargar ventas recientes
  loadRecentSales();
  
  // Cargar actividad reciente
  loadRecentActivity();
  
  // Configurar menú móvil
  setupMobileMenu();
  
  // Configurar tooltips
  setupTooltips();
});

// Cargar estadísticas en el dashboard
function loadStats() {
  const statsContainer = document.querySelector('.stats-grid');
  if (!statsContainer) return;
  
  statsContainer.innerHTML = dashboardData.stats.map(stat => `
    <div class="card p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-${getStatColor(stat.id)}-100 text-${getStatColor(stat.id)}-600 mr-4">
          <i class="fas fa-${stat.icon}"></i>
        </div>
        <div>
          <p class="text-gray-500 text-sm">${stat.title}</p>
          <h3 class="text-2xl font-bold">${stat.value}</h3>
          <p class="text-${stat.changeType === 'increase' ? 'green' : 'red'}-500 text-sm">
            ${stat.change} ${stat.changeType === 'increase' ? '↑' : '↓'} desde el mes pasado
          </p>
        </div>
      </div>
    </div>
  `).join('');
}

// Cargar ventas recientes
function loadRecentSales() {
  const salesTable = document.querySelector('#recent-sales tbody');
  if (!salesTable) return;
  
  salesTable.innerHTML = dashboardData.recentSales.map(sale => `
    <tr class="hover:bg-gray-50">
      <td class="py-3 px-4">#${sale.id}</td>
      <td class="py-3 px-4">${sale.customer}</td>
      <td class="py-3 px-4">${sale.products} productos</td>
      <td class="py-3 px-4 text-right font-medium">$${sale.total.toLocaleString()}</td>
      <td class="py-3 px-4">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          sale.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }">
          ${sale.status === 'completed' ? 'Completada' : 'Pendiente'}
        </span>
      </td>
      <td class="py-3 px-4 text-sm text-gray-500">${formatDate(sale.date)}</td>
    </tr>
  `).join('');
}

// Cargar actividad reciente
function loadRecentActivity() {
  const activityContainer = document.querySelector('#recent-activity');
  if (!activityContainer) return;
  
  activityContainer.innerHTML = dashboardData.recentActivity.map(activity => `
    <div class="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
      <div class="p-2 bg-blue-100 text-blue-600 rounded-full mr-3">
        <i class="fas fa-${getActivityIcon(activity.action)}"></i>
      </div>
      <div class="flex-1">
        <p class="font-medium">${activity.user} ${activity.action}</p>
        ${activity.details ? `<p class="text-sm text-gray-500">${activity.details}</p>` : ''}
        <p class="text-xs text-gray-400">${activity.time}</p>
      </div>
      ${activity.amount ? `<span class="text-green-500 text-sm font-medium">+${activity.amount}</span>` : ''}
    </div>
  `).join('');
}

// Configurar menú móvil
function setupMobileMenu() {
  const menuButton = document.querySelector('[data-menu-button]');
  const sidebar = document.querySelector('.sidebar');
  
  if (menuButton && sidebar) {
    menuButton.addEventListener('click', () => {
      sidebar.classList.toggle('translate-x-0');
      sidebar.classList.toggle('-translate-x-full');
    });
  }
}

// Configurar tooltips
function setupTooltips() {
  const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
  
  tooltipTriggers.forEach(trigger => {
    const tooltip = document.createElement('div');
    tooltip.className = 'hidden absolute z-50 bg-gray-900 text-white text-xs rounded py-1 px-2';
    tooltip.textContent = trigger.getAttribute('data-tooltip');
    document.body.appendChild(tooltip);
    
    trigger.addEventListener('mouseenter', (e) => {
      const rect = trigger.getBoundingClientRect();
      tooltip.style.top = `${rect.top - 30}px`;
      tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
      tooltip.classList.remove('hidden');
    });
    
    trigger.addEventListener('mouseleave', () => {
      tooltip.classList.add('hidden');
    });
  });
}

// Funciones de utilidad
function getStatColor(id) {
  const colors = ['blue', 'green', 'yellow', 'purple'];
  return colors[(id - 1) % colors.length];
}

function getActivityIcon(action) {
  if (action.includes('venta')) return 'shopping-cart';
  if (action.includes('inventario')) return 'boxes';
  if (action.includes('cliente')) return 'user-plus';
  if (action.includes('reporte')) return 'chart-bar';
  return 'info-circle';
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Inicializar gráficos (usando Chart.js si está disponible)
function initCharts() {
  if (typeof Chart === 'undefined') return;
  
  // Gráfico de ventas
  const salesCtx = document.getElementById('sales-chart');
  if (salesCtx) {
    new Chart(salesCtx, {
      type: 'line',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [{
          label: 'Ventas 2023',
          data: [12000, 19000, 15000, 25000, 22000, 30000],
          borderColor: '#4f46e5',
          tension: 0.3,
          fill: true,
          backgroundColor: 'rgba(79, 70, 229, 0.1)'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}

// Cargar Chart.js y luego inicializar gráficos
function loadCharts() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
  script.onload = initCharts;
  document.head.appendChild(script);
}

// Cargar gráficos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadCharts);
