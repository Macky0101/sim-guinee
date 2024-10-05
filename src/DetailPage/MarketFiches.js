import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, Alert,Image } from 'react-native';
import { Q } from '@nozbe/watermelondb';
import database from '../../database/database';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Searchbar, IconButton} from 'react-native-paper';
import Toast from 'react-native-toast-message';

const MarketFiches = ({ route }) => {
  const navigation = useNavigation();
  const { idCollecteur, id_marche, type_marche, nom_marche ,nom_marche1} = route.params;
  console.log('les parametres de navigation', route.params);
  
  useEffect(() => {
    if (nom_marche && nom_marche1) {
      navigation.setOptions({ title: `${nom_marche} : ${nom_marche1}` });
    } else {
      console.log('nom_type_marche est indéfini');
    }
  }, [navigation, nom_marche ,nom_marche1]);

  console.log('les parametres de navigation', route.params);

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFiches, setFilteredFiches] = useState([]);

  // Fonction pour récupérer les données depuis WatermelonDB
  const fetchData = async () => {
    try {
      if (!id_marche) {
        console.error('ID du marché est undefined ou null');
        return;
      }

      const ficheCollection = database.collections.get('fiches');
      const fichesMarcheID = await ficheCollection.query(Q.where('marche', id_marche)).fetch();

      if (fichesMarcheID.length > 0) {
        console.log('Fiches filtrées:', fichesMarcheID);
        setData(fichesMarcheID);
        setFilteredFiches(fichesMarcheID); // Initialiser avec toutes les fiches
      } else {
        console.log('Aucune fiche trouvée pour ce marché.');
        setData([]);
        setFilteredFiches([]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id_marche, idCollecteur]);

  // Fonction pour filtrer les fiches selon la recherche
  const onSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      const filtered = data.filter(item =>
        item._raw.num_fiche.toLowerCase().includes(lowercasedQuery) ||
        item._raw.date_enquete.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredFiches(filtered);
    } else {
      setFilteredFiches(data); // Réinitialiser si aucune recherche
    }
  };


  const deleteCollect = async (id) => {
    try {
      await database.write(async () => {
        const collectToDelete = await database.get('fiches').find(id);
        await collectToDelete.markAsDeleted(); // Suppression logique (soft delete)
      });
      console.log('Suppression réussie pour l\'ID :', id);
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Collecte supprimé avec succès!',
        position: 'bottom'
      });

      fetchData();
    } catch (error) {
      console.error('Erreur lors de la suppression du Collecte:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de supprimer le Collecte.',
        position: 'bottom'
      });
    }
  };
  const renderNoData = () => (
    <View style={styles.noDataContainer}>
        <Image source={require('../../assets/images/no-data.png')} style={styles.noDataImage} />
        <IconButton icon="alert-circle" size={50} />
        <Text style={styles.noDataText}>Aucune donnée disponible</Text>
    </View>
);

if (isLoading) {
  return <ActivityIndicator size="large" color="#0000ff" />;
}

  // 2. Render "No Data" component if no fiches are available
  if (!filteredFiches || filteredFiches.length === 0) {
    return renderNoData();
  }
  // Affichage des fiches filtrées
  return (
    <ScrollView style={styles.container}>
      <Toast />
      <Searchbar
        placeholder="Rechercher"
        onChangeText={onSearch}
        value={searchQuery}
        style={styles.searchbar}
      />
      {filteredFiches.map((item) => (
        <TouchableOpacity
          key={item.id}
          onLongPress={() => {
            if (item._raw.source === "api") {
              // Message d'erreur si la fiche est synchronisée
              Alert.alert(
                "Suppression impossible",
                "Cette fiche est synchronisée avec le serveur et ne peut pas être supprimée."
              );
            } else {
              // Confirmation pour les fiches non synchronisées
              Alert.alert(
                "Confirmation de suppression",
                "Voulez-vous vraiment supprimer cette fiche?",
                [
                  { text: "Annuler", style: "cancel" },
                  {
                    text: "Supprimer",
                    onPress: () => deleteCollect(item.id),
                  },
                ]
              );
            }
          }}
        >
          <View
            style={[
              styles.ficheContainer,
              { backgroundColor: item._raw.source === "local" ? "#d8d8d8" : "#fff" },
            ]}
          >
            <View style={styles.fiche}>
              <Text style={{ color: "#fff" }}>N° Fiche: {item._raw.num_fiche}</Text>
            </View>
            <View style={styles.infoContainer}>
              <AntDesign
                name="calendar"
                size={20}
                color="#4A90E2"
                style={styles.icon}
              />
              <Text style={styles.text}>
                Date Enquête: {item._raw.date_enquete}
              </Text>
            </View>

            <View style={styles.btnContainer}>
              <TouchableOpacity
                onPress={() => {
                  if (item._raw.source === "local") {
                    // Si la fiche n'est pas synchronisée, afficher un message d'alerte
                    Alert.alert(
                      "Fiche non synchronisée",
                      "Vous devez synchroniser cette fiche avant de pouvoir voir des données."
                    );
                  } else {
                  // Check type_marche to navigate to different pages
                  switch (type_marche) {
                    case 1:
                      // Navigate to Collecte form and pass the fiche id
                      navigation.navigate('ListesCollecte', { idCollecteur, id_marche, type_marche, ficheId: item.id });
                      break;
                    case 2:
                      // Navigate to Grossiste form and pass the fiche id
                      navigation.navigate('ListesGrossistesCollect', { idCollecteur, id_marche, type_marche, ficheId: item.id });
                      break;
                    case 3:
                      // Navigate to Consommation form and pass the fiche id
                      navigation.navigate('ListesConso', { idCollecteur, id_marche, type_marche, ficheId: item.id });
                      break;
                    case 4:
                      // Navigate to journalier form and pass the fiche id
                      navigation.navigate('ListeJournalier', { idCollecteur, id_marche, type_marche, ficheId: item.id, external_id: item.external_id });
                      break;
                    case 6:
                      // Navigate to FormulaireDebarcadere form and pass the fiche id
                      navigation.navigate('ListeDebarcadere', { idCollecteur, id_marche, type_marche, ficheId: item.id, external_id: item.external_id });
                      break;
                      case 5:
                        // Navigate to FormulaireDebarcadere form and pass the fiche id
                        navigation.navigate('ListeBetail', { idCollecteur, id_marche, type_marche, ficheId: item.id, external_id: item.external_id });
                        break;
                    case 7:
                      // Navigate to Port form and pass the fiche id
                      navigation.navigate('ListPort', { idCollecteur, id_marche, type_marche, ficheId: item.id });
                      break;
                      case 8:
                        // Navigate to Port form and pass the fiche id
                        navigation.navigate('listeTransfrontalier', { idCollecteur, id_marche, type_marche, ficheId: item.id });
                        break;
                    default:
                      Alert.alert('Type de marché non reconnu', 'Impossible de naviguer vers la page spécifiée.');
                      break;
                    }
                  }
                }}
              >
                <View style={styles.btn}>
                  <Text style={{ color: "#fff" }}>Voir les données</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (item._raw.source === "local") {
                    // Si la fiche n'est pas synchronisée, afficher un message d'alerte
                    Alert.alert(
                      "Fiche non synchronisée",
                      "Vous devez synchroniser cette fiche avant de pouvoir ajouter des données."
                    );
                  } else {
                  // Check type_marche to navigate to different pages
                  switch (type_marche) {
                    case 1:
                      // Navigate to Collecte form and pass the fiche id
                      navigation.navigate('Formulaire', { idCollecteur, id_marche, type_marche, ficheId: item.id, external_id: item.external_id });
                      break;
                    case 2:
                      // Navigate to Grossiste form and pass the fiche id
                      navigation.navigate('FormGrossistes', { idCollecteur, id_marche, type_marche, ficheId: item.id, external_id: item.external_id });
                      break;
                    case 3:
                      // Navigate to Consommation form and pass the fiche id
                      navigation.navigate('FormCons', { idCollecteur, id_marche, type_marche, ficheId: item.id, external_id: item.external_id });
                      break;
                    case 4:
                      // Navigate to journalier form and pass the fiche id
                      navigation.navigate('FormulaireJournalier', { idCollecteur, id_marche, type_marche, ficheId: item.id, external_id: item.external_id });
                      break;
                    case 6:
                      // Navigate to FormulaireDebarcadere form and pass the fiche id
                      navigation.navigate('FormulaireDebarcadere', { idCollecteur, id_marche, type_marche, ficheId: item.id, external_id: item.external_id });
                      break;
                      case 5:
                        // Navigate to FormulaireDebarcadere form and pass the fiche id
                        navigation.navigate('formulaireBetail', { idCollecteur, id_marche, type_marche, ficheId: item.id, external_id: item.external_id });
                        break;
                    case 7:
                      // Navigate to Port form and pass the fiche id
                      navigation.navigate('FormPort', { idCollecteur, id_marche, type_marche, ficheId: item.id, external_id: item.external_id });
                      break;
                      case 8:
                        // Navigate to Port form and pass the fiche id
                        navigation.navigate('FormulaireTranfrontalier', { idCollecteur, id_marche, type_marche, ficheId: item.id, external_id: item.external_id });
                        break;
                    default:
                      Alert.alert('Type de marché non reconnu', 'Impossible de naviguer vers la page spécifiée.');
                      break;
                  }
                }}
              }
              >
                <View style={styles.btn1}>
                  <Text style={{ color: '#fff' }}>Nouvelle donnée</Text>
                </View>
              </TouchableOpacity>

            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  searchbar: {
    marginBottom: 16,
  },
  ficheContainer: {
    marginBottom: 7,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  fiche: {
    backgroundColor: '#4A90E2',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    alignSelf: 'flex-start'
  },
  infoContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  btn: {
    backgroundColor: '#009C57',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  btn1: {
    backgroundColor: '#006951',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 10,
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

export default MarketFiches;
