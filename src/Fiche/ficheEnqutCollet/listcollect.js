import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getCollecteData, getData, deleteCollecte , updateCollecte } from '../../../database/db';
import { Searchbar, FAB, Dialog, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import FormCollect from '../../../services/serviceAgricultures/ficheCollect/serviceFormulaire';
import { Ionicons } from '@expo/vector-icons'; 
import database from '../../../database/database';
import {getAllCollects ,countCollects,deleteCollect} from '../../../database/collecteService';

const ListesCollecte = () => {
  const route = useRoute();
  const { num_fiche } = route.params;
    const { ficheId, idCollecteur, id_marche, type_marche } = route.params;
    console.log('====================================');
    console.log(ficheId); 
    console.log('====================================');
  const navigation = useNavigation(); 
  const [loading, setLoading] = useState(true);
  const [produits, setProduits] = useState({});
  const [communes, setCommunes] = useState([]);
  const [uniteMesures, setUniteMesures] = useState([]);
  const [collectes, setCollectes] = useState([]);
  const [expandedCollecte, setExpandedCollecte] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollecte, setSelectedCollecte] = useState(null); 
  const [dialogVisible, setDialogVisible] = useState(false); 
  const [uploadProgress, setUploadProgress] = useState(0); // État pour suivre le pourcentage d'envoi
const [isUploading, setIsUploading] = useState(false);   // État pour suivre si l'envoi est en cours

  
  useEffect(() => {
    const loadProduits = async () => {
      const produitsData = await getData('produits');
      setProduits(produitsData || {});
    };
    loadProduits();
  }, []);

  useEffect(() => {
    const loadCommunes = async () => {
      const communesData = await getData('communes');
      setCommunes(communesData || []);
    };
    loadCommunes();
  }, []);

  useEffect(() => {
    const loadUniteMesures = async () => {
      const uniteMesuresData = await getData('uniteMesures');
      setUniteMesures(uniteMesuresData || []);
    };
    loadUniteMesures();
  }, []);

 


  useEffect(() => {
    const fetchAndFilterCollects = async () => {
      try {
        // Récupérer toutes les collectes
        const allCollects = await getAllCollects();

        const allCollectsRaw = allCollects.map((collecte) => collecte._raw);
        
        // Filtrer les collectes selon le num_fiche
        const filteredCollects = allCollectsRaw.filter(
          (collecte) => collecte.num_fiche === num_fiche
        );
      
        // Mettre à jour l'état avec les collectes filtrées
        setCollectes(filteredCollects);
        console.log('Collectes', filteredCollects);
        console.log('allCollects', allCollects);
      } catch (error) {
        console.error('Erreur lors de la récupération des collectes:', error);
      } finally {
        // Mettre à jour l'état de chargement
        setLoading(false);
      }
    };
  
    fetchAndFilterCollects();
  }, [num_fiche]); // Dépendance sur num_fiche pour ré-exécuter le useEffect lorsque num_fiche change
  


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

  const getLocaliteInfo = (localiteId) => {
    const localiteIdString = String(localiteId);
    const commune = communes.find((commune) => String(commune.id) === localiteIdString);
    return commune?.nom || 'N/A';
  };

  const filteredCollectes = collectes.filter(collecte => {
    const produitInfo = getProduitInfo(collecte.produit);
    return produitInfo && produitInfo.label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handlePress = (collecte) => {
    navigation.navigate('Formulaire', { collecte });
  };

  const handleLongPress = (collecte) => {
    setSelectedCollecte(collecte);
    setDialogVisible(true);
  };

  const handleDelete = async () => {
    if (selectedCollecte) {
      await deleteCollect(selectedCollecte.id);
      setCollectes(collectes.filter((c) => c.id !== selectedCollecte.id));
      setDialogVisible(false);
    }
  };
  const postForm = async () => {
    try {
      setIsUploading(true);
      setUploadProgress(0); // Réinitialiser la barre de progression
      let allSent = true;
      const totalCollectes = filteredCollectes.length; // Nombre total de collectes filtrées
  
      for (let i = 0; i < totalCollectes; i++) {
        const collecte = filteredCollectes[i];
        const ficheData = {
          unite: collecte.unite, 
          poids_unitaire: parseFloat(collecte.poids_unitaire),
          montant_achat: parseFloat(collecte.montant_achat),
          prix_fg_kg: parseFloat(collecte.prix_fg_kg) || 0,
          etat_route: collecte.etat_route || '',
          quantite_collecte: parseFloat(collecte.quantite_collecte) || 0,
          niveau_approvisionement: collecte.niveau_approvisionement || '',
          statut: collecte.statut || false, // Assuming statut is a boolean
          observation: collecte.observation || '',
          etat: collecte.etat || '',
          enquete: parseInt(collecte.enquete, 10) || 0,
          produit: collecte.produit,
          destination_finale: collecte.destination_finale || 0,
        };
  
        try {
          await FormCollect.postFormCollect(ficheData);  // Envoi de la collecte
          console.log(`Enregistrement ${collecte.id} envoyé avec succès.`);
  
          // Suppression locale après envoi réussi
          await deleteCollect(collecte.id);
          setCollectes((prevCollectes) => prevCollectes.filter((c) => c.id !== collecte.id));
  
          // Mise à jour de la progression
          const newProgress = Math.round(((i + 1) / totalCollectes) * 100);
          setUploadProgress(newProgress);
  
        } catch (error) {
          console.error(`Erreur lors de l'envoi de l'enregistrement ${collecte.id}:`, error);
          Alert.alert(
            'Erreur',
            `Impossible d'envoyer l'enregistrement "${getProduitInfo(collecte.produit)?.label}". Veuillez vérifier votre connexion et réessayer.`
          );
          allSent = false;
          break;
        }
      }
  
      if (allSent) {
        Alert.alert('Succès', 'Tous les enregistrements ont été envoyés avec succès.');
      } else {
        Alert.alert(
          'Envoi interrompu',
          'L\'envoi a été interrompu en raison d\'une erreur. Les enregistrements non envoyés sont conservés.'
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données:", error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'envoi des enregistrements.');
    } finally {
      setIsUploading(false); // Arrêter le suivi d'envoi après la fin
      setUploadProgress(0); // Réinitialiser la progression
    }
  };
  
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const toggleExpand = (collecteId) => {
    setExpandedCollecte(expandedCollecte === collecteId ? null : collecteId);
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Rechercher un produit"
        onChangeText={query => setSearchQuery(query)}
        value={searchQuery}
        style={styles.searchbar}
      />
    {isUploading && (
  <View style={styles.progressContainer}>
    <Text style={styles.progressText}>Envoi en cours : {uploadProgress}%</Text>
    <View style={styles.progressBar}>
      <View style={[styles.progress, { width: `${uploadProgress}%` }]} />
    </View>
  </View>
)}


      <ScrollView
        showsVerticalScrollIndicator={false} 
        showsHorizontalScrollIndicator={false}
      >
        {filteredCollectes.map((collecte, index) => {
          const produitInfo = getProduitInfo(collecte.produit);
          const uniteInfo = getUniteInfo(collecte.unite);
          const localiteInfo = getLocaliteInfo(collecte.destination_finale);

          return (
            <TouchableOpacity
              key={index}
              style={styles.card}
              // onPress={() => handlePress(collecte)} 
              onPress={() => toggleExpand(collecte.id)}
              onLongPress={() => handleLongPress(collecte)} 
            >
              {produitInfo && (
                <>
                    <View style={styles.infoContainer}>

                  <Image source={{ uri: produitInfo.image }} style={styles.produitImage} />
                    <Text style={styles.produitLabel}>{produitInfo.label}</Text>


                    <View style={styles.chevronContainer}>
                      <Text>Unité de Stock :<Text style={styles.label}> {getUniteInfo(collecte.unite)}</Text></Text>
                      <Ionicons
                        name={expandedCollecte === collecte.id ? "chevron-up-outline" : "chevron-down-outline"}
                        size={24}
                        color="black"
                        style={styles.chevronIcon}
                      />
                    </View>

                    {expandedCollecte === collecte.id && (
                      <>
                    <Text>Localité : <Text style={styles.label}>{localiteInfo}</Text></Text>
                    <Text>Quantité Collecte: <Text style={styles.label}>{collecte.quantite_collecte}</Text></Text>
                    <Text>Niveau d'Approvisionnement: <Text style={styles.label}>{collecte.niveau_approvisionement}</Text></Text>
                    <Text>Etat Route: <Text style={styles.label}>{collecte.etat_route}</Text></Text>
                    <Text>Etat : <Text style={styles.label}>{collecte.etat}</Text></Text>
                    <Text>Statut: <Text style={styles.label}>{collecte.statut}</Text></Text>
                    <Text>prix fg kg: <Text style={styles.label}>{collecte.prix_fg_kg}</Text> FG</Text>
                    <Text>Observation: <Text style={styles.label}>{collecte.observation}</Text></Text>
                      </>
                    )}
                  
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
        onPress={filteredCollectes.length > 0 ? postForm : null}
        disabled={filteredCollectes.length === 0}
      />
      <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
        <Dialog.Title>Supprimer la collecte</Dialog.Title>
        <Dialog.Content>
          <Text>Voulez-vous vraiment supprimer cette collecte ?</Text>
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
    marginTop: 8,
  },
  chevronContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chevronIcon: {
    paddingLeft: 8,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
});

export default ListesCollecte;
