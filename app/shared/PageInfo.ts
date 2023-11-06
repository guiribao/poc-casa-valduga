const infos = [
  { path: '/mapas', title: 'Meus mapas' },
];

export function getPageInfo(page: string) {
  return infos.find((e) => e.path === page);
}

export function isActivePage(page: string) {
  return !!infos.find((e) => e.path.includes(page));
}
