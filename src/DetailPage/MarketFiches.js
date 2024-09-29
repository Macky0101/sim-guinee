import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity , Alert} from 'react-native';
import { Q } from '@nozbe/watermelondb';
import database from '../../database/database';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Searchbar } from 'react-native-paper';
import Toast from 'react-native-toast-message';

const MarketFiches = ({ route }) => {
    const navigation = useNavigation();
    const { idCollecteur, id_marche ,type_marche} = route.params;
    console.log('les parametres de navigation',route.params);
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
                // console.log('Fiches filtrées:', fichesMarcheID);
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

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!data || data.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Aucune fiche trouvée pour ce marché.</Text>
            </View>
        );
    }
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
          });

          fetchData();
        } catch (error) {
          console.error('Erreur lors de la suppression du Collecte:', error);
          Toast.show({
            type: 'error',
            text1: 'Erreur',
            text2: 'Impossible de supprimer le Collecte.',
          });
        }
      };
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
                    onPress={() => navigation.navigate("ListesCollecte", {})}
                  >
                    <View style={styles.btn}>
                      <Text style={{ color: "#fff" }}>Voir les données</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Formulaire", {})}
                  >
                    <View style={styles.btn1}>
                      <Text style={{ color: "#fff" }}>Nouvelle donnée</Text>
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
    }
});

export default MarketFiches;
