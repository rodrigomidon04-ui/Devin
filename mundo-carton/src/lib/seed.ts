import type { Product, Video } from './types'

/**
 * Contenido de ejemplo que se muestra en modo demo, para ver la página llena
 * antes de cargar los videos y productos de verdad.
 */

const SAMPLE_MP4 =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
const SAMPLE_MP4_2 =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'

function at(minutesAgo: number): string {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString()
}

export const seedVideos: Video[] = [
  {
    id: 'seed-video-1',
    created_at: at(10),
    title: 'Robot de cartón que mueve los brazos',
    description:
      'Con dos cajas de zapatos, tapitas y un poco de cinta armamos un robot gigante. Video de ejemplo.',
    category: 'juguetes',
    video_url: SAMPLE_MP4,
    storage_path: null,
  },
  {
    id: 'seed-video-2',
    created_at: at(60),
    title: 'Sillón para chicos con cajas recicladas',
    description:
      'Paso a paso para armar un sillón resistente usando cartón corrugado doble. Video de ejemplo.',
    category: 'muebles',
    video_url: SAMPLE_MP4_2,
    storage_path: null,
  },
  {
    id: 'seed-video-3',
    created_at: at(200),
    title: 'Ciudad de cartón para los autitos',
    description:
      'Rutas, casas y semáforos pintados con témpera para jugar en el piso. Video de ejemplo.',
    category: 'decoracion',
    video_url: SAMPLE_MP4,
    storage_path: null,
  },
  {
    id: 'seed-video-4',
    created_at: at(500),
    title: '5 trucos para cortar y pegar cartón sin romperlo',
    description:
      'Cómo doblar, reforzar esquinas y usar cola de manera prolija. Video de ejemplo.',
    category: 'trucos',
    video_url: SAMPLE_MP4_2,
    storage_path: null,
  },
]

export const seedProducts: Product[] = [
  {
    id: 'seed-product-1',
    created_at: at(20),
    name: 'Cocinita de cartón pintada',
    description:
      'Con horno, hornallas y perillas que giran. Armada con cartón reciclado y pinturas al agua.',
    category: 'juguetes',
    price: 1490,
    age_range: '3 a 7 años',
    image_url: null,
    storage_path: null,
  },
  {
    id: 'seed-product-2',
    created_at: at(90),
    name: 'Casita para jugar (tamaño real)',
    description:
      'Casa de 1,20 m de alto con techo, puerta y ventanas. Se dobla para guardarla.',
    category: 'juguetes',
    price: 3900,
    age_range: '2 a 8 años',
    image_url: null,
    storage_path: null,
  },
  {
    id: 'seed-product-3',
    created_at: at(150),
    name: 'Mesita de cartón corrugado',
    description:
      'Mesa baja para dibujar, aguanta hasta 20 kg. Terminación con barniz al agua.',
    category: 'muebles',
    price: 2650,
    age_range: '3 años o más',
    image_url: null,
    storage_path: null,
  },
  {
    id: 'seed-product-4',
    created_at: at(220),
    name: 'Banquito apilable de cartón',
    description:
      'Liviano, resistente y fácil de mover. Se puede pintar con los chicos.',
    category: 'muebles',
    price: 990,
    age_range: '3 años o más',
    image_url: null,
    storage_path: null,
  },
  {
    id: 'seed-product-5',
    created_at: at(300),
    name: 'Letras del nombre en 3D',
    description:
      'Letras de 20 cm para decorar la habitación, pintadas del color que elijas.',
    category: 'decoracion',
    price: 320,
    age_range: 'Todas las edades',
    image_url: null,
    storage_path: null,
  },
  {
    id: 'seed-product-6',
    created_at: at(420),
    name: 'Rompecabezas de animales',
    description:
      'Seis animales troquelados en cartón grueso para encastrar y pintar.',
    category: 'didacticos',
    price: 540,
    age_range: '4 a 9 años',
    image_url: null,
    storage_path: null,
  },
]
