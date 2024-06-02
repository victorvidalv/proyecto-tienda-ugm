import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { req, res } = event;

  if (req.method === 'POST') {
    const { carrito_id } = await readBody(event);

    if (!carrito_id) {
      res.statusCode = 400;
      return { error: 'Debe proporcionar el ID del carrito' };
    }

    try {
      // Encuentra el carrito y sus productos
      const carrito = await prisma.carrito.findUnique({
        where: { id: Number(carrito_id) },
        include: {
          CarritoProducto: {
            include: {
              Producto: true,
            },
          },
        },
      });

      if (!carrito) {
        res.statusCode = 404;
        return { error: 'Carrito no encontrado' };
      }

      // Actualiza el estado del carrito a "pagado"
      await prisma.carrito.update({
        where: { id: Number(carrito_id) },
        data: { estado: 'pagado' },
      });

      // Actualiza el stock de los productos
      const updateStockPromises = carrito.CarritoProducto.map(async (item) => {
        return prisma.producto.update({
          where: { id: item.producto_id },
          data: {
            stock: {
              decrement: item.cantidad,
            },
          },
        });
      });

      await Promise.all(updateStockPromises);

      return { message: 'Pago realizado y stock actualizado correctamente' };
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else {
    res.statusCode = 405;
    return { error: 'Método no permitido' };
  }
});