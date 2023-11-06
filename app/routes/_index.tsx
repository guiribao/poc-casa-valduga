import { LoaderArgs, V2_MetaFunction, redirect } from '@remix-run/node';
import { authenticator } from '~/secure/authentication.server';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'SmartMap - SmartComposerVR' },
    { name: 'description', content: 'Plataforma SmartMap by SmartComposerVR' }
  ];
};

export async function loader({ request }: LoaderArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: '/mapas',
    failureRedirect: '/entrar',
  });

  return {};
}

export default function Index() {
  return <main>Redirecionando...</main>;
}
