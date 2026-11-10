// GameArena · cliente que habla con el servidor Spring Boot mediante fetch()

const API_URL = "http://localhost:8080";

// ---------- Utilidades ----------

const $ = (id) => document.getElementById(id);

// Muestra un aviso arriba de la página (tipo "error" o "ok")
function avisar(mensaje, tipo = "error") {
    const aviso = $("aviso");
    aviso.textContent = mensaje;
    aviso.className = tipo;
    if (tipo === "ok") setTimeout(() => (aviso.className = ""), 3000);
}

// Función común: todos los fetch pasan por aquí
async function peticion(ruta, metodo = "GET", cuerpo = null) {
    const opciones = { method: metodo, headers: { "Content-Type": "application/json" } };
    if (cuerpo) opciones.body = JSON.stringify(cuerpo);

    let respuesta;
    try {
        respuesta = await fetch(API_URL + ruta, opciones);
    } catch (e) {
        // El servidor no responde (apagado, puerto distinto, CORS...)
        avisar("No se pudo conectar con el servidor en " + API_URL + ". ¿Está arrancado?");
        throw e;
    }

    if (!respuesta.ok) {
        const texto = await respuesta.text();
        avisar("Error " + respuesta.status + (texto ? ": " + texto : ""));
        throw new Error("HTTP " + respuesta.status);
    }
    const texto = await respuesta.text();
    return texto ? JSON.parse(texto) : null; // DELETE puede devolver cuerpo vacío
}

// Pinta una tabla. columnas: funciones que devuelven el texto; acciones: [[etiqueta, clase, función]]
function pintar(idTbody, datos, columnas, acciones = []) {
    const tbody = $(idTbody);
    tbody.replaceChildren();
    if (!datos.length) {
        const fila = tbody.insertRow();
        const td = fila.insertCell();
        td.colSpan = columnas.length + (acciones.length ? 1 : 0);
        td.textContent = "No hay datos.";
        return;
    }
    datos.forEach((item) => {
        const fila = tbody.insertRow();
        columnas.forEach((col) => (fila.insertCell().textContent = col(item) ?? ""));
        if (acciones.length) {
            const td = fila.insertCell();
            td.className = "acciones";
            acciones.forEach(([etiqueta, clase, fn]) => {
                const b = document.createElement("button");
                b.type = "button";
                b.textContent = etiqueta;
                b.className = clase;
                b.addEventListener("click", () => fn(item.id));
                td.appendChild(b);
            });
        }
    });
}

function rellenarSelect(idSelect, datos, textoFn, placeholder) {
    const s = $(idSelect);
    const actual = s.value;
    s.replaceChildren(new Option(placeholder, ""));
    datos.forEach((d) => s.add(new Option(textoFn(d), d.id)));
    s.value = actual;
}

// ---------- VIDEOJUEGOS (solo crear, ver y buscar) ----------

function pintarVideojuegos(lista) {
    pintar("tabla-videojuegos", lista, [(v) => v.id, (v) => v.nombre, (v) => v.genero]);
}

// GET /videojuegos
async function cargarVideojuegos() {
    const lista = await peticion("/videojuegos");
    pintarVideojuegos(lista);
    rellenarSelect("t-videojuego", lista, (v) => v.nombre, "Elige videojuego");
}

// POST /videojuegos
async function crearVideojuego(e) {
    e.preventDefault();
    await peticion("/videojuegos", "POST", { nombre: $("vj-nombre").value, genero: $("vj-genero").value });
    e.target.reset();
    avisar("Videojuego creado", "ok");
    cargarVideojuegos();
}

// GET /videojuegos/buscar?nombre=
async function buscarVideojuegos(e) {
    e.preventDefault();
    const lista = await peticion("/videojuegos/buscar?nombre=" + encodeURIComponent($("vj-buscar").value));
    pintarVideojuegos(lista);
}

// ---------- TORNEOS ----------

function pintarTorneos(lista) {
    pintar(
        "tabla-torneos", lista,
        [(t) => t.id, (t) => t.nombre, (t) => t.fecha, (t) => t.videojuego?.nombre, (t) => t.estado],
        [["Editar", "sec", editarTorneo], ["Eliminar", "borrar", eliminarTorneo]]
    );
}

// GET /torneos
async function cargarTorneos() {
    const lista = await peticion("/torneos");
    pintarTorneos(lista);
    rellenarSelect("p-torneo", lista, (t) => t.nombre, "Elige torneo");
}

// GET /torneos/estado/{estado}
async function filtrarTorneos(e) {
    e.preventDefault();
    pintarTorneos(await peticion("/torneos/estado/" + $("t-filtro").value));
}

// GET /torneos/{id}  → rellena el formulario para modificar
async function editarTorneo(id) {
    const t = await peticion("/torneos/" + id);
    $("t-id").value = t.id;
    $("t-nombre").value = t.nombre;
    $("t-fecha").value = t.fecha;
    $("t-videojuego").value = t.videojuego?.id ?? "";
    $("t-estado").value = t.estado;
    $("t-guardar").textContent = "Guardar cambios";
    $("t-cancelar").hidden = false;
}

function limpiarFormTorneo() {
    $("form-torneo").reset();
    $("t-id").value = "";
    $("t-guardar").textContent = "Crear torneo";
    $("t-cancelar").hidden = true;
}

// POST /torneos  o  PUT /torneos/{id}
async function guardarTorneo(e) {
    e.preventDefault();
    // Regla: todo torneo lleva videojuego y un estado válido
    if (!$("t-videojuego").value) return avisar("Elige un videojuego para el torneo.");
    if (!["ABIERTO", "EN_CURSO", "FINALIZADO"].includes($("t-estado").value)) return avisar("Elige un estado válido.");

    const torneo = {
        nombre: $("t-nombre").value,
        fecha: $("t-fecha").value,
        estado: $("t-estado").value,
        videojuego: { id: Number($("t-videojuego").value) },
    };
    const id = $("t-id").value;
    if (id) await peticion("/torneos/" + id, "PUT", torneo);
    else await peticion("/torneos", "POST", torneo);

    limpiarFormTorneo();
    avisar(id ? "Torneo modificado" : "Torneo creado", "ok");
    cargarTorneos();
}

// DELETE /torneos/{id}  (si tiene participaciones, el servidor responde con error y se avisa)
async function eliminarTorneo(id) {
    if (!confirm("¿Eliminar el torneo " + id + "?")) return;
    await peticion("/torneos/" + id, "DELETE");
    avisar("Torneo eliminado", "ok");
    cargarTorneos();
    cargarParticipaciones();
}

// ---------- JUGADORES ----------

function pintarJugadores(lista) {
    pintar(
        "tabla-jugadores", lista,
        [(j) => j.id, (j) => j.nick, (j) => j.email],
        [["Editar", "sec", editarJugador], ["Eliminar", "borrar", eliminarJugador]]
    );
}

// GET /jugadores
async function cargarJugadores() {
    const lista = await peticion("/jugadores");
    pintarJugadores(lista);
    rellenarSelect("p-jugador", lista, (j) => j.nick, "Elige jugador");
}

// GET /jugadores/buscar?nick=
async function buscarJugadores(e) {
    e.preventDefault();
    pintarJugadores(await peticion("/jugadores/buscar?nick=" + encodeURIComponent($("j-buscar").value)));
}

// GET /jugadores/{id}  → rellena el formulario para modificar
async function editarJugador(id) {
    const j = await peticion("/jugadores/" + id);
    $("j-id").value = j.id;
    $("j-nick").value = j.nick;
    $("j-email").value = j.email;
    $("j-guardar").textContent = "Guardar cambios";
    $("j-cancelar").hidden = false;
}

function limpiarFormJugador() {
    $("form-jugador").reset();
    $("j-id").value = "";
    $("j-guardar").textContent = "Crear jugador";
    $("j-cancelar").hidden = true;
}

// POST /jugadores  o  PUT /jugadores/{id}
async function guardarJugador(e) {
    e.preventDefault();
    const jugador = { nick: $("j-nick").value, email: $("j-email").value };
    const id = $("j-id").value;
    if (id) await peticion("/jugadores/" + id, "PUT", jugador);
    else await peticion("/jugadores", "POST", jugador);

    limpiarFormJugador();
    avisar(id ? "Jugador modificado" : "Jugador creado", "ok");
    cargarJugadores();
}

// DELETE /jugadores/{id}  (si tiene participaciones, el servidor responde con error y se avisa)
async function eliminarJugador(id) {
    if (!confirm("¿Eliminar el jugador " + id + "?")) return;
    await peticion("/jugadores/" + id, "DELETE");
    avisar("Jugador eliminado", "ok");
    cargarJugadores();
    cargarParticipaciones();
}

// ---------- PARTICIPACIONES ----------

// GET /participaciones
async function cargarParticipaciones() {
    const lista = await peticion("/participaciones");
    pintar(
        "tabla-participaciones", lista,
        [(p) => p.id, (p) => p.torneo?.nombre, (p) => p.jugador?.nick, (p) => p.puesto],
        [["Editar", "sec", editarParticipacion], ["Eliminar", "borrar", eliminarParticipacion]]
    );
    participaciones = lista;
}
let participaciones = [];

// Editar: la lista ya está cargada, se rellena el formulario con ese elemento
function editarParticipacion(id) {
    const p = participaciones.find((x) => x.id === id);
    $("p-id").value = p.id;
    $("p-torneo").value = p.torneo?.id ?? "";
    $("p-jugador").value = p.jugador?.id ?? "";
    $("p-puesto").value = p.puesto ?? "";
    $("p-guardar").textContent = "Guardar cambios";
    $("p-cancelar").hidden = false;
}

function limpiarFormParticipacion() {
    $("form-participacion").reset();
    $("p-id").value = "";
    $("p-guardar").textContent = "Inscribir";
    $("p-cancelar").hidden = true;
}

// POST /participaciones  o  PUT /participaciones/{id}
async function guardarParticipacion(e) {
    e.preventDefault();
    const p = {
        torneo: { id: Number($("p-torneo").value) },
        jugador: { id: Number($("p-jugador").value) },
        puesto: $("p-puesto").value ? Number($("p-puesto").value) : null,
    };
    const id = $("p-id").value;
    if (id) await peticion("/participaciones/" + id, "PUT", p);
    else await peticion("/participaciones", "POST", p);

    limpiarFormParticipacion();
    avisar(id ? "Participación modificada" : "Participación creada", "ok");
    cargarParticipaciones();
}

// DELETE /participaciones/{id}
async function eliminarParticipacion(id) {
    if (!confirm("¿Eliminar la participación " + id + "?")) return;
    await peticion("/participaciones/" + id, "DELETE");
    avisar("Participación eliminada", "ok");
    cargarParticipaciones();
}

// ---------- Eventos y carga inicial ----------

$("form-videojuego").addEventListener("submit", (e) => crearVideojuego(e).catch(() => {}));
$("form-buscar-videojuego").addEventListener("submit", (e) => buscarVideojuegos(e).catch(() => {}));
$("vj-todos").addEventListener("click", () => cargarVideojuegos().catch(() => {}));

$("form-torneo").addEventListener("submit", (e) => guardarTorneo(e).catch(() => {}));
$("form-filtro-torneo").addEventListener("submit", (e) => filtrarTorneos(e).catch(() => {}));
$("t-todos").addEventListener("click", () => cargarTorneos().catch(() => {}));
$("t-cancelar").addEventListener("click", limpiarFormTorneo);

$("form-jugador").addEventListener("submit", (e) => guardarJugador(e).catch(() => {}));
$("form-buscar-jugador").addEventListener("submit", (e) => buscarJugadores(e).catch(() => {}));
$("j-todos").addEventListener("click", () => cargarJugadores().catch(() => {}));
$("j-cancelar").addEventListener("click", limpiarFormJugador);

$("form-participacion").addEventListener("submit", (e) => guardarParticipacion(e).catch(() => {}));
$("p-cancelar").addEventListener("click", limpiarFormParticipacion);

// "Gestionar incluye ver": las listas se cargan solas al abrir la página
document.addEventListener("DOMContentLoaded", () => {
    cargarVideojuegos().catch(() => {});
    cargarTorneos().catch(() => {});
    cargarJugadores().catch(() => {});
    cargarParticipaciones().catch(() => {});
});