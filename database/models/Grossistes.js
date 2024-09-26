import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class Grossistes extends Model {
  static table = 'grossistes';

  @field('unite_stock') uniteStock;
  @field('poids_moyen_unite_stock') poidsMoyenUniteStock;
  @field('poids_stock') poidsStock;
  @field('unite_achat') uniteAchat;
  @field('nombre_unite_achat') nombreUniteAchat;
  @field('poids_moyen_unite_achat') poidsMoyenUniteAchat;
  @field('poids_total_achat') poidsTotalAchat;
  @field('localite_achat') localiteAchat;
  @field('fournisseur_achat') fournisseurAchat;
  @field('unite_vente') uniteVente;
  @field('nombre_unite_vente') nombreUniteVente;
  @field('poids_moyen_unite_vente') poidsMoyenUniteVente;
  @field('poids_total_unite_vente') poidsTotalUniteVente;
  @field('prix_unitaire_vente') prixUnitaireVente;
  @field('client_vente') clientVente;
  @field('client_principal') clientPrincipal;
  @field('fournisseur_principal') fournisseurPrincipal;
  @field('niveau_approvisionement') niveauApprovisionement;
  @field('statut') statut;
  @field('observation') observation;
  @field('enquete') enquete;
  @field('produit') produit;
  @field('localite_origine') localiteOrigine;
  @field('num_fiche') numFiche;
}
