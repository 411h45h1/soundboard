import React, { useContext, useState, useEffect } from 'react';
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { AppContext } from '../core/context/AppState';
import { triggerHaptic } from '../utils/haptics';
import { Audio } from 'expo-av';
import { normalize } from '../core/responsive';
import { EditBoardProps, AppContextType } from '../types';
import { GlobalStyles } from '@/constants/styles';
import { Colors } from '@/constants/colors';

const EditBoard: React.FC<EditBoardProps> = ({ navigation, route }) => {
  const { updateBoardItem } = useContext(AppContext) as AppContextType;
  const { fileName, title, sid, src } = route.params;
  const [titleText, setTitleText] = useState<string>(title || '');
  const [duration, setDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadSoundAndGetDuration = async () => {
      try {
        if (!src) {
          setLoading(false);
          return;
        }

        setLoading(true);
        const { sound } = await Audio.Sound.createAsync({ uri: src }, {}, null, false);

        const status = await sound.getStatusAsync();
        if (status.isLoaded && status.durationMillis) {
          setDuration(status.durationMillis);
        }

        await sound.unloadAsync();
        setLoading(false);
      } catch (error) {
        console.error('Error getting audio duration:', error);
        setLoading(false);
      }
    };

    loadSoundAndGetDuration();
  }, [src]);

  const formatDuration = (milliseconds: number | null): string => {
    if (!milliseconds) return 'Unknown length';

    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (titleText.trim()) {
      triggerHaptic('success');
      updateBoardItem(sid, { title: titleText });
      navigation.back();
    } else {
      triggerHaptic('error');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={GlobalStyles.containerWithPadding}>
        <View style={GlobalStyles.marginBottom20}>
          <Text style={[styles.headerText, { fontSize: normalize(35) }]}>Edit sound</Text>
        </View>

        <View style={GlobalStyles.modalContainer}>
          <TouchableOpacity
            style={[GlobalStyles.alignSelfStart, GlobalStyles.marginBottom20]}
            onPress={() => {
              triggerHaptic('selection');
              navigation.back();
            }}
          >
            <AntDesign name="back" size={normalize(20)} color={Colors.white} />
          </TouchableOpacity>

          <View style={GlobalStyles.marginBottom20}>
            <Text style={[styles.labelText, { fontSize: normalize(16) }]}>File Name:</Text>
            <Text style={[styles.valueText, { fontSize: normalize(16) }]}>{fileName}</Text>
          </View>

          {loading ? (
            <View style={[GlobalStyles.marginBottom20, GlobalStyles.alignItemsStart]}>
              <Text style={[styles.labelText, { fontSize: normalize(16) }]}>Length:</Text>
              <ActivityIndicator size="small" color={Colors.text} />
            </View>
          ) : (
            <View style={GlobalStyles.marginBottom20}>
              <Text style={[styles.labelText, { fontSize: normalize(16) }]}>Length:</Text>
              <Text style={[styles.valueText, { fontSize: normalize(16) }]}>
                {formatDuration(duration)}
              </Text>
            </View>
          )}

          <View style={GlobalStyles.marginBottom30}>
            <Text style={[styles.labelText, { fontSize: normalize(16) }]}>Title:</Text>
            <TextInput
              style={[GlobalStyles.input, { fontSize: normalize(16) }]}
              onChangeText={setTitleText}
              value={titleText}
              placeholder="Enter title"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            style={GlobalStyles.buttonSecondary}
            onPress={() => {
              triggerHaptic('medium');
              handleSubmit();
            }}
          >
            <Text style={[GlobalStyles.textBoldLight, { fontSize: normalize(18) }]}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontWeight: 'bold',
    color: Colors.white,
  },
  labelText: {
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  valueText: {
    color: Colors.text,
  },
});

export default EditBoard;
