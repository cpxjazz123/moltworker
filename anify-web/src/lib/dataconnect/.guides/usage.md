# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { getPlayerProfile, getPlayerTutorial, getPlayerStateSummary, initializePlayer, updatePlayerProfile, startTutorial, advanceTutorial, completeTutorial, resetTutorial, adminGetPlayerProfile } from '@anify/dataconnect';


// Operation GetPlayerProfile: 
const { data } = await GetPlayerProfile(dataConnect);

// Operation GetPlayerTutorial: 
const { data } = await GetPlayerTutorial(dataConnect);

// Operation GetPlayerStateSummary: 
const { data } = await GetPlayerStateSummary(dataConnect);

// Operation InitializePlayer:  For variables, look at type InitializePlayerVars in ../index.d.ts
const { data } = await InitializePlayer(dataConnect, initializePlayerVars);

// Operation UpdatePlayerProfile:  For variables, look at type UpdatePlayerProfileVars in ../index.d.ts
const { data } = await UpdatePlayerProfile(dataConnect, updatePlayerProfileVars);

// Operation StartTutorial: 
const { data } = await StartTutorial(dataConnect);

// Operation AdvanceTutorial:  For variables, look at type AdvanceTutorialVars in ../index.d.ts
const { data } = await AdvanceTutorial(dataConnect, advanceTutorialVars);

// Operation CompleteTutorial: 
const { data } = await CompleteTutorial(dataConnect);

// Operation ResetTutorial: 
const { data } = await ResetTutorial(dataConnect);

// Operation AdminGetPlayerProfile:  For variables, look at type AdminGetPlayerProfileVars in ../index.d.ts
const { data } = await AdminGetPlayerProfile(dataConnect, adminGetPlayerProfileVars);


```