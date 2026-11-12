// GameArena · panel de administración: conexión con el servidor Spring Boot

const API_URL = "http://localhost:8080";
const $ = (id) => document.getElementById(id);

// ---------- Avisos y petición única (todos los fetch pasan por aquí) ----------

function avisar(texto, tipo = "danger") {
    $("aviso").textContent = texto;
    $("aviso").className = "alert alert-" + tipo;
    $("aviso").hidden = false;
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
    $("aviso").hidden = true;
    return datos;
}

// Envía un formulario: el aviso de error ya lo muestra peticion()
function enviar(idForm, accion) {
    $(idForm).addEventListener("submit", (e) => {
        e.preventDefault();
        accion().catch(() => {});
    });
}

// ---------- Ayudas para pintar ----------

function crear(etiqueta, clase, texto) {
    const el = document.createElement(etiqueta);
    el.className = clase;
    el.textContent = texto ?? "";
    return el;
}

// Fila de tabla; si lleva id, añade los botones Editar y Eliminar
function fila(celdas, id) {
    const tr = document.createElement("tr");
    celdas.forEach((c) => {
        const td = document.createElement("td");
        if (c instanceof Node) td.append(c);
        else td.textContent = c ?? "";
        tr.append(td);
    });
    if (id) {
        const td = document.createElement("td");
        [["editar", "Editar"], ["eliminar", "Eliminar"]].forEach(([accion, texto]) => {
            const b = crear("button", "btn btn-sm btn-primary me-1", texto);
            b.type = "button";
            b.dataset.accion = accion;
            b.dataset.id = id;
            td.append(b);
        });
        tr.append(td);
    }
    return tr;
}

function llenarSelect(select, lista, etiqueta) {
    while (select.options.length > 1) select.remove(1); // se conserva la primera opción
    lista.forEach((item) => select.add(new Option(etiqueta(item), item.id)));
}

// ---------- Pestañas ----------

const PESTANAS = ["Torneos", "Videojuegos", "Jugadores", "Inscripciones"];
PESTANAS.forEach((nombre) =>
    $("tab" + nombre).addEventListener("click", () =>
        PESTANAS.forEach((otro) => {
            $("panel" + otro).hidden = otro !== nombre;
            $("tab" + otro).classList.toggle("active", otro === nombre);
        })
    )
);

// ---------- Buscar por ID, crear, modificar y eliminar (torneos y jugadores) ----------

function gestionar(c) {
    const n = c.nombre, form = $("form" + n), idCampo = $(n.toLowerCase() + "Id");
    const crearBtn = $("btnCrear" + n), guardarBtn = $("btnGuardar" + n);
    const reiniciar = () => {
        form.reset();
        idCampo.value = "";
        crearBtn.hidden = false;
        guardarBtn.hidden = true;
    };

    // GET /ruta/{id}
    enviar("formBuscar" + n, async () => {
        const id = $("buscar" + n + "Id").value;
        if (!id) return c.cargar();
        c.pintar([await peticion(c.ruta + "/" + id)]);
    });

    // POST /ruta
    enviar("form" + n, async () => {
        await peticion(c.ruta, "POST", c.datos());
        reiniciar();
        await c.cargar();
    });

    // PUT /ruta/{id}
    guardarBtn.addEventListener("click", () => {
        if (!form.reportValidity()) return;
        peticion(c.ruta + "/" + idCampo.value, "PUT", c.datos())
            .then(() => { reiniciar(); return c.cargar(); })
            .catch(() => {});
    });

    // Botones de cada fila: Editar rellena el formulario, Eliminar hace DELETE /ruta/{id}
    $("cuerpo" + c.plural).addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        if (b.dataset.accion === "editar") {
            const item = c.lista().find((x) => String(x.id) === b.dataset.id);
            idCampo.value = item.id;
            c.rellenar(item);
            crearBtn.hidden = true;
            guardarBtn.hidden = false;
            form.scrollIntoView();
        } else if (confirm("¿Eliminar?")) {
            // Si tiene participaciones, el servidor responde con error y se avisa
            peticion(c.ruta + "/" + b.dataset.id, "DELETE").then(() => c.cargar()).catch(() => {});
        }
    });
}

// ======================================================
// TORNEOS
// ======================================================

let torneos = [];

const tarjeta = (t) => {
    const a = crear("article", "tarjeta p-3");
    a.append(
        crear("span", "badge text-dark estado-" + t.estado.toLowerCase(), t.estado),
        crear("h3", "h5 mt-2", t.nombre),
        crear("p", "mb-0", t.videojuego?.nombre ?? "Sin videojuego")
    );
    return a;
};
const pintarFila = (id, lista) => $(id).replaceChildren(...lista.map(tarjeta));

// Portada (filas de tarjetas) y tabla de gestión
function pintarTorneos(lista) {
    pintarFila("filaPopular", lista.slice(0, 6));
    pintarFila("filaAbiertos", lista.filter((t) => t.estado === "ABIERTO"));
    ["Fortnite", "Valorant", "Kimetsu", "Minecraft"].forEach((juego) =>
        pintarFila("fila" + juego, lista.filter((t) => t.videojuego?.nombre?.toLowerCase().includes(juego.toLowerCase())))
    );
    $("cuerpoTorneos").replaceChildren(...lista.map((t) => fila([t.id, t.nombre, t.videojuego?.nombre, t.estado], t.id)));
}

// GET /torneos
async function cargarTorneos() {
    torneos = await peticion("/torneos");
    pintarTorneos(torneos);
    llenarSelect($("inscTorneo"), torneos, (t) => t.nombre);
}

// GET /torneos/estado/{estado}; si hay videojuego, también se filtra por él
enviar("formFiltroTorneos", async () => {
    const estado = $("filtroEstado").value, juego = $("filtroVideojuego").value;
    let lista = await peticion(estado ? "/torneos/estado/" + estado : "/torneos");
    if (juego) lista = lista.filter((t) => String(t.videojuego?.id) === juego);
    pintarTorneos(lista);
});

gestionar({
    nombre: "Torneo", plural: "Torneos", ruta: "/torneos", cargar: cargarTorneos, pintar: pintarTorneos, lista: () => torneos,
    datos: () => ({ nombre: $("torneoNombre").value.trim(), estado: $("torneoEstado").value, videojuego: { id: Number($("torneoVideojuego").value) } }),
    rellenar: (t) => {
        $("torneoNombre").value = t.nombre;
        $("torneoVideojuego").value = t.videojuego?.id ?? "";
        $("torneoEstado").value = t.estado;
    },
});

// ======================================================
// VIDEOJUEGOS (solo crear, ver y buscar)
// ======================================================

function pintarVideojuegos(lista) {
    $("cuerpoVideojuegos").replaceChildren(
        ...lista.map((v) => {
            let imagen = "—";
            if (v.imagen) {
                imagen = crear("img", "img-thumbnail");
                imagen.src = v.imagen;
                imagen.alt = v.nombre;
                imagen.width = 60;
            }
            return fila([v.id, imagen, v.nombre, v.genero]);
        })
    );
}

// GET /videojuegos
async function cargarVideojuegos() {
    const lista = await peticion("/videojuegos");
    pintarVideojuegos(lista);
    llenarSelect($("filtroVideojuego"), lista, (v) => v.nombre);
    llenarSelect($("torneoVideojuego"), lista, (v) => v.nombre);
}

// GET /videojuegos/{id}
enviar("formBuscarJuego", async () => {
    const id = $("buscarJuegoId").value;
    if (!id) return cargarVideojuegos();
    pintarVideojuegos([await peticion("/videojuegos/" + id)]);
});

// POST /videojuegos
enviar("formJuego", async () => {
    await peticion("/videojuegos", "POST", { nombre: $("juegoNombre").value.trim(), genero: $("juegoGenero").value.trim() });
    $("formJuego").reset();
    await cargarVideojuegos();
});

// ======================================================
// JUGADORES
// ======================================================

let jugadores = [];

const pintarJugadores = (lista) =>
    $("cuerpoJugadores").replaceChildren(...lista.map((j) => fila([j.id, j.nick, j.email], j.id)));

// GET /jugadores
async function cargarJugadores() {
    jugadores = await peticion("/jugadores");
    pintarJugadores(jugadores);
    llenarSelect($("inscJugador"), jugadores, (j) => j.nick);
}

gestionar({
    nombre: "Jugador", plural: "Jugadores", ruta: "/jugadores", cargar: cargarJugadores, pintar: pintarJugadores, lista: () => jugadores,
    datos: () => ({ nick: $("jugadorNick").value.trim(), email: $("jugadorEmail").value.trim() }),
    rellenar: (j) => {
        $("jugadorNick").value = j.nick;
        $("jugadorEmail").value = j.email;
    },
});

// ======================================================
// INSCRIPCIONES
// ======================================================

// POST /participaciones
enviar("formInscripcion", async () => {
    await peticion("/participaciones", "POST", { jugador: { id: Number($("inscJugador").value) }, torneo: { id: Number($("inscTorneo").value) } });
    $("formInscripcion").reset();
    avisar("Jugador inscrito correctamente.", "success");
});

// GET /participaciones, filtradas en la página por torneo o por jugador
function consultar(idForm, idInput, idCuerpo, campo, mostrar) {
    enviar(idForm, async () => {
        const lista = await peticion("/participaciones");
        const filtradas = lista.filter((p) => String(p[campo]?.id) === $(idInput).value);
        $(idCuerpo).replaceChildren(...filtradas.map((p) => fila([p.id, mostrar(p)])));
    });
}
consultar("formParticipantes", "partTorneoId", "cuerpoParticipantes", "torneo", (p) => p.jugador?.nick);
consultar("formTorneosJugador", "partJugadorId", "cuerpoTorneosJugador", "jugador", (p) => p.torneo?.nombre);

// Al abrir la página, las listas se cargan solas
document.addEventListener("DOMContentLoaded", () => {
    Promise.allSettled([cargarVideojuegos(), cargarJugadores(), cargarTorneos()]);
});