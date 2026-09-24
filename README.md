# MiniBlog API

API REST desarrollada con Node.js, Express y PostgreSQL para gestionar autores y publicaciones de un MiniBlog.

El proyecto permite realizar operaciones CRUD sobre autores y posts, mantiene una relación 1:N entre ambas entidades, utiliza consultas SQL parametrizadas, validaciones, manejo de errores y pruebas automatizadas.

## Tecnologías utilizadas

- Node.js
- Express
- PostgreSQL
- pg
- dotenv
- Supertest
- Node.js Test Runner
- OpenAPI 3.0

## Modelo de datos

La aplicación utiliza dos entidades principales:

### Authors

- `id`: clave primaria
- `name`: nombre del autor
- `email`: email único
- `bio`: biografía opcional
- `created_at`: fecha de creación

### Posts

- `id`: clave primaria
- `author_id`: clave foránea hacia `authors.id`
- `title`: título del post
- `content`: contenido
- `published`: estado de publicación
- `created_at`: fecha de creación

La relación entre las entidades es:

```text
authors
   1
   |
   |
   N
 posts
```

Un autor puede tener muchos posts y cada post pertenece a un autor.

## Requisitos previos

Para ejecutar el proyecto localmente se necesita:

- Node.js
- npm
- PostgreSQL

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/DanielFCeballos/miniblog-api.git
```

Entrar en la carpeta:

```bash
cd miniblog-api
```

Instalar las dependencias:

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

Ejemplo:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=miniblog_db
```

El archivo `.env` contiene información local y no debe subirse al repositorio.

## Base de datos

Crear una base de datos PostgreSQL llamada:

```text
miniblog_db
```

Después ejecutar el script de creación de tablas:

```bash
psql -U postgres -d miniblog_db -f sql/setup.sql
```

Para cargar los datos iniciales:

```bash
psql -U postgres -d miniblog_db -f sql/seed.sql
```

El esquema incluye claves primarias, clave foránea, restricciones `NOT NULL` y email `UNIQUE`.

## Ejecutar la aplicación

Iniciar el servidor:

```bash
npm start
```

Por defecto, la API estará disponible en:

```text
http://localhost:3000
```

Para comprobar que funciona:

```bash
curl http://localhost:3000/
```

Respuesta esperada:

```json
{
  "message": "MiniBlog API is running"
}
```

## Endpoints

### Authors

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/authors` | Obtener todos los autores |
| GET | `/authors/:id` | Obtener un autor por ID |
| POST | `/authors` | Crear un autor |
| PUT | `/authors/:id` | Actualizar un autor |
| DELETE | `/authors/:id` | Eliminar un autor |

### Posts

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/posts` | Obtener todos los posts |
| GET | `/posts/:id` | Obtener un post por ID |
| GET | `/posts/author/:authorId` | Obtener posts de un autor |
| POST | `/posts` | Crear un post |
| PUT | `/posts/:id` | Actualizar un post |
| DELETE | `/posts/:id` | Eliminar un post |

## Ejemplos de uso

### Crear un autor

```bash
curl -X POST http://localhost:3000/authors \
  -H "Content-Type: application/json" \
  -d '{"name":"Pedro Ruiz","email":"pedro.ruiz@example.com","bio":"Autor del MiniBlog"}'
```

Respuesta exitosa:

```text
201 Created
```

### Crear un post

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"author_id":1,"title":"Mi nuevo post","content":"Contenido del post","published":true}'
```

Respuesta exitosa:

```text
201 Created
```

## Validaciones y manejo de errores

La API valida, entre otros casos:

- campos obligatorios
- IDs numéricos
- email único para autores
- existencia del autor asociado a un post
- recursos inexistentes

Códigos HTTP utilizados:

- `200 OK`
- `201 Created`
- `204 No Content`
- `400 Bad Request`
- `404 Not Found`
- `500 Internal Server Error`

Los errores inesperados son enviados a un middleware global de manejo de errores.

## Consultas parametrizadas

Las consultas SQL utilizan parámetros en lugar de concatenar directamente datos recibidos del usuario.

Ejemplo:

```js
const result = await pool.query(
  "SELECT id, name, email, bio, created_at FROM authors WHERE id = $1",
  [id]
);
```

Esto evita insertar directamente valores del usuario dentro de la sentencia SQL.

## Pruebas automatizadas

El proyecto utiliza Supertest y el test runner nativo de Node.js.

Ejecutar:

```bash
npm test
```

Actualmente la suite contiene 8 pruebas automatizadas que cubren casos exitosos y casos de error.

Resultado esperado:

```text
tests 8
pass 8
fail 0
```

Entre los casos probados se encuentran:

- listado de autores
- creación de autores
- validación de campos obligatorios
- búsqueda por ID
- recurso inexistente
- creación de posts
- validación de foreign key
- consulta de posts por ID

## Documentación OpenAPI

La especificación OpenAPI se encuentra en:

```text
docs/openapi.yaml
```

Puede validarse con:

```bash
npx @redocly/cli lint docs/openapi.yaml
```

La especificación documenta los endpoints de Authors y Posts, sus parámetros, cuerpos de petición, respuestas y schemas.


## Deploy

El proyecto está desplegado en Railway.

### Configuración en Railway

Para realizar el despliegue se utilizó:

- Un servicio PostgreSQL en Railway.
- Un servicio `miniblog-api` conectado al repositorio de GitHub.
- La variable de entorno `DATABASE_URL`, configurada mediante la referencia `${{Postgres.DATABASE_URL}}`.
- El comando de inicio `npm start`.
- Las tablas y datos iniciales se cargaron utilizando `sql/setup.sql` y `sql/seed.sql`.

### URLs del servicio

URL interna de Railway:

```text
miniblog-api.railway.internal
```

URL pública de producción:

```text
https://miniblog-api-production-6d45.up.railway.app
```

### Endpoints públicos de prueba

```text
GET https://miniblog-api-production-6d45.up.railway.app/
GET https://miniblog-api-production-6d45.up.railway.app/authors
GET https://miniblog-api-production-6d45.up.railway.app/posts
```


## Evidencias 

Durante el desarrollo se recopilaron evidencias de:

- esquema de PostgreSQL
- datos iniciales
- conexión Node.js + PostgreSQL
- servidor Express
- endpoints CRUD
- códigos HTTP
- validaciones
- restricciones de integridad
- foreign key
- pruebas automatizadas
- validación de OpenAPI

Las capturas se encuentran en:

```text
docs/evidencias/
```

## Uso de Inteligencia Artificial

Durante el desarrollo se utilizó inteligencia artificial como herramienta de apoyo para:

- comprender conceptos de Node.js, Express y PostgreSQL
- revisar la estructura del proyecto
- proponer casos de prueba
- apoyar la depuración de errores
- revisar consultas SQL parametrizadas
- apoyar la documentación OpenAPI
- revisar documentación del proyecto

Las sugerencias generadas fueron verificadas mediante ejecución local, consultas a PostgreSQL, pruebas manuales con `curl` y pruebas automatizadas.

### Ejemplos de prompts utilizados

- "Explícame de forma sencilla qué es un endpoint."
- "¿Cómo puedo comprobar el status HTTP de una respuesta usando curl?"
- "Ayúdame a validar que un email no se repita en PostgreSQL."
- "¿Cómo pruebo una foreign key al crear un post?"
- "Ayúdame a crear pruebas automatizadas para los endpoints de mi API."
- "Ayúdame a documentar una API REST usando OpenAPI y YAML."

## Estructura del proyecto

```text
miniblog-api/
├── docs/
│   ├── evidencias/
│   └── openapi.yaml
├── sql/
│   ├── setup.sql
│   └── seed.sql
├── src/
│   ├── db/
│   │   ├── pool.js
│   │   └── testConnection.js
│   ├── middlewares/
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authorsRoutes.js
│   │   └── postsRoutes.js
│   ├── services/
│   │   ├── authorsService.js
│   │   └── postsService.js
│   ├── app.js
│   └── server.js
├── tests/
│   └── api.test.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Autor

Proyecto Integrador - Módulo 2  
SoyHenry