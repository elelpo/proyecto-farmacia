// ⚠️ EDITA AQUÍ EL HORARIO REAL. Formato "HH:MM-HH:MM"; varios tramos separados por coma; [] = cerrado.
// 0 = domingo, 1 = lunes ... 6 = sábado
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

// Hora actual en Valencia (Europe/Madrid)
function ahoraMadrid(){
  const p = new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Madrid",weekday:"short",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(new Date());
  const g = t => p.find(x => x.type === t).value;
  const dia = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(g("weekday"));
  return { dia, min: parseInt(g("hour"),10)*60 + parseInt(g("minute"),10) };
}
const aMin = s => { const [h,m] = s.split(":").map(Number); return h*60+m; };

function pintarHorario(hoy){
  document.getElementById("tabla-horario").innerHTML = ORDEN.map(d => {
    const t = HORARIO[d].length ? HORARIO[d].join(" y ").replace(/-/g," – ") : "Cerrado";
    return `<tr class="${d===hoy?"hoy":""}"><td>${DIAS[d]}</td><td>${t}</td></tr>`;
  }).join("");
}

function estado(){
  const { dia, min } = ahoraMadrid();
  pintarHorario(dia);
  const el = document.getElementById("estado");
  const abierto = HORARIO[dia].some(r => { const [a,b] = r.split("-"); return min >= aMin(a) && min < aMin(b); });
  el.textContent = abierto ? "🟢 Abierto ahora" : "🔴 Cerrado ahora";
}

estado();
setInterval(estado, 60000);
document.getElementById("anio").textContent = new Date().getFullYear();

// ⚠️ Pon aquí el email real donde queréis recibir los encargos
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
    const cuerpo =
      `Nombre: ${nombre}\n` +
      `Teléfono: ${telefono}\n\n` +
      `Pedido:\n${pedido}`;

    const mailto = `mailto:${EMAIL_ENCARGOS}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    window.location.href = mailto;
  });
}

const burger = document.querySelector(".burger"), menu = document.getElementById("menu");
burger.addEventListener("click", () => {
  const abierto = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", abierto);
});
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => menu.classList.remove("open")));
