// models/FormulaireCollecte.js
import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

export default class FormulaireCollecte extends Model {
    static table = 'formulaire_collecte';

    @field('unite') unite;
    @field('poids_unitaire') poids_unitaire;
    @field('montant_achat') montant_achat;
    @field('prix_fg_kg') prix_fg_kg;
    @field('etat_route') etat_route;
    @field('quantite_collecte') quantite_collecte;
    @field('niveau_approvisionement') niveau_approvisionement;
    @field('statut') statut;
    @field('observation') observation;
    @field('etat') etat;
    @field('enquete') enquete;
    @field('produit') produit;
    @field('destination_finale') destination_finale;
    @field('fiche_id') fiche_id; // Champ de relation

    // Relation avec Fiche
    @relation('fiches', 'fiche_id') fiche;
}
