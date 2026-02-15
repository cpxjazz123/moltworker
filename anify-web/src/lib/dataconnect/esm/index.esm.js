import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const ItemRarity = {
  common: "common",
  uncommon: "uncommon",
  rare: "rare",
  epic: "epic",
  legendary: "legendary",
}

export const ItemType = {
  weapon: "weapon",
  armor: "armor",
  consumable: "consumable",
  material: "material",
  quest: "quest",
}

export const PlanType = {
  free: "free",
  subscription: "subscription",
  topup: "topup",
}

export const TokenDirection = {
  credit: "credit",
  debit: "debit",
}

export const WeaponRarity = {
  common: "common",
  rare: "rare",
  epic: "epic",
  legendary: "legendary",
}

export const WeaponType = {
  sword: "sword",
  spear: "spear",
  bow: "bow",
  staff: "staff",
  dagger: "dagger",
}

export const connectorConfig = {
  connector: 'anify',
  service: 'anify-db-service',
  location: 'asia-southeast1'
};

export const getPlayerProfileRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPlayerProfile');
}
getPlayerProfileRef.operationName = 'GetPlayerProfile';

export function getPlayerProfile(dc) {
  return executeQuery(getPlayerProfileRef(dc));
}

export const getPlayerTutorialRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPlayerTutorial');
}
getPlayerTutorialRef.operationName = 'GetPlayerTutorial';

export function getPlayerTutorial(dc) {
  return executeQuery(getPlayerTutorialRef(dc));
}

export const getPlayerStateSummaryRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPlayerStateSummary');
}
getPlayerStateSummaryRef.operationName = 'GetPlayerStateSummary';

export function getPlayerStateSummary(dc) {
  return executeQuery(getPlayerStateSummaryRef(dc));
}

export const initializePlayerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InitializePlayer', inputVars);
}
initializePlayerRef.operationName = 'InitializePlayer';

export function initializePlayer(dcOrVars, vars) {
  return executeMutation(initializePlayerRef(dcOrVars, vars));
}

export const updatePlayerProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePlayerProfile', inputVars);
}
updatePlayerProfileRef.operationName = 'UpdatePlayerProfile';

export function updatePlayerProfile(dcOrVars, vars) {
  return executeMutation(updatePlayerProfileRef(dcOrVars, vars));
}

export const startTutorialRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'StartTutorial');
}
startTutorialRef.operationName = 'StartTutorial';

export function startTutorial(dc) {
  return executeMutation(startTutorialRef(dc));
}

export const advanceTutorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdvanceTutorial', inputVars);
}
advanceTutorialRef.operationName = 'AdvanceTutorial';

export function advanceTutorial(dcOrVars, vars) {
  return executeMutation(advanceTutorialRef(dcOrVars, vars));
}

export const completeTutorialRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CompleteTutorial');
}
completeTutorialRef.operationName = 'CompleteTutorial';

export function completeTutorial(dc) {
  return executeMutation(completeTutorialRef(dc));
}

export const resetTutorialRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ResetTutorial');
}
resetTutorialRef.operationName = 'ResetTutorial';

export function resetTutorial(dc) {
  return executeMutation(resetTutorialRef(dc));
}

export const adminGetPlayerProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminGetPlayerProfile', inputVars);
}
adminGetPlayerProfileRef.operationName = 'AdminGetPlayerProfile';

export function adminGetPlayerProfile(dcOrVars, vars) {
  return executeQuery(adminGetPlayerProfileRef(dcOrVars, vars));
}

export const adminGetPlayerTutorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminGetPlayerTutorial', inputVars);
}
adminGetPlayerTutorialRef.operationName = 'AdminGetPlayerTutorial';

export function adminGetPlayerTutorial(dcOrVars, vars) {
  return executeQuery(adminGetPlayerTutorialRef(dcOrVars, vars));
}

export const adminGetPlayerStateSummaryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminGetPlayerStateSummary', inputVars);
}
adminGetPlayerStateSummaryRef.operationName = 'AdminGetPlayerStateSummary';

export function adminGetPlayerStateSummary(dcOrVars, vars) {
  return executeQuery(adminGetPlayerStateSummaryRef(dcOrVars, vars));
}

export const adminInitializePlayerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminInitializePlayer', inputVars);
}
adminInitializePlayerRef.operationName = 'AdminInitializePlayer';

export function adminInitializePlayer(dcOrVars, vars) {
  return executeMutation(adminInitializePlayerRef(dcOrVars, vars));
}

export const adminUpdatePlayerProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminUpdatePlayerProfile', inputVars);
}
adminUpdatePlayerProfileRef.operationName = 'AdminUpdatePlayerProfile';

export function adminUpdatePlayerProfile(dcOrVars, vars) {
  return executeMutation(adminUpdatePlayerProfileRef(dcOrVars, vars));
}

export const adminStartTutorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminStartTutorial', inputVars);
}
adminStartTutorialRef.operationName = 'AdminStartTutorial';

export function adminStartTutorial(dcOrVars, vars) {
  return executeMutation(adminStartTutorialRef(dcOrVars, vars));
}

export const adminAdvanceTutorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminAdvanceTutorial', inputVars);
}
adminAdvanceTutorialRef.operationName = 'AdminAdvanceTutorial';

export function adminAdvanceTutorial(dcOrVars, vars) {
  return executeMutation(adminAdvanceTutorialRef(dcOrVars, vars));
}

export const adminCompleteTutorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminCompleteTutorial', inputVars);
}
adminCompleteTutorialRef.operationName = 'AdminCompleteTutorial';

export function adminCompleteTutorial(dcOrVars, vars) {
  return executeMutation(adminCompleteTutorialRef(dcOrVars, vars));
}

export const adminResetTutorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminResetTutorial', inputVars);
}
adminResetTutorialRef.operationName = 'AdminResetTutorial';

export function adminResetTutorial(dcOrVars, vars) {
  return executeMutation(adminResetTutorialRef(dcOrVars, vars));
}

export const listResourcesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListResources');
}
listResourcesRef.operationName = 'ListResources';

export function listResources(dc) {
  return executeQuery(listResourcesRef(dc));
}

export const getResourceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetResource', inputVars);
}
getResourceRef.operationName = 'GetResource';

export function getResource(dcOrVars, vars) {
  return executeQuery(getResourceRef(dcOrVars, vars));
}

export const createResourceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateResource', inputVars);
}
createResourceRef.operationName = 'CreateResource';

export function createResource(dcOrVars, vars) {
  return executeMutation(createResourceRef(dcOrVars, vars));
}

export const updateResourceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateResource', inputVars);
}
updateResourceRef.operationName = 'UpdateResource';

export function updateResource(dcOrVars, vars) {
  return executeMutation(updateResourceRef(dcOrVars, vars));
}

export const deleteResourceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteResource', inputVars);
}
deleteResourceRef.operationName = 'DeleteResource';

export function deleteResource(dcOrVars, vars) {
  return executeMutation(deleteResourceRef(dcOrVars, vars));
}

export const listScenesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListScenes');
}
listScenesRef.operationName = 'ListScenes';

export function listScenes(dc) {
  return executeQuery(listScenesRef(dc));
}

export const listScenesByWorldRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListScenesByWorld', inputVars);
}
listScenesByWorldRef.operationName = 'ListScenesByWorld';

export function listScenesByWorld(dcOrVars, vars) {
  return executeQuery(listScenesByWorldRef(dcOrVars, vars));
}

export const getSceneRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetScene', inputVars);
}
getSceneRef.operationName = 'GetScene';

export function getScene(dcOrVars, vars) {
  return executeQuery(getSceneRef(dcOrVars, vars));
}

export const createSceneRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateScene', inputVars);
}
createSceneRef.operationName = 'CreateScene';

export function createScene(dcOrVars, vars) {
  return executeMutation(createSceneRef(dcOrVars, vars));
}

export const updateSceneRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateScene', inputVars);
}
updateSceneRef.operationName = 'UpdateScene';

export function updateScene(dcOrVars, vars) {
  return executeMutation(updateSceneRef(dcOrVars, vars));
}

export const deleteSceneRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteScene', inputVars);
}
deleteSceneRef.operationName = 'DeleteScene';

export function deleteScene(dcOrVars, vars) {
  return executeMutation(deleteSceneRef(dcOrVars, vars));
}

export const listMyWorldsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyWorlds');
}
listMyWorldsRef.operationName = 'ListMyWorlds';

export function listMyWorlds(dc) {
  return executeQuery(listMyWorldsRef(dc));
}

export const listCollaboratingWorldsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCollaboratingWorlds');
}
listCollaboratingWorldsRef.operationName = 'ListCollaboratingWorlds';

export function listCollaboratingWorlds(dc) {
  return executeQuery(listCollaboratingWorldsRef(dc));
}

export const getWorldRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetWorld', inputVars);
}
getWorldRef.operationName = 'GetWorld';

export function getWorld(dcOrVars, vars) {
  return executeQuery(getWorldRef(dcOrVars, vars));
}

export const createWorldRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateWorld', inputVars);
}
createWorldRef.operationName = 'CreateWorld';

export function createWorld(dcOrVars, vars) {
  return executeMutation(createWorldRef(dcOrVars, vars));
}

export const updateWorldRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateWorld', inputVars);
}
updateWorldRef.operationName = 'UpdateWorld';

export function updateWorld(dcOrVars, vars) {
  return executeMutation(updateWorldRef(dcOrVars, vars));
}

export const deleteWorldRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteWorld', inputVars);
}
deleteWorldRef.operationName = 'DeleteWorld';

export function deleteWorld(dcOrVars, vars) {
  return executeMutation(deleteWorldRef(dcOrVars, vars));
}

export const listCollaboratorsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCollaborators', inputVars);
}
listCollaboratorsRef.operationName = 'ListCollaborators';

export function listCollaborators(dcOrVars, vars) {
  return executeQuery(listCollaboratorsRef(dcOrVars, vars));
}

export const findUserByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'FindUserByEmail', inputVars);
}
findUserByEmailRef.operationName = 'FindUserByEmail';

export function findUserByEmail(dcOrVars, vars) {
  return executeQuery(findUserByEmailRef(dcOrVars, vars));
}

export const addCollaboratorRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddCollaborator', inputVars);
}
addCollaboratorRef.operationName = 'AddCollaborator';

export function addCollaborator(dcOrVars, vars) {
  return executeMutation(addCollaboratorRef(dcOrVars, vars));
}

export const removeCollaboratorRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RemoveCollaborator', inputVars);
}
removeCollaboratorRef.operationName = 'RemoveCollaborator';

export function removeCollaborator(dcOrVars, vars) {
  return executeMutation(removeCollaboratorRef(dcOrVars, vars));
}

export const listItemsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListItems');
}
listItemsRef.operationName = 'ListItems';

export function listItems(dc) {
  return executeQuery(listItemsRef(dc));
}

export const getItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetItem', inputVars);
}
getItemRef.operationName = 'GetItem';

export function getItem(dcOrVars, vars) {
  return executeQuery(getItemRef(dcOrVars, vars));
}

export const listItemsByTypeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListItemsByType', inputVars);
}
listItemsByTypeRef.operationName = 'ListItemsByType';

export function listItemsByType(dcOrVars, vars) {
  return executeQuery(listItemsByTypeRef(dcOrVars, vars));
}

export const listItemsByRarityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListItemsByRarity', inputVars);
}
listItemsByRarityRef.operationName = 'ListItemsByRarity';

export function listItemsByRarity(dcOrVars, vars) {
  return executeQuery(listItemsByRarityRef(dcOrVars, vars));
}

export const createItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateItem', inputVars);
}
createItemRef.operationName = 'CreateItem';

export function createItem(dcOrVars, vars) {
  return executeMutation(createItemRef(dcOrVars, vars));
}

export const updateItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateItem', inputVars);
}
updateItemRef.operationName = 'UpdateItem';

export function updateItem(dcOrVars, vars) {
  return executeMutation(updateItemRef(dcOrVars, vars));
}

export const deleteItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteItem', inputVars);
}
deleteItemRef.operationName = 'DeleteItem';

export function deleteItem(dcOrVars, vars) {
  return executeMutation(deleteItemRef(dcOrVars, vars));
}

export const getTokenSummaryRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTokenSummary');
}
getTokenSummaryRef.operationName = 'GetTokenSummary';

export function getTokenSummary(dc) {
  return executeQuery(getTokenSummaryRef(dc));
}

export const getTokenEventsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTokenEvents', inputVars);
}
getTokenEventsRef.operationName = 'GetTokenEvents';

export function getTokenEvents(dcOrVars, vars) {
  return executeQuery(getTokenEventsRef(dcOrVars, vars));
}

export const createTokenWalletRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTokenWallet');
}
createTokenWalletRef.operationName = 'CreateTokenWallet';

export function createTokenWallet(dc) {
  return executeMutation(createTokenWalletRef(dc));
}

export const adminCreateTokenWalletRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminCreateTokenWallet', inputVars);
}
adminCreateTokenWalletRef.operationName = 'AdminCreateTokenWallet';

export function adminCreateTokenWallet(dcOrVars, vars) {
  return executeMutation(adminCreateTokenWalletRef(dcOrVars, vars));
}

export const adminUpdateTokenWalletRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminUpdateTokenWallet', inputVars);
}
adminUpdateTokenWalletRef.operationName = 'AdminUpdateTokenWallet';

export function adminUpdateTokenWallet(dcOrVars, vars) {
  return executeMutation(adminUpdateTokenWalletRef(dcOrVars, vars));
}

export const adminCreateTokenEventRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminCreateTokenEvent', inputVars);
}
adminCreateTokenEventRef.operationName = 'AdminCreateTokenEvent';

export function adminCreateTokenEvent(dcOrVars, vars) {
  return executeMutation(adminCreateTokenEventRef(dcOrVars, vars));
}

export const adminConsumeTokensRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminConsumeTokens', inputVars);
}
adminConsumeTokensRef.operationName = 'AdminConsumeTokens';

export function adminConsumeTokens(dcOrVars, vars) {
  return executeMutation(adminConsumeTokensRef(dcOrVars, vars));
}

export const adminCreditTokensRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminCreditTokens', inputVars);
}
adminCreditTokensRef.operationName = 'AdminCreditTokens';

export function adminCreditTokens(dcOrVars, vars) {
  return executeMutation(adminCreditTokensRef(dcOrVars, vars));
}

export const adminGetTokenWalletRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminGetTokenWallet', inputVars);
}
adminGetTokenWalletRef.operationName = 'AdminGetTokenWallet';

export function adminGetTokenWallet(dcOrVars, vars) {
  return executeQuery(adminGetTokenWalletRef(dcOrVars, vars));
}

export const getUserAttributesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserAttributes');
}
getUserAttributesRef.operationName = 'GetUserAttributes';

export function getUserAttributes(dc) {
  return executeQuery(getUserAttributesRef(dc));
}

export const getUserInventoryRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserInventory');
}
getUserInventoryRef.operationName = 'GetUserInventory';

export function getUserInventory(dc) {
  return executeQuery(getUserInventoryRef(dc));
}

export const getUserProfileRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserProfile');
}
getUserProfileRef.operationName = 'GetUserProfile';

export function getUserProfile(dc) {
  return executeQuery(getUserProfileRef(dc));
}

export const createUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser');
}
createUserRef.operationName = 'CreateUser';

export function createUser(dc) {
  return executeMutation(createUserRef(dc));
}

export const upsertUserWithEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertUserWithEmail', inputVars);
}
upsertUserWithEmailRef.operationName = 'UpsertUserWithEmail';

export function upsertUserWithEmail(dcOrVars, vars) {
  return executeMutation(upsertUserWithEmailRef(dcOrVars, vars));
}

export const createUserAttributesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUserAttributes');
}
createUserAttributesRef.operationName = 'CreateUserAttributes';

export function createUserAttributes(dc) {
  return executeMutation(createUserAttributesRef(dc));
}

export const updateUserAttributesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserAttributes', inputVars);
}
updateUserAttributesRef.operationName = 'UpdateUserAttributes';

export function updateUserAttributes(dcOrVars, vars) {
  return executeMutation(updateUserAttributesRef(dcOrVars, vars));
}

export const resetUserAttributesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ResetUserAttributes');
}
resetUserAttributesRef.operationName = 'ResetUserAttributes';

export function resetUserAttributes(dc) {
  return executeMutation(resetUserAttributesRef(dc));
}

export const addInventoryItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddInventoryItem', inputVars);
}
addInventoryItemRef.operationName = 'AddInventoryItem';

export function addInventoryItem(dcOrVars, vars) {
  return executeMutation(addInventoryItemRef(dcOrVars, vars));
}

export const removeInventoryItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RemoveInventoryItem', inputVars);
}
removeInventoryItemRef.operationName = 'RemoveInventoryItem';

export function removeInventoryItem(dcOrVars, vars) {
  return executeMutation(removeInventoryItemRef(dcOrVars, vars));
}

export const adminCreateUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminCreateUser', inputVars);
}
adminCreateUserRef.operationName = 'AdminCreateUser';

export function adminCreateUser(dcOrVars, vars) {
  return executeMutation(adminCreateUserRef(dcOrVars, vars));
}

export const adminCreateUserAttributesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminCreateUserAttributes', inputVars);
}
adminCreateUserAttributesRef.operationName = 'AdminCreateUserAttributes';

export function adminCreateUserAttributes(dcOrVars, vars) {
  return executeMutation(adminCreateUserAttributesRef(dcOrVars, vars));
}

export const adminUpdateUserAttributesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminUpdateUserAttributes', inputVars);
}
adminUpdateUserAttributesRef.operationName = 'AdminUpdateUserAttributes';

export function adminUpdateUserAttributes(dcOrVars, vars) {
  return executeMutation(adminUpdateUserAttributesRef(dcOrVars, vars));
}

export const adminAddInventoryItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminAddInventoryItem', inputVars);
}
adminAddInventoryItemRef.operationName = 'AdminAddInventoryItem';

export function adminAddInventoryItem(dcOrVars, vars) {
  return executeMutation(adminAddInventoryItemRef(dcOrVars, vars));
}

export const adminRemoveInventoryItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminRemoveInventoryItem', inputVars);
}
adminRemoveInventoryItemRef.operationName = 'AdminRemoveInventoryItem';

export function adminRemoveInventoryItem(dcOrVars, vars) {
  return executeMutation(adminRemoveInventoryItemRef(dcOrVars, vars));
}

export const listWeaponsByWorldRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListWeaponsByWorld', inputVars);
}
listWeaponsByWorldRef.operationName = 'ListWeaponsByWorld';

export function listWeaponsByWorld(dcOrVars, vars) {
  return executeQuery(listWeaponsByWorldRef(dcOrVars, vars));
}

export const getWeaponRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetWeapon', inputVars);
}
getWeaponRef.operationName = 'GetWeapon';

export function getWeapon(dcOrVars, vars) {
  return executeQuery(getWeaponRef(dcOrVars, vars));
}

export const createWeaponRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateWeapon', inputVars);
}
createWeaponRef.operationName = 'CreateWeapon';

export function createWeapon(dcOrVars, vars) {
  return executeMutation(createWeaponRef(dcOrVars, vars));
}

export const updateWeaponRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateWeapon', inputVars);
}
updateWeaponRef.operationName = 'UpdateWeapon';

export function updateWeapon(dcOrVars, vars) {
  return executeMutation(updateWeaponRef(dcOrVars, vars));
}

export const deleteWeaponRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteWeapon', inputVars);
}
deleteWeaponRef.operationName = 'DeleteWeapon';

export function deleteWeapon(dcOrVars, vars) {
  return executeMutation(deleteWeaponRef(dcOrVars, vars));
}

export const listCharactersByWorldRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCharactersByWorld', inputVars);
}
listCharactersByWorldRef.operationName = 'ListCharactersByWorld';

export function listCharactersByWorld(dcOrVars, vars) {
  return executeQuery(listCharactersByWorldRef(dcOrVars, vars));
}

export const getCharacterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCharacter', inputVars);
}
getCharacterRef.operationName = 'GetCharacter';

export function getCharacter(dcOrVars, vars) {
  return executeQuery(getCharacterRef(dcOrVars, vars));
}

export const createCharacterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCharacter', inputVars);
}
createCharacterRef.operationName = 'CreateCharacter';

export function createCharacter(dcOrVars, vars) {
  return executeMutation(createCharacterRef(dcOrVars, vars));
}

export const updateCharacterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateCharacter', inputVars);
}
updateCharacterRef.operationName = 'UpdateCharacter';

export function updateCharacter(dcOrVars, vars) {
  return executeMutation(updateCharacterRef(dcOrVars, vars));
}

export const deleteCharacterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteCharacter', inputVars);
}
deleteCharacterRef.operationName = 'DeleteCharacter';

export function deleteCharacter(dcOrVars, vars) {
  return executeMutation(deleteCharacterRef(dcOrVars, vars));
}

