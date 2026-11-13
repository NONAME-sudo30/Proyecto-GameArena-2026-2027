# Documentación de API - CRUD: Torneos, Jugadores y Videojuegos

Este documento detalla la estructura de datos y los endpoints necesarios para gestionar las operaciones **CRUD** (Create, Read, Update, Delete) de un sistema de torneos de esports.

---

## 1. Modelo de Datos (Entidades y Relaciones)

* **Videojuego:El juego en el que se compite. muchos a uno(Muchos videojuegos pueden tener un torneo**)
* **Torneo:** El evento competitivo.  un Torneo puede tener muchos jugadores
* **Jugador:** El usuario participante. ** Relación uno a muchos($N:M$).


---

## 2. CRUD: Videojuegos (`/Localhost:8080/videojuegos`)

### Modelo JSON de los datos de videojuegos
```json
{
  "id": 1,
  "nombre": "Valorant",
  "genero": "Shooter Táctico",
  "plataforma": "PC",
  "desarrollador": "Riot Games"
}
```

### Endpoints

| Método | Endpoint                           | Descripción | Código Éxito |
| :--- |:-----------------------------------| :--- | :--- |
| **POST** | `/Localhost:8080/videojuegos`      | Registrar un nuevo videojuego. | `201 Created` |
| **GET** | `/Localhost:8080/videojuegos`      | Listar todos los videojuegos disponibles. | `200 OK` |
| **GET** | `/Localhost:8080/videojuegos/{id}` | Obtener detalles de un videojuego específico. | `200 OK` |
| **PUT** | `/Localhost:8080/videojuegos/{id}` | Actualizar la información de un videojuego. | `200 OK` |
| **DELETE** | `/localhost:8080/videojuegos/{id}` | Eliminar un videojuego del sistema. | `204 No Content` |

### Capturas Ejemplos 01

**POST**
![Post Videojuegos](![Captura de pantalla 2026-11-13 172541.png](../../../Pictures/Screenshots/Captura%20de%20pantalla%202026-11-13%20172541.png))
**GET**
![Get Videojuegos](../../../Pictures/Screenshots/Captura%20de%20pantalla%202026-11-13%20172910.png)
**GET ID**
![GET ID](../../../Pictures/Screenshots/Captura%20de%20pantalla%202026-11-13%20173707.png)
---

## 3. CRUD: Jugadores (`/Localhost:8080/jugadores`)

### Modelo JSON
```json
{
  "id": 101,
  "nickname": "ShadowSlayer",
  "nombre_real": "Carlos Pérez",
  "email": "carlos.perez@ejemplo.com",
  "pais": "España",
  "fecha_registro": "2026-11-13"
}
```

### Endpoints

| Método | Endpoint | Descripción | Código Éxito |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/jugadores` | Crear el perfil de un nuevo jugador. | `201 Created` |
| **GET** | `/api/jugadores` | Obtener el listado completo de jugadores. | `200 OK` |
| **GET** | `/api/jugadores/{id}` | Consultar el perfil de un jugador por su ID. | `200 OK` |
| **PUT** | `/api/jugadores/{id}` | Modificar datos de un jugador (ej. cambiar nickname). | `200 OK` |
| **DELETE** | `/api/jugadores/{id}` | Dar de baja / eliminar un jugador. | `204 No Content` |

---

## 4. CRUD: Torneos (`/api/torneos`)

### Modelo JSON
```json
{
  "id": 500,
  "nombre": "Copa de Invierno 2026",
  "videojuego_id": 1,
  "fecha_inicio": "2026-12-01T18:00:00Z",
  "fecha_fin": "2026-12-15T22:00:00Z",
  "premio_total": 1500.00,
  "max_jugadores": 32,
  "estado": "ABIERTO"
}
```

### Endpoints

| Método | Endpoint | Descripción | Código Éxito |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/torneos` | Crear un nuevo torneo asociado a un `videojuego_id`. | `201 Created` |
| **GET** | `/api/torneos` | Listar todos los torneos (admite filtros por estado o juego). | `200 OK` |
| **GET** | `/api/torneos/{id}` | Obtener detalles del torneo y su videojuego asociado. | `200 OK` |
| **PUT** | `/api/torneos/{id}` | Actualizar fechas, premios o estado del torneo. | `200 OK` |
| **DELETE** | `/api/torneos/{id}` | Cancelar y eliminar un torneo. | `204 No Content` |

---

## 5. Gestión de Inscripciones (Relación Torneo - Jugador)

Para gestionar la relación muchos a muchos ($N:M$) entre **Torneos** y **Jugadores**, se utilizan rutas anidadas:

| Método | Endpoint | Descripción | Código Éxito |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/torneos/{id_torneo}/jugadores` | Inscribir un jugador al torneo (Body: `{"jugador_id": 101}`). | `201 Created` |
| **GET** | `/api/torneos/{id_torneo}/jugadores` | Listar todos los jugadores inscritos en un torneo. | `200 OK` |
| **GET** | `/api/jugadores/{id_jugador}/torneos` | Listar todos los torneos en los que participa un jugador. | `200 OK` |
| **DELETE** | `/api/torneos/{id_torneo}/jugadores/{id_jugador}` | Desinscribir o expulsar a un jugador de un torneo. | `204 No Content` |

---

## 6. Códigos de Error Comunes

* **`400 Bad Request`:** Datos enviados inválidos (ej. intentar crear un torneo sin `videojuego_id` o con fecha de fin anterior a la de inicio).
* **`404 Not Found`:** El ID del torneo, jugador o videojuego no existe.
* **`409 Conflict`:** El jugador ya está inscrito en el torneo o el torneo ya alcanzó su `max_jugadores`.