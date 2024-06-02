import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { req, res } = event;

  if (req.method === 'GET') {
    const { usuario_id, carrito_id } = getQuery(event);

    if (!usuario_id || !carrito_id) {
      res.statusCode = 400;
      return { error: 'Debe proporcionar usuario_id y carrito_id' };
    }

    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id: Number(usuario_id) },
      });

      if (!usuario) {
        res.statusCode = 404;
        return { error: 'Usuario no encontrado' };
      }

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

      if (!carrito || carrito.usuario_id !== Number(usuario_id)) {
        res.statusCode = 404;
        return { error: 'Carrito no encontrado o no pertenece al usuario' };
      }

      const productos = carrito.CarritoProducto.map(item => ({
        id: item.Producto.id,
        nombre: item.Producto.nombre,
        cantidad: item.cantidad,
        precio_unitario: item.Producto.precio,
        valor: item.cantidad * item.Producto.precio,
      }));

      const total = productos.reduce((acc, item) => acc + item.valor, 0);

      return {
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
        },
        carrito: {
          id: carrito.id,
          estado: carrito.estado,
        },
        productos,
        total,
      };
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else {
    res.statusCode = 405;
    return { error: 'Método no permitido' };
  }
});