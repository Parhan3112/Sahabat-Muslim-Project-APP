import bcrypt from 'bcryptjs';
import { prisma } from '../../config/database.js';
import { LoginInput, RegisterInput } from './auth.schema.js';

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    const error: any = new Error('Email sudah terdaftar');
    error.statusCode = 400;
    error.code = 'EMAIL_ALREADY_EXISTS';
    throw error;
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    const error: any = new Error('Email atau password salah');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);

  if (!isPasswordValid) {
    const error: any = new Error('Email atau password salah');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
