import { MenuItem, Menu, dialog } from 'electron';
import { LeagueEvent } from '../../connector';
import { WebSocketModule } from '../api';
import { connection } from '../core';
import { Endpoints } from '../enums';
import {  } from '../models';
import {  } from '../subscriptions';

const fs = require('fs');

export class SpoofProfileModule extends WebSocketModule {
  id = 'SpoofProfile';
  tiers = [
    'I',
    'II',
    'III',
    'IV'];
  ranks = {
    'Iron': this.tiers,
    'Bronze': this.tiers,
    'Silver': this.tiers,
    'Gold': this.tiers,
    'Platinum': this.tiers,
    'Diamond': this.tiers,
    'Master': ['Master'],
    'Grandmaster': ['Grandmaster'],
    'Challenger': ['Challenger']
  };
  queues = [
    {
      key: 'SR',
      name: 'Summoners Rift',
      value: 'RANKED_SOLO_5x5'
    },
    {
      key: 'TFT',
      name: 'Team Fight Tactics',
      value: 'RANKED_TFT'
    }
  ];

  async register(): Promise<void> {
    // Sub Menu
    const submenu = new Menu();
    const rankSubmenu = new Menu();
    const menuItem = new MenuItem({
      label: 'Spoof Profile',
      submenu: submenu
    });

    // Append divisions to rank
    Object.entries(this.ranks).forEach(rank => {
      const division = rank[0];
      const tierSubmenu = new Menu();
      // Loop queues
      rank[1].forEach(tier => {
        const modeSubmenu = new Menu();
        this.queues.forEach(queue => {
          const queueType = queue.value;
          const queueKey = queue.key;
          // SR
          if (queueType == this.queues[0].value) {
            modeSubmenu.append(new MenuItem({
              label: queueKey,
              click: async() => this.spoofSRRank(queueType, tier, division)
            }));
          } else {
          // TFT
            modeSubmenu.append(new MenuItem({
              label: queueKey,
              click: async() => this.spoofTFTRank(queueType, tier, division)
            }));
          }
        });
        // Append mode to tier
        tierSubmenu.append(new MenuItem({
          label: tier,
          submenu: modeSubmenu
        }));
      });
      // Add entry for rank & tiers
      rankSubmenu.append(new MenuItem({
        label: rank[0],
        submenu: tierSubmenu
      }));
    });

    // Append tiers to rank
    submenu.append(new MenuItem({
      label: 'Spoof Rank',
      submenu: rankSubmenu
    }));



    return this.updateMenu(menuItem);
  }

  async refresh(event: LeagueEvent = null): Promise<void> {
    //
  }

  async spoofSRRank(queueType: string, tier: string, division: string): Promise<void> {
    console.log(`${queueType},${tier},${division}`);
  }

  async spoofTFTRank(queueType:string, tier: string, division: string): Promise<void> {
    console.log(`${queueType},${tier},${division}`);

  }
}
