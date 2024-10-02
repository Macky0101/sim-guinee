import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  Modal
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRoute } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import ConsommationServices from '../../../database/ConsommationService';
import database from '../../../database/database';
import { Q } from '@nozbe/watermelondb';

const FormCons = () => {
  const route = useRoute();
  const { id, idCollecteur ,id_marche, type_marche ,ficheId,num_fiche, external_id} = route.params;
  const [typeMarche, setTypeMarche] = useState(type_marche || '');
  const [numFiche, setNumFiche] = useState(num_fiche || ''); // Stocker num_fiche
  console.log('====================================');
  console.log('route param',route.params);
  console.log('====================================');
  // États pour gérer les valeurs du formulaire
  const [niveau_approvisionement, setNiveauApprovisionnement] = useState('');
  const [statut, setStatut] = useState('');
  const [observation, setObservation] = useState('');
  const [enquete, setEnquete] = useState(parseInt(id, 10) || 0);
  const [produit, setProduit] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [commune, setCommune] = useState(null);
  const [document, setDocument] = useState(null);
  const [poids_unitaire, setPoidsUnitaire] = useState('');
  const [prix_mesure, setPrixMesure] = useState('');
  const [prix_kg_litre, setPrixKgLitre] = useState('');

  // États pour gérer les données récupérées de l'API
  const [groupedProduits, setGroupedProduits] = useState({});
  const [communes, setCommunes] = useState([]);

  // États pour gérer le chargement et les recherches
  const [loading, setLoading] = useState(false);
  const [searchProduit, setSearchProduit] = useState('');
  const [searchCommune, setSearchCommune] = useState('');
  const [searchUniteMesure, setSearchUniteMesure] = useState('');

  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const loadData = async () => {
      const produitsLocaux = await loadDataFromStorage('produits');
      const uniteMesuresLocales = await loadDataFromStorage('uniteMesures');

      if (produitsLocaux) setGroupedProduits(produitsLocaux);
      if (uniteMesuresLocales) setUniteMesures(uniteMesuresLocales);

      if (!produitsLocaux) fetchProduits();
    };

    loadData();
  }, []);
 

  /**
  * Utilise un useEffect qui détecte le retour de la connexion et synchronise les données avec le serveur :
  */
  useEffect(() => {
      fetchProduits();
  }, []);

  
  
  
  // Fonction pour récupérer et filtrer les produits
const fetchProduits = async () => {
  setLoading(true);
  try {
    // Récupérer les produits pour le type de marché donné
    const produits = await database.collections.get('produits').query(
      Q.where('type_marche', Q.like(`%${typeMarche}%`)) // Vérifier que 'type_marche' est bien le champ à filtrer
    ).fetch();

    // Si on a des produits, on récupère les catégories associées
    if (produits.length > 0) {
      // Récupérer les IDs des catégories de produit
      const categorieIds = produits.map(p => p.categorie_produit);

      // Récupérer les catégories correspondantes à ces IDs
      const categories = await database.collections.get('categories_produit').query(
        Q.where('id_categorie_produit', Q.oneOf(categorieIds)) // Requête pour récupérer les catégories correspondant aux IDs
      ).fetch();

      // Associer chaque produit à sa catégorie
      const grouped = produits.reduce((acc, item) => {
        // Trouver la catégorie correspondante pour le produit
        const category = categories.find(cat => cat.id_categorie_produit === item.categorie_produit)?.nom_categorie_produit || 'Inconnu';

        // Organiser les produits par catégorie
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push({
          label: item.nom_produit,
          value: item.code_produit,
          image: item.image || 'https://via.placeholder.com/150',
        });

        return acc;
      }, {});

      setGroupedProduits(grouped);
      // console.log('Liste des produits filtrés et groupés par catégorie:', grouped);
    }
  } catch (err) {
    console.error('Erreur lors du filtrage des produits:', err);
  } finally {
    setLoading(false);
  }
};



  /**
 * Rendu du dropdown des produits
 */
  const renderProductsDropdown = () => {
    if (!selectedCategory) return null;
    const products = groupedProduits[selectedCategory] || [];

    return (
      <Dropdown
        style={styles.dropdown}
        data={products.filter((product) =>
          product.label && product.label.toLowerCase().includes(searchProduit.toLowerCase())

        )}
        search
        searchPlaceholder="Rechercher un produit..."
        labelField="label"
        valueField="value"
        placeholder="Sélectionnez un produit"
        value={produit}
        onChange={(item) => setProduit(item)}
        onChangeText={(text) => setSearchProduit(text)}
        renderLeftIcon={() => (
          <AntDesign name="shoppingcart" size={20} color="black" style={styles.icon} />
        )}
        renderItem={(item) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text>{item.label}</Text>
          </View>
        )}
      />
    );
  };


  const [UniteMesures, setUniteMesures] = useState([]); // Liste des unités de mesure
  const [UniteMesure, setUniteMesure] = useState(null); // Unité sélectionnée
  
  useEffect(() => {
    if (typeMarche) {
      // console.log('Type de marché:', typeMarche);
      getUniteMesure(); // Récupérer les unités de mesure quand le type de marché change
    }
  }, [typeMarche]);
  
  const getUniteMesure = async () => {
    try {
      const uniteRelationCollection = database.collections.get('unite_relations');

      // Exécuter une requête pour récupérer toutes les unités
      const unites = await uniteRelationCollection.query().fetch();
  
      // // Parcourir les résultats et afficher les noms et IDs
      // unites.forEach(unite => {
      //   console.log(`ID Macky: ${unite.id_unite}, Nom: ${unite.nom_unite}`);
      // });
  
      // Si des unités sont trouvées, mappez les données
      const UniteMesures = unites.map((unite) => ({
        label: unite.nom_unite, // Assurez-vous que 'unite_relation.nom_unite' existe dans la structure
        value: unite.id_unite, // Assurez-vous que 'id' est correct
      }));
  
      setUniteMesures(UniteMesures); // Mettre à jour l'état avec les unités récupérées
      await storeData('uniteMesures', UniteMesures); // Enregistrer les unités localement
    } catch (error) {
      console.error('Erreur lors de la récupération des unités de mesure:', error.message || error);
    }
  };
  
const renderUniteMesure = () => (
  <Dropdown
    style={styles.dropdown}
    data={UniteMesures.filter(item => item.label?.toLowerCase().includes(searchUniteMesure.toLowerCase()))}
    labelField="label"
    valueField="value"
    placeholder="Sélectionnez une unité de mesure"
    value={UniteMesure}
    onChange={item => setUniteMesure(item.value)}
    search
    searchPlaceholder="Rechercher une unité de mesure..."
    onSearch={setSearchUniteMesure}
    renderLeftIcon={() => (
      <AntDesign style={styles.icon} color="black" name="barschart" size={20} />
    )}
  />
);

  /**
   * Fonction pour gérer la sélection de la catégorie de produit
   */
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setProduit(null);
  };

  /**
   * Fonction pour gérer l'upload de document
   */
  const uploadDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'], // Limiter aux fichiers PDF et images
        copyToCacheDirectory: true, // Copier dans le cache pour éviter des problèmes
      });
      // console.log('Document sélectionné:', JSON.stringify(result, null, 2));

      if (result && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const formData = new FormData();
        formData.append('document', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/octet-stream',
        });

        // console.log('FormData:', JSON.stringify(formData, null, 2));
        const response = await axios.post(
          'https://cors-proxy.fringe.zone/http://92.112.194.154:8000/api/enquetes/marches-prix/upload/document',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        //         const response = await axios.post(
        //           // const SIMGUINEE_URL = 'https://cors-proxy.fringe.zone/http://92.112.194.154:8000/api/';
        // axios.defaults.headers.common['Content-Type'] = 'application/json',
        // axios.defaults.headers.common['x-requested-with'] = 'XMLHttpRequest',
        //           'https://cors-proxy.fringe.zone/http://92.112.194.154:8000/api/enquetes/marches-prix/upload/document',
        //           // 'http://92.112.194.154:8000/api/enquetes/marches-prix/upload/document',
        //           formData,
        //           {
        //             headers: {
        //               'Content-Type': 'multipart/form-data',
        //             },
        //           }
        //         );

        // console.log('Réponse du serveur:', JSON.stringify(response.data, null, 2));

        // Utilisez directement la réponse du serveur comme URL du fichier téléchargé
        const fileUrl = response.data;
        // console.log('URL du fichier téléchargé:', fileUrl);
        setDocument(fileUrl); // Stocker l'URL du fichier téléchargé dans l'état "document"
        Alert.alert('Succès', 'Document téléchargé avec succès.');
      } else {
        Alert.alert('Erreur', 'Aucun document sélectionné.');
      }
    } catch (error) {
      if (error.response) {
        console.error('Erreur lors de l\'upload du document:', error.response.data);
      } else {
        console.error('Erreur lors de l\'upload du document:', error.message);
      }
      Alert.alert(
        'Erreur',
        'Impossible de télécharger le document. Veuillez réessayer.'
      );
    }
  };

  /**
  * Fonction pour sauvegarder les donnees
  */
  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données:', error);
    }
  };
  /**
  * Fonction pour récupérer les données stockées localement à partir de AsyncStorage :
  */
  const loadDataFromStorage = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Erreur lors du chargement des données locales:', error);
    }
  };

  const validateFields = () => {
    if (!UniteMesure || !produit || !poids_unitaire || !prix_mesure) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Veuillez remplir tous les champs obligatoires.',
      });
      return false;
    }
    return true;
  };
  /**
   * Fonction pour soumettre le formulaire
   */

  const postForm = async () => {
    if (!validateFields()) {
      return;
    }
    try {
    
      setLoading(true);
      const ficheData = {
        unite: UniteMesure,
        poids_unitaire,
        prix_mesure,
        prix_kg_litre,
        niveau_approvisionement,
        statut:  getStatusForAPI(statut),
        observation,
        enquete:external_id,
        produit: produit.value,
        fiche_id: ficheId,
      };
      console.log("Données envoyées à WatermelonDB:", ficheData);

      await ConsommationServices.createConsommation(ficheData);
      console.log("Envoi réussi",ficheData);
      resetFields();
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fonction pour réinitialiser les champs du formulaire
   */
  const resetFields = () => {
    setNiveauApprovisionnement('');
    setStatut('');
    setObservation('');
    setProduit(null);
    setSelectedCategory(null);
    setCommune(null);
    setUniteMesure(null);
    setDocument(null);
    setPoidsUnitaire('');
    setPrixMesure('');
    setPrixKgLitre('');
  };


  const niveauApprovisionementOptions = [
    { label: 'Abondant', value: 'Abondant' },
    { label: 'Normal', value: 'Normal' },
    { label: 'Rare', value: 'Rare' },
  ];
  const getStatusForAPI = (statut) => {
    switch (statut) {
      case 'En cours':
        return true; // ou une valeur correspondant au statut "En cours" pour l'API
      case 'Terminé':
      case 'Annulé':
        return false; // ou une valeur correspondant au statut "Terminé" ou "Annulé"
      default:
        return null; // Gérer les cas inattendus
    }
  };
  
  const statutOptions = [
    { label: 'En cours', value: 'En cours' },
    { label: 'Terminé', value: 'Terminé' },
    { label: 'Annulé', value: 'Annulé' },
  ];
  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
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

      <Text style={styles.sectionTitle}>Produit</Text>
      <Dropdown
        style={styles.dropdown}
        data={Object.keys(groupedProduits).map((category) => ({
          label: category,
          value: category,
        }))}
        search
        searchPlaceholder="Rechercher une catégorie..."
        labelField="label"
        valueField="value"
        placeholder="Sélectionnez une catégorie"
        value={selectedCategory}
        onChange={(item) => handleCategoryChange(item.value)}
        onChangeText={(text) => setSearchProduit(text)}
        renderLeftIcon={() => (
          <AntDesign name="appstore-o" size={20} color="black" style={styles.icon} />
        )}
      />

      {renderProductsDropdown()}

      {renderUniteMesure()}

      {/* <Text style={styles.sectionTitle}>Document</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={uploadDocument}>
        <AntDesign name="cloudupload" size={24} color="#fff" />
        <Text style={styles.uploadButtonText}>Télécharger un document</Text>
      </TouchableOpacity>
      {document && (
        <Text style={styles.fileName}>
          Document téléchargé : {document.split('/').pop()}
        </Text>
      )} */}

      <TextInput
        label="Poids Unitaire"
        value={poids_unitaire}
        onChangeText={setPoidsUnitaire}
        style={styles.input}
      />

      <TextInput
        label="Prix Mesure"
        value={prix_mesure}
        onChangeText={setPrixMesure}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Prix KG/Litre"
        value={prix_kg_litre}
        onChangeText={setPrixKgLitre}
        keyboardType="numeric"
        style={styles.input}
      />
      <Dropdown
        style={styles.dropdown}
        data={niveauApprovisionementOptions}
        labelField="label"
        valueField="value"
        placeholder="Niveau d'approvisionnement"
        value={niveau_approvisionement}
        onChange={item => setNiveauApprovisionnement(item.value)}
        renderLeftIcon={() => (
          <AntDesign name="barschart" size={20} color="black" style={styles.icon} />  // Icône valide pour le niveau d'approvisionnement
        )}
      />
      <Dropdown
        style={styles.dropdown}
        data={statutOptions}
        labelField="label"
        valueField="value"
        placeholder="Sélectionnez le statut"
        value={statut}
        onChange={item => setStatut(item.value)}
        renderLeftIcon={() => (
          <MaterialIcons name="info" size={20} color="black" style={styles.icon} />  // Utilise MaterialIcons pour le statut
        )}
      />
      <TextInput
        label="Observation"
        value={observation}
        onChangeText={setObservation}
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={postForm}
        style={styles.submitButton}
        disabled={loading}
      >
        Enregistrer
      </Button>
      <Button
        mode="outlined"
        onPress={resetFields}
        style={styles.resetButton}
        disabled={loading}
      >
        Réinitialiser
      </Button>
      <Toast />

    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  loader: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  dropdown: {
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 50,
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#eee',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  fileName: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  submitButton: {
    // paddingVertical: 10,
    // borderRadius: 5,
    // backgroundColor: '#28a745',
    marginBottom: 10,
    backgroundColor: '#009C57'

  },
  resetButton: {
    // paddingVertical: 10,
    // borderRadius: 5,
    // borderColor: '#dc3545',
    // borderWidth: 1,
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

export default FormCons;
