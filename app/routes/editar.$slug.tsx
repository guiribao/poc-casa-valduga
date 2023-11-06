//@ts-nocheck
import { useEffect, useRef, useState } from 'react';
import { LoaderArgs, redirect } from '@remix-run/node';
import type { V2_MetaFunction } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import back from '~/assets/img/casa_valduga_2023-4k.png';
import Mapa from '~/graphic/mapa';

import { authenticator } from '~/secure/authentication.server';
import editorStyle from '~/assets/css/editor.css';
import EditorMapa from '~/graphic/editorMapa';
import Visao from '~/graphic/visao';
import pegarMapaPeloSlug from '~/domain/Mapas/pegar-mapa-pelo-slug.server';

export const meta: V2_MetaFunction = () => {
  return [
    {
      charset: 'utf-8',
      title: 'Editar mapa - SmartMap',
      viewport: 'width=device-width, initial-scale=1',
    },
    { name: 'description', content: 'Plataforma SmartMap by SmartComposerVR' },
  ];
};

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: editorStyle }];
};

export async function loader({ request, params }: LoaderArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/entrar',
  });

  let mapa = await pegarMapaPeloSlug(params.slug);

  if (mapa === null) return redirect('/');

  return { mapa };
}

export default function EditarMapa() {
  const canvasRef = useRef(null);
  const { mapa } = useLoaderData();

  const [atributosMapa, setAtributosMapa] = useState({
    points: '',
    segments: '',
    references: '',
  });

  let [nomeMapa, setNomeMapa] = useState(mapa?.titulo);
  let [slugMapa, setSlugMapa] = useState(mapa?.slug);
  let [mapaPrivado, setMapaPrivado] = useState(mapa?.mapa_privado);

  var mapaBackground;

  const frame = (editorMapa) => {
    if (!canvasRef.current) return;

    editorMapa.ctx.clearRect(0, 0, editorMapa.canvas.width, editorMapa.canvas.height);
    editorMapa.ctx.save();

    editorMapa.ctx.scale(editorMapa.visao.zoom, editorMapa.visao.zoom);

    const offset = editorMapa.visao.getOffset();
    editorMapa.ctx.translate(offset.x, offset.y);

    editorMapa.mapa.drawBg(
      editorMapa.visao.ctx,
      mapaBackground,
      editorMapa.visao.zoom,
      editorMapa.visao.canvas.width,
      editorMapa.visao.canvas.height
    );

    editorMapa.display(editorMapa.visao.zoom);
    editorMapa.ctx.restore();

    requestAnimationFrame(() => {
      frame(editorMapa);
    });
  };

  useEffect(() => {
    let canvas = canvasRef.current;

    mapaBackground = new Image();

    mapaBackground.addEventListener('load', (ev) => {
      canvas.width = mapaBackground.width / 2;
      canvas.height = mapaBackground.height / 2;

      const mapaClient = Mapa.load(
        mapa?.pontos || [],
        mapa?.caminhos || [],
        mapa?.referencias || []
      );
      const visao = new Visao(canvas, {
        mainWidth: document.querySelector('.oil-on-canvas')?.clientWidth,
        mainHeight: document.querySelector('.oil-on-canvas')?.clientHeight,
      });
      const editorMapa = new EditorMapa(visao, mapaClient);

      window.addEventListener('message', (event) => {
        if (event.data.action === 'changeTool') {
          editorMapa.trocarFerramenta(event.data.tool);
        }
      });

      setAtributosMapa(editorMapa.mapa);

      requestAnimationFrame(() => {
        frame(editorMapa);
      });
    });

    mapaBackground.src = mapa.background;
  }, []);

  async function saveMap() {
    let saved = await fetch('/salvar/12', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        titulo: nomeMapa,
        slug: slugMapa,
        background: mapaBackground,
        mapaPrivado: mapaPrivado,
        atributos: atributosMapa,
      }),
    });
  }

  return (
    <main className='oil-on-canvas'>
      <canvas id='editor' ref={canvasRef}></canvas>
      <div className='atributos'>
        <input
          type='text'
          name='nome'
          placeholder='Nome do mapa'
          defaultValue={nomeMapa}
          onChange={(event) => setNomeMapa(event.target.value)}
        />
        <input
          type='text'
          name='slug'
          placeholder='Slug'
          defaultValue={slugMapa}
          onChange={(event) => setSlugMapa(event.target.value)}
        />
        <div className='privado'>
          <label htmlFor='privado'>Privado</label>
          <input
            type='checkbox'
            name='privado'
            id='privado'
            defaultChecked={mapaPrivado}
            onChange={(event) => setMapaPrivado(event.target.checked)}
          />
        </div>

        <button onClick={saveMap} id='salvar'>
          Salvar mapa
        </button>
      </div>
    </main>
  );
}
