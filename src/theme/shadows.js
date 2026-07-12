import { Platform } from 'react-native';

const createShadow = (color, offset, opacity, radius, elevationVal) => {
  return Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: offset,
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: {
      elevation: elevationVal,
      shadowColor: color,
    },
    web: {
      boxShadow: `${offset.width}px ${offset.height}px ${radius}px rgba(0,0,0,${opacity})`,
    }
  });
};

export const shadows = {
  none: createShadow('transparent', { width: 0, height: 0 }, 0, 0, 0),
  sm: createShadow('#000', { width: 0, height: 1 }, 0.05, 2, 1),
  md: createShadow('#000', { width: 0, height: 2 }, 0.1, 4, 2),
  lg: createShadow('#000', { width: 0, height: 4 }, 0.1, 6, 4),
  xl: createShadow('#000', { width: 0, height: 8 }, 0.1, 12, 8),
};
