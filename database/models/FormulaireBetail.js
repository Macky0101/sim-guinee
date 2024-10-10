// models/Formulairebetail.js
import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

export default class FormulaireBetail extends Model {
    static table = 'formulaire_betail';

    @field('prix_unitaire') prix_unitaire;
    @field('etat_corporel') etat_corporel;
    @field('nombre_present_chez_vendeur') nombre_present_chez_vendeur;
    @field('provenance') provenance;
    @field('nombre_tete_par_provenance') nombre_tete_par_provenance;
    @field('nombre_vendu_par_provenance') nombre_vendu_par_provenance;
    @field('nombre_present_chez_acheteur') nombre_present_chez_acheteur;
    @field('nombre_tete_achete') nombre_tete_achete;
    @field('total_vendu_distribues') total_vendu_distribues;
    @field('enquete') enquete;
    @field('produit') produit;
    @field('fiche_id') fiche_id; // Champ de relation
    @field('NumFiche') NumFiche; 

    // Relation avec Fiche
    @relation('fiches', 'fiche_id') fiche;
}
