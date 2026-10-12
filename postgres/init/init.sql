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

CREATE TABLE "ArchivedUsers" (
    "Id" SERIAL PRIMARY KEY,
    "OriginalUserId" INT NOT NULL,
    "Username" VARCHAR(50) NOT NULL,
    "Email" VARCHAR(50) NOT NULL,
    "Role" VARCHAR(20) NOT NULL,
    "DeletedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE "Tickets"(
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(100) NOT NULL,
    "Description" TEXT NOT NULL,
    "Category" VARCHAR(50) NOT NULL,
    "Priority" VARCHAR(20) NOT NULL DEFAULT('low'),
    "Tags" VARCHAR(100),
    "Status" VARCHAR(20) NOT NULL DEFAULT('new'),
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
    "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
    "ClosedAt" TIMESTAMP WITH TIME ZONE,
    "AuthorId" INT,
    "ArchivedUserId" INT,
    "AssignedAdminId" INT,
    "ArchivedAssignedAdminId" INT,
    CONSTRAINT "FK_Tickets_Users_AuthorId" FOREIGN KEY ("AuthorId")
        REFERENCES "Users" ("Id") ON DELETE SET NULL,
    CONSTRAINT "FK_Tickets_ArchivedUsers_ArchivedUserId" FOREIGN KEY ("ArchivedUserId")
        REFERENCES "ArchivedUsers" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_Tickets_Users_AssignedAdminId" FOREIGN KEY ("AssignedAdminId")
        REFERENCES "Users" ("Id") ON DELETE SET NULL,
    CONSTRAINT "FK_Tickets_ArchivedUsers_ArchivedAssignedAdminId" FOREIGN KEY ("ArchivedAssignedAdminId")
        REFERENCES "ArchivedUsers" ("Id") ON DELETE RESTRICT
);

CREATE TABLE "TicketComments" (
    "Id" SERIAL PRIMARY KEY,
    "Message" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
    "TicketId" INT NOT NULL,
    "UserId" INT,
    "ArchivedUserId" INT,

    CONSTRAINT "FK_TicketComments_Tickets_TicketId" FOREIGN KEY ("TicketId") 
        REFERENCES "Tickets" ("Id") ON DELETE CASCADE,
        
    CONSTRAINT "FK_TicketComments_Users_UserId" FOREIGN KEY ("UserId") 
        REFERENCES "Users" ("Id") ON DELETE SET NULL,
    CONSTRAINT "FK_TicketComments_ArchivedUsers_ArchivedUserId" FOREIGN KEY ("ArchivedUserId")
        REFERENCES "ArchivedUsers" ("Id") ON DELETE RESTRICT
);

CREATE TABLE "TicketInternalComments" (
    "Id" SERIAL PRIMARY KEY,
    "Message" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
    "TicketId" INT NOT NULL,
    "UserId" INT,
    "ArchivedUserId" INT,

    CONSTRAINT "FK_TicketInternalComments_Tickets_TicketId" FOREIGN KEY ("TicketId") 
        REFERENCES "Tickets" ("Id") ON DELETE CASCADE,
        
    CONSTRAINT "FK_TicketInternalComments_Users_UserId" FOREIGN KEY ("UserId") 
        REFERENCES "Users" ("Id") ON DELETE SET NULL,
    CONSTRAINT "FK_TicketInternalComments_ArchivedUsers_ArchivedUserId" FOREIGN KEY ("ArchivedUserId")
        REFERENCES "ArchivedUsers" ("Id") ON DELETE RESTRICT
);


CREATE INDEX "IX_TicketComments_TicketId" ON "TicketComments" ("TicketId");
CREATE INDEX "IX_TicketComments_UserId" ON "TicketComments" ("UserId");
CREATE INDEX "IX_TicketComments_ArchivedUserId" ON "TicketComments" ("ArchivedUserId");
CREATE INDEX "IX_TicketInternalComments_TicketId" ON "TicketInternalComments" ("TicketId");
CREATE INDEX "IX_TicketInternalComments_UserId" ON "TicketInternalComments" ("UserId");
CREATE INDEX "IX_TicketInternalComments_ArchivedUserId" ON "TicketInternalComments" ("ArchivedUserId");
CREATE INDEX "IX_Tickets_ArchivedUserId" ON "Tickets" ("ArchivedUserId");
CREATE INDEX "IX_Tickets_ArchivedAssignedAdminId" ON "Tickets" ("ArchivedAssignedAdminId");
CREATE INDEX "IX_ArchivedUsers_OriginalUserId" ON "ArchivedUsers" ("OriginalUserId");