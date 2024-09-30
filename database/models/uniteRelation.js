import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

class UniteRelation extends Model {
  static table = 'unite_relations';

  @field('id_unite') id_unite;
  @field('nom_unite') nom_unite;
  @field('definition') definition;
  @field('image') image;
  @field('poids_indicatif') poids_indicatif;
  @field('created_at') createdAt;  // Date au format timestamp
}

export default UniteRelation;
