import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Svg, { Defs, Pattern, Rect, Line } from "react-native-svg";

interface ImigongoPatternProps {
  opacity?: number;
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
}

export default function ImigongoPattern({
  opacity = 0.06,
  style,
  width = 400,
  height = 800,
}: ImigongoPatternProps) {
  return (
    <Svg
      width={width}
      height={height}
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity,
        },
        style,
      ]}
    >
      <Defs>
        <Pattern
          id="imigongo"
          patternUnits="userSpaceOnUse"
          width="40"
          height="40"
          patternTransform="rotate(45)"
        >
          <Line
            x1="0"
            y1="0"
            x2="0"
            y2="40"
            stroke="#FF5A1F"
            strokeWidth="3"
          />
          <Line
            x1="10"
            y1="0"
            x2="10"
            y2="40"
            stroke="#F5A623"
            strokeWidth="2"
          />
          <Line
            x1="20"
            y1="0"
            x2="20"
            y2="40"
            stroke="#0F0E17"
            strokeWidth="4"
          />
          <Line
            x1="30"
            y1="0"
            x2="30"
            y2="40"
            stroke="#FF5A1F"
            strokeWidth="1.5"
          />
          <Line
            x1="36"
            y1="0"
            x2="36"
            y2="40"
            stroke="#F5A623"
            strokeWidth="1"
          />
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#imigongo)" />
    </Svg>
  );
}
