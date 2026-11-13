// GameArena · gestión: conexión de la página con el servidor Spring Boot

const API_URL = "http://localhost:8080";
const $ = (id) => document.getElementById(id);

// ---------- Avisos y petición única (todos los fetch pasan por aquí) ----------

function avisar(texto, tipo = "error") {
    $("aviso").textContent = texto;
    $("aviso").className = tipo; // "error" o "ok": el CSS de la página los muestra
}

async function peticion(ruta, metodo = "GET", cuerpo) {
    let r;
    try {
        r = await fetch(API_URL + ruta, {
            method: metodo,
            headers: cuerpo ? { "Content-Type": "application/json" } : {},
            body: cuerpo && JSON.stringify(cuerpo),
        });
    } catch (e) {
        avisar("No se pudo conectar con el servidor. ¿Está arrancado?");
        throw e;
    }
    const texto = await r.text();
    const datos = texto ? JSON.parse(texto) : null;
    if (!r.ok) {
        avisar("Error " + r.status + (datos?.message ? ": " + datos.message : ""));
        throw new Error("HTTP " + r.status);
    }
    $("aviso").className = "";
    return datos;
}

// El aviso de error ya lo muestra peticion(), por eso aquí se ignora el fallo
const enviar = (idForm, accion) =>
    $(idForm).addEventListener("submit", (e) => {
        e.preventDefault();
        accion().catch(() => {});
    });
const alPulsar = (idBoton, accion) => $(idBoton).addEventListener("click", () => accion().catch(() => {}));
const comoLista = (d) => (Array.isArray(d) ? d : d ? [d] : []);

// ---------- Ayudas para pintar ----------

// Pinta una tabla; con acciones = true añade Editar y Eliminar en cada fila
function pintar(idTabla, lista, celdas, acciones) {
    $(idTabla).replaceChildren(
        ...lista.map((item) => {
            const tr = document.createElement("tr");
            celdas(item).forEach((c) => {
                const td = document.createElement("td");
                td.textContent = c ?? "";
                tr.append(td);
            });
            if (acciones) {
                const td = document.createElement("td");
                td.className = "acciones";
                [["editar", "Editar", "sec"], ["eliminar", "Eliminar", "borrar"]].forEach(([accion, texto, clase]) => {
                    const b = document.createElement("button");
                    b.type = "button";
                    b.textContent = texto;
                    b.className = clase;
                    b.dataset.accion = accion;
                    b.dataset.id = item.id;
                    td.append(b);
                });
                tr.append(td);
            }
            return tr;
        })
    );
}

function llenarSelect(select, lista, etiqueta) {
    select.replaceChildren(new Option("Elige…", ""));
    lista.forEach((item) => select.add(new Option(etiqueta(item), item.id)));
}

// ---------- Crear, modificar y eliminar (el mismo formulario crea o modifica) ----------

function crud(c) {
    const form = $(c.form), id = $(c.id), guardar = $(c.guardar), cancelar = $(c.cancelar);
    const reiniciar = () => {
        form.reset();
        id.value = "";
        guardar.textContent = c.textoCrear;
        cancelar.hidden = true;
    };

    // POST /ruta (sin id) o PUT /ruta/{id} (con id)
    enviar(c.form, async () => {
        const modificar = id.value !== "";
        await peticion(modificar ? c.ruta + "/" + id.value : c.ruta, modificar ? "PUT" : "POST", c.datos());
        reiniciar();
        await c.cargar();
        avisar(modificar ? "Cambios guardados." : "Creado correctamente.", "ok");
    });

    cancelar.addEventListener("click", reiniciar);

    // Botones de cada fila
    $(c.tabla).addEventListener("click", async (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        try {
            if (b.dataset.accion === "eliminar") {
                if (!confirm("¿Eliminar?")) return;
                // DELETE /ruta/{id}: si tiene participaciones, el servidor responde con error y se avisa
                await peticion(c.ruta + "/" + b.dataset.id, "DELETE");
                await c.cargar();
                avisar("Eliminado correctamente.", "ok");
            } else {
                // Editar: GET /ruta/{id} (o la fila ya cargada) y se rellena el formulario
                const item = c.porId ? await peticion(c.ruta + "/" + b.dataset.id) : c.lista().find((x) => String(x.id) === b.dataset.id);
                id.value = item.id;
                c.rellenar(item);
                guardar.textContent = c.textoGuardar;
                cancelar.hidden = false;
                form.scrollIntoView();
            }
        } catch (e) { /* el aviso ya lo ha mostrado peticion() */ }
    });
}

// ======================================================
// VIDEOJUEGOS (solo crear, ver y buscar)
// ======================================================

const pintarVideojuegos = (lista) => pintar("tabla-videojuegos", lista, (v) => [v.id, v.nombre, v.genero]);

// GET /videojuegos
async function cargarVideojuegos() {
    const lista = await peticion("/videojuegos");
    pintarVideojuegos(lista);
    llenarSelect($("t-videojuego"), lista, (v) => v.nombre);
}

// POST /videojuegos
enviar("form-videojuego", async () => {
    await peticion("/videojuegos", "POST", { nombre: $("vj-nombre").value.trim(), genero: $("vj-genero").value.trim() });
    $("form-videojuego").reset();
    await cargarVideojuegos();
    avisar("Videojuego creado.", "ok");
});

// GET /videojuegos/buscar?nombre=
enviar("form-buscar-videojuego", async () => {
    const nombre = $("vj-buscar").value.trim();
    if (!nombre) return cargarVideojuegos();
    pintarVideojuegos(comoLista(await peticion("/videojuegos/buscar?nombre=" + encodeURIComponent(nombre))));
});

alPulsar("vj-todos", async () => {
    $("vj-buscar").value = "";
    await cargarVideojuegos();
});

// ======================================================
// TORNEOS
// ======================================================

const pintarTorneos = (lista) =>
    pintar("tabla-torneos", lista, (t) => [t.id, t.nombre, t.fecha, t.videojuego?.nombre, t.estado], true);

// GET /torneos
async function cargarTorneos() {
    const lista = await peticion("/torneos");
    pintarTorneos(lista);
    llenarSelect($("p-torneo"), lista, (t) => t.nombre);
}

// GET /torneos/estado/{estado}
enviar("form-filtro-torneo", async () => pintarTorneos(comoLista(await peticion("/torneos/estado/" + $("t-filtro").value))));
alPulsar("t-todos", cargarTorneos);

crud({
    ruta: "/torneos", form: "form-torneo", id: "t-id", guardar: "t-guardar", cancelar: "t-cancelar", tabla: "tabla-torneos",
    textoCrear: "Crear torneo", textoGuardar: "Guardar cambios", porId: true, cargar: cargarTorneos,
    datos: () => ({
        nombre: $("t-nombre").value.trim(),
        fecha: $("t-fecha").value,
        estado: $("t-estado").value,
        videojuego: { id: Number($("t-videojuego").value) },
    }),
    rellenar: (t) => {
        $("t-nombre").value = t.nombre;
        $("t-fecha").value = t.fecha?.slice(0, 10) ?? "";
        $("t-videojuego").value = t.videojuego?.id ?? "";
        $("t-estado").value = t.estado;
    },
});

// ======================================================
// JUGADORES
// ======================================================

const pintarJugadores = (lista) => pintar("tabla-jugadores", lista, (j) => [j.id, j.nick, j.email], true);

// GET /jugadores
async function cargarJugadores() {
    const lista = await peticion("/jugadores");
    pintarJugadores(lista);
    llenarSelect($("p-jugador"), lista, (j) => j.nick);
}

// GET /jugadores/buscar?nick=
enviar("form-buscar-jugador", async () => {
    const nick = $("j-buscar").value.trim();
    if (!nick) return cargarJugadores();
    pintarJugadores(comoLista(await peticion("/jugadores/buscar?nick=" + encodeURIComponent(nick))));
});

alPulsar("j-todos", async () => {
    $("j-buscar").value = "";
    await cargarJugadores();
});

crud({
    ruta: "/jugadores", form: "form-jugador", id: "j-id", guardar: "j-guardar", cancelar: "j-cancelar", tabla: "tabla-jugadores",
    textoCrear: "Crear jugador", textoGuardar: "Guardar cambios", porId: true, cargar: cargarJugadores,
    datos: () => ({ nick: $("j-nick").value.trim(), email: $("j-email").value.trim() }),
    rellenar: (j) => {
        $("j-nick").value = j.nick;
        $("j-email").value = j.email;
    },
});

// ======================================================
// PARTICIPACIONES
// ======================================================

let participaciones = [];

// GET /participaciones
async function cargarParticipaciones() {
    participaciones = await peticion("/participaciones");
    pintar("tabla-participaciones", participaciones, (p) => [p.id, p.torneo?.nombre, p.jugador?.nick, p.puesto], true);
}

crud({
    ruta: "/participaciones", form: "form-participacion", id: "p-id", guardar: "p-guardar", cancelar: "p-cancelar", tabla: "tabla-participaciones",
    textoCrear: "Inscribir", textoGuardar: "Guardar cambios", porId: false, lista: () => participaciones, cargar: cargarParticipaciones,
    datos: () => ({
        torneo: { id: Number($("p-torneo").value) },
        jugador: { id: Number($("p-jugador").value) },
        puesto: $("p-puesto").value ? Number($("p-puesto").value) : null,
    }),
    rellenar: (p) => {
        $("p-torneo").value = p.torneo?.id ?? "";
        $("p-jugador").value = p.jugador?.id ?? "";
        $("p-puesto").value = p.puesto ?? "";
    },
});

// Al abrir la página, las listas se cargan solas (sin botón «Ver»)
document.addEventListener("DOMContentLoaded", () => {
    Promise.allSettled([cargarVideojuegos(), cargarTorneos(), cargarJugadores(), cargarParticipaciones()]);
});