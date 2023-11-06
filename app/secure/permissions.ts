import { Usuario_papel } from '@prisma/client';

export const PaginasAbertas = ['/', '/entrar', '/cadastrar', '/ver/{id}', '/editar/{id}'];

export const PaginasPorPapel = {
  '/dashboard': [Usuario_papel.SMART],
  '/editar/{id}': [Usuario_papel.SMART],
};

export const FuncionalidadesPorPapel = {};
