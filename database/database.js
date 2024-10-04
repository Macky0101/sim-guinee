import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema'; // Importer ton schéma ici
import TypeMarche from './models/TypeMarche'; // Importer les modèles que tu créeras
import Marche from './models/Marche';
import Fiche from './models/Fiche';
import FormulaireCollecte from './models/FormulaireCollecte';
import FormulaireGrossiste from './models/FormulaireGrossiste';
import FormulaireConsommation from './models/FormulaireConsommation';
import Produit from './models/Produit';
import CategorieProduit from './models/CategorieProduit';
import FormeProduit from './models/FormeProduit';
import FamilleProduit from './models/FamilleProduit';
import FormulairePort from './models/FormulairePort';
import Unite from './models/unite';
import UniteRelation from './models/uniteRelation';
import FormulaireJournalier from './models/FormulaireJournalier';
import FormulaireDebarcadere from './models/FormulaireDebarcadere';
import FormulaireTransfrontalier from './models/FormulaireTransfrontalier';
import OrigineProduit from './models/OrigineProduit';

// Configuration de l'adapter SQLite pour WatermelonDB
const adapter = new SQLiteAdapter({
  schema, // Utilise le schéma défini
  // migrations: migrations, // Si tu utilises des migrations, ajoute-les ici
  dbName: 'marchesDatabase', // Optionnel: spécifie un nom pour la base de données
  // jsi: true, // Active l'utilisation de l'implémentation JSI pour de meilleures performances
  synchronous: true, // Recommandé pour SQLite
  onSetUpError: error => {
    console.error('Erreur lors de la configuration de la base de données', error);
  }
});

// Initialisation de la base de données WatermelonDB
const database = new Database({
  adapter, // Adapter SQLite
  modelClasses: [
    TypeMarche, // Modèle pour la table types_marche
    Marche,     // Modèle pour la table marches
    Fiche,      // Modèle pour la table fiches
    FormulaireCollecte, // Modèle pour la table formulaire_collecte
    FormulaireGrossiste, // Modèle pour la table formulaire_grossiste
    FormulaireConsommation,
    Produit,
    CategorieProduit, 
    FormeProduit, 
    FamilleProduit,
    FormulairePort,
    Unite,
    UniteRelation,
    FormulaireJournalier,
    FormulaireDebarcadere,
    FormulaireTransfrontalier,
    OrigineProduit
    
  ],
  actionsEnabled: true, // Permet l'utilisation d'actions pour la synchronisation
});

export default database;
