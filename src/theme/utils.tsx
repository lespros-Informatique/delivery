import { blue, green, indigo, purple, teal, orange, red, pink, cyan } from './colors';
import { ColorWithAlphas } from './colors';

export const getPrimary = (preset: string): ColorWithAlphas => {
  switch (preset) {
    case 'blue':
      return blue;
    case 'green':
      return green;
    case 'indigo':
      return indigo;
    case 'purple':
      return purple;
    case 'teal':
      return teal;
    case 'orange':
      return orange;
    case 'red':
      return red;
    case 'pink':
      return pink;
    case 'cyan':
      return cyan;
    default:
      console.error('Invalid color preset');
      return blue;
  }
};
