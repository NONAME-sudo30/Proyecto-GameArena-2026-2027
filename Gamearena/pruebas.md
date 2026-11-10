# Pruebas de GameArena (Postman)

Pruebas simples para comprobar la API. Se supone que la aplicación está arrancada en `http://localhost:8080` y que la base de datos está vacía (los ids empiezan en 1).

En los `POST` y `PUT`: pestaña **Body** → **raw** → **JSON**.

> Haz una captura de cada prueba (petición + respuesta) para la documentación.

---

## 1. Videojuegos

### 1.1 Crear videojuego
- **POST** `/videojuegos`
```json
{ "nombre": "Valorant", "genero": "Shooter" }
```
- **Esperado:** 200 y el JSON con `id: 1`.

Crea también estos dos (datos mínimos: 3 videojuegos):
```json
{ "nombre": "League of Legends", "genero": "MOBA" }
```
```json
{ "nombre": "Rocket League", "genero": "Deportes" }
```

### 1.2 Listar videojuegos
- **GET** `/videojuegos`
- **Esperado:** 200 y una lista con los 3 videojuegos.

### 1.3 Buscar videojuego por id
- **GET** `/videojuegos/1`
- **Esperado:** 200 y Valorant.

### 1.4 Buscar un videojuego que no existe
- **GET** `/videojuegos/99`
- **Esperado:** 404.

---

