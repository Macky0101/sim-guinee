import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Image, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRoute } from '@react-navigation/native';
import FormConso from '../../../services/serviceAgricultures/ficheConsommation/serviceFormulaireCons';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import {createCollecte} from '../../../database/collecteService';
import axios from 'axios';
import database from '../../../database/database';
import { Q } from '@nozbe/watermelondb';

const FormCollecte = () => {
  const route = useRoute();
  const { id, idCollecteur ,id_marche, type_marche ,ficheId} = route.params;
  const [typeMarche, setTypeMarche] = useState(type_marche || '');
  // console.log('route', route.params);
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
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(''); 
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
    setSearch('');
    setSelectedCategory(null);
  };


  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setProduit(null); // Reset selected product when category changes
  };


  const handleSaveCollect = async () => {
    if (!validateFields()) {  // Validation des champs
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }
  
    try {
      // Récupérer la valeur actuelle maximale de l'enquête
      const maxEnquete = await database.collections.get('formulaire_collecte').query(
        Q.sortBy('enquete', Q.desc), // Trier par la colonne 'enquete' de manière décroissante
        Q.take(1) // Prendre la fiche avec la valeur la plus élevée pour 'enquete'
      ).fetch();
  
      let newEnquete = 1; // Par défaut, si aucune fiche n'existe encore
      if (maxEnquete.length > 0) {
        newEnquete = maxEnquete[0].enquete + 1; // Incrémenter l'enquête
      }
  
      const ficheData = {
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
        enquete: newEnquete, // Utiliser la nouvelle valeur de 'enquete' calculée
        produit: produit?.value,
        destination_finale: commune?.id, // Récupérer l'ID de la commune sélectionnée
        ficheId: ficheId,
      };
  
      console.log('Données envoyées :', ficheData);
  
      // Enregistrement dans WatermelonDB
      await database.write(async () => {
        const newCollectes = await database.collections.get('formulaire_collecte').create((newCollecte) => {
          newCollecte.unite = ficheData.unite;
          newCollecte.poids_unitaire = ficheData.poids_unitaire;
          newCollecte.montant_achat = ficheData.montant_achat;
          newCollecte.prix_fg_kg = ficheData.prix_fg_kg;
          newCollecte.etat_route = ficheData.etat_route;
          newCollecte.quantite_collecte = ficheData.quantite_collecte;
          newCollecte.niveau_approvisionement = ficheData.niveau_approvisionement;
          newCollecte.statut = ficheData.statut;
          newCollecte.observation = ficheData.observation;
          newCollecte.etat = ficheData.etat;
          newCollecte.enquete = ficheData.enquete; // Enregistrement de la nouvelle enquête
          newCollecte.produit = ficheData.produit;
          newCollecte.destination_finale = ficheData.destination_finale;
          newCollecte.fiche_id = ficheData.ficheId;
        });
      console.log("Envoi réussi", newCollectes);

      });
  
      resetFields(); // Réinitialisation des champs après enregistrement
  
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement dans WatermelonDB :', error);
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
