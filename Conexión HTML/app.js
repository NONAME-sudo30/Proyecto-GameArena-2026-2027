// GameArena · página pública (solo lectura): torneos y videojuegos

const API_URL = "http://localhost:8080";

const $ = (id) => document.getElementById(id);

function avisar(mensaje) {
    const aviso = $("aviso");
    aviso.textContent = mensaje;
    aviso.className = "visible";
}

function quitarAviso() {
    $("aviso").className = "";
}

// Todos los fetch pasan por aquí
async function peticion(ruta) {
    let respuesta;
    try {
        respuesta = await fetch(API_URL + ruta);
    } catch (e) {
        avisar("No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.");
        throw e;
    }
    if (!respuesta.ok) {
        avisar("El servidor respondió con un error (" + respuesta.status + ").");
        throw new Error("HTTP " + respuesta.status);
    }
    quitarAviso();
    return respuesta.json();
}

function crear(etiqueta, clase, texto) {
    const el = document.createElement(etiqueta);
    if (clase) el.className = clase;
    if (texto !== undefined) el.textContent = texto;
    return el;
}

// ---------- Torneos ----------

let participaciones = [];

const ETIQUETA_ESTADO = { ABIERTO: "Abierto", EN_CURSO: "En curso", FINALIZADO: "Finalizado" };

function pintarTorneos(lista) {
    const contenedor = $("lista-torneos");
    contenedor.replaceChildren();
    if (!lista.length) {
        contenedor.appendChild(crear("p", "vacio", "No hay torneos con este filtro."));
        return;
    }
    lista.forEach((t) => {
        const tarjeta = crear("article", "torneo " + t.estado);
        tarjeta.appendChild(crear("span", "estado", ETIQUETA_ESTADO[t.estado] ?? t.estado));
        tarjeta.appendChild(crear("h3", "", t.nombre));
        tarjeta.appendChild(crear("p", "juego", t.videojuego?.nombre ?? "Sin videojuego"));
        if (t.fecha) {
            tarjeta.appendChild(crear("p", "juego", new Date(t.fecha).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })));
        }

        const inscritos = participaciones.filter((p) => p.torneo?.id === t.id);
        tarjeta.appendChild(crear("p", "juego", inscritos.length === 1 ? "1 jugador inscrito" : inscritos.length + " jugadores inscritos"));
        if (inscritos.length) {
            const ul = crear("ul", "inscritos");
            inscritos.forEach((p) => ul.appendChild(crear("li", "", p.jugador?.nick ?? "Jugador")));
            tarjeta.appendChild(ul);
        }
        contenedor.appendChild(tarjeta);
    });
}

// GET /torneos  o  GET /torneos/estado/{estado}
async function cargarTorneos(estado = "") {
    const ruta = estado ? "/torneos/estado/" + estado : "/torneos";
    const lista = await peticion(ruta);
    pintarTorneos(lista);
}

// GET /participaciones
async function cargarParticipaciones() {
    participaciones = await peticion("/participaciones");
}

// ---------- Videojuegos ----------

function pintarVideojuegos(lista) {
    const contenedor = $("lista-videojuegos");
    contenedor.replaceChildren();
    if (!lista.length) {
        contenedor.appendChild(crear("p", "vacio", "No se ha encontrado ningún videojuego."));
        return;
    }
    lista.forEach((v) => {
        const tarjeta = crear("article", "videojuego");
        tarjeta.appendChild(crear("h3", "", v.nombre));
        tarjeta.appendChild(crear("p", "", v.genero));
        contenedor.appendChild(tarjeta);
    });
}

// GET /videojuegos  o  GET /videojuegos/buscar?nombre=
async function cargarVideojuegos(nombre = "") {
    const ruta = nombre ? "/videojuegos/buscar?nombre=" + encodeURIComponent(nombre) : "/videojuegos";
    pintarVideojuegos(await peticion(ruta));
}

// ---------- Eventos y carga inicial ----------

$("filtros").addEventListener("click", (e) => {
    const boton = e.target.closest("button");
    if (!boton) return;
    document.querySelectorAll("#filtros button").forEach((b) => b.setAttribute("aria-pressed", b === boton));
    cargarTorneos(boton.dataset.estado).catch(() => {});
});

$("form-buscar").addEventListener("submit", (e) => {
    e.preventDefault();
    cargarVideojuegos($("buscar").value.trim()).catch(() => {});
});

// Al abrir la página, todo se carga solo
document.addEventListener("DOMContentLoaded", async () => {
    try {
        await cargarParticipaciones();
    } catch (e) {
        participaciones = []; // si fallan, se muestran los torneos sin inscritos
    }
    cargarTorneos().catch(() => {});
    cargarVideojuegos().catch(() => {});
});