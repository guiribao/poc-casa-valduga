//@ts-nocheck
import { useEffect, useState } from 'react';
import { LoaderArgs, redirect } from '@remix-run/node';
import type { V2_MetaFunction } from '@remix-run/node';

import pegarMapaPeloSlug from '~/domain/Mapas/pegar-mapa-pelo-slug.server';

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
    { rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css' },
    {
      rel: 'stylesheet',
      href: 'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css',
    },
    { rel: 'stylesheet', href: visualizarStyle },
  ];
};

export async function loader({ request, params }: LoaderArgs) {
  // await authenticator.isAuthenticated(request, {
  //   failureRedirect: '/entrar',
  // });

  //let mapa = await pegarMapaPeloSlug(params.slug);

  //if (mapa === null) return redirect('/');

  return {};
}

export default function VerMapa() {
  let [myLocation, setMyLocation] = useState([]);

  var map = null;
  var rota = null;
  var markers = [
    { latLng: [-29.177450, -51.556225], title: 'Restaurante Maria Valduga' },
    { latLng: [-29.177270, -51.55680], title: 'LUI Wine Bar & NOI Gelato' },
    { latLng: [-29.17819, -51.556685], title: 'Café Santa Mônica' },
    { latLng: [-29.178135, -51.5560], title: 'Pousada Gran' },
  ];

  function touchPin(event) {
    event.target.openTooltip();
  }

  function createNavigation(event, destino) {
    if (rota != null) rota.remove();

    rota = L.Routing.control({
      waypoints: [myLocation, destino],
      lineOptions: {
        styles: [{ color: 'yellow', opacity: 0.47, weight: 5 }],
      },
      language: 'pt-BR',
      profile: 'walk',
    });

    rota.addTo(map);
  }

  function appendLocation(location, verb) {
    verb = verb || 'updated';

    var pinMeIcon = L.icon({
      iconUrl: 'https://composervr.com/resources/pin_me.png',
      iconSize: [32, 32],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
      className: 'icon-pin',
    });

    L.marker([location.coords.latitude, location.coords.longitude], {
      title: 'Você',
      icon: pinMeIcon,
    }).addTo(map);

    setMyLocation([location.coords.latitude, location.coords.longitude]);

    console.info('coords sync: ' + verb);
  }

  useEffect(() => {
    if (map) map.remove();

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (location) {
        appendLocation(location, 'fetched');
      });
      navigator.geolocation.watchPosition(appendLocation);
    } else {
      console.warn('Geolocation API not supported.');
    }

    map = L.map('map-ll', {
      // maxBounds: {
      //   north: -29.17651,
      //   south: -29.1808,
      //   east: -51.552,
      //   west: -51.5595,
      // },
      maxBoundsViscosity: 1.0,
    }).setView([-29.17865, -51.556], 18);

    map.setMaxBounds(map.getBounds());

    var pinPlacesIcon = L.icon({
      iconUrl: 'https://composervr.com/resources/pin_places.png',
      iconSize: [32, 32],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
      className: 'icon-pin',
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 19,
      maxZoom: 19,
      attribution: '&copy; <a hr7ef="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // G Maps imagens de satélite.
    // var googleHybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    //   maxZoom: 19,
    //   subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    // }).addTo(map);

    for (let marker of markers) {
      let ref = L.marker(marker.latLng, {
        title: marker.title,
        icon: pinPlacesIcon,
      }).addTo(map);

      let navigateButton = document.createElement('button');
      navigateButton.textContent = 'Navegar até aqui!';
      navigateButton.addEventListener('click', (event) => createNavigation(event, marker.latLng));

      var popup = L.popup().setLatLng(marker.latLng).setContent(navigateButton);

      popup.addEventListener('click', (event) => {
        createNavigation(event);
        console.log('chamou');
      });

      ref.bindPopup(popup);
      ref.addEventListener('click', touchPin);
    }
  }, []);

  return (
    <main className='oil-on-canvas'>
      <div id='map-ll'></div>
      <footer className='form-navegacao'>
        <p>Toque ou clique no pino para navegar</p>
      </footer>
    </main>
  );
}
