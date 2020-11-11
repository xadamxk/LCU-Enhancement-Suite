import { Console } from 'console';
import { dialog, Dialog, Menu, MenuItem, MessageBoxOptions } from 'electron';
import { StatusCode } from '../../connector';
import { Module } from '../api';
import { connection } from '../core';
import { Endpoints, LootCategories, LootItemStatus, LootTypes } from '../enums';
import { PlayerLoot } from '../models';


export class DisenchantLootModule extends Module {
  id = 'DisenchantLoot';

  async register(): Promise<void> {
    const submenu = new Menu();

    const menuItem = new MenuItem({
      label: 'Disenchant Loot',
      sublabel: '',
      submenu: submenu
    });

    this.updateMenu(menuItem);

    submenu.append(new MenuItem({
      label: 'Champion Capsules',
      type: 'normal',
      click: async() => await this.disenchantChampionCapsules()
    }));

    submenu.append(new MenuItem({
      label: 'Champion Shards',
      type: 'normal',
      click: async() => await this.disenchantChampionShards()
    }));

    submenu.append(new MenuItem({
      label: 'Eternals Set Shards',
      type: 'normal',
      click: async() => await this.disenchantEternalShards()
    }));

    submenu.append(new MenuItem({
      label: 'Skin Shards',
      type: 'normal',
      click: async() => await this.disenchantSkinShards()
    }));

    submenu.append(new MenuItem({
      label: 'Ward Skin Shards',
      type: 'normal',
      click: async() => await this.disenchantWardSkinShards()
    }));

    menuItem.sublabel = '';
    this.updateMenu(menuItem);
  }

  private async disenchantChampionCapsules(): Promise<void>{
    return await this.disenchantChests(LootCategories.CHAMPION_CAPSULE, LootTypes.LOOT_ID);
  }

  private async disenchantChampionShards(): Promise<void>{
    return await this.disenchantShards(LootCategories.CHAMPION, LootTypes.DISPLAY_CATEGORIES);
  }

  private async disenchantSkinShards(): Promise<void> {
    return await this.disenchantShards(LootCategories.SKIN, LootTypes.DISPLAY_CATEGORIES);
  }

  private async disenchantWardSkinShards(): Promise<void> {
    return await this.disenchantShards(LootCategories.WARD_SKIN, LootTypes.DISPLAY_CATEGORIES);
  }

  private async disenchantEternalShards(): Promise<void> {
    return await this.disenchantShards(LootCategories.ETERNALS, LootTypes.DISPLAY_CATEGORIES);
  }

  private async disenchantChests(lootCategoryFilter: LootCategories, lootType: LootTypes): Promise<void> {
    const prettyCategory = lootCategoryFilter.toLowerCase().replace('_',' ');
    const allLoot = await this.getLoot();
    console.log(allLoot);

    const allCategoryLoot = Object.values(allLoot).filter((lootItem) => {
      return lootItem[lootType] === lootCategoryFilter;
    });

    if(allCategoryLoot.length > 0){
      // TODO: Find endpoint to open champion capsule/chests
    } else {
      this.showNoResourcesDialogue(prettyCategory);
    }
  }

  private async disenchantShards(lootCategoryFilter: LootCategories, lootType: LootTypes): Promise<void> {
    const prettyCategory = lootCategoryFilter.toLowerCase().replace('_',' ');
    const allLoot = await this.getLoot();
    console.log(allLoot);

    const allCategoryLoot = Object.values(allLoot).filter((lootItem) => {
      return lootItem[lootType] === lootCategoryFilter;
    });

    // If resources are found, prompt all, owned, or cancel
    // If no resources are found for the selected category, stop and alert
    if(allCategoryLoot.length > 0){
      const ownedCategoryLoot = Object.values(allLoot).filter((lootItem) => {
        return lootItem.displayCategories === lootCategoryFilter &&
            lootItem.itemStatus === LootItemStatus.OWNED;
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
      if(promptResponse.checkboxChecked){
        switch(promptResponse['response']){
          // All
          case 0:
            this.disenchantLootItems(allCategoryLoot);
            break;
          // Owned
          case 1:
            this.disenchantLootItems(ownedCategoryLoot);
            break;
          case 2: break;
        }
      }

    } else {
      this.showNoResourcesDialogue(prettyCategory);
    }
  }

  private async getLoot(): Promise<PlayerLoot[]> {
    const lootResponse = await connection.getLoot();
    // TODO: error handling for non-200 response codes
    return await lootResponse.json();
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
    // TODO: error handling for non-200 response codes
    console.log(disenchantResponse);
    return await disenchantResponse.json();
  }

  private async showNoResourcesDialogue(prettyCategory: string): Promise<void> {
    dialog.showMessageBox(null, {
      title: `No ${prettyCategory} shards found.`,
      message: `It doesn't look like you have any ${prettyCategory} shards. \nCome back later when you do.`,
    });
  }
}
