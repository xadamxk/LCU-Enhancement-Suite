import { Model } from '../api';

export class LOLLobbyV2Lobby extends Model {
  canStartActivity: boolean;
  gameConfig: GameConfig;
  invitations: any[];
  localMember: LocalMember;
  members: Member[];
  mucJwtDto: MucJwtDto;
  multiUserChatId: string;
  multiUserChatPassword: string;
  partyId: string;
  partyType: string;
  restrictions: any;
  scarcePositions: any[];
  warnings: any;
}

export interface GameConfig {
  allowablePremadeSizes: any[]
  customLobbyName: string
  customMutatorName: string
  customRewardsDisabledReasons: any[]
  customSpectatorPolicy: string
  customSpectators: any[]
  customTeam100: CustomTeam[]
  customTeam200: CustomTeam[]
  gameMode: string
  isCustom: boolean
  isLobbyFull: boolean
  isTeamBuilderManaged: boolean
  mapId: number
  maxHumanPlayers: number
  maxLobbySize: number
  maxTeamSize: number
  pickType: string
  premadeSizeAllowed: boolean
  queueId: number
  shouldForceScarcePositionSelection: boolean
  showPositionSelector: boolean
  showQuickPlaySlotSelection: boolean
}

export interface CustomTeam {
  allowedChangeActivity: boolean
  allowedInviteOthers: boolean
  allowedKickOthers: boolean
  allowedStartActivity: boolean
  allowedToggleInvite: boolean
  autoFillEligible: boolean
  autoFillProtectedForPromos: boolean
  autoFillProtectedForSoloing: boolean
  autoFillProtectedForStreaking: boolean
  botChampionId: number
  botDifficulty: string
  botId: string
  firstPositionPreference: string
  intraSubteamPosition: any
  isBot: boolean
  isLeader: boolean
  isSpectator: boolean
  playerSlots: any[]
  puuid: string
  quickplayPlayerState: any
  ready: boolean
  secondPositionPreference: string
  showGhostedBanner: boolean
  subteamIndex: any
  summonerIconId: number
  summonerId: number
  summonerInternalName: string
  summonerLevel: number
  summonerName: string
  teamId: number
  tftNPEQueueBypass: any
}

export interface LocalMember {
  allowedChangeActivity: boolean
  allowedInviteOthers: boolean
  allowedKickOthers: boolean
  allowedStartActivity: boolean
  allowedToggleInvite: boolean
  autoFillEligible: boolean
  autoFillProtectedForPromos: boolean
  autoFillProtectedForSoloing: boolean
  autoFillProtectedForStreaking: boolean
  botChampionId: number
  botDifficulty: string
  botId: string
  firstPositionPreference: string
  intraSubteamPosition: any
  isBot: boolean
  isLeader: boolean
  isSpectator: boolean
  playerSlots: any[]
  puuid: string
  quickplayPlayerState: any
  ready: boolean
  secondPositionPreference: string
  showGhostedBanner: boolean
  subteamIndex: any
  summonerIconId: number
  summonerId: number
  summonerInternalName: string
  summonerLevel: number
  summonerName: string
  teamId: number
  tftNPEQueueBypass: any
}

export interface Member {
  allowedChangeActivity: boolean
  allowedInviteOthers: boolean
  allowedKickOthers: boolean
  allowedStartActivity: boolean
  allowedToggleInvite: boolean
  autoFillEligible: boolean
  autoFillProtectedForPromos: boolean
  autoFillProtectedForSoloing: boolean
  autoFillProtectedForStreaking: boolean
  botChampionId: number
  botDifficulty: string
  botId: string
  firstPositionPreference: string
  intraSubteamPosition: any
  isBot: boolean
  isLeader: boolean
  isSpectator: boolean
  playerSlots: any[]
  puuid: string
  quickplayPlayerState: any
  ready: boolean
  secondPositionPreference: string
  showGhostedBanner: boolean
  subteamIndex: any
  summonerIconId: number
  summonerId: number
  summonerInternalName: string
  summonerLevel: number
  summonerName: string
  teamId: number
  tftNPEQueueBypass: any
}

export interface MucJwtDto {
  channelClaim: string
  domain: string
  jwt: string
  targetRegion: string
}
