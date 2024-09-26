// models/FormulaireGrossiste.js
import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

export default class FormulaireGrossiste extends Model {
    static table = 'formulaire_grossiste';

    @field('unite_stock') uniteStock;
    @field('stock_anterieur') stockAnterieur;
    @field('poids_moyen_unite_stock') poidsMoyenUniteStock;
    @field('poids_stock') poidsStock;
    @field('stock_du_jour') stockDuJour;
    @field('quantite_entree') quantiteEntree;
    @field('fournisseur_principaux') fournisseurPrincipaux;
    @field('provenance_produit') provenanceProduit;
    @field('date_peremption') datePeremption;
    @field('fiche_id') ficheId; // Champ de relation

    // Relation avec Fiche
    @relation('fiches', 'fiche_id') fiche;
}
