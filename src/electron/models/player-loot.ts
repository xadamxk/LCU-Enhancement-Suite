import { Model } from '../api';
import { LootCategories, LootItemStatus, LootRedeemableStatus } from '../enums';

export class PlayerLoot extends Model {
  asset: string;
  count: number;
  disenchantLootName: string;
  disenchantValue: number;
  displayCategories: LootCategories;
  expiryTime: number;
  isNew: boolean;
  isRental: boolean;
  itemDesc: string;
  itemStatus: LootItemStatus;
  localizedDescription: string;
  localizedName: string;
  localizedRecipeSubtitle: string;
  localizedRecipeTitle: string;
  lootId: string;
  lootName: string;
  parentItemStatus: LootItemStatus;
  parentStoreItemId: number;
  rarity: string;
  redeemableStatus: LootRedeemableStatus;
  refId: string;
  rentalGames: number;
  rentalSeconds: number;
  shadowPath: string;
  splashPath: string;
  storeItemId: number;
  tags: string;
  tilePath: string;
  type: string;
  upgradeEssenceName: string;
  upgradeEssenceValue: number;
  upgradeLootName: string;
  value: number;
}
