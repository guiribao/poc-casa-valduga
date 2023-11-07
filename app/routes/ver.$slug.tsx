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
  let [area, setArea] = useState(true);

  var map = null;
  var rota = null;
  //var myLocation = null;

  var markers = [
    {
      latLng: [-29.17745, -51.556225],
      title: 'Restaurante Maria Valduga',
      icon: 'https://composervr.com/resources/pin_places.png',
    },
    {
      latLng: [-29.17718, -51.5568],
      title: 'LUI Wine Bar & NOI Gelato',
      icon: 'https://composervr.com/resources/pin_places.png',
    },
    {
      latLng: [-29.17769, -51.5568],
      title: 'Recepção pousadas',
      icon: 'https://composervr.com/resources/pin_places.png',
    },
    {
      latLng: [-29.1781, -51.5567995],
      title: 'Café Santa Mônica',
      icon: 'https://composervr.com/resources/pin_places.png',
    },
    {
      latLng: [-29.1781, -51.556395],
      title: 'Loja e degustação',
      icon: 'https://composervr.com/resources/pin_places.png',
    },
    {
      latLng: [-29.178135, -51.55589],
      title: 'Pousada Gran',
      icon: 'https://composervr.com/resources/pin_places.png',
    },
    {
      latLng: [-29.177635, -51.55585],
      title: 'Pousada Storia',
      icon: 'https://composervr.com/resources/pin_places.png',
    },
    {
      latLng: [-29.17852, -51.556171],
      title: 'Pousada Raízes Café da Manhã',
      icon: 'https://composervr.com/resources/pin_places.png',
    },
  ];

  function touchPin(event) {
    event.target.openTooltip();
  }

  const createNavigation = (event, markerDestino) => {
    if (rota != null) rota.remove();

    rota = L.Routing.control({
      waypoints: [myLocation, markerDestino.latLng],
      lineOptions: {
        styles: [{ color: 'yellow', opacity: 0.47, weight: 5 }],
      },
      language: 'pt-BR',
      profile: 'walk',
    });

    rota.addTo(map);
  };

  function appendLocation(location, verb) {
    verb = verb || 'updated';
    let { latitude, longitude } = location.coords;

    if (
      latitude > -29.1767749998 &&
      latitude < -29.1823869998 &&
      longitude > -51.555339999 &&
      longitude < -51.557104994
    ) {
      setArea(true);
      setMyLocation([latitude, longitude]);

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
    } else {
      setArea(false);
      setMyLocation([-29.17745, -51.556225]);
    }

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
      maxBoundsViscosity: 1.0,
    }).setView([-29.1786595, -51.556], 18);

    map.setMaxBounds(map.getBounds());

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 18,
      maxZoom: 19,
      attribution: '&copy; <a hr7ef="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // G Maps imagens de satélite.
    // var googleHybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    //   maxZoom: 19,
    //   subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    // }).addTo(map);

    let googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      minZoom: 18,
      maxZoom: 19,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(map);

    L.Routing.control({
      waypoints: [
        [-29.17718, -51.55638],
        [-29.17899, -51.556335],
      ],
      lineOptions: {
        styles: [{ color: 'yellow', opacity: 0.47, weight: 5 }],
      },
      language: 'pt-BR',
      profile: 'walk',
    }).addTo(map);

    for (let marker of markers) {
      let ref = L.marker(marker.latLng, {
        title: marker.title,
        icon: new L.DivIcon({
          className: 'pin',
          iconSize: [120, 90],
          html:
            '<img class="pin-icon" src="' +
            marker.icon +
            '" />' +
            '<div class="pin-text">' +
            marker.title +
            '</div>',
        }),
      }).addTo(map);

      let navigateButton = document.createElement('button');
      navigateButton.textContent = 'Navegar até aqui!';
      navigateButton.addEventListener('click', (event) => createNavigation(event, marker));

      var popup = L.popup().setLatLng(marker.latLng).setContent(navigateButton);

      ref.bindPopup(popup);
      ref.addEventListener('click', touchPin);
    }
  }, []);

  return (
    <main className='oil-on-canvas'>
      <div id='map-ll'></div>
      <footer className='form-navegacao'>
        <p>Toque ou clique no pontos para navegar</p>
        {!area && <span>Você não está no complexo</span>}
        <span>{myLocation}</span>
      </footer>
    </main>
  );
}
