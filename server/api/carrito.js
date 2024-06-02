import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { req, res } = event;

  if (req.method === 'GET') {
    try {
      const carritos = await prisma.carrito.findMany();
      return carritos;
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else if (req.method === 'POST') {
    try {
      const body = await readBody(event);
      const nuevoCarrito = await prisma.carrito.create({
        data: {
          usuario_id: body.usuario_id,
          estado: 'pendiente',
        },
      });
      return nuevoCarrito;
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else if (req.method === 'PUT') {
    try {
      const body = await readBody(event);
      const carritoActualizado = await prisma.carrito.update({
        where: { id: body.id },
        data: {
          usuario_id: body.usuario_id,
          estado: body.estado,
        },
      });
      return carritoActualizado;
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else if (req.method === 'DELETE') {
    try {
      const body = await readBody(event);
      const carritoEliminado = await prisma.carrito.delete({
        where: { id: body.id },
      });
      return carritoEliminado;
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else {
    res.statusCode = 405;
    return { error: 'Método no permitido' };
  }
});