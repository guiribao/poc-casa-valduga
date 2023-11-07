import { LoaderArgs, json } from '@remix-run/node';
import { Form, Link, useLoaderData } from '@remix-run/react';
import { useLocation } from 'react-router-dom';
import { Usuario } from '@prisma/client';
import { getPageInfo } from '~/shared/PageInfo';

import { authenticator } from '~/secure/authentication.server';

import userImage from '~/assets/img/user.png';

export const loader = async ({ request }: LoaderArgs) => {
  let usuario = authenticator.isAuthenticated(request);

  return json({
    usuario,
  });
};

export default function Topbar() {
  let { usuario } = useLoaderData();
  const location = useLocation();
  const info = getPageInfo(location.pathname);

  let editando = location.pathname.includes('/editar');
  let visualizando = location.pathname.includes('/ver');

  //@ts-ignore
  function emitirFerramenta(event) {
    window.postMessage({ action: 'changeTool', tool: event?.target.value });
  }

  return (
    (visualizando && (
      <header>

      </header>
    )) ||
    (usuario && editando && (
      <header>
        <h2>
          <label htmlFor='nav-toggle'>
            <span className='las la-bars'></span>
          </label>
        </h2>
      </header>
    )) ||
    (usuario && (
      <header>
        <h2>
          <label htmlFor='nav-toggle'>
            <span className='las la-bars'></span>
          </label>
          {info?.title}
        </h2>
        <div className='user-wrapper'>
          <img src={userImage} alt='some random user image' width={'40px'} height={'40px'} />
          <div>
            <h4>{usuario?.nome_completo || usuario.email}</h4>
            <small>
              <Link to='/conta'>Minha conta</Link>
              {' | '}
            </small>
            <small>
              <Link to='/sair'>Sair</Link>
            </small>
          </div>
        </div>
      </header>
    ))
  );
}
