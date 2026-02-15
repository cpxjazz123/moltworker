
// Mock implementation of Firebase Data Connect queries

export async function getPlayerStateSummary(dc: any) {
    console.log('[DataConnect Mock] getPlayerStateSummary called');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        data: {
            user: {
                id: 'mock-user-id',
                playerProfile_on_user: {
                    isInitialized: true,
                    name: 'Mock Player',
                    bio: 'A mock player profile',
                    avatarUrl: '/Character_sample.png'
                },
                playerTutorial_on_user: {
                    isCompleted: true,
                    currentStep: null
                }
            }
        }
    };
}

export async function createUser(dc: any) {
    console.log('[DataConnect Mock] createUser called');
    return { data: { user_insert: { id: 'mock-user-id' } } };
}

export async function updateTutorialStep(dc: any, params: any) {
    console.log('[DataConnect Mock] updateTutorialStep called', params);
    return { data: { user_update: { id: 'mock-user-id' } } };
}

export async function completeTutorial(dc: any) {
    console.log('[DataConnect Mock] completeTutorial called');
    return { data: { user_update: { id: 'mock-user-id' } } };
}
