import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { req, res } = event;

  if (req.method === 'POST') {
    try {
      const body = await readBody(event);
      const nuevoCarritoProducto = await prisma.carritoProducto.create({
        data: {
          carrito_id: Number(body.carrito_id),
          producto_id: Number(body.producto_id),
          cantidad: body.cantidad,
        },
      });
      return nuevoCarritoProducto;
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else if (req.method === 'GET') {
    const { carrito_id, producto_id } = getQuery(event);
    try {
      const carritoProducto = await prisma.carritoProducto.findFirst({
        where: {
          carrito_id: Number(carrito_id),
          producto_id: Number(producto_id)
        }
      });
      if (carritoProducto) {
        return carritoProducto;
      } else {
        res.statusCode = 404;
        return { error: 'Producto no encontrado en el carrito' };
      }
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else if (req.method === 'PUT') {
    try {
      const body = await readBody(event);
      const carritoProductoActualizado = await prisma.carritoProducto.update({
        where: { id: Number(body.id) },
        data: {
          cantidad: body.cantidad,
        },
      });
      return carritoProductoActualizado;
    } catch (error) {
      console.error('Error al actualizar la cantidad en el servidor:', error); // Agregar log de error
      res.statusCode = 500;
      return { error: error.message };
    }
  } else if (req.method === 'DELETE') {
    try {
      const body = await readBody(event);
      const carritoProductoEliminado = await prisma.carritoProducto.delete({
        where: { id: Number(body.id) },
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