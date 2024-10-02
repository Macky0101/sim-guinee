// models/FormulaireDebarcadere.js
import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

export default class FormulaireDebarcadere extends Model {
    static table = 'formulaire_debarcaderes';

    @field('date_enquete') date_enquete;
    @field('collecteur') collecteur;
    @field('volume_poissons_peches') volume_poissons_peches;
    @field('prix_moyen_semaine_grossiste') prix_moyen_semaine_grossiste;
    @field('prix_moyen_semaine_detaillant') prix_moyen_semaine_detaillant;
    @field('niveau_disponibilite') niveau_disponibilite;
    @field('observation') observation;
    @field('enquete') enquete;
    @field('principale_espece_peche') principale_espece_peche;
    @field('fiche_id') ficheId; // Champ de relation

    // Relation avec Fiche
    @relation('fiches', 'fiche_id') fiche;
}
