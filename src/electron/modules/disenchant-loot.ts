import { dialog, Menu, MenuItem, MessageBoxOptions } from 'electron';
import { Module } from '../api';
import { connection } from '../core';
import { LootCategories, LootItemStatus, LootTypes } from '../enums';
import { PlayerLoot } from '../models';

export class DisenchantLootModule extends Module {
  id = 'DisenchantLoot';

  async register(): Promise<void> {
    const submenu = new Menu();

    const menuItem = new MenuItem({
      label: 'Disenchant Loot',
      submenu: submenu
    });

    submenu.append(new MenuItem({
      label: 'Champion Capsules',
      click: async() => this.disenchantChampionCapsules()
    }));

    submenu.append(new MenuItem({
      label: 'Champion Shards',
      click: async() => this.disenchantChampionShards()
    }));

    submenu.append(new MenuItem({
      label: 'Open Chests',
      click: async() => this.openChests()
    }));

    submenu.append(new MenuItem({
      label: 'Eternals Set Shards',
      click: async() => this.disenchantEternalShards()
    }));

    submenu.append(new MenuItem({
      label: 'Key Fragments',
      click: async() => this.disenchantKeyFragments()
    }));

    submenu.append(new MenuItem({
      label: 'Summoner Icons',
      click: async() => this.disenchantIconShards()
    }));

    submenu.append(new MenuItem({
      label: 'Skin Shards',
      click: async() => this.disenchantSkinShards()
    }));

    submenu.append(new MenuItem({
      label: 'Ward Skin Shards',
      click: async() => this.disenchantWardSkinShards()
    }));

    return this.updateMenu(menuItem);
  }

  private async openChests(): Promise<void> {
    const allLoot = await this.getLoot();
    const chestLoot = Object.entries(allLoot).filter(([lootKey]) => {
      return lootKey == 'CHEST_champion_mastery';
    });
    const keyLoot = Object.entries(allLoot).filter(([lootKey]) => {
      return lootKey == 'MATERIAL_key';
    });
    if (chestLoot.length < 1) {
      await this.showInsufficientResourcesDialogue('Open Chest', 'Chests');
    } else if (keyLoot.length < 1) {
      await this.showInsufficientResourcesDialogue('Open Chest', 'Keys');
    } else {
      const disenchantResponse = await connection.forgeLoot('CHEST_champion_mastery_OPEN', ['CHEST_champion_mastery', 'MATERIAL_key'], chestLoot.length);
      console.log(disenchantResponse);
      return disenchantResponse.json();
    }
  }

  private async disenchantKeyFragments(): Promise<void> {
    const keyFragmentsPerKey = 3;
    const allLoot = await this.getLoot();
    const keyFragmentLoot = Object.entries(allLoot).filter(([lootKey]) => {
      return lootKey == 'MATERIAL_key_fragment';
    });
    if (keyFragmentLoot.length > 0 &&
      keyFragmentLoot[0].length > 0 &&
      // eslint-disable-next-line no-prototype-builtins
      keyFragmentLoot[0][1].hasOwnProperty('count')) {
      const keyFragmentCount = keyFragmentLoot[0][1]['count'];
      if (keyFragmentCount < keyFragmentsPerKey) {
        // Not enough key fragments
        await this.showInsufficientResourcesDialogue('Key', 'Key Fragments');
      }
      const totalKeys = Math.floor(keyFragmentCount/keyFragmentsPerKey);

      const disenchantResponse = await connection.forgeLoot('MATERIAL_key_fragment_forge', ['MATERIAL_key_fragment'], totalKeys);
      console.log(disenchantResponse);
      return disenchantResponse.json();
    } else {
      // key fragment loot object doesn't exist
      // Not sure if this is actually possible but oh well
      await this.showInsufficientResourcesDialogue('Key', 'Key Fragments');
    }
  }

  private async disenchantChampionCapsules(): Promise<void> {
    const recipeName = 'CHEST_128_OPEN';
    const lootCategoryFilter = LootCategories.CHAMPION_CAPSULE;
    const lootType = LootTypes.LOOT_ID;
    const prettyCategory = 'Chest(s)';
    const allLoot = await this.getLoot();

    const filteredLoot = Object.values(allLoot).filter((lootItem) => {
      return lootItem[lootType] === lootCategoryFilter;
    });

    if (filteredLoot.length > 0) {
      const chestCount = filteredLoot[0]['count'];
      const disenchantResponse = await connection.forgeLoot(recipeName, [lootCategoryFilter], chestCount);
      console.log(disenchantResponse);
      return disenchantResponse.json();
    } else {
      await this.showNoResourcesDialogue(prettyCategory);
    }
  }

  private async disenchantChampionShards(): Promise<void> {
    return this.disenchantShards(LootCategories.CHAMPION, LootTypes.DISPLAY_CATEGORIES);
  }

  private async disenchantSkinShards(): Promise<void> {
    return this.disenchantShards(LootCategories.SKIN, LootTypes.DISPLAY_CATEGORIES);
  }

  private async disenchantWardSkinShards(): Promise<void> {
    return this.disenchantShards(LootCategories.WARD_SKIN, LootTypes.DISPLAY_CATEGORIES);
  }

  private async disenchantEternalShards(): Promise<void> {
    // TODO: Needs custom logic due to Eternals having unique keys
    // STATSTONE_SHARD_66600016 (type:STATSTONE_SHARD)
    // Recipe: STATSTONE_SHARD_DISENCHANT, STATSTONE_SHARD_UPGRADE
    // "redeemableStatus": "ALREADY_OWNED",
    // return this.disenchantShards(LootCategories.ETERNALS, LootTypes.DISPLAY_CATEGORIES);
  }

  private async disenchantIconShards(): Promise<void> {
    return this.disenchantShards(LootCategories.SUMMONER_ICON, LootTypes.DISPLAY_CATEGORIES);
  }

  private async disenchantShards(lootCategoryFilter: LootCategories, lootType: LootTypes): Promise<void> {
    const prettyCategory = lootCategoryFilter.toLowerCase().replace('_', ' ');
    const allLoot = await this.getLoot();

    const allCategoryLoot = Object.values(allLoot).filter((lootItem) => {
      return lootItem[lootType] === lootCategoryFilter;
    });

    if (allCategoryLoot.length > 0) { // resources found for the selected category
      const ownedCategoryLoot = Object.values(allLoot).filter((lootItem) => {
        return lootItem.displayCategories === lootCategoryFilter
          && lootItem.itemStatus === LootItemStatus.OWNED;
      });

      // TODO: Debug why focus doesn't default to cancel
      const promptOptions: MessageBoxOptions = {
        type: 'question',
        buttons: [
          `&All: ${allCategoryLoot.length} ${prettyCategory} shards (${this.totalDisenchantValue(allCategoryLoot)} essence)`,
          `&Owned: ${ownedCategoryLoot.length} ${prettyCategory} shards (${this.totalDisenchantValue(ownedCategoryLoot)} essence)`,
          'Cancel'
        ],
        defaultId: 2, // Cancel
        cancelId: 2, // Cancel
        message: `What ${prettyCategory} shards would you like to disenchant?`,
        detail: 'Select the checkbox below to confirm this action:',
        checkboxChecked: false,
        checkboxLabel: 'REQUIRED: I understand that this process is PERMANENT and can NOT be reverted.'
      };

      const promptResponse = await dialog.showMessageBox(null, promptOptions);

      if (promptResponse.checkboxChecked) {
        switch (promptResponse['response']) {
          case 0: // All
            this.disenchantLootItems(allCategoryLoot);
            break;
          case 1: // Owned
            this.disenchantLootItems(ownedCategoryLoot);
            break;
          default:
            break;
        }
      }
    } else { // no resources found for the selected category
      await this.showNoResourcesDialogue(prettyCategory);
    }
  }

  private async getLoot(): Promise<PlayerLoot[]> {
    const lootResponse = await connection.getLoot();
    return lootResponse.json(); // TODO: error handling for non-200 response codes
  }

  private totalDisenchantValue(loot: PlayerLoot[]): number {
    return loot.reduce((total: number, lootItem: PlayerLoot) => {
      return total + lootItem.disenchantValue;
    }, 0);
  }

  private disenchantLootItems(loot: PlayerLoot[]): Promise<void>[] {
    return loot.map((lootItem): Promise<void> => {
      return this.disenchantLootItem(lootItem.lootId, lootItem.type, lootItem.count);
    });
  }

  private async disenchantLootItem(lootId: string, lootType: string, repeatCount: number): Promise<void> {
    const disenchantResponse = await connection.disenchantLoot(lootId, lootType, repeatCount);
    console.log(disenchantResponse);
    return disenchantResponse.json(); // TODO: error handling for non-200 response codes
  }

  private async showNoResourcesDialogue(prettyCategory: string): Promise<void> {
    await dialog.showMessageBox(null, {
      title: `No ${prettyCategory} shards found.`,
      message: `It doesn't look like you have any ${prettyCategory} shards.\nCome back later when you do.`
    });
  }

  private async showInsufficientResourcesDialogue(recipeOutput: string, componentName: string): Promise<void> {
    await dialog.showMessageBox(null, {
      title: `Failed to craft ${recipeOutput}`,
      message: `It doesn't look like you have enough ${componentName}.\nCome back later when you do.`
    });
  }
}
