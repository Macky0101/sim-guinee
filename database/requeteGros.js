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
      CREATE TABLE IF NOT EXISTS grossistes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        unite_stock INTEGER,
    poids_moyen_unite_stock INTEGER,
      poids_stock INTEGER,
      unite_achat TEXT,
      nombre_unite_achat INTEGER,
      poids_moyen_unite_achat INTEGER,
      poids_total_achat INTEGER,
      localite_achat TEXT,
      fournisseur_achat TEXT,
      unite_vente TEXT,
      nombre_unite_vente INTEGER,
      poids_moyen_unite_vente INTEGER,
      poids_total_unite_vente INTEGER,
      prix_unitaire_vente INTEGER,
      client_vente INTEGER,
      client_principal TEXT,
      fournisseur_principal TEXT,
      niveau_approvisionement TEXT,
      statut TEXT,
      observation TEXT,
      enquete INTEGER,
      produit TEXT,
      localite_origine INTEGER,
     num_fiche TEXT
      );
    `);
    console.log('Table "grossistes" created successfully.');
  } catch (error) {
    console.log('Error during table creation process: ', error);
  }
};

// Fonction pour insérer des données dans la table collecte
export const insertgrossistes = async (
    unite_stock,
    poids_moyen_unite_stock,
      poids_stock,
      unite_achat,
      nombre_unite_achat,
      poids_moyen_unite_achat,
      poids_total_achat,
      localite_achat,
      fournisseur_achat,
      unite_vente,
      nombre_unite_vente,
      poids_moyen_unite_vente,
      poids_total_unite_vente,
      prix_unitaire_vente,
      client_vente,
      client_principal,
      fournisseur_principal,
      niveau_approvisionement,
      statut ,
      observation,
      enquete,
      produit,
      localite_origine ,
     num_fiche 
) => {
  try {
    console.log('Inserting data into table "grossistes"...');
    const db = await openDatabase();
    await db.runAsync(
      `INSERT INTO grossistes (
     unite_stock, poids_moyen_unite_stock, poids_stock, unite_achat,
      nombre_unite_achat, poids_moyen_unite_achat, poids_total_achat, localite_achat,
      fournisseur_achat, unite_vente, nombre_unite_vente, poids_moyen_unite_vente,
      poids_total_unite_vente, prix_unitaire_vente,client_vente, client_principal,fournisseur_principal,
      niveau_approvisionement, statut , observation, enquete,
      produit,localite_origine , num_fiche
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        unite_stock,
        poids_moyen_unite_stock,
          poids_stock,
          unite_achat,
          nombre_unite_achat,
          poids_moyen_unite_achat,
          poids_total_achat,
          localite_achat,
          fournisseur_achat,
          unite_vente,
          nombre_unite_vente,
          poids_moyen_unite_vente,
          poids_total_unite_vente,
          prix_unitaire_vente,
          client_vente,
          client_principal,
          fournisseur_principal,
          niveau_approvisionement,
          statut ,
          observation,
          enquete,
          produit,
          localite_origine ,
         num_fiche
      ]
    );
    console.log('Data inserted successfully.');
  } catch (error) {
    console.log('Error during data insertion: ', error);
  }
};
export const updategrossistes = async (
    id,
    unite_stock,
    poids_moyen_unite_stock,
      poids_stock,
      unite_achat,
      nombre_unite_achat,
      poids_moyen_unite_achat,
      poids_total_achat,
      localite_achat,
      fournisseur_achat,
      unite_vente,
      nombre_unite_vente,
      poids_moyen_unite_vente,
      poids_total_unite_vente,
      prix_unitaire_vente,
      client_vente,
      client_principal,
      fournisseur_principal,
      niveau_approvisionement,
      statut ,
      observation,
      enquete,
      produit,
      localite_origine ,
     num_fiche
) => {
  try {
    console.log('Updating data in table "grossistes"...');
    const db = await openDatabase();
    await db.runAsync(
      `UPDATE grossistes SET 
         unite_stock = ?, poids_moyen_unite_stock = ?, poids_stock = ?, unite_achat = ?,
      nombre_unite_achat = ?, poids_moyen_unite_achat = ?, poids_total_achat = ?, localite_achat = ?,
      fournisseur_achat = ?, unite_vente = ?, nombre_unite_vente = ?, poids_moyen_unite_vente = ?,
      poids_total_unite_vente = ?, prix_unitaire_vente,client_vente = ?, client_principal,fournisseur_principal = ?,
      niveau_approvisionement = ?, statut = ? , observation = ?, enquete = ?,
      produit = ?,localite_origine = ? , num_fiche = ?
      WHERE id = ?`,
      [
        unite_stock, poids_moyen_unite_stock, poids_stock, unite_achat,
      nombre_unite_achat, poids_moyen_unite_achat, poids_total_achat, localite_achat,
      fournisseur_achat, unite_vente, nombre_unite_vente, poids_moyen_unite_vente,
      poids_total_unite_vente, prix_unitaire_vente,client_vente, client_principal,fournisseur_principal,
      niveau_approvisionement, statut , observation, enquete,
      produit,localite_origine , num_fiche ,id
      ]
    );
    console.log('Data updated successfully.');
  } catch (error) {
    console.log('Error during data update: ', error);
  }
};
export const deletegrossistes = async (id) => {
  try {
    console.log('Deleting data from table "grossistes"...');
    const db = await openDatabase();
    await db.runAsync(
      `DELETE FROM grossistes WHERE id = ?`,
      [id]
    );
    console.log('Data deleted successfully.');
  } catch (error) {
    console.log('Error during data deletion: ', error);
  }
};

// Fonction pour récupérer les données de la table collecte
export const getGrossistesData = async () => {
    try {
      console.log('Fetching data from table "collecte"...');
      const db = await openDatabase();
      const results = await db.getAllAsync('SELECT * FROM grossistes');
    //   console.log('Collecte data', results)
      return results;
    } catch (error) {
      console.log('Error fetching data: ', error);
      throw error;
    }
  };

  
  // Fonction pour vérifier la structure de la table
  export const checkTableStructure = async () => {
    try {
      console.log('Checking table structure...');
      const db = await openDatabase();
      const results = await db.getAllAsync('PRAGMA table_info(collecte)');
      console.log('Table structure:', results);
      return results;
    } catch (error) {
      console.log('Error checking table structure: ', error);
      throw error;
    }
  };


