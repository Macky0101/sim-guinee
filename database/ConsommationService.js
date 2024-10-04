import database from '../database/database';
import { Consommation } from './models/Consommation';

import Toast from 'react-native-toast-message';

const ConsommationServices = {
  
  // Créer un nouvel enregistrement consommation
  createConsommation: async (data) => {
    try {
      const consommationCollection = database.get('formulaire_consommation');
      await database.write(async () => {
        await consommationCollection.create((consommations) => {
          consommations.unite= data.unite;
          consommations.poids_unitaire = data.poids_unitaire;
          consommations.prix_mesure = Number(data.prix_mesure);
          consommations.prix_kg_litre = Number(data.prix_kg_litre);
          consommations.niveau_approvisionement = data.niveau_approvisionement;
          consommations.statut = data.statut;
          consommations.observation = data.observation;
          consommations.enquete = data.enquete;
          consommations.produit = data.produit;
          consommations.fiche_id = data.fiche_id;
        });
        console.log('Données enregistrées:', data);
      });
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Consommation enregistré avec succès!',
        position: 'bottom'

      });
    } catch (error) {
      console.error('Erreur lors de la création du consommation:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de créer la consommation.',
        position: 'bottom'

      });
    }
  },

  createJournalier: async (data) => {
    try {
      const consommationCollection = database.get('formulaire_journalier');
      await database.write(async () => {
        await consommationCollection.create((consommations) => {
          consommations.unite= data.unite;
          consommations.poids_unitaire = data.poids_unitaire;
          consommations.prix_mesure = Number(data.prix_mesure);
          consommations.prix_kg_litre = Number(data.prix_kg_litre);
          consommations.niveau_approvisionement = data.niveau_approvisionement;
          consommations.statut = data.statut;
          consommations.observation = data.observation;
          consommations.enquete = data.enquete;
          consommations.produit = data.produit;
          consommations.fiche_id = data.fiche_id;
        });
        console.log('Données enregistrées:', data);
      });
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'journalier enregistré avec succès!',
        position: 'bottom'
      });
    } catch (error) {
      console.error('Erreur lors de la création :', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de créer.',
         position: 'bottom'
      });
    }
  },
// pour le tranfrontaliers
  createTranfrontanlier: async (data) => {
    try {
      const consommationCollection = database.get('formulaire_tranfrontalier');
      await database.write(async () => {
        await consommationCollection.create((consommations) => {
          consommations.unite= Number(data.unite);
          consommations.date_enquete = data.date_enquete;
          consommations.prix_vente = Number(data.prix_vente);
          consommations.prix_achat = Number(data.prix_achat);
          consommations.collecteur = Number(data.collecteur);
          consommations.quantite_sortant = Number(data.quantite_sortant);
          consommations.region_provenance = Number(data.region_provenance);
          consommations.region_destination = Number(data.region_destination);
          consommations.quantite_entrant = Number(data.quantite_entrant);
          consommations.pays_destination = data.pays_destination;
          consommations.pays_origine = data.pays_origine;
          consommations.observation = data.observation;
          consommations.enquete = Number(data.enquete);
          consommations.produit = data.produit;
          consommations.fiche_id = data.fiche_id;
        });
        console.log('Données enregistrées:', data);
      });
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'tranfronstalier enregistré avec succès!',
        position: 'bottom'
      });
    } catch (error) {
      console.error('Erreur lors de la création :', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de créer.',
         position: 'bottom'
      });
    }
  },

  // Lire tous les enregistrements de la table consommation
  listConsommations: async () => {
    try {
      const consommationCollection = database.get('consommation');
      const allconsommation = await consommationCollection.query().fetch();
      // console.log('Liste des consommation:', allconsommation);
      return allconsommation;
    } catch (error) {
      console.error('Erreur lors de la récupération des consommation:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de récupérer les consommation.',
      });
    }
  },

  // Mettre à jour un grossiste
  updateConsommation: async (id, data) => {
    try {
      const consommationCollection = database.get('consommation');
      const consommations = await consommationCollection.find(id);
      await database.action(async () => {
        await consommations.update((record) => {
          record.unite=data.unite;
          record.poids_unitaire = data.poids_unitaire;
          record.prix_mesure = Number(data.prix_mesure);
          record.prix_fg_kg = Number(data.prix_fg_kg);
          record.prix_kg_litre = Number(data.prix_kg_litre);
          record.niveau_approvisionement = data.niveau_approvisionement;
          record.statut = data.statut;
          record.observation = data.observation;
          record.enquete = data.enquete;
          record.produit = data.produit;
          record.document = data.document;
          record.numFiche = data.numFiche;
        });
      });
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Consommation mis à jour avec succès!',
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du Consommation:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de mettre à jour le Consommation.',
      });
    }
  },

// Supprimer un grossiste
deleteConsommation: async (id) => {
    try {
      await database.write(async () => {
        const consommationCollection = database.get('consommation');
        const consommations = await consommationCollection.find(id);
  
        // Suppression soft (marqué comme supprimé mais toujours présent)
        // await grossiste.markAsDeleted(); // Soft delete - cela permet la synchronisation
  
        // OU pour une suppression permanente
        await consommations.destroyPermanently(); // Supprime définitivement
      });
  
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'consommations supprimé avec succès!',
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du consommations:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de supprimer la consommations.',
      });
    }
  },
  
  countConsommations : async () => {
    try {
      // Récupérer la collection 'consommation'
      const collection = database.get('consommation');
      
      // Effectuer une requête pour compter le nombre d'enregistrements
      const count = await collection.query().fetchCount();
      
      console.log('Nombre d\'enregistrements dans la table consommation :', count);
      return count;
    } catch (error) {
      console.error('Erreur lors du comptage des consommation :', error);
      return 0;
    }
  }
  
  
};

export default ConsommationServices;
