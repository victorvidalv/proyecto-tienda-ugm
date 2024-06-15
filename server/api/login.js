import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { req, res } = event;
  if (req.method === 'POST') {
    try {
      const { email, contrasena } = await readBody(event);

      // Buscar el usuario por email
      const usuario = await prisma.usuario.findUnique({ where: { email }, select: { id: true, contrasena: true, tipo: true } });

      // Verificar si el usuario existe y la contraseña es correcta
      if (usuario && await bcrypt.compare(contrasena, usuario.contrasena)) {
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