// import { MenuItem } from 'electron';
import { LeagueEvent } from '../../connector';
import { WebSocketModule } from '../api';
import { connection } from '../core';
import { EOGData } from '../models';
import { EndOfGameSubscription } from '../subscriptions';

export class EndOfGameListenerModule extends WebSocketModule {
  id = 'EndOfGameListener';

  register(): any {
    connection.addSubscription(
      new EndOfGameSubscription((event) => {
        this.refresh(event);
      })
    );
  }

  refresh(event: LeagueEvent = null): any {
    const endOfGame = new EOGData(event.data);
    console.log(`Game ID: ${endOfGame.gameId}`);
    // manipulate data
  }

  private async getVersion(): Promise<void> {
    const patch =  await connection.getCurrentVersion();
    return patch.json();
  }
  // TODO:
  // 1. Fetch current league patch (ideally from client)
  // 2. Seperate data into new object for DynamoDB (Player table, and Game table)
}
