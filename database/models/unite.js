import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

class Unite extends Model {
  static table = 'unites';

  @field('id_unite') id;
  @field('type_marche') type_marche;
  @field('unite_mesure') unite_mesure;
  @relation('unite_relations', 'unite_relation_id') unite_relations;  // Relation vers UniteRelation
}

export default Unite;
