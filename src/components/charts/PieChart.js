import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

export const PieChart = ({ data, size = 200 }) => {
  if (!data || data.length === 0) {
    return <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}><Text>No data</Text></View>;
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);
  let startAngle = 0;
  const center = size / 2;
  const radius = size / 2;

  return (
    <View>
      <Svg width={size} height={size}>
        <G transform={`translate(${center}, ${center})`}>
          {data.map((d, index) => {
            if (d.value === 0) return null;

            const sliceAngle = (d.value / total) * 360;
            const endAngle = startAngle + sliceAngle;

            const x1 = Math.cos((Math.PI / 180) * startAngle) * radius;
            const y1 = Math.sin((Math.PI / 180) * startAngle) * radius;
            const x2 = Math.cos((Math.PI / 180) * endAngle) * radius;
            const y2 = Math.sin((Math.PI / 180) * endAngle) * radius;

            const largeArcFlag = sliceAngle > 180 ? 1 : 0;
            const pathData = [
              'M 0 0',
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            startAngle = endAngle;

            return <Path key={index} d={pathData} fill={d.color || '#000'} />;
          })}
        </G>
      </Svg>
    </View>
  );
};
