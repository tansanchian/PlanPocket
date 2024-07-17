import React from "react";
import { View, StyleSheet } from "react-native";
import { Svg, Path, Circle, Text as CText } from "react-native-svg";

const Donut = (item) => {
  console.log(item.item);
  const data = [
    { key: 1, amount: 300, svg: { fill: "#CCCCCC" }, label: "Other" },
    { key: 2, amount: 62.5, svg: { fill: "#FF6384" }, label: "Food" },
    { key: 3, amount: 30, svg: { fill: "#36A2EB" }, label: "Fuel" },
    { key: 4, amount: 20, svg: { fill: "#FFCE56" }, label: "Health" },
    { key: 5, amount: 12.5, svg: { fill: "#4BC0C0" }, label: "Others" },
  ];

  const widthAndHeight = 200;
  const radius = widthAndHeight / 2;
  const innerRadius = 0.6 * radius;

  const createDonutChart = () => {
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    let cumulativeAngle = 0;

    return data.map((item, index) => {
      const valueAngle = (item.amount / total) * 2 * Math.PI;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + valueAngle;
      cumulativeAngle += valueAngle;

      const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

      const startX = radius + radius * Math.cos(startAngle);
      const startY = radius - radius * Math.sin(startAngle);
      const endX = radius + radius * Math.cos(endAngle);
      const endY = radius - radius * Math.sin(endAngle);

      const innerStartX = radius + innerRadius * Math.cos(startAngle);
      const innerStartY = radius - innerRadius * Math.sin(startAngle);
      const innerEndX = radius + innerRadius * Math.cos(endAngle);
      const innerEndY = radius - innerRadius * Math.sin(endAngle);

      const pathData = [
        `M ${startX} ${startY}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${endX} ${endY}`,
        `L ${innerEndX} ${innerEndY}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerStartX} ${innerStartY}`,
        `Z`,
      ].join(" ");

      return <Path key={index} d={pathData} fill={item.svg.fill} />;
    });
  };

  return (
    <View>
      <Svg width={widthAndHeight} height={widthAndHeight}>
        {createDonutChart()}
        <Circle cx={radius} cy={radius} r={innerRadius} fill="#f3eef6" />
        <CText
          x={radius}
          y={radius}
          fill="black"
          fontSize="16"
          fontWeight="bold"
          textAnchor="middle"
          dy=".3em"
        >
          Current
        </CText>
        <CText
          x={radius}
          y={radius + 20}
          fill="black"
          fontSize="16"
          fontWeight="bold"
          textAnchor="middle"
          dy=".3em"
        >
          Spend
        </CText>
      </Svg>
    </View>
  );
};

export default Donut;