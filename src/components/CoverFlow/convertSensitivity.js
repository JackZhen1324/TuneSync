import { SENSITIVITY_LOW, SENSITIVITY_NORMAL, SENSITIVITY_HIGH } from './constants';

export default function convertSensitivity(sensitivity) {
  switch (sensitivity) {
    case SENSITIVITY_LOW:
      return 120;
    case SENSITIVITY_HIGH:
      return 40;
    case SENSITIVITY_NORMAL:
    default:
      return 60;
  }
}