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
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import GrossistesService from '../../../database/GrossistesService';
import database from '../../../database/database';
import { Q } from '@nozbe/watermelondb';
import axios from 'axios';


const FormGrossistes = () => {
  const route = useRoute();
  const { id, idCollecteur, id_marche, type_marche, ficheId, num_fiche, external_id } = route.params;
  const [typeMarche, setTypeMarche] = useState(type_marche || '');
  const [numFiche, setNumFiche] = useState(num_fiche || ''); // Stocker num_fiche
  const [unite_stock, setUniteStock] = useState(0);
  const [poids_moyen_unite_stock, setPoidsMoyenUniteStock] = useState('');
  const [stock_anterieur, setstock_anterieur] = useState('');
  const [poids_stock, setPoidsStock] = useState('');
  const [stock_du_jour, setstock_du_jour] = useState('');
  const [quantite_entree, setquantite_entree] = useState('');
  const [fournisseur_principaux, setFournisseurP] = useState('');
  const [nombre_unite_achat, setnombreuniteachat] = useState('');
  const [unite_achat, setuniteachat] = useState('');
  const [unite_vente, setunitevente] = useState('');
  const [prix_achat, setprixachat] = useState('');
  const [prix_unitaire_vente, setPrixUnitaireVente] = useState('');
  const [localite_achat, setlocalite_achat] = useState('');
  const [client_vente, setClientVente] = useState('');
  const [autre_client_principal, setautreclientprincipal] = useState('');
  // const [clientPrincipal, setClientPrincipal] = useState('');
  // const [fournisseurPrincipal, setFournisseurPrincipal] = useState('');
  // const [niveauApprovisionement, setNiveauApprovisionement] = useState('');
  const [statut, setStatut] = useState('');
  const [observation, setObservation] = useState('');
  const [enquete, setEnquete] = useState(parseInt(id, 10) || 0);
  const [localiteOrigine, setLocaliteOrigine] = useState('');
  const [loading, setLoading] = useState(false);
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
        placeholder="Sélectionnez un produit *"
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


  

  useEffect(() => {
    if (typeMarche) {
      // console.log('Type de marché:', typeMarche);
      getUniteMesure(); 
      getUniteAchat();
      getUniteVente();
    }
  }, [typeMarche]);

  const getUniteMesure = async () => {
    try {
      const uniteRelationCollection = database.collections.get('unite_relations');

      // Exécuter une requête pour récupérer toutes les unités
      const unites = await uniteRelationCollection.query().fetch();
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
      placeholder="Sélectionnez une unité de mesure *"
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

// pour unite acheter
const [UniteAchats, setUniteAchats] = useState([]);
const [UniteAchat, setUniteAchat] = useState(null);
const [searchUniteAchat, setSearchUniteAchat] = useState('');
const getUniteAchat = async () => {
  try {
    const uniteAchatCollection = database.collections.get('unite_relations');

    // Exécuter une requête pour récupérer toutes les unités
    const unites = await uniteAchatCollection.query().fetch();
    const UniteAchats = unites.map((unite) => ({
      label: unite.nom_unite, // Assurez-vous que 'unite_achats.nom_unite' existe dans la structure
      value: unite.id_unite, // Assurez-vous que 'id' est correct
    }));

    setUniteAchats(UniteAchats); // Mettre à jour l'état avec les unités récupérées
    await storeData('uniteAchats', UniteAchats); // Enregistrer les unités localement
  } catch (error) {
    console.error('Erreur lors de la récupération des unités d\'achat:', error.message || error);
  }
};

const renderUniteAchat = () => (
  <Dropdown
    style={styles.dropdown}
    data={UniteAchats.filter(item => item.label?.toLowerCase().includes(searchUniteAchat.toLowerCase()))}
    labelField="label"
    valueField="value"
    placeholder="Sélectionnez une unité d'achat"
    value={UniteAchat}
    onChange={item => setUniteAchat(item.value)}
    search
    searchPlaceholder="Rechercher une unité d'achat..."
    onSearch={setSearchUniteAchat}
    renderLeftIcon={() => (
      <AntDesign style={styles.icon} color="black" name="barschart" size={20} />
    )}
  />
);

// pour unite de mesure
const [UniteVentes, setUniteVentes] = useState([]);
const [UniteVente, setUniteVente] = useState(null);
const [searchUniteVente, setSearchUniteVente] = useState('');
const getUniteVente = async () => {
  try {
    const uniteVenteCollection = database.collections.get('unite_relations');

    // Exécuter une requête pour récupérer toutes les unités
    const unites = await uniteVenteCollection.query().fetch();
    const UniteVentes = unites.map((unite) => ({
      label: unite.nom_unite, // Assurez-vous que 'unite_ventes.nom_unite' existe dans la structure
      value: unite.id_unite, // Assurez-vous que 'id' est correct
    }));

    setUniteVentes(UniteVentes); // Mettre à jour l'état avec les unités récupérées
    await storeData('uniteVentes', UniteVentes); // Enregistrer les unités localement
  } catch (error) {
    console.error('Erreur lors de la récupération des unités de vente:', error.message || error);
  }
};

const renderUniteVente = () => (
  <Dropdown
    style={styles.dropdown}
    data={UniteVentes.filter(item => item.label?.toLowerCase().includes(searchUniteVente.toLowerCase()))}
    labelField="label"
    valueField="value"
    placeholder="Sélectionnez une unité de vente"
    value={UniteVente}
    onChange={item => setUniteVente(item.value)}
    search
    searchPlaceholder="Rechercher une unité de vente..."
    onSearch={setSearchUniteVente}
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
      placeholder="Provenance du produit *"
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
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Sauvegarde des données échouée.',
     });
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
  const validateFields = () => {
    if (!UniteMesure || !produit || !prix_achat) {
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
  const postForm = async () => {
    if (!validateFields()) {
      return;
    }
    setLoading(true);
    const ficheData = {
      unite_stock: UniteMesure,
      stock_anterieur,
      poids_moyen_unite_stock,
      poids_stock,
      stock_du_jour,
      quantite_entree,
      fournisseur_principaux,
      nombre_unite_achat,
      unite_achat: UniteAchat,
      unite_vente: UniteVente,
      prix_achat,
      prix_unitaire_vente,
      localite_achat:commune?.id,
      client_vente,
      autre_client_principal,
      statut,
      observation,
      enquete : external_id,
      produit: produit?.value,
      fiche_id: ficheId,
    };
    resetFields();
    try {
      await GrossistesService.createGrossiste(ficheData);
      console.log("Envoi réussi", ficheData);
    } catch (error) {
      console.error("Erreur lors de la création de la fiche:", error);
    }
    
    setLoading(false);

  };
  const resetFields = () => {
    setUniteStock(0);
    setPoidsMoyenUniteStock(0);
    setstock_anterieur(0);
    setPoidsStock(0);
    setstock_du_jour('');
    setquantite_entree('');
    setFournisseurP(0);
    setnombreuniteachat(0);
    setuniteachat('');
    setunitevente('');
    setprixachat('');
    setPrixUnitaireVente(0);
    setlocalite_achat(0);
    setClientVente(0);
    setautreclientprincipal(0);
    setStatut('');
    setObservation('');
    setEnquete(parseInt(id, 10) || 0);
    setProduit(null);
    setLocaliteOrigine('');
  };
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setProduit(null); // Reset selected product when category changes
    setSearchProduit(''); // Réinitialiser la recherche produit
  };
  // const niveauApprovisionementOptions = [
  //   { label: 'Abondant', value: 'Abondant' },
  //   { label: 'Normal', value: 'Normal' },
  //   { label: 'Rare', value: 'Rare' },
  // ];
  const ClientPrincipaledata = [
    { label: 'Grossistes', value: 'Grossistes' },
    { label: 'Sémi-Grossistes', value: 'Sémi-Grossistes' },
    { label: 'Detaillant', value: 'Detaillant' },
    { label: 'Autre', value: 'Autre' },
  ];
  const FournisseursPrincipaledata = [
    { label: 'Grossiste', value: 'Grossiste' },
    { label: 'Collecteur', value: 'Collecteur' },
    { label: 'Importateur', value: 'Importateur' },
    { label: 'Producteur', value: 'Producteur' },
  ];

  const statutOptions = [
    { label: 'Validé', value: 'Validé' },
    { label: 'Nom validé', value: 'Nom_Validé' },
  ];
  if (loading) {
    return (
       <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
       </View>
    );
 }
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
          placeholder="Sélectionnez une catégorie *"
          value={selectedCategory}
          onChange={(item) => handleCategoryChange(item.value)}
          onChangeText={(text) => setSearchProduit(text)}
          renderLeftIcon={() => (
            <AntDesign name="appstore-o" size={20} color="black" style={styles.icon} />
          )}
        />

        {renderProductsDropdown()}

        {/* <Text style={styles.categoryHeader}>Localité d'origine</Text> */}
        {renderCommunes()}
        {/* <Text style={styles.categoryHeader}>Unité de mesure</Text> */}
        {renderUniteMesure()}
        <TextInput
          label="Stock anterieur "
          value={stock_anterieur.toString()}
          onChangeText={setstock_anterieur}
          style={styles.input}
          keyboardType="numeric"
        />

        <TextInput
          label="Poids moyen d'unite de stock "
          value={poids_moyen_unite_stock.toString()}
          onChangeText={setPoidsMoyenUniteStock}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          label="Poids du stock"
          value={poids_stock.toString()}
          onChangeText={setPoidsStock}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          label="Stock du jour"
          value={stock_du_jour}
          onChangeText={setstock_du_jour}
          style={styles.input}
        />
        <TextInput
          label="Quantite entrée"
          value={quantite_entree.toString()}
          onChangeText={setquantite_entree}
          style={styles.input}
          keyboardType="numeric"
        />
            <Dropdown
          style={styles.dropdown}
          data={FournisseursPrincipaledata}
          labelField="label"
          valueField="value"
          placeholder="Fournisseur principal"
          value={fournisseur_principaux}
          onChange={item => setFournisseurP(item.value)}
          renderLeftIcon={() => (
            <AntDesign name="user" size={20} color="black" style={styles.icon} />  // Icône valide pour le niveau d'approvisionnement
          )}
        />
     
        <TextInput
          label="Nombre unite achate"
          value={nombre_unite_achat.toString()}
          onChangeText={setnombreuniteachat}
          style={styles.input}
          keyboardType="numeric"
        />
       {renderUniteAchat()}

       {renderUniteVente()}
        <TextInput
          label="Prix d'achat"
          value={prix_achat}
          onChangeText={setprixachat}
          style={styles.input}
        />
        <TextInput
          label="Prix unitaire vente"
          value={prix_unitaire_vente.toString()}
          onChangeText={setPrixUnitaireVente}
          style={styles.input}
          keyboardType="numeric"
        />
  
         <Dropdown
          style={styles.dropdown}
          data={ClientPrincipaledata}
          labelField="label"
          valueField="value"
          placeholder="Client principal"
          value={client_vente}
          onChange={item => setClientVente(item.value)}
          renderLeftIcon={() => (
            <AntDesign name="user" size={20} color="black" style={styles.icon} />  // Icône valide pour le niveau d'approvisionnement
          )}
        />
        <TextInput
          label="Autre client principal"
          value={autre_client_principal.toString()}
          onChangeText={setautreclientprincipal}
          style={styles.input}
          keyboardType="numeric"
        />
      
        {/* <Dropdown
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
     
          {loading ?(
              <ActivityIndicator size="small" color="#FFFFFF" />
          ):(
            <Button
          mode="contained"
          onPress={postForm}
          style={styles.button}
          loading={loading}
        >
          Enregistrer
        </Button>
          )}
        
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
