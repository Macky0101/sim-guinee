import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Image, Text, TouchableOpacity,Modal,Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRoute } from '@react-navigation/native';
import FormCollect from '../../../services/serviceAgricultures/ficheCollect/serviceFormulaire';
import FormConso from '../../../services/serviceAgricultures/ficheConsommation/serviceFormulaireCons';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as SQLite from 'expo-sqlite';
import { createTables, insertCollecte,checkTableStructure ,updateCollecte} from '../../../database/db';

const FormCollecte = () => {
  const route = useRoute();
  const { id , num_fiche } = route.params;
  const { collecte } = route.params;
  const [numFiche, setNumFiche] = useState(num_fiche || ''); // Stocker num_fiche
  const [unite, setUnite] = useState(0);
  const [poidsUnitaire, setPoidsUnitaire] = useState('');
  const [montantAchat, setMontantAchat] = useState('');
  const [prixFgKg, setPrixFgKg] = useState('');
  const [distanceOrigineMarche, setDistanceOrigineMarche] = useState('');
  const [montantTransport, setMontantTransport] = useState('');
  const [etatRoute, setEtatRoute] = useState('');
  const [quantiteCollecte, setQuantiteCollecte] = useState('');
  const [clientPrincipal, setClientPrincipal] = useState('');
  const [fournisseurPrincipal, setFournisseurPrincipal] = useState('');
  const [niveauApprovisionement, setNiveauApprovisionement] = useState('');
  const [statut, setStatut] = useState('');
  const [observation, setObservation] = useState('');
  const [enquete, setEnquete] = useState(parseInt(id, 10) || 0);
  // const [produit, setProduit] = useState(null);
  const [produits, setProduits] = useState([]);
  const [localiteOrigine, setLocaliteOrigine] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  // const [selectedCategory, setSelectedCategory] = useState(null);
  // const [groupedProduits, setGroupedProduits] = useState({});
  const [prefectures, setPrefectures] = useState([]);
  const [prefecture, setPrefecture] = useState([]);
  const [searchPrefecture, setSearchPrefecture] = useState('');

  const [UniteMesures, setUniteMesures] = useState([]);
  const [UniteMesure, setUniteMesure] = useState([]);
  const [searchUniteMesure, setSearchUniteMesure] = useState('');

  
  const [produit, setProduit] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [groupedProduits, setGroupedProduits] = useState({});
  const [searchProduit, setSearchProduit] = useState('');
  
  useEffect(() => {
    createTables(); // Créer la table lorsque le composant est monté
    // checkTableStructure();
  }, []);

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


  // useEffect(() => {
  //   // getProduit();
  //   getPrefecture();
  //   getUniteMesure();
  //   getCommune();
  //   fetchProduits();
  // }, []);

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



  const getUniteMesure = async () => {
    try {
      const response = await FormCollect.getUniteMesure();
      const UniteMesures = response.map((UniteMesure) => ({
        label: UniteMesure.nom_unite,
        value: UniteMesure.id_unite.toString(), // Assurez-vous que la valeur est bien l'ID correct
      }));
      setUniteMesures(UniteMesures);
      await storeData('uniteMesures', UniteMesures);
    } catch (error) {
      console.error('Erreur lors de la récupération des UniteMesure:', error);
    }
  };



  const renderUniteMesure = () => (
    <Dropdown
      style={styles.dropdown}
      data={UniteMesures.filter(item => item.label?.toLowerCase().includes(searchUniteMesure.toLowerCase()))}

      labelField="label"
      valueField="value"
      placeholder="Sélectionnez une unite de mésure"
      value={UniteMesure}
      onChange={item => setUniteMesure(item.value)}
      search
      searchPlaceholder="Rechercher une unite de mésure..."
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
      const data = response ;
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





  const getPrefecture = async () => {
    try {
      const response = await FormCollect.getPrefecture();
      const prefectures = response.map((prefecture) => ({
        label: prefecture.nom_prefecture,
        value: prefecture.id_prefecture.toString(),
      }));
      // console.log('liste des prefectures', response);
      // console.log('liste des prefecturessss', prefectures);
      setPrefectures(prefectures);
    } catch (error) {
      console.error('Erreur lors de la récupération des préfectures:', error);
    }
  };
  const renderPrefectures = () => (
    <Dropdown
      style={styles.input}
      data={prefectures.filter(item =>
        item.label.toLowerCase().includes(searchPrefecture.toLowerCase())
      )}
      labelField="label"
      valueField="value"
      placeholder="Sélectionnez une localité"
      value={prefecture}
      onChange={item => setPrefecture(item.value)}
      search
      searchPlaceholder="Rechercher..."
      onSearch={setSearchPrefecture}
      renderLeftIcon={() => (
        <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
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
  
// Pré-remplissage des champs avec les données de la collecte
useEffect(() => {
  if (collecte) {
    setQuantiteCollecte(collecte.quantite_collecte.toString());
    setMontantAchat(collecte.montant_achat.toString());
    setClientPrincipal(collecte.client_principal);
    setFournisseurPrincipal(collecte.fournisseur_principal);
    setDistanceOrigineMarche(collecte.distance_origine_marche.toString());
    setNiveauApprovisionement(collecte.niveau_approvisionement);
    setStatut(collecte.statut);
    setObservation(collecte.observation);
    setEnquete(collecte.enquete);
    setProduit(collecte.produit ? { value: collecte.produit } : null);
    setLocaliteOrigine(collecte.localite_origine ? { id: collecte.localite_origine } : null);
  }
}, [collecte]);


// Fonction pour gérer la mise à jour
 const handleUpdate = async () => {
    if (!id) return; // Ensure ID exists for update

    try {
      await updateCollecte(
        id,
        parseInt(UniteMesure, 10),
        parseFloat(poidsUnitaire) || 0,
        parseFloat(montantAchat) || 0,
        parseFloat(prixFgKg) || 0,
        parseFloat(distanceOrigineMarche) || 0,
        parseFloat(montantTransport) || 0,
        etatRoute || '',
        parseFloat(quantiteCollecte) || 0,
        clientPrincipal || '',
        fournisseurPrincipal || '',
        niveauApprovisionement || '',
        statut || '',
        observation || '',
        parseInt(enquete, 10) || 0,
        produit?.value || '',
        parseInt(localiteOrigine?.id, 10) || 0,
        numFiche
      );
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Collecte mise à jour avec succès!',
      });
      navigation.goBack();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour.');
    }
  };



  const postForm = async () => {
    const ficheData = {
      unite: parseInt(UniteMesure, 10),
      poids_unitaire: parseFloat(poidsUnitaire) || 0,
      montant_achat: parseFloat(montantAchat) || 0,
      prix_fg_kg: parseFloat(prixFgKg) || 0,
      distance_origine_marche: parseFloat(distanceOrigineMarche) || 0,
      montant_transport: parseFloat(montantTransport) || 0,
      etat_route: etatRoute || '',
      quantite_collecte: parseFloat(quantiteCollecte) || 0,
      client_principal: clientPrincipal || '',
      fournisseur_principal: fournisseurPrincipal || '',
      niveau_approvisionnement: niveauApprovisionement || '',
      statut: statut || '',
      observation: observation || '',
      enquete: parseInt(enquete, 10) || 0,
      produit: produit.value, 
      localite_origine: parseInt(commune.id, 10) || 0, 
      num_fiche: numFiche
    };
  
    try {
      setLoading(true);
      if (id) {
        // Si l'ID existe, on fait une mise à jour
        await updateCollecte(
          id,
          ficheData.unite,
          ficheData.poids_unitaire,
          ficheData.montant_achat,
          ficheData.prix_fg_kg,
          ficheData.distance_origine_marche,
          ficheData.montant_transport,
          ficheData.etat_route,
          ficheData.quantite_collecte,
          ficheData.client_principal,
          ficheData.fournisseur_principal,
          ficheData.niveau_approvisionnement,
          ficheData.statut,
          ficheData.observation,
          ficheData.enquete,
          ficheData.produit,
          ficheData.localite_origine,
          ficheData.num_fiche
        );
        Toast.show({
          type: 'success',
          text1: 'Succès',
          text2: 'Collecte mise à jour avec succès!',
        });
      } else {
        // Sinon, on crée une nouvelle collecte
        insertCollecte(
          ficheData.unite,
          ficheData.poids_unitaire,
          ficheData.montant_achat,
          ficheData.prix_fg_kg,
          ficheData.distance_origine_marche,
          ficheData.montant_transport,
          ficheData.etat_route,
          ficheData.quantite_collecte,
          ficheData.client_principal,
          ficheData.fournisseur_principal,
          ficheData.niveau_approvisionnement,
          ficheData.statut,
          ficheData.observation,
          ficheData.enquete,
          ficheData.produit,
          ficheData.localite_origine,
          ficheData.num_fiche
        );
        Toast.show({
          type: 'success',
          text1: 'Succès',
          text2: 'Formulaire enregistré avec succès!',
        });
      }
      resetFields();
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Une erreur est survenue. Veuillez réessayer.',
      });
    } finally {
      setLoading(false);
    }
  };
  
  

  const resetFields = () => {
    setUnite(0);
    setPoidsUnitaire(0);
    setMontantAchat(0);
    setPrixFgKg(0);
    setDistanceOrigineMarche(0);
    setMontantTransport(0);
    setEtatRoute('');
    setQuantiteCollecte(0);
    setClientPrincipal('');
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


  return (
    <View style={styles.container}>

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
       {/* {renderPrefectures()} */}
       {renderCommunes()}
      {renderUniteMesure()}
        <TextInput
          label="Poids Unitaire"
          value={poidsUnitaire.toString()}
          onChangeText={text => setPoidsUnitaire(parseFloat(text))}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          label="Montant Achat"
          value={montantAchat.toString()}
          onChangeText={text => setMontantAchat(parseFloat(text))}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          label="Prix FG/kg"
          value={prixFgKg.toString()}
          onChangeText={text => setPrixFgKg(parseFloat(text))}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          label="Distance Origine Marché"
          value={distanceOrigineMarche.toString()}
          onChangeText={text => setDistanceOrigineMarche(parseFloat(text))}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          label="Montant Transport"
          value={montantTransport.toString()}
          onChangeText={text => setMontantTransport(parseFloat(text))}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          label="État Route"
          value={etatRoute}
          onChangeText={text => setEtatRoute(text)}
          style={styles.input}
        />
        <TextInput
          label="Quantité Collectée"
          value={quantiteCollecte.toString()}
          onChangeText={text => setQuantiteCollecte(parseFloat(text))}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          label="Client Principal"
          value={clientPrincipal}
          onChangeText={text => setClientPrincipal(text)}
          style={styles.input}
        />
        <TextInput
          label="Fournisseur Principal"
          value={fournisseurPrincipal}
          onChangeText={text => setFournisseurPrincipal(text)}
          style={styles.input}
        />
        <TextInput
          label="Niveau Approvisionnement"
          value={niveauApprovisionement}
          onChangeText={text => setNiveauApprovisionement(text)}
          style={styles.input}
        />
        <TextInput
          label="Statut"
          value={statut}
          onChangeText={text => setStatut(text)}
          style={styles.input}
        />
        <TextInput
          label="Observation"
          value={observation}
          onChangeText={text => setObservation(text)}
          style={styles.input}
        />


<Button mode="contained" onPress={postForm} style={styles.button}>
  {id ? 'Modifier' : 'Enregistrer'}
</Button>

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

export default FormCollecte;











































// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, ActivityIndicator, Image, Text, TouchableOpacity, Modal, Alert } from 'react-native';
// import { TextInput, Button } from 'react-native-paper';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { useRoute } from '@react-navigation/native';
// import FormCollect from '../../../services/serviceAgricultures/ficheCollect/serviceFormulaire';
// import FormConso from '../../../services/serviceAgricultures/ficheConsommation/serviceFormulaireCons';
// import { Dropdown } from 'react-native-element-dropdown';
// import AntDesign from '@expo/vector-icons/AntDesign';
// import Toast from 'react-native-toast-message';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import NetInfo from '@react-native-community/netinfo';
// import * as SQLite from 'expo-sqlite';
// import { createTables, insertCollecte, checkTableStructure, recreateCollecteTable,deleteAllCollecte } from '../../../database/db';
// import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
// const FormCollecte = () => {
//   const route = useRoute();
//   const { id, num_fiche } = route.params;
//   const [numFiche, setNumFiche] = useState(num_fiche || ''); // Stocker num_fiche
//   const [unite, setUnite] = useState(0);
//   const [poidsUnitaire, setPoidsUnitaire] = useState('');
//   const [montantAchat, setMontantAchat] = useState('');
//   const [prixFgKg, setPrixFgKg] = useState('');
//   const [distanceOrigineMarche, setDistanceOrigineMarche] = useState('');
//   const [montantTransport, setMontantTransport] = useState('');
//   const [etatRoute, setEtatRoute] = useState('');
//   const [quantiteCollecte, setQuantiteCollecte] = useState('');
//   const [clientPrincipal, setClientPrincipal] = useState('');
//   const [fournisseurPrincipal, setFournisseurPrincipal] = useState('');
//   const [niveauApprovisionement, setNiveauApprovisionement] = useState('');
//   const [statut, setStatut] = useState('');
//   const [observation, setObservation] = useState('');
//   const [enquete, setEnquete] = useState(parseInt(id, 10) || 0);
//   // const [produit, setProduit] = useState(null);
//   const [produits, setProduits] = useState([]);
//   const [localiteOrigine, setLocaliteOrigine] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState('');
//   // const [selectedCategory, setSelectedCategory] = useState(null);
//   // const [groupedProduits, setGroupedProduits] = useState({});
//   const [prefectures, setPrefectures] = useState([]);
//   const [prefecture, setPrefecture] = useState([]);
//   const [searchPrefecture, setSearchPrefecture] = useState('');

//   const [UniteMesures, setUniteMesures] = useState([]);
//   const [UniteMesure, setUniteMesure] = useState([]);
//   const [searchUniteMesure, setSearchUniteMesure] = useState('');


//   const [produit, setProduit] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [groupedProduits, setGroupedProduits] = useState({});
//   const [searchProduit, setSearchProduit] = useState('');

//   useEffect(() => {
//     // recreateCollecteTable();
//     createTables(); // Créer la table lorsque le composant est monté
//     // checkTableStructure();
//     // deleteAllCollecte();
//   }, []);

//   const [isConnected, setIsConnected] = useState(true);

//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener(state => {
//       setIsConnected(state.isConnected);
//     });
//     return () => unsubscribe();
//   }, []);


//   useEffect(() => {
//     const loadData = async () => {
//       const produitsLocaux = await loadDataFromStorage('produits');
//       const communesLocales = await loadDataFromStorage('communes');
//       const uniteMesuresLocales = await loadDataFromStorage('uniteMesures');

//       if (produitsLocaux) setGroupedProduits(produitsLocaux);
//       if (communesLocales) setcommunes(communesLocales);
//       if (uniteMesuresLocales) setUniteMesures(uniteMesuresLocales);

//       // Si les données ne sont pas présentes, on les charge depuis l'API
//       if (!produitsLocaux) fetchProduits();
//       if (!communesLocales) getCommune();
//       if (!uniteMesuresLocales) getUniteMesure();
//     };

//     loadData();
//   }, []);

//   useEffect(() => {
//     if (!isConnected) {
//       loadDataFromStorage('produits');
//       loadDataFromStorage('communes');
//       loadDataFromStorage('uniteMesures');
//     } else {
//       fetchProduits();
//       getCommune();
//       getUniteMesure();
//     }
//   }, [isConnected]);

//   useEffect(() => {
//     if (isConnected) {
//       fetchProduits();
//       getCommune();
//       getUniteMesure();
//     }
//   }, [isConnected]);


//   // useEffect(() => {
//   //   // getProduit();
//   //   getPrefecture();
//   //   getUniteMesure();
//   //   getCommune();
//   //   fetchProduits();
//   // }, []);

//   const fetchProduits = async () => {
//     setLoading(true);
//     try {
//       const response = await FormConso.getProduit();
//       const grouped = response.reduce((acc, item) => {
//         const category = item.categorie.nom_categorie_produit;
//         if (!acc[category]) {
//           acc[category] = [];
//         }
//         acc[category].push({
//           label: item.nom_produit,
//           value: item.code_produit,
//           image: item.image || 'https://via.placeholder.com/150',
//         });
//         // console.log('liste des produits',acc[category])
//         return acc;
//       }, {});
//       setGroupedProduits(grouped);
//       await storeData('produits', grouped);
//     } catch (error) {
//       console.error('Erreur lors de la récupération des produits:', error);
//       // Alert.alert(
//       //   'Erreur',
//       //   'Impossible de récupérer les produits. Veuillez réessayer plus tard.'
//       // );
//     } finally {
//       setLoading(false);
//     }
//   };
//   /**
//  * Rendu du dropdown des produits
//  */
//   const renderProductsDropdown = () => {
//     if (!selectedCategory) return null;
//     const products = groupedProduits[selectedCategory] || [];

//     return (
//       <Dropdown
//         style={styles.dropdown}
//         data={products.filter((product) =>
//           product.label && product.label.toLowerCase().includes(searchProduit.toLowerCase())

//         )}
//         search
//         searchPlaceholder="Rechercher un produit..."
//         labelField="label"
//         valueField="value"
//         placeholder="Sélectionnez un produit"
//         value={produit}
//         onChange={(item) => setProduit(item)}
//         onChangeText={(text) => setSearchProduit(text)}
//         renderLeftIcon={() => (
//           <AntDesign name="shoppingcart" size={20} color="black" style={styles.icon} />
//         )}
//         renderItem={(item) => (
//           <View style={styles.itemContainer}>
//             <Image source={{ uri: item.image }} style={styles.image} />
//             <Text>{item.label}</Text>
//           </View>
//         )}
//       />
//     );
//   };



//   const getUniteMesure = async () => {
//     try {
//       const response = await FormCollect.getUniteMesure();
//       const UniteMesures = response.map((UniteMesure) => ({
//         label: UniteMesure.nom_unite,
//         value: UniteMesure.id_unite.toString(), // Assurez-vous que la valeur est bien l'ID correct
//       }));
//       setUniteMesures(UniteMesures);
//       await storeData('uniteMesures', UniteMesures);
//     } catch (error) {
//       console.error('Erreur lors de la récupération des UniteMesure:', error);
//     }
//   };



//   const renderUniteMesure = () => (
//     <Dropdown
//       style={styles.dropdown}
//       data={UniteMesures.filter(item => item.label?.toLowerCase().includes(searchUniteMesure.toLowerCase()))}

//       labelField="label"
//       valueField="value"
//       placeholder="Sélectionnez une unite de mésure"
//       value={UniteMesure}
//       onChange={item => setUniteMesure(item.value)}
//       search
//       searchPlaceholder="Rechercher une unite de mésure..."
//       onSearch={setSearchUniteMesure}
//       renderLeftIcon={() => (
//         <AntDesign style={styles.icon} color="black" name="barschart" size={20} />
//       )}
//     />
//   );

//   const [communes, setcommunes] = useState([]);
//   const [commune, setCommune] = useState([]);
//   const [searchCommune, setSearchCommune] = useState('');
//   const getCommune = async () => {
//     try {
//       const response = await FormConso.getCommune();
//       // console.log('commune data response', response); // Log the full response
//       // console.log('commune data', response.data); // Log response.data

//       if (!response || !response) {
//         console.error('No data found in the response');
//         return;
//       }
//       const data = response;
//       const communes = data.map(commune => ({
//         id: commune.id_commune,
//         nom: commune.nom_commune ? commune.nom_commune.toLowerCase() : '',
//       }));
//       // console.log('commune data', communes);
//       setcommunes(communes);
//       await storeData('communes', communes);
//     } catch (error) {
//       console.error('Erreur lors de la récupération des communes:', error);
//     }
//   };


//   const renderCommunes = () => (
//     <Dropdown
//       style={styles.dropdown}
//       data={communes.filter(item => item.nom && item.nom.toLowerCase().includes(searchCommune.toLowerCase()))}

//       labelField="nom"
//       valueField="id"
//       placeholder="Sélectionnez une localité"
//       value={commune.id}
//       onChange={item => setCommune(item)}
//       search
//       searchPlaceholder="Rechercher..."
//       onSearch={setSearchCommune}
//       renderLeftIcon={() => (
//         <AntDesign style={styles.icon} color="black" name="enviromento" size={20} />
//       )}
//     />
//   );


//   const storeData = async (key, value) => {
//     try {
//       await AsyncStorage.setItem(key, JSON.stringify(value));
//     } catch (error) {
//       console.error('Erreur lors de la sauvegarde des données:', error);
//     }
//   };

//   const loadDataFromStorage = async (key) => {
//     try {
//       const jsonValue = await AsyncStorage.getItem(key);
//       return jsonValue != null ? JSON.parse(jsonValue) : null;
//     } catch (error) {
//       console.error('Erreur lors du chargement des données locales:', error);
//     }
//   };


//   const postForm = async () => {
//     const ficheData = {
//       unite: parseInt(UniteMesure, 10),
//       poids_unitaire: parseFloat(poidsUnitaire) || 0,
//       montant_achat: parseFloat(montantAchat) || 0,
//       prix_fg_kg: parseFloat(prixFgKg) || 0,
//       distance_origine_marche: parseFloat(distanceOrigineMarche) || 0,
//       montant_transport: parseFloat(montantTransport) || 0,
//       etat_route: etatRoute || '',
//       quantite_collecte: parseFloat(quantiteCollecte) || 0,
//       client_principal: clientPrincipal || '',
//       fournisseur_principal: fournisseurPrincipal || '',
//       niveau_approvisionement: niveauApprovisionement || '',
//       statut: statut || '',
//       observation: observation || '',
//       enquete: parseInt(enquete, 10) || 0,
//       produit: produit.value,
//       localite_origine: parseInt(commune.id, 10) || 0, // Conversion de la localité d'origine
//       num_fiche: numFiche
//     };
//     // Insérer les données dans la base de données
//     insertCollecte(
//       ficheData.unite,
//       ficheData.poids_unitaire,
//       ficheData.montant_achat,
//       ficheData.prix_fg_kg,
//       ficheData.distance_origine_marche,
//       ficheData.montant_transport,
//       ficheData.etat_route,
//       ficheData.quantite_collecte,
//       ficheData.client_principal,
//       ficheData.fournisseur_principal,
//       ficheData.niveau_approvisionement,
//       ficheData.statut,
//       ficheData.observation,
//       ficheData.enquete,
//       ficheData.produit,
//       ficheData.localite_origine,
//       ficheData.num_fiche
//     );
//     console.log('donne envoyer', ficheData);
//     Alert.alert('Succès', 'Les données ont été insérées dans la base de données.');

//     try {
//       setLoading(true);
//       // await FormCollect.postFormCollect(ficheData);
//       Toast.show({
//         type: 'success',
//         text1: 'Succès',
//         text2: 'Formulaire enregistré avec succès!',
//       });
//       resetFields();
//     } catch (error) {
//       console.error('Erreur lors de la création de la fiche:', error);
//       Toast.show({
//         type: 'error',
//         text1: 'Erreur',
//         text2: 'Une erreur est survenue. Veuillez réessayer.',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };


//   const resetFields = () => {
//     setUnite(0);
//     setPoidsUnitaire(0);
//     setMontantAchat(0);
//     setPrixFgKg(0);
//     setDistanceOrigineMarche(0);
//     setMontantTransport(0);
//     setEtatRoute('');
//     setQuantiteCollecte(0);
//     setClientPrincipal('');
//     setFournisseurPrincipal('');
//     setNiveauApprovisionement('');
//     setStatut('');
//     setObservation('');
//     setEnquete(parseInt(id, 10));
//     setProduit(null);
//     setLocaliteOrigine('');
//     setSearch('');
//     setSelectedCategory(null);
//   };


//   const handleCategoryChange = (category) => {
//     setSelectedCategory(category);
//     setProduit(null); // Reset selected product when category changes
//   };

//   const renderProducts = () => {
//     if (!selectedCategory) return null;

//     const products = groupedProduits[selectedCategory];

//     return (
//       <Dropdown
//         style={styles.input}
//         data={products.filter(product => product.label.toLowerCase().includes(search.toLowerCase()))}
//         labelField="label"
//         valueField="value"
//         placeholder="Sélectionnez un produit"
//         value={produit}
//         onChange={item => setProduit(item)}
//         search
//         searchPlaceholder="Rechercher..."
//         onSearch={setSearch}
//         renderLeftIcon={() => (
//           <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
//         )}
//         renderItem={(item) => (
//           <View style={styles.itemContainer}>
//             <Image source={{ uri: item.image }} style={styles.image} />
//             <Text>{item.label}</Text>
//           </View>
//         )}
//       />
//     );
//   };

//   const etatRouteOptions = [
//     { label: 'Bon', value: 'Bon' },
//     { label: 'Moyen', value: 'Moyen' },
//     { label: 'Mauvais', value: 'Mauvais' },
//   ];

//   const niveauApprovisionementOptions = [
//     { label: 'Haut', value: 'Haut' },
//     { label: 'Moyen', value: 'Moyen' },
//     { label: 'Faible', value: 'Faible' },
//   ];

//   const statutOptions = [
//     { label: 'En cours', value: 'En cours' },
//     { label: 'Terminé', value: 'Terminé' },
//     { label: 'Annulé', value: 'Annulé' },
//   ];

//   return (
//     <View style={styles.container}>

//       <Modal
//         transparent={true}
//         animationType="none"
//         visible={loading}
//         onRequestClose={() => { }}
//       >
//         <View style={styles.modalBackground}>
//           <View style={styles.activityIndicatorWrapper}>
//             <ActivityIndicator size="large" color="#0000ff" />
//           </View>
//         </View>
//       </Modal>

//       <KeyboardAwareScrollView contentContainerStyle={styles.inner}>
//         <Text style={styles.sectionTitle}>Produit</Text>
//         <Dropdown
//           style={styles.dropdown}
//           data={Object.keys(groupedProduits).map((category) => ({
//             label: category,
//             value: category,
//           }))}
//           search
//           searchPlaceholder="Rechercher une catégorie..."
//           labelField="label"
//           valueField="value"
//           placeholder="Sélectionnez une catégorie"
//           value={selectedCategory}
//           onChange={(item) => handleCategoryChange(item.value)}
//           onChangeText={(text) => setSearchProduit(text)}
//           renderLeftIcon={() => (
//             <AntDesign name="appstore-o" size={20} color="black" style={styles.icon} />
//           )}
//         />

//         {renderProductsDropdown()}
//         {renderCommunes()}
//         {renderUniteMesure()}
//         <TextInput
//           label="Poids Unitaire"
//           value={poidsUnitaire.toString()}
//           onChangeText={text => setPoidsUnitaire(parseFloat(text))}
//           keyboardType="numeric"
//           style={styles.input}
//         />
//         <TextInput
//           label="Montant Achat"
//           value={montantAchat.toString()}
//           onChangeText={text => setMontantAchat(parseFloat(text))}
//           keyboardType="numeric"
//           style={styles.input}
//         />
//         <TextInput
//           label="Prix FG/kg"
//           value={prixFgKg.toString()}
//           onChangeText={text => setPrixFgKg(parseFloat(text))}
//           keyboardType="numeric"
//           style={styles.input}
//         />
//         <TextInput
//           label="Distance Origine Marché"
//           value={distanceOrigineMarche.toString()}
//           onChangeText={text => setDistanceOrigineMarche(parseFloat(text))}
//           keyboardType="numeric"
//           style={styles.input}
//         />
//         <TextInput
//           label="Montant Transport"
//           value={montantTransport.toString()}
//           onChangeText={text => setMontantTransport(parseFloat(text))}
//           keyboardType="numeric"
//           style={styles.input}
//         />
//         <Dropdown
//           style={styles.dropdown}
//           data={etatRouteOptions}
//           labelField="label"
//           valueField="value"
//           placeholder="Sélectionnez l'état de la route"
//           value={etatRoute}
//           onChange={item => setEtatRoute(item.value)}
//           renderLeftIcon={() => (
//             <FontAwesome name="road" size={20} color="black" style={styles.icon} />  // Utilise FontAwesome pour l'icône de route
//           )}
//         />
//         <TextInput
//           label="Quantité Collectée"
//           value={quantiteCollecte.toString()}
//           onChangeText={text => setQuantiteCollecte(parseFloat(text))}
//           keyboardType="numeric"
//           style={styles.input}
//         />
//         <TextInput
//           label="Client Principal"
//           value={clientPrincipal}
//           onChangeText={text => setClientPrincipal(text)}
//           style={styles.input}
//         />
//         <TextInput
//           label="Fournisseur Principal"
//           value={fournisseurPrincipal}
//           onChangeText={text => setFournisseurPrincipal(text)}
//           style={styles.input}
//         />
//         <Dropdown
//           style={styles.dropdown}
//           data={niveauApprovisionementOptions}
//           labelField="label"
//           valueField="value"
//           placeholder=" niveau d'approvisionnement"
//           value={niveauApprovisionement}
//           onChange={item => setNiveauApprovisionement(item.value)}
//           renderLeftIcon={() => (
//             <AntDesign name="barschart" size={20} color="black" style={styles.icon} />  // Icône pour le niveau d'approvisionnement
//           )}
//         />
//         <Dropdown
//           style={styles.dropdown}
//           data={statutOptions}
//           labelField="label"
//           valueField="value"
//           placeholder="Sélectionnez le statut"
//           value={statut}
//           onChange={item => setStatut(item.value)}
//           renderLeftIcon={() => (
//             <AntDesign name="infocirlce" size={20} color="black" style={styles.icon} />  // Icône pour le statut
//           )}
//         />
//         <TextInput
//           label="Observation"
//           value={observation}
//           onChangeText={text => setObservation(text)}
//           multiline
//           numberOfLines={4}
//           style={styles.input}
//         />


//         <Button mode="contained" onPress={postForm} style={styles.button}>
//           Enregistrer
//         </Button>
//       </KeyboardAwareScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   inner: {
//     padding: 10,
//   },
//   input: {
//     marginBottom: 15,
//     backgroundColor: '#fff',
//   },
//   dropdown: {
//     marginBottom: 10,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     height: 50,
//     justifyContent: 'center',
//   },
//   icon: {
//     marginRight: 10,
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   image: {
//     width: 40,
//     height: 40,
//     marginRight: 10,
//   },
//   button: {
//     marginTop: 20,
//     backgroundColor:'#009C57'

//   },
//   modalBackground: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   activityIndicatorWrapper: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     padding: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// export default FormCollecte;
