import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { req, res } = event;

  if (req.method === 'GET') {
    try {
      const usuarios = await prisma.usuario.findMany();
      return usuarios;
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else if (req.method === 'POST') {
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
  } else if (req.method === 'PUT') {
    try {
      const body = await readBody(event);

      // Verificar si el correo ya existe (para otro usuario)
      const usuarioExistente = await prisma.usuario.findUnique({
        where: { email: body.email }
      });

      if (usuarioExistente && usuarioExistente.id !== body.id) {
        res.statusCode = 400;
        return { error: `Correo ${body.email} existente` };
      }

      // Encriptar la nueva contraseña utilizando MD5 si está presente en la solicitud
      const hash = body.contrasena ? crypto.createHash('md5').update(body.contrasena).digest('hex') : undefined;

      const usuarioActualizado = await prisma.usuario.update({
        where: { id: body.id },
        data: {
          nombre: body.nombre,
          email: body.email,
          contrasena: hash,  // Usar la contraseña encriptada si está presente
          tipo: body.tipo,
          direccion: body.direccion,
          telefono: body.telefono,
        },
      });
      return usuarioActualizado;
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else if (req.method === 'DELETE') {
    try {
      const body = await readBody(event);
      const usuarioEliminado = await prisma.usuario.delete({
        where: { id: body.id },
      });
      return usuarioEliminado;
    } catch (error) {
      res.statusCode = 500;
      return { error: error.message };
    }
  } else {
    res.statusCode = 405;
    return { error: 'Método no permitido' };
  }
});