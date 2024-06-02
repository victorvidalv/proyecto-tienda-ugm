import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { req, res } = event;

  if (req.method === 'GET') {
    try {
      const productos = await prisma.producto.findMany();
      return productos;
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else if (req.method === 'POST') {
    try {
      const body = await readBody(event);
      const nuevoProducto = await prisma.producto.create({
        data: {
          nombre: body.nombre,
          descripcion: body.descripcion,
          imagen_url: body.imagen_url,
          precio: body.precio,
          stock: body.stock,
          categoria_id: body.categoria_id,
        },
      });
      return nuevoProducto;
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else if (req.method === 'PUT') {
    try {
      const body = await readBody(event);
      const productoActualizado = await prisma.producto.update({
        where: { id: body.id },
        data: {
          nombre: body.nombre,
          descripcion: body.descripcion,
          imagen_url: body.imagen_url,
          precio: body.precio,
          stock: body.stock,
          categoria_id: body.categoria_id,
        },
      });
      return productoActualizado;
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else if (req.method === 'DELETE') {
    try {
      const body = await readBody(event);
      const productoEliminado = await prisma.producto.delete({
        where: { id: body.id },
      });
      return productoEliminado;
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else {
    res.statusCode = 405;
    return { error: 'Método no permitido' };
  }
});