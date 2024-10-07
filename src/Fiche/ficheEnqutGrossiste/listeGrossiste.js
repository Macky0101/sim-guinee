import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { deletegrossistes, getGrossistesData } from '../../../database/requeteGros';
import FormGrossiste from '../../../services/serviceAgricultures/ficheGrossiste/formGrossiste';
import { getData } from '../../../database/db';
import { useNavigation } from '@react-navigation/native';
import { Searchbar, FAB, Dialog, Button ,IconButton} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import GrossistesService from '../../../database/GrossistesService';
import database from '../../../database/database';
import { Q } from '@nozbe/watermelondb';

const ListesGrossistesCollect = () => {
  const route = useRoute();
  const { ficheId } = route.params;
  const { num_fiche } = route.params;
  console.log('ficheId', ficheId);
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
  const [uniteRelations, setUniteRelations] = useState([]); 
  const [produitsFind,setProduitsFind] = useState([]);

  const fetchFiches = async () => {
    try {
      const fetchedFiches = await database.collections.get('formulaire_grossiste').query(
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
        // Récupérer toutes les collectes via WatermelonDB
        const allCollects = await GrossistesService.listGrossistes();
        
        // Mapper les données pour accéder aux champs réels à partir de `_raw`
        const allCollectsRaw = allCollects.map((collecte) => collecte._raw);
        
        // Filtrer les collectes selon le num_fiche
        const filteredCollectes = allCollectsRaw.filter(
          (collecte) => collecte.num_fiche === num_fiche
        );
      
        // Mettre à jour l'état avec les collectes filtrées
        setCollectes(filteredCollectes);
        
        console.log('Liste des grossistes filtrés', filteredCollectes);
        console.log('Liste de tous les grossistes', allCollectsRaw);
      } catch (error) {
        console.error('Erreur lors de la récupération des collectes:', error);
      } finally {
        // Mettre à jour l'état de chargement
        setLoading(false);
      }
    };
  
    fetchAndFilterCollects();
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

  const filteredCollectes = collectes.filter(collecte => {
    const produitInfo = getProduitInfo(collecte.produit);
    return produitInfo && produitInfo.label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleLongPress = (collecte) => {
    setSelectedCollecte(collecte);
    setDialogVisible(true);
  };

  const handleDelete = async () => {
    if (selectedCollecte) {
      await GrossistesService.deleteGrossiste(selectedCollecte.id);
      setCollectes(collectes.filter((c) => c.id !== selectedCollecte.id));
      setDialogVisible(false);
    }
  };

  const postForm = async () => {
    try {
      setIsUploading(true);
      setUploadProgress(0); // Reset the progress bar
      const totalCollectes = collectes.length; // Nombre total de collectes

      let allSent = true;


      for (let i = 0; i < totalCollectes; i++) {
        const collecte = collectes[i];

        const ficheData = {
          unite_stock: parseInt(collecte.unite_stock),
          stock_anterieur: parseInt(collecte.stock_anterieur),
          poids_moyen_unite_stock: parseInt(collecte.poids_moyen_unite_stock),
          poids_stock: parseInt(collecte.poids_stock) ,
          stock_du_jour: parseInt(collecte.stock_du_jour),
          quantite_entree: parseInt(collecte.quantite_entree),
          fournisseur_principaux: parseInt(collecte.fournisseur_principaux),
          nombre_unite_achat: parseInt(collecte.nombre_unite_achat),
          unite_achat: parseInt(collecte.unite_achat),
          unite_vente: parseInt(collecte.unite_vente),
          prix_achat: parseInt(collecte.prix_achat),
          prix_unitaire_vente: parseInt(collecte.prix_unitaire_vente),
          localite_achat: parseInt(collecte.localite_achat),
          client_vente: parseInt(collecte.client_vente) || 0,
          autre_client_principal: parseInt(collecte.autre_client_principal),
          statut: collecte.statut,
          observation: collecte.observation || '',
          enquete: parseInt(collecte.enquete),
          produit: collecte.produit || '',
        };
        try {
          await FormGrossiste.postFormGrossiste(ficheData);  // Envoi de la collecte
          console.log(`Enregistrement ${collecte.id} envoyé avec succès.`);
          console.log('Fiche envoyée', ficheData);

          // Suppression locale après envoi réussi
          await handleDelete(collecte._raw.id);
          console.log('suppression locale', collecte.id);
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
      setLoading(false);
      setIsUploading(false); // Arrêter le suivi d'envoi après la fin
      setUploadProgress(0); // Réinitialiser la progression
    }
  };

  const renderNoData = () => (
    <View style={styles.noDataContainer}>
        <Image source={require('../../../assets/images/no-data.png')} style={styles.noDataImage} />
        <IconButton icon="alert-circle" size={50} />
        <Text style={styles.noDataText}>Aucune donnée disponible</Text>
    </View>
);

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
                <Text>Unité de Stock: <Text style={styles.label}>{getUniteName(collecte.unite_stock)}</Text></Text>
                <Ionicons
                  name={expandedCollecte === collecte.id ? "chevron-up-outline" : "chevron-down-outline"}
                  size={24}
                  color="black"
                  style={styles.chevronIcon}
                />
              </View>

              {expandedCollecte === collecte.id && (
                <>
                        <Text>Poids Moyen Unité de Stock : <Text style={styles.label}>{collecte.poids_moyen_unite_stock}</Text></Text>
                        <Text>Stock anterieur: <Text style={styles.label}>{collecte.stock_anterieur}</Text></Text>
                        <Text>Unité d'Achat : <Text style={styles.label}>{collecte.unite_achat}</Text></Text>
                        <Text>Nombre d'Unités d'Achat : <Text style={styles.label}>{collecte.nombre_unite_achat}</Text></Text>
                        <Text>Poids stock : <Text style={styles.label}>{collecte.poids_stock}</Text></Text>
                        <Text>Localité d'Achat : <Text style={styles.label}>{collecte.localite_achat}</Text></Text>
                        <Text>Fournisseur : <Text style={styles.label}>{collecte.fournisseur_principaux}</Text></Text>
                        <Text>Unité de Vente : <Text style={styles.label}>{collecte.unite_vente}</Text></Text>
                        <Text>Nombre d'Unités d'achat : <Text style={styles.label}>{collecte.nombre_unite_achat}</Text></Text>
                        <Text>Prix Unitaire de Vente : <Text style={styles.label}>{collecte.prix_unitaire_vente}</Text></Text>
                        <Text>Client : <Text style={styles.label}>{collecte.client_vente}</Text></Text>
                        <Text>Autre Client Principal : <Text style={styles.label}>{collecte.autre_client_principal}</Text></Text>
                        <Text>Observation : <Text style={styles.label}>{collecte.observation}</Text></Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
            )}
      <FAB
        style={[styles.fab, { backgroundColor: filteredCollectes.length > 0 ? '#006951' : '#d3d3d3' }]}
        icon="sync"
        onPress={postForm}
        // disabled={filteredCollectes.length === 0}
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

export default ListesGrossistesCollect;
