/* =========================
   BLUE WATER - SCRIPT COMPLETO
   LOGIN + MODULOS + GRAFICO + PDF
========================= */

/* USUARIOS Y SEGURIDAD */
const AUTH_USER = "BluewaterA";
const AUTH_PASS = "BLUEWATERALEXO_";
const EDIT_CODE = "336522ALEX";

let currentModule = "";
let routesChartInstance = null;

/* =========================
   LOGIN
========================= */
function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (user === AUTH_USER && pass === AUTH_PASS) {
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("mainPanel").classList.remove("hidden");

    updateRoutesChart();
  } else {
    document.getElementById("loginError").innerText =
      "Usuario o contraseña incorrectos";
  }
}

/* =========================
   NAVEGACIÓN
========================= */
function goHome() {
  document.getElementById("moduleScreen").classList.add("hidden");
  document.getElementById("mainPanel").classList.remove("hidden");

  updateRoutesChart();
}

/* =========================
   LOCAL STORAGE
========================= */
function saveData(key, record) {
  let data = JSON.parse(localStorage.getItem(key)) || [];
  data.push(record);
  localStorage.setItem(key, JSON.stringify(data));
}

function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

/* =========================
   ABRIR MODULOS
========================= */
function openModule(module) {
  currentModule = module;

  document.getElementById("mainPanel").classList.add("hidden");
  document.getElementById("moduleScreen").classList.remove("hidden");

  document.getElementById("moduleTitle").innerText =
    module.toUpperCase();

  const content = document.getElementById("moduleContent");

  if (module === "rutas") {
    content.innerHTML = `
      <div class="grid">
        <button onclick="routeForm('Ruta 38')">Ruta 38</button>
        <button onclick="routeForm('Ruta Puente de la A')">Ruta Puente de la A</button>
        <button onclick="routeForm('Vergeles')">Vergeles</button>
        <button onclick="routeForm('Pancho')">Pancho</button>
      </div>
    `;
  }

  else if (
    module === "botellas" ||
    module === "sellos" ||
    module === "tapas" ||
    module === "etiquetas"
  ) {
    content.innerHTML = `
      <div class="grid">
        <button onclick="inventoryForm('${module}', 'Compra')">Compra</button>
        <button onclick="inventoryForm('${module}', 'Utilización')">Utilización</button>
      </div>
    `;
  }

  else if (module === "personal") {
    content.innerHTML = `
      <div class="grid">
        <button onclick="personalForm('ISSAC')">ISSAC</button>
        <button onclick="personalForm('RICARD')">RICARD</button>
        <button onclick="personalForm('JARON')">JARON</button>
      </div>
    `;
  }
}

/* =========================
   RUTAS
========================= */
function routeForm(routeName) {
  document.getElementById("moduleTitle").innerText = routeName;

  document.getElementById("moduleContent").innerHTML = `
    <input type="date" id="fecha">
    <input type="number" id="embarcadas" placeholder="Pomas embarcadas">
    <input type="number" id="vendidas" placeholder="Pomas vendidas">
    <input type="number" id="vacias" placeholder="Pomas vacías">
    <input type="number" id="llenas" placeholder="Pomas llenas">
    <input type="number" id="total" placeholder="Total generado">
    <button onclick="saveRoute('${routeName}')">Guardar Registro</button>
    <div id="registro"></div>
  `;

  renderRecords(routeName);
}

function saveRoute(routeName) {
  const record = {
    fecha: document.getElementById("fecha").value,
    embarcadas: Number(document.getElementById("embarcadas").value),
    vendidas: Number(document.getElementById("vendidas").value),
    vacias: Number(document.getElementById("vacias").value),
    llenas: Number(document.getElementById("llenas").value),
    total: Number(document.getElementById("total").value)
  };

  saveData(routeName, record);

  renderRecords(routeName);

  updateRoutesChart();

  alert("Registro guardado correctamente");
}

/* =========================
   INVENTARIO
========================= */
function inventoryForm(module, type) {
  document.getElementById("moduleTitle").innerText =
    `${module.toUpperCase()} - ${type}`;

  if (type === "Compra") {
    document.getElementById("moduleContent").innerHTML = `
      <input type="date" id="fecha">
      <select id="modoPago" onchange="toggleCheque()">
        <option value="">Modo de Pago</option>
        <option value="Efectivo">Efectivo</option>
        <option value="Transferencia">Transferencia</option>
        <option value="Cheque">Cheque</option>
      </select>

      <div id="chequeFields"></div>

      <input type="number" id="valorTotal" placeholder="Valor Total">
      <input type="number" id="cantidad" placeholder="Cantidad comprada">
      <input type="text" id="proveedor" placeholder="Proveedor">
      <button onclick="saveInventory('${module}','${type}')">Guardar</button>
      <div id="registro"></div>
    `;
  } else {
    document.getElementById("moduleContent").innerHTML = `
      <input type="date" id="fecha">
      <input type="number" id="cantidad" placeholder="Cantidad utilizada">
      <input type="text" id="responsable" placeholder="Responsable">
      <button onclick="saveInventory('${module}','${type}')">Guardar</button>
      <div id="registro"></div>
    `;
  }

  renderRecords(`${module}_${type}`);
}

function toggleCheque() {
  const modo = document.getElementById("modoPago").value;
  const chequeFields = document.getElementById("chequeFields");

  if (modo === "Cheque") {
    chequeFields.innerHTML = `
      <input type="number" id="diasPago" placeholder="Días de pago">
      <input type="number" id="valorCheque" placeholder="Valor cheque">
    `;
  } else {
    chequeFields.innerHTML = "";
  }
}

function saveInventory(module, type) {
  let record = {
    fecha: document.getElementById("fecha").value,
    cantidad: Number(document.getElementById("cantidad").value)
  };

  if (type === "Compra") {
    record.modoPago = document.getElementById("modoPago").value;
    record.valorTotal = Number(
      document.getElementById("valorTotal").value
    );
    record.proveedor = document.getElementById("proveedor").value;

    if (record.modoPago === "Cheque") {
      record.diasPago = Number(
        document.getElementById("diasPago").value
      );
      record.valorCheque = Number(
        document.getElementById("valorCheque").value
      );
    }
  } else {
    record.responsable =
      document.getElementById("responsable").value;
  }

  saveData(`${module}_${type}`, record);

  renderRecords(`${module}_${type}`);

  alert("Registro guardado correctamente");
}

/* =========================
   PERSONAL
========================= */
function personalForm(person) {
  document.getElementById("moduleTitle").innerText =
    `PERSONAL - ${person}`;

  document.getElementById("moduleContent").innerHTML = `
    <input type="date" id="fecha">
    <input type="number" id="sueldo" placeholder="Sueldo">
    <input type="number" id="dias" placeholder="Días trabajados">
    <input type="number" id="prestamo" placeholder="Préstamos">
    <input type="number" id="porcentaje" placeholder="Porcentaje">
    <button onclick="savePersonal('${person}')">Guardar</button>
    <div id="registro"></div>
  `;

  renderRecords(person);
}

function savePersonal(person) {
  const record = {
    fecha: document.getElementById("fecha").value,
    sueldo: Number(document.getElementById("sueldo").value),
    dias: Number(document.getElementById("dias").value),
    prestamo: Number(document.getElementById("prestamo").value),
    porcentaje: Number(document.getElementById("porcentaje").value)
  };

  saveData(person, record);

  renderRecords(person);

  alert("Registro guardado correctamente");
}

/* =========================
   TABLAS
========================= */
function renderRecords(key) {
  const data = getData(key);

  if (!data.length) {
    document.getElementById("registro").innerHTML =
      "<p>No hay registros aún.</p>";
    return;
  }

  let html = "<table><tr>";

  Object.keys(data[0]).forEach(field => {
    html += `<th>${field}</th>`;
  });

  html += "<th>PDF</th><th>Editar</th></tr>";

  data.forEach((record, index) => {
    html += "<tr>";

    Object.values(record).forEach(value => {
      html += `<td>${value}</td>`;
    });

    html += `
      <td><button onclick="generatePDF('${key}',${index})">PDF</button></td>
      <td><button onclick="editRecord('${key}',${index})">Editar</button></td>
    `;

    html += "</tr>";
  });

  html += "</table>";

  document.getElementById("registro").innerHTML = html;
}

/* =========================
   EDITAR
========================= */
function editRecord(key, index) {
  const code = prompt("Ingrese código de autorización:");

  if (code !== EDIT_CODE) {
    alert("Código incorrecto");
    return;
  }

  let data = getData(key);

  const field = prompt("Campo a modificar:");
  const newValue = prompt("Nuevo valor:");

  if (data[index][field] !== undefined) {
    data[index][field] = newValue;

    localStorage.setItem(key, JSON.stringify(data));

    renderRecords(key);

    updateRoutesChart();

    alert("Registro actualizado");
  } else {
    alert("Campo no encontrado");
  }
}

/* =========================
   PDF INDIVIDUAL
========================= */
function generatePDF(key, index) {
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  const record = getData(key)[index];

  let y = 20;

  doc.setFontSize(18);
  doc.text("BLUE WATER", 80, y);

  y += 10;

  doc.setFontSize(14);
  doc.text("CONTROL OFICIAL", 75, y);

  y += 15;

  doc.setFontSize(12);

  for (let field in record) {
    doc.text(
      `${field.toUpperCase()}: ${record[field]}`,
      20,
      y
    );
    y += 10;
  }

  y += 10;

  doc.text("SELLO: BLUE WATER", 20, y);

  doc.save(`BLUE_WATER_${key}_${index + 1}.pdf`);
}

/* =========================
   PDF GENERAL
========================= */
function generateGeneralPDF() {
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  let y = 20;

  let ingresos = 0;
  let gastos = 0;

  doc.setFontSize(18);
  doc.text("BLUE WATER - REPORTE GENERAL", 45, y);

  y += 20;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    const data = JSON.parse(localStorage.getItem(key));

    if (!Array.isArray(data)) continue;

    doc.setFontSize(12);
    doc.text(`Módulo: ${key}`, 20, y);

    y += 10;

    data.forEach(record => {
      let line = "";

      for (let field in record) {
        line += `${field}: ${record[field]} | `;
      }

      doc.text(line.substring(0, 180), 20, y);

      y += 8;

      if (record.total) ingresos += Number(record.total);

      if (record.valorTotal) gastos += Number(record.valorTotal);

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    y += 10;
  }

  const balance = ingresos - gastos;

  doc.setFontSize(14);

  doc.text(`Ingresos Totales: ${ingresos}`, 20, y);
  y += 10;

  doc.text(`Gastos Totales: ${gastos}`, 20, y);
  y += 10;

  if (balance >= 0) {
    doc.text(`GANANCIA: ${balance}`, 20, y);
  } else {
    doc.text(`PÉRDIDA: ${Math.abs(balance)}`, 20, y);
  }

  doc.save("BLUE_WATER_REPORTE_GENERAL.pdf");
}

/* =========================
   GRAFICO RUTAS
========================= */
function updateRoutesChart() {
  const routes = [
    "Ruta 38",
    "Ruta Puente de la A",
    "Vergeles",
    "Pancho"
  ];

  const totals = routes.map(route => {
    const data = getData(route);

    return data.reduce(
      (sum, record) => sum + Number(record.total || 0),
      0
    );
  });

  const ctx = document
    .getElementById("routesChart")
    .getContext("2d");

  if (routesChartInstance) {
    routesChartInstance.destroy();
  }

  routesChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: routes,
      datasets: [
        {
          label: "Ganancias por Ruta",
          data: totals,
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}