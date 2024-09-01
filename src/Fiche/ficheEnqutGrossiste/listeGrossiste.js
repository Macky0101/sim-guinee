import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Importation des icônes
import Animated, { Layout, FadeIn, FadeOut } from 'react-native-reanimated'; // Importation pour les animations
import { useRoute } from '@react-navigation/native';
import FicheGrossisteservices from '../../../services/serviceAgricultures/ficheGrossiste/serviceGrossiste';

const ListesGrossistesCollect = () => {
  const route = useRoute();
  const { id } = route.params;
  const [loading, setLoading] = useState(false);
  const [filteredCollects, setFilteredCollects] = useState([]);

  useEffect(() => {
    getListeCollect();
  }, []);

  const getListeCollect = async () => {
    setLoading(true);
    try {
      const response = await FicheGrossisteservices.getListesCollectes();
      const filteredData = response.filter(collect => collect.enquete_relation.id === id);
      setFilteredCollects(filteredData);
    } catch (error) {
      console.error('Erreur lors de la récupération des liste de collecte:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {filteredCollects.length > 0 ? (
        filteredCollects.map((collect) => (
          <CollectItem key={collect.id_fiche} collect={collect} />
        ))
      ) : (
        <Text>Aucune collecte trouvée pour cette fiche.</Text>
      )}
    </View>
  );
};

const CollectItem = ({ collect }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity onPress={toggleExpanded} style={styles.collectItem}>
      <View style={styles.header}>
        <Text style={styles.title}>Produit: {collect.produit_relation.nom_produit}</Text>
        <Icon
          name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={20}
          color="#000"
        />
      </View>
      {expanded && (
        <Animated.View 
          style={styles.details} 
          entering={FadeIn.duration(300)} 
          exiting={FadeOut.duration(300)} 
          layout={Layout.springify()}
        >
          <Text>Numéro de Fiche: {collect.enquete_relation.num_fiche}</Text>
          <Text>Client Principal: {collect.client_principal}</Text>
          <Text>Fournisseur Principal: {collect.fournisseur_principal}</Text>
          <Text>Distance à l'Origine du Marché: {collect.distance_origine_marche} km</Text>
          <Text>Niveau d'Approvisionnement: {collect.niveau_approvisionement}</Text>
          <Text>Statut: {collect.statut}</Text>
          <Text>Date d'Enregistrement: {new Date(collect.date_enregistrement).toLocaleDateString()}</Text>
        </Animated.View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collectItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    marginTop: 10,
  },
    noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
});

export default ListesGrossistesCollect;
