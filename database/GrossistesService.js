import database from '../database/database';
import { Grossistes } from './models/Grossistes';
import Toast from 'react-native-toast-message';

const GrossistesService = {
  
  // Créer un nouvel enregistrement grossiste
  createGrossiste: async (data) => {
    try {
      const grossistesCollection = database.get('grossistes');
      await database.write(async () => {
        await grossistesCollection.create((grossiste) => {
          // grossiste.uniteStock = data.uniteStock;
          grossiste.uniteStock = Number(data.uniteStock);
          // grossiste.poidsMoyenUniteStock = data.poidsMoyenUniteStock;
          grossiste.poidsMoyenUniteStock = Number(data.poidsMoyenUniteStock)
          // grossiste.poidsStock = data.poidsStock;
          grossiste.poidsStock = Number(data.poidsStock);
          grossiste.uniteAchat = data.uniteAchat;
          // grossiste.nombreUniteAchat = data.nombreUniteAchat;
          grossiste.nombreUniteAchat = Number(data.nombreUniteAchat);
          // grossiste.poidsMoyenUniteAchat = data.poidsMoyenUniteAchat;
          grossiste.poidsMoyenUniteAchat = Number(data.poidsMoyenUniteAchat);
          // grossiste.poidsTotalAchat = data.poidsTotalAchat;
          grossiste.poidsTotalAchat = Number(data.poidsTotalAchat);
          grossiste.localiteAchat = data.localiteAchat;
          grossiste.fournisseurAchat = data.fournisseurAchat;
          grossiste.uniteVente = data.uniteVente;
          grossiste.nombreUniteVente = Number(data.nombreUniteVente);
          grossiste.poidsMoyenUniteVente = Number(data.poidsMoyenUniteVente);
          grossiste.poidsTotalUniteVente = Number(data.poidsTotalUniteVente);
          grossiste.prixUnitaireVente = Number(data.prixUnitaireVente);
          grossiste.clientVente = Number(data.clientVente);
          grossiste.clientPrincipal = data.clientPrincipal;
          grossiste.fournisseurPrincipal = data.fournisseurPrincipal;
          grossiste.niveauApprovisionement = data.niveauApprovisionement;
          grossiste.statut = data.statut;
          grossiste.observation = data.observation;
          grossiste.enquete = data.enquete;
          grossiste.produit = data.produit;
          grossiste.localiteOrigine = data.localiteOrigine;
          grossiste.numFiche = data.numFiche;
        });
        console.log('Données enregistrées:', data);
      });
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Grossiste enregistré avec succès!',
      });
    } catch (error) {
      console.error('Erreur lors de la création du grossiste:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de créer le grossiste.',
      });
    }
  },

  // Lire tous les enregistrements de la table Grossistes
  listGrossistes: async () => {
    try {
      const grossistesCollection = database.get('grossistes');
      const allGrossistes = await grossistesCollection.query().fetch();
    //   console.log('Liste des grossistes:', allGrossistes);
      return allGrossistes;
    } catch (error) {
      console.error('Erreur lors de la récupération des grossistes:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de récupérer les grossistes.',
      });
    }
  },

  // Mettre à jour un grossiste
  updateGrossiste: async (id, data) => {
    try {
      const grossistesCollection = database.get('grossistes');
      const grossiste = await grossistesCollection.find(id);
      await database.action(async () => {
        await grossiste.update((record) => {
          record.uniteStock = Number(data.uniteStock);
          record.poidsMoyenUniteStock = Number(data.poidsMoyenUniteStock)
          record.poidsStock = Number(data.poidsStock);
          record.uniteAchat = data.uniteAchat;
          record.nombreUniteAchat = Number(data.nombreUniteAchat);
          record.poidsMoyenUniteAchat = Number(data.poidsMoyenUniteAchat);
          record.poidsTotalAchat = Number(data.poidsTotalAchat);
          record.localiteAchat = data.localiteAchat;
          record.fournisseurAchat = data.fournisseurAchat;
          record.uniteVente = data.uniteVente;
          record.nombreUniteVente = Number(data.nombreUniteVente);
          record.poidsMoyenUniteVente = Number(data.poidsMoyenUniteVente);
          record.poidsTotalUniteVente = Number(data.poidsTotalUniteVente);
          record.prixUnitaireVente = Number(data.prixUnitaireVente);
          record.clientVente = Number(data.clientVente);
          record.clientPrincipal = data.clientPrincipal;
          record.fournisseurPrincipal = data.fournisseurPrincipal;
          record.niveauApprovisionement = data.niveauApprovisionement;
          record.statut = data.statut;
          record.observation = data.observation;
          record.enquete = data.enquete;
          record.produit = data.produit;
          record.localiteOrigine = data.localiteOrigine;
          record.numFiche = data.numFiche;
        });
      });
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Grossiste mis à jour avec succès!',
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du grossiste:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de mettre à jour le grossiste.',
      });
    }
  },

// Supprimer un grossiste
deleteGrossiste: async (id) => {
    try {
      await database.write(async () => {
        const grossistesCollection = database.get('grossistes');
        const grossiste = await grossistesCollection.find(id);
  
        // Suppression soft (marqué comme supprimé mais toujours présent)
        // await grossiste.markAsDeleted(); // Soft delete - cela permet la synchronisation
  
        // OU pour une suppression permanente
        await grossiste.destroyPermanently(); // Supprime définitivement
      });
  
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Grossiste supprimé avec succès!',
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du grossiste:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de supprimer le grossiste.',
      });
    }
  },
  
  countGrossistes : async () => {
    try {
      // Récupérer la collection 'collecte'
      const collection = database.get('grossistes');
      
      // Effectuer une requête pour compter le nombre d'enregistrements
      const count = await collection.query().fetchCount();
      
      console.log('Nombre d\'enregistrements dans la table grossistes :', count);
      return count;
    } catch (error) {
      console.error('Erreur lors du comptage des grossistes :', error);
      return 0;
    }
  }
  
  
};

export default GrossistesService;
