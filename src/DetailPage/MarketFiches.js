import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { Q } from '@nozbe/watermelondb';
import database from '../../database/database';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Searchbar, IconButton } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SIMGUINEE_URL = 'https://sim-guinee.org/api/';

const MarketFiches = ({ route }) => {
  const navigation = useNavigation();
  const { idCollecteur, id_marche, type_marche, nom_marche, nom_marche1 } = route.params;
  console.log('les parametres de navigation', route.params);

  useEffect(() => {
    if (nom_marche && nom_marche1) {
      navigation.setOptions({ title: `${nom_marche} : ${nom_marche1}` });
    } else {
      console.log('nom_type_marche est indéfini');
    }
  }, [navigation, nom_marche, nom_marche1]);

  console.log('les parametres de navigation', route.params);

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFiches, setFilteredFiches] = useState([]);
  const [fichesData, setFichesData] = useState([]);


  // Fonction pour récupérer les données depuis WatermelonDB
  const fetchData = async () => {
    try {
      if (!id_marche) {
        console.error('ID du marché est undefined ou null');
        return;
      }

      const ficheCollection = database.collections.get('fiches');
      const fichesMarcheID = await ficheCollection.query(Q.where('marche', id_marche)).fetch();
      console.log(ficheCollection)

      if (fichesMarcheID.length > 0) {
        // Filtrer les fiches dont la source est 'local'
        const fichesLocales = fichesMarcheID.filter(fiche => fiche.source === 'local');
        console.log('Fiches locales filtrées:', fichesLocales);

        setData(fichesLocales);
        setFilteredFiches(fichesLocales); // Mettre à jour avec les fiches locales uniquement
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

  const syncSpecificFiche = async (ficheId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('Aucun jeton trouvé');
      }

      const ficheCollection = database.collections.get('fiches');
      const fiche = await ficheCollection.find(ficheId); // Récupérer la fiche par ID
      const ficheData = fiche._raw; // Obtenez les données brutes de la fiche
      console.log('donne du fiche', ficheData)
      console.log('ID du type de marché:', ficheData.id_type_marche);

      let url;
      let dataToSend = {};
      // console.log('dataToSend', dataToSend + ' url associer ' + url);

      switch (ficheData.id_type_marche) {
        case 1: // collecte
          url = `${SIMGUINEE_URL}enquetes/Fiches/collectes`;
          dataToSend = {
            num_fiche: ficheData.num_fiche,
            date_enquete: ficheData.date_enquete,
            marche: ficheData.marche,
            collecteur: ficheData.collecteur,
          };
          break;
        case 2: // grossites
          url = `${SIMGUINEE_URL}enquetes/Fiches/grossistes`;
          dataToSend = {
            num_fiche: ficheData.num_fiche,
            date_enquete: ficheData.date_enquete,
            marche: ficheData.marche,
            collecteur: ficheData.collecteur,
            numero_point_collecte: ficheData.numero_point_collecte,
            nom_personne_enquete: ficheData.nom_personne_enquete,
            contact_personne_enquete: ficheData.contact_personne_enquete,
          };
          break;
        case 3: // consommation ou hebdomaderer
          url = `${SIMGUINEE_URL}enquetes/Fiches/consommations`;
          dataToSend = {
            num_fiche: ficheData.num_fiche,
            date_enquete: ficheData.date_enquete,
            marche: ficheData.marche,
            collecteur: ficheData.collecteur,
          };
          break;
        case 4: // journalier
          url = `${SIMGUINEE_URL}enquetes/Fiches/collectes`;
          dataToSend = {
            num_fiche: ficheData.num_fiche,
            date_enquete: ficheData.date_enquete,
            marche: ficheData.marche,
            collecteur: ficheData.collecteur,
          };
          break;
        case 5: // betails
          url = `${SIMGUINEE_URL}enquetes/Fiches/betails`;
          dataToSend = {
            num_fiche: ficheData.num_fiche,
            date_enquete: ficheData.date_enquete,
            marche: ficheData.marche,
            collecteur: ficheData.collecteur,
            stock_initial_bovins: ficheData.stock_initial_bovins,
            nbr_bovins_debarques: ficheData.nbr_bovins_debarques,
            stock_soir_bovins: ficheData.stock_soir_bovins,
            nombre_bovin_vendu_calcule: ficheData.nombre_bovin_vendu_calcule,
            nombre_bovin_present_marche: ficheData.nombre_bovin_present_marche,
            nombre_tete_bovins_vendu: ficheData.nombre_tete_bovins_vendu,
            taureaux_4_8_ans_vendus: ficheData.taureaux_4_8_ans_vendus,
            taurillons_2_3_ans_vendus: ficheData.taurillons_2_3_ans_vendus,
            vaches_4_10_ans_vendus: ficheData.vaches_4_10_ans_vendus,
            genisses_2_3_ans_vendus: ficheData.genisses_2_3_ans_vendus,
            veaux_velles_0_12_mois: ficheData.veaux_velles_0_12_mois,
            destination_bovins_vendus: ficheData.destination_bovins_vendus,
            origine_bovins_debarques: ficheData.origine_bovins_debarques,
            stock_initial_ovins: ficheData.stock_initial_ovins,
            nombre_ovins_debarques: ficheData.nombre_ovins_debarques,
            stock_soir_ovins: ficheData.stock_soir_ovins,
            nombre_ovins_presentes_marche: ficheData.nombre_ovins_presentes_marche,
            nombre_ovins_vendus: ficheData.nombre_ovins_vendus,
            ovins_males_femelles_0_12_vendus: ficheData.ovins_males_femelles_0_12_vendus,
            ovins_males_femelles_plus_1_vendus: ficheData.ovins_males_femelles_plus_1_vendus,
            destination_ovins_vendus: ficheData.destination_ovins_vendus,
            origine_ovins_debarques: ficheData.origine_ovins_debarques,
            stock_initial_caprins: ficheData.stock_initial_caprins,
            nombre_caprins_debarques: ficheData.nombre_caprins_debarques,
            stock_soir_caprins: ficheData.stock_soir_caprins,
            nombre_caprins_presentes_marche: ficheData.nombre_caprins_presentes_marche,
            nombre_caprins_vendus: ficheData.nombre_caprins_vendus,
            caprins_males_femelles_0_12_ans: ficheData.caprins_males_femelles_0_12_ans,
            caprins_males_femelles_plus_1_ans: ficheData.caprins_males_femelles_plus_1_ans,
            destination_caprins_vendus: ficheData.destination_caprins_vendus,
            origine_caprins_debarques: ficheData.origine_caprins_debarques,
          };
          break;
        case 6: // debarcaderer ou port
          url = `${SIMGUINEE_URL}enquetes/Fiches/debarcadere-ports`;
          dataToSend = {
            num_fiche: ficheData.num_fiche,
            date_enquete: ficheData.date_enquete,
            marche: ficheData.marche,
            collecteur: ficheData.collecteur,
            type_embarcation: ficheData.type_embarcation,
            espece_presente: ficheData.espece_presente,
            difficultes_rencontrees: ficheData.difficultes_rencontrees,
            nbr_barques_rentres_jour: ficheData.nbr_barques_rentres_jour,
            heure_fin_collecte_semaine: ficheData.heure_fin_collecte_semaine,
          };
          break;
        case 7: // debarcaderer ou port
          url = `${SIMGUINEE_URL}enquetes/Fiches/debarcadere-ports`;
          dataToSend = {
            num_fiche: ficheData.num_fiche,
            date_enquete: ficheData.date_enquete,
            marche: ficheData.marche,
            collecteur: ficheData.collecteur,
            type_embarcation: ficheData.type_embarcation,
            espece_presente: ficheData.espece_presente,
            difficultes_rencontrees: ficheData.difficultes_rencontrees,
            nbr_barques_rentres_jour: ficheData.nbr_barques_rentres_jour,
            heure_fin_collecte_semaine: ficheData.heure_fin_collecte_semaine,
          };
          break;
        case 8: // tranfrontalier
          url = `${SIMGUINEE_URL}enquetes/Fiches/collectes`;
          dataToSend = {
            num_fiche: ficheData.num_fiche,
            date_enquete: ficheData.date_enquete,
            marche: ficheData.marche,
            collecteur: ficheData.collecteur,
          };
          break;
        // Ajoutez d'autres cas selon le type de marché...
        default:
          throw new Error('Type de marché inconnu');
      }

      // const response = await axios.post(url, dataToSend, {
      //   headers: {
      //     Authorization: `Bearer ${token}`, // Ajoutez le jeton si nécessaire
      //   },
      // });

      await axios.post(url, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`, // Ajoutez le jeton si nécessaire
        },
      })
        .then(function (response) {
          // console.log('response macky', response.data);

          onSearchFiche(response.data.num_fiche, ficheId, ficheData.id_type_marche)
        })
        .catch(function (error) {
          console.log(error);
        });


      // Mettez à jour la fiche si la synchronisation est réussie
      // console.log('Réponse de l\'API:', response.data);
      // console.log('dataToSend', dataToSend + ' url associer ' + url);

      Toast.show({
        text1: 'Synchronisation réussie',
        text2: 'La fiche a été synchronisée avec succès.',
        position: 'bottom'
      });
    } catch (error) {
      console.error('Erreur de synchronisation:', error);
      Toast.show({
        text1: 'Erreur de synchronisation',
        text2: 'Échec de la synchronisation de la fiche.',
        position: 'bottom'
      });
    }
  };


  const onSearchFiche = async (num_fiche, id_fiche, type_marche) => {
    if (!type_marche) {
      console.error('Type de marché est indéfini ou incorrect.');
      return;
    }

    const token = await AsyncStorage.getItem('userToken');
    let url;

    switch (type_marche) {
      case 1: // Collecte
        url = 'https://sim-guinee.org/api/enquetes/Fiches?type=COLLECTE';
        break;
      case 2: // Grossistes
        url = 'https://sim-guinee.org/api/enquetes/Fiches?type=GROSSISTE';
        break;
      case 3: // Consommation ou hebdomadrer
        url = 'https://sim-guinee.org/api/enquetes/Fiches?type=HEBDOMADAIRE';
        break;
      case 4: // Journalier
        url = 'https://sim-guinee.org/api/enquetes/Fiches?type=JOURNALIER';
        break;
      case 5: // Betail
        url = 'https://sim-guinee.org/api/enquetes/Fiches?type=BETAIL';
        break;
      case 6: // debarcaderer 
        url = 'https://sim-guinee.org/api/enquetes/Fiches?type=DEBARCADERE';
        break;
      case 7: // port
        url = 'https://sim-guinee.org/api/enquetes/Fiches?type=PORT';
        break;
      case 8: // tranfrontalier
        url = 'https://sim-guinee.org/api/enquetes/Fiches?type=TRANSFRONTALIER';
        break;
      default:
        console.error('Type de marché inconnu pour la recherche');
        return;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allFiches = response.data;
      const matchingFiche = allFiches.find(fiche =>
        fiche.num_fiche.startsWith(num_fiche)
      );

      if (matchingFiche) {
        fetchFichesData(id_fiche, matchingFiche.id, type_marche);  // Passer également le type de marché
      } else {
        console.log('Fiche non trouvée');
      }
    } catch (error) {
      console.error('Erreur lors de la recherche de la fiche', error);
    }
  };


  const fetchFichesData = async (ficheId_local, ficheId_online, type_marche) => {
    try {
      let fetchedFiches;

      switch (type_marche) {
        case 1: // Collecte
          fetchedFiches = await database.collections.get('formulaire_collecte').query(
            Q.where('fiche_id', Q.like(`%${ficheId_local}`))
          ).fetch();
          break;
        case 2: // grossites
          fetchedFiches = await database.collections.get('formulaire_grossiste').query(
            Q.where('fiche_id', Q.like(`%${ficheId_local}`))
          ).fetch();
          break;
        case 3: // Consommation ou hebedomadere
          fetchedFiches = await database.collections.get('formulaire_consommation').query(
            Q.where('fiche_id', Q.like(`%${ficheId_local}`))
          ).fetch();
          break;
        case 4: // formulaire_journalier
          fetchedFiches = await database.collections.get('formulaire_journalier').query(
            Q.where('fiche_id', Q.like(`%${ficheId_local}`))
          ).fetch();
          break;
        case 5: // formulaire_betail
          fetchedFiches = await database.collections.get('formulaire_betail').query(
            Q.where('fiche_id', Q.like(`%${ficheId_local}`))
          ).fetch();
          break;
        case 6: // formulaire_port
          fetchedFiches = await database.collections.get('formulaire_port').query(
            Q.where('fiche_id', Q.like(`%${ficheId_local}`))
          ).fetch();
          break;
        case 7: // formulaire_debarcaderes
          fetchedFiches = await database.collections.get('formulaire_debarcaderes').query(
            Q.where('fiche_id', Q.like(`%${ficheId_local}`))
          ).fetch();
          break;
        case 8: // formulaire_tranfrontalier
          fetchedFiches = await database.collections.get('formulaire_tranfrontalier').query(
            Q.where('fiche_id', Q.like(`%${ficheId_local}`))
          ).fetch();
          break;
        // Ajoutez d'autres cas ici pour d'autres types de marché...
      }

      onSendDataOnline(fetchedFiches, ficheId_online, type_marche)
    } catch (error) {
      console.error('Erreur lors de la récupération des fiches:', error);
    }
  };

  const onSendDataOnline = async (data, idFiche, type_marche) => {
    const token = await AsyncStorage.getItem('userToken');

    if (!token) {
      throw new Error('Aucun jeton trouvé');
    }

    data.forEach(fiche => {
      let dataToSend = {};
      let url = '';

      switch (type_marche) {
        case 1: // Collecte
          url = `${SIMGUINEE_URL}enquetes/marches-prix/collectes`;
          dataToSend = {
            unite: parseFloat(fiche._raw.unite),
            poids_unitaire: parseFloat(fiche._raw.poids_unitaire),
            montant_achat: parseFloat(fiche._raw.montant_achat),
            prix_fg_kg: parseFloat(fiche._raw.prix_fg_kg),
            etat_route: fiche._raw.etat_route,
            quantite_collecte: parseFloat(fiche._raw.quantite_collecte),
            niveau_approvisionement: fiche._raw.niveau_approvisionement,
            statut: fiche._raw.statut,
            observation: fiche._raw.observation,
            etat: fiche._raw.etat,
            destination_finale: parseFloat(fiche._raw.destination_finale),
            enquete: idFiche,
            produit: fiche._raw.produit,
          };
          break;
        case 2:  // Grossite
          url = `${SIMGUINEE_URL}enquetes/marches-prix/grossistes`;
          dataToSend = {
            unite_stock: parseFloat(fiche._raw.unite_stock),
            stock_anterieur: parseFloat(fiche._raw.stock_anterieur),
            poids_moyen_unite_stock: parseFloat(fiche._raw.poids_moyen_unite_stock),
            poids_stock: parseFloat(fiche._raw.poids_stock),
            stock_du_jour: parseFloat(fiche._raw.stock_du_jour),
            quantite_entree: parseFloat(fiche._raw.quantite_entree),
            fournisseur_principaux: parseFloat(fiche._raw.fournisseur_principaux),
            nombre_unite_achat: parseFloat(fiche._raw.nombre_unite_achat),
            unite_achat: parseFloat(fiche._raw.unite_achat),
            unite_vente: parseFloat(fiche._raw.unite_vente),
            prix_achat: parseFloat(fiche._raw.prix_achat),
            prix_unitaire_vente: parseFloat(fiche._raw.prix_unitaire_vente),
            localite_achat: parseFloat(fiche._raw.localite_achat),
            client_vente: parseFloat(fiche._raw.client_vente),
            autre_client_principal: parseFloat(fiche._raw.autre_client_principal),
            statut: fiche._raw.statut,
            observation: fiche._raw.observation,
            enquete: idFiche,
            produit: fiche._raw.produit,
          };
          break;
        case 3: // Consommation
          url = `${SIMGUINEE_URL}enquetes/marches-prix/consommations`;
          dataToSend = {
            unite: fiche._raw.unite,
            poids_unitaire: String(fiche._raw.poids_unitaire), // Convertir en chaîne de caractères
            prix_mesure: parseFloat(fiche._raw.prix_mesure),
            prix_kg_litre: parseFloat(fiche._raw.prix_kg_litre),
            niveau_approvisionement: fiche._raw.niveau_approvisionement,
            statut: fiche._raw.statut,
            observation: fiche._raw.observation,
            enquete: idFiche,
            produit: fiche._raw.produit,
          };
          break;
        case 4: // Journalier
          url = `${SIMGUINEE_URL}enquetes/marches-prix/journaliers`;
          dataToSend = {
            unite: fiche._raw.unite,
            poids_unitaire: String(fiche._raw.poids_unitaire), // Convertir en chaîne de caractères
            prix_mesure: parseFloat(fiche._raw.prix_mesure),
            prix_kg_litre: parseFloat(fiche._raw.prix_kg_litre),
            niveau_approvisionement: fiche._raw.niveau_approvisionement,
            statut: fiche._raw.statut,
            observation: fiche._raw.observation,
            enquete: idFiche,
            produit: fiche._raw.produit,
          };
          break;
        case 5: // betail
          url = `${SIMGUINEE_URL}enquetes/marches-prix/betails`;
          dataToSend = {
            prix_unitaire: parseFloat(fiche._raw.prix_unitaire),
            etat_corporel: fiche._raw.etat_corporel,
            nombre_present_chez_vendeur: parseFloat(fiche._raw.nombre_present_chez_vendeur),
            provenance: fiche._raw.provenance,
            nombre_tete_par_provenance: parseFloat(fiche._raw.nombre_tete_par_provenance),
            nombre_vendu_par_provenance: parseFloat(fiche._raw.nombre_vendu_par_provenance),
            nombre_present_chez_acheteur: parseFloat(fiche._raw.nombre_present_chez_acheteur),
            nombre_tete_achete: parseFloat(fiche._raw.nombre_tete_achete),
            total_vendu_distribues: parseFloat(fiche._raw.total_vendu_distribues),
            enquete: idFiche,
            produit: fiche._raw.produit,
          };
          break;
        case 6: // debarcadere
          url = `${SIMGUINEE_URL}enquetes/marches-prix/debarcaderes-ports`;
          dataToSend = {
            date_enquete: fiche._raw.date_enquete,
            collecteur: parseFloat(fiche._raw.collecteur),
            volume_poissons_peches: parseFloat(fiche._raw.volume_poissons_peches),
            prix_moyen_semaine_grossiste: parseFloat(fiche._raw.prix_moyen_semaine_grossiste),
            prix_moyen_semaine_detaillant: parseFloat(fiche._raw.prix_moyen_semaine_detaillant),
            niveau_disponibilite: fiche._raw.niveau_disponibilite,
            observation: fiche._raw.observation,
            enquete: idFiche,
            principale_espece_peche: fiche._raw.principale_espece_peche,
          };
          break;
        case 7: // port
          url = `${SIMGUINEE_URL}enquetes/marches-prix/debarcaderes-ports`;
          dataToSend = {
            date_enquete: fiche._raw.date_enquete,
            collecteur: parseFloat(fiche._raw.collecteur),
            volume_poissons_peches: parseFloat(fiche._raw.volume_poissons_peches),
            prix_moyen_semaine_grossiste: parseFloat(fiche._raw.prix_moyen_semaine_grossiste),
            prix_moyen_semaine_detaillant: parseFloat(fiche._raw.prix_moyen_semaine_detaillant),
            niveau_disponibilite: fiche._raw.niveau_disponibilite,
            observation: fiche._raw.observation,
            enquete: idFiche,
            principale_espece_peche: fiche._raw.principale_espece_peche,
          };
          break;
        case 8: // port
          url = `${SIMGUINEE_URL}enquetes/marches-prix/transfrontaliers`;
          dataToSend = {
            unite: parseFloat(fiche._raw.unite),
            date_enquete: fiche._raw.date_enquete,
            prix_vente: parseFloat(fiche._raw.prix_vente),
            prix_achat: parseFloat(fiche._raw.prix_achat),
            collecteur: parseFloat(fiche._raw.collecteur),
            quantite_sortant: parseFloat(fiche._raw.quantite_sortant),
            region_provenance: parseFloat(fiche._raw.region_provenance),
            region_destination: parseFloat(fiche._raw.region_destination),
            quantite_entrant: parseFloat(fiche._raw.quantite_entrant),
            pays_destination: fiche._raw.pays_destination,
            pays_origine: fiche._raw.pays_origine,
            observation: fiche._raw.observation,
            produit: fiche._raw.produit,
            enquete: idFiche,
          };
          break;
      }

      axios.post(url, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => console.log('Données envoyées', response))
        .catch(error => console.error('Erreur lors de l\'envoi des données', error));
    });
  };

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
        position: 'bottom'
      });

      fetchData();
    } catch (error) {
      console.error('Erreur lors de la suppression du Collecte:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de supprimer le Collecte.',
        position: 'bottom'
      });
    }
  };
  const renderNoData = () => (
    <View style={styles.noDataContainer}>
      <Image source={require('../../assets/images/no-data.png')} style={styles.noDataImage} />
      <IconButton icon="alert-circle" size={50} />
      <Text style={styles.noDataText}>Aucune donnée disponible</Text>
    </View>
  );

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // 2. Render "No Data" component if no fiches are available
  if (!filteredFiches || filteredFiches.length === 0) {
    return renderNoData();
  }
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
              // { backgroundColor: item._raw.source === "local" ? "#d8d8d8" : "#fff" },
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
              <TouchableOpacity onPress={() => syncSpecificFiche(item.id)}>
                <AntDesign name="sync" size={24} color="black" />
              </TouchableOpacity>

            </View>

            <View style={styles.btnContainer}>
              <TouchableOpacity
                onPress={() => {

                  // Check type_marche to navigate to different pages
                  switch (type_marche) {
                    case 1:
                      // Navigate to Collecte form and pass the fiche id
                      navigation.navigate('ListesCollecte', { idCollecteur, id_marche, type_marche, ficheId: item.id, NumFiche: item._raw.num_fiche });
                      break;
                    case 2:
                      // Navigate to Grossiste form and pass the fiche id
                      navigation.navigate('ListesGrossistesCollect', { idCollecteur, id_marche, type_marche, ficheId: item.id, NumFiche: item._raw.num_fiche  });
                      break;
                    case 3:
                      // Navigate to Consommation form and pass the fiche id
                      navigation.navigate('ListesConso', { idCollecteur, id_marche, type_marche, ficheId: item.id, NumFiche: item._raw.num_fiche });
                      break;
                    case 4:
                      // Navigate to journalier form and pass the fiche id
                      navigation.navigate('ListeJournalier', { idCollecteur, id_marche, type_marche, ficheId: item.id, external_id: item.external_id, NumFiche: item._raw.num_fiche  });
                      break;
                    case 6:
                      // Navigate to FormulaireDebarcadere form and pass the fiche id
                      navigation.navigate('ListeDebarcadere', { idCollecteur, id_marche, type_marche, ficheId: item.id, external_id: item.external_id, NumFiche: item._raw.num_fiche  });
                      break;
                    case 5:
                      // Navigate to FormulaireDebarcadere form and pass the fiche id
                      navigation.navigate('ListeBetail', { idCollecteur, id_marche, type_marche, ficheId: item.id, external_id: item.external_id, NumFiche: item._raw.num_fiche  });
                      break;
                    case 7:
                      // Navigate to Port form and pass the fiche id
                      navigation.navigate('ListPort', { idCollecteur, id_marche, type_marche, ficheId: item.id, NumFiche: item._raw.num_fiche });
                      break;
                    case 8:
                      // Navigate to Port form and pass the fiche id
                      navigation.navigate('listeTransfrontalier', { idCollecteur, id_marche, type_marche, ficheId: item.id , NumFiche: item._raw.num_fiche });
                      break;
                    default:
                      Alert.alert('Type de marché non reconnu', 'Impossible de naviguer vers la page spécifiée.');
                      break;
                  }

                }}
              >
                <View style={styles.btn}>
                  <Text style={{ color: "#fff" }}>Voir les données</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {

                  // Check type_marche to navigate to different pages
                  switch (type_marche) {
                    case 1:
                      // Navigate to Collecte form and pass the fiche id
                      navigation.navigate('Formulaire', { idCollecteur, id_marche, type_marche, ficheId: item.id, external_id: item.external_id, NumFiche: item._raw.num_fiche });
                      break;
                    case 2:
                      // Navigate to Grossiste form and pass the fiche id
                      navigation.navigate('FormGrossistes', { idCollecteur, id_marche, type_marche, ficheId: item.id, external_id: item.external_id ,NumFiche: item._raw.num_fiche });
                      break;
                    case 3:
                      // Navigate to Consommation form and pass the fiche id
                      navigation.navigate('FormCons', { idCollecteur, id_marche, type_marche, ficheId: item.id, external_id: item.external_id, NumFiche: item._raw.num_fiche });
                      break;
                    case 4:
                      // Navigate to journalier form and pass the fiche id
                      navigation.navigate('FormulaireJournalier', { idCollecteur, id_marche, type_marche, ficheId: item.id, external_id: item.external_id,NumFiche: item._raw.num_fiche  });
                      break;
                    case 6:
                      // Navigate to FormulaireDebarcadere form and pass the fiche id
                      navigation.navigate('FormulaireDebarcadere', { idCollecteur, id_marche, type_marche, ficheId: item.id, external_id: item.external_id,NumFiche: item._raw.num_fiche  });
                      break;
                    case 5:
                      // Navigate to FormulaireDebarcadere form and pass the fiche id
                      navigation.navigate('formulaireBetail', { idCollecteur, id_marche, type_marche, ficheId: item.id, external_id: item.external_id , NumFiche: item._raw.num_fiche });
                      break;
                    case 7:
                      // Navigate to Port form and pass the fiche id
                      navigation.navigate('FormPort', { idCollecteur, id_marche, type_marche, ficheId: item.id, external_id: item.external_id, NumFiche: item._raw.num_fiche });
                      break;
                    case 8:
                      // Navigate to Port form and pass the fiche id
                      navigation.navigate('FormulaireTranfrontalier', { idCollecteur, id_marche, type_marche, ficheId: item.id, external_id: item.external_id , NumFiche: item._raw.num_fiche });
                      break;
                    default:
                      Alert.alert('Type de marché non reconnu', 'Impossible de naviguer vers la page spécifiée.');
                      break;
                  }
                }}

              >
                <View style={styles.btn1}>
                  <Text style={{ color: '#fff' }}>Nouvelle donnée</Text>
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
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataImage: {
    width: 250,
    height: 250,
  },
  noDataText: {
    fontSize: 18,
    color: '#888',
  },
  syncIcon: {
    position: 'absolute',
    right: 10,
    top: -50,
  },
});

export default MarketFiches;