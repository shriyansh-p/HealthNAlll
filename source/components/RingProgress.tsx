import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import SVG, { Circle, LinearGradient, Defs, Stop } from 'react-native-svg'
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type RingProgressProps = {
  radius?: number;
  strokeWidth?: number;
  progress: number;
};

const RingProgress = ({ radius = 100, strokeWidth = 20, progress }: RingProgressProps) => {
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;

  const fill = useSharedValue(0);

  useEffect(() => {
    fill.value = withTiming(progress, { duration: 3000 });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDasharray: [circumference * fill.value, circumference],
  }));

  // Calculate current progress percentage (0-100)
  const progressPercentage = Math.round(progress * 100);

  return (
    <View style={{ width: radius * 2, height: radius * 2, alignSelf: 'center' }}>
      <SVG>
        <Defs>
          <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#4F9BFF" />
            <Stop offset="100%" stopColor="#0057D9" />
          </LinearGradient>
        </Defs>
        
        
        {/* Progress Circle with Gradient */}
        <AnimatedCircle
          animatedProps={animatedProps}
          r={innerRadius}
          cx={radius}
          cy={radius}
          strokeWidth={strokeWidth}
          stroke={"url(#progressGradient)"}
          strokeLinecap="round"
          rotation="-90"
          originX={radius}
          originY={radius}
        />
        
        {/* Drop Shadow Effect */}
        <Circle
          r={innerRadius}
          cx={radius}
          cy={radius}
          strokeWidth={1}
          stroke={"rgba(150, 150, 150, 0.1)"}
          fill="transparent"
          filter="drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))"
        />
      </SVG>
      
      {/* Center Text showing progress percentage */}
      <View style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <Text style={{ 
          fontSize: radius * 0.35, 
          fontWeight: 'bold', 
          color: '#0057D9'
        }}>
          {progressPercentage}%
        </Text>
        <Text style={{ 
          fontSize: radius * 0.15, 
          color: '#666', 
          marginTop: 5 
        }}>
          of goal
        </Text>
      </View>
    </View>
  )
}

export default RingProgress