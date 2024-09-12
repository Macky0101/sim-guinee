import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Image, Text, TouchableOpacity, Alert, Modal } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRoute } from '@react-navigation/native';
import FormGrossiste from '../../../services/serviceAgricultures/ficheGrossiste/formGrossiste';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import FormConso from '../../../services/serviceAgricultures/ficheConsommation/serviceFormulaireCons';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createTables, insertgrossistes,deleteAllGros } from '../../../database/requeteGros';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const FormGrossistes = () => {
  const route = useRoute();
  const { id, num_fiche } = route.params;
  const [numFiche, setNumFiche] = useState(num_fiche || ''); // Stocker num_fiche
  const [uniteStock, setUniteStock] = useState(0);
  const [poidsMoyenUniteStock, setPoidsMoyenUniteStock] = useState('');
  const [poidsStock, setPoidsStock] = useState('');
  const [uniteAchat, setUniteAchat] = useState('');
  const [nombreUniteAchat, setNombreUniteAchat] = useState('');
  const [poidsMoyenUniteAchat, setPoidsMoyenUniteAchat] = useState('');
  const [poidsTotalAchat, setPoidsTotalAchat] = useState('');
  const [localiteAchat, setLocaliteAchat] = useState('');
  const [fournisseurAchat, setFournisseurAchat] = useState('');
  const [uniteVente, setUniteVente] = useState('');
  const [nombreUniteVente, setNombreUniteVente] = useState('');
  const [poidsMoyenUniteVente, setPoidsMoyenUniteVente] = useState('');
  const [poidsTotalUniteVente, setPoidsTotalUniteVente] = useState('');
  const [prixUnitaireVente, setPrixUnitaireVente] = useState('');
  const [clientVente, setClientVente] = useState('');
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
  const [communes, setcommunes] = useState([]);
  const [commune, setCommune] = useState([]);
  const [searchCommune, setSearchCommune] = useState('');

  const [UniteMesures, setUniteMesures] = useState([]);
  const [UniteMesure, setUniteMesure] = useState([]);
  const [searchUniteMesure, setSearchUniteMesure] = useState('');

  const [produit, setProduit] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [groupedProduits, setGroupedProduits] = useState({});
  const [searchProduit, setSearchProduit] = useState('');

  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // recreateCollecteTable();
    createTables(); // Créer la table lorsque le composant est monté
    // checkTableStructure();
    // deleteAllGros();
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
  //   getCommune();
  //   getUniteMesure();
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
 * Rendu du dropdown des produits
 */
  const renderProductsDropdown = () => {
    if (!selectedCategory) return null;
    const products = groupedProduits[selectedCategory] || [];

    return (
      <Dropdown
        style={styles.dropdown}
        data={products.filter((product) =>
          product.label.toLowerCase().includes(searchProduit.toLowerCase())
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
      const response = await FormGrossiste.getUniteMesure();
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
      data={UniteMesures.filter(item =>
        item.label.toLowerCase().includes(searchUniteMesure.toLowerCase())
      )}
      labelField="label"
      valueField="value"
      placeholder="Sélectionnez une unite de mésure"
      value={UniteMesure}
      onChange={item => setUniteMesure(item.value)}
      search
      searchPlaceholder="Rechercher une unité de mésure..."
      onSearch={setSearchUniteMesure}
      renderLeftIcon={() => (
        <AntDesign style={styles.icon} color="black" name="barschart" size={20} />
      )}
    />
  );

  const getCommune = async () => {
    try {
      const response = await FormGrossiste.getCommune();
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
      data={communes.filter(item =>
        item.nom.toLowerCase().includes(searchCommune.toLowerCase())
      )}
      labelField="nom"
      valueField="id"
      placeholder="Sélectionnez une commune"
      value={commune.id}
      onChange={item => setCommune(item)}
      search
      searchPlaceholder="Rechercher une commune..."
      onSearch={setSearchCommune}
      renderLeftIcon={() => (
        <AntDesign name="enviromento" size={20} color="black" style={styles.icon} />
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


  const postForm = async () => {
    const ficheData = {
      unite_stock: parseInt(UniteMesure, 10),
      poids_moyen_unite_stock: parseFloat(poidsMoyenUniteStock) || 0,
      poids_stock: parseFloat(poidsStock) || 0,
      unite_achat: uniteAchat || '',
      nombre_unite_achat: parseFloat(nombreUniteAchat) || 0,
      poids_moyen_unite_achat: parseFloat(poidsMoyenUniteAchat) || 0,
      poids_total_achat: parseFloat(poidsTotalAchat) || 0,
      localite_achat: localiteAchat || '',
      fournisseur_achat: fournisseurAchat || '',
      unite_vente: uniteVente || '',
      nombre_unite_vente: parseFloat(nombreUniteVente) || 0,
      poids_moyen_unite_vente: parseFloat(poidsMoyenUniteVente) || 0,
      poids_total_unite_vente: parseFloat(poidsTotalUniteVente) || 0,
      prix_unitaire_vente: parseFloat(prixUnitaireVente) || 0,
      client_vente: parseFloat(clientVente) || 0,
      client_principal: clientPrincipal || '',
      fournisseur_principal: fournisseurPrincipal || '',
      niveau_approvisionement: niveauApprovisionement || '',
      statut: statut || '',
      observation: observation || '',
      enquete: parseInt(enquete, 10) || 0,
      produit: produit.value,
      localite_origine: parseInt(commune.id, 10) || 0,
      num_fiche: numFiche
    };
    console.log('Données envoyées:', JSON.stringify(ficheData, null, 2));
    // Insérer les données dans la base de données
    insertgrossistes(
      ficheData.unite_stock,
      ficheData.poids_moyen_unite_stock,
      ficheData.poids_stock,
      ficheData.unite_achat,
      ficheData.nombre_unite_achat,
      ficheData.poids_moyen_unite_achat,
      ficheData.poids_total_achat,
      ficheData.localite_achat,
      ficheData.fournisseur_achat,
      ficheData.unite_vente,
      ficheData.nombre_unite_vente,
      ficheData.poids_moyen_unite_vente,
      ficheData.poids_total_unite_vente,
      ficheData.prix_unitaire_vente,
      ficheData.client_vente,
      ficheData.client_principal,
      ficheData.fournisseur_principal,
      ficheData.niveau_approvisionement,
      ficheData.statut,
      ficheData.observation,
      ficheData.enquete,
      ficheData.produit,
      ficheData.localite_origine,
      ficheData.num_fiche
    );
    console.log('donne envoyer', JSON.stringify(ficheData, null, 2));
    Alert.alert('Succès', 'Les données ont été insérées dans la base de données.');

    try {
      setLoading(true);
      // await FormGrossiste.postFormGrossiste(ficheData);
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Formulaire soumis avec succès.',
      });
      resetFields();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de soumettre le formulaire. Veuillez réessayer.',
      });
      console.error('Erreur lors de la création de la fiche:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFields = () => {
    setUniteStock(0);
    setPoidsMoyenUniteStock(0);
    setPoidsStock(0);
    setUniteAchat('');
    setNombreUniteAchat(0);
    setPoidsMoyenUniteAchat(0);
    setPoidsTotalAchat(0);
    setLocaliteAchat('');
    setFournisseurAchat('');
    setUniteVente('');
    setNombreUniteVente(0);
    setPoidsMoyenUniteVente(0);
    setPoidsTotalUniteVente(0);
    setPrixUnitaireVente(0);
    setClientVente(0);
    setClientPrincipal('');
    setFournisseurPrincipal('');
    setNiveauApprovisionement('');
    setStatut('');
    setObservation('');
    setEnquete(parseInt(id, 10) || 0);
    setProduit(null);
    setLocaliteOrigine('');
  };
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setProduit(null); // Reset selected product when category changes
  };
  const niveauApprovisionementOptions = [
    { label: 'Haut', value: 'Haut' },
    { label: 'Moyen', value: 'Moyen' },
    { label: 'Faible', value: 'Faible' },
  ];

  const statutOptions = [
    { label: 'En cours', value: 'En cours' },
    { label: 'Terminé', value: 'Terminé' },
    { label: 'Annulé', value: 'Annulé' },
  ];

  return (
    <KeyboardAwareScrollView>
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

        <Text style={styles.categoryHeader}>Localité d'origine</Text>
        {renderCommunes()}
        <Text style={styles.categoryHeader}>Unité de mesure</Text>
        {renderUniteMesure()}


        <TextInput
          label="Poids moyen par unité de stock"
          value={poidsMoyenUniteStock.toString()}
          onChangeText={setPoidsMoyenUniteStock}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          label="Poids total du stock"
          value={poidsStock.toString()}
          onChangeText={setPoidsStock}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          label="Unité d'achat"
          value={uniteAchat}
          onChangeText={setUniteAchat}
          style={styles.input}
        />
        <TextInput
          label="Nombre d'unités d'achat"
          value={nombreUniteAchat.toString()}
          onChangeText={setNombreUniteAchat}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          label="Poids moyen par unité d'achat"
          value={poidsMoyenUniteAchat.toString()}
          onChangeText={setPoidsMoyenUniteAchat}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          label="Poids total d'achat"
          value={poidsTotalAchat.toString()}
          onChangeText={setPoidsTotalAchat}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          label="Localité d'achat"
          value={localiteAchat}
          onChangeText={setLocaliteAchat}
          style={styles.input}
        />
        <TextInput
          label="Fournisseur d'achat"
          value={fournisseurAchat}
          onChangeText={setFournisseurAchat}
          style={styles.input}
        />
        <TextInput
          label="Unité de vente"
          value={uniteVente}
          onChangeText={setUniteVente}
          style={styles.input}
        />
        <TextInput
          label="Nombre d'unités de vente"
          value={nombreUniteVente.toString()}
          onChangeText={setNombreUniteVente}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          label="Poids moyen par unité de vente"
          value={poidsMoyenUniteVente.toString()}
          onChangeText={setPoidsMoyenUniteVente}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          label="Poids total des unités de vente"
          value={poidsTotalUniteVente.toString()}
          onChangeText={setPoidsTotalUniteVente}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          label="Prix unitaire de vente"
          value={prixUnitaireVente.toString()}
          onChangeText={setPrixUnitaireVente}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          label="Nombre de clients vente"
          value={clientVente.toString()}
          onChangeText={setClientVente}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          label="Client principal"
          value={clientPrincipal}
          onChangeText={setClientPrincipal}
          style={styles.input}
        />
        <TextInput
          label="Fournisseur principal"
          value={fournisseurPrincipal}
          onChangeText={setFournisseurPrincipal}
          style={styles.input}
        />
        <Dropdown
          style={styles.dropdown}
          data={niveauApprovisionementOptions}
          labelField="label"
          valueField="value"
          placeholder="Niveau d'approvisionnement"
          value={niveauApprovisionement}
          onChange={item => setNiveauApprovisionement(item.value)}
          renderLeftIcon={() => (
            <AntDesign name="barschart" size={20} color="black" style={styles.icon} />  // Icône valide pour le niveau d'approvisionnement
          )}
        />
        {/* <TextInput
          label="Niveau d'approvisionnement"
          value={niveauApprovisionement}
          onChangeText={setNiveauApprovisionement}
          style={styles.input}
        /> */}
        {/* <TextInput
          label="Statut"
          value={statut}
          onChangeText={setStatut}
          style={styles.input}
        /> */}

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
        {/* <TextInput
          label="Enquête"
          value={enquete.toString()}
          onChangeText={setEnquete}
          style={styles.input}
          keyboardType="numeric"
        /> */}

        <Button
          mode="contained"
          onPress={postForm}
          style={styles.button}
          loading={loading}
        >
          Enregistrer
        </Button>
      </View>
      <Toast />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 20,
    backgroundColor:'#009C57'

  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 5,
    borderRadius: 5,
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
  selectedItem: {
    backgroundColor: '#cce5ff',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  itemLabel: {
    fontSize: 16,
  },
  categoryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
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

export default FormGrossistes;
