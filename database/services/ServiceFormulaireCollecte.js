import database from '../database';
import { FormulaireCollecte } from '../models/FormulaireCollecte'; // Modèle de Formulaire Collecte

// Fonction pour créer un formulaire Collecte
export const createFormulaireCollecte = async (data) => {
    const collection = database.get('formulaire_collecte');
    await database.write(async () => {
        await collection.create((formulaire) => {
            formulaire.unite = data.unite;
            formulaire.poids_unitaire = data.poids_unitaire;
            formulaire.montant_achat = data.montant_achat;
            formulaire.prix_fg_kg = data.prix_fg_kg;
            formulaire.etat_route = data.etat_route;
            formulaire.fiche_id = data.fiche_id;
            // Ajoutez d'autres champs si nécessaire
        });
    });
};

// Fonction pour récupérer tous les formulaires Collecte
export const getAllFormulairesCollecte = async () => {
    const collection = database.get('formulaire_collecte');
    const formulaires = await collection.query().fetch();
    return formulaires;
};

// Fonction pour mettre à jour un formulaire Collecte
export const updateFormulaireCollecte = async (id, updatedData) => {
    const collection = database.get('formulaire_collecte');
    await database.write(async () => {
        const formulaire = await collection.find(id);
        await formulaire.update((formulaire) => {
            formulaire.unite = updatedData.unite || formulaire.unite;
            formulaire.poids_unitaire = updatedData.poids_unitaire || formulaire.poids_unitaire;
            formulaire.montant_achat = updatedData.montant_achat || formulaire.montant_achat;
            formulaire.prix_fg_kg = updatedData.prix_fg_kg || formulaire.prix_fg_kg;
            // Mettez à jour d'autres champs si nécessaire
        });
    });
};

// Fonction pour supprimer un formulaire Collecte
export const deleteFormulaireCollecte = async (id) => {
    const collection = database.get('formulaire_collecte');
    await database.write(async () => {
        const formulaire = await collection.find(id);
        await formulaire.markAsDeleted();
    });
};
