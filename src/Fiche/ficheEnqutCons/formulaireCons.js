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
import FormConso from '../../../services/serviceAgricultures/ficheConsommation/serviceFormulaireCons';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createTables, insertCollecte, } from '../../../database/requetteCons';


const FormCons = () => {
  const route = useRoute();
  const { id , num_fiche } = route.params;
  const [numFiche, setNumFiche] = useState(num_fiche || ''); // Stocker num_fiche
  // États pour gérer les valeurs du formulaire
  const [niveauApprovisionnement, setNiveauApprovisionnement] = useState('');
  const [statut, setStatut] = useState('');
  const [observation, setObservation] = useState('');
  const [enquete, setEnquete] = useState(parseInt(id, 10) || 0);
  const [produit, setProduit] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [commune, setCommune] = useState(null);
  const [uniteMesure, setUniteMesure] = useState(null);
  const [document, setDocument] = useState(null);
  const [poidsUnitaire, setPoidsUnitaire] = useState('');
  const [prixMesure, setPrixMesure] = useState('');
  const [prixFgKg, setPrixFgKg] = useState('');
  const [prixKgLitre, setPrixKgLitre] = useState('');

  // États pour gérer les données récupérées de l'API
  const [groupedProduits, setGroupedProduits] = useState({});
  const [communes, setCommunes] = useState([]);
  const [uniteMesures, setUniteMesures] = useState([]);

  // États pour gérer le chargement et les recherches
  const [loading, setLoading] = useState(false);
  const [searchProduit, setSearchProduit] = useState('');
  const [searchCommune, setSearchCommune] = useState('');
  const [searchUniteMesure, setSearchUniteMesure] = useState('');

  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    createTables(); // Créer la table lorsque le composant est monté
  }, []);


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const loadData = async () => {
      const produitsLocaux = await loadDataFromStorage('produits');
      // const communesLocales = await loadDataFromStorage('communes');
      const uniteMesuresLocales = await loadDataFromStorage('uniteMesures');
      
      if (produitsLocaux) setGroupedProduits(produitsLocaux);
      // if (communesLocales) setCommunes(communesLocales);
      if (uniteMesuresLocales) setUniteMesures(uniteMesuresLocales);
  
      // Si les données ne sont pas présentes, on les charge depuis l'API
      if (!produitsLocaux) fetchProduits();
      // if (!communesLocales) fetchCommunes();
      if (!uniteMesuresLocales) fetchUniteMesures();
    };
  
    loadData();
  }, []);
  useEffect(() => {
    if (!isConnected) {
      loadDataFromStorage('produits');
      // loadDataFromStorage('communes');
      loadDataFromStorage('uniteMesures');
    } else {
      fetchProduits();
      // fetchCommunes();
      fetchUniteMesures();
    }
  }, [isConnected]);

   /**
   * Utilise un useEffect qui détecte le retour de la connexion et synchronise les données avec le serveur :
   */
  useEffect(() => {
    if (isConnected) {
      fetchProduits();
      // fetchCommunes();
      fetchUniteMesures();
    }
  }, [isConnected]);
    
  
  // useEffect(() => {
  //   fetchProduits();
  //   fetchCommunes();
  //   fetchUniteMesures();
  // }, []);

  /** 
   * Fonction pour récupérer les produits depuis l'API
   */
  const fetchProduits = async () => {
    setLoading(true);
    try {
      const response = await FormConso.getProduit();
      const grouped = response.reduce((acc, item) => {
        const category = item.categorie.nom_categorie_produit;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push({
          label: item.nom_produit,
          value: item.code_produit,
          image: item.image || 'https://via.placeholder.com/150',
        });
        // console.log(acc[category])
        return acc;
      }, {});
      setGroupedProduits(grouped);
      await storeData('produits', grouped);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      // Alert.alert(
      //   'Erreur',
      //   'Impossible de récupérer les produits. Veuillez réessayer plus tard.'
      // );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fonction pour récupérer les communes depuis l'API
   */
  // const fetchCommunes = async () => {
  //   try {
  //     const response = await FormConso.getCommune();
  //     const communesData = response.map((commune) => ({
  //       label: commune.nom_commune,
  //       value: commune.id_commune,
  //     }));
  //     setCommunes(communesData);
  //     await storeData('communes', communesData);
  //   } catch (error) {
  //     console.error('Erreur lors de la récupération des communes:', error);
  //     // Alert.alert(
  //     //   'Erreur',
  //     //   'Impossible de récupérer les communes. Veuillez réessayer plus tard.'
  //     // );
  //   }
  // };

  /**
   * Fonction pour récupérer les unités de mesure depuis l'API
   */
  const fetchUniteMesures = async () => {
    try {
      const response = await FormConso.getUniteMesure();
      const uniteMesuresData = response.map((unite) => ({
        label: unite.nom_unite,
        value: unite.id_unite.toString(),
      }));
      // console.log(uniteMesuresData)
      setUniteMesures(uniteMesuresData);
      await storeData('uniteMesures', uniteMesuresData);
    } catch (error) {
      console.error('Erreur lors de la récupération des unités de mesure:', error);
      // Alert.alert(
      //   'Erreur',
      //   'Impossible de récupérer les unités de mesure. Veuillez réessayer plus tard.'
      // );
    }
  };

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
    

  /**
   * Fonction pour soumettre le formulaire
   */
  const postForm = async () => {
    if (
      !produit ||
      !uniteMesure ||
      !poidsUnitaire ||
      !prixMesure ||
      !prixFgKg ||
      !prixKgLitre ||
      !niveauApprovisionnement ||
      !statut 
      // !document 
    ) {
      Alert.alert(
        'Erreur',
        'Veuillez remplir tous les champs requis avant de soumettre le formulaire.'
      );
      return;
    }
  
    const ficheData = {
      unite:  uniteMesure.value,  // Nombre attendu par l'API
      poids_unitaire: poidsUnitaire,
      prix_mesure: parseFloat(prixMesure),  // Conversion en nombre
      prix_fg_kg: parseFloat(prixFgKg),     // Conversion en nombre
      prix_kg_litre: parseFloat(prixKgLitre), // Conversion en nombre
      niveau_approvisionement: niveauApprovisionnement,
      document: document,  // URL du document
      statut,
      observation,
      enquete: enquete, // Nombre attendu par l'API
      produit: produit.value, // Nombre attendu par l'API
      num_fiche: numFiche 
    };
     // Insérer les données dans la base de données
     insertCollecte(
      ficheData.unite,
      ficheData.poids_unitaire,
      ficheData.prix_mesure,
      ficheData.prix_fg_kg,
      ficheData.prix_kg_litre,
      ficheData.niveau_approvisionement,
      ficheData.statut,
      ficheData.observation,
      ficheData.enquete,
      ficheData.produit,
      ficheData.num_fiche
    );
    console.log('donne envoyer',ficheData);
    Alert.alert('Succès', 'Les données ont été insérées dans la base de données.');
  
    console.log('ficheData', ficheData);
  
    try {
      setLoading(true);
      // await FormConso.postFormConso(ficheData);
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Formulaire soumis avec succès.',
      });
      // Alert.alert('Succès', 'Formulaire soumis avec succès.');
      resetFields();
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de soumettre le formulaire. Veuillez réessayer.',
      });
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
    setPrixFgKg('');
    setPrixKgLitre('');
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

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <Modal
        transparent={true}
        animationType="none"
        visible={loading}
        onRequestClose={() => {}}
      >
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </View>
      </Modal>

      {/* {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      )} */}

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

      {/* <Text style={styles.sectionTitle}>Localité d'origine</Text>
      <Dropdown
        style={styles.dropdown}
        data={communes.filter((item) =>
          item.label && item.label.toLowerCase().includes(searchCommune.toLowerCase())
        )}
        
        search
        searchPlaceholder="Rechercher une commune..."
        labelField="label"
        valueField="value"
        placeholder="Sélectionnez une commune"
        value={commune}
        onChange={(item) => setCommune(item)}
        onChangeText={(text) => setSearchCommune(text)}
        renderLeftIcon={() => (
          <AntDesign name="enviromento" size={20} color="black" style={styles.icon} />
        )}
      /> */}

      <Text style={styles.sectionTitle}>Unité de mesure</Text>
      <Dropdown
        style={styles.dropdown}
        data={uniteMesures.filter((item) =>
          item.label && item.label.toLowerCase().includes(searchUniteMesure.toLowerCase())
        )}
        
        search
        searchPlaceholder="Rechercher une unité..."
        labelField="label"
        valueField="value"
        placeholder="Sélectionnez une unité de mesure"
        value={uniteMesure}
        onChange={(item) => setUniteMesure(item)}
        onChangeText={(text) => setSearchUniteMesure(text)}
        renderLeftIcon={() => (
          <AntDesign name="barschart" size={20} color="black" style={styles.icon} />
        )}
      />

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
        value={poidsUnitaire}
        onChangeText={setPoidsUnitaire}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Prix Mesure"
        value={prixMesure}
        onChangeText={setPrixMesure}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Prix FG/KG"
        value={prixFgKg}
        onChangeText={setPrixFgKg}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Prix KG/Litre"
        value={prixKgLitre}
        onChangeText={setPrixKgLitre}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Niveau d'approvisionnement"
        value={niveauApprovisionnement}
        onChangeText={setNiveauApprovisionnement}
        style={styles.input}
      />

      <TextInput
        label="Statut"
        value={statut}
        onChangeText={setStatut}
        style={styles.input}
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
        Soumettre
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
    marginTop: 20,
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
