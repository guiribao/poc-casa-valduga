import { LinksFunction, LoaderArgs, V2_MetaFunction, json, redirect } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from '@remix-run/react';

import stylesheet from '~/global.css';
import toastyStyle from 'toastify-js/src/toastify.css';
import line_awesome from '~/assets/lib/line-awesome/css/line-awesome.min.css';
import Sidebar from './component/layout/Sidebar';
import Layout from './component/layout/Layout';
import Topbar from './component/layout/Topbar';
import { authenticator } from './secure/authentication.server';
import { Usuario } from '@prisma/client';
import { canAccess, canView } from './secure/authorization';
import NotAuthorized from './routes/autorizacao';
import { getEnv } from './env.server';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: line_awesome },
    { rel: 'stylesheet', href: stylesheet },
    { rel: 'stylesheet', href: toastyStyle },
  ];
};

export const meta: V2_MetaFunction = () => {
  return [
    { charset: 'utf-8', title: 'SmartMap', viewport: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'SmartMap!' },
  ];
};

export async function loader({ request }: LoaderArgs) {
  //@ts-ignore
  let usuario: Usuario = await authenticator.isAuthenticated(request);

  if (usuario?.id) {
    const symbol = Object.getOwnPropertySymbols(request)[1];
    //@ts-ignore
    const parsed_url = request[symbol].parsedURL;

    if (!request.url.includes('/autorizacao') && !canAccess(parsed_url.pathname, usuario.papel)) {
      return redirect('/autorizacao');
    }
  }

  return json({ ENV: getEnv(), usuario });
}

export default function App() {
  let location = useLocation();
  let { ENV, usuario } = useLoaderData();
  let isAuthorized = canView(location.pathname, usuario?.papel);

  return (
    <html lang='pt-BR' suppressHydrationWarning={true}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
          <Sidebar />
          <div className='content'>
            <Topbar />
            {isAuthorized ? <Outlet /> : <NotAuthorized />}
          </div>
        </Layout>

        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.SMART = ${JSON.stringify(ENV)}`,
          }}
        />
        <script
          src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
          integrity='sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
          crossOrigin=''
        ></script>
        <script src='https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js'></script>
        <LiveReload />
      </body>
    </html>
  );
}
