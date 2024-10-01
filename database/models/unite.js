import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

class Unite extends Model {
  static table = 'unites';

  @field('id_unite') id_unite;
  @field('type_marche') type_marche;
  @field('unite_mesure') unite_mesure;  // ID de l'unité mesurée
  @field('unite_relation_id') unite_relation_id;  // ID de l'unité mesurée
  @relation('unite_relations', 'unite_relation_id') unite_relation;  // Relation avec la table UniteRelation
}

export default Unite;
