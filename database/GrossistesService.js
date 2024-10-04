import database from '../database/database';
import { Grossistes } from './models/Grossistes';
import Toast from 'react-native-toast-message';

const GrossistesService = {
  
  // Créer un nouvel enregistrement grossiste
  createGrossiste: async (data) => {
    try {
      const grossistesCollection = database.get('formulaire_grossiste');
      await database.write(async () => {
        await grossistesCollection.create((grossiste) => {
          grossiste.unite_stock = Number(data.unite_stock);
          grossiste.stock_anterieur = Number(data.stock_anterieur)
          grossiste.poids_moyen_unite_stock = Number(data.poids_moyen_unite_stock);
          grossiste.poids_stock = Number(data.poids_stock);
          grossiste.stock_du_jour = Number(data.stock_du_jour);
          grossiste.quantite_entree = Number(data.quantite_entree);
          grossiste.fournisseur_principaux = Number(data.fournisseur_principaux);
          grossiste.nombre_unite_achat = Number(data.nombre_unite_achat);
          grossiste.unite_achat = Number(data.unite_achat);
          grossiste.unite_vente = Number(data.unite_vente);
          grossiste.prix_achat = Number(data.prix_achat);
          grossiste.prix_unitaire_vente = Number(data.prix_unitaire_vente);
          grossiste.localite_achat = Number(data.localite_achat);
          grossiste.client_vente = Number(data.client_vente);
          grossiste.autre_client_principal = Number(data.autre_client_principal);
          grossiste.statut = data.statut;
          grossiste.observation = data.observation;
          grossiste.enquete = Number(data.enquete);
          grossiste.produit = data.produit;
          grossiste.fiche_id = data.fiche_id;
        });
        console.log('Données enregistrées:', data);
      });
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Grossiste enregistré avec succès!',
         position: 'bottom'
      });
    } catch (error) {
      console.error('Erreur lors de la création du grossiste:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de créer le grossiste.',
         position: 'bottom'
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
        const grossistesCollection = database.get('formulaire_grossiste');
        const grossiste = await grossistesCollection.find(id);
        await grossiste.destroyPermanently(); // Supprime définitivement
      });
  
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Grossiste supprimé avec succès!',
        position: 'bottom'

      });
    } catch (error) {
      console.error('Erreur lors de la suppression du grossiste:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de supprimer le grossiste.',
        position: 'bottom'

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
