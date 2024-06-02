import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { req, res } = event;

  if (req.method === 'POST') {
    try {
      const body = await readBody(event);
      const nuevoCarritoProducto = await prisma.carritoProducto.create({
        data: {
          carrito_id: body.carrito_id,
          producto_id: body.producto_id,
          cantidad: body.cantidad,
        },
      });
      return nuevoCarritoProducto;
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else if (req.method === 'GET') {
    try {
      const carritoProductos = await prisma.carritoProducto.findMany();
      return carritoProductos;
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else if (req.method === 'PUT') {
    try {
      const body = await readBody(event);
      const carritoProductoActualizado = await prisma.carritoProducto.update({
        where: { id: body.id },
        data: {
          carrito_id: body.carrito_id,
          producto_id: body.producto_id,
          cantidad: body.cantidad,
        },
      });
      return carritoProductoActualizado;
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else if (req.method === 'DELETE') {
    try {
      const body = await readBody(event);
      const carritoProductoEliminado = await prisma.carritoProducto.delete({
        where: { id: body.id },
      });
      return carritoProductoEliminado;
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else {
    res.statusCode = 405;
    return { error: 'Método no permitido' };
  }
});