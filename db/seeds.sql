Use gatchitoma;

INSERT INTO `users` 
(`
email`,
`password
`, `online`, `createdAt`, `updatedAt`)
VALUES
('test1@test.com','$2a$10$na/uI9OgjtAaDfD7LNuXGOoAlfWJbZhpxPcGjewSloybIPKQGNiYG',0, now
(), now
());

INSERT INTO `users` 
(`
email`,
`password
`, `online`, `createdAt`, `updatedAt`)
VALUES
('user2@gmail.com','$10$.FuAgnSFyIVYMsegz95IBe3bLMdR0AuMX/.8L9IF/rnZA3MZIlRLW',0, now
(), now
());

/*This assumes that a user with userid 1 already exists in database*/
INSERT INTO PETS
    (name, type, stage, UserId, createdAt, updatedAt)
Values
    ('Floofers', 1, 2, 1, now(), now());
/*This assumes that a user with userid 2 already exists in database*/
INSERT INTO PETS
    (name, type, stage, UserId, createdAt, updatedAt)
Values
    ('Snowball', 2, 1, 2, now(), now());