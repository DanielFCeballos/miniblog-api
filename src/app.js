const express = require("express");
const authorsRoutes = require("./routes/authorsRoutes");
const postsRoutes = require("./routes/postsRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middleware para leer JSON enviado en el body
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.status(200).json({
    message: "MiniBlog API is running"
  });
});

// Rutas de authors
app.use("/authors", authorsRoutes);

// Rutas de posts
app.use("/posts", postsRoutes);

// Middleware global de errores
app.use(errorHandler);

module.exports = app;
