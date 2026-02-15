import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import React, { useEffect } from "react";

import { CharacterStatus } from "@/components/CharacterStatus";
import { StaticGaussianBackground } from "@/components/StaticGaussianBackground";
import { usePanelStore } from "@/stores/panelStore";
import { useCharacters } from "@/hooks/useCharacters";
import { useWorld } from "@/contexts/WorldContext";
import { useSceneLoader } from "@/hooks/useSceneLoader";
import { useWorldScenes } from "@/hooks/useScenes";
import styles from "./adventure.module.css";
import { InputHistory } from "@/components/InputHistory";
import { LocationPanel } from "@/components/LocationPanel";
import { LogPanel } from "@/components/LogPanel";
import { TokenUsagePanel } from "@/components/TokenUsagePanel";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import type { GameState } from "@/types/game";
import type { TokenUsage } from "@/types/token";

interface AdventureSearch {
  area?: string;
  world?: string;
}

export const Route = createFileRoute("/_game/_trpg/adventure")({
  component: AdventurePage,
  validateSearch: (search: Record<string, unknown>): AdventureSearch => ({
    area: typeof search.area === "string" ? search.area : undefined,
    world: typeof search.world === "string" ? search.world : undefined,
  }),
});

const INITIAL_GAME_STATE: GameState = {
  history: ["Looked around the tavern.", "Talked to the bartender.", "Ordered a drink.", "Listened to rumors."],
  location: "Unknown",
  location_description: "",
  npcs: [],
  player: {
    description: "A brave adventurer.",
    inventory: [],
    name: "Player",
    role: "Player",
    stats: {
      hp: 80,
      maxHp: 100,
      maxMp: 200,
      maxSp: 500,
      mp: 120,
      sp: 450,
    },
    status_effects: [],
  },
  turn_count: 0,
};

function AdventurePage() {
  const { area: areaId, world: worldId } = useSearch({ from: "/_game/_trpg/adventure" });
  const { currentWorldId, loadWorld, currentWorld: _currentWorld } = useWorld();

  // Auto-switch world if needed
  useEffect(() => {
    if (worldId && worldId !== currentWorldId) {
      console.log(`[AdventurePage] Switching world from ${currentWorldId} to ${worldId}`);
      loadWorld(worldId).catch(err => console.error("Failed to switch world:", err));
    }
  }, [worldId, currentWorldId, loadWorld]);
  const [gameState, setGameState] = React.useState<GameState>(INITIAL_GAME_STATE);
  const [inputValue, setInputValue] = React.useState("");
  const [activePanel, setActivePanel] = React.useState<"history" | "log" | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [usage, setUsage] = React.useState<null | TokenUsage>(null);
  const navigate = useNavigate();
  const { openPanel } = usePanelStore();

  const { characters: _characters, defaultCharacter: _defaultCharacter } = useCharacters();
  const { getSceneForArea: _getSceneForArea } = useWorldScenes();
  const { scene } = useSceneLoader(areaId);

  // TODO: Wire triggerBattle to AI GM response handler
  // Battle can only be triggered programmatically by AI GM, not from UI
  // const triggerBattle = (enemyId?: string) => {
  //   navigate({ to: '/battle', search: { area: areaId, enemy: enemyId, returnTo: '/adventure' } });
  // };

  React.useEffect(() => {
    document.body.classList.add("bg-transparent");

    return () => {
      document.body.classList.remove("bg-transparent");
    };
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) {
      return;
    }

    const message = inputValue;

    setInputValue("");
    setIsLoading(true);

    // Optimistic update for history
    setGameState((prev) => ({
      ...prev,
      history: [...prev.history, `> ${message}`],
    }));

    try {
      const response = await api.fetch("/chat", {
        body: JSON.stringify({
          gameState,
          message,
        }),
        method: "POST",
      });

      if (response?.gameState) {
        // The backend currently returns the state as it received it (without the new history).
        // We need to manually append the user message and the AI response to the history.
        setGameState({
          ...response.gameState,
          history: [...response.gameState.history, `> ${message}`, response.response],
        });

        /* Set token usage if available */
        if (response.usage) {
          setUsage(response.usage);
        }
      } else {
        console.error("Invalid response from server", response);
      }
    } catch (error) {
      console.error("Failed to send message", error);
      // Revert or show error
      setGameState((prev) => ({
        ...prev,
        history: [...prev.history, "Error: Failed to send message."],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const { player } = gameState;
  const { stats } = player;

  return (
    <div className={styles.container}>
      {/* Static 3D background */}
      {scene && (
        <StaticGaussianBackground
          splatUrl={scene.splatUrl}
          cameraPosition={scene.spawnPosition}
          cameraTarget={{
            x: scene.spawnPosition.x,
            y: scene.spawnPosition.y,
            z: scene.spawnPosition.z - 5,
          }}
          className="z-0"
        />
      )}
      {/* Overlay to keep UI readable */}
      <div className="absolute inset-0 bg-black/30 z-[1]" />

      <TokenUsagePanel usage={usage} />
      <div className={styles.sideControls}>
        <button
          className={`${styles.sideBtn} ${activePanel === "log" ? styles.sideBtnActive : ""}`}
          onClick={() => setActivePanel(activePanel === "log" ? null : "log")}
          title={activePanel === "log" ? "Close Log" : "Expand Log"}
        >
          ⤢
        </button>
        <button
          className={`${styles.sideBtn} ${activePanel === "history" ? styles.sideBtnActive : ""}`}
          onClick={() => setActivePanel(activePanel === "history" ? null : "history")}
          title="Toggle History"
        >
          📜
        </button>

        <div
          className="side-divider"
          style={{ background: "rgba(255,255,255,0.1)", height: "1px", margin: "10px 0", width: "20px" }}
        />

        <button
          className={styles.sideBtn}
          title="Map"
          onClick={() => openPanel('map')}
        >
          🗺️
        </button>
        <Link
          className={styles.sideBtn}
          title="Quests"
          to="/quest"
        >
          📋
        </Link>
        <button
          className={`${styles.sideBtn} opacity-50 cursor-not-allowed`}
          title="Battle (triggered by story)"
          disabled
        >
          ⚔️
        </button>
        <button
          className={styles.sideBtn}
          title="Equipments"
          onClick={() => navigate({ to: '/me', search: { cat: 'character', tab: 'equipment' } })}
        >
          🛡️
        </button>
        <button
          className={styles.sideBtn}
          title="Items"
          onClick={() => navigate({ to: '/me', search: { cat: 'inventory', tab: 'consumable' } })}
        >
          📦
        </button>
        <button
          className={styles.sideBtn}
          title="Shop"
          onClick={() => openPanel('shop')}
        >
          🛒
        </button>
        <button
          className={styles.sideBtn}
          title="Forge"
          onClick={() => openPanel('forge')}
        >
          ⚒️
        </button>

        <div
          className="side-divider"
          style={{ background: "rgba(255,255,255,0.1)", height: "1px", margin: "10px 0", width: "20px" }}
        />

        <Link
          className={styles.sideBtn}
          title="Back to Home"
          to="/"
        >
          🏠
        </Link>
      </div>
      <div className={styles.statusWrapper}>
        <CharacterStatus
          hp={stats.hp || 0}
          maxHp={stats.maxHp || 100}
          maxMp={stats.maxMp || 100}
          maxSp={stats.maxSp || 100}
          mp={stats.mp || 0}
          sp={stats.sp || 0}
        />
        <div className="status-badges flex gap-2 justify-start mt-2">
          {player.status_effects.map((effect, i) => (
            <Badge
              className="gap-1"
              key={i}
              variant="outline"
            >
              {effect}
            </Badge>
          ))}
          {player.status_effects.length === 0 && (
            <Badge
              className="gap-1"
              variant="outline"
            >
              Normal
            </Badge>
          )}
        </div>
      </div>

      <div className={styles.layoutContainer}>
        <div className={styles.infoPanel}>
          <LocationPanel
            description={gameState.location_description}
            location={gameState.location}
          />

          {activePanel === "history" && <InputHistory history={gameState.history} />}

          {activePanel === "log" && <LogPanel history={gameState.history} />}
        </div>
      </div>
      <div className={styles.characterImageContainer}>
        <img
          alt="Character"
          className={styles.characterImage}
          src="/Character_sample.png"
        />
      </div>
      <div className={styles.inputWrapper}>
        <div className="dialog-section flex gap-4 mb-4">
          <div className={`${styles.dialog} flex-1 mb-0`}>
            {/* Display the last message from history if it's not a user command, or a default greeting */}
            {gameState.history.length > 0 ?
              gameState.history[gameState.history.length - 1]
              : "Welcome, traveler. What brings you to these lands?"}
          </div>
          <div className={`${styles.infoBox} w-[200px] shrink-0 h-auto mb-0`}>
            <h3>Characters</h3>
            <ul>
              {gameState.npcs.map((npc, i) => (
                <li key={i}>
                  {npc.name} ({npc.role})
                </li>
              ))}
              {gameState.npcs.length === 0 && <li>None</li>}
            </ul>
          </div>
        </div>
        <div className={styles.options}>
          <button className={styles.optionButton}>option1</button>
          <button className={styles.optionButton}>option2</button>
          <button className={styles.optionButton}>option3</button>
        </div>
        <div className={styles.bottomControls}>
          <div className={styles.inputContainer}>
            <input
              className={styles.input}
              disabled={isLoading}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              placeholder={isLoading ? "Processing..." : "What do you want to do?"}
              type="text"
              value={inputValue}
            />
            <div className={styles.inputActions}>
              <button
                className={styles.actionButton}
                title="Voice Input"
              >
                🎤
              </button>
              <button
                className={`${styles.actionButton} ${styles.sendButton}`}
                disabled={isLoading}
                onClick={handleSend}
                title="Send"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
