import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fonction pour ouvrir ou créer la base de données
const openDatabase = async () => {
    console.log('Opening database...');
    const db = await SQLite.openDatabaseAsync('SIMGUINEE.db'); // Utilisation de openDatabaseAsync
    return db;
};

// Fonction pour créer les tables
export const createTables = async () => {
    try {
        console.log('Creating tables...');
        const db = await openDatabase();
        await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS consommation (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        unite INTEGER,
        poids_unitaire REAL,
        prix_mesure REAL,
        prix_fg_kg REAL,
        prix_kg_litre REAL,
        niveau_approvisionnement TEXT,
        statut TEXT,
        observation TEXT,
        enquete INTEGER,
        produit TEXT,
        num_fiche TEXT

      );
    `);
        console.log('Table "consommation" created successfully.');
    } catch (error) {
        console.log('Error during table creation process: ', error);
    }
};

// Fonction pour insérer des données dans la table collecte
export const insertCollecte = async (
    unite,
    poidsUnitaire,
    prixMmesure,
    prixFgKg,
    prixkglitre,
    niveauApprovisionnement,
    statut,
    observation,
    enquete,
    produit,
    num_fiche
) => {
    try {
        console.log('Inserting data into table "consommation"...');
        const db = await openDatabase();
        await db.runAsync(
            `INSERT INTO consommation (
        unite, poids_unitaire,prix_mesure , prix_fg_kg, prix_kg_litre,
        niveau_approvisionnement, statut, observation, enquete, produit, num_fiche
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                unite,
                poidsUnitaire,
                prixMmesure,
                prixFgKg,
                prixkglitre,
                niveauApprovisionnement,
                statut,
                observation,
                enquete,
                produit,
                num_fiche
            ]
        );
        console.log('Data inserted successfully.');
    } catch (error) {
        console.log('Error during data insertion: ', error);
    }
};