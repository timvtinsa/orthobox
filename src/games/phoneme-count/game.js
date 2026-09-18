import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'phoneme-count',
  title: 'Combien de sons ?',
  tagline: 'Compter les phonèmes d’un mot, plus fins que ses syllabes.',
  category: 'oral-language',
  cover,
  ages: '5 ans et plus',
  keywords: ['phonèmes', 'conscience phonémique', 'segmentation', 'oral'],
  objectives: [
    'Conscience phonémique, plus fine que la conscience syllabique',
    'Segmentation d’un mot en unités sonores minimales',
    'Dissociation entre l’écrit et le compte de sons entendus',
  ],
  materials: [
    'Un phonème n’est pas une lettre : « chat » s’écrit en quatre lettres mais se '
      + 'découpe en deux sons, [ch] et [a].',
    'La banque écarte les mots dont la coupe est discutable (voyelle glissée comme '
      + 'dans « oi », e muet incertain comme dans « cheval »), pour que le compte ne '
      + 'se discute pas.',
    'Ce jeu se propose après « Combien de syllabes ? », une fois le découpage '
      + 'syllabique posé : la même consigne, sur une unité plus petite.',
  ],
  instructions:
    'Un mot est proposé, écrit et prononçable par le bouton d’écoute. Le patient '
    + 'compte ses sons (et non ses lettres), puis touche le nombre correspondant.',
  settings: [
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre de mots',
      hint: 'Huit à douze mots pour une passation courte.',
      min: 4,
      max: 20,
      default: 10,
    },
    {
      id: 'range',
      type: 'choice',
      label: 'Longueur des mots',
      default: 'upTo3',
      options: [
        { id: 'upTo3', label: "Jusqu'à 3", hint: 'Deux à trois sons.' },
        { id: 'upTo5', label: "Jusqu'à 5", hint: 'Deux à cinq sons, mots plus longs.' },
      ],
    },
    {
      id: 'written',
      type: 'choice',
      label: 'Mot écrit',
      default: 'shown',
      options: [
        { id: 'shown', label: 'Affiché', hint: 'L’écrit reste visible, mais ses lettres ne se comptent pas.' },
        { id: 'hidden', label: 'Masqué', hint: 'Comptage à l’oreille seule, sans le piège des lettres.' },
      ],
    },
  ],
  component: lazy(() => import('./PhonemeCount.jsx')),
}
