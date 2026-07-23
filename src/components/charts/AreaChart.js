import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';

export const AreaChart = ({ data, width = 300, height = 200, color }) => {
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

  const pathDataLine = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  const pathDataArea = `${pathDataLine} L ${width} ${height} L 0 ${height} Z`;

  return (
    <View>
      <Svg width={width} height={height}>
        <Path d={pathDataArea} fill={themeColor} fillOpacity="0.2" />
        <Path d={pathDataLine} fill="none" stroke={themeColor} strokeWidth="2" />
      </Svg>
    </View>
  );
};
