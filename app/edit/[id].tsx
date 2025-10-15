import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import EditBoard from '@/components/EditBoard';
import { View } from 'react-native';
import { ExpoRouterNavigation, EditBoardRoute } from '@/types';
import { GlobalStyles } from '@/constants/styles';

export default function EditScreen(): React.JSX.Element {
  const params = useLocalSearchParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const fileName = typeof params.fileName === 'string' ? params.fileName : '';
  const title = typeof params.title === 'string' ? params.title : '';
  const src = typeof params.src === 'string' ? params.src : '';
  const router = useRouter();

  const navigation: ExpoRouterNavigation = {
    navigate: router.push,
    push: router.push,
    back: router.back,
    canGoBack: router.canGoBack,
  };

  const route: EditBoardRoute = {
    params: {
      fileName: fileName || '',
      title: title || '',
      sid: parseInt(id || '0', 10),
      src: src || '',
    },
  };

  return (
    <View style={GlobalStyles.container}>
      <EditBoard navigation={navigation} route={route} />
    </View>
  );
}
