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
('user', 'user@helpdesk.local', '$2a$11$WK03fcdiHEcnjO1E8/zo9eYWfqxUdEhfVn6lEU/bwnMsyZ9Fgv8hC', 'user')
ON CONFLICT ("Username") DO NOTHING;

CREATE TABLE "Tickets"(
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(100) NOT NULL,
    "Description" TEXT NOT NULL,
    "Category" VARCHAR(50) NOT NULL,
    "Priority" VARCHAR(20) NOT NULL DEFAULT('low'),
    "Tags" VARCHAR(100),
    "Status" VARCHAR(20) NOT NULL DEFAULT('new'),
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ClosedAt" TIMESTAMP,
    "AuthorId" INT NOT NULL,
    "AssignedAdminId" INT
);

CREATE TABLE "TicketComments" (
    "Id" SERIAL PRIMARY KEY,
    "Message" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
    "TicketId" INT NOT NULL,
    "UserId" INT NOT NULL,

    CONSTRAINT "FK_TicketComments_Tickets_TicketId" FOREIGN KEY ("TicketId") 
        REFERENCES "Tickets" ("Id") ON DELETE CASCADE,
        
    CONSTRAINT "FK_TicketComments_Users_UserId" FOREIGN KEY ("UserId") 
        REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_TicketComments_TicketId" ON "TicketComments" ("TicketId");
CREATE INDEX "IX_TicketComments_UserId" ON "TicketComments" ("UserId");