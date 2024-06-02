import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { req, res } = event;

  if (req.method === 'POST') {
    try {
      const { email, contrasena } = await readBody(event);

      // Encriptar la contraseña utilizando MD5 para comparación
      const hash = crypto.createHash('md5').update(contrasena).digest('hex');

      // Buscar el usuario por email y contraseña
      const usuario = await prisma.usuario.findUnique({
        where: { email },
        select: { id: true, contrasena: true, tipo: true }
      });

      // Verificar si el usuario existe y la contraseña es correcta
      if (usuario && usuario.contrasena === hash) {
        return { id: usuario.id, auth: 'ok', type: usuario.tipo };
      } else {
        return { auth: 'no' };
      }
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else {
    res.statusCode = 405;
    return { error: 'Método no permitido' };
  }
});