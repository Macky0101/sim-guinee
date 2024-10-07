import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Modal, Alert, Text, Image, FlatList } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRoute } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import database from '../../../database/database';
import Toast from 'react-native-toast-message';
import { Q } from '@nozbe/watermelondb';

const FormulaireBetail = () => {
  const route = useRoute();
  const { ficheId, idCollecteur, id_marche, type_marche, external_id } = route.params;
  const [typeMarche, setTypeMarche] = useState(type_marche || '');
  const [prixUnitaire, setPrixUnitaire] = useState('');
  const [etatCorporel, setEtatCorporel] = useState('');
  const [nombrePresentVendeur, setNombrePresentVendeur] = useState('');
  const [provenance, setProvenance] = useState('');
  const [nombreTeteProvenance, setNombreTeteProvenance] = useState('');
  const [nombreVenduProvenance, setNombreVenduProvenance] = useState('');
  const [nombrePresentAcheteur, setNombrePresentAcheteur] = useState('');
  const [nombreTeteAchete, setNombreTeteAchete] = useState('');
  const [totalVenduDistribue, setTotalVenduDistribue] = useState('');
  const [enquete, setEnquete] = useState(external_id || 0);
  const [produit, setProduit] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  // Fonction pour récupérer et filtrer les produits
  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      // Log pour indiquer le début de la récupération
      console.log('Récupération des produits pour le type de marché:', typeMarche);

      const produits = await database.collections.get('produits').query(
        Q.where('type_marche', Q.like(`%${typeMarche}%`)) // Assurez-vous que 'type_marche' est bien le bon champ
      ).fetch();

      // Log pour vérifier les produits récupérés
      console.log('Produits récupérés:', produits);

      const productList = produits.map(prod => {
        // Log pour chaque produit
        console.log('Produit:', prod);
        return {
          label: prod.nom_produit,
          value: prod.code_produit,
          image: prod.image // URL de l'image
        };
      });

      setFilteredProducts(productList);
      // Log pour vérifier le produit final
      console.log('Liste des produits filtrés:', productList);
    } catch (err) {
      console.error('Erreur lors du filtrage des produits :', err);
    } finally {
      setLoading(false);
    }
  };

  // Rendu des produits avec images
  const renderProductItem = (item) => {
    return (
      <View style={styles.dropdownItem}>
        <Image source={{ uri: item.image }} style={styles.dropdownImage} />
        <Text style={styles.dropdownLabel}>{item.label}</Text>
      </View>
    );
  };


  useEffect(() => {
    fetchFilteredProducts();
  }, [typeMarche]);

  const resetFields = () => {
    setPrixUnitaire('');
    setEtatCorporel('');
    setNombrePresentVendeur('');
    setProvenance('');
    setNombreTeteProvenance('');
    setNombreVenduProvenance('');
    setNombrePresentAcheteur('');
    setNombreTeteAchete('');
    setTotalVenduDistribue('');
    setProduit('');
  };

  const validateFields = () => {
    return prixUnitaire && etatCorporel && nombrePresentVendeur && provenance && nombreTeteProvenance && nombreVenduProvenance && nombrePresentAcheteur && nombreTeteAchete && totalVenduDistribue && produit;
  };

  const handleSaveCollect = async () => {
    if (!validateFields()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setLoading(true);

    try {
      const ficheData = {
        enquete,
        prix_unitaire: parseFloat(prixUnitaire),
        etat_corporel: etatCorporel,
        nombre_present_chez_vendeur: parseInt(nombrePresentVendeur),
        provenance,
        nombre_tete_par_provenance: parseInt(nombreTeteProvenance),
        nombre_vendu_par_provenance: parseInt(nombreVenduProvenance),
        nombre_present_chez_acheteur: parseInt(nombrePresentAcheteur),
        nombre_tete_achete: parseInt(nombreTeteAchete),
        total_vendu_distribues: parseInt(totalVenduDistribue),
        produit: produit,
        fiche_id: ficheId,
      };

      console.log('Données envoyées :', ficheData);

      // Sauvegarder dans WatermelonDB
      await database.write(async () => {
        await database.collections.get('formulaire_betail').create((fiche) => {
          fiche.enquete = ficheData.enquete;
          fiche.prix_unitaire = ficheData.prix_unitaire;
          fiche.etat_corporel = ficheData.etat_corporel;
          fiche.nombre_present_chez_vendeur = ficheData.nombre_present_chez_vendeur;
          fiche.provenance = ficheData.provenance;
          fiche.nombre_tete_par_provenance = ficheData.nombre_tete_par_provenance;
          fiche.nombre_vendu_par_provenance = ficheData.nombre_vendu_par_provenance;
          fiche.nombre_present_chez_acheteur = ficheData.nombre_present_chez_acheteur;
          fiche.nombre_tete_achete = ficheData.nombre_tete_achete;
          fiche.total_vendu_distribues = ficheData.total_vendu_distribues;
          fiche.produit = ficheData.produit;
          fiche.fiche_id = ficheData.fiche_id;
        });
        console.log('donnees recues',ficheData);
      });

      resetFields();
      Toast.show({
        type: 'success',
        text1: 'Fiche sauvegardée avec succès',
      });

    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la fiche:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sauvegarde.');
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <Modal transparent={true} animationType="none" visible={loading}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.inner}>
        <Dropdown
          style={styles.dropdown}
          data={filteredProducts}
          labelField="label"
          valueField="value"
          placeholder="Sélectionnez un produit"
          value={produit}
          onChange={item => setProduit(item.value)}
          renderItem={renderProductItem}  // Utilisation d'une fonction de rendu personnalisée
        />

        {/* Add inputs for each new field */}
        <TextInput
          label="Prix Unitaire"
          value={prixUnitaire}
          onChangeText={setPrixUnitaire}
          style={styles.input}
          keyboardType="numeric"
        />

        <TextInput
          label="État Corporel"
          value={etatCorporel}
          onChangeText={setEtatCorporel}
          style={styles.input}
        />

        <TextInput
          label="Nombre Présent chez Vendeur"
          value={nombrePresentVendeur}
          onChangeText={setNombrePresentVendeur}
          style={styles.input}
          keyboardType="numeric"
        />

        <TextInput
          label="Provenance"
          value={provenance}
          onChangeText={setProvenance}
          style={styles.input}
        />

        <TextInput
          label="Nombre de Têtes par Provenance"
          value={nombreTeteProvenance}
          onChangeText={setNombreTeteProvenance}
          style={styles.input}
          keyboardType="numeric"
        />

        <TextInput
          label="Nombre Vendu par Provenance"
          value={nombreVenduProvenance}
          onChangeText={setNombreVenduProvenance}
          style={styles.input}
          keyboardType="numeric"
        />

        <TextInput
          label="Nombre Présent chez Acheteur"
          value={nombrePresentAcheteur}
          onChangeText={setNombrePresentAcheteur}
          style={styles.input}
          keyboardType="numeric"
        />

        <TextInput
          label="Nombre de Têtes Achetées"
          value={nombreTeteAchete}
          onChangeText={setNombreTeteAchete}
          style={styles.input}
          keyboardType="numeric"
        />

        <TextInput
          label="Total Vendu et Distribué"
          value={totalVenduDistribue}
          onChangeText={setTotalVenduDistribue}
          style={styles.input}
          keyboardType="numeric"
        />

        {/* <TextInput
        label="Produit"
        value={produit}
        onChangeText={setProduit}
        style={styles.input}
      /> */}

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
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dropdownImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  dropdownLabel: {
    fontSize: 16,
    color: '#000',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#009C57',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  activityIndicatorWrapper: {
    height: 100,
    width: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FormulaireBetail