INSERT INTO authors (name, email, bio)
VALUES
  ('Ana Torres', 'ana.torres@example.com', 'Desarrolladora backend y autora de tecnología.'),
  ('Carlos Méndez', 'carlos.mendez@example.com', 'Apasionado por bases de datos y desarrollo web.'),
  ('Laura Gómez', 'laura.gomez@example.com', 'Escritora sobre programación y aprendizaje.');

INSERT INTO posts (author_id, title, content, published)
VALUES
  (1, 'Introducción a Node.js', 'Node.js permite ejecutar JavaScript del lado del servidor.', TRUE),
  (1, 'Primeros pasos con Express', 'Express facilita la creación de servidores y APIs con Node.js.', TRUE),
  (2, 'Aprendiendo PostgreSQL', 'PostgreSQL es un sistema gestor de bases de datos relacional.', TRUE),
  (3, 'Mi experiencia aprendiendo backend', 'En este post comparto algunos aprendizajes sobre desarrollo backend.', FALSE);