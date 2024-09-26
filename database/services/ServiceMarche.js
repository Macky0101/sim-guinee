import database from '../database';
import Marche from '../models/Marche';

// Fonction pour récupérer tous les marchés
export const getAllMarches = async () => {
    const collection = database.get('marches');
    const marches = await collection.query().fetch();
    return marches;
};

// Fonction pour récupérer un marché par ID
export const getMarcheById = async (id) => {
    const collection = database.get('marches');
    const marche = await collection.find(id);
    return marche;
};
// Fonction pour insérer ou mettre à jour les types de marché
export const upsertTypesMarche = async (typesMarche) => {
    const typesMarcheCollection = database.collections.get('types_marche');
  
    await database.action(async () => {
      for (const type of typesMarche) {
        await typesMarcheCollection.create((typeMarcheRecord) => {
          typeMarcheRecord.id_type_marche = type.type.id_type_marche;
          typeMarcheRecord.nom_type_marche = type.type.nom_type_marche;
          typeMarcheRecord.description = type.type.description;
          typeMarcheRecord.code_type_marche = type.type.code_type_marche;
          typeMarcheRecord.nbre_marche = type.nbre_marche;
        });
      }
    });
  };