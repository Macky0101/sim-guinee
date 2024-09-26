import { appSchema, tableSchema } from '@nozbe/watermelondb';

// Définition du schéma pour WatermelonDB
export const schema = appSchema({
  version: 1,
  tables: [
    // Table pour stocker les types de marché
    tableSchema({
      name: 'types_marche',
      columns: [
        { name: 'nom_type_marche', type: 'string' }, // Nom du type de marché
        { name: 'code_type_marche', type: 'string' }, // Code du type de marché
        { name: 'description', type: 'string' }, // Description du type de marché
        { name: 'id_type_marche', type: 'number' }, // ID du type de marché
        { name: 'nbre_marche', type: 'number' },

      ]
    }),

    // Table pour stocker les marchés
    tableSchema({
      name: 'marches',
      columns: [
        { name: 'id_marche', type: 'number' }, // ID du marché
        { name: 'code_marche', type: 'string' }, // Code du marché
        { name: 'nom_marche', type: 'string' }, // Nom du marché
        { name: 'type_marche', type: 'number' }, // ID du type de marché (relation)
        { name: 'contact_collecteur', type: 'string' }, // Contact du collecteur
        { name: 'nom_type_marche', type: 'string' }, // Nom du type de marché (pour affichage)
        { name: 'nom_collecteur', type: 'string' }, // Nom du collecteur
        { name: 'id_collecteur', type: 'number' }, // ID du collecteur
        { name: 'localite', type: 'string' }, // Localité du marché
        { name: 'nom_region', type: 'string' }, // Nom de la région
        { name: 'nom_prefecture', type: 'string' }, // Nom de la préfecture
        { name: 'longitude', type: 'number' }, // Longitude du marché
        { name: 'latitude', type: 'number' } ,// Latitude du marché
        { name: 'nbre_fiche', type: 'number' } // nbre_fiche du marché
      ]
    }),

    // Table pour stocker les fiches générales, avec des champs spécifiques selon le type de marché
    tableSchema({
      name: 'fiches',
      columns: [
        { name: 'num_fiche', type: 'string' }, // Numéro de la fiche
        { name: 'date_enquete', type: 'string' }, // Date de l'enquête
        { name: 'marche', type: 'number' }, // ID du marché (relation)
        { name: 'collecteur', type: 'number' }, // ID du collecteur
        { name: 'id_type_marche', type: 'string' }, // Relation avec le type de marché pour savoir quel formulaire utiliser
        { name: 'source', type: 'string' }, // Source des données (local ou api)

        // Champs supplémentaires pour le type Grossiste
        { name: 'numero_point_collecte', type: 'string', isOptional: true },
        { name: 'nom_personne_enquete', type: 'string', isOptional: true },
        { name: 'contact_personne_enquete', type: 'string', isOptional: true },

        // Champs supplémentaires pour le type Débarcadère
        { name: 'type_embarcation', type: 'string', isOptional: true },
        { name: 'espece_presente', type: 'string', isOptional: true },
        { name: 'difficultes_rencontrees', type: 'string', isOptional: true },
        { name: 'nbr_barques_rentres_jour', type: 'number', isOptional: true },
        { name: 'heure_fin_collecte_semaine', type: 'string', isOptional: true },

        // Champs supplémentaires pour le type Bétail
        { name: 'stock_initial_bovins', type: 'number', isOptional: true },
        { name: 'nbr_bovins_debarques', type: 'number', isOptional: true },
        { name: 'stock_soir_bovins', type: 'number', isOptional: true },
        { name: 'nombre_bovin_vendu_calcule', type: 'number', isOptional: true },
        { name: 'nombre_bovin_present_marche', type: 'number', isOptional: true },
        { name: 'nombre_tete_bovins_vendu', type: 'number', isOptional: true },
        { name: 'taureaux_4_8_ans_vendus', type: 'number', isOptional: true },
        { name: 'taurillons_2_3_ans_vendus', type: 'number', isOptional: true },
        { name: 'vaches_4_10_ans_vendus', type: 'number', isOptional: true },
        { name: 'genisses_2_3_ans_vendus', type: 'number', isOptional: true },
        { name: 'veaux_velles_0_12_mois', type: 'number', isOptional: true },
        { name: 'destination_bovins_vendus', type: 'string', isOptional: true },
        { name: 'origine_bovins_debarques', type: 'string', isOptional: true },

        { name: 'stock_initial_ovins', type: 'number', isOptional: true },
        { name: 'nombre_ovins_debarques', type: 'number', isOptional: true },
        { name: 'stock_soir_ovins', type: 'number', isOptional: true },
        { name: 'nombre_ovins_presentes_marche', type: 'number', isOptional: true },
        { name: 'nombre_ovins_vendus', type: 'number', isOptional: true },
        { name: 'ovins_males_femelles_0_12_vendus', type: 'number', isOptional: true },
        { name: 'ovins_males_femelles_plus_1_vendus', type: 'number', isOptional: true },
        { name: 'destination_ovins_vendus', type: 'string', isOptional: true },
        { name: 'origine_ovins_debarques', type: 'string', isOptional: true },

        { name: 'stock_initial_caprins', type: 'number', isOptional: true },
        { name: 'nombre_caprins_debarques', type: 'number', isOptional: true },
        { name: 'stock_soir_caprins', type: 'number', isOptional: true },
        { name: 'nombre_caprins_presentes_marche', type: 'number', isOptional: true },
        { name: 'nombre_caprins_vendus', type: 'number', isOptional: true },
        { name: 'caprins_males_femelles_0_12_ans', type: 'number', isOptional: true },
        { name: 'caprins_males_femelles_plus_1_ans', type: 'number', isOptional: true },
        { name: 'destination_caprins_vendus', type: 'string', isOptional: true },
        { name: 'origine_caprins_debarques', type: 'string', isOptional: true }
      ]
    }),

    
 // Table pour les formulaires spécifiques au type de marché Collecte
 tableSchema({
  name: 'formulaire_collecte',
  columns: [
    { name: 'unite', type: 'number' },
        { name: 'poids_unitaire', type: 'number' },
        { name: 'montant_achat', type: 'number' },
        { name: 'prix_fg_kg', type: 'number' },
        { name: 'etat_route', type: 'string' },
        { name: 'quantite_collecte', type: 'number' },
        { name: 'niveau_approvisionement', type: 'string' },
        { name: 'statut', type: 'boolean' },
        { name: 'observation', type: 'string' },
        { name: 'enquete', type: 'number' },
        { name: 'produit', type: 'string' },
        { name: 'destination_finale', type: 'number' },
        { name: 'fiche_id', type: 'string' } // Relation avec la table fiches
  ]
}),

// Table pour les formulaires spécifiques au type de marché Grossiste
tableSchema({
  name: 'formulaire_grossiste',
  columns: [
    { name: 'unite_stock', type: 'number' },
    { name: 'stock_anterieur', type: 'number' },
    { name: 'poids_moyen_unite_stock', type: 'number' },
    { name: 'poids_stock', type: 'number' },
    { name: 'stock_du_jour', type: 'number' },
    { name: 'quantite_entree', type: 'number' },
    { name: 'fournisseur_principaux', type: 'number' },
    { name: 'provenance_produit', type: 'string' },
    { name: 'date_peremption', type: 'string' },
    { name: 'fiche_id', type: 'string' } // Relation avec la table fiches
  ]
})
// Ajout des autres formulaires pour les autres types de marché ici...
]
});

// Explication:
// - Chaque marché a un `type_marche`, qui est une relation vers le type de marché.
// - Les fiches sont liées à un marché via `marche` et sont indirectement liées au `type_marche`.
// - Selon le type de marché (Collecte, Grossiste, etc.), la fiche utilisera un formulaire spécifique pour enregistrer les données.
// - Chaque formulaire est une table séparée (par exemple, `formulaire_collecte` pour le type "Collecte").
