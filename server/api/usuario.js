import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import validator from 'validator';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { req, res } = event;
  if (req.method === 'POST') {
    try {
      const body = await readBody(event);

      // Sanitizar entradas
      const nombre = validator.trim(body.nombre);
      const email = validator.trim(body.email);
      const direccion = validator.trim(body.direccion);
      const telefono = validator.trim(body.telefono);
      const rut = validator.trim(body.rut);

      // Validar entradas
      if (!validator.isEmail(email)) {
        res.statusCode = 400;
        return { error: 'Correo inválido' };
      }
      const contrasena = body.contrasena;
      if (!validator.isLength(contrasena, { min: 8 })) {
        res.statusCode = 400;
        return { error: 'La contraseña debe tener al menos 8 caracteres' };
      }
      if (!/[A-Z]/.test(contrasena)) {
        res.statusCode = 400;
        return { error: 'La contraseña debe tener al menos una letra mayúscula' };
      }
      if (!/[!@#$%^&*(),.?\":{}|<>]/.test(contrasena)) {
        res.statusCode = 400;
        return { error: 'La contraseña debe tener al menos un carácter especial' };
      }

      // Verificar si el correo ya existe
      const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
      if (usuarioExistente) {
        res.statusCode = 400;
        return { error: `Correo ${email} existente` };
      }

      // Encriptar la contraseña utilizando bcrypt
      const hash = await bcrypt.hash(contrasena, 10);

      const nuevoUsuario = await prisma.usuario.create({
        data: {
          nombre,
          email,
          contrasena: hash,
          tipo: 'cliente',
          direccion,
          telefono,
          rut,
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