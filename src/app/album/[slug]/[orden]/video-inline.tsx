'use client'

import { useRef, useState } from 'react'

const mm = (n: number) => `calc(${n} * var(--mm))`

/** Vídeo dentro de una foto del scrapbook.
 *
 *  Se ve como una copia más —el póster fijo, dentro de su marco— hasta que
 *  se toca: entonces se reproduce con sonido, en el mismo sitio, sin salir
 *  del álbum. El QR sigue existiendo para el papel; esto es solo para la
 *  versión en pantalla, donde tener que escanear un código teniendo el vídeo
 *  delante no tendría sentido.
 */
export default function VideoInline({
  poster,
  fuente,
  titulo,
  duracion,
}: {
  poster: string | null
  fuente: string | null
  titulo: string | null
  /** Segundos, para mostrar la duración sobre el póster. */
  duracion: number | null
}) {
  const ref = useRef<HTMLVideoElement | null>(null)
  const [reproduciendo, setReproduciendo] = useState(false)

  function alternar() {
    const v = ref.current
    if (!v) return
    if (v.paused) {
      v.play()
      setReproduciendo(true)
    } else {
      v.pause()
      setReproduciendo(false)
    }
  }

  const mmss =
    duracion != null
      ? `${Math.floor(duracion / 60)}:${String(Math.round(duracion % 60)).padStart(2, '0')}`
      : null

  return (
    <div
      onClick={alternar}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          alternar()
        }
      }}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: '#E6E9E2',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {fuente ? (
        <video
          ref={ref}
          src={fuente}
          poster={poster ?? undefined}
          playsInline
          preload="none"
          onEnded={() => setReproduciendo(false)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      ) : poster ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={poster}
          alt={titulo ?? ''}
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      ) : null}

      {/* Botón de play y duración: solo mientras no se reproduce. */}
      {!reproduciendo ? (
        <div
          aria-hidden
          className="control-video"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(35,45,40,0.12)',
          }}
        >
          <span
            style={{
              width: mm(13),
              height: mm(13),
              borderRadius: '50%',
              background: 'rgba(255,253,248,0.92)',
              boxShadow: '0 1px 6px rgba(40,35,25,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                marginLeft: mm(1),
                width: 0,
                height: 0,
                borderTop: `${mm(3.4)} solid transparent`,
                borderBottom: `${mm(3.4)} solid transparent`,
                borderLeft: `${mm(5.4)} solid #2E3A34`,
              }}
            />
          </span>
          {mmss ? (
            <span
              style={{
                position: 'absolute',
                right: mm(3),
                bottom: mm(3),
                padding: `${mm(0.6)} ${mm(1.8)}`,
                borderRadius: mm(2),
                background: 'rgba(35,45,40,0.7)',
                color: '#FFFDF8',
                fontSize: mm(2.7),
              }}
            >
              {mmss}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
