import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';

export const Sparkline = ({ data, width = 100, height = 30, color }) => {
  const { colors } = useTheme();
  const themeColor = color || colors.primary;

  if (!data || data.length === 0) return null;

  const maxY = Math.max(...data.map(d => d.y), 1);
  const maxX = Math.max(data.length - 1, 1);

  const points = data.map((d, index) => {
    const x = (index / maxX) * width;
    const y = height - (d.y / maxY) * height;
    return { x, y };
  });

  const pathData = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');

  return (
    <View>
      <Svg width={width} height={height}>
        <Path d={pathData} fill="none" stroke={themeColor} strokeWidth="2" />
      </Svg>
    </View>
  );
};
