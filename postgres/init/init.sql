CREATE TABLE "Users"(
    "Id" SERIAL PRIMARY KEY,
    "Username" VARCHAR(50) UNIQUE NOT NULL,
    "Email" VARCHAR(50) UNIQUE NOT NULL,
    "Password_hash" TEXT NOT NULL,
    "Role" VARCHAR(20) NOT NULL DEFAULT('user')
);

INSERT INTO "Users" ("Username", "Email", "Password_hash", "Role") 
VALUES 
('admin', 'admin@helpdesk.local', '$2a$11$wv26IOqtEpBTHsX5KB4MfuFJOnKZ/ZJQHCWBoSXi5aS39KTEoV.4O', 'admin'),
('user', 'user@helpdesk.local', '$2a$11$XJkQO5cO3I72W6kGzFp6vO5iN7FfeZzY6bTuxrV7NnDe/iFWhr3vC', 'user')
ON CONFLICT ("Username") DO NOTHING;