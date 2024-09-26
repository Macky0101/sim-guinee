// models/TypeMarche.js
import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

export default class TypeMarche extends Model {
    static table = 'types_marche';

    @field('id_type_marche') id_type_marche;
    @field('code_type_marche') code_type_marche;
    @field('nom_type_marche') nom_type_marche;
    @field('description') description;
    @field('nbre_marche') nbre_marche;
    


    // Relation avec les marchés
    @relation('marches', 'type_marche') marches;
}