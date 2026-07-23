import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';

export const LineChart = ({ data, width = 300, height = 200, color }) => {
  const { colors } = useTheme();
  const themeColor = color || colors.primary;

  if (!data || data.length === 0) {
    return <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}><Text>No data</Text></View>;
  }

  const maxY = Math.max(...data.map(d => d.y), 1);
  const minX = 0;
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
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r="4" fill={themeColor} />
        ))}
      </Svg>
    </View>
  );
};
