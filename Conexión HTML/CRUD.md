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

### Modelo JSON DE JUGADORES
```json
{
  "id": 101,
  "nickname": "ShadowSlayer",
  "email": "carlos.perez@ejemplo.com",
  
```

### Endpoints

| Método | Endpoint                    | Descripción | Código Éxito |
| :--- |:----------------------------| :--- | :--- |
| **POST** | `/localhost:8080/jugadores` | Crear el perfil de un nuevo jugador. | `201 Created` |
| **GET** | `/localhost:8080/jugadores`            | Obtener el listado completo de jugadores. | `200 OK` |
| **GET** | `/localhost:8080/jugadores/{id}`       | Consultar el perfil de un jugador por su ID. | `200 OK` |

**POST**
![POST JUGADORES](../../../Pictures/Screenshots/Captura%20de%20pantalla%202026-11-13%20174438.png)
**GET**
![GET JUGADORES](../../../Pictures/Screenshots/Captura%20de%20pantalla%202026-11-13%20174723.png)
**GET ID**
![GET ID](../../../Pictures/Screenshots/Captura%20de%20pantalla%202026-11-13%20174908.png)
## 4. CRUD: Torneos (`/Localhost:8080/torneos`)

### Modelo JSON de torneos
```json
{
  "nombre": "Copa de Invierno 2026",
  "videojuego_id": 1,
  "fecha": "2026-12-01",
  "premio": 1500.00,
  "estado": "ABIERTO"
}
```

### Endpoints

| Método | Endpoint                  | Descripción | Código Éxito |
| :--- |:--------------------------| :--- | :--- |
| **POST** | `/localhost:8080/torneos` | Crear un nuevo torneo asociado a un `videojuego_id`. | `201 Created` |
| **GET** | `/localhost:8080/torneos`            | Listar todos los torneos (admite filtros por estado o juego). | `200 OK` |
| **GET** | `/localhost:8080/torneos/{id}`       | Obtener detalles del torneo y su videojuego asociado. | `200 OK` |

**GET**
![GET](../../../Pictures/Screenshots/Captura%20de%20pantalla%202026-11-13%20175523.png)
**POST**
![POST ](../../../Pictures/Screenshots/Captura%20de%20pantalla%202026-11-13%20175820.png)
**GET ID**
![GET ID](../../../Pictures/Screenshots/Captura%20de%20pantalla%202026-11-13%20183732.png)

---

## 5. Gestión de Inscripciones (Relación Torneo - Jugador)

| Método | Endpoint                                          | Descripción | Código Éxito |
| :--- |:--------------------------------------------------| :--- | :--- |
| **POST** | `/Localhost:8080/torneos/{id_torneo}/jugadores`   | Inscribir un jugador al torneo (Body: `{"jugador_id": 101}`). | `201 Created` |
| **GET** | `/Localhost:8080/torneos/{id_torneo}/jugadores`              | Listar todos los jugadores inscritos en un torneo. | `200 OK` |
| **GET** | `/Localhost:8080/jugadores/{id_jugador}/torneos`             | Listar todos los torneos en los que participa un jugador. | `200 OK` |

**GET TORNEOS EN VIDEOJUEGOS**
![Torneos con videojuegos 3](../../../Pictures/Screenshots/Captura%20de%20pantalla%202026-11-13%20184309.png)
**POST INCRIBIR JUGADOR EN TORNEO**
![Inscribir](../../../Pictures/Screenshots/Captura%20de%20pantalla%202026-11-13%20184602.png)
---
## 6. Códigos de Error Comunes

* **`400 Bad Request`:** Datos enviados inválidos (ej. intentar crear un torneo sin `videojuego_id` o con fecha de fin anterior a la de inicio).
* **`404 Not Found`:** El ID del torneo, jugador o videojuego no existe.
* **`409 Conflict`:** El jugador ya está inscrito en el torneo o el torneo ya alcanzó su `max_jugadores`.