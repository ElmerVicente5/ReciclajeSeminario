import { PrismaClient } from '../generated/prisma/client.js';
import {configJwt} from '../config/config.jwt.js';

const prisma = new PrismaClient();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const saltRounds = 10;
const roles = {
    ADMIN: 'ADMIN',
    USER: 'USER'
}
const test =  async (req,res)=>{
    res.status(200).json({message: 'Hello World'});
}

const login = async (req,res)=>{
    const {nombreUsuario, contrasenia} = req.body;
    const usuarioEncontrado = await prisma.usuarios.findFirst({
        where: {
            nombre_usuario: nombreUsuario
        },
        select: {
            id: true,
            nombre_completo: true,
            nombre_usuario: true,
            contrasenia: true,
            rol_id: true,
            estado: true,
            roles: {
                select: {
                    id: true,
                    nombre: true
                }
            }
        }
    });
    if(!usuarioEncontrado){
        return res.status(401).json({message: 'Credenciales incorrectas'});
    }
    const contraseniaValida = await bcrypt.compare(contrasenia, usuarioEncontrado.contrasenia);
    if(!contraseniaValida){
        return res.status(403).json({message: 'Credenciales incorrectas'});
    }
    if(usuarioEncontrado.estado === 'INACTIVO'){
        return res.status(403).json({message: 'Usuario inactivo'});
    }
    try{
        const token = jwt.sign({
            id: usuarioEncontrado.id, 
            rol: usuarioEncontrado.roles.nombre, 
            estado: usuarioEncontrado.estado,
            nombre_completo: usuarioEncontrado.nombre_completo,
            nombre_usuario: usuarioEncontrado.nombre_usuario
        }, configJwt.secret, {expiresIn: configJwt.expiresIn});
        const refreshToken = jwt.sign({
            id: usuarioEncontrado.id, 
            rol: usuarioEncontrado.roles.nombre, 
            estado: usuarioEncontrado.estado,
            nombre_completo: usuarioEncontrado.nombre_completo,
            nombre_usuario: usuarioEncontrado.nombre_usuario
        }, configJwt.secret, {expiresIn: configJwt.refreshIn});
        return res.status(200).json({accessToken: token, refreshToken: refreshToken});
    }catch(error){
        return res.status(500).json({message: 'Error al iniciar sesión'});
    }
}

const register = async (req,res)=>{
    const {nombreCompleto, nombreUsuario, contrasenia} = req.body;
    const usuarioEncontrado = await prisma.usuarios.findFirst({
        where: {
            nombre_usuario: nombreUsuario
        }
    });
        console.log(usuarioEncontrado);
    if(usuarioEncontrado){
        return res.status(400).json({message: 'Usuario ya existe'});
    }
    const nombreUsuarioEncontrado = await prisma.usuarios.findFirst({
        where: {
            nombre_completo: nombreCompleto
        }
    });
    if(nombreUsuarioEncontrado){
        return res.status(400).json({message: 'Nombre de usuario ya existe'});
    }
    try {
  
        const result = await prisma.$transaction(async (tx) => {
            const hashedPassword = await bcrypt.hash(contrasenia, saltRounds);
            const role = await tx.roles.findFirst({
                where: {
                    nombre: roles.ADMIN
                }
            });
            const usuario = await tx.usuarios.create({
                data: {
                    nombre_completo: nombreCompleto,
                    nombre_usuario: nombreUsuario,
                    contrasenia: hashedPassword,
                    rol_id: role.id,
                    estado: 'ACTIVO',
                 
                }
            });
            const token = jwt.sign({id: usuario.id, 
                rol: role.nombre, 
                estado: usuario.estado,
                nombre_completo: usuario.nombre_completo,
                nombre_usuario: usuario.nombre_usuario
            }, configJwt.secret, {expiresIn: configJwt.expiresIn});
            const refreshToken = jwt.sign({
                id: usuario.id, 
                rol: role.nombre, 
                estado: usuario.estado,
            }, configJwt.secret, {expiresIn: configJwt.refreshIn});
            return {
                message: 'Usuario creado correctamente',
                accessToken: token,
                refreshToken: refreshToken
            };
        });

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({message: 'Error al crear usuario'});
    }   
}
const getRankingByZone = async (req, res) => {
    try {
      const ranking = await prisma.eventospuntosporzona.groupBy({
        by: ["zona_id", "tipo_residuo_id"],
        _count: { _all: true },
      });
  
      const zonas = await prisma.zonas.findMany({
        select: { id: true, nombre: true, codigo: true },
      });
      const tipos = await prisma.tiporesiduo.findMany({
        select: { id: true, nombre: true },
      });
  
      const zonaMap = new Map(zonas.map(z => [z.id, z]));
      const tipoMap = new Map(tipos.map(t => [t.id, t]));
      const perZona = new Map();
  
      for (const row of ranking) {
        const z = zonaMap.get(row.zona_id);
        if (!z) continue;
  
        const t = row.tipo_residuo_id ? tipoMap.get(row.tipo_residuo_id) : null;
  
        if (!perZona.has(z.id)) {
          perZona.set(z.id, {
            zonaId: z.id,
            zonaNombre: z.nombre,
            zonaCodigo: z.codigo,
            totalResiduos: 0,
            residuosRecolectados: [],
          });
        }
  
        const bucket = perZona.get(z.id);
        bucket.totalResiduos += row._count._all;
        bucket.residuosRecolectados.push({
          tipoResiduoId: t?.id ?? null,
          tipoNombre: t?.nombre ?? "Sin tipo",
          total: row._count._all,
        });
      }
        const result = Array.from(perZona.values()).sort(
        (a, b) => b.totalResiduos - a.totalResiduos
      );
  
      res.json({ count: result.length, data: result });
    } catch (err) {
      console.error("Error en /ranking:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

export {
    test, 
    login, 
    register, 
    getRankingByZone
};