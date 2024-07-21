import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { database } from '../../App';
import { getAuth } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';

export const OnboardingScreen = () => {
  const navigation = useNavigation();

  const onDone = useCallback(async () => {
    const auth = getAuth();
    if (auth.currentUser) {
      await updateDoc(doc(database, "users", auth.currentUser.uid), {
        firstLoggedIn: false
      });
    }
    navigation.navigate('Drawer');
  }, [navigation]);

  return (
    <Onboarding
      onDone={onDone}
      showSkip={false}
      pages={[
        {
          backgroundColor: '#fff',
          image: <Image source={require('../../assets/icon.png')} style={styles.image} />,
          title: 'Welcome',
          subtitle: 'Welcome to our app, let us start our journey together',
        },
        {
          backgroundColor: '#fff',
          image: <Image source={require('../../assets/AddScheduleScreen.jpg')} style={styles.image} />,
          title: 'Friendly Work Environment',
          subtitle: 'We offer a friendly and productive work environment.',
        },
        {
          backgroundColor: '#fff',
          image: <Image source={require('../../assets/AddPurposeScreen.jpg')} style={styles.image} />,
          title: 'Join Our Team',
          subtitle: 'Join our team to achieve more together!',
          },
          {
            backgroundColor: '#fff',
            image: <Image source={require('../../assets/SharePurposeScreen.jpg')} style={styles.image} />,
            title: 'Friendly Work Environment',
            subtitle: 'We offer a friendly and productive work environment.',
          },
          {
            backgroundColor: '#fff',
            image: <Image source={require('../../assets/SettingScreen.jpg')} style={styles.image} />,
            title: 'Friendly Work Environment',
            subtitle: 'We offer a friendly and productive work environment.',
          },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  }
});
