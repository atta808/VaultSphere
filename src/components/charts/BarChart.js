import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';

export const BarChart = ({ data, width = 300, height = 200, color }) => {
  const { colors } = useTheme();
  const themeColor = color || colors.primary;

  if (!data || data.length === 0) {
    return <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}><Text>No data</Text></View>;
  }

  const maxY = Math.max(...data.map(d => d.y), 1);
  const barWidth = (width / data.length) * 0.8;
  const spacing = (width / data.length) * 0.2;

  return (
    <View>
      <Svg width={width} height={height}>
        {data.map((d, index) => {
          const barHeight = (d.y / maxY) * height;
          const x = index * (barWidth + spacing) + spacing / 2;
          const y = height - barHeight;
          return (
            <Rect key={index} x={x} y={y} width={barWidth} height={barHeight} fill={themeColor} rx="4" ry="4" />
          );
        })}
      </Svg>
    </View>
  );
};
