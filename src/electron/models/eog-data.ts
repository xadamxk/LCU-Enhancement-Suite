import { Model } from '../api';
import { EOGTeam } from './eog-team';

export class EOGData extends Model {
  'accountId': number;
  'basePoints': number;
  'battleBoostIpEarned': number;
  'boostIpEarned': number;
  'boostXpEarned': number;
  'causedEarlySurrender': boolean;
  'championId': number;
  'coOpVsAiMinutesLeftToday': number;
  'coOpVsAiMsecsUntilReset': number;
  'completionBonusPoints': number;
  'currentLevel': number;
  'customMinutesLeftToday': number;
  'customMsecsUntilReset': number;
  'difficulty': string;
  'earlySurrenderAccomplice': boolean;
  'elo': number;
  'eloChange': number;
  'experienceEarned': number;
  'experienceTotal': number;
  'firstWinBonus': number;
  'gameEndedInEarlySurrender': boolean;
  'gameId': number;
  'gameLength': number;
  'gameMode': string;
  'gameMutators': string[];
  'gameType': string;
  'globalBoostXpEarned': number;
  'imbalancedTeamsNoPoints': boolean;
  'invalid': boolean;
  'ipEarned': number;
  'ipTotal': number;
  'leveledUp': boolean;
  'loyaltyBoostIpEarned': number;
  'loyaltyBoostXpEarned': number;
  'missionsXpEarned': number;
  'myTeamStatus': string;
  'newSpells': any[]; // TODO
  'nextLevelXp': number;
  'odinBonusIp': number;
  'partyRewardsBonusIpEarned': number;
  'pointsPenalties': any; // TODO
  'preLevelUpExperienceTotal': number;
  'preLevelUpNextLevelXp': number;
  'previousLevel': number;
  'previousXpTotal': number;
  'queueBonusEarned': number;
  'queueType': string;
  'ranked': boolean;
  'reportGameId': number;
  'rerollData': {
    'pointChangeFromChampionsOwned': number;
    'pointChangeFromGameplay': number;
    'pointsUntilNextReroll': number;
    'pointsUsed': number;
    'previousPoints': number;
    'rerollCount': number;
    'totalPoints': number;
  };
  'roomName': string;
  'roomPassword': string;
  'rpEarned': number;
  'sendStatsToTournamentProvider': boolean;
  'skinId': number;
  'skinIndex': number;
  'summonerId': number;
  'summonerName': string;
  'talentPointsGained': number;
  'teamBoost': {
    'availableSkins': any[]; // TODO
    'ipReward': number;
    'ipRewardForPurchaser': number;
    'price': number;
    'skinUnlockMode': string;
    'summonerName': string;
    'unlocked': boolean;
  };
  'teamEarlySurrendered': boolean;
  'teams': EOGTeam[];
  'timeUntilNextFirstWinBonus': number;
  'userId': number;
}
