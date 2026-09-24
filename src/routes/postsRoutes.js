const express = require("express");
const postsService = require("../services/postsService");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const posts = await postsService.getAllPosts();

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

router.get("/author/:authorId", async (req, res, next) => {
  try {
    const authorId = Number(req.params.authorId);

    if (Number.isNaN(authorId)) {
      return res.status(400).json({
        error: "authorId must be a number"
      });
    }

    const posts = await postsService.getPostsByAuthorId(authorId);

    res.status(200).json(posts);
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

    const post = await postsService.getPostById(id);

    if (!post) {
      return res.status(404).json({
        error: "post not found"
      });
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { author_id, title, content, published } = req.body;

    if (author_id === undefined || author_id === null) {
      return res.status(400).json({
        error: "author_id is required"
      });
    }

    const authorId = Number(author_id);

    if (Number.isNaN(authorId)) {
      return res.status(400).json({
        error: "author_id must be a number"
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        error: "title is required"
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        error: "content is required"
      });
    }

    const post = await postsService.createPost({
      authorId,
      title: title.trim(),
      content: content.trim(),
      published: published ?? false
    });

    res.status(201).json(post);
  } catch (error) {
    if (error.code === "23503") {
      return res.status(400).json({
        error: "author does not exist"
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

    const { author_id, title, content, published } = req.body;

    if (author_id === undefined || author_id === null) {
      return res.status(400).json({
        error: "author_id is required"
      });
    }

    const authorId = Number(author_id);

    if (Number.isNaN(authorId)) {
      return res.status(400).json({
        error: "author_id must be a number"
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        error: "title is required"
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        error: "content is required"
      });
    }

    const post = await postsService.updatePost(id, {
      authorId,
      title: title.trim(),
      content: content.trim(),
      published: published ?? false
    });

    if (!post) {
      return res.status(404).json({
        error: "post not found"
      });
    }

    res.status(200).json(post);
  } catch (error) {
    if (error.code === "23503") {
      return res.status(400).json({
        error: "author does not exist"
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

    const post = await postsService.deletePost(id);

    if (!post) {
      return res.status(404).json({
        error: "post not found"
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});


module.exports = router;