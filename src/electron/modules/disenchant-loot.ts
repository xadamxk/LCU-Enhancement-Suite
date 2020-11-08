import { dialog, Dialog, Menu, MenuItem, MessageBoxOptions } from 'electron';
import { StatusCode } from '../../connector';
import { WebsocketModule } from '../api';
import { connection } from '../core';
import { Endpoints, LootCategories, LootItemStatus } from '../enums';
import { PlayerLoot } from '../models';


export class DisenchantLootModule extends WebsocketModule {
  id = 'DisenchantLoot';

  async register(): Promise<void> {
    return this.refresh();
  }

  async refresh(): Promise<void> {
    const submenu = new Menu();

    const menuItem = new MenuItem({
      label: 'Disenchant Loot',
      sublabel: '',
      submenu: submenu
    });

    this.updateMenu(menuItem);

    // LOGIC HERE
    submenu.append(new MenuItem({
      label: 'Champion Shards',
      type: 'normal',
      click: async() => await this.disenchantChampionShards()
    }));

    submenu.append(new MenuItem({
      label: 'Skin Shards',
      type: 'normal',
      click: async() => await this.disenchantSkinShards()
    }));

    menuItem.sublabel = '';
    this.updateMenu(menuItem);
  }

  async disenchantChampionShards(): Promise<void>{
    return await this.disenchantItem(LootCategories.CHAMPION);
  }

  async disenchantSkinShards(): Promise<void> {
    return await this.disenchantItem(LootCategories.SKIN);
  }

  private async disenchantItem(lootCategoryFilter: LootCategories): Promise<void> {
    const prettyCategory = lootCategoryFilter.toLowerCase().replace('_',' ');
    const allLoot = await this.getLoot();

    const allCategoryLoot = Object.values(allLoot).filter((lootItem) => {
      return lootItem.displayCategories === lootCategoryFilter;
    });

    // If resources are found, prompt all, owned, or cancel
    // If no resources are found for the selected category, stop and alert
    if(allCategoryLoot.length > 0){
      const ownedCategoryLoot = Object.values(allLoot).filter((lootItem) => {
        return lootItem.displayCategories === lootCategoryFilter &&
            lootItem.itemStatus === LootItemStatus.OWNED;
      });

      const initialOptions: MessageBoxOptions = {
        type: 'question',
        buttons: [
          `&All: ${allCategoryLoot.length} ${prettyCategory} shards (${this.totalDisenchantValue(allCategoryLoot)} essence)`,
          `&Owned: ${ownedCategoryLoot.length} ${prettyCategory} shards (${this.totalDisenchantValue(ownedCategoryLoot)} essence)`,
          'Cancel'
        ],
        defaultId: 2, // Cancel
        cancelId: 2, // Cancel
        message: `What ${prettyCategory} shards would you like to disenchant?`,
        detail: 'This is PERMANANT and can NOT be undone.',
      };

      // TODO: Add 2nd prompt
      const initialConfirmation = await dialog.showMessageBox(null, initialOptions);
      switch(initialConfirmation['response']){
        case 0: console.log('ALL');
          this.disenchantLootItems(allCategoryLoot);
          break;
        case 1: console.log('OWNED');
          this.disenchantLootItems(ownedCategoryLoot);
          break;
        case 2: console.log('CANCEL');
      }

    } else {
      const noResourceFoundOptions: MessageBoxOptions = {
        title: `No ${prettyCategory} shards found.`,
        message: `It doesn't look like you have any ${prettyCategory} shards. \nCome back later when you do.`,
      };
      dialog.showMessageBox(null, noResourceFoundOptions);
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
    return loot.map((lootItem, index): Promise<void> => {
      // TODO: Remove index condition after adding double prompt
      if(index < 1){
        return this.disenchantLootItem(lootItem.lootId, lootItem.type, lootItem.count);
      }
    });
  }

  private async disenchantLootItem(lootId: string, lootType: string, repeatCount: number): Promise<void> {
    const disenchantResponse = await connection.disenchantLoot(lootId, lootType, repeatCount);
    // TODO: error handling for non-200 response codes
    console.log(disenchantResponse);
    return await disenchantResponse.json();
  }
}
