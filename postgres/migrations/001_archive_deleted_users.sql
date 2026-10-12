BEGIN;

CREATE TABLE IF NOT EXISTS "ArchivedUsers" (
    "Id" SERIAL PRIMARY KEY,
    "OriginalUserId" INT NOT NULL,
    "Username" VARCHAR(50) NOT NULL,
    "Email" VARCHAR(50) NOT NULL,
    "Role" VARCHAR(20) NOT NULL,
    "DeletedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

ALTER TABLE "Tickets"
    ALTER COLUMN "AuthorId" DROP NOT NULL,
    ADD COLUMN IF NOT EXISTS "ArchivedUserId" INT,
    ADD COLUMN IF NOT EXISTS "ArchivedAssignedAdminId" INT;

ALTER TABLE "TicketComments"
    ALTER COLUMN "UserId" DROP NOT NULL,
    ADD COLUMN IF NOT EXISTS "ArchivedUserId" INT;

ALTER TABLE "TicketInternalComments"
    ALTER COLUMN "UserId" DROP NOT NULL,
    ADD COLUMN IF NOT EXISTS "ArchivedUserId" INT;

ALTER TABLE "Tickets"
    DROP CONSTRAINT IF EXISTS "FK_Tickets_Users_AuthorId",
    DROP CONSTRAINT IF EXISTS "FK_Tickets_Users_AssignedAdminId",
    DROP CONSTRAINT IF EXISTS "FK_Tickets_ArchivedUsers_ArchivedUserId",
    DROP CONSTRAINT IF EXISTS "FK_Tickets_ArchivedUsers_ArchivedAssignedAdminId",
    ADD CONSTRAINT "FK_Tickets_Users_AuthorId"
        FOREIGN KEY ("AuthorId") REFERENCES "Users" ("Id") ON DELETE SET NULL,
    ADD CONSTRAINT "FK_Tickets_Users_AssignedAdminId"
        FOREIGN KEY ("AssignedAdminId") REFERENCES "Users" ("Id") ON DELETE SET NULL,
    ADD CONSTRAINT "FK_Tickets_ArchivedUsers_ArchivedUserId"
        FOREIGN KEY ("ArchivedUserId") REFERENCES "ArchivedUsers" ("Id") ON DELETE RESTRICT,
    ADD CONSTRAINT "FK_Tickets_ArchivedUsers_ArchivedAssignedAdminId"
        FOREIGN KEY ("ArchivedAssignedAdminId") REFERENCES "ArchivedUsers" ("Id") ON DELETE RESTRICT;

ALTER TABLE "TicketComments"
    DROP CONSTRAINT IF EXISTS "FK_TicketComments_Users_UserId",
    DROP CONSTRAINT IF EXISTS "FK_TicketComments_ArchivedUsers_ArchivedUserId",
    ADD CONSTRAINT "FK_TicketComments_Users_UserId"
        FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE SET NULL,
    ADD CONSTRAINT "FK_TicketComments_ArchivedUsers_ArchivedUserId"
        FOREIGN KEY ("ArchivedUserId") REFERENCES "ArchivedUsers" ("Id") ON DELETE RESTRICT;

ALTER TABLE "TicketInternalComments"
    DROP CONSTRAINT IF EXISTS "FK_TicketInternalComments_Users_UserId",
    DROP CONSTRAINT IF EXISTS "FK_TicketInternalComments_ArchivedUsers_ArchivedUserId",
    ADD CONSTRAINT "FK_TicketInternalComments_Users_UserId"
        FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE SET NULL,
    ADD CONSTRAINT "FK_TicketInternalComments_ArchivedUsers_ArchivedUserId"
        FOREIGN KEY ("ArchivedUserId") REFERENCES "ArchivedUsers" ("Id") ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS "IX_Tickets_ArchivedUserId" ON "Tickets" ("ArchivedUserId");
CREATE INDEX IF NOT EXISTS "IX_Tickets_ArchivedAssignedAdminId" ON "Tickets" ("ArchivedAssignedAdminId");
CREATE INDEX IF NOT EXISTS "IX_TicketComments_ArchivedUserId" ON "TicketComments" ("ArchivedUserId");
CREATE INDEX IF NOT EXISTS "IX_TicketInternalComments_ArchivedUserId" ON "TicketInternalComments" ("ArchivedUserId");
CREATE INDEX IF NOT EXISTS "IX_ArchivedUsers_OriginalUserId" ON "ArchivedUsers" ("OriginalUserId");

COMMIT;
