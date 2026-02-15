export type GatewayMessage = {
    type: 'req' | 'res' | 'event';
    id?: string;
    method?: string;
    params?: any;
    event?: string;
    payload?: any;
    ok?: boolean;
    error?: { message: string; code?: string };
};

export type GatewayOptions = {
    url: string;
    token: string;
};

export type ChatSendParams = {
    sessionKey: string;
    message: string;
    idempotencyKey: string;
};

export type ChatHistoryParams = {
    sessionKey: string;
    limit?: number;
};

export type ChatMessage = {
    role: 'user' | 'assistant' | 'system';
    content: Array<{ type: 'text'; text: string }>;
    timestamp?: number;
    clientId?: string;
    __optimisticId?: string;
    status?: 'pending' | 'sent' | 'error';
};

export type ChatHistoryResponse = {
    sessionKey: string;
    sessionId?: string;
    messages: ChatMessage[];
};

export type SessionMeta = {
    key: string;
    friendlyId?: string;
    title?: string;
    lastMessage?: ChatMessage;
    createdAt?: number;
    updatedAt?: number;
};

export type SessionListResponse = {
    sessions: SessionMeta[];
};

export type StreamEvent = {
    event: 'agent' | 'chat';
    payload?: {
        stream?: 'tokens' | 'assistant';
        runId?: string;
        sessionKey?: string;
        data?: {
            text?: string;
            delta?: string;
            phase?: 'start' | 'end';
        };
        state?: 'final';
    };
};
