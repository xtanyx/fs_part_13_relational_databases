CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

insert into blogs (author, url, title) values ('John Doe', 'johndoe@test.com', 'John Doe Blog');

insert into blogs (author, url, title, likes) values ('Jane Doe', 'www.jane1234.example.fi', 'Jane test blog', 5);

select * from blogs;