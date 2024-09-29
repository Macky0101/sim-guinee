import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Image, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRoute } from '@react-navigation/native';
import database from '../../../database/database';
import FormCollect from '../../../services/serviceAgricultures/ficheCollect/serviceFormulaire';
import FormConso from '../../../services/serviceAgricultures/ficheConsommation/serviceFormulaireCons';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import {createCollecte} from '../../../database/collecteService';
import axios from 'axios';

const FormCollecte = () => {
  const route = useRoute();
  const { id, num_fiche,type_marche } = route.params;
  const [numFiche, setNumFiche] = useState(num_fiche || ''); // Stocker num_fiche
  const [typemarche, settype_marche] = useState(type_marche || ''); // Stocker type_marche
  // console.log('typemarche', typemarche);
  const [unite, setUnite] = useState(0);
  const [poids_unitaire, setPoidsUnitaire] = useState('');
  const [montant_achat, setMontantAchat] = useState('');
  const [prix_fg_kg, setPrixFgKg] = useState('');
  const [distance_origine_marche, setDistanceOrigineMarche] = useState('');
  const [destination_finale, Setdestination_finale] = useState('');
  const [etat_route, setEtatRoute] = useState('');
  const [quantite_collecte, setQuantiteCollecte] = useState('');
  const [etat, Setetat] = useState('');
  const [fournisseur_principal, setFournisseurPrincipal] = useState('');
  const [niveau_approvisionement, setNiveauApprovisionement] = useState('');
  const [statut, setStatut] = useState('');
  const [observation, setObservation] = useState('');
  const [enquete, setEnquete] = useState(parseInt(id, 10) || 0);
  // const [produit, setProduit] = useState(null);
  const [produits, setProduits] = useState([]);
  const [localite_origine, setLocaliteOrigine] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  // const [selectedCategory, setSelectedCategory] = useState(null);
  // const [groupedProduits, setGroupedProduits] = useState({});
  const [prefectures, setPrefectures] = useState([]);
  const [prefecture, setPrefecture] = useState([]);
  const [searchPrefecture, setSearchPrefecture] = useState('');

  // const [UniteMesures, setUniteMesures] = useState([]);
  // const [UniteMesure, setUniteMesure] = useState([]);
  const [searchUniteMesure, setSearchUniteMesure] = useState('');


  const [produit, setProduit] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [groupedProduits, setGroupedProduits] = useState({});
  const [searchProduit, setSearchProduit] = useState('');


  const [isConnected, setIsConnected] = useState(true);


    // États pour les messages d'erreur
    const [produitError, setProduitError] = useState('');
    const [localiteError, setLocaliteError] = useState('');
    const [uniteError, setUniteError] = useState('');
    const [montantAchatError, setMontantAchatError] = useState('');
    const [prixFgKgError, setPrixFgKgError] = useState('');
     // Fonction de validation
  const validateFields = () => {
    let isValid = true;

    if (!produit) {
      setProduitError('Veuillez sélectionner un produit.');
      isValid = false;
    } else {
      setProduitError('');
    }

    if (!commune) {
      setLocaliteError('Veuillez sélectionner une localité.');
      isValid = false;
    } else {
      setLocaliteError('');
    }

    if (!UniteMesure) {
      setUniteError('Veuillez sélectionner une unité de mesure.');
      isValid = false;
    } else {
      setUniteError('');
    }

    if (!montant_achat) {
      setMontantAchatError('Veuillez entrer le montant de l\'achat.');
      isValid = false;
    } else {
      setMontantAchatError('');
    }

    if (!prix_fg_kg) {
      setPrixFgKgError('Veuillez entrer le prix par kg.');
      isValid = false;
    } else {
      setPrixFgKgError('');
    }

    return isValid;
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const loadData = async () => {
      const produitsLocaux = await loadDataFromStorage('produits');
      const communesLocales = await loadDataFromStorage('communes');
      const uniteMesuresLocales = await loadDataFromStorage('uniteMesures');

      if (produitsLocaux) setGroupedProduits(produitsLocaux);
      if (communesLocales) setcommunes(communesLocales);
      if (uniteMesuresLocales) setUniteMesures(uniteMesuresLocales);

      // Si les données ne sont pas présentes, on les charge depuis l'API
      if (!produitsLocaux) fetchProduits();
      if (!communesLocales) getCommune();
      if (!uniteMesuresLocales) getUniteMesure();
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!isConnected) {
      loadDataFromStorage('produits');
      loadDataFromStorage('communes');
      loadDataFromStorage('uniteMesures');
    } else {
      fetchProduits();
      getCommune();
      getUniteMesure();
    }
  }, [isConnected]);

  useEffect(() => {
    if (isConnected) {
      fetchProduits();
      getCommune();
      getUniteMesure();
    }
  }, [isConnected]);

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
        // console.log('liste des produits',acc[category])
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



  const [UniteMesures, setUniteMesures] = useState([]);
const [UniteMesure, setUniteMesure] = useState(null); // Ajoutez cet état pour stocker l'unité sélectionnée

// const getUniteMesure = async () => {
//   try {
//     const response = await FormCollect.getUniteMesure();
//     const UniteMesures = response.map((UniteMesure) => ({
//       label: UniteMesure.nom_unite,
//       value: UniteMesure.id_unite.toString(), // Assurez-vous que la valeur est bien l'ID correct
//     }));
//     setUniteMesures(UniteMesures);
//     // console.log('UniteMesures', UniteMesures);
//     await storeData('uniteMesures', UniteMesures);
//   } catch (error) {
//     console.error('Erreur lors de la récupération des UniteMesure:', error);
//   }
// };

useEffect(() => {
  console.log('type_marche:', type_marche);
  getUniteMesure();
}, [type_marche]);

const getUniteMesure = async () => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) {
      throw new Error('Aucun jeton trouvé');
    }

    const response = await axios.get(`http://92.112.194.154:8000/api/parametrages/unites/associated-unites/type-marche?id_of_type_market=${type_marche}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    const UniteMesures = response.data[0].unites.map((unite) => ({
      label: unite.unite_relation.nom_unite,
      value: unite.id, // Assurez-vous que la valeur est bien l'ID correct
    }));
    
    setUniteMesures(UniteMesures);
    await storeData('uniteMesures', UniteMesures);
  } catch (error) {
    console.error('Erreur lors de la récupération des UniteMesure:', error.response ? error.response.data : error.message);
  }
};

useEffect(() => {
  getUniteMesure();
}, [type_marche]);

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

  const [communes, setcommunes] = useState([]);
  const [commune, setCommune] = useState([]);
  const [searchCommune, setSearchCommune] = useState('');
  const getCommune = async () => {
    try {
      const response = await FormConso.getCommune();
      // console.log('commune data response', response); // Log the full response
      // console.log('commune data', response.data); // Log response.data

      if (!response || !response) {
        console.error('No data found in the response');
        return;
      }
      const data = response;
      const communes = data.map(commune => ({
        id: commune.id_commune,
        nom: commune.nom_commune ? commune.nom_commune.toLowerCase() : '',
      }));
      // console.log('commune data', communes);
      setcommunes(communes);
      await storeData('communes', communes);
    } catch (error) {
      console.error('Erreur lors de la récupération des communes:', error);
    }
  };


  const renderCommunes = () => (
    <Dropdown
      style={styles.dropdown}
      data={communes.filter(item => item.nom && item.nom.toLowerCase().includes(searchCommune.toLowerCase()))}

      labelField="nom"
      valueField="id"
      placeholder="Sélectionnez une localité"
      value={commune.id}
      onChange={item => setCommune(item)}
      search
      searchPlaceholder="Rechercher..."
      onSearch={setSearchCommune}
      renderLeftIcon={() => (
        <AntDesign style={styles.icon} color="black" name="enviromento" size={20} />
      )}
    />
  );


  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données:', error);
    }
  };

  const loadDataFromStorage = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Erreur lors du chargement des données locales:', error);
    }
  };



  const resetFields = () => {
    setUnite(0);
    setPoidsUnitaire(0);
    setMontantAchat(0);
    setPrixFgKg(0);
    setDistanceOrigineMarche(0);
    Setdestination_finale(0);
    setEtatRoute('');
    setQuantiteCollecte(0);
    Setetat('');
    setFournisseurPrincipal('');
    setNiveauApprovisionement('');
    setStatut('');
    setObservation('');
    setEnquete(parseInt(id, 10));
    setProduit(null);
    setLocaliteOrigine('');
    setSearch('');
    setSelectedCategory(null);
  };


  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setProduit(null); // Reset selected product when category changes
  };

  const renderProducts = () => {
    if (!selectedCategory) return null;

    const products = groupedProduits[selectedCategory];

    return (
      <Dropdown
        style={styles.input}
        data={products.filter(product => product.label.toLowerCase().includes(search.toLowerCase()))}
        labelField="label"
        valueField="value"
        placeholder="Sélectionnez un produit"
        value={produit}
        onChange={item => setProduit(item)}
        search
        searchPlaceholder="Rechercher..."
        onSearch={setSearch}
        renderLeftIcon={() => (
          <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
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


const handleSaveCollect = async () => {
  if (!validateFields()) {  // Ne pas exécuter la fonction d'enregistrement si la validation échoue
    Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
    return;  // Arrêter l'exécution si les champs ne sont pas valides
}
  try {
   const ficheData ={
    unite: UniteMesure,
    poids_unitaire,
    montant_achat,
    prix_fg_kg,
    etat_route,
    quantite_collecte,
    niveau_approvisionement,
    statut: getStatusForAPI(statut),
    observation,
    etat,
    enquete,
    produit: produit?.value,
    destination_finale:commune?.id,
    numFiche,
   };
   resetFields();
   try {
    await createCollecte(ficheData);
    console.log("Envoi réussi",ficheData);
  } catch (error) {
    console.error("Erreur lors de la création de la fiche:", error);
  }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement dans la table collecte:', error);
  }
};
  
  const deleteAllCollects = async () => {
    try {
      await database.write(async () => {
        const allCollects = await database.get('collecte').query().fetch();
        allCollects.forEach(async (collect) => {
          await collect.markAsDeleted(); // Suppression logique de chaque collecte
        });
      });
      console.log('Toutes les entrées de la table collecte ont été supprimées.');
    } catch (error) {
      console.error('Erreur lors de la suppression de toutes les entrées collecte :', error);
    }
  };

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
  
  
  const etatRouteOptions = [
    { label: 'Bon', value: 'Bon' },
    { label: 'Moyen', value: 'Moyen' },
    { label: 'Mauvais', value: 'Mauvais' },
  ];

  const niveauApprovisionementOptions = [
    { label: 'Abondant', value: 'Abondant' },
    { label: 'Normal', value: 'Normal' },
    { label: 'Rare', value: 'Rare' },
  ];

  const statutOptions = [
    { label: 'En cours', value: 'En cours' },
    { label: 'Terminé', value: 'Terminé' },
    { label: 'Annulé', value: 'Annulé' },
  ];

  return (
    <View style={styles.container}>

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

      <KeyboardAwareScrollView contentContainerStyle={styles.inner}>
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
        {produitError ? <Text style={styles.errorText}>{produitError}</Text> : null}
        {renderCommunes()}
        {localiteError ? <Text style={styles.errorText}>{localiteError}</Text> : null}
        {/* <Text>{UniteMesure}</Text> */}
        {renderUniteMesure()}
        {uniteError ? <Text style={styles.errorText}>{uniteError}</Text> : null}
        <TextInput
          label="Poids Unitaire"
          value={poids_unitaire.toString()}
          onChangeText={text => setPoidsUnitaire(parseFloat(text))}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          label="Montant Achat"
          value={montant_achat.toString()}
          onChangeText={text => setMontantAchat(parseFloat(text))}
          keyboardType="numeric"
          style={styles.input}
        />
        {montantAchatError ? <Text style={styles.errorText}>{montantAchatError}</Text> : null}
        <TextInput
          label="Prix FG/kg"
          value={prix_fg_kg.toString()}
          onChangeText={text => setPrixFgKg(parseFloat(text))}
          keyboardType="numeric"
          style={styles.input}
        />
        {prixFgKgError ? <Text style={styles.errorText}>{prixFgKgError}</Text> : null}
        <TextInput
          label="Distance Origine Marché"
          value={distance_origine_marche.toString()}
          onChangeText={text => setDistanceOrigineMarche(parseFloat(text))}
          keyboardType="numeric"
          style={styles.input}
        />
       
        <Dropdown
          style={styles.dropdown}
          data={etatRouteOptions}
          labelField="label"
          valueField="value"
          placeholder="Sélectionnez l'état de la route"
          value={etat_route}
          onChange={item => setEtatRoute(item.value)}
          renderLeftIcon={() => (
            <FontAwesome name="road" size={20} color="black" style={styles.icon} />  // Utilise FontAwesome pour l'icône de route
          )}
        />
        <TextInput
          label="Quantité Collectée"
          value={quantite_collecte.toString()}
          onChangeText={text => setQuantiteCollecte(parseFloat(text))}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          label="Etat"
          value={etat}
          onChangeText={text => Setetat(text)}
          style={styles.input}
        />
        {/* <TextInput
          label="Fournisseur Principal"
          value={fournisseur_principal}
          onChangeText={text => setFournisseurPrincipal(text)}
          style={styles.input}
        /> */}
        <Dropdown
          style={styles.dropdown}
          data={niveauApprovisionementOptions}
          labelField="label"
          valueField="value"
          placeholder=" niveau d'approvisionnement"
          value={niveau_approvisionement}
          onChange={item => setNiveauApprovisionement(item.value)}
          renderLeftIcon={() => (
            <AntDesign name="barschart" size={20} color="black" style={styles.icon} />  // Icône pour le niveau d'approvisionnement
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
            <AntDesign name="infocirlce" size={20} color="black" style={styles.icon} />  // Icône pour le statut
          )}
        />
         {/* <TextInput
          label="Destination finale"
          value={destination_finale.toString()}
          onChangeText={text => Setdestination_finale(parseFloat(text))}
          keyboardType="numeric"
          style={styles.input}
        /> */}
        <TextInput
          label="Observation"
          value={observation}
          onChangeText={text => setObservation(text)}
          multiline
          numberOfLines={4}
          style={styles.input}
        />


        <Button mode="contained" onPress={handleSaveCollect} style={styles.button}>
          Enregistrer
        </Button>
        {/* <Button mode="contained" onPress={deleteAllCollects} style={styles.button}>
          sup
        </Button> */}
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  inner: {
    padding: 10,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
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
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor:'#009C57'

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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});

export default FormCollecte;
