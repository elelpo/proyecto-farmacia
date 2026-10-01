const HORARIO = {
  1: ["09:30-14:00", "17:00-20:30"],
  2: ["09:30-14:00", "17:00-20:30"],
  3: ["09:30-14:00", "17:00-20:30"],
  4: ["09:30-14:00", "17:00-20:30"],
  5: ["09:30-14:00", "17:00-20:30"],
  6: ["09:30-14:00"],
  0: []
};
const DIAS = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const ORDEN = [1,2,3,4,5,6,0];
const aMin = s => { const [h,m] = s.split(":").map(Number); return h*60+m; };

// Día y hora actuales en Valencia (Europe/Madrid)
function ahoraMadrid(){
  const p = new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Madrid",weekday:"short",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(new Date());
  const g = t => p.find(x => x.type === t).value;
  const dia = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(g("weekday"));
  return { dia, min: (parseInt(g("hour"),10) % 24)*60 + parseInt(g("minute"),10) };
}

function pintarHorario(hoy){
  document.getElementById("tabla-horario").innerHTML = ORDEN.map(d => {
    const t = HORARIO[d].length ? HORARIO[d].join(" y ").replace(/-/g," – ") : "Cerrado";
    return `<tr class="${d===hoy?"hoy":""}"><td>${DIAS[d]}</td><td>${t}</td></tr>`;
  }).join("");
}

// Próxima apertura: { dias hasta ella, día de la semana, hora }
function proxima(dia, min){
  for (let i = 0; i < 8; i++) {
    const d = (dia + i) % 7;
    for (const r of HORARIO[d]) {
      const a = r.split("-")[0];
      if (i > 0 || aMin(a) > min) return { i, d, a };
    }
  }
}

function estado(){
  const { dia, min } = ahoraMadrid();
  pintarHorario(dia);
  const el = document.getElementById("estado");
  const tramo = HORARIO[dia].find(r => { const [a,b] = r.split("-"); return min >= aMin(a) && min < aMin(b); });
  if (tramo) {
    el.textContent = `🟢 Abierto ahora · cierra a las ${tramo.split("-")[1]}`;
    return;
  }
  const n = proxima(dia, min);
  const cuando = n.i === 0 ? "hoy" : n.i === 1 ? "mañana" : `el ${DIAS[n.d].toLowerCase()}`;
  el.textContent = `🔴 Cerrado ahora · abre ${cuando} a las ${n.a}`;
}

estado();
setInterval(estado, 60000);
document.getElementById("anio").textContent = new Date().getFullYear();

// Encargo por correo
const EMAIL_ENCARGOS = "pedidos@farmaciavictoriamartin.es";
const formEncargo = document.getElementById("form-encargo");
if (formEncargo) {
  formEncargo.addEventListener("submit", (e) => {
    e.preventDefault();
    const datos = new FormData(formEncargo);
    const nombre = datos.get("nombre").trim();
    const telefono = datos.get("telefono").trim();
    const pedido = datos.get("pedido").trim();
    const asunto = `Encargo web - ${nombre}`;
    const cuerpo = `Nombre: ${nombre}\nTeléfono: ${telefono}\n\nPedido:\n${pedido}`;
    window.location.href = `mailto:${EMAIL_ENCARGOS}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
  });
}

// Menú móvil
const burger = document.querySelector(".burger"), menu = document.getElementById("menu");
function cerrarMenu(){ menu.classList.remove("open"); burger.setAttribute("aria-expanded","false"); }
burger.addEventListener("click", () => {
  const abierto = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", abierto);
});
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", cerrarMenu));
document.addEventListener("keydown", e => { if (e.key === "Escape") cerrarMenu(); });
