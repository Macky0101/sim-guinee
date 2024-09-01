import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import { Image, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const IntroScreens = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={['#008148', '#005849']}
      style={{ flex: 1 }}
    >
      <Onboarding
        onSkip={() => navigation.replace('Login')}
        onDone={() => navigation.replace('Login')}
        nextLabel="Suivant"
        skipLabel="Passer"
        doneLabel="Terminé"
        containerStyles={{ backgroundColor: 'transparent' }}
        pages={[
          {
            backgroundColor: 'transparent',
            image: <Image source={require('../../assets/images/agriculture.png')} style={styles.image} />,
            title: 'Agriculture',
            subtitle: 'test',
          },
          {
            backgroundColor: 'transparent',
            image: <Image source={require('../../assets/images/peche.png')} style={styles.image} />,
            title: 'Peche',
            subtitle: 'test',
          },
          {
            backgroundColor: 'transparent',
            image: <Image source={require('../../assets/images/elevage.png')} style={styles.image} />,
            title: 'Bétail',
            subtitle: 'test',
          },
          {
            backgroundColor: 'transparent',
            image: <Image source={require('../../assets/images/stock-min.jpg')} style={styles.image} />,
            title: "Stocks d'intrants agricoles",
            subtitle: 'test',
          },
        ]}
        DotComponent={({ selected }) => (
          <View
            style={[
              styles.dot,
              { backgroundColor: selected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)' }
            ]}
          />
        )}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
    // marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
});

export default IntroScreens;