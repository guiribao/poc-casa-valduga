//@ts-nocheck
import { PaginasAbertas, PaginasPorPapel } from './permissions';

export function canView(pathname: string, papelUsuario: string) {
  const papeisPermitidos = PaginasPorPapel[pathname];
  return (
    papeisPermitidos?.includes(papelUsuario) ||
    PaginasAbertas.find((e) => {
      return pathname.includes(e) == true;
    }) ||
    specificDynPages(pathname, papelUsuario)
  );
}

export function canAccess(pathname: string, papelUsuario: string) {
  const papeisPermitidos = PaginasPorPapel[pathname];

  return (
    papeisPermitidos?.includes(papelUsuario) ||
    PaginasAbertas.find((e) => {
      return pathname.includes(e) == true;
    })
  );
}

export function specificDynPages(pathname: string, papelUsuario: string) {
  let canI = false;

  if (/\/ver\/[0-9]+/i.test(pathname)) {
    const papeisPermitidos = PaginasPorPapel['/ver/{id}'];
    return (
      papeisPermitidos?.includes(papelUsuario) ||
      PaginasAbertas.find((e) => '/ver/{id}'.includes(e) == true)
    );
  }

  if (/\/editar\/[0-9]+/i.test(pathname)) {
    const papeisPermitidos = PaginasPorPapel['/editar/{id}'];
    return (
      papeisPermitidos?.includes(papelUsuario) ||
      PaginasAbertas.find((e) => '/editar/{id}'.includes(e) == true)
    );
  }

  return canI;
}
