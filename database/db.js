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
    await db.
    execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS collecte (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        unite INTEGER,
        poids_unitaire REAL,
        montant_achat REAL,
        prix_fg_kg REAL,
        distance_origine_marche REAL,
        montant_transport REAL,
        etat_route TEXT,
        quantite_collecte REAL,
        client_principal TEXT,
        fournisseur_principal TEXT,
        niveau_approvisionement TEXT,
        statut TEXT,
        observation TEXT,
        enquete INTEGER,
        produit TEXT,
        localite_origine TEXT,
        num_fiche TEXT
      );
    `);
    console.log('Table "collecte" created successfully.');
  } catch (error) {
    console.log('Error during table creation process: ', error);
  }
};

// Fonction pour insérer des données dans la table collecte
export const insertCollecte = async (
  unite,
  poidsUnitaire,
  montantAchat,
  prixFgKg,
  distanceOrigineMarche,
  montantTransport,
  etatRoute,
  quantiteCollecte,
  clientPrincipal,
  fournisseurPrincipal,
  niveauApprovisionement,
  statut,
  observation,
  enquete,
  produit,
  localiteOrigine,
  num_fiche 
) => {
  try {
    console.log('Inserting data into table "collecte"...');
    const db = await openDatabase();
    await db.runAsync(
      `INSERT INTO collecte (
        unite, poids_unitaire, montant_achat, prix_fg_kg, 
        distance_origine_marche, montant_transport, etat_route, 
        quantite_collecte, client_principal, fournisseur_principal, 
        niveau_approvisionement, statut, observation, enquete, produit, localite_origine, num_fiche
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        unite, poidsUnitaire, montantAchat, prixFgKg, 
        distanceOrigineMarche, montantTransport, etatRoute, 
        quantiteCollecte, clientPrincipal, fournisseurPrincipal, 
        niveauApprovisionement, statut, observation, enquete, produit, localiteOrigine, num_fiche
      ]
    );
    console.log('Data inserted successfully.');
  } catch (error) {
    console.log('Error during data insertion: ', error);
  }
};
export const updateCollecte = async (
  id,
  unite,
  poidsUnitaire,
  montantAchat,
  prixFgKg,
  distanceOrigineMarche,
  montantTransport,
  etatRoute,
  quantiteCollecte,
  clientPrincipal,
  fournisseurPrincipal,
  niveauApprovisionement,
  statut,
  observation,
  enquete,
  produit,
  localiteOrigine,
  num_fiche 
) => {
  try {
    console.log('Updating data in table "collecte"...');
    const db = await openDatabase();
    await db.runAsync(
      `UPDATE collecte SET 
        unite = ?, poids_unitaire = ?, montant_achat = ?, prix_fg_kg = ?, 
        distance_origine_marche = ?, montant_transport = ?, etat_route = ?, 
        quantite_collecte = ?, client_principal = ?, fournisseur_principal = ?, 
        niveau_approvisionement = ?, statut = ?, observation = ?, enquete = ?, 
        produit = ?, localite_origine = ?, num_fiche = ?
      WHERE id = ?`,
      [
        unite, poidsUnitaire, montantAchat, prixFgKg, 
        distanceOrigineMarche, montantTransport, etatRoute, 
        quantiteCollecte, clientPrincipal, fournisseurPrincipal, 
        niveauApprovisionement, statut, observation, enquete, produit, localiteOrigine, num_fiche, id
      ]
    );
    console.log('Data updated successfully.');
  } catch (error) {
    console.log('Error during data update: ', error);
  }
};
export const deleteCollecte = async (id) => {
  try {
    console.log('Deleting data from table "collecte"...');
    const db = await openDatabase();
    await db.runAsync(
      `DELETE FROM collecte WHERE id = ?`,
      [id]
    );
    console.log('Data deleted successfully.');
  } catch (error) {
    console.log('Error during data deletion: ', error);
  }
};

// Fonction pour récupérer les données de la table collecte
export const getCollecteData = async () => {
    try {
      console.log('Fetching data from table "collecte"...');
      const db = await openDatabase();
      const results = await db.getAllAsync('SELECT * FROM collecte');
    //   console.log('Collecte data', results)
      return results;
    } catch (error) {
      console.log('Error fetching data: ', error);
      throw error;
    }
  };

// Fonction pour ajouter une colonne à une table existante
export const addColumnToCollecteTable = async () => {
    try {
      console.log('Adding column to table "collecte"...');
      const db = await openDatabase();
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        ALTER TABLE collecte ADD COLUMN num_fiche TEXT;
      `);
      console.log('Column "num_fiche" added successfully.');
    } catch (error) {
      console.log('Error during column addition: ', error);
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

  export const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key); // Récupérer les données stockées
      return jsonValue != null ? JSON.parse(jsonValue) : null; // Convertir depuis JSON
    } catch (e) {
      console.error('Erreur lors de la récupération des données', e);
      return null;
    }
  };


  // Fonction pour supprimer la table collecte
export const dropCollecteTable = async () => {
  try {
    console.log('Dropping table "collecte"...');
    const db = await openDatabase();
    await db.execAsync(`
      DROP TABLE IF EXISTS collecte;
    `);
    console.log('Table "collecte" deleted successfully.');
  } catch (error) {
    console.log('Error during table deletion: ', error);
  }
};

// Fonction pour recréer la table collecte
export const recreateCollecteTable = async () => {
  try {
    // Supprimer la table
    await dropCollecteTable();

    // Recréer la table
    await createTables();

    console.log('Table "collecte" recreated successfully.');
  } catch (error) {
    console.log('Error during table recreation: ', error);
  }
};

export const getTotalRecords = async () => {
  try {
    console.log('Counting total records in table "collecte"...');
    const db = await openDatabase();
    const result = await db.getFirstAsync(
      `SELECT COUNT(*) as totalRecords FROM collecte`
    );
    const totalRecords = result.totalRecords;
    // console.log('Total records in table "collecte":', totalRecords);
    return totalRecords;
  } catch (error) {
    console.log('Error during record count: ', error);
  }
};
// Fonction pour supprimer tous les contenus de la table collecte
export const deleteAllCollecte = async () => {
  try {
    console.log('Deleting all data from table "collecte"...');
    const db = await openDatabase();
    await db.execAsync(`DELETE FROM collecte`);
    console.log('All data deleted successfully.');
  } catch (error) {
    console.log('Error during data deletion: ', error);
  }
};