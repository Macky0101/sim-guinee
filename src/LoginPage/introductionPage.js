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
            image: <Image source={require('../../assets/images/logo.png')} style={styles.image} />,
            title: 'Bienvenues !',
            subtitle: 'sur le suivi et collecte des données',
          },
          {
            backgroundColor: 'transparent',
            image: <Image source={require('../../assets/images/agriculture.png')} style={styles.image} />,
            title: 'Agriculture',
            subtitle: "Enregistrer des informations essentielles sur les produits agricoles. Ces données sont cruciales pour analyser les tendances du marché, évaluer les besoins d'approvisionnement et améliorer les stratégies agricoles. ",
          },
          {
            backgroundColor: 'transparent',
            image: <Image source={require('../../assets/images/peche.png')} style={styles.image} />,
            title: 'Pêche',
            subtitle: "Cette section vous permet de saisir des informations détaillées sur les produits de la pêche. Les données que vous entrez, telles que le prix par unité et les niveaux d'approvisionnement, sont essentielles pour comprendre les dynamiques du marché de la pêche",
          },
          {
            backgroundColor: 'transparent',
            image: <Image source={require('../../assets/images/elevage.png')} style={styles.image} />,
            title: 'Élevage',
            subtitle: "Dans cette section, vous collecterez des données importantes sur l'élevage, y compris les informations sur les quantités de produits, les prix de vente, et les principaux fournisseurs. Ces données sont essentielles pour suivre l'évolution des stocks et pour prendre des décisions éclairées sur la gestion des ressources d'élevage.",
          },
          {
            backgroundColor: 'transparent',
            image: <Image source={require('../../assets/images/stock-min.jpg')} style={styles.image} />,
            title: "Stocks d'intrants agricoles",
            subtitle: "Cette section est dédiée à la collecte de données sur les stocks d'intrants agricoles. Ces informations sont cruciales pour garantir que les agriculteurs disposent des ressources nécessaires pour maximiser leur production. En documentant les niveaux de stock, les prix, et les conditions d'approvisionnement, vous aidez à éviter les pénuries et à maintenir la stabilité du marché.",
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