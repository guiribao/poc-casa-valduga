//@ts-nocheck
import { useEffect, useRef, useState } from 'react';
import { LoaderArgs, redirect } from '@remix-run/node';
import type { V2_MetaFunction } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';

import pegarMapaPeloSlug from '~/domain/Mapas/pegar-mapa-pelo-slug.server';

import leafletStyle from '../../node_modules/leaflet/dist/leaflet.css';
import routeMachineStyle from '../../node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.css';
import visualizarStyle from '~/assets/css/visualizar.css';

export const meta: V2_MetaFunction = () => {
  return [
    {
      charset: 'utf-8',
      title: 'CasaValduga - SmartMap',
      viewport: 'width=device-width, initial-scale=1',
    },
    { name: 'description', content: 'Plataforma SmartMap by SmartComposerVR' },
  ];
};

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: leafletStyle },
    { rel: 'stylesheet', href: routeMachineStyle },
    { rel: 'stylesheet', href: visualizarStyle },
  ];
};

export async function loader({ request, params }: LoaderArgs) {
  // await authenticator.isAuthenticated(request, {
  //   failureRedirect: '/entrar',
  // });

  let mapa = await pegarMapaPeloSlug(params.slug);

  if (mapa === null) return redirect('/');

  return { mapa };
}

export default function VerMapa() {
  var map = null;

  function initLMap() {
    map = L.map('map-ll', {
      maxBounds: {
        north: -29.17651,
        south: -29.1808,
        east: -51.552,
        west: -51.5595,
      },
      maxBoundsViscosity: 1.0,
    }).setView([-29.17805, -51.556], 18);

    var tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(map);

    L.Routing.control({
      waypoints: [L.latLng(-29.17898, -51.55608), L.latLng(-29.17856, -51.55598)],
      lineOptions: [{ color: 'blue', opacity: 1, weight: 9 }],
      profile: 'walk',
    }).addTo(map);
  }

  useEffect(() => {
    initLMap()
  }, []);
  return (
    <main className='oil-on-canvas'>
      <div id='map-ll'></div>
    </main>
  );
}
