//@ts-nocheck
import { LoaderArgs, json } from '@remix-run/node';
import type { V2_MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import listarMapas from '~/domain/Mapas/listar-mapas.server';
import { authenticator } from '~/secure/authentication.server';
import { getPageInfo } from '~/shared/PageInfo';

export const meta: V2_MetaFunction = () => {
  return [
    {
      charset: 'utf-8',
      title: 'Dashboard - SmartMap | SmartComposerVR',
      viewport: 'width=device-width, initial-scale=1',
    },
    {
      name: 'description',
      content: 'Dashboard para criação e manutenção de mapas da SmartComposerVR',
    },
  ];
};

export async function loader({ request }: LoaderArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/entrar',
  });

  let mapas = await listarMapas();

  return { mapas };
}

export default function Mapas() {
  let { mapas } = useLoaderData();

  return (
    <main>
      <div className='view_container'>
        <div className='view'>
          <div className='view-header'>
            <Link className='goback-button' to={'/'}>
              Voltar
            </Link>
          </div>
          <div className='view-body'>
            <ul>
              {mapas.length ? (
                mapas.map((mapa) => <li>{mapa.titulo}</li>)
              ) : (
                <li>Nenhum mapa encontrado</li>
              )}
            </ul>
          </div>
          <div className='view-footer'></div>
        </div>
      </div>
    </main>
  );
}
