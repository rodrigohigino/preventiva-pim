import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../database/data-source.js';
import { Usuario } from '../entities/Usuario.js';
import { env } from '../config/env.js';
import { AppError } from '../middlewares/error.middleware.js';
import { LoginInput } from '../validates/auth.validate.js';
import { LoginResponse } from '../models/auth.models.js';

export class AuthService {
  private usuarioRepo = AppDataSource.getRepository(Usuario);

  async login(data: LoginInput): Promise<LoginResponse> {
    // addSelect garante que o campo 'senha' (select: false) venha na query
    const usuario = await this.usuarioRepo
      .createQueryBuilder('u')
      .addSelect('u.senha')
      .where('u.email = :email', { email: data.email })
      .andWhere('u.ativo = true')
      .getOne();

    if (!usuario) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const senhaCorreta = await bcrypt.compare(data.senha, usuario.senha);
    if (!senhaCorreta) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const token = jwt.sign(
      { sub: usuario.id, email: usuario.email, perfil: usuario.perfil },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions,
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
    };
  }
}
