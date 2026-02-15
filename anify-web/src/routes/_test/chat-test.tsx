import { createFileRoute, Link } from "@tanstack/react-router";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";

import { auth } from "../../firebase";

export const Route = createFileRoute("/_test/chat-test")({
  // getParentRoute: () => RootRoute,
  // path: '/chat-test',
  component: ChatTestPage,
});

interface GameState {
  history: string[];
  location: string;
  location_description: string;
}

interface TokenUsage {
  completionTokens: number;
  estimatedCostUsd?: number;
  promptTokens: number;
  totalTokens: number;
}

function ChatTestPage() {
  const [user, setUser] = useState<null | User>(null);
  const [baseUrl, setBaseUrl] = useState("https://us-central1-anify-oiy-ai.cloudfunctions.net/api");
  const [message, setMessage] = useState("");
  const [streamingResponse, setStreamingResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isNonStreaming, setIsNonStreaming] = useState(false);
  const [tokenUsage, setTokenUsage] = useState<null | TokenUsage>(null);

  // 定义预设的 API 端点
  const apiEndpoints = {
    local: "http://127.0.0.1:5001/anify-oiy-ai/us-central1/api",
    production: "https://us-central1-anify-oiy-ai.cloudfunctions.net/api",
  };
  const [gameState, setGameState] = useState<GameState>({
    history: [],
    location: "森林入口",
    location_description: "你站在一片茂密森林的边缘，阳光透过树叶洒下斑驳的光影。前方是未知的冒险，你准备好了吗？",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const resetGameState = () => {
    setGameState({
      history: [],
      location: "森林入口",
      location_description: "你站在一片茂密森林的边缘，阳光透过树叶洒下斑驳的光影。前方是未知的冒险，你准备好了吗？",
    });
    setStreamingResponse("");
    setTokenUsage(null);
  };

  const sendMessageStreaming = async () => {
    if (!message.trim()) {
      alert("请输入消息");

      return;
    }

    setIsStreaming(true);
    setStreamingResponse("");
    setTokenUsage(null);

    try {
      const response = await fetch(`${baseUrl}/chat`, {
        body: JSON.stringify({
          gameState,
          message,
          stream: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error("无法获取响应流");
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");

        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            if (data === "[DONE]") {
              break;
            }

            try {
              const parsed = JSON.parse(data);

              // 处理内容片段
              if (parsed.content) {
                fullContent += parsed.content;
                setStreamingResponse(fullContent);
              }

              // 处理游戏状态和使用统计
              if (parsed.gameState) {
                setGameState(parsed.gameState);
              }

              if (parsed.usage) {
                setTokenUsage(parsed.usage);
              }
            } catch (e) {
              console.error("解析 SSE 数据失败:", e);
            }
          }
        }
      }

      setMessage("");
    } catch (error: any) {
      console.error("流式请求失败:", error);
      alert(`错误: ${error.message}`);
    } finally {
      setIsStreaming(false);
    }
  };

  const sendMessageNonStreaming = async () => {
    if (!message.trim()) {
      alert("请输入消息");

      return;
    }

    setIsNonStreaming(true);
    setStreamingResponse("");
    setTokenUsage(null);

    try {
      const response = await fetch(`${baseUrl}/chat`, {
        body: JSON.stringify({
          gameState,
          message,
          stream: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setStreamingResponse(data.response);
      setGameState(data.gameState);

      if (data.usage) {
        setTokenUsage(data.usage);
      }

      setMessage("");
    } catch (error: any) {
      console.error("非流式请求失败:", error);
      alert(`错误: ${error.message}`);
    } finally {
      setIsNonStreaming(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Chat Stream 测试页面</h1>
        <Link
          className="text-blue-500 hover:underline"
          to="/"
        >
          返回首页
        </Link>
      </div>

      {!user ?
        <div className="bg-yellow-100 p-4 rounded text-yellow-800">
          ⚠️ 你尚未登录。部分功能可能无法使用。{" "}
          <Link
            className="underline font-bold"
            to="/login"
          >
            点击登录
          </Link>
          。
        </div>
      : <div className="bg-green-100 p-4 rounded text-green-800">
          已登录：<strong>{user.email || user.uid}</strong>
        </div>
      }

      {/* API 配置 */}
      <div className="space-y-4 border p-4 rounded bg-white shadow-sm">
        <h2 className="text-xl font-semibold">配置</h2>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">API Base URL</label>
          <input
            className="border p-2 rounded w-full font-mono text-sm"
            onChange={(e) => setBaseUrl(e.target.value)}
            type="text"
            value={baseUrl}
          />
          <div className="flex gap-2 mt-2">
            <button
              className={`px-3 py-1 rounded text-sm ${
                baseUrl === apiEndpoints.production ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setBaseUrl(apiEndpoints.production)}
            >
              🚀 生产环境
            </button>
            <button
              className={`px-3 py-1 rounded text-sm ${
                baseUrl === apiEndpoints.local ? "bg-green-600 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setBaseUrl(apiEndpoints.local)}
            >
              💻 本地环境
            </button>
          </div>
          <p className="text-xs text-gray-500">
            {baseUrl === apiEndpoints.production && <span className="text-blue-600">✓ 使用生产环境统一 API 端点</span>}
            {baseUrl === apiEndpoints.local && <span className="text-green-600">✓ 使用本地 Emulator</span>}
            {baseUrl !== apiEndpoints.production && baseUrl !== apiEndpoints.local && (
              <span className="text-orange-600">⚠️ 使用自定义端点</span>
            )}
          </p>
        </div>
      </div>

      {/* 游戏状态 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 border p-4 rounded bg-white shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">当前游戏状态</h2>
            <button
              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm"
              onClick={resetGameState}
            >
              重置
            </button>
          </div>
          <div className="space-y-2">
            <div>
              <span className="font-semibold text-sm text-gray-600">位置：</span>
              <span className="ml-2">{gameState.location}</span>
            </div>
            <div>
              <span className="font-semibold text-sm text-gray-600">描述：</span>
              <p className="mt-1 text-gray-700">{gameState.location_description}</p>
            </div>
            <div>
              <span className="font-semibold text-sm text-gray-600">历史记录：</span>
              <div className="mt-2 bg-gray-50 p-3 rounded max-h-[200px] overflow-auto text-xs space-y-1">
                {gameState.history.length === 0 ?
                  <span className="text-gray-400">暂无历史记录</span>
                : gameState.history.map((entry, idx) => (
                    <div
                      className="border-b border-gray-200 pb-1"
                      key={idx}
                    >
                      {entry}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>

        {/* Token 使用统计 */}
        <div className="space-y-4 border p-4 rounded bg-white shadow-sm">
          <h2 className="text-xl font-semibold">Token 使用统计</h2>
          {tokenUsage ?
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Prompt Tokens:</span>
                <span className="font-mono">{tokenUsage.promptTokens}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completion Tokens:</span>
                <span className="font-mono">{tokenUsage.completionTokens}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600 font-semibold">Total Tokens:</span>
                <span className="font-mono font-semibold">{tokenUsage.totalTokens}</span>
              </div>
              {tokenUsage.estimatedCostUsd !== undefined && (
                <div className="flex justify-between bg-green-50 p-2 rounded">
                  <span className="text-gray-600">预估成本:</span>
                  <span className="font-mono text-green-700">${tokenUsage.estimatedCostUsd.toFixed(6)}</span>
                </div>
              )}
            </div>
          : <div className="text-gray-400 text-sm">发送消息后将显示 Token 使用统计</div>}
        </div>
      </div>

      {/* 消息输入区 */}
      <div className="space-y-4 border p-4 rounded bg-white shadow-sm">
        <h2 className="text-xl font-semibold">发送消息</h2>
        <div className="space-y-4">
          <textarea
            className="border p-3 rounded w-full h-24 resize-none"
            disabled={isStreaming || isNonStreaming}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="输入你的消息，例如：我想探索森林深处..."
            value={message}
          />
          <div className="flex gap-4">
            <button
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              disabled={isStreaming || isNonStreaming}
              onClick={sendMessageStreaming}
            >
              {isStreaming ? "正在发送（流式）..." : "发送（流式模式）"}
            </button>
            <button
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              disabled={isStreaming || isNonStreaming}
              onClick={sendMessageNonStreaming}
            >
              {isNonStreaming ? "正在发送（非流式）..." : "发送（非流式模式）"}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            💡 提示：流式模式会逐字显示响应（打字机效果），非流式模式会一次性显示完整响应。
          </p>
        </div>
      </div>

      {/* 响应显示区 */}
      <div className="space-y-4 border p-4 rounded bg-white shadow-sm">
        <h2 className="text-xl font-semibold">LLM 响应</h2>
        <div className="bg-gray-50 p-4 rounded min-h-[200px] max-h-[400px] overflow-auto">
          {streamingResponse ?
            <div className="prose prose-sm max-w-none whitespace-pre-wrap">{streamingResponse}</div>
          : <div className="text-gray-400 italic">
              {isStreaming || isNonStreaming ? "等待响应中..." : "发送消息后，LLM 响应将显示在这里"}
            </div>
          }
        </div>
      </div>
    </div>
  );
}
