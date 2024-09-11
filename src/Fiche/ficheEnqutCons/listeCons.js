import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { Layout, FadeIn, FadeOut } from 'react-native-reanimated';
import { useRoute } from '@react-navigation/native';
import FicheConsommationService from '../../../services/serviceAgricultures/ficheConsommation/serviceConsommation';
import { getConsommationData, deleteConsommation } from '../../../database/requetteCons';
import { getData } from '../../../database/db';
import { Searchbar, FAB, Dialog, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import FormConso from '../../../services/serviceAgricultures/ficheConsommation/serviceFormulaireCons';

const ListesConso = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, num_fiche } = route.params;
  const [loading, setLoading] = useState(false);
  const [filteredCollects, setFilteredCollects] = useState([]);
  const [produits, setProduits] = useState({});
  const [communes, setCommunes] = useState([]);
  const [uniteMesures, setUniteMesures] = useState([]);
  const [collectes, setCollectes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollecte, setSelectedCollecte] = useState(null); // Collecte sélectionnée
  const [dialogVisible, setDialogVisible] = useState(false); // Visibilité du dialog

  useEffect(() => {
    const loadProduits = async () => {
      const produitsData = await getData('produits');
      setProduits(produitsData || {});
    };
    loadProduits();
  }, []);

  useEffect(() => {
    const loadUniteMesures = async () => {
      const uniteMesuresData = await getData('uniteMesures');
      setUniteMesures(uniteMesuresData || []);
    };
    loadUniteMesures();
  }, []);

  useEffect(() => {
    const fetchConsommation = async () => {
      try {
        setLoading(true); // Ajout de l'indicateur de chargement
        const allCollectes = await getConsommationData();
        const filteredCollectes = allCollectes.filter(
          (collecte) => collecte.num_fiche === num_fiche
        );
        setCollectes(filteredCollectes);
        console.log('Liste des consommations', filteredCollectes);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des collectes:', error);
        setLoading(false);
      }
    };
    fetchConsommation();
  }, [num_fiche]);

  const getProduitInfo = (codeProduit) => {
    for (const category in produits) {
      const foundProduit = produits[category]?.find((prod) => prod.value === codeProduit);
      if (foundProduit) {
        return foundProduit;
      }
    }
    return null;
  };

  const getUniteInfo = (codeUnite) => {
    const codeUniteString = String(codeUnite);
    const unite = uniteMesures.find((unite) => String(unite.value) === codeUniteString);
    return unite?.label || 'N/A';
  };

  const handlePress = (collecte) => {
    // Fonction pour gérer la sélection d'une collecte
    Alert.alert('Collecte sélectionnée', `Produit: ${getProduitInfo(collecte.produit)?.label}`);
  };

  const handleLongPress = (collecte) => {
    setSelectedCollecte(collecte);
    setDialogVisible(true);
  };

  const handleDelete = async () => {
    if (selectedCollecte) {
      await deleteConsommation(selectedCollecte.id);
      setCollectes(collectes.filter((c) => c.id !== selectedCollecte.id));
      setDialogVisible(false);
    }
  };

  const filteredCollectes = collectes.filter(collecte => {
    const produitInfo = getProduitInfo(collecte.produit);
    return produitInfo && produitInfo.label.toLowerCase().includes(searchQuery.toLowerCase());
  });
  const postFormConso = async () => {
    try {
      setLoading(true);
      let allSent = true; // Indicateur pour vérifier si tous les enregistrements ont été envoyés
  
      // Parcourir chaque collecte à envoyer
      for (const collecte of collectes) {
        const ficheData = {
          unite: collecte.unite,
          poids_unitaire: String(collecte.poids_unitaire), // Convertir en chaîne de caractères
          prix_mesure: parseFloat(collecte.prix_mesure),
          prix_fg_kg: parseFloat(collecte.prix_fg_kg),
          prix_kg_litre: parseFloat(collecte.prix_kg_litre),
          niveau_approvisionement: collecte.niveau_approvisionnement,
          document: collecte.document || '', // Assurez-vous que document est une chaîne vide s'il est non défini
          statut: collecte.statut,
          observation: collecte.observation,
          enquete: collecte.enquete,
          produit: collecte.produit,
        };
        console.log('ficheData', ficheData);
  
        try {
          // Envoi de l'enregistrement à l'API
          await FormConso.postFormConso(ficheData);
          console.log(`Enregistrement ${collecte.id} envoyé avec succès.`);
  
          // Suppression de l'enregistrement local si l'envoi a réussi
          await deleteConsommation(collecte.id);
          setCollectes((prevCollectes) => prevCollectes.filter((c) => c.id !== collecte.id));
        } catch (error) {
          console.error(`Erreur lors de l'envoi de l'enregistrement ${collecte.id}:`, error);
          Alert.alert(
            'Erreur',
            `Impossible d'envoyer l'enregistrement "${getProduitInfo(collecte.produit)?.label}". Veuillez vérifier votre connexion et réessayer.`
          );
          allSent = false; // Marquer qu'il y a eu une erreur
          break; // Interrompre le processus en sortant de la boucle
        }
      }
  
      if (allSent) {
        // Tous les enregistrements ont été envoyés avec succès
        Alert.alert('Succès', 'Tous les enregistrements ont été envoyés avec succès.');
      } else {
        // Certains enregistrements n'ont pas été envoyés
        Alert.alert(
          'Envoi interrompu',
          'L\'envoi a été interrompu en raison d\'une erreur. Les enregistrements non envoyés sont conservés.'
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données:", error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'envoi des enregistrements.');
    } finally {
      setLoading(false);
    }
  };
  
  // const postFormConso = async () => {
  //   try {
  //     setLoading(true);

  //     // Parcourir chaque collecte à envoyer
  //     for (const collecte of collectes) {
  //       const ficheData = {
  //         unite: collecte.unite,
  //         poids_unitaire: String(collecte.poids_unitaire), // Convertir en chaîne de caractères
  //         prix_mesure: parseFloat(collecte.prix_mesure),
  //         prix_fg_kg: parseFloat(collecte.prix_fg_kg),
  //         prix_kg_litre: parseFloat(collecte.prix_kg_litre),
  //         niveau_approvisionement: collecte.niveau_approvisionnement,
  //         document: collecte.document || '', // Assurez-vous que document est une chaîne vide s'il est non défini
  //         statut: collecte.statut,
  //         observation: collecte.observation,
  //         enquete: collecte.enquete,
  //         produit: collecte.produit,
  //       };
  //       console.log('ficheData', ficheData);

  //       try {
  //         // Envoi de l'enregistrement à l'API
  //         await FormConso.postFormConso(ficheData);
  //         console.log(`Enregistrement ${collecte.id} envoyé avec succès.`);

  //         // Suppression de l'enregistrement local si l'envoi a réussi
  //         await deleteConsommation(collecte.id);
  //         setCollectes(prevCollectes => prevCollectes.filter(c => c.id !== collecte.id));

  //       } catch (error) {
  //         console.error(`Erreur lors de l'envoi de l'enregistrement ${collecte.id}:`, error);
  //         Alert.alert(
  //           'Erreur',
  //           `Impossible d'envoyer l'enregistrement ${getProduitInfo(collecte.produit)?.label}. Veuillez réessayer.`

  //         );
  //       }
  //     }

  //     // Tous les enregistrements ont été envoyés
  //     Alert.alert('Succès', 'Tous les enregistrements ont été envoyés avec succès.');

  //   } catch (error) {
  //     console.error('Erreur lors de l\'envoi des données:', error);
  //     Alert.alert('Erreur', 'Une erreur est survenue lors de l\'envoi des enregistrements.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };





  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal
        transparent={true}
        animationType="none"
        visible={loading}
        onRequestClose={() => { }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </View>
      </Modal>
      <Searchbar
        placeholder="Rechercher un produit"
        onChangeText={query => setSearchQuery(query)}
        value={searchQuery}
        style={styles.searchbar}
      />
      <ScrollView>
        {filteredCollectes.map((collecte, index) => {
          const produitInfo = getProduitInfo(collecte.produit);
          const uniteInfo = getUniteInfo(collecte.unite);

          return (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => handlePress(collecte)}
              onLongPress={() => handleLongPress(collecte)}
            >
              {produitInfo && (
                <>
                  <Image source={{ uri: produitInfo.image }} style={styles.produitImage} />
                  <View style={styles.infoContainer}>
                    <Text style={styles.produitLabel}>{produitInfo.label}</Text>
                    <Text>Unité : <Text style={styles.label}>{uniteInfo}</Text></Text>
                    <Text>Niveau d'Approvisionnement: <Text style={styles.label}>{collecte.niveau_approvisionnement}</Text></Text>
                    <Text>Statut: <Text style={styles.label}>{collecte.statut}</Text></Text>
                    <Text>Poids Unitaire: <Text style={styles.label}>{collecte.poids_unitaire}</Text></Text>
                    <Text>Prix Mesure: <Text style={styles.label}>{collecte.prix_mesure}</Text> GNF</Text>
                    <Text>Prix FG/KG: <Text style={styles.label}>{collecte.prix_fg_kg}</Text> GNF</Text>
                    <Text>Prix KG/Litre: <Text style={styles.label}>{collecte.prix_kg_litre}</Text> GNF</Text>
                    <Text>Observation: <Text style={styles.label}>{collecte.observation}</Text></Text>
                  </View>
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <FAB
        style={[styles.fab, { backgroundColor: filteredCollectes.length > 0 ? '#006951' : '#d3d3d3' }]}
        icon="send"
        onPress={filteredCollectes.length > 0 ? postFormConso : null}
        disabled={filteredCollectes.length === 0}
      />



      {/* Modal de confirmation de suppression */}
      <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
        <Dialog.Title>Confirmer la suppression</Dialog.Title>
        <Dialog.Content>
          <Text>Êtes-vous sûr de vouloir supprimer cet enregistrement ?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setDialogVisible(false)}>Annuler</Button>
          <Button onPress={handleDelete}>Supprimer</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    flexDirection: 'column',
    backgroundColor: '#f9f9f9',
    marginVertical: 8,
    padding: 0,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchbar: {
    marginBottom: 14,
  },
  produitImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  produitLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 50,
  },
  label: {
    fontWeight: '600',
    color: '#009C57'
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ListesConso;
