import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import FicheConsommationService from '../../../services/serviceAgricultures/ficheConsommation/serviceConsommation';
import { Searchbar, FAB, Dialog, Button ,IconButton} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import FormConso from '../../../services/serviceAgricultures/ficheConsommation/serviceFormulaireCons';
import { Ionicons } from '@expo/vector-icons';
import ConsommationServices from '../../../database/ConsommationService.js';
import { Q } from '@nozbe/watermelondb';
import database from '../../../database/database';

const ListeTransfrontalier = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { ficheId } = route.params;
  const { id, num_fiche } = route.params;
  const [loading, setLoading] = useState(false);
  const [filteredCollects, setFilteredCollects] = useState([]);
  const [produits, setProduits] = useState({});
  const [uniteMesures, setUniteMesures] = useState([]);
  const [collectes, setCollectes] = useState([]);
  const [expandedCollecte, setExpandedCollecte] = useState(null);  // État pour savoir quelle collecte est développée
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollecte, setSelectedCollecte] = useState(null); // Collecte sélectionnée
  const [dialogVisible, setDialogVisible] = useState(false); // Visibilité du dialog
  const [uploadProgress, setUploadProgress] = useState(0); // État pour suivre le pourcentage d'envoi
  const [isUploading, setIsUploading] = useState(false);   // État pour suivre si l'envoi est en cours
  const [uniteRelations, setUniteRelations] = useState([]); 
  const [produitsFind,setProduitsFind] = useState([]);

  const fetchFiches = async () => {
    try {
      const fetchedFiches = await database.collections.get('formulaire_tranfrontalier').query(
        Q.where('fiche_id', Q.like(`%${ficheId}`))
      ).fetch();
      console.log('donne',fetchedFiches);
      setCollectes(fetchedFiches);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des fiches:', error);
      setLoading(false);
    }
  };

  const fetchUniteMesure = async () => {
    try {
      const fetchedUnite = await database.collections.get('unite_relations').query().fetch();
      setUniteRelations(fetchedUnite);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des unités:', error);
      setLoading(false);
    }
  };
  const fetchProduits = async () => {
    try {
      const fetchedProduits = await database.collections.get('produits').query().fetch();
      setProduitsFind(fetchedProduits);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      setLoading(false);
    }
  };
  

  const getUniteName = (uniteId) => {
    const unite = uniteRelations.find(u => u._raw.id_unite === uniteId);
    return unite ? unite._raw.nom_unite : 'Unknown';
  };

  const getProduitName = (codeProduit) => {
    const produit = produitsFind.find(p => p._raw.code_produit === codeProduit);
    return produit ? produit._raw.nom_produit : 'Produit inconnu';
  };
  
  useEffect(() => {
    fetchFiches();
    fetchUniteMesure();
    fetchProduits();
  }, []);

  const deleteFiche = async (ficheId) => {
    try {
      await database.write(async () => {
        const ficheToDelete = await database.collections.get('formulaire_tranfrontalier').find(ficheId);
        await ficheToDelete.destroyPermanently();
      });
      fetchFiches();
      Alert.alert('Succès', 'Fiche supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de la fiche:', error);
    }
  };

  const handleLongPress = (fiche) => {
    setSelectedCollecte(fiche);
    setDialogVisible(true);
  };

  const handleDelete = () => {
    deleteFiche(selectedCollecte._raw.id);
    setDialogVisible(false);
  };


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




  const filteredCollectes = collectes.filter(collecte => {
    const produitInfo = getProduitInfo(collecte.produit);
    return produitInfo && produitInfo.label.toLowerCase().includes(searchQuery.toLowerCase());
  });
  const postFormConso = async () => {
    try {
      setIsUploading(true);
      setUploadProgress(0); // Réinitialiser la barre de progression
      let allSent = true;
      const totalCollectes = collectes.length; // Nombre total de collectes
  
      for (let i = 0; i < totalCollectes; i++) {
        const collecte = collectes[i];
        const ficheData = {
          unite: parseFloat(collecte.unite),
          date_enquete: collecte.date_enquete,
          prix_vente: parseFloat(collecte.prix_vente),
          prix_achat: parseFloat(collecte.prix_achat),
          collecteur: parseFloat(collecte.collecteur),
          quantite_sortant: parseFloat(collecte.quantite_sortant),
          region_provenance: parseFloat(collecte.region_provenance),
          region_destination: parseFloat(collecte.region_destination),
          quantite_entrant: parseFloat(collecte.quantite_entrant),
          pays_destination: collecte.pays_destination,
          pays_origine: collecte.pays_origine,
          observation: collecte.observation,
          enquete: parseFloat(collecte.enquete),
          produit: collecte.produit,
        };
        console.log('ficheData', ficheData);
  
        try {
          // Envoi de l'enregistrement à l'API
          await FormConso.postFormTransfrontalier(ficheData);
          console.log(`Enregistrement ${collecte.id} envoyé avec succès.${ficheData}`);
  
          // Suppression de l'enregistrement local si l'envoi a réussi
          await deleteFiche(collecte.id);
          setCollectes((prevCollectes) => prevCollectes.filter((c) => c.id !== collecte.id));
  
          // Mise à jour de la progression
          const newProgress = Math.round(((i + 1) / totalCollectes) * 100);
          setUploadProgress(newProgress);
  
        } catch (error) {
          console.error(`Erreur lors de l'envoi de l'enregistrement ${collecte.id}:`, error);
  
          // Vérifier la structure de l'erreur et afficher le message approprié
          const backendMessage = error.response?.data?.detail || ''; // Récupérer le message du backend
          const statusCode = error.response?.status || 0; // Récupérer le code d'état
  
          if (statusCode === 409) {
            // Afficher le message spécifique pour l'erreur 409
            Alert.alert(
              'Erreur',
              `Le produit "${getProduitInfo(collecte.produit)?.label}" a déjà été enregistré aujourd'hui. ${backendMessage}`
            );
          } else if (statusCode === 422) {
            // Afficher le message spécifique pour l'erreur 422
            Alert.alert(
              'Erreur',
              `Les données envoyées sont incorrectes ou incomplètes pour "${getProduitInfo(collecte.produit)?.label}". ${backendMessage}`
            );
          } else {
            // Afficher une alerte générique si le code n'est pas 409 ou 422
            Alert.alert(
              'Erreur',
              `Impossible d'envoyer l'enregistrement "${getProduitInfo(collecte.produit)?.label}". ${backendMessage || 'Veuillez vérifier votre connexion et réessayer.'}`
            );
          }
  
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
      setIsUploading(false); // Arrêter le suivi d'envoi après la fin
      setUploadProgress(0); // Réinitialiser la progression
    }
  };
  
  
  

  const toggleExpand = (collecteId) => {
    setExpandedCollecte(expandedCollecte === collecteId ? null : collecteId);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  const renderNoData = () => (
    <View style={styles.noDataContainer}>
        <Image source={require('../../../assets/images/no-data.png')} style={styles.noDataImage} />
        <IconButton icon="alert-circle" size={50} />
        <Text style={styles.noDataText}>Aucune donnée disponible</Text>
    </View>
);
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
   {collectes.length === 0 ? (
                renderNoData()
            ) : (
<ScrollView showsVerticalScrollIndicator={false}>
        {collectes.map((collecte, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => toggleExpand(collecte.id)}
            onLongPress={() => handleLongPress(collecte)}
          >
            <View style={styles.infoContainer}>
              {/* <Image source={{ uri: collecte.produit.image }} style={styles.produitImage} /> */}
              <Text style={styles.produitLabel}>{getProduitName(collecte.produit)}</Text>
              <View style={styles.chevronContainer}>
                <Text>Unité de Stock: <Text style={styles.label}>{getUniteName(collecte.unite)}</Text></Text>
                <Ionicons
                  name={expandedCollecte === collecte.id ? "chevron-up-outline" : "chevron-down-outline"}
                  size={24}
                  color="black"
                  style={styles.chevronIcon}
                />
              </View>

              {expandedCollecte === collecte.id && (
                <>
                    <Text>Date d'ênquete: <Text style={styles.label}>{collecte.date_enquete}</Text></Text>
                    <Text>Prix de vente: <Text style={styles.label}>{collecte.prix_vente}</Text></Text>
                    <Text>Prix d'achat: <Text style={styles.label}>{collecte.prix_achat}</Text></Text>
                    <Text>Quantite entrant: <Text style={styles.label}>{collecte.quantite_entrant}</Text> GNF</Text>
                    <Text>Quantite sortant: <Text style={styles.label}>{collecte.quantite_sortant}</Text> GNF</Text>
                    <Text>Région de provenance: <Text style={styles.label}>{collecte.region_provenance}</Text> GNF</Text>
                    <Text>Région destination: <Text style={styles.label}>{collecte.region_destination}</Text></Text>
                    <Text>Pays d'origine: <Text style={styles.label}>{collecte.pays_origine}</Text></Text>
                    <Text>Observation: <Text style={styles.label}>{collecte.observation}</Text></Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
            )}
      <FAB
        style={[styles.fab, { backgroundColor: collectes.length > 0 ? '#006951' : '#d3d3d3' }]}
        icon="sync"
        onPress={collectes.length > 0 ? postFormConso : null}
        disabled={collectes.length === 0}
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
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},
noDataImage: {
    width: 250,
    height: 250,
},
noDataText: {
    fontSize: 18,
    color: '#888',
},
});

export default ListeTransfrontalier