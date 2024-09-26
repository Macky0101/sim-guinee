// models/Marche.js
import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

export default class Marche extends Model {
    static table = 'marches';

    @field('id_marche') id_marche;
    @field('code_marche') code_marche;
    @field('nom_marche') nom_marche;
    @field('type_marche') type_marche; // Champ de relation
    @field('contact_collecteur') contact_collecteur;
    @field('nom_type_marche') nom_type_marche;
    @field('nom_collecteur') nom_collecteur;
    @field('id_collecteur') id_collecteur;
    @field('localite') localite;
    @field('nom_region') nom_region;
    @field('nom_prefecture') nom_prefecture;
    @field('longitude') longitude;
    @field('latitude') latitude;
    @field('nbre_fiche') nbre_fiche;

    // Relation avec TypeMarche
    @relation('types_marche', 'type_marche') typeMarche;

    // Relation avec Fiches
    @relation('fiches', 'marche') fiches;
}
