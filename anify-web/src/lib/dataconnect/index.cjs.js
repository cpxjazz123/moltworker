const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const ItemRarity = {
  common: "common",
  uncommon: "uncommon",
  rare: "rare",
  epic: "epic",
  legendary: "legendary",
}
exports.ItemRarity = ItemRarity;

const ItemType = {
  weapon: "weapon",
  armor: "armor",
  consumable: "consumable",
  material: "material",
  quest: "quest",
}
exports.ItemType = ItemType;

const PlanType = {
  free: "free",
  subscription: "subscription",
  topup: "topup",
}
exports.PlanType = PlanType;

const TokenDirection = {
  credit: "credit",
  debit: "debit",
}
exports.TokenDirection = TokenDirection;

const WeaponRarity = {
  common: "common",
  rare: "rare",
  epic: "epic",
  legendary: "legendary",
}
exports.WeaponRarity = WeaponRarity;

const WeaponType = {
  sword: "sword",
  spear: "spear",
  bow: "bow",
  staff: "staff",
  dagger: "dagger",
}
exports.WeaponType = WeaponType;

const connectorConfig = {
  connector: 'anify',
  service: 'anify-db-service',
  location: 'asia-southeast1'
};
exports.connectorConfig = connectorConfig;

const getPlayerProfileRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPlayerProfile');
}
getPlayerProfileRef.operationName = 'GetPlayerProfile';
exports.getPlayerProfileRef = getPlayerProfileRef;

exports.getPlayerProfile = function getPlayerProfile(dc) {
  return executeQuery(getPlayerProfileRef(dc));
};

const getPlayerTutorialRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPlayerTutorial');
}
getPlayerTutorialRef.operationName = 'GetPlayerTutorial';
exports.getPlayerTutorialRef = getPlayerTutorialRef;

exports.getPlayerTutorial = function getPlayerTutorial(dc) {
  return executeQuery(getPlayerTutorialRef(dc));
};

const getPlayerStateSummaryRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPlayerStateSummary');
}
getPlayerStateSummaryRef.operationName = 'GetPlayerStateSummary';
exports.getPlayerStateSummaryRef = getPlayerStateSummaryRef;

exports.getPlayerStateSummary = function getPlayerStateSummary(dc) {
  return executeQuery(getPlayerStateSummaryRef(dc));
};

const initializePlayerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InitializePlayer', inputVars);
}
initializePlayerRef.operationName = 'InitializePlayer';
exports.initializePlayerRef = initializePlayerRef;

exports.initializePlayer = function initializePlayer(dcOrVars, vars) {
  return executeMutation(initializePlayerRef(dcOrVars, vars));
};

const updatePlayerProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePlayerProfile', inputVars);
}
updatePlayerProfileRef.operationName = 'UpdatePlayerProfile';
exports.updatePlayerProfileRef = updatePlayerProfileRef;

exports.updatePlayerProfile = function updatePlayerProfile(dcOrVars, vars) {
  return executeMutation(updatePlayerProfileRef(dcOrVars, vars));
};

const startTutorialRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'StartTutorial');
}
startTutorialRef.operationName = 'StartTutorial';
exports.startTutorialRef = startTutorialRef;

exports.startTutorial = function startTutorial(dc) {
  return executeMutation(startTutorialRef(dc));
};

const advanceTutorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdvanceTutorial', inputVars);
}
advanceTutorialRef.operationName = 'AdvanceTutorial';
exports.advanceTutorialRef = advanceTutorialRef;

exports.advanceTutorial = function advanceTutorial(dcOrVars, vars) {
  return executeMutation(advanceTutorialRef(dcOrVars, vars));
};

const completeTutorialRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CompleteTutorial');
}
completeTutorialRef.operationName = 'CompleteTutorial';
exports.completeTutorialRef = completeTutorialRef;

exports.completeTutorial = function completeTutorial(dc) {
  return executeMutation(completeTutorialRef(dc));
};

const resetTutorialRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ResetTutorial');
}
resetTutorialRef.operationName = 'ResetTutorial';
exports.resetTutorialRef = resetTutorialRef;

exports.resetTutorial = function resetTutorial(dc) {
  return executeMutation(resetTutorialRef(dc));
};

const adminGetPlayerProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminGetPlayerProfile', inputVars);
}
adminGetPlayerProfileRef.operationName = 'AdminGetPlayerProfile';
exports.adminGetPlayerProfileRef = adminGetPlayerProfileRef;

exports.adminGetPlayerProfile = function adminGetPlayerProfile(dcOrVars, vars) {
  return executeQuery(adminGetPlayerProfileRef(dcOrVars, vars));
};

const adminGetPlayerTutorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminGetPlayerTutorial', inputVars);
}
adminGetPlayerTutorialRef.operationName = 'AdminGetPlayerTutorial';
exports.adminGetPlayerTutorialRef = adminGetPlayerTutorialRef;

exports.adminGetPlayerTutorial = function adminGetPlayerTutorial(dcOrVars, vars) {
  return executeQuery(adminGetPlayerTutorialRef(dcOrVars, vars));
};

const adminGetPlayerStateSummaryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminGetPlayerStateSummary', inputVars);
}
adminGetPlayerStateSummaryRef.operationName = 'AdminGetPlayerStateSummary';
exports.adminGetPlayerStateSummaryRef = adminGetPlayerStateSummaryRef;

exports.adminGetPlayerStateSummary = function adminGetPlayerStateSummary(dcOrVars, vars) {
  return executeQuery(adminGetPlayerStateSummaryRef(dcOrVars, vars));
};

const adminInitializePlayerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminInitializePlayer', inputVars);
}
adminInitializePlayerRef.operationName = 'AdminInitializePlayer';
exports.adminInitializePlayerRef = adminInitializePlayerRef;

exports.adminInitializePlayer = function adminInitializePlayer(dcOrVars, vars) {
  return executeMutation(adminInitializePlayerRef(dcOrVars, vars));
};

const adminUpdatePlayerProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminUpdatePlayerProfile', inputVars);
}
adminUpdatePlayerProfileRef.operationName = 'AdminUpdatePlayerProfile';
exports.adminUpdatePlayerProfileRef = adminUpdatePlayerProfileRef;

exports.adminUpdatePlayerProfile = function adminUpdatePlayerProfile(dcOrVars, vars) {
  return executeMutation(adminUpdatePlayerProfileRef(dcOrVars, vars));
};

const adminStartTutorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminStartTutorial', inputVars);
}
adminStartTutorialRef.operationName = 'AdminStartTutorial';
exports.adminStartTutorialRef = adminStartTutorialRef;

exports.adminStartTutorial = function adminStartTutorial(dcOrVars, vars) {
  return executeMutation(adminStartTutorialRef(dcOrVars, vars));
};

const adminAdvanceTutorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminAdvanceTutorial', inputVars);
}
adminAdvanceTutorialRef.operationName = 'AdminAdvanceTutorial';
exports.adminAdvanceTutorialRef = adminAdvanceTutorialRef;

exports.adminAdvanceTutorial = function adminAdvanceTutorial(dcOrVars, vars) {
  return executeMutation(adminAdvanceTutorialRef(dcOrVars, vars));
};

const adminCompleteTutorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminCompleteTutorial', inputVars);
}
adminCompleteTutorialRef.operationName = 'AdminCompleteTutorial';
exports.adminCompleteTutorialRef = adminCompleteTutorialRef;

exports.adminCompleteTutorial = function adminCompleteTutorial(dcOrVars, vars) {
  return executeMutation(adminCompleteTutorialRef(dcOrVars, vars));
};

const adminResetTutorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminResetTutorial', inputVars);
}
adminResetTutorialRef.operationName = 'AdminResetTutorial';
exports.adminResetTutorialRef = adminResetTutorialRef;

exports.adminResetTutorial = function adminResetTutorial(dcOrVars, vars) {
  return executeMutation(adminResetTutorialRef(dcOrVars, vars));
};

const listResourcesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListResources');
}
listResourcesRef.operationName = 'ListResources';
exports.listResourcesRef = listResourcesRef;

exports.listResources = function listResources(dc) {
  return executeQuery(listResourcesRef(dc));
};

const getResourceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetResource', inputVars);
}
getResourceRef.operationName = 'GetResource';
exports.getResourceRef = getResourceRef;

exports.getResource = function getResource(dcOrVars, vars) {
  return executeQuery(getResourceRef(dcOrVars, vars));
};

const createResourceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateResource', inputVars);
}
createResourceRef.operationName = 'CreateResource';
exports.createResourceRef = createResourceRef;

exports.createResource = function createResource(dcOrVars, vars) {
  return executeMutation(createResourceRef(dcOrVars, vars));
};

const updateResourceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateResource', inputVars);
}
updateResourceRef.operationName = 'UpdateResource';
exports.updateResourceRef = updateResourceRef;

exports.updateResource = function updateResource(dcOrVars, vars) {
  return executeMutation(updateResourceRef(dcOrVars, vars));
};

const deleteResourceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteResource', inputVars);
}
deleteResourceRef.operationName = 'DeleteResource';
exports.deleteResourceRef = deleteResourceRef;

exports.deleteResource = function deleteResource(dcOrVars, vars) {
  return executeMutation(deleteResourceRef(dcOrVars, vars));
};

const listScenesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListScenes');
}
listScenesRef.operationName = 'ListScenes';
exports.listScenesRef = listScenesRef;

exports.listScenes = function listScenes(dc) {
  return executeQuery(listScenesRef(dc));
};

const listScenesByWorldRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListScenesByWorld', inputVars);
}
listScenesByWorldRef.operationName = 'ListScenesByWorld';
exports.listScenesByWorldRef = listScenesByWorldRef;

exports.listScenesByWorld = function listScenesByWorld(dcOrVars, vars) {
  return executeQuery(listScenesByWorldRef(dcOrVars, vars));
};

const getSceneRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetScene', inputVars);
}
getSceneRef.operationName = 'GetScene';
exports.getSceneRef = getSceneRef;

exports.getScene = function getScene(dcOrVars, vars) {
  return executeQuery(getSceneRef(dcOrVars, vars));
};

const createSceneRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateScene', inputVars);
}
createSceneRef.operationName = 'CreateScene';
exports.createSceneRef = createSceneRef;

exports.createScene = function createScene(dcOrVars, vars) {
  return executeMutation(createSceneRef(dcOrVars, vars));
};

const updateSceneRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateScene', inputVars);
}
updateSceneRef.operationName = 'UpdateScene';
exports.updateSceneRef = updateSceneRef;

exports.updateScene = function updateScene(dcOrVars, vars) {
  return executeMutation(updateSceneRef(dcOrVars, vars));
};

const deleteSceneRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteScene', inputVars);
}
deleteSceneRef.operationName = 'DeleteScene';
exports.deleteSceneRef = deleteSceneRef;

exports.deleteScene = function deleteScene(dcOrVars, vars) {
  return executeMutation(deleteSceneRef(dcOrVars, vars));
};

const listMyWorldsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyWorlds');
}
listMyWorldsRef.operationName = 'ListMyWorlds';
exports.listMyWorldsRef = listMyWorldsRef;

exports.listMyWorlds = function listMyWorlds(dc) {
  return executeQuery(listMyWorldsRef(dc));
};

const listCollaboratingWorldsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCollaboratingWorlds');
}
listCollaboratingWorldsRef.operationName = 'ListCollaboratingWorlds';
exports.listCollaboratingWorldsRef = listCollaboratingWorldsRef;

exports.listCollaboratingWorlds = function listCollaboratingWorlds(dc) {
  return executeQuery(listCollaboratingWorldsRef(dc));
};

const getWorldRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetWorld', inputVars);
}
getWorldRef.operationName = 'GetWorld';
exports.getWorldRef = getWorldRef;

exports.getWorld = function getWorld(dcOrVars, vars) {
  return executeQuery(getWorldRef(dcOrVars, vars));
};

const createWorldRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateWorld', inputVars);
}
createWorldRef.operationName = 'CreateWorld';
exports.createWorldRef = createWorldRef;

exports.createWorld = function createWorld(dcOrVars, vars) {
  return executeMutation(createWorldRef(dcOrVars, vars));
};

const updateWorldRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateWorld', inputVars);
}
updateWorldRef.operationName = 'UpdateWorld';
exports.updateWorldRef = updateWorldRef;

exports.updateWorld = function updateWorld(dcOrVars, vars) {
  return executeMutation(updateWorldRef(dcOrVars, vars));
};

const deleteWorldRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteWorld', inputVars);
}
deleteWorldRef.operationName = 'DeleteWorld';
exports.deleteWorldRef = deleteWorldRef;

exports.deleteWorld = function deleteWorld(dcOrVars, vars) {
  return executeMutation(deleteWorldRef(dcOrVars, vars));
};

const listCollaboratorsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCollaborators', inputVars);
}
listCollaboratorsRef.operationName = 'ListCollaborators';
exports.listCollaboratorsRef = listCollaboratorsRef;

exports.listCollaborators = function listCollaborators(dcOrVars, vars) {
  return executeQuery(listCollaboratorsRef(dcOrVars, vars));
};

const findUserByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'FindUserByEmail', inputVars);
}
findUserByEmailRef.operationName = 'FindUserByEmail';
exports.findUserByEmailRef = findUserByEmailRef;

exports.findUserByEmail = function findUserByEmail(dcOrVars, vars) {
  return executeQuery(findUserByEmailRef(dcOrVars, vars));
};

const addCollaboratorRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddCollaborator', inputVars);
}
addCollaboratorRef.operationName = 'AddCollaborator';
exports.addCollaboratorRef = addCollaboratorRef;

exports.addCollaborator = function addCollaborator(dcOrVars, vars) {
  return executeMutation(addCollaboratorRef(dcOrVars, vars));
};

const removeCollaboratorRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RemoveCollaborator', inputVars);
}
removeCollaboratorRef.operationName = 'RemoveCollaborator';
exports.removeCollaboratorRef = removeCollaboratorRef;

exports.removeCollaborator = function removeCollaborator(dcOrVars, vars) {
  return executeMutation(removeCollaboratorRef(dcOrVars, vars));
};

const listItemsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListItems');
}
listItemsRef.operationName = 'ListItems';
exports.listItemsRef = listItemsRef;

exports.listItems = function listItems(dc) {
  return executeQuery(listItemsRef(dc));
};

const getItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetItem', inputVars);
}
getItemRef.operationName = 'GetItem';
exports.getItemRef = getItemRef;

exports.getItem = function getItem(dcOrVars, vars) {
  return executeQuery(getItemRef(dcOrVars, vars));
};

const listItemsByTypeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListItemsByType', inputVars);
}
listItemsByTypeRef.operationName = 'ListItemsByType';
exports.listItemsByTypeRef = listItemsByTypeRef;

exports.listItemsByType = function listItemsByType(dcOrVars, vars) {
  return executeQuery(listItemsByTypeRef(dcOrVars, vars));
};

const listItemsByRarityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListItemsByRarity', inputVars);
}
listItemsByRarityRef.operationName = 'ListItemsByRarity';
exports.listItemsByRarityRef = listItemsByRarityRef;

exports.listItemsByRarity = function listItemsByRarity(dcOrVars, vars) {
  return executeQuery(listItemsByRarityRef(dcOrVars, vars));
};

const createItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateItem', inputVars);
}
createItemRef.operationName = 'CreateItem';
exports.createItemRef = createItemRef;

exports.createItem = function createItem(dcOrVars, vars) {
  return executeMutation(createItemRef(dcOrVars, vars));
};

const updateItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateItem', inputVars);
}
updateItemRef.operationName = 'UpdateItem';
exports.updateItemRef = updateItemRef;

exports.updateItem = function updateItem(dcOrVars, vars) {
  return executeMutation(updateItemRef(dcOrVars, vars));
};

const deleteItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteItem', inputVars);
}
deleteItemRef.operationName = 'DeleteItem';
exports.deleteItemRef = deleteItemRef;

exports.deleteItem = function deleteItem(dcOrVars, vars) {
  return executeMutation(deleteItemRef(dcOrVars, vars));
};

const getTokenSummaryRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTokenSummary');
}
getTokenSummaryRef.operationName = 'GetTokenSummary';
exports.getTokenSummaryRef = getTokenSummaryRef;

exports.getTokenSummary = function getTokenSummary(dc) {
  return executeQuery(getTokenSummaryRef(dc));
};

const getTokenEventsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTokenEvents', inputVars);
}
getTokenEventsRef.operationName = 'GetTokenEvents';
exports.getTokenEventsRef = getTokenEventsRef;

exports.getTokenEvents = function getTokenEvents(dcOrVars, vars) {
  return executeQuery(getTokenEventsRef(dcOrVars, vars));
};

const createTokenWalletRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTokenWallet');
}
createTokenWalletRef.operationName = 'CreateTokenWallet';
exports.createTokenWalletRef = createTokenWalletRef;

exports.createTokenWallet = function createTokenWallet(dc) {
  return executeMutation(createTokenWalletRef(dc));
};

const adminCreateTokenWalletRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminCreateTokenWallet', inputVars);
}
adminCreateTokenWalletRef.operationName = 'AdminCreateTokenWallet';
exports.adminCreateTokenWalletRef = adminCreateTokenWalletRef;

exports.adminCreateTokenWallet = function adminCreateTokenWallet(dcOrVars, vars) {
  return executeMutation(adminCreateTokenWalletRef(dcOrVars, vars));
};

const adminUpdateTokenWalletRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminUpdateTokenWallet', inputVars);
}
adminUpdateTokenWalletRef.operationName = 'AdminUpdateTokenWallet';
exports.adminUpdateTokenWalletRef = adminUpdateTokenWalletRef;

exports.adminUpdateTokenWallet = function adminUpdateTokenWallet(dcOrVars, vars) {
  return executeMutation(adminUpdateTokenWalletRef(dcOrVars, vars));
};

const adminCreateTokenEventRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminCreateTokenEvent', inputVars);
}
adminCreateTokenEventRef.operationName = 'AdminCreateTokenEvent';
exports.adminCreateTokenEventRef = adminCreateTokenEventRef;

exports.adminCreateTokenEvent = function adminCreateTokenEvent(dcOrVars, vars) {
  return executeMutation(adminCreateTokenEventRef(dcOrVars, vars));
};

const adminConsumeTokensRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminConsumeTokens', inputVars);
}
adminConsumeTokensRef.operationName = 'AdminConsumeTokens';
exports.adminConsumeTokensRef = adminConsumeTokensRef;

exports.adminConsumeTokens = function adminConsumeTokens(dcOrVars, vars) {
  return executeMutation(adminConsumeTokensRef(dcOrVars, vars));
};

const adminCreditTokensRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminCreditTokens', inputVars);
}
adminCreditTokensRef.operationName = 'AdminCreditTokens';
exports.adminCreditTokensRef = adminCreditTokensRef;

exports.adminCreditTokens = function adminCreditTokens(dcOrVars, vars) {
  return executeMutation(adminCreditTokensRef(dcOrVars, vars));
};

const adminGetTokenWalletRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminGetTokenWallet', inputVars);
}
adminGetTokenWalletRef.operationName = 'AdminGetTokenWallet';
exports.adminGetTokenWalletRef = adminGetTokenWalletRef;

exports.adminGetTokenWallet = function adminGetTokenWallet(dcOrVars, vars) {
  return executeQuery(adminGetTokenWalletRef(dcOrVars, vars));
};

const getUserAttributesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserAttributes');
}
getUserAttributesRef.operationName = 'GetUserAttributes';
exports.getUserAttributesRef = getUserAttributesRef;

exports.getUserAttributes = function getUserAttributes(dc) {
  return executeQuery(getUserAttributesRef(dc));
};

const getUserInventoryRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserInventory');
}
getUserInventoryRef.operationName = 'GetUserInventory';
exports.getUserInventoryRef = getUserInventoryRef;

exports.getUserInventory = function getUserInventory(dc) {
  return executeQuery(getUserInventoryRef(dc));
};

const getUserProfileRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserProfile');
}
getUserProfileRef.operationName = 'GetUserProfile';
exports.getUserProfileRef = getUserProfileRef;

exports.getUserProfile = function getUserProfile(dc) {
  return executeQuery(getUserProfileRef(dc));
};

const createUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser');
}
createUserRef.operationName = 'CreateUser';
exports.createUserRef = createUserRef;

exports.createUser = function createUser(dc) {
  return executeMutation(createUserRef(dc));
};

const upsertUserWithEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertUserWithEmail', inputVars);
}
upsertUserWithEmailRef.operationName = 'UpsertUserWithEmail';
exports.upsertUserWithEmailRef = upsertUserWithEmailRef;

exports.upsertUserWithEmail = function upsertUserWithEmail(dcOrVars, vars) {
  return executeMutation(upsertUserWithEmailRef(dcOrVars, vars));
};

const createUserAttributesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUserAttributes');
}
createUserAttributesRef.operationName = 'CreateUserAttributes';
exports.createUserAttributesRef = createUserAttributesRef;

exports.createUserAttributes = function createUserAttributes(dc) {
  return executeMutation(createUserAttributesRef(dc));
};

const updateUserAttributesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserAttributes', inputVars);
}
updateUserAttributesRef.operationName = 'UpdateUserAttributes';
exports.updateUserAttributesRef = updateUserAttributesRef;

exports.updateUserAttributes = function updateUserAttributes(dcOrVars, vars) {
  return executeMutation(updateUserAttributesRef(dcOrVars, vars));
};

const resetUserAttributesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ResetUserAttributes');
}
resetUserAttributesRef.operationName = 'ResetUserAttributes';
exports.resetUserAttributesRef = resetUserAttributesRef;

exports.resetUserAttributes = function resetUserAttributes(dc) {
  return executeMutation(resetUserAttributesRef(dc));
};

const addInventoryItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddInventoryItem', inputVars);
}
addInventoryItemRef.operationName = 'AddInventoryItem';
exports.addInventoryItemRef = addInventoryItemRef;

exports.addInventoryItem = function addInventoryItem(dcOrVars, vars) {
  return executeMutation(addInventoryItemRef(dcOrVars, vars));
};

const removeInventoryItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RemoveInventoryItem', inputVars);
}
removeInventoryItemRef.operationName = 'RemoveInventoryItem';
exports.removeInventoryItemRef = removeInventoryItemRef;

exports.removeInventoryItem = function removeInventoryItem(dcOrVars, vars) {
  return executeMutation(removeInventoryItemRef(dcOrVars, vars));
};

const adminCreateUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminCreateUser', inputVars);
}
adminCreateUserRef.operationName = 'AdminCreateUser';
exports.adminCreateUserRef = adminCreateUserRef;

exports.adminCreateUser = function adminCreateUser(dcOrVars, vars) {
  return executeMutation(adminCreateUserRef(dcOrVars, vars));
};

const adminCreateUserAttributesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminCreateUserAttributes', inputVars);
}
adminCreateUserAttributesRef.operationName = 'AdminCreateUserAttributes';
exports.adminCreateUserAttributesRef = adminCreateUserAttributesRef;

exports.adminCreateUserAttributes = function adminCreateUserAttributes(dcOrVars, vars) {
  return executeMutation(adminCreateUserAttributesRef(dcOrVars, vars));
};

const adminUpdateUserAttributesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminUpdateUserAttributes', inputVars);
}
adminUpdateUserAttributesRef.operationName = 'AdminUpdateUserAttributes';
exports.adminUpdateUserAttributesRef = adminUpdateUserAttributesRef;

exports.adminUpdateUserAttributes = function adminUpdateUserAttributes(dcOrVars, vars) {
  return executeMutation(adminUpdateUserAttributesRef(dcOrVars, vars));
};

const adminAddInventoryItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminAddInventoryItem', inputVars);
}
adminAddInventoryItemRef.operationName = 'AdminAddInventoryItem';
exports.adminAddInventoryItemRef = adminAddInventoryItemRef;

exports.adminAddInventoryItem = function adminAddInventoryItem(dcOrVars, vars) {
  return executeMutation(adminAddInventoryItemRef(dcOrVars, vars));
};

const adminRemoveInventoryItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminRemoveInventoryItem', inputVars);
}
adminRemoveInventoryItemRef.operationName = 'AdminRemoveInventoryItem';
exports.adminRemoveInventoryItemRef = adminRemoveInventoryItemRef;

exports.adminRemoveInventoryItem = function adminRemoveInventoryItem(dcOrVars, vars) {
  return executeMutation(adminRemoveInventoryItemRef(dcOrVars, vars));
};

const listWeaponsByWorldRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListWeaponsByWorld', inputVars);
}
listWeaponsByWorldRef.operationName = 'ListWeaponsByWorld';
exports.listWeaponsByWorldRef = listWeaponsByWorldRef;

exports.listWeaponsByWorld = function listWeaponsByWorld(dcOrVars, vars) {
  return executeQuery(listWeaponsByWorldRef(dcOrVars, vars));
};

const getWeaponRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetWeapon', inputVars);
}
getWeaponRef.operationName = 'GetWeapon';
exports.getWeaponRef = getWeaponRef;

exports.getWeapon = function getWeapon(dcOrVars, vars) {
  return executeQuery(getWeaponRef(dcOrVars, vars));
};

const createWeaponRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateWeapon', inputVars);
}
createWeaponRef.operationName = 'CreateWeapon';
exports.createWeaponRef = createWeaponRef;

exports.createWeapon = function createWeapon(dcOrVars, vars) {
  return executeMutation(createWeaponRef(dcOrVars, vars));
};

const updateWeaponRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateWeapon', inputVars);
}
updateWeaponRef.operationName = 'UpdateWeapon';
exports.updateWeaponRef = updateWeaponRef;

exports.updateWeapon = function updateWeapon(dcOrVars, vars) {
  return executeMutation(updateWeaponRef(dcOrVars, vars));
};

const deleteWeaponRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteWeapon', inputVars);
}
deleteWeaponRef.operationName = 'DeleteWeapon';
exports.deleteWeaponRef = deleteWeaponRef;

exports.deleteWeapon = function deleteWeapon(dcOrVars, vars) {
  return executeMutation(deleteWeaponRef(dcOrVars, vars));
};

const listCharactersByWorldRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCharactersByWorld', inputVars);
}
listCharactersByWorldRef.operationName = 'ListCharactersByWorld';
exports.listCharactersByWorldRef = listCharactersByWorldRef;

exports.listCharactersByWorld = function listCharactersByWorld(dcOrVars, vars) {
  return executeQuery(listCharactersByWorldRef(dcOrVars, vars));
};

const getCharacterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCharacter', inputVars);
}
getCharacterRef.operationName = 'GetCharacter';
exports.getCharacterRef = getCharacterRef;

exports.getCharacter = function getCharacter(dcOrVars, vars) {
  return executeQuery(getCharacterRef(dcOrVars, vars));
};

const createCharacterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCharacter', inputVars);
}
createCharacterRef.operationName = 'CreateCharacter';
exports.createCharacterRef = createCharacterRef;

exports.createCharacter = function createCharacter(dcOrVars, vars) {
  return executeMutation(createCharacterRef(dcOrVars, vars));
};

const updateCharacterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateCharacter', inputVars);
}
updateCharacterRef.operationName = 'UpdateCharacter';
exports.updateCharacterRef = updateCharacterRef;

exports.updateCharacter = function updateCharacter(dcOrVars, vars) {
  return executeMutation(updateCharacterRef(dcOrVars, vars));
};

const deleteCharacterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteCharacter', inputVars);
}
deleteCharacterRef.operationName = 'DeleteCharacter';
exports.deleteCharacterRef = deleteCharacterRef;

exports.deleteCharacter = function deleteCharacter(dcOrVars, vars) {
  return executeMutation(deleteCharacterRef(dcOrVars, vars));
};
