require("dotenv").config();

const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../src/app");
const pool = require("../src/db/pool");

let testAuthorId;
let testPostId;

const testEmail = "testing.miniblog@example.com";

before(async () => {
  // Limpiar posibles datos de una ejecución anterior
  await pool.query(
    "DELETE FROM posts WHERE author_id IN (SELECT id FROM authors WHERE email = $1)",
    [testEmail]
  );

  await pool.query(
    "DELETE FROM authors WHERE email = $1",
    [testEmail]
  );
});

after(async () => {
  // Limpiar datos creados por los tests
  await pool.query(
    "DELETE FROM posts WHERE author_id IN (SELECT id FROM authors WHERE email = $1)",
    [testEmail]
  );

  await pool.query(
    "DELETE FROM authors WHERE email = $1",
    [testEmail]
  );

  await pool.end();
});


test("GET /authors devuelve status 200 y un array", async () => {
  const response = await request(app)
    .get("/authors");

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body));
});

test("POST /authors crea un autor", async () => {
  const response = await request(app)
    .post("/authors")
    .send({
      name: "Autor Testing",
      email: testEmail,
      bio: "Autor creado por Supertest"
    });

  assert.equal(response.status, 201);
  assert.equal(response.body.name, "Autor Testing");
  assert.equal(response.body.email, testEmail);

  testAuthorId = response.body.id;
});

test("POST /authors rechaza un nombre vacío", async () => {
  const response = await request(app)
    .post("/authors")
    .send({
      name: "",
      email: "invalid.testing@example.com",
      bio: "No debería crearse"
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.error, "name is required");
});

test("GET /authors/:id devuelve el autor creado", async () => {
  const response = await request(app)
    .get(`/authors/${testAuthorId}`);

  assert.equal(response.status, 200);
  assert.equal(response.body.id, testAuthorId);
  assert.equal(response.body.email, testEmail);
});

test("GET /authors/:id devuelve 404 si no existe", async () => {
  const response = await request(app)
    .get("/authors/999999");

  assert.equal(response.status, 404);
  assert.equal(response.body.error, "author not found");
});

test("POST /posts crea un post relacionado con el autor", async () => {
  const response = await request(app)
    .post("/posts")
    .send({
      author_id: testAuthorId,
      title: "Post creado por testing",
      content: "Contenido generado durante las pruebas automatizadas.",
      published: true
    });
  assert.equal(response.status, 201);
  assert.equal(response.body.author_id, testAuthorId);
  assert.equal(response.body.title, "Post creado por testing");

  testPostId = response.body.id;
});

test("GET /posts/author/:authorId devuelve posts con detalle del autor", async () => {
  const response = await request(app)
    .get(`/posts/author/${testAuthorId}`);

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body));
  assert.ok(response.body.length > 0);

  assert.equal(response.body[0].author_id, testAuthorId);

  assert.ok(response.body[0].author);
  assert.equal(response.body[0].author.id, testAuthorId);
  assert.equal(response.body[0].author.email, testEmail);
});

test("POST /posts rechaza un author_id inexistente", async () => {
  const response = await request(app)
    .post("/posts")
    .send({
      author_id: 999999,
      title: "Post inválido",
      content: "No debería crearse",
      published: true
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.error, "author does not exist");
});

test("GET /posts/:id devuelve el post creado", async () => {
  const response = await request(app)
    .get(`/posts/${testPostId}`);

  assert.equal(response.status, 200);
  assert.equal(response.body.id, testPostId);
  assert.equal(response.body.author_id, testAuthorId);
});

test("PUT /posts/:id actualiza un post", async () => {
  const response = await request(app)
    .put(`/posts/${testPostId}`)
    .send({
      author_id: testAuthorId,
      title: "Post actualizado por testing",
      content: "Contenido actualizado durante las pruebas automatizadas.",
      published: false
    });

  assert.equal(response.status, 200);
  assert.equal(response.body.id, testPostId);
  assert.equal(response.body.title, "Post actualizado por testing");
  assert.equal(response.body.published, false);
});

test("DELETE /posts/:id elimina un post", async () => {
  const response = await request(app)
    .delete(`/posts/${testPostId}`);

  assert.equal(response.status, 204);

  const getResponse = await request(app)
    .get(`/posts/${testPostId}`);

  assert.equal(getResponse.status, 404);
  assert.equal(getResponse.body.error, "post not found");
});
