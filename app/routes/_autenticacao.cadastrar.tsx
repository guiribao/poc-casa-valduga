//@ts-nocheck
import {
  ActionFunction,
  LinksFunction,
  LoaderArgs,
  V2_MetaFunction,
  json,
  redirect,
} from '@remix-run/node';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import { useEffect } from 'react';

import Toastify from 'toastify-js';
import InputMask from 'react-input-mask';
import { authenticator } from '~/secure/authentication.server';
import criarNovoUsuario from '~/domain/Usuario/criar-novo-usuario.server';
import pegarUsuarioPeloEmail from '~/domain/Usuario/pegar-usuario-pelo-email.server';

import loginPageStyle from '~/assets/css/entrar.css';

import {
  validatorCelular,
  validatorDataNascimento,
  validatorEmail,
  validatorNomeCompleto,
} from '~/shared/Validators';

import loading from '~/assets/img/loading.gif';
import logo_smart_preto from '~/assets/img/smart_logo_preto.png';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Cadastrar - SmartMap | SmartComposerVR' },
    { name: 'description', content: 'A Núvem do Instituto Viva Mais!' },
  ];
};

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: loginPageStyle }];
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const email: string = form.get('email') as string;
  const senha: string = form.get('senha') as string;

  const nome_completo: string = form.get('nome_completo') as string;
  const data_nascimento: string = form.get('data_nascimento') as string;
  const celular: string = form.get('celular') as string;

  const formErrors = {
    nome_completo: validatorNomeCompleto(nome_completo),
    data_nascimento: validatorDataNascimento(data_nascimento),
    celular: validatorCelular(celular),
    email: validatorEmail(email),
  };

  if (Object.values(formErrors).some((value) => value !== undefined)) return { formErrors };

  let objUsuario = {
    email: email,
    senha: senha,
    nome_completo: nome_completo,
    data_nascimento: data_nascimento,
    celular: celular,
  };

  let existePeloEmail = await pegarUsuarioPeloEmail(objUsuario.email);

  if (existePeloEmail) return { fail: 'E-mail já cadastrado na plataforma' };

  let novoUsuario = await criarNovoUsuario(objUsuario);

  if (!novoUsuario) return { fail: 'Ops. Não foi possível criar o usuário!' };

  return redirect('/entrar');
};

export async function loader({ request }: LoaderArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  });

  return {};
}

export default function Cadastrar() {
  let actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  useEffect(() => {
    if (actionData?.fail) {
      Toastify({
        text: actionData?.fail,
        className: 'info',
        style: {
          background: window.SMART.NOTIFY_COLOR_ERROR,
        },
      }).showToast();
    }
  }, [isSubmitting]);

  return (
    <main id='cadastro'>
      <div className='header'>
        <h1>
          SmartMap
          <span>
            by
            <img src={logo_smart_preto} alt='SmartMap by SmartComposer' />
          </span>
        </h1>
        <p>Criar conta</p>
      </div>
      <Form method='POST' name='cadastro_captador' className='form-cadastro'>
        <section className='form-section'>
          <h2>Pessoal</h2>
          <div className='form-group'>
            <label htmlFor='nome_completo'>
              Nome completo <span>*</span>
            </label>
            <input
              type='text'
              name='nome_completo'
              id='nome_completo'
              autoComplete='off'
              defaultValue={''}
            />
            <span>
              {actionData?.formErrors?.nome_completo ? (
                <p style={{ color: 'red' }}>{actionData?.formErrors?.nome_completo}</p>
              ) : null}
            </span>
          </div>

          <div className='form-group'>
            <label htmlFor='data_nascimento'>
              Data de nascimento <span>*</span>
            </label>
            <input
              type='date'
              name='data_nascimento'
              id='data_nascimento'
              placeholder='dd-mm-yyyy'
              min='1900-01-01'
            ></input>
            <span>
              {actionData?.formErrors?.data_nascimento ? (
                <p style={{ color: 'red' }}>{actionData?.formErrors?.data_nascimento}</p>
              ) : null}
            </span>
          </div>
        </section>

        <section className='form-section'>
          <h2>Contato</h2>
          <div className='form-group'>
            <label htmlFor='celular'>
              Celular <span>*</span>
            </label>
            <InputMask
              mask='(99) \99999-9999'
              type='text'
              name='celular'
              id='celular'
              autoComplete='off'
              defaultValue={''}
            />
            <span>
              {actionData?.formErrors?.celular ? (
                <p style={{ color: 'red' }}>{actionData?.formErrors?.celular}</p>
              ) : null}
            </span>
          </div>
        </section>

        <section className='form-section'>
          <h2>Usuário</h2>
          <div className='form-group'>
            <label>
              E-mail <span>*</span>
            </label>
            <input type='email' name='email' id='email' autoComplete='off' defaultValue={''} />
            <span>
              {actionData?.formErrors?.email ? (
                <p style={{ color: 'red' }}>{actionData?.formErrors?.email}</p>
              ) : null}
            </span>
          </div>

          <div className='form-group'>
            <label htmlFor='password'>
              Senha <span>*</span>
            </label>
            <input
              type='password'
              name='senha'
              id='password'
              autoComplete='off'
              defaultValue={''}
            />
            <span>
              {actionData?.formErrors?.senha ? (
                <p style={{ color: 'red' }}>{actionData?.formErrors?.senha}</p>
              ) : null}
            </span>
          </div>
        </section>

        <section className='form-section'>
          <div className='form-message'>
            <span>
              {actionData?.fail ? <p style={{ color: 'red' }}>{actionData?.fail}</p> : null}
            </span>
          </div>
        </section>

        <section className='form-section'>
          <div className='form-group'>
            <button type='submit' className='btn-cadastro' disabled={isSubmitting}>
              {!isSubmitting && 'Cadastrar'}
              {isSubmitting && <img src={loading} alt='Cadastrando' />}
            </button>
          </div>
        </section>
      </Form>
    </main>
  );
}
