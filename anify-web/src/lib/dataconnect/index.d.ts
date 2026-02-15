import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export enum ItemRarity {
  common = "common",
  uncommon = "uncommon",
  rare = "rare",
  epic = "epic",
  legendary = "legendary",
};

export enum ItemType {
  weapon = "weapon",
  armor = "armor",
  consumable = "consumable",
  material = "material",
  quest = "quest",
};

export enum PlanType {
  free = "free",
  subscription = "subscription",
  topup = "topup",
};

export enum TokenDirection {
  credit = "credit",
  debit = "debit",
};

export enum WeaponRarity {
  common = "common",
  rare = "rare",
  epic = "epic",
  legendary = "legendary",
};

export enum WeaponType {
  sword = "sword",
  spear = "spear",
  bow = "bow",
  staff = "staff",
  dagger = "dagger",
};



export interface AddCollaboratorData {
  worldCollaborator_upsert: WorldCollaborator_Key;
}

export interface AddCollaboratorVariables {
  worldId: string;
  userId: string;
}

export interface AddInventoryItemData {
  inventoryItem_upsert: InventoryItem_Key;
}

export interface AddInventoryItemVariables {
  itemId: string;
  quantity: number;
}

export interface AdminAddInventoryItemData {
  inventoryItem_upsert: InventoryItem_Key;
}

export interface AdminAddInventoryItemVariables {
  userId: string;
  itemId: string;
  quantity: number;
}

export interface AdminAdvanceTutorialData {
  playerTutorial_updateMany: number;
}

export interface AdminAdvanceTutorialVariables {
  userId: string;
  currentStep?: string | null;
  completedSteps: string[];
}

export interface AdminCompleteTutorialData {
  playerTutorial_updateMany: number;
}

export interface AdminCompleteTutorialVariables {
  userId: string;
}

export interface AdminConsumeTokensData {
  tokenUsageEvent_insert: TokenUsageEvent_Key;
}

export interface AdminConsumeTokensVariables {
  userId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  costUsd: number;
  meta?: string | null;
}

export interface AdminCreateTokenEventData {
  tokenUsageEvent_insert: TokenUsageEvent_Key;
}

export interface AdminCreateTokenEventVariables {
  userId: string;
  direction: TokenDirection;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  costUsd: number;
  meta?: string | null;
}

export interface AdminCreateTokenWalletData {
  tokenWallet_insert: TokenWallet_Key;
}

export interface AdminCreateTokenWalletVariables {
  userId: string;
  balanceTokens: number;
  planType: PlanType;
}

export interface AdminCreateUserAttributesData {
  userAttributes_insert: UserAttributes_Key;
}

export interface AdminCreateUserAttributesVariables {
  userId: string;
}

export interface AdminCreateUserData {
  user_insert: User_Key;
}

export interface AdminCreateUserVariables {
  id: string;
}

export interface AdminCreditTokensData {
  tokenUsageEvent_insert: TokenUsageEvent_Key;
}

export interface AdminCreditTokensVariables {
  userId: string;
  totalTokens: number;
  meta?: string | null;
}

export interface AdminGetPlayerProfileData {
  user?: {
    id: string;
    playerProfile_on_user?: {
      id: UUIDString;
      characterName: string;
      avatarId?: string | null;
      isInitialized: boolean;
      createdAt: TimestampString;
      updatedAt: TimestampString;
    } & PlayerProfile_Key;
  } & User_Key;
}

export interface AdminGetPlayerProfileVariables {
  userId: string;
}

export interface AdminGetPlayerStateSummaryData {
  user?: {
    id: string;
    playerProfile_on_user?: {
      isInitialized: boolean;
      characterName: string;
    };
      playerTutorial_on_user?: {
        isCompleted: boolean;
        currentStep?: string | null;
      };
  } & User_Key;
}

export interface AdminGetPlayerStateSummaryVariables {
  userId: string;
}

export interface AdminGetPlayerTutorialData {
  user?: {
    id: string;
    playerTutorial_on_user?: {
      id: UUIDString;
      isCompleted: boolean;
      currentStep?: string | null;
      completedSteps: string[];
      startedAt?: TimestampString | null;
      completedAt?: TimestampString | null;
      updatedAt: TimestampString;
    } & PlayerTutorial_Key;
  } & User_Key;
}

export interface AdminGetPlayerTutorialVariables {
  userId: string;
}

export interface AdminGetTokenWalletData {
  tokenWallets: ({
    id: UUIDString;
    balanceTokens: number;
    lifetimeUsedTokens: number;
    planType: PlanType;
    softLimitTokens?: number | null;
    hardLimitTokens?: number | null;
    billingPeriodStart?: TimestampString | null;
    billingPeriodEnd?: TimestampString | null;
    gameUid?: number | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    user: {
      id: string;
    } & User_Key;
  } & TokenWallet_Key)[];
}

export interface AdminGetTokenWalletVariables {
  userId: string;
}

export interface AdminInitializePlayerData {
  playerProfile_insert: PlayerProfile_Key;
}

export interface AdminInitializePlayerVariables {
  userId: string;
  characterName: string;
  avatarId?: string | null;
}

export interface AdminRemoveInventoryItemData {
  inventoryItem_deleteMany: number;
}

export interface AdminRemoveInventoryItemVariables {
  userId: string;
  itemId: string;
}

export interface AdminResetTutorialData {
  playerTutorial_updateMany: number;
}

export interface AdminResetTutorialVariables {
  userId: string;
}

export interface AdminStartTutorialData {
  playerTutorial_insert: PlayerTutorial_Key;
}

export interface AdminStartTutorialVariables {
  userId: string;
}

export interface AdminUpdatePlayerProfileData {
  playerProfile_updateMany: number;
}

export interface AdminUpdatePlayerProfileVariables {
  userId: string;
  characterName?: string | null;
  avatarId?: string | null;
}

export interface AdminUpdateTokenWalletData {
  tokenWallet_updateMany: number;
}

export interface AdminUpdateTokenWalletVariables {
  userId: string;
  balanceTokens?: number | null;
  lifetimeUsedTokens?: number | null;
  planType?: PlanType | null;
  softLimitTokens?: number | null;
  hardLimitTokens?: number | null;
  billingPeriodStart?: TimestampString | null;
  billingPeriodEnd?: TimestampString | null;
  gameUid?: number | null;
}

export interface AdminUpdateUserAttributesData {
  userAttributes_updateMany: number;
}

export interface AdminUpdateUserAttributesVariables {
  userId: string;
  hp?: number | null;
  maxHp?: number | null;
  atk?: number | null;
  def?: number | null;
  level?: number | null;
  exp?: number | null;
  gold?: number | null;
}

export interface AdvanceTutorialData {
  playerTutorial_updateMany: number;
}

export interface AdvanceTutorialVariables {
  currentStep?: string | null;
  completedSteps: string[];
}

export interface Character_Key {
  id: string;
  __typename?: 'Character_Key';
}

export interface CompleteTutorialData {
  playerTutorial_updateMany: number;
}

export interface CreateCharacterData {
  character_insert: Character_Key;
}

export interface CreateCharacterVariables {
  id: string;
  name: string;
  description?: string | null;
  portraitImage?: string | null;
  bustImage?: string | null;
  worldId: string;
}

export interface CreateItemData {
  item_insert: Item_Key;
}

export interface CreateItemVariables {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  data?: string | null;
}

export interface CreateResourceData {
  resource_insert: Resource_Key;
}

export interface CreateResourceVariables {
  id: string;
  data: string;
}

export interface CreateSceneData {
  scene_insert: Scene_Key;
}

export interface CreateSceneVariables {
  id: string;
  name: string;
  description?: string | null;
  splatUrl: string;
  wallConfig?: string | null;
  floorConfig: string;
  interactionPoints: string;
  worldId: string;
}

export interface CreateTokenWalletData {
  tokenWallet_insert: TokenWallet_Key;
}

export interface CreateUserAttributesData {
  userAttributes_insert: UserAttributes_Key;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateWeaponData {
  weapon_insert: Weapon_Key;
}

export interface CreateWeaponVariables {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  attack: number;
  rarity: WeaponRarity;
  weaponType: WeaponType;
  worldId: string;
}

export interface CreateWorldData {
  world_insert: World_Key;
}

export interface CreateWorldVariables {
  id: string;
  name: string;
  description?: string | null;
  coverImage?: string | null;
  isPublic?: boolean | null;
}

export interface DeleteCharacterData {
  character_delete?: Character_Key | null;
}

export interface DeleteCharacterVariables {
  id: string;
}

export interface DeleteItemData {
  item_delete?: Item_Key | null;
}

export interface DeleteItemVariables {
  id: string;
}

export interface DeleteResourceData {
  resource_delete?: Resource_Key | null;
}

export interface DeleteResourceVariables {
  id: string;
}

export interface DeleteSceneData {
  scene_delete?: Scene_Key | null;
}

export interface DeleteSceneVariables {
  id: string;
}

export interface DeleteWeaponData {
  weapon_delete?: Weapon_Key | null;
}

export interface DeleteWeaponVariables {
  id: string;
}

export interface DeleteWorldData {
  world_delete?: World_Key | null;
}

export interface DeleteWorldVariables {
  id: string;
}

export interface FindUserByEmailData {
  users: ({
    id: string;
    email?: string | null;
  } & User_Key)[];
}

export interface FindUserByEmailVariables {
  email: string;
}

export interface GetCharacterData {
  character?: {
    id: string;
    name: string;
    description?: string | null;
    portraitImage?: string | null;
    bustImage?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    world: {
      id: string;
      name: string;
    } & World_Key;
  } & Character_Key;
}

export interface GetCharacterVariables {
  id: string;
}

export interface GetItemData {
  item?: {
    id: string;
    name: string;
    description: string;
    type: ItemType;
    rarity: ItemRarity;
    data?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Item_Key;
}

export interface GetItemVariables {
  id: string;
}

export interface GetPlayerProfileData {
  user?: {
    id: string;
    playerProfile_on_user?: {
      id: UUIDString;
      characterName: string;
      avatarId?: string | null;
      isInitialized: boolean;
      createdAt: TimestampString;
      updatedAt: TimestampString;
    } & PlayerProfile_Key;
  } & User_Key;
}

export interface GetPlayerStateSummaryData {
  user?: {
    id: string;
    playerProfile_on_user?: {
      isInitialized: boolean;
      characterName: string;
    };
      playerTutorial_on_user?: {
        isCompleted: boolean;
        currentStep?: string | null;
      };
  } & User_Key;
}

export interface GetPlayerTutorialData {
  user?: {
    id: string;
    playerTutorial_on_user?: {
      id: UUIDString;
      isCompleted: boolean;
      currentStep?: string | null;
      completedSteps: string[];
      startedAt?: TimestampString | null;
      completedAt?: TimestampString | null;
      updatedAt: TimestampString;
    } & PlayerTutorial_Key;
  } & User_Key;
}

export interface GetResourceData {
  resource?: {
    id: string;
    data: string;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Resource_Key;
}

export interface GetResourceVariables {
  id: string;
}

export interface GetSceneData {
  scene?: {
    id: string;
    name: string;
    description?: string | null;
    splatUrl: string;
    wallConfig?: string | null;
    floorConfig: string;
    interactionPoints: string;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    world: {
      id: string;
      name: string;
    } & World_Key;
  } & Scene_Key;
}

export interface GetSceneVariables {
  id: string;
}

export interface GetTokenEventsData {
  tokenUsageEvents: ({
    id: UUIDString;
    direction: TokenDirection;
    model: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    costUsd: number;
    meta?: string | null;
    createdAt: TimestampString;
  } & TokenUsageEvent_Key)[];
}

export interface GetTokenEventsVariables {
  limit?: number;
  offset?: number;
}

export interface GetTokenSummaryData {
  user?: {
    id: string;
    tokenWallets_on_user: ({
      balanceTokens: number;
      lifetimeUsedTokens: number;
      planType: PlanType;
      softLimitTokens?: number | null;
      hardLimitTokens?: number | null;
      billingPeriodStart?: TimestampString | null;
      billingPeriodEnd?: TimestampString | null;
      gameUid?: number | null;
      createdAt: TimestampString;
      updatedAt: TimestampString;
    })[];
  } & User_Key;
}

export interface GetUserAttributesData {
  user?: {
    id: string;
    createdAt: TimestampString;
    userAttributess_on_user: ({
      hp: number;
      maxHp: number;
      atk: number;
      def: number;
      level: number;
      exp: number;
      gold: number;
    })[];
  } & User_Key;
}

export interface GetUserInventoryData {
  user?: {
    id: string;
    inventoryItems_on_user: ({
      quantity: number;
      acquiredAt: TimestampString;
      item: {
        id: string;
        name: string;
        description: string;
        type: ItemType;
        rarity: ItemRarity;
        data?: string | null;
      } & Item_Key;
    })[];
  } & User_Key;
}

export interface GetUserProfileData {
  user?: {
    id: string;
    createdAt: TimestampString;
    userAttributess_on_user: ({
      hp: number;
      maxHp: number;
      atk: number;
      def: number;
      level: number;
      exp: number;
      gold: number;
    })[];
      inventoryItems_on_user: ({
        quantity: number;
        item: {
          id: string;
          name: string;
          type: ItemType;
          rarity: ItemRarity;
        } & Item_Key;
      })[];
  } & User_Key;
}

export interface GetWeaponData {
  weapon?: {
    id: string;
    name: string;
    description?: string | null;
    image?: string | null;
    attack: number;
    rarity: WeaponRarity;
    weaponType: WeaponType;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    world: {
      id: string;
      name: string;
    } & World_Key;
  } & Weapon_Key;
}

export interface GetWeaponVariables {
  id: string;
}

export interface GetWorldData {
  world?: {
    id: string;
    name: string;
    description?: string | null;
    coverImage?: string | null;
    isPublic: boolean;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    owner: {
      id: string;
    } & User_Key;
      scenes_on_world: ({
        id: string;
        name: string;
        description?: string | null;
        splatUrl: string;
        createdAt: TimestampString;
        updatedAt: TimestampString;
      } & Scene_Key)[];
  } & World_Key;
}

export interface GetWorldVariables {
  id: string;
}

export interface InitializePlayerData {
  playerProfile_insert: PlayerProfile_Key;
}

export interface InitializePlayerVariables {
  characterName: string;
  avatarId?: string | null;
}

export interface InventoryItem_Key {
  userId: string;
  itemId: string;
  __typename?: 'InventoryItem_Key';
}

export interface Item_Key {
  id: string;
  __typename?: 'Item_Key';
}

export interface ListCharactersByWorldData {
  characters: ({
    id: string;
    name: string;
    description?: string | null;
    portraitImage?: string | null;
    bustImage?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Character_Key)[];
}

export interface ListCharactersByWorldVariables {
  worldId: string;
}

export interface ListCollaboratingWorldsData {
  worldCollaborators: ({
    world: {
      id: string;
      name: string;
      description?: string | null;
      coverImage?: string | null;
      isPublic: boolean;
      createdAt: TimestampString;
      updatedAt: TimestampString;
      scenes_on_world: ({
        id: string;
      } & Scene_Key)[];
    } & World_Key;
  })[];
}

export interface ListCollaboratorsData {
  worldCollaborators: ({
    user: {
      id: string;
      email?: string | null;
    } & User_Key;
      addedAt: TimestampString;
  })[];
}

export interface ListCollaboratorsVariables {
  worldId: string;
}

export interface ListItemsByRarityData {
  items: ({
    id: string;
    name: string;
    description: string;
    type: ItemType;
    rarity: ItemRarity;
    data?: string | null;
  } & Item_Key)[];
}

export interface ListItemsByRarityVariables {
  rarity: ItemRarity;
}

export interface ListItemsByTypeData {
  items: ({
    id: string;
    name: string;
    description: string;
    type: ItemType;
    rarity: ItemRarity;
    data?: string | null;
  } & Item_Key)[];
}

export interface ListItemsByTypeVariables {
  type: ItemType;
}

export interface ListItemsData {
  items: ({
    id: string;
    name: string;
    description: string;
    type: ItemType;
    rarity: ItemRarity;
    data?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Item_Key)[];
}

export interface ListMyWorldsData {
  worlds: ({
    id: string;
    name: string;
    description?: string | null;
    coverImage?: string | null;
    isPublic: boolean;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    scenes_on_world: ({
      id: string;
    } & Scene_Key)[];
  } & World_Key)[];
}

export interface ListResourcesData {
  resources: ({
    id: string;
    data: string;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Resource_Key)[];
}

export interface ListScenesByWorldData {
  scenes: ({
    id: string;
    name: string;
    description?: string | null;
    splatUrl: string;
    wallConfig?: string | null;
    floorConfig: string;
    interactionPoints: string;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Scene_Key)[];
}

export interface ListScenesByWorldVariables {
  worldId: string;
}

export interface ListScenesData {
  scenes: ({
    id: string;
    name: string;
    description?: string | null;
    splatUrl: string;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    world: {
      id: string;
      name: string;
    } & World_Key;
  } & Scene_Key)[];
}

export interface ListWeaponsByWorldData {
  weapons: ({
    id: string;
    name: string;
    description?: string | null;
    image?: string | null;
    attack: number;
    rarity: WeaponRarity;
    weaponType: WeaponType;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Weapon_Key)[];
}

export interface ListWeaponsByWorldVariables {
  worldId: string;
}

export interface PlayerProfile_Key {
  id: UUIDString;
  __typename?: 'PlayerProfile_Key';
}

export interface PlayerTutorial_Key {
  id: UUIDString;
  __typename?: 'PlayerTutorial_Key';
}

export interface RemoveCollaboratorData {
  worldCollaborator_deleteMany: number;
}

export interface RemoveCollaboratorVariables {
  worldId: string;
  userId: string;
}

export interface RemoveInventoryItemData {
  inventoryItem_deleteMany: number;
}

export interface RemoveInventoryItemVariables {
  itemId: string;
}

export interface ResetTutorialData {
  playerTutorial_updateMany: number;
}

export interface ResetUserAttributesData {
  userAttributes_updateMany: number;
}

export interface Resource_Key {
  id: string;
  __typename?: 'Resource_Key';
}

export interface Scene_Key {
  id: string;
  __typename?: 'Scene_Key';
}

export interface StartTutorialData {
  playerTutorial_insert: PlayerTutorial_Key;
}

export interface TokenUsageEvent_Key {
  id: UUIDString;
  __typename?: 'TokenUsageEvent_Key';
}

export interface TokenWallet_Key {
  id: UUIDString;
  __typename?: 'TokenWallet_Key';
}

export interface UpdateCharacterData {
  character_update?: Character_Key | null;
}

export interface UpdateCharacterVariables {
  id: string;
  name?: string | null;
  description?: string | null;
  portraitImage?: string | null;
  bustImage?: string | null;
}

export interface UpdateItemData {
  item_update?: Item_Key | null;
}

export interface UpdateItemVariables {
  id: string;
  name?: string | null;
  description?: string | null;
  type?: ItemType | null;
  rarity?: ItemRarity | null;
  data?: string | null;
}

export interface UpdatePlayerProfileData {
  playerProfile_updateMany: number;
}

export interface UpdatePlayerProfileVariables {
  characterName?: string | null;
  avatarId?: string | null;
}

export interface UpdateResourceData {
  resource_update?: Resource_Key | null;
}

export interface UpdateResourceVariables {
  id: string;
  data: string;
}

export interface UpdateSceneData {
  scene_update?: Scene_Key | null;
}

export interface UpdateSceneVariables {
  id: string;
  name?: string | null;
  description?: string | null;
  splatUrl?: string | null;
  wallConfig?: string | null;
  floorConfig?: string | null;
  interactionPoints?: string | null;
}

export interface UpdateUserAttributesData {
  userAttributes_updateMany: number;
}

export interface UpdateUserAttributesVariables {
  hp?: number | null;
  maxHp?: number | null;
  atk?: number | null;
  def?: number | null;
  level?: number | null;
  exp?: number | null;
  gold?: number | null;
}

export interface UpdateWeaponData {
  weapon_update?: Weapon_Key | null;
}

export interface UpdateWeaponVariables {
  id: string;
  name?: string | null;
  description?: string | null;
  image?: string | null;
  attack?: number | null;
  rarity?: WeaponRarity | null;
  weaponType?: WeaponType | null;
}

export interface UpdateWorldData {
  world_update?: World_Key | null;
}

export interface UpdateWorldVariables {
  id: string;
  name?: string | null;
  description?: string | null;
  coverImage?: string | null;
  isPublic?: boolean | null;
}

export interface UpsertUserWithEmailData {
  user_upsert: User_Key;
}

export interface UpsertUserWithEmailVariables {
  email: string;
}

export interface UserAttributes_Key {
  id: UUIDString;
  __typename?: 'UserAttributes_Key';
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

export interface Weapon_Key {
  id: string;
  __typename?: 'Weapon_Key';
}

export interface WorldCollaborator_Key {
  worldId: string;
  userId: string;
  __typename?: 'WorldCollaborator_Key';
}

export interface World_Key {
  id: string;
  __typename?: 'World_Key';
}

interface GetPlayerProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPlayerProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetPlayerProfileData, undefined>;
  operationName: string;
}
export const getPlayerProfileRef: GetPlayerProfileRef;

export function getPlayerProfile(): QueryPromise<GetPlayerProfileData, undefined>;
export function getPlayerProfile(dc: DataConnect): QueryPromise<GetPlayerProfileData, undefined>;

interface GetPlayerTutorialRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPlayerTutorialData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetPlayerTutorialData, undefined>;
  operationName: string;
}
export const getPlayerTutorialRef: GetPlayerTutorialRef;

export function getPlayerTutorial(): QueryPromise<GetPlayerTutorialData, undefined>;
export function getPlayerTutorial(dc: DataConnect): QueryPromise<GetPlayerTutorialData, undefined>;

interface GetPlayerStateSummaryRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPlayerStateSummaryData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetPlayerStateSummaryData, undefined>;
  operationName: string;
}
export const getPlayerStateSummaryRef: GetPlayerStateSummaryRef;

export function getPlayerStateSummary(): QueryPromise<GetPlayerStateSummaryData, undefined>;
export function getPlayerStateSummary(dc: DataConnect): QueryPromise<GetPlayerStateSummaryData, undefined>;

interface InitializePlayerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: InitializePlayerVariables): MutationRef<InitializePlayerData, InitializePlayerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: InitializePlayerVariables): MutationRef<InitializePlayerData, InitializePlayerVariables>;
  operationName: string;
}
export const initializePlayerRef: InitializePlayerRef;

export function initializePlayer(vars: InitializePlayerVariables): MutationPromise<InitializePlayerData, InitializePlayerVariables>;
export function initializePlayer(dc: DataConnect, vars: InitializePlayerVariables): MutationPromise<InitializePlayerData, InitializePlayerVariables>;

interface UpdatePlayerProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdatePlayerProfileVariables): MutationRef<UpdatePlayerProfileData, UpdatePlayerProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: UpdatePlayerProfileVariables): MutationRef<UpdatePlayerProfileData, UpdatePlayerProfileVariables>;
  operationName: string;
}
export const updatePlayerProfileRef: UpdatePlayerProfileRef;

export function updatePlayerProfile(vars?: UpdatePlayerProfileVariables): MutationPromise<UpdatePlayerProfileData, UpdatePlayerProfileVariables>;
export function updatePlayerProfile(dc: DataConnect, vars?: UpdatePlayerProfileVariables): MutationPromise<UpdatePlayerProfileData, UpdatePlayerProfileVariables>;

interface StartTutorialRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<StartTutorialData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<StartTutorialData, undefined>;
  operationName: string;
}
export const startTutorialRef: StartTutorialRef;

export function startTutorial(): MutationPromise<StartTutorialData, undefined>;
export function startTutorial(dc: DataConnect): MutationPromise<StartTutorialData, undefined>;

interface AdvanceTutorialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdvanceTutorialVariables): MutationRef<AdvanceTutorialData, AdvanceTutorialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdvanceTutorialVariables): MutationRef<AdvanceTutorialData, AdvanceTutorialVariables>;
  operationName: string;
}
export const advanceTutorialRef: AdvanceTutorialRef;

export function advanceTutorial(vars: AdvanceTutorialVariables): MutationPromise<AdvanceTutorialData, AdvanceTutorialVariables>;
export function advanceTutorial(dc: DataConnect, vars: AdvanceTutorialVariables): MutationPromise<AdvanceTutorialData, AdvanceTutorialVariables>;

interface CompleteTutorialRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CompleteTutorialData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CompleteTutorialData, undefined>;
  operationName: string;
}
export const completeTutorialRef: CompleteTutorialRef;

export function completeTutorial(): MutationPromise<CompleteTutorialData, undefined>;
export function completeTutorial(dc: DataConnect): MutationPromise<CompleteTutorialData, undefined>;

interface ResetTutorialRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<ResetTutorialData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<ResetTutorialData, undefined>;
  operationName: string;
}
export const resetTutorialRef: ResetTutorialRef;

export function resetTutorial(): MutationPromise<ResetTutorialData, undefined>;
export function resetTutorial(dc: DataConnect): MutationPromise<ResetTutorialData, undefined>;

interface AdminGetPlayerProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminGetPlayerProfileVariables): QueryRef<AdminGetPlayerProfileData, AdminGetPlayerProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminGetPlayerProfileVariables): QueryRef<AdminGetPlayerProfileData, AdminGetPlayerProfileVariables>;
  operationName: string;
}
export const adminGetPlayerProfileRef: AdminGetPlayerProfileRef;

export function adminGetPlayerProfile(vars: AdminGetPlayerProfileVariables): QueryPromise<AdminGetPlayerProfileData, AdminGetPlayerProfileVariables>;
export function adminGetPlayerProfile(dc: DataConnect, vars: AdminGetPlayerProfileVariables): QueryPromise<AdminGetPlayerProfileData, AdminGetPlayerProfileVariables>;

interface AdminGetPlayerTutorialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminGetPlayerTutorialVariables): QueryRef<AdminGetPlayerTutorialData, AdminGetPlayerTutorialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminGetPlayerTutorialVariables): QueryRef<AdminGetPlayerTutorialData, AdminGetPlayerTutorialVariables>;
  operationName: string;
}
export const adminGetPlayerTutorialRef: AdminGetPlayerTutorialRef;

export function adminGetPlayerTutorial(vars: AdminGetPlayerTutorialVariables): QueryPromise<AdminGetPlayerTutorialData, AdminGetPlayerTutorialVariables>;
export function adminGetPlayerTutorial(dc: DataConnect, vars: AdminGetPlayerTutorialVariables): QueryPromise<AdminGetPlayerTutorialData, AdminGetPlayerTutorialVariables>;

interface AdminGetPlayerStateSummaryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminGetPlayerStateSummaryVariables): QueryRef<AdminGetPlayerStateSummaryData, AdminGetPlayerStateSummaryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminGetPlayerStateSummaryVariables): QueryRef<AdminGetPlayerStateSummaryData, AdminGetPlayerStateSummaryVariables>;
  operationName: string;
}
export const adminGetPlayerStateSummaryRef: AdminGetPlayerStateSummaryRef;

export function adminGetPlayerStateSummary(vars: AdminGetPlayerStateSummaryVariables): QueryPromise<AdminGetPlayerStateSummaryData, AdminGetPlayerStateSummaryVariables>;
export function adminGetPlayerStateSummary(dc: DataConnect, vars: AdminGetPlayerStateSummaryVariables): QueryPromise<AdminGetPlayerStateSummaryData, AdminGetPlayerStateSummaryVariables>;

interface AdminInitializePlayerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminInitializePlayerVariables): MutationRef<AdminInitializePlayerData, AdminInitializePlayerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminInitializePlayerVariables): MutationRef<AdminInitializePlayerData, AdminInitializePlayerVariables>;
  operationName: string;
}
export const adminInitializePlayerRef: AdminInitializePlayerRef;

export function adminInitializePlayer(vars: AdminInitializePlayerVariables): MutationPromise<AdminInitializePlayerData, AdminInitializePlayerVariables>;
export function adminInitializePlayer(dc: DataConnect, vars: AdminInitializePlayerVariables): MutationPromise<AdminInitializePlayerData, AdminInitializePlayerVariables>;

interface AdminUpdatePlayerProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminUpdatePlayerProfileVariables): MutationRef<AdminUpdatePlayerProfileData, AdminUpdatePlayerProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminUpdatePlayerProfileVariables): MutationRef<AdminUpdatePlayerProfileData, AdminUpdatePlayerProfileVariables>;
  operationName: string;
}
export const adminUpdatePlayerProfileRef: AdminUpdatePlayerProfileRef;

export function adminUpdatePlayerProfile(vars: AdminUpdatePlayerProfileVariables): MutationPromise<AdminUpdatePlayerProfileData, AdminUpdatePlayerProfileVariables>;
export function adminUpdatePlayerProfile(dc: DataConnect, vars: AdminUpdatePlayerProfileVariables): MutationPromise<AdminUpdatePlayerProfileData, AdminUpdatePlayerProfileVariables>;

interface AdminStartTutorialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminStartTutorialVariables): MutationRef<AdminStartTutorialData, AdminStartTutorialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminStartTutorialVariables): MutationRef<AdminStartTutorialData, AdminStartTutorialVariables>;
  operationName: string;
}
export const adminStartTutorialRef: AdminStartTutorialRef;

export function adminStartTutorial(vars: AdminStartTutorialVariables): MutationPromise<AdminStartTutorialData, AdminStartTutorialVariables>;
export function adminStartTutorial(dc: DataConnect, vars: AdminStartTutorialVariables): MutationPromise<AdminStartTutorialData, AdminStartTutorialVariables>;

interface AdminAdvanceTutorialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminAdvanceTutorialVariables): MutationRef<AdminAdvanceTutorialData, AdminAdvanceTutorialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminAdvanceTutorialVariables): MutationRef<AdminAdvanceTutorialData, AdminAdvanceTutorialVariables>;
  operationName: string;
}
export const adminAdvanceTutorialRef: AdminAdvanceTutorialRef;

export function adminAdvanceTutorial(vars: AdminAdvanceTutorialVariables): MutationPromise<AdminAdvanceTutorialData, AdminAdvanceTutorialVariables>;
export function adminAdvanceTutorial(dc: DataConnect, vars: AdminAdvanceTutorialVariables): MutationPromise<AdminAdvanceTutorialData, AdminAdvanceTutorialVariables>;

interface AdminCompleteTutorialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminCompleteTutorialVariables): MutationRef<AdminCompleteTutorialData, AdminCompleteTutorialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminCompleteTutorialVariables): MutationRef<AdminCompleteTutorialData, AdminCompleteTutorialVariables>;
  operationName: string;
}
export const adminCompleteTutorialRef: AdminCompleteTutorialRef;

export function adminCompleteTutorial(vars: AdminCompleteTutorialVariables): MutationPromise<AdminCompleteTutorialData, AdminCompleteTutorialVariables>;
export function adminCompleteTutorial(dc: DataConnect, vars: AdminCompleteTutorialVariables): MutationPromise<AdminCompleteTutorialData, AdminCompleteTutorialVariables>;

interface AdminResetTutorialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminResetTutorialVariables): MutationRef<AdminResetTutorialData, AdminResetTutorialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminResetTutorialVariables): MutationRef<AdminResetTutorialData, AdminResetTutorialVariables>;
  operationName: string;
}
export const adminResetTutorialRef: AdminResetTutorialRef;

export function adminResetTutorial(vars: AdminResetTutorialVariables): MutationPromise<AdminResetTutorialData, AdminResetTutorialVariables>;
export function adminResetTutorial(dc: DataConnect, vars: AdminResetTutorialVariables): MutationPromise<AdminResetTutorialData, AdminResetTutorialVariables>;

interface ListResourcesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListResourcesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListResourcesData, undefined>;
  operationName: string;
}
export const listResourcesRef: ListResourcesRef;

export function listResources(): QueryPromise<ListResourcesData, undefined>;
export function listResources(dc: DataConnect): QueryPromise<ListResourcesData, undefined>;

interface GetResourceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetResourceVariables): QueryRef<GetResourceData, GetResourceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetResourceVariables): QueryRef<GetResourceData, GetResourceVariables>;
  operationName: string;
}
export const getResourceRef: GetResourceRef;

export function getResource(vars: GetResourceVariables): QueryPromise<GetResourceData, GetResourceVariables>;
export function getResource(dc: DataConnect, vars: GetResourceVariables): QueryPromise<GetResourceData, GetResourceVariables>;

interface CreateResourceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateResourceVariables): MutationRef<CreateResourceData, CreateResourceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateResourceVariables): MutationRef<CreateResourceData, CreateResourceVariables>;
  operationName: string;
}
export const createResourceRef: CreateResourceRef;

export function createResource(vars: CreateResourceVariables): MutationPromise<CreateResourceData, CreateResourceVariables>;
export function createResource(dc: DataConnect, vars: CreateResourceVariables): MutationPromise<CreateResourceData, CreateResourceVariables>;

interface UpdateResourceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateResourceVariables): MutationRef<UpdateResourceData, UpdateResourceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateResourceVariables): MutationRef<UpdateResourceData, UpdateResourceVariables>;
  operationName: string;
}
export const updateResourceRef: UpdateResourceRef;

export function updateResource(vars: UpdateResourceVariables): MutationPromise<UpdateResourceData, UpdateResourceVariables>;
export function updateResource(dc: DataConnect, vars: UpdateResourceVariables): MutationPromise<UpdateResourceData, UpdateResourceVariables>;

interface DeleteResourceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteResourceVariables): MutationRef<DeleteResourceData, DeleteResourceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteResourceVariables): MutationRef<DeleteResourceData, DeleteResourceVariables>;
  operationName: string;
}
export const deleteResourceRef: DeleteResourceRef;

export function deleteResource(vars: DeleteResourceVariables): MutationPromise<DeleteResourceData, DeleteResourceVariables>;
export function deleteResource(dc: DataConnect, vars: DeleteResourceVariables): MutationPromise<DeleteResourceData, DeleteResourceVariables>;

interface ListScenesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListScenesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListScenesData, undefined>;
  operationName: string;
}
export const listScenesRef: ListScenesRef;

export function listScenes(): QueryPromise<ListScenesData, undefined>;
export function listScenes(dc: DataConnect): QueryPromise<ListScenesData, undefined>;

interface ListScenesByWorldRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListScenesByWorldVariables): QueryRef<ListScenesByWorldData, ListScenesByWorldVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListScenesByWorldVariables): QueryRef<ListScenesByWorldData, ListScenesByWorldVariables>;
  operationName: string;
}
export const listScenesByWorldRef: ListScenesByWorldRef;

export function listScenesByWorld(vars: ListScenesByWorldVariables): QueryPromise<ListScenesByWorldData, ListScenesByWorldVariables>;
export function listScenesByWorld(dc: DataConnect, vars: ListScenesByWorldVariables): QueryPromise<ListScenesByWorldData, ListScenesByWorldVariables>;

interface GetSceneRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSceneVariables): QueryRef<GetSceneData, GetSceneVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetSceneVariables): QueryRef<GetSceneData, GetSceneVariables>;
  operationName: string;
}
export const getSceneRef: GetSceneRef;

export function getScene(vars: GetSceneVariables): QueryPromise<GetSceneData, GetSceneVariables>;
export function getScene(dc: DataConnect, vars: GetSceneVariables): QueryPromise<GetSceneData, GetSceneVariables>;

interface CreateSceneRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSceneVariables): MutationRef<CreateSceneData, CreateSceneVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateSceneVariables): MutationRef<CreateSceneData, CreateSceneVariables>;
  operationName: string;
}
export const createSceneRef: CreateSceneRef;

export function createScene(vars: CreateSceneVariables): MutationPromise<CreateSceneData, CreateSceneVariables>;
export function createScene(dc: DataConnect, vars: CreateSceneVariables): MutationPromise<CreateSceneData, CreateSceneVariables>;

interface UpdateSceneRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSceneVariables): MutationRef<UpdateSceneData, UpdateSceneVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateSceneVariables): MutationRef<UpdateSceneData, UpdateSceneVariables>;
  operationName: string;
}
export const updateSceneRef: UpdateSceneRef;

export function updateScene(vars: UpdateSceneVariables): MutationPromise<UpdateSceneData, UpdateSceneVariables>;
export function updateScene(dc: DataConnect, vars: UpdateSceneVariables): MutationPromise<UpdateSceneData, UpdateSceneVariables>;

interface DeleteSceneRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSceneVariables): MutationRef<DeleteSceneData, DeleteSceneVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteSceneVariables): MutationRef<DeleteSceneData, DeleteSceneVariables>;
  operationName: string;
}
export const deleteSceneRef: DeleteSceneRef;

export function deleteScene(vars: DeleteSceneVariables): MutationPromise<DeleteSceneData, DeleteSceneVariables>;
export function deleteScene(dc: DataConnect, vars: DeleteSceneVariables): MutationPromise<DeleteSceneData, DeleteSceneVariables>;

interface ListMyWorldsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyWorldsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyWorldsData, undefined>;
  operationName: string;
}
export const listMyWorldsRef: ListMyWorldsRef;

export function listMyWorlds(): QueryPromise<ListMyWorldsData, undefined>;
export function listMyWorlds(dc: DataConnect): QueryPromise<ListMyWorldsData, undefined>;

interface ListCollaboratingWorldsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCollaboratingWorldsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListCollaboratingWorldsData, undefined>;
  operationName: string;
}
export const listCollaboratingWorldsRef: ListCollaboratingWorldsRef;

export function listCollaboratingWorlds(): QueryPromise<ListCollaboratingWorldsData, undefined>;
export function listCollaboratingWorlds(dc: DataConnect): QueryPromise<ListCollaboratingWorldsData, undefined>;

interface GetWorldRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetWorldVariables): QueryRef<GetWorldData, GetWorldVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetWorldVariables): QueryRef<GetWorldData, GetWorldVariables>;
  operationName: string;
}
export const getWorldRef: GetWorldRef;

export function getWorld(vars: GetWorldVariables): QueryPromise<GetWorldData, GetWorldVariables>;
export function getWorld(dc: DataConnect, vars: GetWorldVariables): QueryPromise<GetWorldData, GetWorldVariables>;

interface CreateWorldRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateWorldVariables): MutationRef<CreateWorldData, CreateWorldVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateWorldVariables): MutationRef<CreateWorldData, CreateWorldVariables>;
  operationName: string;
}
export const createWorldRef: CreateWorldRef;

export function createWorld(vars: CreateWorldVariables): MutationPromise<CreateWorldData, CreateWorldVariables>;
export function createWorld(dc: DataConnect, vars: CreateWorldVariables): MutationPromise<CreateWorldData, CreateWorldVariables>;

interface UpdateWorldRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateWorldVariables): MutationRef<UpdateWorldData, UpdateWorldVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateWorldVariables): MutationRef<UpdateWorldData, UpdateWorldVariables>;
  operationName: string;
}
export const updateWorldRef: UpdateWorldRef;

export function updateWorld(vars: UpdateWorldVariables): MutationPromise<UpdateWorldData, UpdateWorldVariables>;
export function updateWorld(dc: DataConnect, vars: UpdateWorldVariables): MutationPromise<UpdateWorldData, UpdateWorldVariables>;

interface DeleteWorldRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteWorldVariables): MutationRef<DeleteWorldData, DeleteWorldVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteWorldVariables): MutationRef<DeleteWorldData, DeleteWorldVariables>;
  operationName: string;
}
export const deleteWorldRef: DeleteWorldRef;

export function deleteWorld(vars: DeleteWorldVariables): MutationPromise<DeleteWorldData, DeleteWorldVariables>;
export function deleteWorld(dc: DataConnect, vars: DeleteWorldVariables): MutationPromise<DeleteWorldData, DeleteWorldVariables>;

interface ListCollaboratorsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCollaboratorsVariables): QueryRef<ListCollaboratorsData, ListCollaboratorsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListCollaboratorsVariables): QueryRef<ListCollaboratorsData, ListCollaboratorsVariables>;
  operationName: string;
}
export const listCollaboratorsRef: ListCollaboratorsRef;

export function listCollaborators(vars: ListCollaboratorsVariables): QueryPromise<ListCollaboratorsData, ListCollaboratorsVariables>;
export function listCollaborators(dc: DataConnect, vars: ListCollaboratorsVariables): QueryPromise<ListCollaboratorsData, ListCollaboratorsVariables>;

interface FindUserByEmailRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: FindUserByEmailVariables): QueryRef<FindUserByEmailData, FindUserByEmailVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: FindUserByEmailVariables): QueryRef<FindUserByEmailData, FindUserByEmailVariables>;
  operationName: string;
}
export const findUserByEmailRef: FindUserByEmailRef;

export function findUserByEmail(vars: FindUserByEmailVariables): QueryPromise<FindUserByEmailData, FindUserByEmailVariables>;
export function findUserByEmail(dc: DataConnect, vars: FindUserByEmailVariables): QueryPromise<FindUserByEmailData, FindUserByEmailVariables>;

interface AddCollaboratorRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddCollaboratorVariables): MutationRef<AddCollaboratorData, AddCollaboratorVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddCollaboratorVariables): MutationRef<AddCollaboratorData, AddCollaboratorVariables>;
  operationName: string;
}
export const addCollaboratorRef: AddCollaboratorRef;

export function addCollaborator(vars: AddCollaboratorVariables): MutationPromise<AddCollaboratorData, AddCollaboratorVariables>;
export function addCollaborator(dc: DataConnect, vars: AddCollaboratorVariables): MutationPromise<AddCollaboratorData, AddCollaboratorVariables>;

interface RemoveCollaboratorRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveCollaboratorVariables): MutationRef<RemoveCollaboratorData, RemoveCollaboratorVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RemoveCollaboratorVariables): MutationRef<RemoveCollaboratorData, RemoveCollaboratorVariables>;
  operationName: string;
}
export const removeCollaboratorRef: RemoveCollaboratorRef;

export function removeCollaborator(vars: RemoveCollaboratorVariables): MutationPromise<RemoveCollaboratorData, RemoveCollaboratorVariables>;
export function removeCollaborator(dc: DataConnect, vars: RemoveCollaboratorVariables): MutationPromise<RemoveCollaboratorData, RemoveCollaboratorVariables>;

interface ListItemsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListItemsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListItemsData, undefined>;
  operationName: string;
}
export const listItemsRef: ListItemsRef;

export function listItems(): QueryPromise<ListItemsData, undefined>;
export function listItems(dc: DataConnect): QueryPromise<ListItemsData, undefined>;

interface GetItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetItemVariables): QueryRef<GetItemData, GetItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetItemVariables): QueryRef<GetItemData, GetItemVariables>;
  operationName: string;
}
export const getItemRef: GetItemRef;

export function getItem(vars: GetItemVariables): QueryPromise<GetItemData, GetItemVariables>;
export function getItem(dc: DataConnect, vars: GetItemVariables): QueryPromise<GetItemData, GetItemVariables>;

interface ListItemsByTypeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListItemsByTypeVariables): QueryRef<ListItemsByTypeData, ListItemsByTypeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListItemsByTypeVariables): QueryRef<ListItemsByTypeData, ListItemsByTypeVariables>;
  operationName: string;
}
export const listItemsByTypeRef: ListItemsByTypeRef;

export function listItemsByType(vars: ListItemsByTypeVariables): QueryPromise<ListItemsByTypeData, ListItemsByTypeVariables>;
export function listItemsByType(dc: DataConnect, vars: ListItemsByTypeVariables): QueryPromise<ListItemsByTypeData, ListItemsByTypeVariables>;

interface ListItemsByRarityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListItemsByRarityVariables): QueryRef<ListItemsByRarityData, ListItemsByRarityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListItemsByRarityVariables): QueryRef<ListItemsByRarityData, ListItemsByRarityVariables>;
  operationName: string;
}
export const listItemsByRarityRef: ListItemsByRarityRef;

export function listItemsByRarity(vars: ListItemsByRarityVariables): QueryPromise<ListItemsByRarityData, ListItemsByRarityVariables>;
export function listItemsByRarity(dc: DataConnect, vars: ListItemsByRarityVariables): QueryPromise<ListItemsByRarityData, ListItemsByRarityVariables>;

interface CreateItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateItemVariables): MutationRef<CreateItemData, CreateItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateItemVariables): MutationRef<CreateItemData, CreateItemVariables>;
  operationName: string;
}
export const createItemRef: CreateItemRef;

export function createItem(vars: CreateItemVariables): MutationPromise<CreateItemData, CreateItemVariables>;
export function createItem(dc: DataConnect, vars: CreateItemVariables): MutationPromise<CreateItemData, CreateItemVariables>;

interface UpdateItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateItemVariables): MutationRef<UpdateItemData, UpdateItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateItemVariables): MutationRef<UpdateItemData, UpdateItemVariables>;
  operationName: string;
}
export const updateItemRef: UpdateItemRef;

export function updateItem(vars: UpdateItemVariables): MutationPromise<UpdateItemData, UpdateItemVariables>;
export function updateItem(dc: DataConnect, vars: UpdateItemVariables): MutationPromise<UpdateItemData, UpdateItemVariables>;

interface DeleteItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteItemVariables): MutationRef<DeleteItemData, DeleteItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteItemVariables): MutationRef<DeleteItemData, DeleteItemVariables>;
  operationName: string;
}
export const deleteItemRef: DeleteItemRef;

export function deleteItem(vars: DeleteItemVariables): MutationPromise<DeleteItemData, DeleteItemVariables>;
export function deleteItem(dc: DataConnect, vars: DeleteItemVariables): MutationPromise<DeleteItemData, DeleteItemVariables>;

interface GetTokenSummaryRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetTokenSummaryData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetTokenSummaryData, undefined>;
  operationName: string;
}
export const getTokenSummaryRef: GetTokenSummaryRef;

export function getTokenSummary(): QueryPromise<GetTokenSummaryData, undefined>;
export function getTokenSummary(dc: DataConnect): QueryPromise<GetTokenSummaryData, undefined>;

interface GetTokenEventsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetTokenEventsVariables): QueryRef<GetTokenEventsData, GetTokenEventsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: GetTokenEventsVariables): QueryRef<GetTokenEventsData, GetTokenEventsVariables>;
  operationName: string;
}
export const getTokenEventsRef: GetTokenEventsRef;

export function getTokenEvents(vars?: GetTokenEventsVariables): QueryPromise<GetTokenEventsData, GetTokenEventsVariables>;
export function getTokenEvents(dc: DataConnect, vars?: GetTokenEventsVariables): QueryPromise<GetTokenEventsData, GetTokenEventsVariables>;

interface CreateTokenWalletRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateTokenWalletData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateTokenWalletData, undefined>;
  operationName: string;
}
export const createTokenWalletRef: CreateTokenWalletRef;

export function createTokenWallet(): MutationPromise<CreateTokenWalletData, undefined>;
export function createTokenWallet(dc: DataConnect): MutationPromise<CreateTokenWalletData, undefined>;

interface AdminCreateTokenWalletRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminCreateTokenWalletVariables): MutationRef<AdminCreateTokenWalletData, AdminCreateTokenWalletVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminCreateTokenWalletVariables): MutationRef<AdminCreateTokenWalletData, AdminCreateTokenWalletVariables>;
  operationName: string;
}
export const adminCreateTokenWalletRef: AdminCreateTokenWalletRef;

export function adminCreateTokenWallet(vars: AdminCreateTokenWalletVariables): MutationPromise<AdminCreateTokenWalletData, AdminCreateTokenWalletVariables>;
export function adminCreateTokenWallet(dc: DataConnect, vars: AdminCreateTokenWalletVariables): MutationPromise<AdminCreateTokenWalletData, AdminCreateTokenWalletVariables>;

interface AdminUpdateTokenWalletRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminUpdateTokenWalletVariables): MutationRef<AdminUpdateTokenWalletData, AdminUpdateTokenWalletVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminUpdateTokenWalletVariables): MutationRef<AdminUpdateTokenWalletData, AdminUpdateTokenWalletVariables>;
  operationName: string;
}
export const adminUpdateTokenWalletRef: AdminUpdateTokenWalletRef;

export function adminUpdateTokenWallet(vars: AdminUpdateTokenWalletVariables): MutationPromise<AdminUpdateTokenWalletData, AdminUpdateTokenWalletVariables>;
export function adminUpdateTokenWallet(dc: DataConnect, vars: AdminUpdateTokenWalletVariables): MutationPromise<AdminUpdateTokenWalletData, AdminUpdateTokenWalletVariables>;

interface AdminCreateTokenEventRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminCreateTokenEventVariables): MutationRef<AdminCreateTokenEventData, AdminCreateTokenEventVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminCreateTokenEventVariables): MutationRef<AdminCreateTokenEventData, AdminCreateTokenEventVariables>;
  operationName: string;
}
export const adminCreateTokenEventRef: AdminCreateTokenEventRef;

export function adminCreateTokenEvent(vars: AdminCreateTokenEventVariables): MutationPromise<AdminCreateTokenEventData, AdminCreateTokenEventVariables>;
export function adminCreateTokenEvent(dc: DataConnect, vars: AdminCreateTokenEventVariables): MutationPromise<AdminCreateTokenEventData, AdminCreateTokenEventVariables>;

interface AdminConsumeTokensRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminConsumeTokensVariables): MutationRef<AdminConsumeTokensData, AdminConsumeTokensVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminConsumeTokensVariables): MutationRef<AdminConsumeTokensData, AdminConsumeTokensVariables>;
  operationName: string;
}
export const adminConsumeTokensRef: AdminConsumeTokensRef;

export function adminConsumeTokens(vars: AdminConsumeTokensVariables): MutationPromise<AdminConsumeTokensData, AdminConsumeTokensVariables>;
export function adminConsumeTokens(dc: DataConnect, vars: AdminConsumeTokensVariables): MutationPromise<AdminConsumeTokensData, AdminConsumeTokensVariables>;

interface AdminCreditTokensRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminCreditTokensVariables): MutationRef<AdminCreditTokensData, AdminCreditTokensVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminCreditTokensVariables): MutationRef<AdminCreditTokensData, AdminCreditTokensVariables>;
  operationName: string;
}
export const adminCreditTokensRef: AdminCreditTokensRef;

export function adminCreditTokens(vars: AdminCreditTokensVariables): MutationPromise<AdminCreditTokensData, AdminCreditTokensVariables>;
export function adminCreditTokens(dc: DataConnect, vars: AdminCreditTokensVariables): MutationPromise<AdminCreditTokensData, AdminCreditTokensVariables>;

interface AdminGetTokenWalletRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminGetTokenWalletVariables): QueryRef<AdminGetTokenWalletData, AdminGetTokenWalletVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminGetTokenWalletVariables): QueryRef<AdminGetTokenWalletData, AdminGetTokenWalletVariables>;
  operationName: string;
}
export const adminGetTokenWalletRef: AdminGetTokenWalletRef;

export function adminGetTokenWallet(vars: AdminGetTokenWalletVariables): QueryPromise<AdminGetTokenWalletData, AdminGetTokenWalletVariables>;
export function adminGetTokenWallet(dc: DataConnect, vars: AdminGetTokenWalletVariables): QueryPromise<AdminGetTokenWalletData, AdminGetTokenWalletVariables>;

interface GetUserAttributesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserAttributesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserAttributesData, undefined>;
  operationName: string;
}
export const getUserAttributesRef: GetUserAttributesRef;

export function getUserAttributes(): QueryPromise<GetUserAttributesData, undefined>;
export function getUserAttributes(dc: DataConnect): QueryPromise<GetUserAttributesData, undefined>;

interface GetUserInventoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserInventoryData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserInventoryData, undefined>;
  operationName: string;
}
export const getUserInventoryRef: GetUserInventoryRef;

export function getUserInventory(): QueryPromise<GetUserInventoryData, undefined>;
export function getUserInventory(dc: DataConnect): QueryPromise<GetUserInventoryData, undefined>;

interface GetUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserProfileData, undefined>;
  operationName: string;
}
export const getUserProfileRef: GetUserProfileRef;

export function getUserProfile(): QueryPromise<GetUserProfileData, undefined>;
export function getUserProfile(dc: DataConnect): QueryPromise<GetUserProfileData, undefined>;

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(): MutationPromise<CreateUserData, undefined>;
export function createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface UpsertUserWithEmailRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserWithEmailVariables): MutationRef<UpsertUserWithEmailData, UpsertUserWithEmailVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertUserWithEmailVariables): MutationRef<UpsertUserWithEmailData, UpsertUserWithEmailVariables>;
  operationName: string;
}
export const upsertUserWithEmailRef: UpsertUserWithEmailRef;

export function upsertUserWithEmail(vars: UpsertUserWithEmailVariables): MutationPromise<UpsertUserWithEmailData, UpsertUserWithEmailVariables>;
export function upsertUserWithEmail(dc: DataConnect, vars: UpsertUserWithEmailVariables): MutationPromise<UpsertUserWithEmailData, UpsertUserWithEmailVariables>;

interface CreateUserAttributesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserAttributesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateUserAttributesData, undefined>;
  operationName: string;
}
export const createUserAttributesRef: CreateUserAttributesRef;

export function createUserAttributes(): MutationPromise<CreateUserAttributesData, undefined>;
export function createUserAttributes(dc: DataConnect): MutationPromise<CreateUserAttributesData, undefined>;

interface UpdateUserAttributesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateUserAttributesVariables): MutationRef<UpdateUserAttributesData, UpdateUserAttributesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: UpdateUserAttributesVariables): MutationRef<UpdateUserAttributesData, UpdateUserAttributesVariables>;
  operationName: string;
}
export const updateUserAttributesRef: UpdateUserAttributesRef;

export function updateUserAttributes(vars?: UpdateUserAttributesVariables): MutationPromise<UpdateUserAttributesData, UpdateUserAttributesVariables>;
export function updateUserAttributes(dc: DataConnect, vars?: UpdateUserAttributesVariables): MutationPromise<UpdateUserAttributesData, UpdateUserAttributesVariables>;

interface ResetUserAttributesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<ResetUserAttributesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<ResetUserAttributesData, undefined>;
  operationName: string;
}
export const resetUserAttributesRef: ResetUserAttributesRef;

export function resetUserAttributes(): MutationPromise<ResetUserAttributesData, undefined>;
export function resetUserAttributes(dc: DataConnect): MutationPromise<ResetUserAttributesData, undefined>;

interface AddInventoryItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddInventoryItemVariables): MutationRef<AddInventoryItemData, AddInventoryItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddInventoryItemVariables): MutationRef<AddInventoryItemData, AddInventoryItemVariables>;
  operationName: string;
}
export const addInventoryItemRef: AddInventoryItemRef;

export function addInventoryItem(vars: AddInventoryItemVariables): MutationPromise<AddInventoryItemData, AddInventoryItemVariables>;
export function addInventoryItem(dc: DataConnect, vars: AddInventoryItemVariables): MutationPromise<AddInventoryItemData, AddInventoryItemVariables>;

interface RemoveInventoryItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveInventoryItemVariables): MutationRef<RemoveInventoryItemData, RemoveInventoryItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RemoveInventoryItemVariables): MutationRef<RemoveInventoryItemData, RemoveInventoryItemVariables>;
  operationName: string;
}
export const removeInventoryItemRef: RemoveInventoryItemRef;

export function removeInventoryItem(vars: RemoveInventoryItemVariables): MutationPromise<RemoveInventoryItemData, RemoveInventoryItemVariables>;
export function removeInventoryItem(dc: DataConnect, vars: RemoveInventoryItemVariables): MutationPromise<RemoveInventoryItemData, RemoveInventoryItemVariables>;

interface AdminCreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminCreateUserVariables): MutationRef<AdminCreateUserData, AdminCreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminCreateUserVariables): MutationRef<AdminCreateUserData, AdminCreateUserVariables>;
  operationName: string;
}
export const adminCreateUserRef: AdminCreateUserRef;

export function adminCreateUser(vars: AdminCreateUserVariables): MutationPromise<AdminCreateUserData, AdminCreateUserVariables>;
export function adminCreateUser(dc: DataConnect, vars: AdminCreateUserVariables): MutationPromise<AdminCreateUserData, AdminCreateUserVariables>;

interface AdminCreateUserAttributesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminCreateUserAttributesVariables): MutationRef<AdminCreateUserAttributesData, AdminCreateUserAttributesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminCreateUserAttributesVariables): MutationRef<AdminCreateUserAttributesData, AdminCreateUserAttributesVariables>;
  operationName: string;
}
export const adminCreateUserAttributesRef: AdminCreateUserAttributesRef;

export function adminCreateUserAttributes(vars: AdminCreateUserAttributesVariables): MutationPromise<AdminCreateUserAttributesData, AdminCreateUserAttributesVariables>;
export function adminCreateUserAttributes(dc: DataConnect, vars: AdminCreateUserAttributesVariables): MutationPromise<AdminCreateUserAttributesData, AdminCreateUserAttributesVariables>;

interface AdminUpdateUserAttributesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminUpdateUserAttributesVariables): MutationRef<AdminUpdateUserAttributesData, AdminUpdateUserAttributesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminUpdateUserAttributesVariables): MutationRef<AdminUpdateUserAttributesData, AdminUpdateUserAttributesVariables>;
  operationName: string;
}
export const adminUpdateUserAttributesRef: AdminUpdateUserAttributesRef;

export function adminUpdateUserAttributes(vars: AdminUpdateUserAttributesVariables): MutationPromise<AdminUpdateUserAttributesData, AdminUpdateUserAttributesVariables>;
export function adminUpdateUserAttributes(dc: DataConnect, vars: AdminUpdateUserAttributesVariables): MutationPromise<AdminUpdateUserAttributesData, AdminUpdateUserAttributesVariables>;

interface AdminAddInventoryItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminAddInventoryItemVariables): MutationRef<AdminAddInventoryItemData, AdminAddInventoryItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminAddInventoryItemVariables): MutationRef<AdminAddInventoryItemData, AdminAddInventoryItemVariables>;
  operationName: string;
}
export const adminAddInventoryItemRef: AdminAddInventoryItemRef;

export function adminAddInventoryItem(vars: AdminAddInventoryItemVariables): MutationPromise<AdminAddInventoryItemData, AdminAddInventoryItemVariables>;
export function adminAddInventoryItem(dc: DataConnect, vars: AdminAddInventoryItemVariables): MutationPromise<AdminAddInventoryItemData, AdminAddInventoryItemVariables>;

interface AdminRemoveInventoryItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminRemoveInventoryItemVariables): MutationRef<AdminRemoveInventoryItemData, AdminRemoveInventoryItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminRemoveInventoryItemVariables): MutationRef<AdminRemoveInventoryItemData, AdminRemoveInventoryItemVariables>;
  operationName: string;
}
export const adminRemoveInventoryItemRef: AdminRemoveInventoryItemRef;

export function adminRemoveInventoryItem(vars: AdminRemoveInventoryItemVariables): MutationPromise<AdminRemoveInventoryItemData, AdminRemoveInventoryItemVariables>;
export function adminRemoveInventoryItem(dc: DataConnect, vars: AdminRemoveInventoryItemVariables): MutationPromise<AdminRemoveInventoryItemData, AdminRemoveInventoryItemVariables>;

interface ListWeaponsByWorldRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListWeaponsByWorldVariables): QueryRef<ListWeaponsByWorldData, ListWeaponsByWorldVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListWeaponsByWorldVariables): QueryRef<ListWeaponsByWorldData, ListWeaponsByWorldVariables>;
  operationName: string;
}
export const listWeaponsByWorldRef: ListWeaponsByWorldRef;

export function listWeaponsByWorld(vars: ListWeaponsByWorldVariables): QueryPromise<ListWeaponsByWorldData, ListWeaponsByWorldVariables>;
export function listWeaponsByWorld(dc: DataConnect, vars: ListWeaponsByWorldVariables): QueryPromise<ListWeaponsByWorldData, ListWeaponsByWorldVariables>;

interface GetWeaponRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetWeaponVariables): QueryRef<GetWeaponData, GetWeaponVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetWeaponVariables): QueryRef<GetWeaponData, GetWeaponVariables>;
  operationName: string;
}
export const getWeaponRef: GetWeaponRef;

export function getWeapon(vars: GetWeaponVariables): QueryPromise<GetWeaponData, GetWeaponVariables>;
export function getWeapon(dc: DataConnect, vars: GetWeaponVariables): QueryPromise<GetWeaponData, GetWeaponVariables>;

interface CreateWeaponRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateWeaponVariables): MutationRef<CreateWeaponData, CreateWeaponVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateWeaponVariables): MutationRef<CreateWeaponData, CreateWeaponVariables>;
  operationName: string;
}
export const createWeaponRef: CreateWeaponRef;

export function createWeapon(vars: CreateWeaponVariables): MutationPromise<CreateWeaponData, CreateWeaponVariables>;
export function createWeapon(dc: DataConnect, vars: CreateWeaponVariables): MutationPromise<CreateWeaponData, CreateWeaponVariables>;

interface UpdateWeaponRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateWeaponVariables): MutationRef<UpdateWeaponData, UpdateWeaponVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateWeaponVariables): MutationRef<UpdateWeaponData, UpdateWeaponVariables>;
  operationName: string;
}
export const updateWeaponRef: UpdateWeaponRef;

export function updateWeapon(vars: UpdateWeaponVariables): MutationPromise<UpdateWeaponData, UpdateWeaponVariables>;
export function updateWeapon(dc: DataConnect, vars: UpdateWeaponVariables): MutationPromise<UpdateWeaponData, UpdateWeaponVariables>;

interface DeleteWeaponRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteWeaponVariables): MutationRef<DeleteWeaponData, DeleteWeaponVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteWeaponVariables): MutationRef<DeleteWeaponData, DeleteWeaponVariables>;
  operationName: string;
}
export const deleteWeaponRef: DeleteWeaponRef;

export function deleteWeapon(vars: DeleteWeaponVariables): MutationPromise<DeleteWeaponData, DeleteWeaponVariables>;
export function deleteWeapon(dc: DataConnect, vars: DeleteWeaponVariables): MutationPromise<DeleteWeaponData, DeleteWeaponVariables>;

interface ListCharactersByWorldRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCharactersByWorldVariables): QueryRef<ListCharactersByWorldData, ListCharactersByWorldVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListCharactersByWorldVariables): QueryRef<ListCharactersByWorldData, ListCharactersByWorldVariables>;
  operationName: string;
}
export const listCharactersByWorldRef: ListCharactersByWorldRef;

export function listCharactersByWorld(vars: ListCharactersByWorldVariables): QueryPromise<ListCharactersByWorldData, ListCharactersByWorldVariables>;
export function listCharactersByWorld(dc: DataConnect, vars: ListCharactersByWorldVariables): QueryPromise<ListCharactersByWorldData, ListCharactersByWorldVariables>;

interface GetCharacterRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCharacterVariables): QueryRef<GetCharacterData, GetCharacterVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCharacterVariables): QueryRef<GetCharacterData, GetCharacterVariables>;
  operationName: string;
}
export const getCharacterRef: GetCharacterRef;

export function getCharacter(vars: GetCharacterVariables): QueryPromise<GetCharacterData, GetCharacterVariables>;
export function getCharacter(dc: DataConnect, vars: GetCharacterVariables): QueryPromise<GetCharacterData, GetCharacterVariables>;

interface CreateCharacterRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCharacterVariables): MutationRef<CreateCharacterData, CreateCharacterVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCharacterVariables): MutationRef<CreateCharacterData, CreateCharacterVariables>;
  operationName: string;
}
export const createCharacterRef: CreateCharacterRef;

export function createCharacter(vars: CreateCharacterVariables): MutationPromise<CreateCharacterData, CreateCharacterVariables>;
export function createCharacter(dc: DataConnect, vars: CreateCharacterVariables): MutationPromise<CreateCharacterData, CreateCharacterVariables>;

interface UpdateCharacterRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCharacterVariables): MutationRef<UpdateCharacterData, UpdateCharacterVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateCharacterVariables): MutationRef<UpdateCharacterData, UpdateCharacterVariables>;
  operationName: string;
}
export const updateCharacterRef: UpdateCharacterRef;

export function updateCharacter(vars: UpdateCharacterVariables): MutationPromise<UpdateCharacterData, UpdateCharacterVariables>;
export function updateCharacter(dc: DataConnect, vars: UpdateCharacterVariables): MutationPromise<UpdateCharacterData, UpdateCharacterVariables>;

interface DeleteCharacterRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCharacterVariables): MutationRef<DeleteCharacterData, DeleteCharacterVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteCharacterVariables): MutationRef<DeleteCharacterData, DeleteCharacterVariables>;
  operationName: string;
}
export const deleteCharacterRef: DeleteCharacterRef;

export function deleteCharacter(vars: DeleteCharacterVariables): MutationPromise<DeleteCharacterData, DeleteCharacterVariables>;
export function deleteCharacter(dc: DataConnect, vars: DeleteCharacterVariables): MutationPromise<DeleteCharacterData, DeleteCharacterVariables>;

