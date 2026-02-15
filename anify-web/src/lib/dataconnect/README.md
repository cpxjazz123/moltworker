# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `anify`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetPlayerProfile*](#getplayerprofile)
  - [*GetPlayerTutorial*](#getplayertutorial)
  - [*GetPlayerStateSummary*](#getplayerstatesummary)
  - [*AdminGetPlayerProfile*](#admingetplayerprofile)
  - [*AdminGetPlayerTutorial*](#admingetplayertutorial)
  - [*AdminGetPlayerStateSummary*](#admingetplayerstatesummary)
  - [*ListResources*](#listresources)
  - [*GetResource*](#getresource)
  - [*ListScenes*](#listscenes)
  - [*ListScenesByWorld*](#listscenesbyworld)
  - [*GetScene*](#getscene)
  - [*ListMyWorlds*](#listmyworlds)
  - [*ListCollaboratingWorlds*](#listcollaboratingworlds)
  - [*GetWorld*](#getworld)
  - [*ListCollaborators*](#listcollaborators)
  - [*FindUserByEmail*](#finduserbyemail)
  - [*ListItems*](#listitems)
  - [*GetItem*](#getitem)
  - [*ListItemsByType*](#listitemsbytype)
  - [*ListItemsByRarity*](#listitemsbyrarity)
  - [*GetTokenSummary*](#gettokensummary)
  - [*GetTokenEvents*](#gettokenevents)
  - [*AdminGetTokenWallet*](#admingettokenwallet)
  - [*GetUserAttributes*](#getuserattributes)
  - [*GetUserInventory*](#getuserinventory)
  - [*GetUserProfile*](#getuserprofile)
  - [*ListWeaponsByWorld*](#listweaponsbyworld)
  - [*GetWeapon*](#getweapon)
  - [*ListCharactersByWorld*](#listcharactersbyworld)
  - [*GetCharacter*](#getcharacter)
- [**Mutations**](#mutations)
  - [*InitializePlayer*](#initializeplayer)
  - [*UpdatePlayerProfile*](#updateplayerprofile)
  - [*StartTutorial*](#starttutorial)
  - [*AdvanceTutorial*](#advancetutorial)
  - [*CompleteTutorial*](#completetutorial)
  - [*ResetTutorial*](#resettutorial)
  - [*AdminInitializePlayer*](#admininitializeplayer)
  - [*AdminUpdatePlayerProfile*](#adminupdateplayerprofile)
  - [*AdminStartTutorial*](#adminstarttutorial)
  - [*AdminAdvanceTutorial*](#adminadvancetutorial)
  - [*AdminCompleteTutorial*](#admincompletetutorial)
  - [*AdminResetTutorial*](#adminresettutorial)
  - [*CreateResource*](#createresource)
  - [*UpdateResource*](#updateresource)
  - [*DeleteResource*](#deleteresource)
  - [*CreateScene*](#createscene)
  - [*UpdateScene*](#updatescene)
  - [*DeleteScene*](#deletescene)
  - [*CreateWorld*](#createworld)
  - [*UpdateWorld*](#updateworld)
  - [*DeleteWorld*](#deleteworld)
  - [*AddCollaborator*](#addcollaborator)
  - [*RemoveCollaborator*](#removecollaborator)
  - [*CreateItem*](#createitem)
  - [*UpdateItem*](#updateitem)
  - [*DeleteItem*](#deleteitem)
  - [*CreateTokenWallet*](#createtokenwallet)
  - [*AdminCreateTokenWallet*](#admincreatetokenwallet)
  - [*AdminUpdateTokenWallet*](#adminupdatetokenwallet)
  - [*AdminCreateTokenEvent*](#admincreatetokenevent)
  - [*AdminConsumeTokens*](#adminconsumetokens)
  - [*AdminCreditTokens*](#admincredittokens)
  - [*CreateUser*](#createuser)
  - [*UpsertUserWithEmail*](#upsertuserwithemail)
  - [*CreateUserAttributes*](#createuserattributes)
  - [*UpdateUserAttributes*](#updateuserattributes)
  - [*ResetUserAttributes*](#resetuserattributes)
  - [*AddInventoryItem*](#addinventoryitem)
  - [*RemoveInventoryItem*](#removeinventoryitem)
  - [*AdminCreateUser*](#admincreateuser)
  - [*AdminCreateUserAttributes*](#admincreateuserattributes)
  - [*AdminUpdateUserAttributes*](#adminupdateuserattributes)
  - [*AdminAddInventoryItem*](#adminaddinventoryitem)
  - [*AdminRemoveInventoryItem*](#adminremoveinventoryitem)
  - [*CreateWeapon*](#createweapon)
  - [*UpdateWeapon*](#updateweapon)
  - [*DeleteWeapon*](#deleteweapon)
  - [*CreateCharacter*](#createcharacter)
  - [*UpdateCharacter*](#updatecharacter)
  - [*DeleteCharacter*](#deletecharacter)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `anify`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@anify/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@anify/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@anify/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `anify` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetPlayerProfile
You can execute the `GetPlayerProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getPlayerProfile(): QueryPromise<GetPlayerProfileData, undefined>;

interface GetPlayerProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPlayerProfileData, undefined>;
}
export const getPlayerProfileRef: GetPlayerProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPlayerProfile(dc: DataConnect): QueryPromise<GetPlayerProfileData, undefined>;

interface GetPlayerProfileRef {
  ...
  (dc: DataConnect): QueryRef<GetPlayerProfileData, undefined>;
}
export const getPlayerProfileRef: GetPlayerProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPlayerProfileRef:
```typescript
const name = getPlayerProfileRef.operationName;
console.log(name);
```

### Variables
The `GetPlayerProfile` query has no variables.
### Return Type
Recall that executing the `GetPlayerProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPlayerProfileData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetPlayerProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPlayerProfile } from '@anify/dataconnect';


// Call the `getPlayerProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPlayerProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPlayerProfile(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getPlayerProfile().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetPlayerProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPlayerProfileRef } from '@anify/dataconnect';


// Call the `getPlayerProfileRef()` function to get a reference to the query.
const ref = getPlayerProfileRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPlayerProfileRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## GetPlayerTutorial
You can execute the `GetPlayerTutorial` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getPlayerTutorial(): QueryPromise<GetPlayerTutorialData, undefined>;

interface GetPlayerTutorialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPlayerTutorialData, undefined>;
}
export const getPlayerTutorialRef: GetPlayerTutorialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPlayerTutorial(dc: DataConnect): QueryPromise<GetPlayerTutorialData, undefined>;

interface GetPlayerTutorialRef {
  ...
  (dc: DataConnect): QueryRef<GetPlayerTutorialData, undefined>;
}
export const getPlayerTutorialRef: GetPlayerTutorialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPlayerTutorialRef:
```typescript
const name = getPlayerTutorialRef.operationName;
console.log(name);
```

### Variables
The `GetPlayerTutorial` query has no variables.
### Return Type
Recall that executing the `GetPlayerTutorial` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPlayerTutorialData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetPlayerTutorial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPlayerTutorial } from '@anify/dataconnect';


// Call the `getPlayerTutorial()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPlayerTutorial();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPlayerTutorial(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getPlayerTutorial().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetPlayerTutorial`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPlayerTutorialRef } from '@anify/dataconnect';


// Call the `getPlayerTutorialRef()` function to get a reference to the query.
const ref = getPlayerTutorialRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPlayerTutorialRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## GetPlayerStateSummary
You can execute the `GetPlayerStateSummary` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getPlayerStateSummary(): QueryPromise<GetPlayerStateSummaryData, undefined>;

interface GetPlayerStateSummaryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPlayerStateSummaryData, undefined>;
}
export const getPlayerStateSummaryRef: GetPlayerStateSummaryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPlayerStateSummary(dc: DataConnect): QueryPromise<GetPlayerStateSummaryData, undefined>;

interface GetPlayerStateSummaryRef {
  ...
  (dc: DataConnect): QueryRef<GetPlayerStateSummaryData, undefined>;
}
export const getPlayerStateSummaryRef: GetPlayerStateSummaryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPlayerStateSummaryRef:
```typescript
const name = getPlayerStateSummaryRef.operationName;
console.log(name);
```

### Variables
The `GetPlayerStateSummary` query has no variables.
### Return Type
Recall that executing the `GetPlayerStateSummary` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPlayerStateSummaryData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetPlayerStateSummary`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPlayerStateSummary } from '@anify/dataconnect';


// Call the `getPlayerStateSummary()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPlayerStateSummary();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPlayerStateSummary(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getPlayerStateSummary().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetPlayerStateSummary`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPlayerStateSummaryRef } from '@anify/dataconnect';


// Call the `getPlayerStateSummaryRef()` function to get a reference to the query.
const ref = getPlayerStateSummaryRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPlayerStateSummaryRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## AdminGetPlayerProfile
You can execute the `AdminGetPlayerProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
adminGetPlayerProfile(vars: AdminGetPlayerProfileVariables): QueryPromise<AdminGetPlayerProfileData, AdminGetPlayerProfileVariables>;

interface AdminGetPlayerProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminGetPlayerProfileVariables): QueryRef<AdminGetPlayerProfileData, AdminGetPlayerProfileVariables>;
}
export const adminGetPlayerProfileRef: AdminGetPlayerProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminGetPlayerProfile(dc: DataConnect, vars: AdminGetPlayerProfileVariables): QueryPromise<AdminGetPlayerProfileData, AdminGetPlayerProfileVariables>;

interface AdminGetPlayerProfileRef {
  ...
  (dc: DataConnect, vars: AdminGetPlayerProfileVariables): QueryRef<AdminGetPlayerProfileData, AdminGetPlayerProfileVariables>;
}
export const adminGetPlayerProfileRef: AdminGetPlayerProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminGetPlayerProfileRef:
```typescript
const name = adminGetPlayerProfileRef.operationName;
console.log(name);
```

### Variables
The `AdminGetPlayerProfile` query requires an argument of type `AdminGetPlayerProfileVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminGetPlayerProfileVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `AdminGetPlayerProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminGetPlayerProfileData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `AdminGetPlayerProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminGetPlayerProfile, AdminGetPlayerProfileVariables } from '@anify/dataconnect';

// The `AdminGetPlayerProfile` query requires an argument of type `AdminGetPlayerProfileVariables`:
const adminGetPlayerProfileVars: AdminGetPlayerProfileVariables = {
  userId: ..., 
};

// Call the `adminGetPlayerProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminGetPlayerProfile(adminGetPlayerProfileVars);
// Variables can be defined inline as well.
const { data } = await adminGetPlayerProfile({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminGetPlayerProfile(dataConnect, adminGetPlayerProfileVars);

console.log(data.user);

// Or, you can use the `Promise` API.
adminGetPlayerProfile(adminGetPlayerProfileVars).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `AdminGetPlayerProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminGetPlayerProfileRef, AdminGetPlayerProfileVariables } from '@anify/dataconnect';

// The `AdminGetPlayerProfile` query requires an argument of type `AdminGetPlayerProfileVariables`:
const adminGetPlayerProfileVars: AdminGetPlayerProfileVariables = {
  userId: ..., 
};

// Call the `adminGetPlayerProfileRef()` function to get a reference to the query.
const ref = adminGetPlayerProfileRef(adminGetPlayerProfileVars);
// Variables can be defined inline as well.
const ref = adminGetPlayerProfileRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminGetPlayerProfileRef(dataConnect, adminGetPlayerProfileVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## AdminGetPlayerTutorial
You can execute the `AdminGetPlayerTutorial` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
adminGetPlayerTutorial(vars: AdminGetPlayerTutorialVariables): QueryPromise<AdminGetPlayerTutorialData, AdminGetPlayerTutorialVariables>;

interface AdminGetPlayerTutorialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminGetPlayerTutorialVariables): QueryRef<AdminGetPlayerTutorialData, AdminGetPlayerTutorialVariables>;
}
export const adminGetPlayerTutorialRef: AdminGetPlayerTutorialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminGetPlayerTutorial(dc: DataConnect, vars: AdminGetPlayerTutorialVariables): QueryPromise<AdminGetPlayerTutorialData, AdminGetPlayerTutorialVariables>;

interface AdminGetPlayerTutorialRef {
  ...
  (dc: DataConnect, vars: AdminGetPlayerTutorialVariables): QueryRef<AdminGetPlayerTutorialData, AdminGetPlayerTutorialVariables>;
}
export const adminGetPlayerTutorialRef: AdminGetPlayerTutorialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminGetPlayerTutorialRef:
```typescript
const name = adminGetPlayerTutorialRef.operationName;
console.log(name);
```

### Variables
The `AdminGetPlayerTutorial` query requires an argument of type `AdminGetPlayerTutorialVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminGetPlayerTutorialVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `AdminGetPlayerTutorial` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminGetPlayerTutorialData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `AdminGetPlayerTutorial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminGetPlayerTutorial, AdminGetPlayerTutorialVariables } from '@anify/dataconnect';

// The `AdminGetPlayerTutorial` query requires an argument of type `AdminGetPlayerTutorialVariables`:
const adminGetPlayerTutorialVars: AdminGetPlayerTutorialVariables = {
  userId: ..., 
};

// Call the `adminGetPlayerTutorial()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminGetPlayerTutorial(adminGetPlayerTutorialVars);
// Variables can be defined inline as well.
const { data } = await adminGetPlayerTutorial({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminGetPlayerTutorial(dataConnect, adminGetPlayerTutorialVars);

console.log(data.user);

// Or, you can use the `Promise` API.
adminGetPlayerTutorial(adminGetPlayerTutorialVars).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `AdminGetPlayerTutorial`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminGetPlayerTutorialRef, AdminGetPlayerTutorialVariables } from '@anify/dataconnect';

// The `AdminGetPlayerTutorial` query requires an argument of type `AdminGetPlayerTutorialVariables`:
const adminGetPlayerTutorialVars: AdminGetPlayerTutorialVariables = {
  userId: ..., 
};

// Call the `adminGetPlayerTutorialRef()` function to get a reference to the query.
const ref = adminGetPlayerTutorialRef(adminGetPlayerTutorialVars);
// Variables can be defined inline as well.
const ref = adminGetPlayerTutorialRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminGetPlayerTutorialRef(dataConnect, adminGetPlayerTutorialVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## AdminGetPlayerStateSummary
You can execute the `AdminGetPlayerStateSummary` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
adminGetPlayerStateSummary(vars: AdminGetPlayerStateSummaryVariables): QueryPromise<AdminGetPlayerStateSummaryData, AdminGetPlayerStateSummaryVariables>;

interface AdminGetPlayerStateSummaryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminGetPlayerStateSummaryVariables): QueryRef<AdminGetPlayerStateSummaryData, AdminGetPlayerStateSummaryVariables>;
}
export const adminGetPlayerStateSummaryRef: AdminGetPlayerStateSummaryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminGetPlayerStateSummary(dc: DataConnect, vars: AdminGetPlayerStateSummaryVariables): QueryPromise<AdminGetPlayerStateSummaryData, AdminGetPlayerStateSummaryVariables>;

interface AdminGetPlayerStateSummaryRef {
  ...
  (dc: DataConnect, vars: AdminGetPlayerStateSummaryVariables): QueryRef<AdminGetPlayerStateSummaryData, AdminGetPlayerStateSummaryVariables>;
}
export const adminGetPlayerStateSummaryRef: AdminGetPlayerStateSummaryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminGetPlayerStateSummaryRef:
```typescript
const name = adminGetPlayerStateSummaryRef.operationName;
console.log(name);
```

### Variables
The `AdminGetPlayerStateSummary` query requires an argument of type `AdminGetPlayerStateSummaryVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminGetPlayerStateSummaryVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `AdminGetPlayerStateSummary` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminGetPlayerStateSummaryData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `AdminGetPlayerStateSummary`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminGetPlayerStateSummary, AdminGetPlayerStateSummaryVariables } from '@anify/dataconnect';

// The `AdminGetPlayerStateSummary` query requires an argument of type `AdminGetPlayerStateSummaryVariables`:
const adminGetPlayerStateSummaryVars: AdminGetPlayerStateSummaryVariables = {
  userId: ..., 
};

// Call the `adminGetPlayerStateSummary()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminGetPlayerStateSummary(adminGetPlayerStateSummaryVars);
// Variables can be defined inline as well.
const { data } = await adminGetPlayerStateSummary({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminGetPlayerStateSummary(dataConnect, adminGetPlayerStateSummaryVars);

console.log(data.user);

// Or, you can use the `Promise` API.
adminGetPlayerStateSummary(adminGetPlayerStateSummaryVars).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `AdminGetPlayerStateSummary`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminGetPlayerStateSummaryRef, AdminGetPlayerStateSummaryVariables } from '@anify/dataconnect';

// The `AdminGetPlayerStateSummary` query requires an argument of type `AdminGetPlayerStateSummaryVariables`:
const adminGetPlayerStateSummaryVars: AdminGetPlayerStateSummaryVariables = {
  userId: ..., 
};

// Call the `adminGetPlayerStateSummaryRef()` function to get a reference to the query.
const ref = adminGetPlayerStateSummaryRef(adminGetPlayerStateSummaryVars);
// Variables can be defined inline as well.
const ref = adminGetPlayerStateSummaryRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminGetPlayerStateSummaryRef(dataConnect, adminGetPlayerStateSummaryVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListResources
You can execute the `ListResources` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listResources(): QueryPromise<ListResourcesData, undefined>;

interface ListResourcesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListResourcesData, undefined>;
}
export const listResourcesRef: ListResourcesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listResources(dc: DataConnect): QueryPromise<ListResourcesData, undefined>;

interface ListResourcesRef {
  ...
  (dc: DataConnect): QueryRef<ListResourcesData, undefined>;
}
export const listResourcesRef: ListResourcesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listResourcesRef:
```typescript
const name = listResourcesRef.operationName;
console.log(name);
```

### Variables
The `ListResources` query has no variables.
### Return Type
Recall that executing the `ListResources` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListResourcesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListResourcesData {
  resources: ({
    id: string;
    data: string;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Resource_Key)[];
}
```
### Using `ListResources`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listResources } from '@anify/dataconnect';


// Call the `listResources()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listResources();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listResources(dataConnect);

console.log(data.resources);

// Or, you can use the `Promise` API.
listResources().then((response) => {
  const data = response.data;
  console.log(data.resources);
});
```

### Using `ListResources`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listResourcesRef } from '@anify/dataconnect';


// Call the `listResourcesRef()` function to get a reference to the query.
const ref = listResourcesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listResourcesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.resources);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.resources);
});
```

## GetResource
You can execute the `GetResource` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getResource(vars: GetResourceVariables): QueryPromise<GetResourceData, GetResourceVariables>;

interface GetResourceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetResourceVariables): QueryRef<GetResourceData, GetResourceVariables>;
}
export const getResourceRef: GetResourceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getResource(dc: DataConnect, vars: GetResourceVariables): QueryPromise<GetResourceData, GetResourceVariables>;

interface GetResourceRef {
  ...
  (dc: DataConnect, vars: GetResourceVariables): QueryRef<GetResourceData, GetResourceVariables>;
}
export const getResourceRef: GetResourceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getResourceRef:
```typescript
const name = getResourceRef.operationName;
console.log(name);
```

### Variables
The `GetResource` query requires an argument of type `GetResourceVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetResourceVariables {
  id: string;
}
```
### Return Type
Recall that executing the `GetResource` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetResourceData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetResourceData {
  resource?: {
    id: string;
    data: string;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Resource_Key;
}
```
### Using `GetResource`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getResource, GetResourceVariables } from '@anify/dataconnect';

// The `GetResource` query requires an argument of type `GetResourceVariables`:
const getResourceVars: GetResourceVariables = {
  id: ..., 
};

// Call the `getResource()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getResource(getResourceVars);
// Variables can be defined inline as well.
const { data } = await getResource({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getResource(dataConnect, getResourceVars);

console.log(data.resource);

// Or, you can use the `Promise` API.
getResource(getResourceVars).then((response) => {
  const data = response.data;
  console.log(data.resource);
});
```

### Using `GetResource`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getResourceRef, GetResourceVariables } from '@anify/dataconnect';

// The `GetResource` query requires an argument of type `GetResourceVariables`:
const getResourceVars: GetResourceVariables = {
  id: ..., 
};

// Call the `getResourceRef()` function to get a reference to the query.
const ref = getResourceRef(getResourceVars);
// Variables can be defined inline as well.
const ref = getResourceRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getResourceRef(dataConnect, getResourceVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.resource);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.resource);
});
```

## ListScenes
You can execute the `ListScenes` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listScenes(): QueryPromise<ListScenesData, undefined>;

interface ListScenesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListScenesData, undefined>;
}
export const listScenesRef: ListScenesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listScenes(dc: DataConnect): QueryPromise<ListScenesData, undefined>;

interface ListScenesRef {
  ...
  (dc: DataConnect): QueryRef<ListScenesData, undefined>;
}
export const listScenesRef: ListScenesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listScenesRef:
```typescript
const name = listScenesRef.operationName;
console.log(name);
```

### Variables
The `ListScenes` query has no variables.
### Return Type
Recall that executing the `ListScenes` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListScenesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListScenes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listScenes } from '@anify/dataconnect';


// Call the `listScenes()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listScenes();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listScenes(dataConnect);

console.log(data.scenes);

// Or, you can use the `Promise` API.
listScenes().then((response) => {
  const data = response.data;
  console.log(data.scenes);
});
```

### Using `ListScenes`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listScenesRef } from '@anify/dataconnect';


// Call the `listScenesRef()` function to get a reference to the query.
const ref = listScenesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listScenesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.scenes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.scenes);
});
```

## ListScenesByWorld
You can execute the `ListScenesByWorld` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listScenesByWorld(vars: ListScenesByWorldVariables): QueryPromise<ListScenesByWorldData, ListScenesByWorldVariables>;

interface ListScenesByWorldRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListScenesByWorldVariables): QueryRef<ListScenesByWorldData, ListScenesByWorldVariables>;
}
export const listScenesByWorldRef: ListScenesByWorldRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listScenesByWorld(dc: DataConnect, vars: ListScenesByWorldVariables): QueryPromise<ListScenesByWorldData, ListScenesByWorldVariables>;

interface ListScenesByWorldRef {
  ...
  (dc: DataConnect, vars: ListScenesByWorldVariables): QueryRef<ListScenesByWorldData, ListScenesByWorldVariables>;
}
export const listScenesByWorldRef: ListScenesByWorldRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listScenesByWorldRef:
```typescript
const name = listScenesByWorldRef.operationName;
console.log(name);
```

### Variables
The `ListScenesByWorld` query requires an argument of type `ListScenesByWorldVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListScenesByWorldVariables {
  worldId: string;
}
```
### Return Type
Recall that executing the `ListScenesByWorld` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListScenesByWorldData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListScenesByWorld`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listScenesByWorld, ListScenesByWorldVariables } from '@anify/dataconnect';

// The `ListScenesByWorld` query requires an argument of type `ListScenesByWorldVariables`:
const listScenesByWorldVars: ListScenesByWorldVariables = {
  worldId: ..., 
};

// Call the `listScenesByWorld()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listScenesByWorld(listScenesByWorldVars);
// Variables can be defined inline as well.
const { data } = await listScenesByWorld({ worldId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listScenesByWorld(dataConnect, listScenesByWorldVars);

console.log(data.scenes);

// Or, you can use the `Promise` API.
listScenesByWorld(listScenesByWorldVars).then((response) => {
  const data = response.data;
  console.log(data.scenes);
});
```

### Using `ListScenesByWorld`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listScenesByWorldRef, ListScenesByWorldVariables } from '@anify/dataconnect';

// The `ListScenesByWorld` query requires an argument of type `ListScenesByWorldVariables`:
const listScenesByWorldVars: ListScenesByWorldVariables = {
  worldId: ..., 
};

// Call the `listScenesByWorldRef()` function to get a reference to the query.
const ref = listScenesByWorldRef(listScenesByWorldVars);
// Variables can be defined inline as well.
const ref = listScenesByWorldRef({ worldId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listScenesByWorldRef(dataConnect, listScenesByWorldVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.scenes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.scenes);
});
```

## GetScene
You can execute the `GetScene` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getScene(vars: GetSceneVariables): QueryPromise<GetSceneData, GetSceneVariables>;

interface GetSceneRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSceneVariables): QueryRef<GetSceneData, GetSceneVariables>;
}
export const getSceneRef: GetSceneRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getScene(dc: DataConnect, vars: GetSceneVariables): QueryPromise<GetSceneData, GetSceneVariables>;

interface GetSceneRef {
  ...
  (dc: DataConnect, vars: GetSceneVariables): QueryRef<GetSceneData, GetSceneVariables>;
}
export const getSceneRef: GetSceneRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getSceneRef:
```typescript
const name = getSceneRef.operationName;
console.log(name);
```

### Variables
The `GetScene` query requires an argument of type `GetSceneVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetSceneVariables {
  id: string;
}
```
### Return Type
Recall that executing the `GetScene` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetSceneData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetScene`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getScene, GetSceneVariables } from '@anify/dataconnect';

// The `GetScene` query requires an argument of type `GetSceneVariables`:
const getSceneVars: GetSceneVariables = {
  id: ..., 
};

// Call the `getScene()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getScene(getSceneVars);
// Variables can be defined inline as well.
const { data } = await getScene({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getScene(dataConnect, getSceneVars);

console.log(data.scene);

// Or, you can use the `Promise` API.
getScene(getSceneVars).then((response) => {
  const data = response.data;
  console.log(data.scene);
});
```

### Using `GetScene`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getSceneRef, GetSceneVariables } from '@anify/dataconnect';

// The `GetScene` query requires an argument of type `GetSceneVariables`:
const getSceneVars: GetSceneVariables = {
  id: ..., 
};

// Call the `getSceneRef()` function to get a reference to the query.
const ref = getSceneRef(getSceneVars);
// Variables can be defined inline as well.
const ref = getSceneRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getSceneRef(dataConnect, getSceneVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.scene);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.scene);
});
```

## ListMyWorlds
You can execute the `ListMyWorlds` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listMyWorlds(): QueryPromise<ListMyWorldsData, undefined>;

interface ListMyWorldsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyWorldsData, undefined>;
}
export const listMyWorldsRef: ListMyWorldsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyWorlds(dc: DataConnect): QueryPromise<ListMyWorldsData, undefined>;

interface ListMyWorldsRef {
  ...
  (dc: DataConnect): QueryRef<ListMyWorldsData, undefined>;
}
export const listMyWorldsRef: ListMyWorldsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyWorldsRef:
```typescript
const name = listMyWorldsRef.operationName;
console.log(name);
```

### Variables
The `ListMyWorlds` query has no variables.
### Return Type
Recall that executing the `ListMyWorlds` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyWorldsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListMyWorlds`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyWorlds } from '@anify/dataconnect';


// Call the `listMyWorlds()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyWorlds();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyWorlds(dataConnect);

console.log(data.worlds);

// Or, you can use the `Promise` API.
listMyWorlds().then((response) => {
  const data = response.data;
  console.log(data.worlds);
});
```

### Using `ListMyWorlds`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyWorldsRef } from '@anify/dataconnect';


// Call the `listMyWorldsRef()` function to get a reference to the query.
const ref = listMyWorldsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyWorldsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.worlds);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.worlds);
});
```

## ListCollaboratingWorlds
You can execute the `ListCollaboratingWorlds` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listCollaboratingWorlds(): QueryPromise<ListCollaboratingWorldsData, undefined>;

interface ListCollaboratingWorldsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCollaboratingWorldsData, undefined>;
}
export const listCollaboratingWorldsRef: ListCollaboratingWorldsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCollaboratingWorlds(dc: DataConnect): QueryPromise<ListCollaboratingWorldsData, undefined>;

interface ListCollaboratingWorldsRef {
  ...
  (dc: DataConnect): QueryRef<ListCollaboratingWorldsData, undefined>;
}
export const listCollaboratingWorldsRef: ListCollaboratingWorldsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCollaboratingWorldsRef:
```typescript
const name = listCollaboratingWorldsRef.operationName;
console.log(name);
```

### Variables
The `ListCollaboratingWorlds` query has no variables.
### Return Type
Recall that executing the `ListCollaboratingWorlds` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCollaboratingWorldsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListCollaboratingWorlds`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCollaboratingWorlds } from '@anify/dataconnect';


// Call the `listCollaboratingWorlds()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCollaboratingWorlds();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCollaboratingWorlds(dataConnect);

console.log(data.worldCollaborators);

// Or, you can use the `Promise` API.
listCollaboratingWorlds().then((response) => {
  const data = response.data;
  console.log(data.worldCollaborators);
});
```

### Using `ListCollaboratingWorlds`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCollaboratingWorldsRef } from '@anify/dataconnect';


// Call the `listCollaboratingWorldsRef()` function to get a reference to the query.
const ref = listCollaboratingWorldsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCollaboratingWorldsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.worldCollaborators);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.worldCollaborators);
});
```

## GetWorld
You can execute the `GetWorld` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getWorld(vars: GetWorldVariables): QueryPromise<GetWorldData, GetWorldVariables>;

interface GetWorldRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetWorldVariables): QueryRef<GetWorldData, GetWorldVariables>;
}
export const getWorldRef: GetWorldRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getWorld(dc: DataConnect, vars: GetWorldVariables): QueryPromise<GetWorldData, GetWorldVariables>;

interface GetWorldRef {
  ...
  (dc: DataConnect, vars: GetWorldVariables): QueryRef<GetWorldData, GetWorldVariables>;
}
export const getWorldRef: GetWorldRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getWorldRef:
```typescript
const name = getWorldRef.operationName;
console.log(name);
```

### Variables
The `GetWorld` query requires an argument of type `GetWorldVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetWorldVariables {
  id: string;
}
```
### Return Type
Recall that executing the `GetWorld` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetWorldData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetWorld`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getWorld, GetWorldVariables } from '@anify/dataconnect';

// The `GetWorld` query requires an argument of type `GetWorldVariables`:
const getWorldVars: GetWorldVariables = {
  id: ..., 
};

// Call the `getWorld()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getWorld(getWorldVars);
// Variables can be defined inline as well.
const { data } = await getWorld({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getWorld(dataConnect, getWorldVars);

console.log(data.world);

// Or, you can use the `Promise` API.
getWorld(getWorldVars).then((response) => {
  const data = response.data;
  console.log(data.world);
});
```

### Using `GetWorld`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getWorldRef, GetWorldVariables } from '@anify/dataconnect';

// The `GetWorld` query requires an argument of type `GetWorldVariables`:
const getWorldVars: GetWorldVariables = {
  id: ..., 
};

// Call the `getWorldRef()` function to get a reference to the query.
const ref = getWorldRef(getWorldVars);
// Variables can be defined inline as well.
const ref = getWorldRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getWorldRef(dataConnect, getWorldVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.world);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.world);
});
```

## ListCollaborators
You can execute the `ListCollaborators` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listCollaborators(vars: ListCollaboratorsVariables): QueryPromise<ListCollaboratorsData, ListCollaboratorsVariables>;

interface ListCollaboratorsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCollaboratorsVariables): QueryRef<ListCollaboratorsData, ListCollaboratorsVariables>;
}
export const listCollaboratorsRef: ListCollaboratorsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCollaborators(dc: DataConnect, vars: ListCollaboratorsVariables): QueryPromise<ListCollaboratorsData, ListCollaboratorsVariables>;

interface ListCollaboratorsRef {
  ...
  (dc: DataConnect, vars: ListCollaboratorsVariables): QueryRef<ListCollaboratorsData, ListCollaboratorsVariables>;
}
export const listCollaboratorsRef: ListCollaboratorsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCollaboratorsRef:
```typescript
const name = listCollaboratorsRef.operationName;
console.log(name);
```

### Variables
The `ListCollaborators` query requires an argument of type `ListCollaboratorsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListCollaboratorsVariables {
  worldId: string;
}
```
### Return Type
Recall that executing the `ListCollaborators` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCollaboratorsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCollaboratorsData {
  worldCollaborators: ({
    user: {
      id: string;
      email?: string | null;
    } & User_Key;
      addedAt: TimestampString;
  })[];
}
```
### Using `ListCollaborators`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCollaborators, ListCollaboratorsVariables } from '@anify/dataconnect';

// The `ListCollaborators` query requires an argument of type `ListCollaboratorsVariables`:
const listCollaboratorsVars: ListCollaboratorsVariables = {
  worldId: ..., 
};

// Call the `listCollaborators()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCollaborators(listCollaboratorsVars);
// Variables can be defined inline as well.
const { data } = await listCollaborators({ worldId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCollaborators(dataConnect, listCollaboratorsVars);

console.log(data.worldCollaborators);

// Or, you can use the `Promise` API.
listCollaborators(listCollaboratorsVars).then((response) => {
  const data = response.data;
  console.log(data.worldCollaborators);
});
```

### Using `ListCollaborators`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCollaboratorsRef, ListCollaboratorsVariables } from '@anify/dataconnect';

// The `ListCollaborators` query requires an argument of type `ListCollaboratorsVariables`:
const listCollaboratorsVars: ListCollaboratorsVariables = {
  worldId: ..., 
};

// Call the `listCollaboratorsRef()` function to get a reference to the query.
const ref = listCollaboratorsRef(listCollaboratorsVars);
// Variables can be defined inline as well.
const ref = listCollaboratorsRef({ worldId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCollaboratorsRef(dataConnect, listCollaboratorsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.worldCollaborators);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.worldCollaborators);
});
```

## FindUserByEmail
You can execute the `FindUserByEmail` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
findUserByEmail(vars: FindUserByEmailVariables): QueryPromise<FindUserByEmailData, FindUserByEmailVariables>;

interface FindUserByEmailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: FindUserByEmailVariables): QueryRef<FindUserByEmailData, FindUserByEmailVariables>;
}
export const findUserByEmailRef: FindUserByEmailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
findUserByEmail(dc: DataConnect, vars: FindUserByEmailVariables): QueryPromise<FindUserByEmailData, FindUserByEmailVariables>;

interface FindUserByEmailRef {
  ...
  (dc: DataConnect, vars: FindUserByEmailVariables): QueryRef<FindUserByEmailData, FindUserByEmailVariables>;
}
export const findUserByEmailRef: FindUserByEmailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the findUserByEmailRef:
```typescript
const name = findUserByEmailRef.operationName;
console.log(name);
```

### Variables
The `FindUserByEmail` query requires an argument of type `FindUserByEmailVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface FindUserByEmailVariables {
  email: string;
}
```
### Return Type
Recall that executing the `FindUserByEmail` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `FindUserByEmailData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface FindUserByEmailData {
  users: ({
    id: string;
    email?: string | null;
  } & User_Key)[];
}
```
### Using `FindUserByEmail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, findUserByEmail, FindUserByEmailVariables } from '@anify/dataconnect';

// The `FindUserByEmail` query requires an argument of type `FindUserByEmailVariables`:
const findUserByEmailVars: FindUserByEmailVariables = {
  email: ..., 
};

// Call the `findUserByEmail()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await findUserByEmail(findUserByEmailVars);
// Variables can be defined inline as well.
const { data } = await findUserByEmail({ email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await findUserByEmail(dataConnect, findUserByEmailVars);

console.log(data.users);

// Or, you can use the `Promise` API.
findUserByEmail(findUserByEmailVars).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `FindUserByEmail`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, findUserByEmailRef, FindUserByEmailVariables } from '@anify/dataconnect';

// The `FindUserByEmail` query requires an argument of type `FindUserByEmailVariables`:
const findUserByEmailVars: FindUserByEmailVariables = {
  email: ..., 
};

// Call the `findUserByEmailRef()` function to get a reference to the query.
const ref = findUserByEmailRef(findUserByEmailVars);
// Variables can be defined inline as well.
const ref = findUserByEmailRef({ email: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = findUserByEmailRef(dataConnect, findUserByEmailVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## ListItems
You can execute the `ListItems` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listItems(): QueryPromise<ListItemsData, undefined>;

interface ListItemsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListItemsData, undefined>;
}
export const listItemsRef: ListItemsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listItems(dc: DataConnect): QueryPromise<ListItemsData, undefined>;

interface ListItemsRef {
  ...
  (dc: DataConnect): QueryRef<ListItemsData, undefined>;
}
export const listItemsRef: ListItemsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listItemsRef:
```typescript
const name = listItemsRef.operationName;
console.log(name);
```

### Variables
The `ListItems` query has no variables.
### Return Type
Recall that executing the `ListItems` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListItemsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListItems`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listItems } from '@anify/dataconnect';


// Call the `listItems()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listItems();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listItems(dataConnect);

console.log(data.items);

// Or, you can use the `Promise` API.
listItems().then((response) => {
  const data = response.data;
  console.log(data.items);
});
```

### Using `ListItems`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listItemsRef } from '@anify/dataconnect';


// Call the `listItemsRef()` function to get a reference to the query.
const ref = listItemsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listItemsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.items);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.items);
});
```

## GetItem
You can execute the `GetItem` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getItem(vars: GetItemVariables): QueryPromise<GetItemData, GetItemVariables>;

interface GetItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetItemVariables): QueryRef<GetItemData, GetItemVariables>;
}
export const getItemRef: GetItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getItem(dc: DataConnect, vars: GetItemVariables): QueryPromise<GetItemData, GetItemVariables>;

interface GetItemRef {
  ...
  (dc: DataConnect, vars: GetItemVariables): QueryRef<GetItemData, GetItemVariables>;
}
export const getItemRef: GetItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getItemRef:
```typescript
const name = getItemRef.operationName;
console.log(name);
```

### Variables
The `GetItem` query requires an argument of type `GetItemVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetItemVariables {
  id: string;
}
```
### Return Type
Recall that executing the `GetItem` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetItemData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getItem, GetItemVariables } from '@anify/dataconnect';

// The `GetItem` query requires an argument of type `GetItemVariables`:
const getItemVars: GetItemVariables = {
  id: ..., 
};

// Call the `getItem()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getItem(getItemVars);
// Variables can be defined inline as well.
const { data } = await getItem({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getItem(dataConnect, getItemVars);

console.log(data.item);

// Or, you can use the `Promise` API.
getItem(getItemVars).then((response) => {
  const data = response.data;
  console.log(data.item);
});
```

### Using `GetItem`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getItemRef, GetItemVariables } from '@anify/dataconnect';

// The `GetItem` query requires an argument of type `GetItemVariables`:
const getItemVars: GetItemVariables = {
  id: ..., 
};

// Call the `getItemRef()` function to get a reference to the query.
const ref = getItemRef(getItemVars);
// Variables can be defined inline as well.
const ref = getItemRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getItemRef(dataConnect, getItemVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.item);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.item);
});
```

## ListItemsByType
You can execute the `ListItemsByType` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listItemsByType(vars: ListItemsByTypeVariables): QueryPromise<ListItemsByTypeData, ListItemsByTypeVariables>;

interface ListItemsByTypeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListItemsByTypeVariables): QueryRef<ListItemsByTypeData, ListItemsByTypeVariables>;
}
export const listItemsByTypeRef: ListItemsByTypeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listItemsByType(dc: DataConnect, vars: ListItemsByTypeVariables): QueryPromise<ListItemsByTypeData, ListItemsByTypeVariables>;

interface ListItemsByTypeRef {
  ...
  (dc: DataConnect, vars: ListItemsByTypeVariables): QueryRef<ListItemsByTypeData, ListItemsByTypeVariables>;
}
export const listItemsByTypeRef: ListItemsByTypeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listItemsByTypeRef:
```typescript
const name = listItemsByTypeRef.operationName;
console.log(name);
```

### Variables
The `ListItemsByType` query requires an argument of type `ListItemsByTypeVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListItemsByTypeVariables {
  type: ItemType;
}
```
### Return Type
Recall that executing the `ListItemsByType` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListItemsByTypeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListItemsByType`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listItemsByType, ListItemsByTypeVariables } from '@anify/dataconnect';

// The `ListItemsByType` query requires an argument of type `ListItemsByTypeVariables`:
const listItemsByTypeVars: ListItemsByTypeVariables = {
  type: ..., 
};

// Call the `listItemsByType()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listItemsByType(listItemsByTypeVars);
// Variables can be defined inline as well.
const { data } = await listItemsByType({ type: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listItemsByType(dataConnect, listItemsByTypeVars);

console.log(data.items);

// Or, you can use the `Promise` API.
listItemsByType(listItemsByTypeVars).then((response) => {
  const data = response.data;
  console.log(data.items);
});
```

### Using `ListItemsByType`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listItemsByTypeRef, ListItemsByTypeVariables } from '@anify/dataconnect';

// The `ListItemsByType` query requires an argument of type `ListItemsByTypeVariables`:
const listItemsByTypeVars: ListItemsByTypeVariables = {
  type: ..., 
};

// Call the `listItemsByTypeRef()` function to get a reference to the query.
const ref = listItemsByTypeRef(listItemsByTypeVars);
// Variables can be defined inline as well.
const ref = listItemsByTypeRef({ type: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listItemsByTypeRef(dataConnect, listItemsByTypeVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.items);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.items);
});
```

## ListItemsByRarity
You can execute the `ListItemsByRarity` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listItemsByRarity(vars: ListItemsByRarityVariables): QueryPromise<ListItemsByRarityData, ListItemsByRarityVariables>;

interface ListItemsByRarityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListItemsByRarityVariables): QueryRef<ListItemsByRarityData, ListItemsByRarityVariables>;
}
export const listItemsByRarityRef: ListItemsByRarityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listItemsByRarity(dc: DataConnect, vars: ListItemsByRarityVariables): QueryPromise<ListItemsByRarityData, ListItemsByRarityVariables>;

interface ListItemsByRarityRef {
  ...
  (dc: DataConnect, vars: ListItemsByRarityVariables): QueryRef<ListItemsByRarityData, ListItemsByRarityVariables>;
}
export const listItemsByRarityRef: ListItemsByRarityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listItemsByRarityRef:
```typescript
const name = listItemsByRarityRef.operationName;
console.log(name);
```

### Variables
The `ListItemsByRarity` query requires an argument of type `ListItemsByRarityVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListItemsByRarityVariables {
  rarity: ItemRarity;
}
```
### Return Type
Recall that executing the `ListItemsByRarity` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListItemsByRarityData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListItemsByRarity`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listItemsByRarity, ListItemsByRarityVariables } from '@anify/dataconnect';

// The `ListItemsByRarity` query requires an argument of type `ListItemsByRarityVariables`:
const listItemsByRarityVars: ListItemsByRarityVariables = {
  rarity: ..., 
};

// Call the `listItemsByRarity()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listItemsByRarity(listItemsByRarityVars);
// Variables can be defined inline as well.
const { data } = await listItemsByRarity({ rarity: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listItemsByRarity(dataConnect, listItemsByRarityVars);

console.log(data.items);

// Or, you can use the `Promise` API.
listItemsByRarity(listItemsByRarityVars).then((response) => {
  const data = response.data;
  console.log(data.items);
});
```

### Using `ListItemsByRarity`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listItemsByRarityRef, ListItemsByRarityVariables } from '@anify/dataconnect';

// The `ListItemsByRarity` query requires an argument of type `ListItemsByRarityVariables`:
const listItemsByRarityVars: ListItemsByRarityVariables = {
  rarity: ..., 
};

// Call the `listItemsByRarityRef()` function to get a reference to the query.
const ref = listItemsByRarityRef(listItemsByRarityVars);
// Variables can be defined inline as well.
const ref = listItemsByRarityRef({ rarity: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listItemsByRarityRef(dataConnect, listItemsByRarityVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.items);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.items);
});
```

## GetTokenSummary
You can execute the `GetTokenSummary` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getTokenSummary(): QueryPromise<GetTokenSummaryData, undefined>;

interface GetTokenSummaryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetTokenSummaryData, undefined>;
}
export const getTokenSummaryRef: GetTokenSummaryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTokenSummary(dc: DataConnect): QueryPromise<GetTokenSummaryData, undefined>;

interface GetTokenSummaryRef {
  ...
  (dc: DataConnect): QueryRef<GetTokenSummaryData, undefined>;
}
export const getTokenSummaryRef: GetTokenSummaryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTokenSummaryRef:
```typescript
const name = getTokenSummaryRef.operationName;
console.log(name);
```

### Variables
The `GetTokenSummary` query has no variables.
### Return Type
Recall that executing the `GetTokenSummary` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTokenSummaryData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetTokenSummary`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTokenSummary } from '@anify/dataconnect';


// Call the `getTokenSummary()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTokenSummary();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTokenSummary(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getTokenSummary().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetTokenSummary`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTokenSummaryRef } from '@anify/dataconnect';


// Call the `getTokenSummaryRef()` function to get a reference to the query.
const ref = getTokenSummaryRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTokenSummaryRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## GetTokenEvents
You can execute the `GetTokenEvents` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getTokenEvents(vars?: GetTokenEventsVariables): QueryPromise<GetTokenEventsData, GetTokenEventsVariables>;

interface GetTokenEventsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetTokenEventsVariables): QueryRef<GetTokenEventsData, GetTokenEventsVariables>;
}
export const getTokenEventsRef: GetTokenEventsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTokenEvents(dc: DataConnect, vars?: GetTokenEventsVariables): QueryPromise<GetTokenEventsData, GetTokenEventsVariables>;

interface GetTokenEventsRef {
  ...
  (dc: DataConnect, vars?: GetTokenEventsVariables): QueryRef<GetTokenEventsData, GetTokenEventsVariables>;
}
export const getTokenEventsRef: GetTokenEventsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTokenEventsRef:
```typescript
const name = getTokenEventsRef.operationName;
console.log(name);
```

### Variables
The `GetTokenEvents` query has an optional argument of type `GetTokenEventsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetTokenEventsVariables {
  limit?: number;
  offset?: number;
}
```
### Return Type
Recall that executing the `GetTokenEvents` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTokenEventsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetTokenEvents`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTokenEvents, GetTokenEventsVariables } from '@anify/dataconnect';

// The `GetTokenEvents` query has an optional argument of type `GetTokenEventsVariables`:
const getTokenEventsVars: GetTokenEventsVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getTokenEvents()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTokenEvents(getTokenEventsVars);
// Variables can be defined inline as well.
const { data } = await getTokenEvents({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `GetTokenEventsVariables` argument.
const { data } = await getTokenEvents();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTokenEvents(dataConnect, getTokenEventsVars);

console.log(data.tokenUsageEvents);

// Or, you can use the `Promise` API.
getTokenEvents(getTokenEventsVars).then((response) => {
  const data = response.data;
  console.log(data.tokenUsageEvents);
});
```

### Using `GetTokenEvents`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTokenEventsRef, GetTokenEventsVariables } from '@anify/dataconnect';

// The `GetTokenEvents` query has an optional argument of type `GetTokenEventsVariables`:
const getTokenEventsVars: GetTokenEventsVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getTokenEventsRef()` function to get a reference to the query.
const ref = getTokenEventsRef(getTokenEventsVars);
// Variables can be defined inline as well.
const ref = getTokenEventsRef({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `GetTokenEventsVariables` argument.
const ref = getTokenEventsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTokenEventsRef(dataConnect, getTokenEventsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.tokenUsageEvents);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.tokenUsageEvents);
});
```

## AdminGetTokenWallet
You can execute the `AdminGetTokenWallet` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
adminGetTokenWallet(vars: AdminGetTokenWalletVariables): QueryPromise<AdminGetTokenWalletData, AdminGetTokenWalletVariables>;

interface AdminGetTokenWalletRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminGetTokenWalletVariables): QueryRef<AdminGetTokenWalletData, AdminGetTokenWalletVariables>;
}
export const adminGetTokenWalletRef: AdminGetTokenWalletRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminGetTokenWallet(dc: DataConnect, vars: AdminGetTokenWalletVariables): QueryPromise<AdminGetTokenWalletData, AdminGetTokenWalletVariables>;

interface AdminGetTokenWalletRef {
  ...
  (dc: DataConnect, vars: AdminGetTokenWalletVariables): QueryRef<AdminGetTokenWalletData, AdminGetTokenWalletVariables>;
}
export const adminGetTokenWalletRef: AdminGetTokenWalletRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminGetTokenWalletRef:
```typescript
const name = adminGetTokenWalletRef.operationName;
console.log(name);
```

### Variables
The `AdminGetTokenWallet` query requires an argument of type `AdminGetTokenWalletVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminGetTokenWalletVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `AdminGetTokenWallet` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminGetTokenWalletData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `AdminGetTokenWallet`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminGetTokenWallet, AdminGetTokenWalletVariables } from '@anify/dataconnect';

// The `AdminGetTokenWallet` query requires an argument of type `AdminGetTokenWalletVariables`:
const adminGetTokenWalletVars: AdminGetTokenWalletVariables = {
  userId: ..., 
};

// Call the `adminGetTokenWallet()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminGetTokenWallet(adminGetTokenWalletVars);
// Variables can be defined inline as well.
const { data } = await adminGetTokenWallet({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminGetTokenWallet(dataConnect, adminGetTokenWalletVars);

console.log(data.tokenWallets);

// Or, you can use the `Promise` API.
adminGetTokenWallet(adminGetTokenWalletVars).then((response) => {
  const data = response.data;
  console.log(data.tokenWallets);
});
```

### Using `AdminGetTokenWallet`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminGetTokenWalletRef, AdminGetTokenWalletVariables } from '@anify/dataconnect';

// The `AdminGetTokenWallet` query requires an argument of type `AdminGetTokenWalletVariables`:
const adminGetTokenWalletVars: AdminGetTokenWalletVariables = {
  userId: ..., 
};

// Call the `adminGetTokenWalletRef()` function to get a reference to the query.
const ref = adminGetTokenWalletRef(adminGetTokenWalletVars);
// Variables can be defined inline as well.
const ref = adminGetTokenWalletRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminGetTokenWalletRef(dataConnect, adminGetTokenWalletVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.tokenWallets);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.tokenWallets);
});
```

## GetUserAttributes
You can execute the `GetUserAttributes` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getUserAttributes(): QueryPromise<GetUserAttributesData, undefined>;

interface GetUserAttributesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserAttributesData, undefined>;
}
export const getUserAttributesRef: GetUserAttributesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserAttributes(dc: DataConnect): QueryPromise<GetUserAttributesData, undefined>;

interface GetUserAttributesRef {
  ...
  (dc: DataConnect): QueryRef<GetUserAttributesData, undefined>;
}
export const getUserAttributesRef: GetUserAttributesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserAttributesRef:
```typescript
const name = getUserAttributesRef.operationName;
console.log(name);
```

### Variables
The `GetUserAttributes` query has no variables.
### Return Type
Recall that executing the `GetUserAttributes` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserAttributesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserAttributes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserAttributes } from '@anify/dataconnect';


// Call the `getUserAttributes()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserAttributes();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserAttributes(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getUserAttributes().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUserAttributes`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserAttributesRef } from '@anify/dataconnect';


// Call the `getUserAttributesRef()` function to get a reference to the query.
const ref = getUserAttributesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserAttributesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## GetUserInventory
You can execute the `GetUserInventory` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getUserInventory(): QueryPromise<GetUserInventoryData, undefined>;

interface GetUserInventoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserInventoryData, undefined>;
}
export const getUserInventoryRef: GetUserInventoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserInventory(dc: DataConnect): QueryPromise<GetUserInventoryData, undefined>;

interface GetUserInventoryRef {
  ...
  (dc: DataConnect): QueryRef<GetUserInventoryData, undefined>;
}
export const getUserInventoryRef: GetUserInventoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserInventoryRef:
```typescript
const name = getUserInventoryRef.operationName;
console.log(name);
```

### Variables
The `GetUserInventory` query has no variables.
### Return Type
Recall that executing the `GetUserInventory` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserInventoryData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserInventory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserInventory } from '@anify/dataconnect';


// Call the `getUserInventory()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserInventory();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserInventory(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getUserInventory().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUserInventory`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserInventoryRef } from '@anify/dataconnect';


// Call the `getUserInventoryRef()` function to get a reference to the query.
const ref = getUserInventoryRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserInventoryRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## GetUserProfile
You can execute the `GetUserProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getUserProfile(): QueryPromise<GetUserProfileData, undefined>;

interface GetUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserProfileData, undefined>;
}
export const getUserProfileRef: GetUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserProfile(dc: DataConnect): QueryPromise<GetUserProfileData, undefined>;

interface GetUserProfileRef {
  ...
  (dc: DataConnect): QueryRef<GetUserProfileData, undefined>;
}
export const getUserProfileRef: GetUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserProfileRef:
```typescript
const name = getUserProfileRef.operationName;
console.log(name);
```

### Variables
The `GetUserProfile` query has no variables.
### Return Type
Recall that executing the `GetUserProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserProfileData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserProfile } from '@anify/dataconnect';


// Call the `getUserProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserProfile(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getUserProfile().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUserProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserProfileRef } from '@anify/dataconnect';


// Call the `getUserProfileRef()` function to get a reference to the query.
const ref = getUserProfileRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserProfileRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListWeaponsByWorld
You can execute the `ListWeaponsByWorld` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listWeaponsByWorld(vars: ListWeaponsByWorldVariables): QueryPromise<ListWeaponsByWorldData, ListWeaponsByWorldVariables>;

interface ListWeaponsByWorldRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListWeaponsByWorldVariables): QueryRef<ListWeaponsByWorldData, ListWeaponsByWorldVariables>;
}
export const listWeaponsByWorldRef: ListWeaponsByWorldRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listWeaponsByWorld(dc: DataConnect, vars: ListWeaponsByWorldVariables): QueryPromise<ListWeaponsByWorldData, ListWeaponsByWorldVariables>;

interface ListWeaponsByWorldRef {
  ...
  (dc: DataConnect, vars: ListWeaponsByWorldVariables): QueryRef<ListWeaponsByWorldData, ListWeaponsByWorldVariables>;
}
export const listWeaponsByWorldRef: ListWeaponsByWorldRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listWeaponsByWorldRef:
```typescript
const name = listWeaponsByWorldRef.operationName;
console.log(name);
```

### Variables
The `ListWeaponsByWorld` query requires an argument of type `ListWeaponsByWorldVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListWeaponsByWorldVariables {
  worldId: string;
}
```
### Return Type
Recall that executing the `ListWeaponsByWorld` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListWeaponsByWorldData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListWeaponsByWorld`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listWeaponsByWorld, ListWeaponsByWorldVariables } from '@anify/dataconnect';

// The `ListWeaponsByWorld` query requires an argument of type `ListWeaponsByWorldVariables`:
const listWeaponsByWorldVars: ListWeaponsByWorldVariables = {
  worldId: ..., 
};

// Call the `listWeaponsByWorld()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listWeaponsByWorld(listWeaponsByWorldVars);
// Variables can be defined inline as well.
const { data } = await listWeaponsByWorld({ worldId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listWeaponsByWorld(dataConnect, listWeaponsByWorldVars);

console.log(data.weapons);

// Or, you can use the `Promise` API.
listWeaponsByWorld(listWeaponsByWorldVars).then((response) => {
  const data = response.data;
  console.log(data.weapons);
});
```

### Using `ListWeaponsByWorld`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listWeaponsByWorldRef, ListWeaponsByWorldVariables } from '@anify/dataconnect';

// The `ListWeaponsByWorld` query requires an argument of type `ListWeaponsByWorldVariables`:
const listWeaponsByWorldVars: ListWeaponsByWorldVariables = {
  worldId: ..., 
};

// Call the `listWeaponsByWorldRef()` function to get a reference to the query.
const ref = listWeaponsByWorldRef(listWeaponsByWorldVars);
// Variables can be defined inline as well.
const ref = listWeaponsByWorldRef({ worldId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listWeaponsByWorldRef(dataConnect, listWeaponsByWorldVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.weapons);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.weapons);
});
```

## GetWeapon
You can execute the `GetWeapon` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getWeapon(vars: GetWeaponVariables): QueryPromise<GetWeaponData, GetWeaponVariables>;

interface GetWeaponRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetWeaponVariables): QueryRef<GetWeaponData, GetWeaponVariables>;
}
export const getWeaponRef: GetWeaponRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getWeapon(dc: DataConnect, vars: GetWeaponVariables): QueryPromise<GetWeaponData, GetWeaponVariables>;

interface GetWeaponRef {
  ...
  (dc: DataConnect, vars: GetWeaponVariables): QueryRef<GetWeaponData, GetWeaponVariables>;
}
export const getWeaponRef: GetWeaponRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getWeaponRef:
```typescript
const name = getWeaponRef.operationName;
console.log(name);
```

### Variables
The `GetWeapon` query requires an argument of type `GetWeaponVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetWeaponVariables {
  id: string;
}
```
### Return Type
Recall that executing the `GetWeapon` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetWeaponData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetWeapon`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getWeapon, GetWeaponVariables } from '@anify/dataconnect';

// The `GetWeapon` query requires an argument of type `GetWeaponVariables`:
const getWeaponVars: GetWeaponVariables = {
  id: ..., 
};

// Call the `getWeapon()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getWeapon(getWeaponVars);
// Variables can be defined inline as well.
const { data } = await getWeapon({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getWeapon(dataConnect, getWeaponVars);

console.log(data.weapon);

// Or, you can use the `Promise` API.
getWeapon(getWeaponVars).then((response) => {
  const data = response.data;
  console.log(data.weapon);
});
```

### Using `GetWeapon`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getWeaponRef, GetWeaponVariables } from '@anify/dataconnect';

// The `GetWeapon` query requires an argument of type `GetWeaponVariables`:
const getWeaponVars: GetWeaponVariables = {
  id: ..., 
};

// Call the `getWeaponRef()` function to get a reference to the query.
const ref = getWeaponRef(getWeaponVars);
// Variables can be defined inline as well.
const ref = getWeaponRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getWeaponRef(dataConnect, getWeaponVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.weapon);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.weapon);
});
```

## ListCharactersByWorld
You can execute the `ListCharactersByWorld` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listCharactersByWorld(vars: ListCharactersByWorldVariables): QueryPromise<ListCharactersByWorldData, ListCharactersByWorldVariables>;

interface ListCharactersByWorldRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCharactersByWorldVariables): QueryRef<ListCharactersByWorldData, ListCharactersByWorldVariables>;
}
export const listCharactersByWorldRef: ListCharactersByWorldRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCharactersByWorld(dc: DataConnect, vars: ListCharactersByWorldVariables): QueryPromise<ListCharactersByWorldData, ListCharactersByWorldVariables>;

interface ListCharactersByWorldRef {
  ...
  (dc: DataConnect, vars: ListCharactersByWorldVariables): QueryRef<ListCharactersByWorldData, ListCharactersByWorldVariables>;
}
export const listCharactersByWorldRef: ListCharactersByWorldRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCharactersByWorldRef:
```typescript
const name = listCharactersByWorldRef.operationName;
console.log(name);
```

### Variables
The `ListCharactersByWorld` query requires an argument of type `ListCharactersByWorldVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListCharactersByWorldVariables {
  worldId: string;
}
```
### Return Type
Recall that executing the `ListCharactersByWorld` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCharactersByWorldData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListCharactersByWorld`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCharactersByWorld, ListCharactersByWorldVariables } from '@anify/dataconnect';

// The `ListCharactersByWorld` query requires an argument of type `ListCharactersByWorldVariables`:
const listCharactersByWorldVars: ListCharactersByWorldVariables = {
  worldId: ..., 
};

// Call the `listCharactersByWorld()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCharactersByWorld(listCharactersByWorldVars);
// Variables can be defined inline as well.
const { data } = await listCharactersByWorld({ worldId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCharactersByWorld(dataConnect, listCharactersByWorldVars);

console.log(data.characters);

// Or, you can use the `Promise` API.
listCharactersByWorld(listCharactersByWorldVars).then((response) => {
  const data = response.data;
  console.log(data.characters);
});
```

### Using `ListCharactersByWorld`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCharactersByWorldRef, ListCharactersByWorldVariables } from '@anify/dataconnect';

// The `ListCharactersByWorld` query requires an argument of type `ListCharactersByWorldVariables`:
const listCharactersByWorldVars: ListCharactersByWorldVariables = {
  worldId: ..., 
};

// Call the `listCharactersByWorldRef()` function to get a reference to the query.
const ref = listCharactersByWorldRef(listCharactersByWorldVars);
// Variables can be defined inline as well.
const ref = listCharactersByWorldRef({ worldId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCharactersByWorldRef(dataConnect, listCharactersByWorldVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.characters);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.characters);
});
```

## GetCharacter
You can execute the `GetCharacter` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getCharacter(vars: GetCharacterVariables): QueryPromise<GetCharacterData, GetCharacterVariables>;

interface GetCharacterRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCharacterVariables): QueryRef<GetCharacterData, GetCharacterVariables>;
}
export const getCharacterRef: GetCharacterRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCharacter(dc: DataConnect, vars: GetCharacterVariables): QueryPromise<GetCharacterData, GetCharacterVariables>;

interface GetCharacterRef {
  ...
  (dc: DataConnect, vars: GetCharacterVariables): QueryRef<GetCharacterData, GetCharacterVariables>;
}
export const getCharacterRef: GetCharacterRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCharacterRef:
```typescript
const name = getCharacterRef.operationName;
console.log(name);
```

### Variables
The `GetCharacter` query requires an argument of type `GetCharacterVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCharacterVariables {
  id: string;
}
```
### Return Type
Recall that executing the `GetCharacter` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCharacterData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetCharacter`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCharacter, GetCharacterVariables } from '@anify/dataconnect';

// The `GetCharacter` query requires an argument of type `GetCharacterVariables`:
const getCharacterVars: GetCharacterVariables = {
  id: ..., 
};

// Call the `getCharacter()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCharacter(getCharacterVars);
// Variables can be defined inline as well.
const { data } = await getCharacter({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCharacter(dataConnect, getCharacterVars);

console.log(data.character);

// Or, you can use the `Promise` API.
getCharacter(getCharacterVars).then((response) => {
  const data = response.data;
  console.log(data.character);
});
```

### Using `GetCharacter`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCharacterRef, GetCharacterVariables } from '@anify/dataconnect';

// The `GetCharacter` query requires an argument of type `GetCharacterVariables`:
const getCharacterVars: GetCharacterVariables = {
  id: ..., 
};

// Call the `getCharacterRef()` function to get a reference to the query.
const ref = getCharacterRef(getCharacterVars);
// Variables can be defined inline as well.
const ref = getCharacterRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCharacterRef(dataConnect, getCharacterVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.character);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.character);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `anify` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## InitializePlayer
You can execute the `InitializePlayer` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
initializePlayer(vars: InitializePlayerVariables): MutationPromise<InitializePlayerData, InitializePlayerVariables>;

interface InitializePlayerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: InitializePlayerVariables): MutationRef<InitializePlayerData, InitializePlayerVariables>;
}
export const initializePlayerRef: InitializePlayerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
initializePlayer(dc: DataConnect, vars: InitializePlayerVariables): MutationPromise<InitializePlayerData, InitializePlayerVariables>;

interface InitializePlayerRef {
  ...
  (dc: DataConnect, vars: InitializePlayerVariables): MutationRef<InitializePlayerData, InitializePlayerVariables>;
}
export const initializePlayerRef: InitializePlayerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the initializePlayerRef:
```typescript
const name = initializePlayerRef.operationName;
console.log(name);
```

### Variables
The `InitializePlayer` mutation requires an argument of type `InitializePlayerVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface InitializePlayerVariables {
  characterName: string;
  avatarId?: string | null;
}
```
### Return Type
Recall that executing the `InitializePlayer` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `InitializePlayerData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface InitializePlayerData {
  playerProfile_insert: PlayerProfile_Key;
}
```
### Using `InitializePlayer`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, initializePlayer, InitializePlayerVariables } from '@anify/dataconnect';

// The `InitializePlayer` mutation requires an argument of type `InitializePlayerVariables`:
const initializePlayerVars: InitializePlayerVariables = {
  characterName: ..., 
  avatarId: ..., // optional
};

// Call the `initializePlayer()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await initializePlayer(initializePlayerVars);
// Variables can be defined inline as well.
const { data } = await initializePlayer({ characterName: ..., avatarId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await initializePlayer(dataConnect, initializePlayerVars);

console.log(data.playerProfile_insert);

// Or, you can use the `Promise` API.
initializePlayer(initializePlayerVars).then((response) => {
  const data = response.data;
  console.log(data.playerProfile_insert);
});
```

### Using `InitializePlayer`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, initializePlayerRef, InitializePlayerVariables } from '@anify/dataconnect';

// The `InitializePlayer` mutation requires an argument of type `InitializePlayerVariables`:
const initializePlayerVars: InitializePlayerVariables = {
  characterName: ..., 
  avatarId: ..., // optional
};

// Call the `initializePlayerRef()` function to get a reference to the mutation.
const ref = initializePlayerRef(initializePlayerVars);
// Variables can be defined inline as well.
const ref = initializePlayerRef({ characterName: ..., avatarId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = initializePlayerRef(dataConnect, initializePlayerVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.playerProfile_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.playerProfile_insert);
});
```

## UpdatePlayerProfile
You can execute the `UpdatePlayerProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updatePlayerProfile(vars?: UpdatePlayerProfileVariables): MutationPromise<UpdatePlayerProfileData, UpdatePlayerProfileVariables>;

interface UpdatePlayerProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdatePlayerProfileVariables): MutationRef<UpdatePlayerProfileData, UpdatePlayerProfileVariables>;
}
export const updatePlayerProfileRef: UpdatePlayerProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updatePlayerProfile(dc: DataConnect, vars?: UpdatePlayerProfileVariables): MutationPromise<UpdatePlayerProfileData, UpdatePlayerProfileVariables>;

interface UpdatePlayerProfileRef {
  ...
  (dc: DataConnect, vars?: UpdatePlayerProfileVariables): MutationRef<UpdatePlayerProfileData, UpdatePlayerProfileVariables>;
}
export const updatePlayerProfileRef: UpdatePlayerProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updatePlayerProfileRef:
```typescript
const name = updatePlayerProfileRef.operationName;
console.log(name);
```

### Variables
The `UpdatePlayerProfile` mutation has an optional argument of type `UpdatePlayerProfileVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdatePlayerProfileVariables {
  characterName?: string | null;
  avatarId?: string | null;
}
```
### Return Type
Recall that executing the `UpdatePlayerProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdatePlayerProfileData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdatePlayerProfileData {
  playerProfile_updateMany: number;
}
```
### Using `UpdatePlayerProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updatePlayerProfile, UpdatePlayerProfileVariables } from '@anify/dataconnect';

// The `UpdatePlayerProfile` mutation has an optional argument of type `UpdatePlayerProfileVariables`:
const updatePlayerProfileVars: UpdatePlayerProfileVariables = {
  characterName: ..., // optional
  avatarId: ..., // optional
};

// Call the `updatePlayerProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updatePlayerProfile(updatePlayerProfileVars);
// Variables can be defined inline as well.
const { data } = await updatePlayerProfile({ characterName: ..., avatarId: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdatePlayerProfileVariables` argument.
const { data } = await updatePlayerProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updatePlayerProfile(dataConnect, updatePlayerProfileVars);

console.log(data.playerProfile_updateMany);

// Or, you can use the `Promise` API.
updatePlayerProfile(updatePlayerProfileVars).then((response) => {
  const data = response.data;
  console.log(data.playerProfile_updateMany);
});
```

### Using `UpdatePlayerProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updatePlayerProfileRef, UpdatePlayerProfileVariables } from '@anify/dataconnect';

// The `UpdatePlayerProfile` mutation has an optional argument of type `UpdatePlayerProfileVariables`:
const updatePlayerProfileVars: UpdatePlayerProfileVariables = {
  characterName: ..., // optional
  avatarId: ..., // optional
};

// Call the `updatePlayerProfileRef()` function to get a reference to the mutation.
const ref = updatePlayerProfileRef(updatePlayerProfileVars);
// Variables can be defined inline as well.
const ref = updatePlayerProfileRef({ characterName: ..., avatarId: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdatePlayerProfileVariables` argument.
const ref = updatePlayerProfileRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updatePlayerProfileRef(dataConnect, updatePlayerProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.playerProfile_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.playerProfile_updateMany);
});
```

## StartTutorial
You can execute the `StartTutorial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
startTutorial(): MutationPromise<StartTutorialData, undefined>;

interface StartTutorialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<StartTutorialData, undefined>;
}
export const startTutorialRef: StartTutorialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
startTutorial(dc: DataConnect): MutationPromise<StartTutorialData, undefined>;

interface StartTutorialRef {
  ...
  (dc: DataConnect): MutationRef<StartTutorialData, undefined>;
}
export const startTutorialRef: StartTutorialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the startTutorialRef:
```typescript
const name = startTutorialRef.operationName;
console.log(name);
```

### Variables
The `StartTutorial` mutation has no variables.
### Return Type
Recall that executing the `StartTutorial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `StartTutorialData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface StartTutorialData {
  playerTutorial_insert: PlayerTutorial_Key;
}
```
### Using `StartTutorial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, startTutorial } from '@anify/dataconnect';


// Call the `startTutorial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await startTutorial();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await startTutorial(dataConnect);

console.log(data.playerTutorial_insert);

// Or, you can use the `Promise` API.
startTutorial().then((response) => {
  const data = response.data;
  console.log(data.playerTutorial_insert);
});
```

### Using `StartTutorial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, startTutorialRef } from '@anify/dataconnect';


// Call the `startTutorialRef()` function to get a reference to the mutation.
const ref = startTutorialRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = startTutorialRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.playerTutorial_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.playerTutorial_insert);
});
```

## AdvanceTutorial
You can execute the `AdvanceTutorial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
advanceTutorial(vars: AdvanceTutorialVariables): MutationPromise<AdvanceTutorialData, AdvanceTutorialVariables>;

interface AdvanceTutorialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdvanceTutorialVariables): MutationRef<AdvanceTutorialData, AdvanceTutorialVariables>;
}
export const advanceTutorialRef: AdvanceTutorialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
advanceTutorial(dc: DataConnect, vars: AdvanceTutorialVariables): MutationPromise<AdvanceTutorialData, AdvanceTutorialVariables>;

interface AdvanceTutorialRef {
  ...
  (dc: DataConnect, vars: AdvanceTutorialVariables): MutationRef<AdvanceTutorialData, AdvanceTutorialVariables>;
}
export const advanceTutorialRef: AdvanceTutorialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the advanceTutorialRef:
```typescript
const name = advanceTutorialRef.operationName;
console.log(name);
```

### Variables
The `AdvanceTutorial` mutation requires an argument of type `AdvanceTutorialVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdvanceTutorialVariables {
  currentStep?: string | null;
  completedSteps: string[];
}
```
### Return Type
Recall that executing the `AdvanceTutorial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdvanceTutorialData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdvanceTutorialData {
  playerTutorial_updateMany: number;
}
```
### Using `AdvanceTutorial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, advanceTutorial, AdvanceTutorialVariables } from '@anify/dataconnect';

// The `AdvanceTutorial` mutation requires an argument of type `AdvanceTutorialVariables`:
const advanceTutorialVars: AdvanceTutorialVariables = {
  currentStep: ..., // optional
  completedSteps: ..., 
};

// Call the `advanceTutorial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await advanceTutorial(advanceTutorialVars);
// Variables can be defined inline as well.
const { data } = await advanceTutorial({ currentStep: ..., completedSteps: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await advanceTutorial(dataConnect, advanceTutorialVars);

console.log(data.playerTutorial_updateMany);

// Or, you can use the `Promise` API.
advanceTutorial(advanceTutorialVars).then((response) => {
  const data = response.data;
  console.log(data.playerTutorial_updateMany);
});
```

### Using `AdvanceTutorial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, advanceTutorialRef, AdvanceTutorialVariables } from '@anify/dataconnect';

// The `AdvanceTutorial` mutation requires an argument of type `AdvanceTutorialVariables`:
const advanceTutorialVars: AdvanceTutorialVariables = {
  currentStep: ..., // optional
  completedSteps: ..., 
};

// Call the `advanceTutorialRef()` function to get a reference to the mutation.
const ref = advanceTutorialRef(advanceTutorialVars);
// Variables can be defined inline as well.
const ref = advanceTutorialRef({ currentStep: ..., completedSteps: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = advanceTutorialRef(dataConnect, advanceTutorialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.playerTutorial_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.playerTutorial_updateMany);
});
```

## CompleteTutorial
You can execute the `CompleteTutorial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
completeTutorial(): MutationPromise<CompleteTutorialData, undefined>;

interface CompleteTutorialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CompleteTutorialData, undefined>;
}
export const completeTutorialRef: CompleteTutorialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
completeTutorial(dc: DataConnect): MutationPromise<CompleteTutorialData, undefined>;

interface CompleteTutorialRef {
  ...
  (dc: DataConnect): MutationRef<CompleteTutorialData, undefined>;
}
export const completeTutorialRef: CompleteTutorialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the completeTutorialRef:
```typescript
const name = completeTutorialRef.operationName;
console.log(name);
```

### Variables
The `CompleteTutorial` mutation has no variables.
### Return Type
Recall that executing the `CompleteTutorial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CompleteTutorialData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CompleteTutorialData {
  playerTutorial_updateMany: number;
}
```
### Using `CompleteTutorial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, completeTutorial } from '@anify/dataconnect';


// Call the `completeTutorial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await completeTutorial();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await completeTutorial(dataConnect);

console.log(data.playerTutorial_updateMany);

// Or, you can use the `Promise` API.
completeTutorial().then((response) => {
  const data = response.data;
  console.log(data.playerTutorial_updateMany);
});
```

### Using `CompleteTutorial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, completeTutorialRef } from '@anify/dataconnect';


// Call the `completeTutorialRef()` function to get a reference to the mutation.
const ref = completeTutorialRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = completeTutorialRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.playerTutorial_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.playerTutorial_updateMany);
});
```

## ResetTutorial
You can execute the `ResetTutorial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
resetTutorial(): MutationPromise<ResetTutorialData, undefined>;

interface ResetTutorialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<ResetTutorialData, undefined>;
}
export const resetTutorialRef: ResetTutorialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
resetTutorial(dc: DataConnect): MutationPromise<ResetTutorialData, undefined>;

interface ResetTutorialRef {
  ...
  (dc: DataConnect): MutationRef<ResetTutorialData, undefined>;
}
export const resetTutorialRef: ResetTutorialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the resetTutorialRef:
```typescript
const name = resetTutorialRef.operationName;
console.log(name);
```

### Variables
The `ResetTutorial` mutation has no variables.
### Return Type
Recall that executing the `ResetTutorial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ResetTutorialData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ResetTutorialData {
  playerTutorial_updateMany: number;
}
```
### Using `ResetTutorial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, resetTutorial } from '@anify/dataconnect';


// Call the `resetTutorial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await resetTutorial();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await resetTutorial(dataConnect);

console.log(data.playerTutorial_updateMany);

// Or, you can use the `Promise` API.
resetTutorial().then((response) => {
  const data = response.data;
  console.log(data.playerTutorial_updateMany);
});
```

### Using `ResetTutorial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, resetTutorialRef } from '@anify/dataconnect';


// Call the `resetTutorialRef()` function to get a reference to the mutation.
const ref = resetTutorialRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = resetTutorialRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.playerTutorial_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.playerTutorial_updateMany);
});
```

## AdminInitializePlayer
You can execute the `AdminInitializePlayer` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
adminInitializePlayer(vars: AdminInitializePlayerVariables): MutationPromise<AdminInitializePlayerData, AdminInitializePlayerVariables>;

interface AdminInitializePlayerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminInitializePlayerVariables): MutationRef<AdminInitializePlayerData, AdminInitializePlayerVariables>;
}
export const adminInitializePlayerRef: AdminInitializePlayerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminInitializePlayer(dc: DataConnect, vars: AdminInitializePlayerVariables): MutationPromise<AdminInitializePlayerData, AdminInitializePlayerVariables>;

interface AdminInitializePlayerRef {
  ...
  (dc: DataConnect, vars: AdminInitializePlayerVariables): MutationRef<AdminInitializePlayerData, AdminInitializePlayerVariables>;
}
export const adminInitializePlayerRef: AdminInitializePlayerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminInitializePlayerRef:
```typescript
const name = adminInitializePlayerRef.operationName;
console.log(name);
```

### Variables
The `AdminInitializePlayer` mutation requires an argument of type `AdminInitializePlayerVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminInitializePlayerVariables {
  userId: string;
  characterName: string;
  avatarId?: string | null;
}
```
### Return Type
Recall that executing the `AdminInitializePlayer` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminInitializePlayerData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminInitializePlayerData {
  playerProfile_insert: PlayerProfile_Key;
}
```
### Using `AdminInitializePlayer`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminInitializePlayer, AdminInitializePlayerVariables } from '@anify/dataconnect';

// The `AdminInitializePlayer` mutation requires an argument of type `AdminInitializePlayerVariables`:
const adminInitializePlayerVars: AdminInitializePlayerVariables = {
  userId: ..., 
  characterName: ..., 
  avatarId: ..., // optional
};

// Call the `adminInitializePlayer()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminInitializePlayer(adminInitializePlayerVars);
// Variables can be defined inline as well.
const { data } = await adminInitializePlayer({ userId: ..., characterName: ..., avatarId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminInitializePlayer(dataConnect, adminInitializePlayerVars);

console.log(data.playerProfile_insert);

// Or, you can use the `Promise` API.
adminInitializePlayer(adminInitializePlayerVars).then((response) => {
  const data = response.data;
  console.log(data.playerProfile_insert);
});
```

### Using `AdminInitializePlayer`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminInitializePlayerRef, AdminInitializePlayerVariables } from '@anify/dataconnect';

// The `AdminInitializePlayer` mutation requires an argument of type `AdminInitializePlayerVariables`:
const adminInitializePlayerVars: AdminInitializePlayerVariables = {
  userId: ..., 
  characterName: ..., 
  avatarId: ..., // optional
};

// Call the `adminInitializePlayerRef()` function to get a reference to the mutation.
const ref = adminInitializePlayerRef(adminInitializePlayerVars);
// Variables can be defined inline as well.
const ref = adminInitializePlayerRef({ userId: ..., characterName: ..., avatarId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminInitializePlayerRef(dataConnect, adminInitializePlayerVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.playerProfile_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.playerProfile_insert);
});
```

## AdminUpdatePlayerProfile
You can execute the `AdminUpdatePlayerProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
adminUpdatePlayerProfile(vars: AdminUpdatePlayerProfileVariables): MutationPromise<AdminUpdatePlayerProfileData, AdminUpdatePlayerProfileVariables>;

interface AdminUpdatePlayerProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminUpdatePlayerProfileVariables): MutationRef<AdminUpdatePlayerProfileData, AdminUpdatePlayerProfileVariables>;
}
export const adminUpdatePlayerProfileRef: AdminUpdatePlayerProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminUpdatePlayerProfile(dc: DataConnect, vars: AdminUpdatePlayerProfileVariables): MutationPromise<AdminUpdatePlayerProfileData, AdminUpdatePlayerProfileVariables>;

interface AdminUpdatePlayerProfileRef {
  ...
  (dc: DataConnect, vars: AdminUpdatePlayerProfileVariables): MutationRef<AdminUpdatePlayerProfileData, AdminUpdatePlayerProfileVariables>;
}
export const adminUpdatePlayerProfileRef: AdminUpdatePlayerProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminUpdatePlayerProfileRef:
```typescript
const name = adminUpdatePlayerProfileRef.operationName;
console.log(name);
```

### Variables
The `AdminUpdatePlayerProfile` mutation requires an argument of type `AdminUpdatePlayerProfileVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminUpdatePlayerProfileVariables {
  userId: string;
  characterName?: string | null;
  avatarId?: string | null;
}
```
### Return Type
Recall that executing the `AdminUpdatePlayerProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminUpdatePlayerProfileData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminUpdatePlayerProfileData {
  playerProfile_updateMany: number;
}
```
### Using `AdminUpdatePlayerProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminUpdatePlayerProfile, AdminUpdatePlayerProfileVariables } from '@anify/dataconnect';

// The `AdminUpdatePlayerProfile` mutation requires an argument of type `AdminUpdatePlayerProfileVariables`:
const adminUpdatePlayerProfileVars: AdminUpdatePlayerProfileVariables = {
  userId: ..., 
  characterName: ..., // optional
  avatarId: ..., // optional
};

// Call the `adminUpdatePlayerProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminUpdatePlayerProfile(adminUpdatePlayerProfileVars);
// Variables can be defined inline as well.
const { data } = await adminUpdatePlayerProfile({ userId: ..., characterName: ..., avatarId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminUpdatePlayerProfile(dataConnect, adminUpdatePlayerProfileVars);

console.log(data.playerProfile_updateMany);

// Or, you can use the `Promise` API.
adminUpdatePlayerProfile(adminUpdatePlayerProfileVars).then((response) => {
  const data = response.data;
  console.log(data.playerProfile_updateMany);
});
```

### Using `AdminUpdatePlayerProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminUpdatePlayerProfileRef, AdminUpdatePlayerProfileVariables } from '@anify/dataconnect';

// The `AdminUpdatePlayerProfile` mutation requires an argument of type `AdminUpdatePlayerProfileVariables`:
const adminUpdatePlayerProfileVars: AdminUpdatePlayerProfileVariables = {
  userId: ..., 
  characterName: ..., // optional
  avatarId: ..., // optional
};

// Call the `adminUpdatePlayerProfileRef()` function to get a reference to the mutation.
const ref = adminUpdatePlayerProfileRef(adminUpdatePlayerProfileVars);
// Variables can be defined inline as well.
const ref = adminUpdatePlayerProfileRef({ userId: ..., characterName: ..., avatarId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminUpdatePlayerProfileRef(dataConnect, adminUpdatePlayerProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.playerProfile_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.playerProfile_updateMany);
});
```

## AdminStartTutorial
You can execute the `AdminStartTutorial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
adminStartTutorial(vars: AdminStartTutorialVariables): MutationPromise<AdminStartTutorialData, AdminStartTutorialVariables>;

interface AdminStartTutorialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminStartTutorialVariables): MutationRef<AdminStartTutorialData, AdminStartTutorialVariables>;
}
export const adminStartTutorialRef: AdminStartTutorialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminStartTutorial(dc: DataConnect, vars: AdminStartTutorialVariables): MutationPromise<AdminStartTutorialData, AdminStartTutorialVariables>;

interface AdminStartTutorialRef {
  ...
  (dc: DataConnect, vars: AdminStartTutorialVariables): MutationRef<AdminStartTutorialData, AdminStartTutorialVariables>;
}
export const adminStartTutorialRef: AdminStartTutorialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminStartTutorialRef:
```typescript
const name = adminStartTutorialRef.operationName;
console.log(name);
```

### Variables
The `AdminStartTutorial` mutation requires an argument of type `AdminStartTutorialVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminStartTutorialVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `AdminStartTutorial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminStartTutorialData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminStartTutorialData {
  playerTutorial_insert: PlayerTutorial_Key;
}
```
### Using `AdminStartTutorial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminStartTutorial, AdminStartTutorialVariables } from '@anify/dataconnect';

// The `AdminStartTutorial` mutation requires an argument of type `AdminStartTutorialVariables`:
const adminStartTutorialVars: AdminStartTutorialVariables = {
  userId: ..., 
};

// Call the `adminStartTutorial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminStartTutorial(adminStartTutorialVars);
// Variables can be defined inline as well.
const { data } = await adminStartTutorial({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminStartTutorial(dataConnect, adminStartTutorialVars);

console.log(data.playerTutorial_insert);

// Or, you can use the `Promise` API.
adminStartTutorial(adminStartTutorialVars).then((response) => {
  const data = response.data;
  console.log(data.playerTutorial_insert);
});
```

### Using `AdminStartTutorial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminStartTutorialRef, AdminStartTutorialVariables } from '@anify/dataconnect';

// The `AdminStartTutorial` mutation requires an argument of type `AdminStartTutorialVariables`:
const adminStartTutorialVars: AdminStartTutorialVariables = {
  userId: ..., 
};

// Call the `adminStartTutorialRef()` function to get a reference to the mutation.
const ref = adminStartTutorialRef(adminStartTutorialVars);
// Variables can be defined inline as well.
const ref = adminStartTutorialRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminStartTutorialRef(dataConnect, adminStartTutorialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.playerTutorial_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.playerTutorial_insert);
});
```

## AdminAdvanceTutorial
You can execute the `AdminAdvanceTutorial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
adminAdvanceTutorial(vars: AdminAdvanceTutorialVariables): MutationPromise<AdminAdvanceTutorialData, AdminAdvanceTutorialVariables>;

interface AdminAdvanceTutorialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminAdvanceTutorialVariables): MutationRef<AdminAdvanceTutorialData, AdminAdvanceTutorialVariables>;
}
export const adminAdvanceTutorialRef: AdminAdvanceTutorialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminAdvanceTutorial(dc: DataConnect, vars: AdminAdvanceTutorialVariables): MutationPromise<AdminAdvanceTutorialData, AdminAdvanceTutorialVariables>;

interface AdminAdvanceTutorialRef {
  ...
  (dc: DataConnect, vars: AdminAdvanceTutorialVariables): MutationRef<AdminAdvanceTutorialData, AdminAdvanceTutorialVariables>;
}
export const adminAdvanceTutorialRef: AdminAdvanceTutorialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminAdvanceTutorialRef:
```typescript
const name = adminAdvanceTutorialRef.operationName;
console.log(name);
```

### Variables
The `AdminAdvanceTutorial` mutation requires an argument of type `AdminAdvanceTutorialVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminAdvanceTutorialVariables {
  userId: string;
  currentStep?: string | null;
  completedSteps: string[];
}
```
### Return Type
Recall that executing the `AdminAdvanceTutorial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminAdvanceTutorialData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminAdvanceTutorialData {
  playerTutorial_updateMany: number;
}
```
### Using `AdminAdvanceTutorial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminAdvanceTutorial, AdminAdvanceTutorialVariables } from '@anify/dataconnect';

// The `AdminAdvanceTutorial` mutation requires an argument of type `AdminAdvanceTutorialVariables`:
const adminAdvanceTutorialVars: AdminAdvanceTutorialVariables = {
  userId: ..., 
  currentStep: ..., // optional
  completedSteps: ..., 
};

// Call the `adminAdvanceTutorial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminAdvanceTutorial(adminAdvanceTutorialVars);
// Variables can be defined inline as well.
const { data } = await adminAdvanceTutorial({ userId: ..., currentStep: ..., completedSteps: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminAdvanceTutorial(dataConnect, adminAdvanceTutorialVars);

console.log(data.playerTutorial_updateMany);

// Or, you can use the `Promise` API.
adminAdvanceTutorial(adminAdvanceTutorialVars).then((response) => {
  const data = response.data;
  console.log(data.playerTutorial_updateMany);
});
```

### Using `AdminAdvanceTutorial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminAdvanceTutorialRef, AdminAdvanceTutorialVariables } from '@anify/dataconnect';

// The `AdminAdvanceTutorial` mutation requires an argument of type `AdminAdvanceTutorialVariables`:
const adminAdvanceTutorialVars: AdminAdvanceTutorialVariables = {
  userId: ..., 
  currentStep: ..., // optional
  completedSteps: ..., 
};

// Call the `adminAdvanceTutorialRef()` function to get a reference to the mutation.
const ref = adminAdvanceTutorialRef(adminAdvanceTutorialVars);
// Variables can be defined inline as well.
const ref = adminAdvanceTutorialRef({ userId: ..., currentStep: ..., completedSteps: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminAdvanceTutorialRef(dataConnect, adminAdvanceTutorialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.playerTutorial_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.playerTutorial_updateMany);
});
```

## AdminCompleteTutorial
You can execute the `AdminCompleteTutorial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
adminCompleteTutorial(vars: AdminCompleteTutorialVariables): MutationPromise<AdminCompleteTutorialData, AdminCompleteTutorialVariables>;

interface AdminCompleteTutorialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminCompleteTutorialVariables): MutationRef<AdminCompleteTutorialData, AdminCompleteTutorialVariables>;
}
export const adminCompleteTutorialRef: AdminCompleteTutorialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminCompleteTutorial(dc: DataConnect, vars: AdminCompleteTutorialVariables): MutationPromise<AdminCompleteTutorialData, AdminCompleteTutorialVariables>;

interface AdminCompleteTutorialRef {
  ...
  (dc: DataConnect, vars: AdminCompleteTutorialVariables): MutationRef<AdminCompleteTutorialData, AdminCompleteTutorialVariables>;
}
export const adminCompleteTutorialRef: AdminCompleteTutorialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminCompleteTutorialRef:
```typescript
const name = adminCompleteTutorialRef.operationName;
console.log(name);
```

### Variables
The `AdminCompleteTutorial` mutation requires an argument of type `AdminCompleteTutorialVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminCompleteTutorialVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `AdminCompleteTutorial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminCompleteTutorialData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminCompleteTutorialData {
  playerTutorial_updateMany: number;
}
```
### Using `AdminCompleteTutorial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminCompleteTutorial, AdminCompleteTutorialVariables } from '@anify/dataconnect';

// The `AdminCompleteTutorial` mutation requires an argument of type `AdminCompleteTutorialVariables`:
const adminCompleteTutorialVars: AdminCompleteTutorialVariables = {
  userId: ..., 
};

// Call the `adminCompleteTutorial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminCompleteTutorial(adminCompleteTutorialVars);
// Variables can be defined inline as well.
const { data } = await adminCompleteTutorial({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminCompleteTutorial(dataConnect, adminCompleteTutorialVars);

console.log(data.playerTutorial_updateMany);

// Or, you can use the `Promise` API.
adminCompleteTutorial(adminCompleteTutorialVars).then((response) => {
  const data = response.data;
  console.log(data.playerTutorial_updateMany);
});
```

### Using `AdminCompleteTutorial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminCompleteTutorialRef, AdminCompleteTutorialVariables } from '@anify/dataconnect';

// The `AdminCompleteTutorial` mutation requires an argument of type `AdminCompleteTutorialVariables`:
const adminCompleteTutorialVars: AdminCompleteTutorialVariables = {
  userId: ..., 
};

// Call the `adminCompleteTutorialRef()` function to get a reference to the mutation.
const ref = adminCompleteTutorialRef(adminCompleteTutorialVars);
// Variables can be defined inline as well.
const ref = adminCompleteTutorialRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminCompleteTutorialRef(dataConnect, adminCompleteTutorialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.playerTutorial_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.playerTutorial_updateMany);
});
```

## AdminResetTutorial
You can execute the `AdminResetTutorial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
adminResetTutorial(vars: AdminResetTutorialVariables): MutationPromise<AdminResetTutorialData, AdminResetTutorialVariables>;

interface AdminResetTutorialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminResetTutorialVariables): MutationRef<AdminResetTutorialData, AdminResetTutorialVariables>;
}
export const adminResetTutorialRef: AdminResetTutorialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminResetTutorial(dc: DataConnect, vars: AdminResetTutorialVariables): MutationPromise<AdminResetTutorialData, AdminResetTutorialVariables>;

interface AdminResetTutorialRef {
  ...
  (dc: DataConnect, vars: AdminResetTutorialVariables): MutationRef<AdminResetTutorialData, AdminResetTutorialVariables>;
}
export const adminResetTutorialRef: AdminResetTutorialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminResetTutorialRef:
```typescript
const name = adminResetTutorialRef.operationName;
console.log(name);
```

### Variables
The `AdminResetTutorial` mutation requires an argument of type `AdminResetTutorialVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminResetTutorialVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `AdminResetTutorial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminResetTutorialData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminResetTutorialData {
  playerTutorial_updateMany: number;
}
```
### Using `AdminResetTutorial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminResetTutorial, AdminResetTutorialVariables } from '@anify/dataconnect';

// The `AdminResetTutorial` mutation requires an argument of type `AdminResetTutorialVariables`:
const adminResetTutorialVars: AdminResetTutorialVariables = {
  userId: ..., 
};

// Call the `adminResetTutorial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminResetTutorial(adminResetTutorialVars);
// Variables can be defined inline as well.
const { data } = await adminResetTutorial({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminResetTutorial(dataConnect, adminResetTutorialVars);

console.log(data.playerTutorial_updateMany);

// Or, you can use the `Promise` API.
adminResetTutorial(adminResetTutorialVars).then((response) => {
  const data = response.data;
  console.log(data.playerTutorial_updateMany);
});
```

### Using `AdminResetTutorial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminResetTutorialRef, AdminResetTutorialVariables } from '@anify/dataconnect';

// The `AdminResetTutorial` mutation requires an argument of type `AdminResetTutorialVariables`:
const adminResetTutorialVars: AdminResetTutorialVariables = {
  userId: ..., 
};

// Call the `adminResetTutorialRef()` function to get a reference to the mutation.
const ref = adminResetTutorialRef(adminResetTutorialVars);
// Variables can be defined inline as well.
const ref = adminResetTutorialRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminResetTutorialRef(dataConnect, adminResetTutorialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.playerTutorial_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.playerTutorial_updateMany);
});
```

## CreateResource
You can execute the `CreateResource` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createResource(vars: CreateResourceVariables): MutationPromise<CreateResourceData, CreateResourceVariables>;

interface CreateResourceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateResourceVariables): MutationRef<CreateResourceData, CreateResourceVariables>;
}
export const createResourceRef: CreateResourceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createResource(dc: DataConnect, vars: CreateResourceVariables): MutationPromise<CreateResourceData, CreateResourceVariables>;

interface CreateResourceRef {
  ...
  (dc: DataConnect, vars: CreateResourceVariables): MutationRef<CreateResourceData, CreateResourceVariables>;
}
export const createResourceRef: CreateResourceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createResourceRef:
```typescript
const name = createResourceRef.operationName;
console.log(name);
```

### Variables
The `CreateResource` mutation requires an argument of type `CreateResourceVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateResourceVariables {
  id: string;
  data: string;
}
```
### Return Type
Recall that executing the `CreateResource` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateResourceData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateResourceData {
  resource_insert: Resource_Key;
}
```
### Using `CreateResource`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createResource, CreateResourceVariables } from '@anify/dataconnect';

// The `CreateResource` mutation requires an argument of type `CreateResourceVariables`:
const createResourceVars: CreateResourceVariables = {
  id: ..., 
  data: ..., 
};

// Call the `createResource()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createResource(createResourceVars);
// Variables can be defined inline as well.
const { data } = await createResource({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createResource(dataConnect, createResourceVars);

console.log(data.resource_insert);

// Or, you can use the `Promise` API.
createResource(createResourceVars).then((response) => {
  const data = response.data;
  console.log(data.resource_insert);
});
```

### Using `CreateResource`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createResourceRef, CreateResourceVariables } from '@anify/dataconnect';

// The `CreateResource` mutation requires an argument of type `CreateResourceVariables`:
const createResourceVars: CreateResourceVariables = {
  id: ..., 
  data: ..., 
};

// Call the `createResourceRef()` function to get a reference to the mutation.
const ref = createResourceRef(createResourceVars);
// Variables can be defined inline as well.
const ref = createResourceRef({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createResourceRef(dataConnect, createResourceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.resource_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.resource_insert);
});
```

## UpdateResource
You can execute the `UpdateResource` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateResource(vars: UpdateResourceVariables): MutationPromise<UpdateResourceData, UpdateResourceVariables>;

interface UpdateResourceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateResourceVariables): MutationRef<UpdateResourceData, UpdateResourceVariables>;
}
export const updateResourceRef: UpdateResourceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateResource(dc: DataConnect, vars: UpdateResourceVariables): MutationPromise<UpdateResourceData, UpdateResourceVariables>;

interface UpdateResourceRef {
  ...
  (dc: DataConnect, vars: UpdateResourceVariables): MutationRef<UpdateResourceData, UpdateResourceVariables>;
}
export const updateResourceRef: UpdateResourceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateResourceRef:
```typescript
const name = updateResourceRef.operationName;
console.log(name);
```

### Variables
The `UpdateResource` mutation requires an argument of type `UpdateResourceVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateResourceVariables {
  id: string;
  data: string;
}
```
### Return Type
Recall that executing the `UpdateResource` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateResourceData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateResourceData {
  resource_update?: Resource_Key | null;
}
```
### Using `UpdateResource`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateResource, UpdateResourceVariables } from '@anify/dataconnect';

// The `UpdateResource` mutation requires an argument of type `UpdateResourceVariables`:
const updateResourceVars: UpdateResourceVariables = {
  id: ..., 
  data: ..., 
};

// Call the `updateResource()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateResource(updateResourceVars);
// Variables can be defined inline as well.
const { data } = await updateResource({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateResource(dataConnect, updateResourceVars);

console.log(data.resource_update);

// Or, you can use the `Promise` API.
updateResource(updateResourceVars).then((response) => {
  const data = response.data;
  console.log(data.resource_update);
});
```

### Using `UpdateResource`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateResourceRef, UpdateResourceVariables } from '@anify/dataconnect';

// The `UpdateResource` mutation requires an argument of type `UpdateResourceVariables`:
const updateResourceVars: UpdateResourceVariables = {
  id: ..., 
  data: ..., 
};

// Call the `updateResourceRef()` function to get a reference to the mutation.
const ref = updateResourceRef(updateResourceVars);
// Variables can be defined inline as well.
const ref = updateResourceRef({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateResourceRef(dataConnect, updateResourceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.resource_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.resource_update);
});
```

## DeleteResource
You can execute the `DeleteResource` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteResource(vars: DeleteResourceVariables): MutationPromise<DeleteResourceData, DeleteResourceVariables>;

interface DeleteResourceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteResourceVariables): MutationRef<DeleteResourceData, DeleteResourceVariables>;
}
export const deleteResourceRef: DeleteResourceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteResource(dc: DataConnect, vars: DeleteResourceVariables): MutationPromise<DeleteResourceData, DeleteResourceVariables>;

interface DeleteResourceRef {
  ...
  (dc: DataConnect, vars: DeleteResourceVariables): MutationRef<DeleteResourceData, DeleteResourceVariables>;
}
export const deleteResourceRef: DeleteResourceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteResourceRef:
```typescript
const name = deleteResourceRef.operationName;
console.log(name);
```

### Variables
The `DeleteResource` mutation requires an argument of type `DeleteResourceVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteResourceVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteResource` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteResourceData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteResourceData {
  resource_delete?: Resource_Key | null;
}
```
### Using `DeleteResource`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteResource, DeleteResourceVariables } from '@anify/dataconnect';

// The `DeleteResource` mutation requires an argument of type `DeleteResourceVariables`:
const deleteResourceVars: DeleteResourceVariables = {
  id: ..., 
};

// Call the `deleteResource()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteResource(deleteResourceVars);
// Variables can be defined inline as well.
const { data } = await deleteResource({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteResource(dataConnect, deleteResourceVars);

console.log(data.resource_delete);

// Or, you can use the `Promise` API.
deleteResource(deleteResourceVars).then((response) => {
  const data = response.data;
  console.log(data.resource_delete);
});
```

### Using `DeleteResource`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteResourceRef, DeleteResourceVariables } from '@anify/dataconnect';

// The `DeleteResource` mutation requires an argument of type `DeleteResourceVariables`:
const deleteResourceVars: DeleteResourceVariables = {
  id: ..., 
};

// Call the `deleteResourceRef()` function to get a reference to the mutation.
const ref = deleteResourceRef(deleteResourceVars);
// Variables can be defined inline as well.
const ref = deleteResourceRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteResourceRef(dataConnect, deleteResourceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.resource_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.resource_delete);
});
```

## CreateScene
You can execute the `CreateScene` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createScene(vars: CreateSceneVariables): MutationPromise<CreateSceneData, CreateSceneVariables>;

interface CreateSceneRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSceneVariables): MutationRef<CreateSceneData, CreateSceneVariables>;
}
export const createSceneRef: CreateSceneRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createScene(dc: DataConnect, vars: CreateSceneVariables): MutationPromise<CreateSceneData, CreateSceneVariables>;

interface CreateSceneRef {
  ...
  (dc: DataConnect, vars: CreateSceneVariables): MutationRef<CreateSceneData, CreateSceneVariables>;
}
export const createSceneRef: CreateSceneRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSceneRef:
```typescript
const name = createSceneRef.operationName;
console.log(name);
```

### Variables
The `CreateScene` mutation requires an argument of type `CreateSceneVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateScene` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSceneData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSceneData {
  scene_insert: Scene_Key;
}
```
### Using `CreateScene`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createScene, CreateSceneVariables } from '@anify/dataconnect';

// The `CreateScene` mutation requires an argument of type `CreateSceneVariables`:
const createSceneVars: CreateSceneVariables = {
  id: ..., 
  name: ..., 
  description: ..., // optional
  splatUrl: ..., 
  wallConfig: ..., // optional
  floorConfig: ..., 
  interactionPoints: ..., 
  worldId: ..., 
};

// Call the `createScene()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createScene(createSceneVars);
// Variables can be defined inline as well.
const { data } = await createScene({ id: ..., name: ..., description: ..., splatUrl: ..., wallConfig: ..., floorConfig: ..., interactionPoints: ..., worldId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createScene(dataConnect, createSceneVars);

console.log(data.scene_insert);

// Or, you can use the `Promise` API.
createScene(createSceneVars).then((response) => {
  const data = response.data;
  console.log(data.scene_insert);
});
```

### Using `CreateScene`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSceneRef, CreateSceneVariables } from '@anify/dataconnect';

// The `CreateScene` mutation requires an argument of type `CreateSceneVariables`:
const createSceneVars: CreateSceneVariables = {
  id: ..., 
  name: ..., 
  description: ..., // optional
  splatUrl: ..., 
  wallConfig: ..., // optional
  floorConfig: ..., 
  interactionPoints: ..., 
  worldId: ..., 
};

// Call the `createSceneRef()` function to get a reference to the mutation.
const ref = createSceneRef(createSceneVars);
// Variables can be defined inline as well.
const ref = createSceneRef({ id: ..., name: ..., description: ..., splatUrl: ..., wallConfig: ..., floorConfig: ..., interactionPoints: ..., worldId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSceneRef(dataConnect, createSceneVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.scene_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.scene_insert);
});
```

## UpdateScene
You can execute the `UpdateScene` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateScene(vars: UpdateSceneVariables): MutationPromise<UpdateSceneData, UpdateSceneVariables>;

interface UpdateSceneRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSceneVariables): MutationRef<UpdateSceneData, UpdateSceneVariables>;
}
export const updateSceneRef: UpdateSceneRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateScene(dc: DataConnect, vars: UpdateSceneVariables): MutationPromise<UpdateSceneData, UpdateSceneVariables>;

interface UpdateSceneRef {
  ...
  (dc: DataConnect, vars: UpdateSceneVariables): MutationRef<UpdateSceneData, UpdateSceneVariables>;
}
export const updateSceneRef: UpdateSceneRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateSceneRef:
```typescript
const name = updateSceneRef.operationName;
console.log(name);
```

### Variables
The `UpdateScene` mutation requires an argument of type `UpdateSceneVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateSceneVariables {
  id: string;
  name?: string | null;
  description?: string | null;
  splatUrl?: string | null;
  wallConfig?: string | null;
  floorConfig?: string | null;
  interactionPoints?: string | null;
}
```
### Return Type
Recall that executing the `UpdateScene` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateSceneData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateSceneData {
  scene_update?: Scene_Key | null;
}
```
### Using `UpdateScene`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateScene, UpdateSceneVariables } from '@anify/dataconnect';

// The `UpdateScene` mutation requires an argument of type `UpdateSceneVariables`:
const updateSceneVars: UpdateSceneVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
  splatUrl: ..., // optional
  wallConfig: ..., // optional
  floorConfig: ..., // optional
  interactionPoints: ..., // optional
};

// Call the `updateScene()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateScene(updateSceneVars);
// Variables can be defined inline as well.
const { data } = await updateScene({ id: ..., name: ..., description: ..., splatUrl: ..., wallConfig: ..., floorConfig: ..., interactionPoints: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateScene(dataConnect, updateSceneVars);

console.log(data.scene_update);

// Or, you can use the `Promise` API.
updateScene(updateSceneVars).then((response) => {
  const data = response.data;
  console.log(data.scene_update);
});
```

### Using `UpdateScene`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateSceneRef, UpdateSceneVariables } from '@anify/dataconnect';

// The `UpdateScene` mutation requires an argument of type `UpdateSceneVariables`:
const updateSceneVars: UpdateSceneVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
  splatUrl: ..., // optional
  wallConfig: ..., // optional
  floorConfig: ..., // optional
  interactionPoints: ..., // optional
};

// Call the `updateSceneRef()` function to get a reference to the mutation.
const ref = updateSceneRef(updateSceneVars);
// Variables can be defined inline as well.
const ref = updateSceneRef({ id: ..., name: ..., description: ..., splatUrl: ..., wallConfig: ..., floorConfig: ..., interactionPoints: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateSceneRef(dataConnect, updateSceneVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.scene_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.scene_update);
});
```

## DeleteScene
You can execute the `DeleteScene` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteScene(vars: DeleteSceneVariables): MutationPromise<DeleteSceneData, DeleteSceneVariables>;

interface DeleteSceneRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSceneVariables): MutationRef<DeleteSceneData, DeleteSceneVariables>;
}
export const deleteSceneRef: DeleteSceneRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteScene(dc: DataConnect, vars: DeleteSceneVariables): MutationPromise<DeleteSceneData, DeleteSceneVariables>;

interface DeleteSceneRef {
  ...
  (dc: DataConnect, vars: DeleteSceneVariables): MutationRef<DeleteSceneData, DeleteSceneVariables>;
}
export const deleteSceneRef: DeleteSceneRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteSceneRef:
```typescript
const name = deleteSceneRef.operationName;
console.log(name);
```

### Variables
The `DeleteScene` mutation requires an argument of type `DeleteSceneVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteSceneVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteScene` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteSceneData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteSceneData {
  scene_delete?: Scene_Key | null;
}
```
### Using `DeleteScene`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteScene, DeleteSceneVariables } from '@anify/dataconnect';

// The `DeleteScene` mutation requires an argument of type `DeleteSceneVariables`:
const deleteSceneVars: DeleteSceneVariables = {
  id: ..., 
};

// Call the `deleteScene()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteScene(deleteSceneVars);
// Variables can be defined inline as well.
const { data } = await deleteScene({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteScene(dataConnect, deleteSceneVars);

console.log(data.scene_delete);

// Or, you can use the `Promise` API.
deleteScene(deleteSceneVars).then((response) => {
  const data = response.data;
  console.log(data.scene_delete);
});
```

### Using `DeleteScene`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteSceneRef, DeleteSceneVariables } from '@anify/dataconnect';

// The `DeleteScene` mutation requires an argument of type `DeleteSceneVariables`:
const deleteSceneVars: DeleteSceneVariables = {
  id: ..., 
};

// Call the `deleteSceneRef()` function to get a reference to the mutation.
const ref = deleteSceneRef(deleteSceneVars);
// Variables can be defined inline as well.
const ref = deleteSceneRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteSceneRef(dataConnect, deleteSceneVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.scene_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.scene_delete);
});
```

## CreateWorld
You can execute the `CreateWorld` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createWorld(vars: CreateWorldVariables): MutationPromise<CreateWorldData, CreateWorldVariables>;

interface CreateWorldRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateWorldVariables): MutationRef<CreateWorldData, CreateWorldVariables>;
}
export const createWorldRef: CreateWorldRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createWorld(dc: DataConnect, vars: CreateWorldVariables): MutationPromise<CreateWorldData, CreateWorldVariables>;

interface CreateWorldRef {
  ...
  (dc: DataConnect, vars: CreateWorldVariables): MutationRef<CreateWorldData, CreateWorldVariables>;
}
export const createWorldRef: CreateWorldRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createWorldRef:
```typescript
const name = createWorldRef.operationName;
console.log(name);
```

### Variables
The `CreateWorld` mutation requires an argument of type `CreateWorldVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateWorldVariables {
  id: string;
  name: string;
  description?: string | null;
  coverImage?: string | null;
  isPublic?: boolean | null;
}
```
### Return Type
Recall that executing the `CreateWorld` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateWorldData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateWorldData {
  world_insert: World_Key;
}
```
### Using `CreateWorld`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createWorld, CreateWorldVariables } from '@anify/dataconnect';

// The `CreateWorld` mutation requires an argument of type `CreateWorldVariables`:
const createWorldVars: CreateWorldVariables = {
  id: ..., 
  name: ..., 
  description: ..., // optional
  coverImage: ..., // optional
  isPublic: ..., // optional
};

// Call the `createWorld()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createWorld(createWorldVars);
// Variables can be defined inline as well.
const { data } = await createWorld({ id: ..., name: ..., description: ..., coverImage: ..., isPublic: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createWorld(dataConnect, createWorldVars);

console.log(data.world_insert);

// Or, you can use the `Promise` API.
createWorld(createWorldVars).then((response) => {
  const data = response.data;
  console.log(data.world_insert);
});
```

### Using `CreateWorld`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createWorldRef, CreateWorldVariables } from '@anify/dataconnect';

// The `CreateWorld` mutation requires an argument of type `CreateWorldVariables`:
const createWorldVars: CreateWorldVariables = {
  id: ..., 
  name: ..., 
  description: ..., // optional
  coverImage: ..., // optional
  isPublic: ..., // optional
};

// Call the `createWorldRef()` function to get a reference to the mutation.
const ref = createWorldRef(createWorldVars);
// Variables can be defined inline as well.
const ref = createWorldRef({ id: ..., name: ..., description: ..., coverImage: ..., isPublic: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createWorldRef(dataConnect, createWorldVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.world_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.world_insert);
});
```

## UpdateWorld
You can execute the `UpdateWorld` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateWorld(vars: UpdateWorldVariables): MutationPromise<UpdateWorldData, UpdateWorldVariables>;

interface UpdateWorldRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateWorldVariables): MutationRef<UpdateWorldData, UpdateWorldVariables>;
}
export const updateWorldRef: UpdateWorldRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateWorld(dc: DataConnect, vars: UpdateWorldVariables): MutationPromise<UpdateWorldData, UpdateWorldVariables>;

interface UpdateWorldRef {
  ...
  (dc: DataConnect, vars: UpdateWorldVariables): MutationRef<UpdateWorldData, UpdateWorldVariables>;
}
export const updateWorldRef: UpdateWorldRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateWorldRef:
```typescript
const name = updateWorldRef.operationName;
console.log(name);
```

### Variables
The `UpdateWorld` mutation requires an argument of type `UpdateWorldVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateWorldVariables {
  id: string;
  name?: string | null;
  description?: string | null;
  coverImage?: string | null;
  isPublic?: boolean | null;
}
```
### Return Type
Recall that executing the `UpdateWorld` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateWorldData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateWorldData {
  world_update?: World_Key | null;
}
```
### Using `UpdateWorld`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateWorld, UpdateWorldVariables } from '@anify/dataconnect';

// The `UpdateWorld` mutation requires an argument of type `UpdateWorldVariables`:
const updateWorldVars: UpdateWorldVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
  coverImage: ..., // optional
  isPublic: ..., // optional
};

// Call the `updateWorld()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateWorld(updateWorldVars);
// Variables can be defined inline as well.
const { data } = await updateWorld({ id: ..., name: ..., description: ..., coverImage: ..., isPublic: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateWorld(dataConnect, updateWorldVars);

console.log(data.world_update);

// Or, you can use the `Promise` API.
updateWorld(updateWorldVars).then((response) => {
  const data = response.data;
  console.log(data.world_update);
});
```

### Using `UpdateWorld`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateWorldRef, UpdateWorldVariables } from '@anify/dataconnect';

// The `UpdateWorld` mutation requires an argument of type `UpdateWorldVariables`:
const updateWorldVars: UpdateWorldVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
  coverImage: ..., // optional
  isPublic: ..., // optional
};

// Call the `updateWorldRef()` function to get a reference to the mutation.
const ref = updateWorldRef(updateWorldVars);
// Variables can be defined inline as well.
const ref = updateWorldRef({ id: ..., name: ..., description: ..., coverImage: ..., isPublic: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateWorldRef(dataConnect, updateWorldVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.world_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.world_update);
});
```

## DeleteWorld
You can execute the `DeleteWorld` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteWorld(vars: DeleteWorldVariables): MutationPromise<DeleteWorldData, DeleteWorldVariables>;

interface DeleteWorldRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteWorldVariables): MutationRef<DeleteWorldData, DeleteWorldVariables>;
}
export const deleteWorldRef: DeleteWorldRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteWorld(dc: DataConnect, vars: DeleteWorldVariables): MutationPromise<DeleteWorldData, DeleteWorldVariables>;

interface DeleteWorldRef {
  ...
  (dc: DataConnect, vars: DeleteWorldVariables): MutationRef<DeleteWorldData, DeleteWorldVariables>;
}
export const deleteWorldRef: DeleteWorldRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteWorldRef:
```typescript
const name = deleteWorldRef.operationName;
console.log(name);
```

### Variables
The `DeleteWorld` mutation requires an argument of type `DeleteWorldVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteWorldVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteWorld` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteWorldData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteWorldData {
  world_delete?: World_Key | null;
}
```
### Using `DeleteWorld`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteWorld, DeleteWorldVariables } from '@anify/dataconnect';

// The `DeleteWorld` mutation requires an argument of type `DeleteWorldVariables`:
const deleteWorldVars: DeleteWorldVariables = {
  id: ..., 
};

// Call the `deleteWorld()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteWorld(deleteWorldVars);
// Variables can be defined inline as well.
const { data } = await deleteWorld({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteWorld(dataConnect, deleteWorldVars);

console.log(data.world_delete);

// Or, you can use the `Promise` API.
deleteWorld(deleteWorldVars).then((response) => {
  const data = response.data;
  console.log(data.world_delete);
});
```

### Using `DeleteWorld`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteWorldRef, DeleteWorldVariables } from '@anify/dataconnect';

// The `DeleteWorld` mutation requires an argument of type `DeleteWorldVariables`:
const deleteWorldVars: DeleteWorldVariables = {
  id: ..., 
};

// Call the `deleteWorldRef()` function to get a reference to the mutation.
const ref = deleteWorldRef(deleteWorldVars);
// Variables can be defined inline as well.
const ref = deleteWorldRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteWorldRef(dataConnect, deleteWorldVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.world_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.world_delete);
});
```

## AddCollaborator
You can execute the `AddCollaborator` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
addCollaborator(vars: AddCollaboratorVariables): MutationPromise<AddCollaboratorData, AddCollaboratorVariables>;

interface AddCollaboratorRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddCollaboratorVariables): MutationRef<AddCollaboratorData, AddCollaboratorVariables>;
}
export const addCollaboratorRef: AddCollaboratorRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addCollaborator(dc: DataConnect, vars: AddCollaboratorVariables): MutationPromise<AddCollaboratorData, AddCollaboratorVariables>;

interface AddCollaboratorRef {
  ...
  (dc: DataConnect, vars: AddCollaboratorVariables): MutationRef<AddCollaboratorData, AddCollaboratorVariables>;
}
export const addCollaboratorRef: AddCollaboratorRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addCollaboratorRef:
```typescript
const name = addCollaboratorRef.operationName;
console.log(name);
```

### Variables
The `AddCollaborator` mutation requires an argument of type `AddCollaboratorVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddCollaboratorVariables {
  worldId: string;
  userId: string;
}
```
### Return Type
Recall that executing the `AddCollaborator` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddCollaboratorData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddCollaboratorData {
  worldCollaborator_upsert: WorldCollaborator_Key;
}
```
### Using `AddCollaborator`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addCollaborator, AddCollaboratorVariables } from '@anify/dataconnect';

// The `AddCollaborator` mutation requires an argument of type `AddCollaboratorVariables`:
const addCollaboratorVars: AddCollaboratorVariables = {
  worldId: ..., 
  userId: ..., 
};

// Call the `addCollaborator()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addCollaborator(addCollaboratorVars);
// Variables can be defined inline as well.
const { data } = await addCollaborator({ worldId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addCollaborator(dataConnect, addCollaboratorVars);

console.log(data.worldCollaborator_upsert);

// Or, you can use the `Promise` API.
addCollaborator(addCollaboratorVars).then((response) => {
  const data = response.data;
  console.log(data.worldCollaborator_upsert);
});
```

### Using `AddCollaborator`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addCollaboratorRef, AddCollaboratorVariables } from '@anify/dataconnect';

// The `AddCollaborator` mutation requires an argument of type `AddCollaboratorVariables`:
const addCollaboratorVars: AddCollaboratorVariables = {
  worldId: ..., 
  userId: ..., 
};

// Call the `addCollaboratorRef()` function to get a reference to the mutation.
const ref = addCollaboratorRef(addCollaboratorVars);
// Variables can be defined inline as well.
const ref = addCollaboratorRef({ worldId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addCollaboratorRef(dataConnect, addCollaboratorVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.worldCollaborator_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.worldCollaborator_upsert);
});
```

## RemoveCollaborator
You can execute the `RemoveCollaborator` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
removeCollaborator(vars: RemoveCollaboratorVariables): MutationPromise<RemoveCollaboratorData, RemoveCollaboratorVariables>;

interface RemoveCollaboratorRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveCollaboratorVariables): MutationRef<RemoveCollaboratorData, RemoveCollaboratorVariables>;
}
export const removeCollaboratorRef: RemoveCollaboratorRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
removeCollaborator(dc: DataConnect, vars: RemoveCollaboratorVariables): MutationPromise<RemoveCollaboratorData, RemoveCollaboratorVariables>;

interface RemoveCollaboratorRef {
  ...
  (dc: DataConnect, vars: RemoveCollaboratorVariables): MutationRef<RemoveCollaboratorData, RemoveCollaboratorVariables>;
}
export const removeCollaboratorRef: RemoveCollaboratorRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the removeCollaboratorRef:
```typescript
const name = removeCollaboratorRef.operationName;
console.log(name);
```

### Variables
The `RemoveCollaborator` mutation requires an argument of type `RemoveCollaboratorVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RemoveCollaboratorVariables {
  worldId: string;
  userId: string;
}
```
### Return Type
Recall that executing the `RemoveCollaborator` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RemoveCollaboratorData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RemoveCollaboratorData {
  worldCollaborator_deleteMany: number;
}
```
### Using `RemoveCollaborator`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, removeCollaborator, RemoveCollaboratorVariables } from '@anify/dataconnect';

// The `RemoveCollaborator` mutation requires an argument of type `RemoveCollaboratorVariables`:
const removeCollaboratorVars: RemoveCollaboratorVariables = {
  worldId: ..., 
  userId: ..., 
};

// Call the `removeCollaborator()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await removeCollaborator(removeCollaboratorVars);
// Variables can be defined inline as well.
const { data } = await removeCollaborator({ worldId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await removeCollaborator(dataConnect, removeCollaboratorVars);

console.log(data.worldCollaborator_deleteMany);

// Or, you can use the `Promise` API.
removeCollaborator(removeCollaboratorVars).then((response) => {
  const data = response.data;
  console.log(data.worldCollaborator_deleteMany);
});
```

### Using `RemoveCollaborator`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, removeCollaboratorRef, RemoveCollaboratorVariables } from '@anify/dataconnect';

// The `RemoveCollaborator` mutation requires an argument of type `RemoveCollaboratorVariables`:
const removeCollaboratorVars: RemoveCollaboratorVariables = {
  worldId: ..., 
  userId: ..., 
};

// Call the `removeCollaboratorRef()` function to get a reference to the mutation.
const ref = removeCollaboratorRef(removeCollaboratorVars);
// Variables can be defined inline as well.
const ref = removeCollaboratorRef({ worldId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = removeCollaboratorRef(dataConnect, removeCollaboratorVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.worldCollaborator_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.worldCollaborator_deleteMany);
});
```

## CreateItem
You can execute the `CreateItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createItem(vars: CreateItemVariables): MutationPromise<CreateItemData, CreateItemVariables>;

interface CreateItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateItemVariables): MutationRef<CreateItemData, CreateItemVariables>;
}
export const createItemRef: CreateItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createItem(dc: DataConnect, vars: CreateItemVariables): MutationPromise<CreateItemData, CreateItemVariables>;

interface CreateItemRef {
  ...
  (dc: DataConnect, vars: CreateItemVariables): MutationRef<CreateItemData, CreateItemVariables>;
}
export const createItemRef: CreateItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createItemRef:
```typescript
const name = createItemRef.operationName;
console.log(name);
```

### Variables
The `CreateItem` mutation requires an argument of type `CreateItemVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateItemVariables {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  data?: string | null;
}
```
### Return Type
Recall that executing the `CreateItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateItemData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateItemData {
  item_insert: Item_Key;
}
```
### Using `CreateItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createItem, CreateItemVariables } from '@anify/dataconnect';

// The `CreateItem` mutation requires an argument of type `CreateItemVariables`:
const createItemVars: CreateItemVariables = {
  id: ..., 
  name: ..., 
  description: ..., 
  type: ..., 
  rarity: ..., 
  data: ..., // optional
};

// Call the `createItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createItem(createItemVars);
// Variables can be defined inline as well.
const { data } = await createItem({ id: ..., name: ..., description: ..., type: ..., rarity: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createItem(dataConnect, createItemVars);

console.log(data.item_insert);

// Or, you can use the `Promise` API.
createItem(createItemVars).then((response) => {
  const data = response.data;
  console.log(data.item_insert);
});
```

### Using `CreateItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createItemRef, CreateItemVariables } from '@anify/dataconnect';

// The `CreateItem` mutation requires an argument of type `CreateItemVariables`:
const createItemVars: CreateItemVariables = {
  id: ..., 
  name: ..., 
  description: ..., 
  type: ..., 
  rarity: ..., 
  data: ..., // optional
};

// Call the `createItemRef()` function to get a reference to the mutation.
const ref = createItemRef(createItemVars);
// Variables can be defined inline as well.
const ref = createItemRef({ id: ..., name: ..., description: ..., type: ..., rarity: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createItemRef(dataConnect, createItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.item_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.item_insert);
});
```

## UpdateItem
You can execute the `UpdateItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateItem(vars: UpdateItemVariables): MutationPromise<UpdateItemData, UpdateItemVariables>;

interface UpdateItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateItemVariables): MutationRef<UpdateItemData, UpdateItemVariables>;
}
export const updateItemRef: UpdateItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateItem(dc: DataConnect, vars: UpdateItemVariables): MutationPromise<UpdateItemData, UpdateItemVariables>;

interface UpdateItemRef {
  ...
  (dc: DataConnect, vars: UpdateItemVariables): MutationRef<UpdateItemData, UpdateItemVariables>;
}
export const updateItemRef: UpdateItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateItemRef:
```typescript
const name = updateItemRef.operationName;
console.log(name);
```

### Variables
The `UpdateItem` mutation requires an argument of type `UpdateItemVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateItemVariables {
  id: string;
  name?: string | null;
  description?: string | null;
  type?: ItemType | null;
  rarity?: ItemRarity | null;
  data?: string | null;
}
```
### Return Type
Recall that executing the `UpdateItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateItemData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateItemData {
  item_update?: Item_Key | null;
}
```
### Using `UpdateItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateItem, UpdateItemVariables } from '@anify/dataconnect';

// The `UpdateItem` mutation requires an argument of type `UpdateItemVariables`:
const updateItemVars: UpdateItemVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
  type: ..., // optional
  rarity: ..., // optional
  data: ..., // optional
};

// Call the `updateItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateItem(updateItemVars);
// Variables can be defined inline as well.
const { data } = await updateItem({ id: ..., name: ..., description: ..., type: ..., rarity: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateItem(dataConnect, updateItemVars);

console.log(data.item_update);

// Or, you can use the `Promise` API.
updateItem(updateItemVars).then((response) => {
  const data = response.data;
  console.log(data.item_update);
});
```

### Using `UpdateItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateItemRef, UpdateItemVariables } from '@anify/dataconnect';

// The `UpdateItem` mutation requires an argument of type `UpdateItemVariables`:
const updateItemVars: UpdateItemVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
  type: ..., // optional
  rarity: ..., // optional
  data: ..., // optional
};

// Call the `updateItemRef()` function to get a reference to the mutation.
const ref = updateItemRef(updateItemVars);
// Variables can be defined inline as well.
const ref = updateItemRef({ id: ..., name: ..., description: ..., type: ..., rarity: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateItemRef(dataConnect, updateItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.item_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.item_update);
});
```

## DeleteItem
You can execute the `DeleteItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteItem(vars: DeleteItemVariables): MutationPromise<DeleteItemData, DeleteItemVariables>;

interface DeleteItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteItemVariables): MutationRef<DeleteItemData, DeleteItemVariables>;
}
export const deleteItemRef: DeleteItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteItem(dc: DataConnect, vars: DeleteItemVariables): MutationPromise<DeleteItemData, DeleteItemVariables>;

interface DeleteItemRef {
  ...
  (dc: DataConnect, vars: DeleteItemVariables): MutationRef<DeleteItemData, DeleteItemVariables>;
}
export const deleteItemRef: DeleteItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteItemRef:
```typescript
const name = deleteItemRef.operationName;
console.log(name);
```

### Variables
The `DeleteItem` mutation requires an argument of type `DeleteItemVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteItemVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteItemData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteItemData {
  item_delete?: Item_Key | null;
}
```
### Using `DeleteItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteItem, DeleteItemVariables } from '@anify/dataconnect';

// The `DeleteItem` mutation requires an argument of type `DeleteItemVariables`:
const deleteItemVars: DeleteItemVariables = {
  id: ..., 
};

// Call the `deleteItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteItem(deleteItemVars);
// Variables can be defined inline as well.
const { data } = await deleteItem({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteItem(dataConnect, deleteItemVars);

console.log(data.item_delete);

// Or, you can use the `Promise` API.
deleteItem(deleteItemVars).then((response) => {
  const data = response.data;
  console.log(data.item_delete);
});
```

### Using `DeleteItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteItemRef, DeleteItemVariables } from '@anify/dataconnect';

// The `DeleteItem` mutation requires an argument of type `DeleteItemVariables`:
const deleteItemVars: DeleteItemVariables = {
  id: ..., 
};

// Call the `deleteItemRef()` function to get a reference to the mutation.
const ref = deleteItemRef(deleteItemVars);
// Variables can be defined inline as well.
const ref = deleteItemRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteItemRef(dataConnect, deleteItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.item_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.item_delete);
});
```

## CreateTokenWallet
You can execute the `CreateTokenWallet` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createTokenWallet(): MutationPromise<CreateTokenWalletData, undefined>;

interface CreateTokenWalletRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateTokenWalletData, undefined>;
}
export const createTokenWalletRef: CreateTokenWalletRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTokenWallet(dc: DataConnect): MutationPromise<CreateTokenWalletData, undefined>;

interface CreateTokenWalletRef {
  ...
  (dc: DataConnect): MutationRef<CreateTokenWalletData, undefined>;
}
export const createTokenWalletRef: CreateTokenWalletRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTokenWalletRef:
```typescript
const name = createTokenWalletRef.operationName;
console.log(name);
```

### Variables
The `CreateTokenWallet` mutation has no variables.
### Return Type
Recall that executing the `CreateTokenWallet` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTokenWalletData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTokenWalletData {
  tokenWallet_insert: TokenWallet_Key;
}
```
### Using `CreateTokenWallet`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTokenWallet } from '@anify/dataconnect';


// Call the `createTokenWallet()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTokenWallet();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTokenWallet(dataConnect);

console.log(data.tokenWallet_insert);

// Or, you can use the `Promise` API.
createTokenWallet().then((response) => {
  const data = response.data;
  console.log(data.tokenWallet_insert);
});
```

### Using `CreateTokenWallet`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTokenWalletRef } from '@anify/dataconnect';


// Call the `createTokenWalletRef()` function to get a reference to the mutation.
const ref = createTokenWalletRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTokenWalletRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.tokenWallet_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.tokenWallet_insert);
});
```

## AdminCreateTokenWallet
You can execute the `AdminCreateTokenWallet` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
adminCreateTokenWallet(vars: AdminCreateTokenWalletVariables): MutationPromise<AdminCreateTokenWalletData, AdminCreateTokenWalletVariables>;

interface AdminCreateTokenWalletRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminCreateTokenWalletVariables): MutationRef<AdminCreateTokenWalletData, AdminCreateTokenWalletVariables>;
}
export const adminCreateTokenWalletRef: AdminCreateTokenWalletRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminCreateTokenWallet(dc: DataConnect, vars: AdminCreateTokenWalletVariables): MutationPromise<AdminCreateTokenWalletData, AdminCreateTokenWalletVariables>;

interface AdminCreateTokenWalletRef {
  ...
  (dc: DataConnect, vars: AdminCreateTokenWalletVariables): MutationRef<AdminCreateTokenWalletData, AdminCreateTokenWalletVariables>;
}
export const adminCreateTokenWalletRef: AdminCreateTokenWalletRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminCreateTokenWalletRef:
```typescript
const name = adminCreateTokenWalletRef.operationName;
console.log(name);
```

### Variables
The `AdminCreateTokenWallet` mutation requires an argument of type `AdminCreateTokenWalletVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminCreateTokenWalletVariables {
  userId: string;
  balanceTokens: number;
  planType: PlanType;
}
```
### Return Type
Recall that executing the `AdminCreateTokenWallet` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminCreateTokenWalletData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminCreateTokenWalletData {
  tokenWallet_insert: TokenWallet_Key;
}
```
### Using `AdminCreateTokenWallet`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminCreateTokenWallet, AdminCreateTokenWalletVariables } from '@anify/dataconnect';

// The `AdminCreateTokenWallet` mutation requires an argument of type `AdminCreateTokenWalletVariables`:
const adminCreateTokenWalletVars: AdminCreateTokenWalletVariables = {
  userId: ..., 
  balanceTokens: ..., 
  planType: ..., 
};

// Call the `adminCreateTokenWallet()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminCreateTokenWallet(adminCreateTokenWalletVars);
// Variables can be defined inline as well.
const { data } = await adminCreateTokenWallet({ userId: ..., balanceTokens: ..., planType: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminCreateTokenWallet(dataConnect, adminCreateTokenWalletVars);

console.log(data.tokenWallet_insert);

// Or, you can use the `Promise` API.
adminCreateTokenWallet(adminCreateTokenWalletVars).then((response) => {
  const data = response.data;
  console.log(data.tokenWallet_insert);
});
```

### Using `AdminCreateTokenWallet`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminCreateTokenWalletRef, AdminCreateTokenWalletVariables } from '@anify/dataconnect';

// The `AdminCreateTokenWallet` mutation requires an argument of type `AdminCreateTokenWalletVariables`:
const adminCreateTokenWalletVars: AdminCreateTokenWalletVariables = {
  userId: ..., 
  balanceTokens: ..., 
  planType: ..., 
};

// Call the `adminCreateTokenWalletRef()` function to get a reference to the mutation.
const ref = adminCreateTokenWalletRef(adminCreateTokenWalletVars);
// Variables can be defined inline as well.
const ref = adminCreateTokenWalletRef({ userId: ..., balanceTokens: ..., planType: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminCreateTokenWalletRef(dataConnect, adminCreateTokenWalletVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.tokenWallet_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.tokenWallet_insert);
});
```

## AdminUpdateTokenWallet
You can execute the `AdminUpdateTokenWallet` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
adminUpdateTokenWallet(vars: AdminUpdateTokenWalletVariables): MutationPromise<AdminUpdateTokenWalletData, AdminUpdateTokenWalletVariables>;

interface AdminUpdateTokenWalletRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminUpdateTokenWalletVariables): MutationRef<AdminUpdateTokenWalletData, AdminUpdateTokenWalletVariables>;
}
export const adminUpdateTokenWalletRef: AdminUpdateTokenWalletRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminUpdateTokenWallet(dc: DataConnect, vars: AdminUpdateTokenWalletVariables): MutationPromise<AdminUpdateTokenWalletData, AdminUpdateTokenWalletVariables>;

interface AdminUpdateTokenWalletRef {
  ...
  (dc: DataConnect, vars: AdminUpdateTokenWalletVariables): MutationRef<AdminUpdateTokenWalletData, AdminUpdateTokenWalletVariables>;
}
export const adminUpdateTokenWalletRef: AdminUpdateTokenWalletRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminUpdateTokenWalletRef:
```typescript
const name = adminUpdateTokenWalletRef.operationName;
console.log(name);
```

### Variables
The `AdminUpdateTokenWallet` mutation requires an argument of type `AdminUpdateTokenWalletVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `AdminUpdateTokenWallet` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminUpdateTokenWalletData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminUpdateTokenWalletData {
  tokenWallet_updateMany: number;
}
```
### Using `AdminUpdateTokenWallet`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminUpdateTokenWallet, AdminUpdateTokenWalletVariables } from '@anify/dataconnect';

// The `AdminUpdateTokenWallet` mutation requires an argument of type `AdminUpdateTokenWalletVariables`:
const adminUpdateTokenWalletVars: AdminUpdateTokenWalletVariables = {
  userId: ..., 
  balanceTokens: ..., // optional
  lifetimeUsedTokens: ..., // optional
  planType: ..., // optional
  softLimitTokens: ..., // optional
  hardLimitTokens: ..., // optional
  billingPeriodStart: ..., // optional
  billingPeriodEnd: ..., // optional
  gameUid: ..., // optional
};

// Call the `adminUpdateTokenWallet()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminUpdateTokenWallet(adminUpdateTokenWalletVars);
// Variables can be defined inline as well.
const { data } = await adminUpdateTokenWallet({ userId: ..., balanceTokens: ..., lifetimeUsedTokens: ..., planType: ..., softLimitTokens: ..., hardLimitTokens: ..., billingPeriodStart: ..., billingPeriodEnd: ..., gameUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminUpdateTokenWallet(dataConnect, adminUpdateTokenWalletVars);

console.log(data.tokenWallet_updateMany);

// Or, you can use the `Promise` API.
adminUpdateTokenWallet(adminUpdateTokenWalletVars).then((response) => {
  const data = response.data;
  console.log(data.tokenWallet_updateMany);
});
```

### Using `AdminUpdateTokenWallet`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminUpdateTokenWalletRef, AdminUpdateTokenWalletVariables } from '@anify/dataconnect';

// The `AdminUpdateTokenWallet` mutation requires an argument of type `AdminUpdateTokenWalletVariables`:
const adminUpdateTokenWalletVars: AdminUpdateTokenWalletVariables = {
  userId: ..., 
  balanceTokens: ..., // optional
  lifetimeUsedTokens: ..., // optional
  planType: ..., // optional
  softLimitTokens: ..., // optional
  hardLimitTokens: ..., // optional
  billingPeriodStart: ..., // optional
  billingPeriodEnd: ..., // optional
  gameUid: ..., // optional
};

// Call the `adminUpdateTokenWalletRef()` function to get a reference to the mutation.
const ref = adminUpdateTokenWalletRef(adminUpdateTokenWalletVars);
// Variables can be defined inline as well.
const ref = adminUpdateTokenWalletRef({ userId: ..., balanceTokens: ..., lifetimeUsedTokens: ..., planType: ..., softLimitTokens: ..., hardLimitTokens: ..., billingPeriodStart: ..., billingPeriodEnd: ..., gameUid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminUpdateTokenWalletRef(dataConnect, adminUpdateTokenWalletVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.tokenWallet_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.tokenWallet_updateMany);
});
```

## AdminCreateTokenEvent
You can execute the `AdminCreateTokenEvent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
adminCreateTokenEvent(vars: AdminCreateTokenEventVariables): MutationPromise<AdminCreateTokenEventData, AdminCreateTokenEventVariables>;

interface AdminCreateTokenEventRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminCreateTokenEventVariables): MutationRef<AdminCreateTokenEventData, AdminCreateTokenEventVariables>;
}
export const adminCreateTokenEventRef: AdminCreateTokenEventRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminCreateTokenEvent(dc: DataConnect, vars: AdminCreateTokenEventVariables): MutationPromise<AdminCreateTokenEventData, AdminCreateTokenEventVariables>;

interface AdminCreateTokenEventRef {
  ...
  (dc: DataConnect, vars: AdminCreateTokenEventVariables): MutationRef<AdminCreateTokenEventData, AdminCreateTokenEventVariables>;
}
export const adminCreateTokenEventRef: AdminCreateTokenEventRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminCreateTokenEventRef:
```typescript
const name = adminCreateTokenEventRef.operationName;
console.log(name);
```

### Variables
The `AdminCreateTokenEvent` mutation requires an argument of type `AdminCreateTokenEventVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `AdminCreateTokenEvent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminCreateTokenEventData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminCreateTokenEventData {
  tokenUsageEvent_insert: TokenUsageEvent_Key;
}
```
### Using `AdminCreateTokenEvent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminCreateTokenEvent, AdminCreateTokenEventVariables } from '@anify/dataconnect';

// The `AdminCreateTokenEvent` mutation requires an argument of type `AdminCreateTokenEventVariables`:
const adminCreateTokenEventVars: AdminCreateTokenEventVariables = {
  userId: ..., 
  direction: ..., 
  model: ..., 
  inputTokens: ..., 
  outputTokens: ..., 
  totalTokens: ..., 
  costUsd: ..., 
  meta: ..., // optional
};

// Call the `adminCreateTokenEvent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminCreateTokenEvent(adminCreateTokenEventVars);
// Variables can be defined inline as well.
const { data } = await adminCreateTokenEvent({ userId: ..., direction: ..., model: ..., inputTokens: ..., outputTokens: ..., totalTokens: ..., costUsd: ..., meta: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminCreateTokenEvent(dataConnect, adminCreateTokenEventVars);

console.log(data.tokenUsageEvent_insert);

// Or, you can use the `Promise` API.
adminCreateTokenEvent(adminCreateTokenEventVars).then((response) => {
  const data = response.data;
  console.log(data.tokenUsageEvent_insert);
});
```

### Using `AdminCreateTokenEvent`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminCreateTokenEventRef, AdminCreateTokenEventVariables } from '@anify/dataconnect';

// The `AdminCreateTokenEvent` mutation requires an argument of type `AdminCreateTokenEventVariables`:
const adminCreateTokenEventVars: AdminCreateTokenEventVariables = {
  userId: ..., 
  direction: ..., 
  model: ..., 
  inputTokens: ..., 
  outputTokens: ..., 
  totalTokens: ..., 
  costUsd: ..., 
  meta: ..., // optional
};

// Call the `adminCreateTokenEventRef()` function to get a reference to the mutation.
const ref = adminCreateTokenEventRef(adminCreateTokenEventVars);
// Variables can be defined inline as well.
const ref = adminCreateTokenEventRef({ userId: ..., direction: ..., model: ..., inputTokens: ..., outputTokens: ..., totalTokens: ..., costUsd: ..., meta: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminCreateTokenEventRef(dataConnect, adminCreateTokenEventVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.tokenUsageEvent_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.tokenUsageEvent_insert);
});
```

## AdminConsumeTokens
You can execute the `AdminConsumeTokens` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
adminConsumeTokens(vars: AdminConsumeTokensVariables): MutationPromise<AdminConsumeTokensData, AdminConsumeTokensVariables>;

interface AdminConsumeTokensRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminConsumeTokensVariables): MutationRef<AdminConsumeTokensData, AdminConsumeTokensVariables>;
}
export const adminConsumeTokensRef: AdminConsumeTokensRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminConsumeTokens(dc: DataConnect, vars: AdminConsumeTokensVariables): MutationPromise<AdminConsumeTokensData, AdminConsumeTokensVariables>;

interface AdminConsumeTokensRef {
  ...
  (dc: DataConnect, vars: AdminConsumeTokensVariables): MutationRef<AdminConsumeTokensData, AdminConsumeTokensVariables>;
}
export const adminConsumeTokensRef: AdminConsumeTokensRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminConsumeTokensRef:
```typescript
const name = adminConsumeTokensRef.operationName;
console.log(name);
```

### Variables
The `AdminConsumeTokens` mutation requires an argument of type `AdminConsumeTokensVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminConsumeTokensVariables {
  userId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  costUsd: number;
  meta?: string | null;
}
```
### Return Type
Recall that executing the `AdminConsumeTokens` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminConsumeTokensData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminConsumeTokensData {
  tokenUsageEvent_insert: TokenUsageEvent_Key;
}
```
### Using `AdminConsumeTokens`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminConsumeTokens, AdminConsumeTokensVariables } from '@anify/dataconnect';

// The `AdminConsumeTokens` mutation requires an argument of type `AdminConsumeTokensVariables`:
const adminConsumeTokensVars: AdminConsumeTokensVariables = {
  userId: ..., 
  model: ..., 
  inputTokens: ..., 
  outputTokens: ..., 
  totalTokens: ..., 
  costUsd: ..., 
  meta: ..., // optional
};

// Call the `adminConsumeTokens()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminConsumeTokens(adminConsumeTokensVars);
// Variables can be defined inline as well.
const { data } = await adminConsumeTokens({ userId: ..., model: ..., inputTokens: ..., outputTokens: ..., totalTokens: ..., costUsd: ..., meta: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminConsumeTokens(dataConnect, adminConsumeTokensVars);

console.log(data.tokenUsageEvent_insert);

// Or, you can use the `Promise` API.
adminConsumeTokens(adminConsumeTokensVars).then((response) => {
  const data = response.data;
  console.log(data.tokenUsageEvent_insert);
});
```

### Using `AdminConsumeTokens`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminConsumeTokensRef, AdminConsumeTokensVariables } from '@anify/dataconnect';

// The `AdminConsumeTokens` mutation requires an argument of type `AdminConsumeTokensVariables`:
const adminConsumeTokensVars: AdminConsumeTokensVariables = {
  userId: ..., 
  model: ..., 
  inputTokens: ..., 
  outputTokens: ..., 
  totalTokens: ..., 
  costUsd: ..., 
  meta: ..., // optional
};

// Call the `adminConsumeTokensRef()` function to get a reference to the mutation.
const ref = adminConsumeTokensRef(adminConsumeTokensVars);
// Variables can be defined inline as well.
const ref = adminConsumeTokensRef({ userId: ..., model: ..., inputTokens: ..., outputTokens: ..., totalTokens: ..., costUsd: ..., meta: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminConsumeTokensRef(dataConnect, adminConsumeTokensVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.tokenUsageEvent_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.tokenUsageEvent_insert);
});
```

## AdminCreditTokens
You can execute the `AdminCreditTokens` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
adminCreditTokens(vars: AdminCreditTokensVariables): MutationPromise<AdminCreditTokensData, AdminCreditTokensVariables>;

interface AdminCreditTokensRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminCreditTokensVariables): MutationRef<AdminCreditTokensData, AdminCreditTokensVariables>;
}
export const adminCreditTokensRef: AdminCreditTokensRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminCreditTokens(dc: DataConnect, vars: AdminCreditTokensVariables): MutationPromise<AdminCreditTokensData, AdminCreditTokensVariables>;

interface AdminCreditTokensRef {
  ...
  (dc: DataConnect, vars: AdminCreditTokensVariables): MutationRef<AdminCreditTokensData, AdminCreditTokensVariables>;
}
export const adminCreditTokensRef: AdminCreditTokensRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminCreditTokensRef:
```typescript
const name = adminCreditTokensRef.operationName;
console.log(name);
```

### Variables
The `AdminCreditTokens` mutation requires an argument of type `AdminCreditTokensVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminCreditTokensVariables {
  userId: string;
  totalTokens: number;
  meta?: string | null;
}
```
### Return Type
Recall that executing the `AdminCreditTokens` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminCreditTokensData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminCreditTokensData {
  tokenUsageEvent_insert: TokenUsageEvent_Key;
}
```
### Using `AdminCreditTokens`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminCreditTokens, AdminCreditTokensVariables } from '@anify/dataconnect';

// The `AdminCreditTokens` mutation requires an argument of type `AdminCreditTokensVariables`:
const adminCreditTokensVars: AdminCreditTokensVariables = {
  userId: ..., 
  totalTokens: ..., 
  meta: ..., // optional
};

// Call the `adminCreditTokens()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminCreditTokens(adminCreditTokensVars);
// Variables can be defined inline as well.
const { data } = await adminCreditTokens({ userId: ..., totalTokens: ..., meta: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminCreditTokens(dataConnect, adminCreditTokensVars);

console.log(data.tokenUsageEvent_insert);

// Or, you can use the `Promise` API.
adminCreditTokens(adminCreditTokensVars).then((response) => {
  const data = response.data;
  console.log(data.tokenUsageEvent_insert);
});
```

### Using `AdminCreditTokens`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminCreditTokensRef, AdminCreditTokensVariables } from '@anify/dataconnect';

// The `AdminCreditTokens` mutation requires an argument of type `AdminCreditTokensVariables`:
const adminCreditTokensVars: AdminCreditTokensVariables = {
  userId: ..., 
  totalTokens: ..., 
  meta: ..., // optional
};

// Call the `adminCreditTokensRef()` function to get a reference to the mutation.
const ref = adminCreditTokensRef(adminCreditTokensVars);
// Variables can be defined inline as well.
const ref = adminCreditTokensRef({ userId: ..., totalTokens: ..., meta: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminCreditTokensRef(dataConnect, adminCreditTokensVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.tokenUsageEvent_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.tokenUsageEvent_insert);
});
```

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createUser(): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation has no variables.
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser } from '@anify/dataconnect';


// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser().then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef } from '@anify/dataconnect';


// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpsertUserWithEmail
You can execute the `UpsertUserWithEmail` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
upsertUserWithEmail(vars: UpsertUserWithEmailVariables): MutationPromise<UpsertUserWithEmailData, UpsertUserWithEmailVariables>;

interface UpsertUserWithEmailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserWithEmailVariables): MutationRef<UpsertUserWithEmailData, UpsertUserWithEmailVariables>;
}
export const upsertUserWithEmailRef: UpsertUserWithEmailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertUserWithEmail(dc: DataConnect, vars: UpsertUserWithEmailVariables): MutationPromise<UpsertUserWithEmailData, UpsertUserWithEmailVariables>;

interface UpsertUserWithEmailRef {
  ...
  (dc: DataConnect, vars: UpsertUserWithEmailVariables): MutationRef<UpsertUserWithEmailData, UpsertUserWithEmailVariables>;
}
export const upsertUserWithEmailRef: UpsertUserWithEmailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertUserWithEmailRef:
```typescript
const name = upsertUserWithEmailRef.operationName;
console.log(name);
```

### Variables
The `UpsertUserWithEmail` mutation requires an argument of type `UpsertUserWithEmailVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertUserWithEmailVariables {
  email: string;
}
```
### Return Type
Recall that executing the `UpsertUserWithEmail` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUserWithEmailData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertUserWithEmailData {
  user_upsert: User_Key;
}
```
### Using `UpsertUserWithEmail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUserWithEmail, UpsertUserWithEmailVariables } from '@anify/dataconnect';

// The `UpsertUserWithEmail` mutation requires an argument of type `UpsertUserWithEmailVariables`:
const upsertUserWithEmailVars: UpsertUserWithEmailVariables = {
  email: ..., 
};

// Call the `upsertUserWithEmail()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUserWithEmail(upsertUserWithEmailVars);
// Variables can be defined inline as well.
const { data } = await upsertUserWithEmail({ email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertUserWithEmail(dataConnect, upsertUserWithEmailVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertUserWithEmail(upsertUserWithEmailVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertUserWithEmail`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertUserWithEmailRef, UpsertUserWithEmailVariables } from '@anify/dataconnect';

// The `UpsertUserWithEmail` mutation requires an argument of type `UpsertUserWithEmailVariables`:
const upsertUserWithEmailVars: UpsertUserWithEmailVariables = {
  email: ..., 
};

// Call the `upsertUserWithEmailRef()` function to get a reference to the mutation.
const ref = upsertUserWithEmailRef(upsertUserWithEmailVars);
// Variables can be defined inline as well.
const ref = upsertUserWithEmailRef({ email: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertUserWithEmailRef(dataConnect, upsertUserWithEmailVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## CreateUserAttributes
You can execute the `CreateUserAttributes` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createUserAttributes(): MutationPromise<CreateUserAttributesData, undefined>;

interface CreateUserAttributesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserAttributesData, undefined>;
}
export const createUserAttributesRef: CreateUserAttributesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUserAttributes(dc: DataConnect): MutationPromise<CreateUserAttributesData, undefined>;

interface CreateUserAttributesRef {
  ...
  (dc: DataConnect): MutationRef<CreateUserAttributesData, undefined>;
}
export const createUserAttributesRef: CreateUserAttributesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserAttributesRef:
```typescript
const name = createUserAttributesRef.operationName;
console.log(name);
```

### Variables
The `CreateUserAttributes` mutation has no variables.
### Return Type
Recall that executing the `CreateUserAttributes` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserAttributesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserAttributesData {
  userAttributes_insert: UserAttributes_Key;
}
```
### Using `CreateUserAttributes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUserAttributes } from '@anify/dataconnect';


// Call the `createUserAttributes()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUserAttributes();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUserAttributes(dataConnect);

console.log(data.userAttributes_insert);

// Or, you can use the `Promise` API.
createUserAttributes().then((response) => {
  const data = response.data;
  console.log(data.userAttributes_insert);
});
```

### Using `CreateUserAttributes`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserAttributesRef } from '@anify/dataconnect';


// Call the `createUserAttributesRef()` function to get a reference to the mutation.
const ref = createUserAttributesRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserAttributesRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userAttributes_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userAttributes_insert);
});
```

## UpdateUserAttributes
You can execute the `UpdateUserAttributes` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateUserAttributes(vars?: UpdateUserAttributesVariables): MutationPromise<UpdateUserAttributesData, UpdateUserAttributesVariables>;

interface UpdateUserAttributesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateUserAttributesVariables): MutationRef<UpdateUserAttributesData, UpdateUserAttributesVariables>;
}
export const updateUserAttributesRef: UpdateUserAttributesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserAttributes(dc: DataConnect, vars?: UpdateUserAttributesVariables): MutationPromise<UpdateUserAttributesData, UpdateUserAttributesVariables>;

interface UpdateUserAttributesRef {
  ...
  (dc: DataConnect, vars?: UpdateUserAttributesVariables): MutationRef<UpdateUserAttributesData, UpdateUserAttributesVariables>;
}
export const updateUserAttributesRef: UpdateUserAttributesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserAttributesRef:
```typescript
const name = updateUserAttributesRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserAttributes` mutation has an optional argument of type `UpdateUserAttributesVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserAttributesVariables {
  hp?: number | null;
  maxHp?: number | null;
  atk?: number | null;
  def?: number | null;
  level?: number | null;
  exp?: number | null;
  gold?: number | null;
}
```
### Return Type
Recall that executing the `UpdateUserAttributes` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserAttributesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserAttributesData {
  userAttributes_updateMany: number;
}
```
### Using `UpdateUserAttributes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserAttributes, UpdateUserAttributesVariables } from '@anify/dataconnect';

// The `UpdateUserAttributes` mutation has an optional argument of type `UpdateUserAttributesVariables`:
const updateUserAttributesVars: UpdateUserAttributesVariables = {
  hp: ..., // optional
  maxHp: ..., // optional
  atk: ..., // optional
  def: ..., // optional
  level: ..., // optional
  exp: ..., // optional
  gold: ..., // optional
};

// Call the `updateUserAttributes()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserAttributes(updateUserAttributesVars);
// Variables can be defined inline as well.
const { data } = await updateUserAttributes({ hp: ..., maxHp: ..., atk: ..., def: ..., level: ..., exp: ..., gold: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateUserAttributesVariables` argument.
const { data } = await updateUserAttributes();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserAttributes(dataConnect, updateUserAttributesVars);

console.log(data.userAttributes_updateMany);

// Or, you can use the `Promise` API.
updateUserAttributes(updateUserAttributesVars).then((response) => {
  const data = response.data;
  console.log(data.userAttributes_updateMany);
});
```

### Using `UpdateUserAttributes`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserAttributesRef, UpdateUserAttributesVariables } from '@anify/dataconnect';

// The `UpdateUserAttributes` mutation has an optional argument of type `UpdateUserAttributesVariables`:
const updateUserAttributesVars: UpdateUserAttributesVariables = {
  hp: ..., // optional
  maxHp: ..., // optional
  atk: ..., // optional
  def: ..., // optional
  level: ..., // optional
  exp: ..., // optional
  gold: ..., // optional
};

// Call the `updateUserAttributesRef()` function to get a reference to the mutation.
const ref = updateUserAttributesRef(updateUserAttributesVars);
// Variables can be defined inline as well.
const ref = updateUserAttributesRef({ hp: ..., maxHp: ..., atk: ..., def: ..., level: ..., exp: ..., gold: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateUserAttributesVariables` argument.
const ref = updateUserAttributesRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserAttributesRef(dataConnect, updateUserAttributesVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userAttributes_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userAttributes_updateMany);
});
```

## ResetUserAttributes
You can execute the `ResetUserAttributes` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
resetUserAttributes(): MutationPromise<ResetUserAttributesData, undefined>;

interface ResetUserAttributesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<ResetUserAttributesData, undefined>;
}
export const resetUserAttributesRef: ResetUserAttributesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
resetUserAttributes(dc: DataConnect): MutationPromise<ResetUserAttributesData, undefined>;

interface ResetUserAttributesRef {
  ...
  (dc: DataConnect): MutationRef<ResetUserAttributesData, undefined>;
}
export const resetUserAttributesRef: ResetUserAttributesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the resetUserAttributesRef:
```typescript
const name = resetUserAttributesRef.operationName;
console.log(name);
```

### Variables
The `ResetUserAttributes` mutation has no variables.
### Return Type
Recall that executing the `ResetUserAttributes` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ResetUserAttributesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ResetUserAttributesData {
  userAttributes_updateMany: number;
}
```
### Using `ResetUserAttributes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, resetUserAttributes } from '@anify/dataconnect';


// Call the `resetUserAttributes()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await resetUserAttributes();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await resetUserAttributes(dataConnect);

console.log(data.userAttributes_updateMany);

// Or, you can use the `Promise` API.
resetUserAttributes().then((response) => {
  const data = response.data;
  console.log(data.userAttributes_updateMany);
});
```

### Using `ResetUserAttributes`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, resetUserAttributesRef } from '@anify/dataconnect';


// Call the `resetUserAttributesRef()` function to get a reference to the mutation.
const ref = resetUserAttributesRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = resetUserAttributesRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userAttributes_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userAttributes_updateMany);
});
```

## AddInventoryItem
You can execute the `AddInventoryItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
addInventoryItem(vars: AddInventoryItemVariables): MutationPromise<AddInventoryItemData, AddInventoryItemVariables>;

interface AddInventoryItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddInventoryItemVariables): MutationRef<AddInventoryItemData, AddInventoryItemVariables>;
}
export const addInventoryItemRef: AddInventoryItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addInventoryItem(dc: DataConnect, vars: AddInventoryItemVariables): MutationPromise<AddInventoryItemData, AddInventoryItemVariables>;

interface AddInventoryItemRef {
  ...
  (dc: DataConnect, vars: AddInventoryItemVariables): MutationRef<AddInventoryItemData, AddInventoryItemVariables>;
}
export const addInventoryItemRef: AddInventoryItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addInventoryItemRef:
```typescript
const name = addInventoryItemRef.operationName;
console.log(name);
```

### Variables
The `AddInventoryItem` mutation requires an argument of type `AddInventoryItemVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddInventoryItemVariables {
  itemId: string;
  quantity: number;
}
```
### Return Type
Recall that executing the `AddInventoryItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddInventoryItemData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddInventoryItemData {
  inventoryItem_upsert: InventoryItem_Key;
}
```
### Using `AddInventoryItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addInventoryItem, AddInventoryItemVariables } from '@anify/dataconnect';

// The `AddInventoryItem` mutation requires an argument of type `AddInventoryItemVariables`:
const addInventoryItemVars: AddInventoryItemVariables = {
  itemId: ..., 
  quantity: ..., 
};

// Call the `addInventoryItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addInventoryItem(addInventoryItemVars);
// Variables can be defined inline as well.
const { data } = await addInventoryItem({ itemId: ..., quantity: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addInventoryItem(dataConnect, addInventoryItemVars);

console.log(data.inventoryItem_upsert);

// Or, you can use the `Promise` API.
addInventoryItem(addInventoryItemVars).then((response) => {
  const data = response.data;
  console.log(data.inventoryItem_upsert);
});
```

### Using `AddInventoryItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addInventoryItemRef, AddInventoryItemVariables } from '@anify/dataconnect';

// The `AddInventoryItem` mutation requires an argument of type `AddInventoryItemVariables`:
const addInventoryItemVars: AddInventoryItemVariables = {
  itemId: ..., 
  quantity: ..., 
};

// Call the `addInventoryItemRef()` function to get a reference to the mutation.
const ref = addInventoryItemRef(addInventoryItemVars);
// Variables can be defined inline as well.
const ref = addInventoryItemRef({ itemId: ..., quantity: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addInventoryItemRef(dataConnect, addInventoryItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.inventoryItem_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.inventoryItem_upsert);
});
```

## RemoveInventoryItem
You can execute the `RemoveInventoryItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
removeInventoryItem(vars: RemoveInventoryItemVariables): MutationPromise<RemoveInventoryItemData, RemoveInventoryItemVariables>;

interface RemoveInventoryItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveInventoryItemVariables): MutationRef<RemoveInventoryItemData, RemoveInventoryItemVariables>;
}
export const removeInventoryItemRef: RemoveInventoryItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
removeInventoryItem(dc: DataConnect, vars: RemoveInventoryItemVariables): MutationPromise<RemoveInventoryItemData, RemoveInventoryItemVariables>;

interface RemoveInventoryItemRef {
  ...
  (dc: DataConnect, vars: RemoveInventoryItemVariables): MutationRef<RemoveInventoryItemData, RemoveInventoryItemVariables>;
}
export const removeInventoryItemRef: RemoveInventoryItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the removeInventoryItemRef:
```typescript
const name = removeInventoryItemRef.operationName;
console.log(name);
```

### Variables
The `RemoveInventoryItem` mutation requires an argument of type `RemoveInventoryItemVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RemoveInventoryItemVariables {
  itemId: string;
}
```
### Return Type
Recall that executing the `RemoveInventoryItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RemoveInventoryItemData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RemoveInventoryItemData {
  inventoryItem_deleteMany: number;
}
```
### Using `RemoveInventoryItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, removeInventoryItem, RemoveInventoryItemVariables } from '@anify/dataconnect';

// The `RemoveInventoryItem` mutation requires an argument of type `RemoveInventoryItemVariables`:
const removeInventoryItemVars: RemoveInventoryItemVariables = {
  itemId: ..., 
};

// Call the `removeInventoryItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await removeInventoryItem(removeInventoryItemVars);
// Variables can be defined inline as well.
const { data } = await removeInventoryItem({ itemId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await removeInventoryItem(dataConnect, removeInventoryItemVars);

console.log(data.inventoryItem_deleteMany);

// Or, you can use the `Promise` API.
removeInventoryItem(removeInventoryItemVars).then((response) => {
  const data = response.data;
  console.log(data.inventoryItem_deleteMany);
});
```

### Using `RemoveInventoryItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, removeInventoryItemRef, RemoveInventoryItemVariables } from '@anify/dataconnect';

// The `RemoveInventoryItem` mutation requires an argument of type `RemoveInventoryItemVariables`:
const removeInventoryItemVars: RemoveInventoryItemVariables = {
  itemId: ..., 
};

// Call the `removeInventoryItemRef()` function to get a reference to the mutation.
const ref = removeInventoryItemRef(removeInventoryItemVars);
// Variables can be defined inline as well.
const ref = removeInventoryItemRef({ itemId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = removeInventoryItemRef(dataConnect, removeInventoryItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.inventoryItem_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.inventoryItem_deleteMany);
});
```

## AdminCreateUser
You can execute the `AdminCreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
adminCreateUser(vars: AdminCreateUserVariables): MutationPromise<AdminCreateUserData, AdminCreateUserVariables>;

interface AdminCreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminCreateUserVariables): MutationRef<AdminCreateUserData, AdminCreateUserVariables>;
}
export const adminCreateUserRef: AdminCreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminCreateUser(dc: DataConnect, vars: AdminCreateUserVariables): MutationPromise<AdminCreateUserData, AdminCreateUserVariables>;

interface AdminCreateUserRef {
  ...
  (dc: DataConnect, vars: AdminCreateUserVariables): MutationRef<AdminCreateUserData, AdminCreateUserVariables>;
}
export const adminCreateUserRef: AdminCreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminCreateUserRef:
```typescript
const name = adminCreateUserRef.operationName;
console.log(name);
```

### Variables
The `AdminCreateUser` mutation requires an argument of type `AdminCreateUserVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminCreateUserVariables {
  id: string;
}
```
### Return Type
Recall that executing the `AdminCreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminCreateUserData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminCreateUserData {
  user_insert: User_Key;
}
```
### Using `AdminCreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminCreateUser, AdminCreateUserVariables } from '@anify/dataconnect';

// The `AdminCreateUser` mutation requires an argument of type `AdminCreateUserVariables`:
const adminCreateUserVars: AdminCreateUserVariables = {
  id: ..., 
};

// Call the `adminCreateUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminCreateUser(adminCreateUserVars);
// Variables can be defined inline as well.
const { data } = await adminCreateUser({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminCreateUser(dataConnect, adminCreateUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
adminCreateUser(adminCreateUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `AdminCreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminCreateUserRef, AdminCreateUserVariables } from '@anify/dataconnect';

// The `AdminCreateUser` mutation requires an argument of type `AdminCreateUserVariables`:
const adminCreateUserVars: AdminCreateUserVariables = {
  id: ..., 
};

// Call the `adminCreateUserRef()` function to get a reference to the mutation.
const ref = adminCreateUserRef(adminCreateUserVars);
// Variables can be defined inline as well.
const ref = adminCreateUserRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminCreateUserRef(dataConnect, adminCreateUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## AdminCreateUserAttributes
You can execute the `AdminCreateUserAttributes` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
adminCreateUserAttributes(vars: AdminCreateUserAttributesVariables): MutationPromise<AdminCreateUserAttributesData, AdminCreateUserAttributesVariables>;

interface AdminCreateUserAttributesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminCreateUserAttributesVariables): MutationRef<AdminCreateUserAttributesData, AdminCreateUserAttributesVariables>;
}
export const adminCreateUserAttributesRef: AdminCreateUserAttributesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminCreateUserAttributes(dc: DataConnect, vars: AdminCreateUserAttributesVariables): MutationPromise<AdminCreateUserAttributesData, AdminCreateUserAttributesVariables>;

interface AdminCreateUserAttributesRef {
  ...
  (dc: DataConnect, vars: AdminCreateUserAttributesVariables): MutationRef<AdminCreateUserAttributesData, AdminCreateUserAttributesVariables>;
}
export const adminCreateUserAttributesRef: AdminCreateUserAttributesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminCreateUserAttributesRef:
```typescript
const name = adminCreateUserAttributesRef.operationName;
console.log(name);
```

### Variables
The `AdminCreateUserAttributes` mutation requires an argument of type `AdminCreateUserAttributesVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminCreateUserAttributesVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `AdminCreateUserAttributes` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminCreateUserAttributesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminCreateUserAttributesData {
  userAttributes_insert: UserAttributes_Key;
}
```
### Using `AdminCreateUserAttributes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminCreateUserAttributes, AdminCreateUserAttributesVariables } from '@anify/dataconnect';

// The `AdminCreateUserAttributes` mutation requires an argument of type `AdminCreateUserAttributesVariables`:
const adminCreateUserAttributesVars: AdminCreateUserAttributesVariables = {
  userId: ..., 
};

// Call the `adminCreateUserAttributes()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminCreateUserAttributes(adminCreateUserAttributesVars);
// Variables can be defined inline as well.
const { data } = await adminCreateUserAttributes({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminCreateUserAttributes(dataConnect, adminCreateUserAttributesVars);

console.log(data.userAttributes_insert);

// Or, you can use the `Promise` API.
adminCreateUserAttributes(adminCreateUserAttributesVars).then((response) => {
  const data = response.data;
  console.log(data.userAttributes_insert);
});
```

### Using `AdminCreateUserAttributes`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminCreateUserAttributesRef, AdminCreateUserAttributesVariables } from '@anify/dataconnect';

// The `AdminCreateUserAttributes` mutation requires an argument of type `AdminCreateUserAttributesVariables`:
const adminCreateUserAttributesVars: AdminCreateUserAttributesVariables = {
  userId: ..., 
};

// Call the `adminCreateUserAttributesRef()` function to get a reference to the mutation.
const ref = adminCreateUserAttributesRef(adminCreateUserAttributesVars);
// Variables can be defined inline as well.
const ref = adminCreateUserAttributesRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminCreateUserAttributesRef(dataConnect, adminCreateUserAttributesVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userAttributes_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userAttributes_insert);
});
```

## AdminUpdateUserAttributes
You can execute the `AdminUpdateUserAttributes` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
adminUpdateUserAttributes(vars: AdminUpdateUserAttributesVariables): MutationPromise<AdminUpdateUserAttributesData, AdminUpdateUserAttributesVariables>;

interface AdminUpdateUserAttributesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminUpdateUserAttributesVariables): MutationRef<AdminUpdateUserAttributesData, AdminUpdateUserAttributesVariables>;
}
export const adminUpdateUserAttributesRef: AdminUpdateUserAttributesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminUpdateUserAttributes(dc: DataConnect, vars: AdminUpdateUserAttributesVariables): MutationPromise<AdminUpdateUserAttributesData, AdminUpdateUserAttributesVariables>;

interface AdminUpdateUserAttributesRef {
  ...
  (dc: DataConnect, vars: AdminUpdateUserAttributesVariables): MutationRef<AdminUpdateUserAttributesData, AdminUpdateUserAttributesVariables>;
}
export const adminUpdateUserAttributesRef: AdminUpdateUserAttributesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminUpdateUserAttributesRef:
```typescript
const name = adminUpdateUserAttributesRef.operationName;
console.log(name);
```

### Variables
The `AdminUpdateUserAttributes` mutation requires an argument of type `AdminUpdateUserAttributesVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `AdminUpdateUserAttributes` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminUpdateUserAttributesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminUpdateUserAttributesData {
  userAttributes_updateMany: number;
}
```
### Using `AdminUpdateUserAttributes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminUpdateUserAttributes, AdminUpdateUserAttributesVariables } from '@anify/dataconnect';

// The `AdminUpdateUserAttributes` mutation requires an argument of type `AdminUpdateUserAttributesVariables`:
const adminUpdateUserAttributesVars: AdminUpdateUserAttributesVariables = {
  userId: ..., 
  hp: ..., // optional
  maxHp: ..., // optional
  atk: ..., // optional
  def: ..., // optional
  level: ..., // optional
  exp: ..., // optional
  gold: ..., // optional
};

// Call the `adminUpdateUserAttributes()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminUpdateUserAttributes(adminUpdateUserAttributesVars);
// Variables can be defined inline as well.
const { data } = await adminUpdateUserAttributes({ userId: ..., hp: ..., maxHp: ..., atk: ..., def: ..., level: ..., exp: ..., gold: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminUpdateUserAttributes(dataConnect, adminUpdateUserAttributesVars);

console.log(data.userAttributes_updateMany);

// Or, you can use the `Promise` API.
adminUpdateUserAttributes(adminUpdateUserAttributesVars).then((response) => {
  const data = response.data;
  console.log(data.userAttributes_updateMany);
});
```

### Using `AdminUpdateUserAttributes`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminUpdateUserAttributesRef, AdminUpdateUserAttributesVariables } from '@anify/dataconnect';

// The `AdminUpdateUserAttributes` mutation requires an argument of type `AdminUpdateUserAttributesVariables`:
const adminUpdateUserAttributesVars: AdminUpdateUserAttributesVariables = {
  userId: ..., 
  hp: ..., // optional
  maxHp: ..., // optional
  atk: ..., // optional
  def: ..., // optional
  level: ..., // optional
  exp: ..., // optional
  gold: ..., // optional
};

// Call the `adminUpdateUserAttributesRef()` function to get a reference to the mutation.
const ref = adminUpdateUserAttributesRef(adminUpdateUserAttributesVars);
// Variables can be defined inline as well.
const ref = adminUpdateUserAttributesRef({ userId: ..., hp: ..., maxHp: ..., atk: ..., def: ..., level: ..., exp: ..., gold: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminUpdateUserAttributesRef(dataConnect, adminUpdateUserAttributesVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userAttributes_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userAttributes_updateMany);
});
```

## AdminAddInventoryItem
You can execute the `AdminAddInventoryItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
adminAddInventoryItem(vars: AdminAddInventoryItemVariables): MutationPromise<AdminAddInventoryItemData, AdminAddInventoryItemVariables>;

interface AdminAddInventoryItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminAddInventoryItemVariables): MutationRef<AdminAddInventoryItemData, AdminAddInventoryItemVariables>;
}
export const adminAddInventoryItemRef: AdminAddInventoryItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminAddInventoryItem(dc: DataConnect, vars: AdminAddInventoryItemVariables): MutationPromise<AdminAddInventoryItemData, AdminAddInventoryItemVariables>;

interface AdminAddInventoryItemRef {
  ...
  (dc: DataConnect, vars: AdminAddInventoryItemVariables): MutationRef<AdminAddInventoryItemData, AdminAddInventoryItemVariables>;
}
export const adminAddInventoryItemRef: AdminAddInventoryItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminAddInventoryItemRef:
```typescript
const name = adminAddInventoryItemRef.operationName;
console.log(name);
```

### Variables
The `AdminAddInventoryItem` mutation requires an argument of type `AdminAddInventoryItemVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminAddInventoryItemVariables {
  userId: string;
  itemId: string;
  quantity: number;
}
```
### Return Type
Recall that executing the `AdminAddInventoryItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminAddInventoryItemData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminAddInventoryItemData {
  inventoryItem_upsert: InventoryItem_Key;
}
```
### Using `AdminAddInventoryItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminAddInventoryItem, AdminAddInventoryItemVariables } from '@anify/dataconnect';

// The `AdminAddInventoryItem` mutation requires an argument of type `AdminAddInventoryItemVariables`:
const adminAddInventoryItemVars: AdminAddInventoryItemVariables = {
  userId: ..., 
  itemId: ..., 
  quantity: ..., 
};

// Call the `adminAddInventoryItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminAddInventoryItem(adminAddInventoryItemVars);
// Variables can be defined inline as well.
const { data } = await adminAddInventoryItem({ userId: ..., itemId: ..., quantity: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminAddInventoryItem(dataConnect, adminAddInventoryItemVars);

console.log(data.inventoryItem_upsert);

// Or, you can use the `Promise` API.
adminAddInventoryItem(adminAddInventoryItemVars).then((response) => {
  const data = response.data;
  console.log(data.inventoryItem_upsert);
});
```

### Using `AdminAddInventoryItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminAddInventoryItemRef, AdminAddInventoryItemVariables } from '@anify/dataconnect';

// The `AdminAddInventoryItem` mutation requires an argument of type `AdminAddInventoryItemVariables`:
const adminAddInventoryItemVars: AdminAddInventoryItemVariables = {
  userId: ..., 
  itemId: ..., 
  quantity: ..., 
};

// Call the `adminAddInventoryItemRef()` function to get a reference to the mutation.
const ref = adminAddInventoryItemRef(adminAddInventoryItemVars);
// Variables can be defined inline as well.
const ref = adminAddInventoryItemRef({ userId: ..., itemId: ..., quantity: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminAddInventoryItemRef(dataConnect, adminAddInventoryItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.inventoryItem_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.inventoryItem_upsert);
});
```

## AdminRemoveInventoryItem
You can execute the `AdminRemoveInventoryItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
adminRemoveInventoryItem(vars: AdminRemoveInventoryItemVariables): MutationPromise<AdminRemoveInventoryItemData, AdminRemoveInventoryItemVariables>;

interface AdminRemoveInventoryItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminRemoveInventoryItemVariables): MutationRef<AdminRemoveInventoryItemData, AdminRemoveInventoryItemVariables>;
}
export const adminRemoveInventoryItemRef: AdminRemoveInventoryItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminRemoveInventoryItem(dc: DataConnect, vars: AdminRemoveInventoryItemVariables): MutationPromise<AdminRemoveInventoryItemData, AdminRemoveInventoryItemVariables>;

interface AdminRemoveInventoryItemRef {
  ...
  (dc: DataConnect, vars: AdminRemoveInventoryItemVariables): MutationRef<AdminRemoveInventoryItemData, AdminRemoveInventoryItemVariables>;
}
export const adminRemoveInventoryItemRef: AdminRemoveInventoryItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminRemoveInventoryItemRef:
```typescript
const name = adminRemoveInventoryItemRef.operationName;
console.log(name);
```

### Variables
The `AdminRemoveInventoryItem` mutation requires an argument of type `AdminRemoveInventoryItemVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminRemoveInventoryItemVariables {
  userId: string;
  itemId: string;
}
```
### Return Type
Recall that executing the `AdminRemoveInventoryItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminRemoveInventoryItemData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminRemoveInventoryItemData {
  inventoryItem_deleteMany: number;
}
```
### Using `AdminRemoveInventoryItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminRemoveInventoryItem, AdminRemoveInventoryItemVariables } from '@anify/dataconnect';

// The `AdminRemoveInventoryItem` mutation requires an argument of type `AdminRemoveInventoryItemVariables`:
const adminRemoveInventoryItemVars: AdminRemoveInventoryItemVariables = {
  userId: ..., 
  itemId: ..., 
};

// Call the `adminRemoveInventoryItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminRemoveInventoryItem(adminRemoveInventoryItemVars);
// Variables can be defined inline as well.
const { data } = await adminRemoveInventoryItem({ userId: ..., itemId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminRemoveInventoryItem(dataConnect, adminRemoveInventoryItemVars);

console.log(data.inventoryItem_deleteMany);

// Or, you can use the `Promise` API.
adminRemoveInventoryItem(adminRemoveInventoryItemVars).then((response) => {
  const data = response.data;
  console.log(data.inventoryItem_deleteMany);
});
```

### Using `AdminRemoveInventoryItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminRemoveInventoryItemRef, AdminRemoveInventoryItemVariables } from '@anify/dataconnect';

// The `AdminRemoveInventoryItem` mutation requires an argument of type `AdminRemoveInventoryItemVariables`:
const adminRemoveInventoryItemVars: AdminRemoveInventoryItemVariables = {
  userId: ..., 
  itemId: ..., 
};

// Call the `adminRemoveInventoryItemRef()` function to get a reference to the mutation.
const ref = adminRemoveInventoryItemRef(adminRemoveInventoryItemVars);
// Variables can be defined inline as well.
const ref = adminRemoveInventoryItemRef({ userId: ..., itemId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminRemoveInventoryItemRef(dataConnect, adminRemoveInventoryItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.inventoryItem_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.inventoryItem_deleteMany);
});
```

## CreateWeapon
You can execute the `CreateWeapon` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createWeapon(vars: CreateWeaponVariables): MutationPromise<CreateWeaponData, CreateWeaponVariables>;

interface CreateWeaponRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateWeaponVariables): MutationRef<CreateWeaponData, CreateWeaponVariables>;
}
export const createWeaponRef: CreateWeaponRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createWeapon(dc: DataConnect, vars: CreateWeaponVariables): MutationPromise<CreateWeaponData, CreateWeaponVariables>;

interface CreateWeaponRef {
  ...
  (dc: DataConnect, vars: CreateWeaponVariables): MutationRef<CreateWeaponData, CreateWeaponVariables>;
}
export const createWeaponRef: CreateWeaponRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createWeaponRef:
```typescript
const name = createWeaponRef.operationName;
console.log(name);
```

### Variables
The `CreateWeapon` mutation requires an argument of type `CreateWeaponVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateWeapon` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateWeaponData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateWeaponData {
  weapon_insert: Weapon_Key;
}
```
### Using `CreateWeapon`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createWeapon, CreateWeaponVariables } from '@anify/dataconnect';

// The `CreateWeapon` mutation requires an argument of type `CreateWeaponVariables`:
const createWeaponVars: CreateWeaponVariables = {
  id: ..., 
  name: ..., 
  description: ..., // optional
  image: ..., // optional
  attack: ..., 
  rarity: ..., 
  weaponType: ..., 
  worldId: ..., 
};

// Call the `createWeapon()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createWeapon(createWeaponVars);
// Variables can be defined inline as well.
const { data } = await createWeapon({ id: ..., name: ..., description: ..., image: ..., attack: ..., rarity: ..., weaponType: ..., worldId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createWeapon(dataConnect, createWeaponVars);

console.log(data.weapon_insert);

// Or, you can use the `Promise` API.
createWeapon(createWeaponVars).then((response) => {
  const data = response.data;
  console.log(data.weapon_insert);
});
```

### Using `CreateWeapon`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createWeaponRef, CreateWeaponVariables } from '@anify/dataconnect';

// The `CreateWeapon` mutation requires an argument of type `CreateWeaponVariables`:
const createWeaponVars: CreateWeaponVariables = {
  id: ..., 
  name: ..., 
  description: ..., // optional
  image: ..., // optional
  attack: ..., 
  rarity: ..., 
  weaponType: ..., 
  worldId: ..., 
};

// Call the `createWeaponRef()` function to get a reference to the mutation.
const ref = createWeaponRef(createWeaponVars);
// Variables can be defined inline as well.
const ref = createWeaponRef({ id: ..., name: ..., description: ..., image: ..., attack: ..., rarity: ..., weaponType: ..., worldId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createWeaponRef(dataConnect, createWeaponVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.weapon_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.weapon_insert);
});
```

## UpdateWeapon
You can execute the `UpdateWeapon` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateWeapon(vars: UpdateWeaponVariables): MutationPromise<UpdateWeaponData, UpdateWeaponVariables>;

interface UpdateWeaponRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateWeaponVariables): MutationRef<UpdateWeaponData, UpdateWeaponVariables>;
}
export const updateWeaponRef: UpdateWeaponRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateWeapon(dc: DataConnect, vars: UpdateWeaponVariables): MutationPromise<UpdateWeaponData, UpdateWeaponVariables>;

interface UpdateWeaponRef {
  ...
  (dc: DataConnect, vars: UpdateWeaponVariables): MutationRef<UpdateWeaponData, UpdateWeaponVariables>;
}
export const updateWeaponRef: UpdateWeaponRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateWeaponRef:
```typescript
const name = updateWeaponRef.operationName;
console.log(name);
```

### Variables
The `UpdateWeapon` mutation requires an argument of type `UpdateWeaponVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateWeaponVariables {
  id: string;
  name?: string | null;
  description?: string | null;
  image?: string | null;
  attack?: number | null;
  rarity?: WeaponRarity | null;
  weaponType?: WeaponType | null;
}
```
### Return Type
Recall that executing the `UpdateWeapon` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateWeaponData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateWeaponData {
  weapon_update?: Weapon_Key | null;
}
```
### Using `UpdateWeapon`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateWeapon, UpdateWeaponVariables } from '@anify/dataconnect';

// The `UpdateWeapon` mutation requires an argument of type `UpdateWeaponVariables`:
const updateWeaponVars: UpdateWeaponVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
  image: ..., // optional
  attack: ..., // optional
  rarity: ..., // optional
  weaponType: ..., // optional
};

// Call the `updateWeapon()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateWeapon(updateWeaponVars);
// Variables can be defined inline as well.
const { data } = await updateWeapon({ id: ..., name: ..., description: ..., image: ..., attack: ..., rarity: ..., weaponType: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateWeapon(dataConnect, updateWeaponVars);

console.log(data.weapon_update);

// Or, you can use the `Promise` API.
updateWeapon(updateWeaponVars).then((response) => {
  const data = response.data;
  console.log(data.weapon_update);
});
```

### Using `UpdateWeapon`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateWeaponRef, UpdateWeaponVariables } from '@anify/dataconnect';

// The `UpdateWeapon` mutation requires an argument of type `UpdateWeaponVariables`:
const updateWeaponVars: UpdateWeaponVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
  image: ..., // optional
  attack: ..., // optional
  rarity: ..., // optional
  weaponType: ..., // optional
};

// Call the `updateWeaponRef()` function to get a reference to the mutation.
const ref = updateWeaponRef(updateWeaponVars);
// Variables can be defined inline as well.
const ref = updateWeaponRef({ id: ..., name: ..., description: ..., image: ..., attack: ..., rarity: ..., weaponType: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateWeaponRef(dataConnect, updateWeaponVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.weapon_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.weapon_update);
});
```

## DeleteWeapon
You can execute the `DeleteWeapon` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteWeapon(vars: DeleteWeaponVariables): MutationPromise<DeleteWeaponData, DeleteWeaponVariables>;

interface DeleteWeaponRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteWeaponVariables): MutationRef<DeleteWeaponData, DeleteWeaponVariables>;
}
export const deleteWeaponRef: DeleteWeaponRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteWeapon(dc: DataConnect, vars: DeleteWeaponVariables): MutationPromise<DeleteWeaponData, DeleteWeaponVariables>;

interface DeleteWeaponRef {
  ...
  (dc: DataConnect, vars: DeleteWeaponVariables): MutationRef<DeleteWeaponData, DeleteWeaponVariables>;
}
export const deleteWeaponRef: DeleteWeaponRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteWeaponRef:
```typescript
const name = deleteWeaponRef.operationName;
console.log(name);
```

### Variables
The `DeleteWeapon` mutation requires an argument of type `DeleteWeaponVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteWeaponVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteWeapon` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteWeaponData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteWeaponData {
  weapon_delete?: Weapon_Key | null;
}
```
### Using `DeleteWeapon`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteWeapon, DeleteWeaponVariables } from '@anify/dataconnect';

// The `DeleteWeapon` mutation requires an argument of type `DeleteWeaponVariables`:
const deleteWeaponVars: DeleteWeaponVariables = {
  id: ..., 
};

// Call the `deleteWeapon()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteWeapon(deleteWeaponVars);
// Variables can be defined inline as well.
const { data } = await deleteWeapon({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteWeapon(dataConnect, deleteWeaponVars);

console.log(data.weapon_delete);

// Or, you can use the `Promise` API.
deleteWeapon(deleteWeaponVars).then((response) => {
  const data = response.data;
  console.log(data.weapon_delete);
});
```

### Using `DeleteWeapon`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteWeaponRef, DeleteWeaponVariables } from '@anify/dataconnect';

// The `DeleteWeapon` mutation requires an argument of type `DeleteWeaponVariables`:
const deleteWeaponVars: DeleteWeaponVariables = {
  id: ..., 
};

// Call the `deleteWeaponRef()` function to get a reference to the mutation.
const ref = deleteWeaponRef(deleteWeaponVars);
// Variables can be defined inline as well.
const ref = deleteWeaponRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteWeaponRef(dataConnect, deleteWeaponVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.weapon_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.weapon_delete);
});
```

## CreateCharacter
You can execute the `CreateCharacter` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createCharacter(vars: CreateCharacterVariables): MutationPromise<CreateCharacterData, CreateCharacterVariables>;

interface CreateCharacterRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCharacterVariables): MutationRef<CreateCharacterData, CreateCharacterVariables>;
}
export const createCharacterRef: CreateCharacterRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCharacter(dc: DataConnect, vars: CreateCharacterVariables): MutationPromise<CreateCharacterData, CreateCharacterVariables>;

interface CreateCharacterRef {
  ...
  (dc: DataConnect, vars: CreateCharacterVariables): MutationRef<CreateCharacterData, CreateCharacterVariables>;
}
export const createCharacterRef: CreateCharacterRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCharacterRef:
```typescript
const name = createCharacterRef.operationName;
console.log(name);
```

### Variables
The `CreateCharacter` mutation requires an argument of type `CreateCharacterVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCharacterVariables {
  id: string;
  name: string;
  description?: string | null;
  portraitImage?: string | null;
  bustImage?: string | null;
  worldId: string;
}
```
### Return Type
Recall that executing the `CreateCharacter` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCharacterData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCharacterData {
  character_insert: Character_Key;
}
```
### Using `CreateCharacter`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCharacter, CreateCharacterVariables } from '@anify/dataconnect';

// The `CreateCharacter` mutation requires an argument of type `CreateCharacterVariables`:
const createCharacterVars: CreateCharacterVariables = {
  id: ..., 
  name: ..., 
  description: ..., // optional
  portraitImage: ..., // optional
  bustImage: ..., // optional
  worldId: ..., 
};

// Call the `createCharacter()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCharacter(createCharacterVars);
// Variables can be defined inline as well.
const { data } = await createCharacter({ id: ..., name: ..., description: ..., portraitImage: ..., bustImage: ..., worldId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCharacter(dataConnect, createCharacterVars);

console.log(data.character_insert);

// Or, you can use the `Promise` API.
createCharacter(createCharacterVars).then((response) => {
  const data = response.data;
  console.log(data.character_insert);
});
```

### Using `CreateCharacter`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCharacterRef, CreateCharacterVariables } from '@anify/dataconnect';

// The `CreateCharacter` mutation requires an argument of type `CreateCharacterVariables`:
const createCharacterVars: CreateCharacterVariables = {
  id: ..., 
  name: ..., 
  description: ..., // optional
  portraitImage: ..., // optional
  bustImage: ..., // optional
  worldId: ..., 
};

// Call the `createCharacterRef()` function to get a reference to the mutation.
const ref = createCharacterRef(createCharacterVars);
// Variables can be defined inline as well.
const ref = createCharacterRef({ id: ..., name: ..., description: ..., portraitImage: ..., bustImage: ..., worldId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCharacterRef(dataConnect, createCharacterVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.character_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.character_insert);
});
```

## UpdateCharacter
You can execute the `UpdateCharacter` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateCharacter(vars: UpdateCharacterVariables): MutationPromise<UpdateCharacterData, UpdateCharacterVariables>;

interface UpdateCharacterRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCharacterVariables): MutationRef<UpdateCharacterData, UpdateCharacterVariables>;
}
export const updateCharacterRef: UpdateCharacterRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateCharacter(dc: DataConnect, vars: UpdateCharacterVariables): MutationPromise<UpdateCharacterData, UpdateCharacterVariables>;

interface UpdateCharacterRef {
  ...
  (dc: DataConnect, vars: UpdateCharacterVariables): MutationRef<UpdateCharacterData, UpdateCharacterVariables>;
}
export const updateCharacterRef: UpdateCharacterRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateCharacterRef:
```typescript
const name = updateCharacterRef.operationName;
console.log(name);
```

### Variables
The `UpdateCharacter` mutation requires an argument of type `UpdateCharacterVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateCharacterVariables {
  id: string;
  name?: string | null;
  description?: string | null;
  portraitImage?: string | null;
  bustImage?: string | null;
}
```
### Return Type
Recall that executing the `UpdateCharacter` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateCharacterData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateCharacterData {
  character_update?: Character_Key | null;
}
```
### Using `UpdateCharacter`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateCharacter, UpdateCharacterVariables } from '@anify/dataconnect';

// The `UpdateCharacter` mutation requires an argument of type `UpdateCharacterVariables`:
const updateCharacterVars: UpdateCharacterVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
  portraitImage: ..., // optional
  bustImage: ..., // optional
};

// Call the `updateCharacter()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateCharacter(updateCharacterVars);
// Variables can be defined inline as well.
const { data } = await updateCharacter({ id: ..., name: ..., description: ..., portraitImage: ..., bustImage: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateCharacter(dataConnect, updateCharacterVars);

console.log(data.character_update);

// Or, you can use the `Promise` API.
updateCharacter(updateCharacterVars).then((response) => {
  const data = response.data;
  console.log(data.character_update);
});
```

### Using `UpdateCharacter`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateCharacterRef, UpdateCharacterVariables } from '@anify/dataconnect';

// The `UpdateCharacter` mutation requires an argument of type `UpdateCharacterVariables`:
const updateCharacterVars: UpdateCharacterVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
  portraitImage: ..., // optional
  bustImage: ..., // optional
};

// Call the `updateCharacterRef()` function to get a reference to the mutation.
const ref = updateCharacterRef(updateCharacterVars);
// Variables can be defined inline as well.
const ref = updateCharacterRef({ id: ..., name: ..., description: ..., portraitImage: ..., bustImage: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateCharacterRef(dataConnect, updateCharacterVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.character_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.character_update);
});
```

## DeleteCharacter
You can execute the `DeleteCharacter` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteCharacter(vars: DeleteCharacterVariables): MutationPromise<DeleteCharacterData, DeleteCharacterVariables>;

interface DeleteCharacterRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCharacterVariables): MutationRef<DeleteCharacterData, DeleteCharacterVariables>;
}
export const deleteCharacterRef: DeleteCharacterRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteCharacter(dc: DataConnect, vars: DeleteCharacterVariables): MutationPromise<DeleteCharacterData, DeleteCharacterVariables>;

interface DeleteCharacterRef {
  ...
  (dc: DataConnect, vars: DeleteCharacterVariables): MutationRef<DeleteCharacterData, DeleteCharacterVariables>;
}
export const deleteCharacterRef: DeleteCharacterRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteCharacterRef:
```typescript
const name = deleteCharacterRef.operationName;
console.log(name);
```

### Variables
The `DeleteCharacter` mutation requires an argument of type `DeleteCharacterVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteCharacterVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteCharacter` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteCharacterData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteCharacterData {
  character_delete?: Character_Key | null;
}
```
### Using `DeleteCharacter`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteCharacter, DeleteCharacterVariables } from '@anify/dataconnect';

// The `DeleteCharacter` mutation requires an argument of type `DeleteCharacterVariables`:
const deleteCharacterVars: DeleteCharacterVariables = {
  id: ..., 
};

// Call the `deleteCharacter()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteCharacter(deleteCharacterVars);
// Variables can be defined inline as well.
const { data } = await deleteCharacter({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteCharacter(dataConnect, deleteCharacterVars);

console.log(data.character_delete);

// Or, you can use the `Promise` API.
deleteCharacter(deleteCharacterVars).then((response) => {
  const data = response.data;
  console.log(data.character_delete);
});
```

### Using `DeleteCharacter`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteCharacterRef, DeleteCharacterVariables } from '@anify/dataconnect';

// The `DeleteCharacter` mutation requires an argument of type `DeleteCharacterVariables`:
const deleteCharacterVars: DeleteCharacterVariables = {
  id: ..., 
};

// Call the `deleteCharacterRef()` function to get a reference to the mutation.
const ref = deleteCharacterRef(deleteCharacterVars);
// Variables can be defined inline as well.
const ref = deleteCharacterRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteCharacterRef(dataConnect, deleteCharacterVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.character_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.character_delete);
});
```

