import React from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { PopupModalProps } from '../types';
import { Colors } from '@/constants/colors';

const PopupModal: React.FC<PopupModalProps> = ({
  visible,
  onClose,
  children,
  height,
  width = '80%',
  backgroundColor = Colors.button,
  borderRadius,
  padding = 20,
}) => {
  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose} animationType="fade">
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          onClose();
        }}
      >
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View
              style={[
                styles.modalView,
                {
                  width: width,
                  padding,
                  backgroundColor: backgroundColor,
                  borderRadius: borderRadius || 20,
                },
                height ? { height } : {},
              ]}
            >
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.overlay,
  },
  modalView: {
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '80%',
  },
});

export default PopupModal;
