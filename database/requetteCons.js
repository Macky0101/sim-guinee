import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fonction pour ouvrir ou créer la base de données
const openDatabase = async () => {
  console.log('Opening database...');
  try {
      const db = await SQLite.openDatabaseAsync('SIMGUINEE.db'); // Utilisation de openDatabaseAsync
      console.log('Database opened successfully!',db);
      return db;
  } catch (error) {
      console.error('Failed to open database:', error);
  }
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
// Fonction pour mettre à jour les données dans la table consommation
export const updateConsommation = async (
  id,
  unite,
  poidsUnitaire,
  prixMesure,
  prixFgKg,
  prixKgLitre,
  niveauApprovisionnement,
  statut,
  observation,
  enquete,
  produit,
  num_fiche
) => {
  try {
    console.log('Updating data in table "consommation"...');
    const db = await openDatabase();
    await db.runAsync(
      `UPDATE consommation SET 
        unite = ?, 
        poids_unitaire = ?, 
        prix_mesure = ?, 
        prix_fg_kg = ?, 
        prix_kg_litre = ?, 
        niveau_approvisionnement = ?, 
        statut = ?, 
        observation = ?, 
        enquete = ?, 
        produit = ?, 
        num_fiche = ? 
      WHERE id = ?`,
      [
        unite,
        poidsUnitaire,
        prixMesure,
        prixFgKg,
        prixKgLitre,
        niveauApprovisionnement,
        statut,
        observation,
        enquete,
        produit,
        num_fiche,
        id
      ]
    );
    console.log('Data updated successfully.');
  } catch (error) {
    console.log('Error during data update: ', error);
  }
};


// Fonction pour récupérer les données de la table consommation
export const getConsommationData = async () => {
    try {
      console.log('Fetching data from table "consommation"...');
      const db = await openDatabase();
      const results = await db.getAllAsync('SELECT * FROM consommation');
      console.log('consommation data', results)
      return results;
    } catch (error) {
      console.log('Error fetching data: ', error);
      throw error;
    }
  };
  
  export const deleteConsommation = async (id) => {
    try {
      console.log('Deleting data from table "consommation"...');
      const db = await openDatabase();
      await db.runAsync(
        `DELETE FROM consommation WHERE id = ?`,
        [id]
      );
      console.log('Data deleted successfully.');
    } catch (error) {
      console.log('Error during data deletion: ', error);
    }
  };

  export const getTotalRecordsCons = async () => {
    try {
      console.log('Counting total records in table "consommation"...');
      const db = await openDatabase();
      const result = await db.getFirstAsync(
        `SELECT COUNT(*) as totalRecords FROM consommation`
      );
      const totalRecords = result.totalRecords;
      console.log('Total records in table "consommation":', totalRecords);
      return totalRecords;
    } catch (error) {
      console.log('Error during record count: ', error);
    }
  };
  export const deleteAllCons = async () => {
    try {
      console.log('Deleting all data from table "consommation"...');
      const db = await openDatabase();
      await db.execAsync(`DELETE FROM consommation`);
      console.log('All data deleted successfully.');
    } catch (error) {
      console.log('Error during data deletion: ', error);
    }
  };