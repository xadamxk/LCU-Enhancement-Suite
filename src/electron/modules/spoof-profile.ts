import { MenuItem, Menu, dialog } from 'electron';
import { LeagueEvent } from '../../connector';
import { WebSocketModule } from '../api';
// import { connection } from '../core';
// import { Endpoints } from '../enums';
// import {  } from '../models';
// import {  } from '../subscriptions';


export class SpoofProfileModule extends WebSocketModule {
  id = 'SpoofProfile';
  // Spoof Rank
  tiers = [
    'IV',
    'III',
    'II',
    'I'];
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
    /* Spoof Chat Rank */
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
          const queueName = queue.name;
          // SR
          if (queueType == this.queues[0].value) {
            modeSubmenu.append(new MenuItem({
              label: queueName,
              click: async() => this.spoofSRRank(queueType, tier, division)
            }));
          } else {
          // TFT
            modeSubmenu.append(new MenuItem({
              label: queueName,
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

    submenu.append(new MenuItem({
      label: 'Chat Rank',
      submenu: rankSubmenu
    }));

    /* Spoof Profile Icon */
    const icons = {
      'Unreleased':[
        {
          name: 'Eternal Reign',
          value: 3504
        },
        {
          name: 'Reign of Order',
          value: 1669
        }
      ],
      'Ranked': [
        {
          name: 'Grand Master Beta Tester',
          value: 534
        }
      ],
      'Server Limited': [
        {
          name: 'Beta Tester (LA)',
          value: 553
        },
        {
          name: 'Tencent Gangplank (SEA)',
          value: 69
        },
        {
          name: 'Tencent Garen (SEA)',
          value: 66
        },
        {
          name: 'Tencent Caitlyn (SEA)',
          value: 71
        },
        {
          name: '5th Anniversary Poro (TR)',
          value: 3218
        }
      ],
      'Unobtainable': [
        {
          name: 'Page Purchaser (Runes)',
          value: 3181
        },
        {
          name: 'Rare Page Owner (Runes)',
          value: 3162
        },
        {
          name: 'Golden Spatula',
          value: 786
        },
        {
          name: 'Positive Play (Honor)',
          value: 774
        }
      ],
      'Misc':[
        {
          name: 'Placeholder Icon',
          value: 501
        }, {
          name: 'No Icon',
          value: 29
        }
      ]
    };

    submenu.append(new MenuItem({
      label: 'Profile Icon',
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