CREATE TABLE movies_favorites (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  duration INTEGER NOT NULL,
  price INTEGER NOT NULL
);


INSERT INTO 
	movies_favorites("name",description,duration,price);
VALUES ('Quebrando tudo', ' Filme loco', 160, 25);

