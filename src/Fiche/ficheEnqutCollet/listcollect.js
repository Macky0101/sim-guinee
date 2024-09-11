import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getCollecteData, getData, deleteCollecte , updateCollecte } from '../../../database/db';
import { Searchbar, FAB, Dialog, Button } from 'react-native-paper'; // Importer Dialog et Button
import { useNavigation } from '@react-navigation/native';
const ListesCollecte = () => {
  const route = useRoute();
  const { num_fiche } = route.params;
  const navigation = useNavigation(); 
  const [loading, setLoading] = useState(true);
  const [produits, setProduits] = useState({});
  const [communes, setCommunes] = useState([]);
  const [uniteMesures, setUniteMesures] = useState([]);
  const [collectes, setCollectes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollecte, setSelectedCollecte] = useState(null); // Etat pour la collecte sélectionnée
  const [dialogVisible, setDialogVisible] = useState(false); // Etat pour la visibilité du dialogue de confirmation

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
    const fetchCollectes = async () => {
      try {
        const allCollectes = await getCollecteData();
        const filteredCollectes = allCollectes.filter(
          (collecte) => collecte.num_fiche === num_fiche
        );
        setCollectes(filteredCollectes);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des collectes:', error);
      }
    };
    fetchCollectes();
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

  const getLocaliteInfo = (localiteId) => {
    const localiteIdString = String(localiteId);
    const commune = communes.find((commune) => String(commune.id) === localiteIdString);
    return commune?.nom || 'N/A';
  };

  const filteredCollectes = collectes.filter(collecte => {
    const produitInfo = getProduitInfo(collecte.produit);
    return produitInfo && produitInfo.label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // const handlePress = (collecte) => {
  //   Alert.alert('ID de la collecte', `ID: ${collecte.id}`);
  // };
  const handlePress = (collecte) => {
    console.log('Navigating to FormCollecte with params:', collecte);
    navigation.navigate('Formulaire', { collecte });
  };

  const handleLongPress = (collecte) => {
    setSelectedCollecte(collecte);
    setDialogVisible(true);
  };

  const handleDelete = async () => {
    if (selectedCollecte) {
      await deleteCollecte(selectedCollecte.id);
      setCollectes(collectes.filter((c) => c.id !== selectedCollecte.id));
      setDialogVisible(false);
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
          const localiteInfo = getLocaliteInfo(collecte.localite_origine);

          return (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => handlePress(collecte)} // Détection du clic
              onLongPress={() => handleLongPress(collecte)} // Détection du long clic
            >
              {produitInfo && (
                <>
                  <Image source={{ uri: produitInfo.image }} style={styles.produitImage} />
                  <View style={styles.infoContainer}>
                    <Text style={styles.produitLabel}>{produitInfo.label}</Text>
                    <Text>Unité :<Text style={styles.label}> {uniteInfo}</Text></Text>
                    <Text>Localité : <Text style={styles.label}>{localiteInfo}</Text></Text>
                    <Text>Quantité : <Text style={styles.label}>{collecte.quantite_collecte}</Text></Text>
                    <Text>Montant : <Text style={styles.label}>{collecte.montant_achat}</Text> FG</Text>
                    <Text>Client Principal: <Text style={styles.label}>{collecte.client_principal}</Text></Text>
                    <Text>Fournisseur Principal: <Text style={styles.label}>{collecte.fournisseur_principal}</Text></Text>
                    <Text>Distance à l'Origine du Marché: <Text style={styles.label}>{collecte.distance_origine_marche}</Text> km</Text>
                    <Text>Niveau d'Approvisionnement: <Text style={styles.label}>{collecte.niveau_approvisionement}</Text></Text>
                    <Text>Statut: <Text style={styles.label}>{collecte.statut}</Text></Text>
                    <Text>prix fg kg: <Text style={styles.label}>{collecte.prix_fg_kg}</Text></Text>
                    <Text>Observation: <Text style={styles.label}>{collecte.observation}</Text></Text>
                  </View>
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <FAB
        style={[styles.fab, { backgroundColor: filteredCollectes.length > 0 ? '#006951' : '#d3d3d3' }]} // Couleur change selon la disponibilité des données
        icon="send"
        onPress={() => console.log('Données envoyées')}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  label:{
    fontWeight:'600',
    color:'#009C57'
  }
});

export default ListesCollecte;
