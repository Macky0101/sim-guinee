// models/FormulaireJournalier.js
import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

export default class FormulaireJournalier extends Model {
    static table = 'formulaire_journalier';

    @field('unite')unite;
    @field('poids_unitaire')poids_unitaire;
    @field('prix_mesure')prix_mesure;
    @field('prix_kg_litre')prix_kg_litre;
    @field('niveau_approvisionement')niveau_approvisionement;
    @field('statut')statut;
    @field('observation')observation;
    @field('enquete')enquete;
    @field('produit')produit;
    @field('fiche_id') fiche_id; // Champ de relation

    // Relation avec Fiche
    @relation('fiches', 'fiche_id') fiche;
}

