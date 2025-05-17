// Administracion.js

document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('#adminTab button[data-bs-toggle="tab"]');
  const filterInputs = {
    usuarios: document.getElementById('filtro-usuarios'),
    contratos: document.getElementById('filtro-contratos'),
    prestamos: document.getElementById('filtro-prestamos'),
    seguros: document.getElementById('filtro-seguros'),
    tarjetas: document.getElementById('filtro-tarjetas'),
  };

  // Cache tbody elements
  const tablesBody = {
    usuarios: document.getElementById('tabla-usuarios'),
    contratos: document.getElementById('tabla-contratos'),
    prestamos: document.getElementById('tabla-prestamos'),
    seguros: document.getElementById('tabla-seguros'),
    tarjetas: document.getElementById('tabla-tarjetas'),
  };

  // Datos de ejemplo (puedes reemplazar por datos reales desde el backend)
  const data = {
    usuarios: [
      { nombre: 'Juan', apellido: 'Pérez', rut: '12345678-9', documento: 'DNI', email: 'juan@example.com', telefono: '912345678', rol: 'Administrador' },
      { nombre: 'María', apellido: 'Gómez', rut: '98765432-1', documento: 'DNI', email: 'maria@example.com', telefono: '987654321', rol: 'Usuario' },
      // más usuarios...
    ],
    contratos: [
      { usuario: 'Juan Pérez', nroTarjeta: '1234-5678-1234-5678', saldoDisponible: 100000, limite: 200000, estado: 'activa', emision: '2023-01-01' },
      // más contratos...
    ],
    prestamos: [
      { usuario: 'María Gómez', monto: 500000, plazo: '12 meses', interes: '5%', estado: 'aprobado', solicitud: '2023-03-10' },
      // más prestamos...
    ],
    seguros: [
      { usuario: 'Juan Pérez', tipo: 'vida', cobertura: '1000000', prima: '15000', estado: 'vigente', vencimiento: '2025-12-31' },
      // más seguros...
    ],
    tarjetas: [
      { usuario: 'María Gómez', nroTarjeta: '1111-2222-3333-4444', credito: 300000, saldo: 150000, estado: 'bloqueada', emision: '2022-06-01' },
      // más tarjetas...
    ]
  };

  // Funciones para renderizar cada tabla
  function renderUsuarios(usuarios) {
    tablesBody.usuarios.innerHTML = usuarios.map(u => `
      <tr>
        <td>${u.nombre}</td>
        <td>${u.apellido}</td>
        <td>${u.rut}</td>
        <td>${u.documento}</td>
        <td>${u.email}</td>
        <td>${u.telefono}</td>
        <td>${u.rol}</td>
      </tr>
    `).join('');
  }

  function renderContratos(contratos) {
    tablesBody.contratos.innerHTML = contratos.map(c => `
      <tr>
        <td>${c.usuario}</td>
        <td>${c.nroTarjeta}</td>
        <td>${c.saldoDisponible}</td>
        <td>${c.limite}</td>
        <td>${c.estado}</td>
        <td>${c.emision}</td>
      </tr>
    `).join('');
  }

  function renderPrestamos(prestamos) {
    tablesBody.prestamos.innerHTML = prestamos.map(p => `
      <tr>
        <td>${p.usuario}</td>
        <td>${p.monto}</td>
        <td>${p.plazo}</td>
        <td>${p.interes}</td>
        <td>${p.estado}</td>
        <td>${p.solicitud}</td>
      </tr>
    `).join('');
  }

  function renderSeguros(seguros) {
    tablesBody.seguros.innerHTML = seguros.map(s => `
      <tr>
        <td>${s.usuario}</td>
        <td>${s.tipo}</td>
        <td>${s.cobertura}</td>
        <td>${s.prima}</td>
        <td>${s.estado}</td>
        <td>${s.vencimiento}</td>
      </tr>
    `).join('');
  }

  function renderTarjetas(tarjetas) {
    tablesBody.tarjetas.innerHTML = tarjetas.map(t => `
      <tr>
        <td>${t.usuario}</td>
        <td>${t.nroTarjeta}</td>
        <td>${t.credito}</td>
        <td>${t.saldo}</td>
        <td>${t.estado}</td>
        <td>${t.emision}</td>
      </tr>
    `).join('');
  }

  // Render inicial
  renderUsuarios(data.usuarios);
  renderContratos(data.contratos);
  renderPrestamos(data.prestamos);
  renderSeguros(data.seguros);
  renderTarjetas(data.tarjetas);

  // Filtrado por texto simple para cada tabla
  function filterTable(type, query) {
    const rows = tablesBody[type].querySelectorAll('tr');
    query = query.toLowerCase();
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? '' : 'none';
    });
  }

  // Asignar evento input a cada filtro
  Object.entries(filterInputs).forEach(([type, input]) => {
    input.addEventListener('input', (e) => {
      filterTable(type, e.target.value);
    });
  });

  // Control de pestañas con Bootstrap: ya tienes la funcionalidad nativa,
  // pero si quieres reaccionar al cambio de pestaña, puedes hacerlo aquí:

  const bootstrapTabs = [...tabButtons].map(btn => new bootstrap.Tab(btn));

  tabButtons.forEach(button => {
    button.addEventListener('shown.bs.tab', (event) => {
      // event.target = pestaña activada
      // event.relatedTarget = pestaña anterior
      const tabId = event.target.getAttribute('data-bs-target').substring(1); // sin #
      console.log('Pestaña activa:', tabId);

      // Si necesitas alguna acción al cambiar de pestaña, aquí
      // Ej: resetear filtro o cargar datos nuevos en esa tabla si usas API.
      filterInputs[tabId].value = '';
      filterTable(tabId, '');
    });
  });

});
