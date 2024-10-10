import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, Alert,Image ,TouchableOpacity} from 'react-native';
import { FAB, Snackbar,IconButton,Dialog, Button  } from 'react-native-paper';
import database from '../../../database/database';
import { Q } from '@nozbe/watermelondb';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListeBetail = () => {
  const route = useRoute();
  const { ficheId, idCollecteur, id_marche, type_marche } = route.params;
  console.log(route.params)
  const [fiches, setFiches] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [uniteRelations, setUniteRelations] = useState([]); 
  const [produits,setProduits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedFiche, setSelectedFiche] = useState(null);

  const fetchFiches = async () => {
      try {
          const fetchedFiches = await database.collections.get('formulaire_betail').query(
              Q.where('fiche_id',Q.like(`%${ficheId}`))
          ).fetch();
          setFiches(fetchedFiches);
          console.log('Données trouvées dans la table:', fetchedFiches);
      } catch (error) {
          console.error('Erreur lors de la récupération des fiches:', error);
      }
  };

  
  const fetchUniteMesure = async () => {
    setLoading(true);
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
    setLoading(true);
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
    console.log('uniteRelations:', uniteRelations);
console.log('Recherche uniteId:', uniteId);

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



  const updateFiche = async (ficheId, updatedData) => {
      try {
          await database.write(async () => {
              const ficheToUpdate = await database.collections.get('formulaire_betail').find(ficheId);
              await ficheToUpdate.update(fiche => {
                  fiche.date_enquete = updatedData.date_enquete;
                  fiche.collecteur = updatedData.collecteur;
                  fiche.volume_poissons_peches = updatedData.volume_poissons_peches;
                  fiche.prix_moyen_semaine_grossiste = updatedData.prix_moyen_semaine_grossiste;
                  fiche.prix_moyen_semaine_detaillant = updatedData.prix_moyen_semaine_detaillant;
                  fiche.niveau_disponibilite = updatedData.niveau_disponibilite;
                  fiche.observation = updatedData.observation;
                  fiche.principale_espece_peche = updatedData.principale_espece_peche;
              });
          });
          fetchFiches(); // Rafraîchir la liste après mise à jour
          Toast.show({ text1: 'Fiche mise à jour avec succès' });
      } catch (error) {
          console.error('Erreur lors de la mise à jour de la fiche:', error);
      }
  };


  const deleteFiche = async () => {
    try {
      await database.write(async () => {
        const ficheToDelete = await database.collections.get('formulaire_betail').find(selectedFiche._raw.id);
        await ficheToDelete.destroyPermanently(); // Supprimer définitivement
      });
      fetchFiches(); // Rafraîchir la liste après suppression
      setDialogVisible(false); // Fermer la boîte de dialogue
      Toast.show({ text1: 'Fiche supprimée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de la fiche:', error);
    }
  };

  const handleLongPress = (fiche) => {
    setSelectedFiche(fiche);
    setDialogVisible(true); // Ouvrir le dialogue de confirmation
  };
  const syncDataWithServer = async () => {
      setSyncing(true);
      setSyncProgress(0);
      const totalFiches = fiches.length;
  
      for (let i = 0; i < totalFiches; i++) {
          const fiche = fiches[i];
          try {
              // Validation des données avant l'envoi
              const dataToSend = {
                  prix_unitaire: parseFloat(fiche._raw.prix_unitaire),
                  etat_corporel: fiche._raw.etat_corporel, 
                  nombre_present_chez_vendeur: parseFloat(fiche._raw.nombre_present_chez_vendeur) ,
                  provenance: fiche._raw.provenance ,
                  nombre_tete_par_provenance: parseFloat(fiche._raw.nombre_tete_par_provenance) ,
                  nombre_vendu_par_provenance: parseFloat(fiche._raw.nombre_vendu_par_provenance) ,
                  nombre_present_chez_acheteur: parseFloat(fiche._raw.nombre_present_chez_acheteur) ,
                  nombre_tete_achete: parseFloat(fiche._raw.nombre_tete_achete) ,
                  total_vendu_distribues: parseFloat(fiche._raw.total_vendu_distribues) ,
                  produit: fiche._raw.produit, 
                  enquete: parseFloat(fiche._raw.enquete) , 
              };
  
              const token = await AsyncStorage.getItem('userToken');
              if (!token) {
                  throw new Error('Aucun jeton trouvé');
              }
              console.log('donne a envoyer', dataToSend)
  
              // Envoi des données à l'API
              await axios.post('https://sim-guinee.org/api/enquetes/marches-prix/betails', dataToSend, {
                  headers: {
                      Authorization: `Bearer ${token}`
                  }
              });
              console.log('donne envoyer', dataToSend)
  
              // Suppression de la fiche locale après succès de la synchronisation
              await deleteFiche(fiche._raw.id);
          } catch (error) {
              console.error('Erreur lors de la synchronisation:', error);
          }
          setSyncProgress(((i + 1) / totalFiches) * 100); // Mettre à jour le pourcentage de progression
      }
      setSyncing(false);
      Toast.show({ text1: 'Synchronisation terminée' });
  };
  const renderNoData = () => (
      <View style={styles.noDataContainer}>
          <Image source={require('../../../assets/images/no-data.png')} style={styles.noDataImage} />
          <IconButton icon="alert-circle" size={50} />
          <Text style={styles.noDataText}>Aucune donnée disponible</Text>
      </View>
  );

  return (
    <View style={styles.container}>
      {fiches.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Image source={require('../../../assets/images/no-data.png')} style={styles.noDataImage} />
          <IconButton icon="alert-circle" size={50} />
          <Text style={styles.noDataText}>Aucune donnée disponible</Text>
        </View>
      ) : (
        <FlatList
          data={fiches}
          keyExtractor={(item) => item._raw.id}
          renderItem={({ item }) => (
            <TouchableOpacity onLongPress={() => handleLongPress(item)}>
              <View style={styles.card}>
                <Text>Produit: {getProduitName(item._raw.produit)}</Text>
                <Text>Prix unitaire: {item._raw.prix_unitaire}</Text>
                <Text>Nombre present chez vendeur: {item._raw.nombre_present_chez_vendeur}</Text>
                <Text>Provenance: {item._raw.provenance}</Text>
                <Text>Nombre tete par provenance: {item._raw.nombre_tete_par_provenance}</Text>
                <Text>Nombre vendu par provenance: {item._raw.nombre_vendu_par_provenance}</Text>
                <Text>Nombre Present chez acheteur: {item._raw.principale_espece_peche}</Text>
                <Text>Nombre tete achete: {item._raw.nombre_tete_achete}</Text>
                <Text>Total vendu distribues: {item._raw.total_vendu_distribues}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      {/* <FAB style={styles.fab} icon="sync" onPress={syncDataWithServer} /> */}
      {syncing && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Synchronisation en cours...</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${syncProgress}%` }]} />
          </View>
          <Text>{syncProgress.toFixed(0)}%</Text>
        </View>
      )}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: 'Fermer',
          onPress: () => {
            setSnackbarVisible(false);
          },
        }}
      >
        {snackbarMessage}
      </Snackbar>

      {/* Dialog de confirmation de suppression */}
      <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
        <Dialog.Title>Confirmer la suppression</Dialog.Title>
        <Dialog.Content>
          <Text>Êtes-vous sûr de vouloir supprimer cet enregistrement ?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setDialogVisible(false)}>Annuler</Button>
          <Button onPress={deleteFiche}>Supprimer</Button>
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
      backgroundColor: '#f9f9f9',
      padding: 16,
      borderRadius: 8,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
  },
  fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      borderRadius: 50,
  },
  progressContainer: {
      position: 'absolute',
      bottom: 60,
      left: 16,
      right: 16,
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

export default ListeBetail