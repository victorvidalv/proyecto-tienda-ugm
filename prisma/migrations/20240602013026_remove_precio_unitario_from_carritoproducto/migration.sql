/*
  Warnings:

  - You are about to drop the column `precio_unitario` on the `CarritoProducto` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CarritoProducto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "carrito_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    CONSTRAINT "CarritoProducto_carrito_id_fkey" FOREIGN KEY ("carrito_id") REFERENCES "Carrito" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CarritoProducto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CarritoProducto" ("cantidad", "carrito_id", "id", "producto_id") SELECT "cantidad", "carrito_id", "id", "producto_id" FROM "CarritoProducto";
DROP TABLE "CarritoProducto";
ALTER TABLE "new_CarritoProducto" RENAME TO "CarritoProducto";
PRAGMA foreign_key_check("CarritoProducto");
PRAGMA foreign_keys=ON;
