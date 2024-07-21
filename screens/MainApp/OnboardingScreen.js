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
          title: 'Create a Customized Schedule with Ease',
          subtitle: 'Personalize Your Daily Plans by Adding Unique Schedules',
        },
        {
          backgroundColor: '#fff',
          image: <Image source={require('../../assets/AddPurposeScreen.jpg')} style={styles.image} />,
          title: 'Enhance Your Schedule with Purpose',
          subtitle: 'Easily Add Friends and Share Your Plans Effortlessly',
          },
          {
            backgroundColor: '#fff',
            image: <Image source={require('../../assets/SharePurposeScreen.jpg')} style={styles.image} />,
            title: 'Connecting with Friends and Sharing Schedules',
            subtitle: 'Easily Add Friends and Share Your Plans Effortlessly',
          },
          {
            backgroundColor: '#fff',
            image: <Image source={require('../../assets/SettingScreen.jpg')} style={styles.image} />,
            title: 'Adjust Your Budget Allocation to Fit Your Needs',
            subtitle: 'Customize Your Spending Categories for Better Financial Management in Settings',
          },
          {
            backgroundColor: '#fff',
            image: <Image source={require('../../assets/HomeScreen.jpg')} style={styles.image} />,
            title: 'Stay Within Budget with Real-Time Alerts',
            subtitle: 'Visual Indicators to Help You Manage Your Spending',
          }
      ]}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
  }
});
