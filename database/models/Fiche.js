// models/Fiche.js
import { Model } from '@nozbe/watermelondb';
import { field, relation, writer} from '@nozbe/watermelondb/decorators';

export default class Fiche extends Model {
    static table = 'fiches';

    @field('num_fiche') num_fiche;
    @field('date_enquete') date_enquete;
    @field('marche') marche; // Champ de relation
    @field('collecteur') collecteur;
    @field('external_id') external_id;
    @field('id') id;
    @field('id_type_marche') id_type_marche; // Champ de relation
    @field('source') source; // Champ pour indiquer la source des données
    // Champs supplémentaires pour différents types de marché
    // Grossiste
    @field('numero_point_collecte') numero_point_collecte;
    @field('nom_personne_enquete') nom_personne_enquete;
    @field('contact_personne_enquete') contact_personne_enquete;

    // Débarcadère
    @field('type_embarcation') type_embarcation;
    @field('espece_presente') espece_presente;
    @field('difficultes_rencontrees') difficultes_rencontrees;
    @field('nbr_barques_rentres_jour') nbr_barques_rentres_jour;
    @field('heure_fin_collecte_semaine') heure_fin_collecte_semaine;

    // Bétail
    @field('stock_initial_bovins') stock_initial_bovins;
    @field('nbr_bovins_debarques') nbr_bovins_debarques;
    @field('stock_soir_bovins') stock_soir_bovins;
    @field('nombre_bovin_vendu_calcule') nombre_bovin_vendu_calcule;
    @field('nombre_bovin_present_marche') nombre_bovin_present_marche;
    @field('nombre_tete_bovins_vendu') nombre_tete_bovins_vendu;
    @field('taureaux_4_8_ans_vendus') taureaux_4_8_ans_vendus;
    @field('taurillons_2_3_ans_vendus') taurillons_2_3_ans_vendus;
    @field('vaches_4_10_ans_vendus') vaches_4_10_ans_vendus;
    @field('genisses_2_3_ans_vendus') genisses_2_3_ans_vendus;
    @field('veaux_velles_0_12_mois') veaux_velles_0_12_mois;
    @field('destination_bovins_vendus') destination_bovins_vendus;
    @field('origine_bovins_debarques') origine_bovins_debarques;

    // Ovins
    @field('stock_initial_ovins') stock_initial_ovins;
    @field('nombre_ovins_debarques') nombre_ovins_debarques;
    @field('stock_soir_ovins') stock_soir_ovins;
    @field('nombre_ovins_presentes_marche') nombre_ovins_presentes_marche;
    @field('nombre_ovins_vendus') nombre_ovins_vendus;
    @field('ovins_males_femelles_0_12_vendus') ovins_males_femelles_0_12_vendus;
    @field('ovins_males_femelles_plus_1_vendus') ovins_males_femelles_plus_1_vendus;
    @field('destination_ovins_vendus') destination_ovins_vendus;
    @field('origine_ovins_debarques') origine_ovins_debarques;

    // Caprins
    @field('stock_initial_caprins') stock_initial_caprins;
    @field('nombre_caprins_debarques') nombre_caprins_debarques;
    @field('stock_soir_caprins') stock_soir_caprins;
    @field('nombre_caprins_presentes_marche') nombre_caprins_presentes_marche;
    @field('nombre_caprins_vendus') nombre_caprins_vendus;
    @field('caprins_males_femelles_0_12_ans') caprins_males_femelles_0_12_ans;
    @field('caprins_males_femelles_plus_1_ans') caprins_males_femelles_plus_1_ans;
    @field('destination_caprins_vendus') destination_caprins_vendus;
    @field('origine_caprins_debarques') origine_caprins_debarques;

    // Relation avec Marche
    @relation('marches', 'marche') marches;

    // Relation avec TypeMarche
    @relation('types_marche', 'id_type_marche') types_marche;

    // Relation avec FormulaireCollecte
    @relation('formulaire_collecte', 'fiche_id') formulaire_collecte;

    // Relation avec FormulaireGrossiste
    @relation('formulaire_grossiste', 'fiche_id') formulaire_grossiste;

    // // Relation avec Produits
    // @relation('produits', 'fiche_id') produits;
  
  // Méthode pour marquer les données comme locales ou provenant de l'API
  @writer async markAsLocal() {
    await this.update(record => {
      record.source = 'local';
    });
  }

  @writer async markAsApi() {
    await this.update(record => {
      record.source = 'api';
    });
  }
      
};
