import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Board from '@/components/Board';
import { ExpoRouterNavigation } from '@/types';
import { GlobalStyles } from '@/constants/styles';

export default function HomeScreen(): React.JSX.Element {
  const router = useRouter();

  const navigation: ExpoRouterNavigation = {
    navigate: router.push,
    push: router.push,
    back: router.back,
    canGoBack: router.canGoBack,
  };

  return (
    <View style={GlobalStyles.container}>
      <Board navigation={navigation} />
    </View>
  );
}
