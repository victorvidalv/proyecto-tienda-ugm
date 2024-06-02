-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'cliente',
    "direccion" TEXT,
    "telefono" TEXT,
    "fecha_creacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Usuario" ("contrasena", "direccion", "email", "fecha_creacion", "id", "nombre", "telefono", "tipo") SELECT "contrasena", "direccion", "email", "fecha_creacion", "id", "nombre", "telefono", "tipo" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
PRAGMA foreign_key_check("Usuario");
PRAGMA foreign_keys=ON;
