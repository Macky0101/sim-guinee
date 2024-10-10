import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Searchbar, FAB, Dialog, Button,IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons'; 
import database from '../../../database/database';
import { getAllCollects, deleteCollect } from '../../../database/collecteService';
import { Q } from '@nozbe/watermelondb';
import FormCollect from '../../../services/serviceAgricultures/ficheCollect/serviceFormulaire';

const ListesCollecte = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { ficheId ,numfiche} = route.params;
  // console.log(ficheId, numfiche)
  const [loading, setLoading] = useState(true);
  const [collectes, setCollectes] = useState([]);
  const [expandedCollecte, setExpandedCollecte] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedCollecte, setSelectedCollecte] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uniteRelations, setUniteRelations] = useState([]); 
  const [produits,setProduits] = useState([]);

  const fetchFiches = async () => {
    try {
      const fetchedFiches = await database.collections.get('formulaire_collecte').query(
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
      setProduits(fetchedProduits);
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
    const produit = produits.find(p => p._raw.code_produit === codeProduit);
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
        const ficheToDelete = await database.collections.get('formulaire_collecte').find(ficheId);
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

  const toggleExpand = (collecteId) => {
    setExpandedCollecte(expandedCollecte === collecteId ? null : collecteId);
  };

  const postForm = async () => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      let allSent = true;
      const totalCollectes = collectes.length;

      for (let i = 0; i < totalCollectes; i++) {
        const collecte = collectes[i];
        const ficheData = {
          unite: parseFloat(collecte.unite), 
          poids_unitaire: parseFloat(collecte.poids_unitaire),
          montant_achat: parseFloat(collecte.montant_achat),
          prix_fg_kg: parseFloat(collecte.prix_fg_kg),
          etat_route: collecte.etat_route,
          quantite_collecte: parseFloat(collecte.quantite_collecte),
          niveau_approvisionement: collecte.niveau_approvisionement ,
          statut: collecte.statut || true,
          observation: collecte.observation ,
          etat: collecte.etat,
          enquete: parseInt(collecte.enquete, 10) || 0,
          produit: collecte.produit,
          destination_finale: parseFloat(collecte.destination_finale),
        };
        try {
          await FormCollect.postFormCollect(ficheData);
          await deleteCollect(collecte.id);
          setCollectes((prev) => prev.filter((c) => c.id !== collecte.id));
          setUploadProgress(Math.round(((i + 1) / totalCollectes) * 100));
        } catch (error) {
          console.error(`Erreur lors de l'envoi de l'enregistrement ${collecte.id}:`, error);
          Alert.alert('Erreur', `Impossible d'envoyer l'enregistrement. Veuillez réessayer.`);
          allSent = false;
          break;
        }
      }

      if (allSent) {
        Alert.alert('Succès', 'Tous les enregistrements ont été envoyés avec succès.');
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données:", error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'envoi des enregistrements.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
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
                  {/* <Text>Localité: <Text style={styles.label}>{collecte.destination_finale}</Text></Text> */}
                  <Text>Quantité Collecte: <Text style={styles.label}>{collecte.quantite_collecte}</Text></Text>
                  <Text>Niveau d'Approvisionnement: <Text style={styles.label}>{collecte.niveau_approvisionement}</Text></Text>
                  <Text>Quantite collecte: <Text style={styles.label}>{collecte.quantite_collecte}</Text></Text>
                  <Text>Montant d'achat: <Text style={styles.label}>{collecte.montant_achat}</Text></Text>
                  <Text>Poids unitaire: <Text style={styles.label}>{collecte.poids_unitaire}</Text></Text>
                  <Text>Prix/fg/kg: <Text style={styles.label}>{collecte.prix_fg_kg}</Text></Text>
                  <Text>Etat Route: <Text style={styles.label}>{collecte.etat_route}</Text></Text>
                  <Text>Observation: <Text style={styles.label}>{collecte.observation}</Text></Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
            )}

      <FAB
        style={styles.fab}
        icon="sync"
        onPress={collectes.length > 0 ? postForm : null}
        disabled={collectes.length === 0}
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

export default ListesCollecte;
