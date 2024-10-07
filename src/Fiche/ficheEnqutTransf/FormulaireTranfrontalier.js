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
import DateTimePicker from '@react-native-community/datetimepicker';


const FormulaireTranfrontalier = () => {
  const route = useRoute();
  const { id, idCollecteur, id_marche, type_marche, ficheId, num_fiche, external_id } = route.params;
  const [typeMarche, setTypeMarche] = useState(type_marche || '');
  const [numFiche, setNumFiche] = useState(num_fiche || ''); // Stocker num_fiche
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);


  const [observation, setObservation] = useState('');
  const [produit, setProduit] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [prix_vente, setprix_vente] = useState('');
  const [prix_achat, setprix_achat] = useState('');
  const [quantite_sortant, setquantite_sortant] = useState('');
  const [quantite_entrant, setquantite_entrant] = useState('');

  // États pour gérer les données récupérées de l'API
  const [groupedProduits, setGroupedProduits] = useState({});

  // États pour gérer le chargement et les recherches
  const [loading, setLoading] = useState(false);
  const [searchProduit, setSearchProduit] = useState('');
  const [searchUniteMesure, setSearchUniteMesure] = useState('');

  const [pays_destination, setpays_destination] = useState('');
  const [pays_origine, setpays_origine] = useState('');

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
  const [regions, setRegions] = useState([]);
  const [regionsDestination, setRegionsDestination] = useState([]);
  const [regionProvenance, setRegionProvenance] = useState(null);
  const [regionDestination, setRegionDestination] = useState(null);
  const [searchRegionProvenance, setSearchRegionProvenance] = useState('');
  const [searchRegionDestination, setSearchRegionDestination] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer les régions depuis l'API
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch('https://sim-guinee.org/api/parametrages/localites/regions');
        const data = await response.json();
        setRegions(data);
        setRegionsDestination(data);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: 'Impossible de récupérer les régions.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegions();
  }, []);

  // Fonction pour afficher le dropdown de sélection de la région d'origine
  const renderRegionProvenance = () => (
    <Dropdown
      style={styles.dropdown}
      data={regions.filter((region) =>
        region.nom_region.toLowerCase().includes(searchRegionProvenance.toLowerCase())
      )}
      search
      searchPlaceholder="Rechercher une région..."
      labelField="nom_region" // Affiche le nom de la région
      valueField="code_region" // Utilise le code de la région comme valeur
      placeholder="Région d'origine"
      value={regionProvenance}
      onChange={(item) => {
        setRegionProvenance(item.code_region);
      }}
      onChangeText={(text) => setSearchRegionProvenance(text)}
    />
  );

  // Fonction pour afficher le dropdown de sélection de la région de destination
  const renderRegionDestination = () => (
    <Dropdown
      style={styles.dropdown}
      data={regionsDestination.filter((region) =>
        region.nom_region.toLowerCase().includes(searchRegionDestination.toLowerCase())
      )}
      search
      searchPlaceholder="Rechercher une région..."
      labelField="nom_region" // Affiche le nom de la région
      valueField="code_region" // Utilise le code de la région comme valeur
      placeholder="Région finale du produit"
      value={regionDestination}
      onChange={(item) => {
        setRegionDestination(item.code_region);
      }}
      onChangeText={(text) => setSearchRegionDestination(text)}
    />
  );

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
    if (!UniteMesure || !produit || !prix_vente || !prix_achat) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Veuillez remplir tous les champs obligatoires.',
        position: 'bottom'
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
        date_enquete: date.toISOString().split('T')[0], 
        prix_vente,
        prix_achat,
        collecteur: idCollecteur,
        quantite_sortant,
        quantite_entrant,
        region_provenance: regionProvenance,
        region_destination: regionDestination,
        pays_destination,
        pays_origine,
        observation,
        enquete: external_id,
        produit: produit.value,
        fiche_id: ficheId,
      };
      console.log("Données envoyées à WatermelonDB:", ficheData);

      await ConsommationServices.createTranfrontanlier(ficheData);
      console.log("Envoi réussi", ficheData);
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
    setObservation('');
    setProduit(null);
    setSelectedCategory(null);
    setUniteMesure(null);
    setprix_vente('');
    setprix_achat('');
    setquantite_sortant('');
    setquantite_entrant('');
    setSearchRegionDestination('');
    setSearchRegionProvenance('');
    setpays_destination('');
    setpays_origine('');
    setpays_destination('');
    setRegionProvenance('');
    validateFields('');
  };


  const Data_pays_destination = [
    { label: "Guinée", value: "Guinée" },
    { label: "Côte d'Ivoire", value: "Côte d'Ivoire" },
    { label: "Sierra Leone", value: "Sierra Leone" },
    { label: "Libéria", value: "Libéria" },
    { label: "Guinée Bissau", value: "Guinée Bissau" },
    { label: "Sénégal", value: "Sénégal" },
    { label: "Mali", value: "Mali" },
  ];
  const Data_PayeDorigine = [
    { label: "Guinée", value: "Guinée" },
    { label: "Côte d'Ivoire", value: "Côte d'Ivoire" },
    { label: "Sierra Leone", value: "Sierra Leone" },
    { label: "Libéria", value: "Libéria" },
    { label: "Guinée Bissau", value: "Guinée Bissau" },
    { label: "Sénégal", value: "Sénégal" },
    { label: "Mali", value: "Mali" },
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
      <TextInput
        label="Date d'enquête"
        value={date.toLocaleDateString('fr-FR')}
        onPressIn={() => setShowDatePicker(true)}
        style={styles.input}
      />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
          locale="fr-FR"
        />
      )}
      {/* <Text style={styles.sectionTitle}>Produit</Text> */}
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
      {renderRegionProvenance()}
      {renderRegionDestination()}
      <TextInput
        label="prix de vente"
        value={prix_vente}
        onChangeText={setprix_vente}
        style={styles.input}
        keyboardType='numeric'
      />

      <TextInput
        label="prix achat"
        value={prix_achat}
        onChangeText={setprix_achat}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="quantite sortant"
        value={quantite_sortant}
        onChangeText={setquantite_sortant}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="quantite entrant"
        value={quantite_entrant}
        onChangeText={setquantite_entrant}
        keyboardType="numeric"
        style={styles.input}
      />
<Dropdown
          style={styles.dropdown}
          data={Data_PayeDorigine}
          labelField="label"
          valueField="value"
          placeholder="Pays d'origine"
          value={pays_origine}
          onChange={item => setpays_origine(item.value)}
          renderLeftIcon={() => (
            <FontAwesome name="flag" size={20} color="black" style={styles.icon} /> 
          )}
        />
        <Dropdown
          style={styles.dropdown}
          data={Data_pays_destination}
          labelField="label"
          valueField="value"
          placeholder="Destination du pays"
          value={pays_destination}
          onChange={item => setpays_destination(item.value)}
          renderLeftIcon={() => (
            <FontAwesome name="flag" size={20} color="black" style={styles.icon} />  // Utilise FontAwesome pour l'icône de route
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

export default FormulaireTranfrontalier