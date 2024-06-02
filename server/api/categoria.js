import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { req, res } = event;

  if (req.method === 'GET') {
    try {
      const categorias = await prisma.categoria.findMany();
      return categorias;
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else if (req.method === 'POST') {
    try {
      const body = await readBody(event);
      const nuevaCategoria = await prisma.categoria.create({
        data: {
          nombre: body.nombre,
        },
      });
      return nuevaCategoria;
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else if (req.method === 'PUT') {
    try {
      const body = await readBody(event);
      const categoriaActualizada = await prisma.categoria.update({
        where: { id: body.id },
        data: {
          nombre: body.nombre,
        },
      });
      return categoriaActualizada;
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else if (req.method === 'DELETE') {
    try {
      const body = await readBody(event);
      const categoriaEliminada = await prisma.categoria.delete({
        where: { id: body.id },
      });
      return categoriaEliminada;
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else {
    res.statusCode = 405;
    return { error: 'Método no permitido' };
  }
});