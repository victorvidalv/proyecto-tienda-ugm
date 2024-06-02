import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { req, res } = event;

  if (req.method === 'GET') {
    try {
      const ventas = await prisma.carrito.findMany({
        where: {
          estado: 'pagado'
        },
        include: {
          Usuario: true,
          CarritoProducto: {
            include: {
              Producto: true
            }
          },
          Pago: true
        }
      });

      const response = ventas.map(venta => ({
        venta_id: venta.id,
        fecha: venta.fecha_creacion,
        total: venta.Pago ? venta.Pago.monto : 0,
        cliente: {
          nombre: venta.Usuario.nombre,
          email: venta.Usuario.email
        },
        productos: venta.CarritoProducto.map(producto => ({
          nombre: producto.Producto.nombre,
          cantidad: producto.cantidad,
          subtotal: producto.cantidad * producto.Producto.precio
        }))
      }));

      return response;
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else {
    res.statusCode = 405;
    return { error: 'Método no permitido' };
  }
});