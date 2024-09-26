
import database from "./database";
import Toast from 'react-native-toast-message';

export const createCollecte = async (data) => {
  try {
    const collecteCollection = database.get('collecte');
    await database.write(async () => {
      await collecteCollection.create((collectes) => {
        collectes.unite= Number(data.unite);
        collectes.poids_unitaire= Number(data.poids_unitaire);
        collectes.montant_achat= Number(data.montant_achat);
        collectes.prix_fg_kg = Number(data.prix_fg_kg);
        // collectes.distance_origine_marche= Number(data.distance_origine_marche);
        collectes.etat_route= Number(data.etat_route);
        // collectes.montant_transport= Number(data.montant_transport);
        // collectes.etat_route = data.etat_route;
        collectes.quantite_collecte= Number(data.quantite_collecte);
        // collectes.client_principal = data.client_principal;
        // collectes.fournisseur_principal = data.fournisseur_principal;
        collectes.niveau_approvisionement = data.niveau_approvisionement;
        collectes.statut = data.statut;
        collectes.etat = data.etat;
        collectes.observation = data.observation;
        collectes.enquete= data.enquete;
        collectes.produit = data.produit;
        collectes.destination_finale = data.destination_finale;
        // collectes.localite_origine = Number(data.localite_origine);
        collectes.numFiche = data.numFiche;
      });
      console.log('Données enregistrées:', data);
    });
    Toast.show({
      type: 'success',
      text1: 'Succès',
      text2: 'Grossiste enregistré avec succès!',
    });
  } catch (error) {
    console.error('Erreur lors de la création du collecte:', error);
    Toast.show({
      type: 'error',
      text1: 'Erreur',
      text2: 'Impossible de créer le collecte.',
    });
  }
};

export const getAllCollects = async () => {
    try {
      const collects = await database.get('collecte').query().fetch();
    //   console.log('Liste des collectes :', collects);
      return collects;
    } catch (error) {
      console.error('Erreur lors de la récupération des collectes :', error);
      return [];
    }
  };
  export const updateCollect = async (id, updatedFields) => {
    try {
      await database.write(async () => {
        const collectToUpdate = await database.get('collecte').find(id);
        await collectToUpdate.update(collect => {
          Object.assign(collect, updatedFields); // Met à jour les champs fournis
        });
      });
      console.log('Mise à jour réussie pour l\'ID :', id);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'entrée collecte :', error);
    }
  };
  export const deleteCollect = async (id) => {
    try {
      await database.write(async () => {
        const collectToDelete = await database.get('collecte').find(id);
        await collectToDelete.markAsDeleted(); // Suppression logique (soft delete)
      });
      console.log('Suppression réussie pour l\'ID :', id);
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Collecte supprimé avec succès!',
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du Collecte:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de supprimer le Collecte.',
      });
    }
  };
  export const deleteAllCollects = async () => {
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
  export const countCollects = async () => {
    try {
      // Récupérer la collection 'collecte'
      const collection = database.get('collecte');
      
      // Effectuer une requête pour compter le nombre d'enregistrements
      const count = await collection.query().fetchCount();
      
      console.log('Nombre d\'enregistrements dans la table collecte :', count);
      return count;
    } catch (error) {
      console.error('Erreur lors du comptage des collectes :', error);
      return 0;
    }
  };