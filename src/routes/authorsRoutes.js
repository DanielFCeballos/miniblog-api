const express = require("express");
const authorsService = require("../services/authorsService");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const authors = await authorsService.getAllAuthors();

    res.status(200).json(authors);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: "id must be a number"
      });
    }

    const author = await authorsService.getAuthorById(id);

    if (!author) {
      return res.status(404).json({
        error: "author not found"
      });
    }

    res.status(200).json(author);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, bio } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        error: "name is required"
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        error: "email is required"
      });
    }

    const author = await authorsService.createAuthor({
      name: name.trim(),
      email: email.trim(),
      bio: bio ?? null
    });

    res.status(201).json(author);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        error: "email already exists"
      });
    }

    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: "id must be a number"
      });
    }

    const { name, email, bio } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        error: "name is required"
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        error: "email is required"
      });
    }

    const author = await authorsService.updateAuthor(id, {
      name: name.trim(),
      email: email.trim(),
      bio: bio ?? null
    });

    if (!author) {
      return res.status(404).json({
        error: "author not found"
      });
    }

    res.status(200).json(author);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        error: "email already exists"
      });
    }

    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: "id must be a number"
      });
    }

    const author = await authorsService.deleteAuthor(id);

    if (!author) {
      return res.status(404).json({
        error: "author not found"
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
