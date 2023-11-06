//@ts-nocheck
import { LoaderArgs, json } from '@remix-run/node';
import { Link, useLoaderData, useLocation } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { authenticator } from '~/secure/authentication.server';
import { canView } from '~/secure/authorization';
import btnCaminhoIcon from '~/assets/img/btn_caminho.png';
import btnReferenciaIcon from '~/assets/img/btn_caminho.png';

import logo_smart_mobile from '~/assets/img/smart_logo_mobile.png';
import logo_smart_preto from '~/assets/img/smart_logo_branco.png';

export async function loader({ request }: LoaderArgs) {
  let usuario = await authenticator.isAuthenticated(request);

  return json({ usuario });
}

export default function Sidebar() {
  const location = useLocation();
  const { usuario } = useLoaderData();
  let [showSidebar, setShowSidebar] = useState('off');

  let editando = location.pathname.includes('/editar');

  //@ts-ignore
  function emitirFerramenta(event) {
    window.postMessage({ action: 'changeTool', tool: event?.target.value });
  }

  function handleActivePage() {
    let elements = document.querySelectorAll('.link-page');

    elements.forEach((element) => {
      element.className = element.className.replace('active', '');
      if (
        location.pathname.includes(element.getAttribute('href')) ||
        element.getAttribute('href') == location.pathname
      ) {
        element.className = 'active ' + element.classList.toString();
      }
    });
  }

  function toggleSidebar() {
    setShowSidebar(showSidebar == 'on' ? 'off' : 'on');
  }

  //@ts-ignore
  function isSmallScreen(width) {
    if (width < 1300) {
      setShowSidebar('off');
      //@ts-ignore
      document.getElementById('nav-toggle').checked = false;
    }
  }

  useEffect(() => {
    window.addEventListener('resize', (e) => {
      isSmallScreen(e.target.innerWidth);
    });

    handleActivePage();
    isSmallScreen(window.innerWidth);
  }, [location]);

  return (
    <>
      <input
        type='checkbox'
        id='nav-toggle'
        defaultChecked={showSidebar == 'on' ? true : false}
        onChange={toggleSidebar}
      />
      <div className='sidebar'>
        <div className='sidebar-brand'>
          <a href={'/'}>
            <img src={logo_smart_mobile} id='logo-mobile' alt='Instituto Viva Mais' />
            <img src={logo_smart_preto} id='logo-desk' alt='Instituto Viva Mais' />
          </a>
        </div>

        {usuario && (
          <div className='sidebar-menu'>
            {editando && (
              <div className='menu-editar'>
                <div className='menu-editar-ferramentas'>
                  <input
                    type='radio'
                    name='ferramenta'
                    value={'caminho'}
                    id='caminhoBtn'
                    defaultChecked
                    onChange={emitirFerramenta}
                  />
                  <label htmlFor='caminhoBtn' className='menu-ferramentas_caminho'>
                    <img src={btnCaminhoIcon} alt='Desenhe pontos de caminhos' />
                    Caminho
                  </label>

                  <input
                    type='radio'
                    name='ferramenta'
                    value={'referencia'}
                    id='referenciaBtn'
                    onChange={emitirFerramenta}
                  />
                  <label htmlFor='referenciaBtn' className='menu-ferramentas_referencia'>
                    <img src={btnCaminhoIcon} alt='Desenhe pontos de referência' />
                    Referência
                  </label>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
