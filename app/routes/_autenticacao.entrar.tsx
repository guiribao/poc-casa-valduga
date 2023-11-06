//@ts-nocheck
import { ActionFunction, LinksFunction, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { Form, Link, useActionData, useNavigation, useSearchParams } from '@remix-run/react';
import { authenticator } from '~/secure/authentication.server';
import loginPageStyle from '~/assets/css/entrar.css';
import loading from '~/assets/img/loading.gif';
import { useEffect } from 'react';
import Constraints from '~/shared/Constraints';
import Toastify from 'toastify-js';
import { createBrowserHistory } from 'history';
import logo_smart_preto from '~/assets/img/smart_logo_preto.png';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Entrar - SmartMap | SmartComposerVR' },
    { name: 'description', content: 'A plataforma da SmartComposerVR.' },
  ];
};

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: loginPageStyle }];
};

export const action: ActionFunction = async ({ request, context }) => {
  await authenticator.authenticate('form', request, {
    successRedirect: '/',
  });

  return { fail: 'Vish. Suas credenciais não estão batendo' };
};

export async function loader({ request }: LoaderArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  });

  return {};
}

export default function Entrar() {
  let actionData = useActionData();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === 'submitting';

  useEffect(() => {
    if (actionData?.fail) {
      Toastify({
        text: actionData.fail,
        className: 'info',
        style: {
          background: window.SMART.NOTIFY_COLOR,
        },
      }).showToast();
    }
  }, [navigation.state]);

  return (
    <main>
      <div className='header'>
        <h1>
          SmartMap
          <span>
            by
            <img src={logo_smart_preto} alt='SmartMap by SmartComposer' />
          </span>
        </h1>
        <p>Entrar</p>
      </div>
      <Form method='POST' className='form-cadastro'>
        <div className='form-group'>
          <label>E-mail</label>
          <input type='email' name='email' id='email' autoComplete='off' />
        </div>
        <div className='form-group'>
          <label>Senha</label>
          <input type='password' name='senha' id='senha' autoComplete='off' />
          <p>
            Esqueceu sua senha? <Link to='/recuperar-senha'>Clique aqui</Link>
          </p>
        </div>
        <div className='form-group form-button'>
          <button type='submit' className='btn-cadastro' disabled={isSubmitting}>
            {!isSubmitting && 'Entrar'}
            {isSubmitting && <img src={loading} alt='Entrando' />}
          </button>
        </div>
      </Form>
    </main>
  );
}
