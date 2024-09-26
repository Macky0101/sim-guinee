// models/FormulaireCollecte.js
import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

export default class FormulaireCollecte extends Model {
    static table = 'formulaire_collecte';

    @field('unite') unite;
    @field('poids_unitaire') poidsUnitaire;
    @field('montant_achat') montantAchat;
    @field('prix_fg_kg') prixFgKg;
    @field('etat_route') etatRoute;
    @field('quantite_collecte') quantiteCollecte;
    @field('niveau_approvisionement') niveauApprovisionement;
    @field('statut') statut;
    @field('observation') observation;
    @field('enquete') enquete;
    @field('produit') produit;
    @field('destination_finale') destinationFinale;
    @field('fiche_id') ficheId; // Champ de relation

    // Relation avec Fiche
    @relation('fiches', 'fiche_id') fiche;
}
