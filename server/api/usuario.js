import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { req, res } = event;

  if (req.method === 'POST') {
    try {
      const body = await readBody(event);

      // Verificar si el correo ya existe
      const usuarioExistente = await prisma.usuario.findUnique({
        where: { email: body.email }
      });

      if (usuarioExistente) {
        res.statusCode = 400;
        return { error: `Correo ${body.email} existente` };
      }

      // Encriptar la contraseña utilizando MD5
      const hash = crypto.createHash('md5').update(body.contrasena).digest('hex');

      const nuevoUsuario = await prisma.usuario.create({
        data: {
          nombre: body.nombre,
          email: body.email,
          contrasena: hash,  // Usar la contraseña encriptada
          tipo: 'cliente',
          direccion: body.direccion,
          telefono: body.telefono,
          rut: body.rut,
        },
      });
      return nuevoUsuario;
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else {
    res.statusCode = 405;
    return { error: 'Método no permitido' };
  }
});