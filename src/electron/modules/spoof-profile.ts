import { MenuItem, Menu } from 'electron';
import { WebSocketModule } from '../api';
import { connection } from '../core';
import { LOLChatIcon, LOLChatRank } from '../models';


export class SpoofProfileModule extends WebSocketModule {
  id = 'SpoofProfile';
  selectedAvailability = null;

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
    const rankEntries = Object.entries(this.ranks);
    rankEntries.forEach((rank, rankIndex) => {
      let division = rank[0];
      const tierSubmenu = new Menu();
      // Loop queues
      rank[1].forEach(tier => {
        const modeSubmenu = new Menu();
        this.queues.forEach(queue => {
          const queueType = queue.value;
          const queueName = queue.name;
          // No divisions for top 3 tiers
          if (rankIndex > rankEntries.length - 4) {
            division = '';
          }
          // Append menu item
          modeSubmenu.append(new MenuItem({
            label: queueName,
            click: async() => this.spoofRank(queueType, tier, division)
          }));
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

    /* Spoof Profile Icon */
    const icons = {
      'Unreleased': [
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
      'Misc': [
        {
          name: 'Placeholder Icon',
          value: 501
        }, {
          name: 'No Icon',
          value: 29
        }
      ]
    };

    const iconSubmenu = new Menu();
    const iconEntries = Object.entries(icons);
    iconEntries.forEach(iconCategory => {
      const iconCategorySubmenu = new Menu();
      const iconCategoryName = iconCategory[0];
      const iconCategoryIcons = iconCategory[1];

      // Loop icons in category
      iconCategoryIcons.forEach(icon => {
        iconCategorySubmenu.append(new MenuItem({
          label: icon['name'],
          click: async() => this.spoofIcon(icon['value'])
        }));
      });

      // Append category
      iconSubmenu.append(new MenuItem({
        label: iconCategoryName,
        submenu: iconCategorySubmenu
      }));
    });

    /* Spoof Profile Icon */
    const availabilitiesSubmenu = new Menu();
    const availabilities = [
      { 'value': 'away', 'display': 'Away' },
      // {'value':'dnd', 'display': 'In Game'}, // Doesn't work with availability alone
      { 'value': 'chat', 'display': 'Online' },
      { 'value': 'offline', 'display': 'Offline' },
      { 'value': 'mobile', 'display': 'Mobile' }
    ];
    this.selectedAvailability = this.storage.get('availability', availabilities[1]);
    this.spoofAvailability(this.selectedAvailability['value']);

    availabilities.forEach(availability => {
      availabilitiesSubmenu.append(new MenuItem({
        label: availability['display'],
        type: 'radio',
        checked: this.selectedAvailability == availability ? true : false,
        click: async() => {
          this.storage.set('availability', availability);
          await this.spoofAvailability(availability['value']);
        }
      }));
    });

    /* Append submenus to main menu item */
    submenu.append(new MenuItem({
      label: 'Chat Availability',
      submenu: availabilitiesSubmenu
    }));

    submenu.append(new MenuItem({
      label: 'Chat Icon',
      submenu: iconSubmenu
    }));

    submenu.append(new MenuItem({
      label: 'Chat Rank',
      submenu: rankSubmenu
    }));

    return this.updateMenu(menuItem);
  }

  async refresh(): Promise<void> {
    //
  }

  async spoofAvailability(availability: string): Promise<void> {
    const availityBody = { 'availability': availability };

    await connection.changeAvailability(availityBody);
  }

  async spoofRank(queueType: string, division: string, tier: string): Promise<void> {
    // Flip tier/division values for tiers without divisions
    if (!tier) {
      const temp = tier;
      tier = division;
      division = temp;
    }

    const rankBody: LOLChatRank = {
      lol: {
        rankedLeagueDivision: division.toUpperCase(),
        rankedLeagueTier: tier.toUpperCase(),
        rankedLeagueQueue: queueType
      }
    };

    await connection.updateChatMeRank(rankBody);
  }

  async spoofIcon(iconId: number): Promise<void> {
    const iconBody = new LOLChatIcon({ icon: iconId });

    await connection.changeIcon(iconBody);
  }
}
