import { Authenticator, AuthorizationError } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { prisma } from './db.server';
import { sessionStorage } from './session.server';
import { Usuario } from '@prisma/client';
import { compare, encrypt } from '~/shared/Password.util';

const authenticator = new Authenticator<Usuario>(sessionStorage);

const formStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get('email') as string;
  const senha = form.get('senha') as string;

  const usuario: Usuario | null = await prisma.usuario.findUnique({
    where: {
      email,
    },
  });

  console.log(usuario);

  if (!usuario) {
    throw new AuthorizationError();
  }

  const match = await compare(senha, usuario.senha as string);

  console.log(match);

  if (!match) {
    throw new AuthorizationError('Senha inválida para este usuário');
  }

  return usuario;
});

authenticator.use(formStrategy, 'form');

export { authenticator };
