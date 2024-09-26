import { Q } from '@nozbe/watermelondb';
import database from '../database';
import { Fiche } from '../models/Fiche'; // Modèle de Fiche

// Fonction pour créer une nouvelle fiche
export const createFiche = async (data) => {
    const collection = database.get('fiches');
    await database.write(async () => {
        await collection.create((fiche) => {
            fiche.num_fiche = data.num_fiche;
            fiche.date_enquete = data.date_enquete;
            fiche.marche = data.marche;
            fiche.collecteur = data.collecteur;
            fiche.id_type_marche = data.id_type_marche;
            // Ajoutez d'autres champs si nécessaire
        });
    });
};

// Fonction pour récupérer toutes les fiches
export const getAllFiches = async () => {
    const collection = database.get('fiches');
    const fiches = await collection.query().fetch();
    return fiches;
};

// Fonction pour récupérer une fiche par ID
export const getFicheById = async (id) => {
    const collection = database.get('fiches');
    const fiche = await collection.find(id);
    return fiche;
};

// Fonction pour mettre à jour une fiche
export const updateFiche = async (id, updatedData) => {
    const collection = database.get('fiches');
    await database.write(async () => {
        const fiche = await collection.find(id);
        await fiche.update((fiche) => {
            fiche.num_fiche = updatedData.num_fiche || fiche.num_fiche;
            fiche.date_enquete = updatedData.date_enquete || fiche.date_enquete;
            fiche.marche = updatedData.marche || fiche.marche;
            fiche.collecteur = updatedData.collecteur || fiche.collecteur;
            fiche.id_type_marche = updatedData.id_type_marche || fiche.id_type_marche;
            // Mettez à jour d'autres champs si nécessaire
        });
    });
};

// Fonction pour supprimer une fiche
export const deleteFiche = async (id) => {
    const collection = database.get('fiches');
    await database.write(async () => {
        const fiche = await collection.find(id);
        await fiche.markAsDeleted(); // Marque la fiche comme supprimée (soft delete)
    });
};
