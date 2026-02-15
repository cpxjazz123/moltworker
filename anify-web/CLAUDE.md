# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此仓库中工作提供指导。

## 项目概述

anify-web 是一个 React/TypeScript Web 应用，作为 Anify TRPG 游戏系统的 UI 层。主要功能：
- 认证流程
- 角色互动面板（文本输入、流式输出、Live2D、语音）
- TRPG 冒险面板（角色状态、装备、技能、背包、任务）
- 3D 场景渲染（高斯泼溅 Gaussian Splatting）

## 命令

```bash
pnpm dev          # 启动开发服务器（使用 local.anify.ai 主机）
pnpm build        # TypeScript 检查 + Vite 构建
pnpm lint         # ESLint 检查
pnpm preview      # 预览生产构建
```

## 环境变量

将 `.env.example` 复制为 `.env`：
```
VITE_API_URL=http://localhost:8789       # 后端 API 端点
```

## 功能清单与导航

### 核心页面

| 页面 | 路由 | 状态 | 数据源 | 说明 |
|------|------|------|--------|------|
| 首页 | `/` | ⚠️ 部分Mock | GameDataContext + WorldContext | 角色互动主界面，文字/语音聊天 |
| 角色创建 | `/landing` | ✅ 完成 | 后端API + Tutorial | 新用户引导，创建角色名 |
| 角色管理 | `/me?tab=` | ⚠️ 部分Mock | 见下方子Tab | 角色面板（装备/物品/技能/成就/招募） |
| 记忆画廊 | `/memories` | ❌ Mock | MOCK_MEMORIES | 记忆卡片网格展示 |
| 时间线 | `/timeline` | ❌ Mock | MOCK_MEMORIES | 按时间轴展示记忆 |
| 设置 | `/settings` | ✅ 完成 | localStorage | 用户偏好设置 |

### /me 子Tab

| Tab | 参数 | 状态 | 数据源 |
|-----|------|------|--------|
| 装备 | `?tab=equipment` | ✅ 元数据 | useEquipment() ← equipment.json |
| 角色属性 | `?tab=character` | ⚠️ 部分Mock | useGameData() |
| 物品背包 | `?tab=items` | ❌ Mock | MOCK_ITEMS (10个) |
| 魔法书 | `?tab=grimoire` | ❌ Mock | MOCK_SKILLS (10个) |
| 成就 | `?tab=achievements` | ✅ 元数据 | useWorldAchievements() ← achievements.json |
| 招募 | `?tab=recruit` | ❌ Mock | MOCK_CHARACTERS (8个) |

### TRPG 路由 (`_game/_trpg`)

| 页面 | 路由 | 状态 | 数据源 |
|------|------|------|--------|
| 3D探索 | `/explore?area=X&world=Y` | ✅ 元数据 | useSceneLoader() ← scenes/*.json |
| 文字冒险 | `/adventure?area=X&world=Y` | ⚠️ 部分完成 | API /chat + INITIAL_GAME_STATE |
| 战斗 | `/battle` | ❌ Mock | mock party/enemies/skills (无逻辑) |
| 图书馆 | `/books` | ❌ Mock | mockBooks (8本) |
| 深渊挑战 | `/abyss` | ❌ Mock | mockFloors (8层) |
| 转生 | `/reincarnation` | ❌ Mock | mockBonuses/mockLifeRecords |

### 同伴路由 (`_game/_companion`)

| 页面 | 路由 | 状态 | 数据源 |
|------|------|------|--------|
| 电话对话 | `/phone?characterId=X&worldId=Y` | ❌ Mock | mock回复模板 (不在本次改造范围) |
| 鉴定 | `/appraisal` | ❌ Mock | mockUnidentifiedItems (5个) |
| 邮件 | `/mail` | 🗑️ 待删除 | mockMails |

### 其他游戏路由

| 页面 | 路由 | 状态 | 数据源 |
|------|------|------|--------|
| 任务 | `/quest` | ⚠️ 部分完成 | useQuests() (数据层不完整) |
| 角色列表 | `/characters/:worldId` | ✅ 元数据 | useWorldCharacters() |
| 城镇 | `/town/:townId` | ✅ 元数据 | towns.json |

### 面板系统 (GamePanel)

通过 `usePanelStore().openPanel(type)` 打开，覆盖在当前页面上方：

| 面板 | PanelType | 状态 | 数据源 |
|------|-----------|------|--------|
| 角色信息 | `character` | ⚠️ 部分Mock | useGameData() |
| 背包 | `inventory` | ⚠️ 部分Mock | 混合数据 |
| 商店 | `shop` | ✅ 元数据 (货币Mock) | useWorldShop() + 硬编码gold/gem/token |
| 锻造 | `forge` | ✅ 元数据 | useWorldMinting() |
| 公会 | `guild` | ✅ 元数据 | useWorldGuild() |
| 住所 | `residence` | ❌ Mock | MOCK_JOURNAL + 硬编码HP/MP |
| 仓库 | `storage` | ⚠️ 部分Mock | 混合数据 |
| 任务 | `tasks` | ✅ 元数据 | useWorldTasks() |
| 成就 | `achievements` | ✅ 元数据 | useWorldAchievements() |
| 地图 | `map` | ✅ 元数据 | useWorldAreas() + useMapStore() |

### 模态框

| 模态框 | 触发位置 | 状态 | 数据源 |
|--------|---------|------|--------|
| 通讯录 | 首页右侧菜单 | ⚠️ | 角色列表 |
| 换装 | 首页右侧菜单 | ❌ Mock | outfitStore硬编码 |
| 换场景 | 首页右侧菜单 | ✅ | 场景配置 |

### 认证路由 (`_auth`)

| 页面 | 路由 | 状态 |
|------|------|------|
| 登录 | `/login` | ✅ (Firebase: 邮箱/Google/Apple/手机) |
| 注册 | `/register` | ✅ |
| 忘记密码 | `/forgot-password` | ✅ |
| 重置密码 | `/forgot-password-reset?oobCode=` | ✅ |

### 用户路由 (`_user`)

| 页面 | 路由 | 状态 |
|------|------|------|
| 账户 | `/account` | ✅ |
| 订阅 | `/subscription-plans` | ✅ |
| 令牌用量 | `/token-usage` | ✅ |
| 充值 | `/top-up-tokens` | ✅ |

### 导航结构

**底部导航栏 (AppDock)** — 显示在 `/`、`/me`、`/memories`、`/settings`：
```
首页(/) → 记忆(/memories) → 探索(/explore) → 我的(/me) → 设置(/settings)
```

**主要导航流程：**

```
认证: /login → / (首页)
     /register → /
     /landing → / (角色创建后)

角色互动: / → 通讯录Modal → /phone?characterId&worldId
          / → 换装Modal
          / → 换场景Modal
          / → 文字/语音聊天模式

角色管理: / → AppDock[我的] → /me?tab=equipment|character|items|grimoire|achievements|recruit

探索: / → AppDock[探索] → /explore?area&world
     /explore → 交互点 → panel(shop|forge|guild|residence|storage|map) 或 对话框
     /explore → GameDock → 各面板

地图导航: panel:map → 选择世界(loadWorld) → 选择地点
         → /explore?area&world (城镇地点)
         → /adventure?area&world (冒险地点)

角色浏览: panel:map → /characters/:worldId → 点击角色 → /phone?characterId&worldId
         /phone → 返回 → /characters/:worldId

冒险: /adventure → GameDock → 各面板
     /adventure → 侧边控制 → panel(map|inventory|character|tasks)
```

### 散落的硬编码值

| 位置 | 硬编码内容 | 应替换为 |
|------|-----------|---------|
| `index.tsx` | level:25, progress:40%, streak:7 | PlayerState |
| `ShopPanel.tsx` | gold:15000, gem:120, token:50 | PlayerState.currencies |
| `RecruitTab.tsx` | gems:2450, tickets:5 | PlayerState.currencies |
| `ResidencePanel.tsx` | HP:65/100, MP:30/50 | PlayerState.hp/mp |
| `adventure.tsx` | INITIAL_GAME_STATE (HP/MP/SP) | PlayerState |

### 世界元数据文件 (`public/worlds/{worldId}/`)

| 文件 | 类型/Hook | 状态 |
|------|-----------|------|
| world.json | WorldMeta / useWorld() | ✅ 已接入 |
| areas.json | Area[] / useWorldAreas() | ✅ 已接入 |
| characters.json | WorldMetaCharacter[] / useWorldCharacters() | ✅ 已接入 |
| equipment.json | Equipment[] / useWorldEquipment() | ✅ 已接入 |
| items.json | Item[] / useCurrentWorld().items | ✅ 已接入 |
| quests.json | WorldMetaQuest[] / useWorldQuests() | ✅ 已接入 |
| dialogues.json | DialogueTree[] / getDialogue() | ✅ 已接入 |
| achievements.json | Achievement[] / useWorldAchievements() | ✅ 已接入 |
| tasks.json | Task[] / useWorldTasks() | ✅ 已接入 |
| guild.json | GuildQuest[] / useWorldGuild() | ✅ 已接入 |
| shop.json | ShopItem[] / useWorldShop() | ✅ 已接入 |
| minting.json | CraftingRecipe[] / useWorldMinting() | ✅ 已接入 |
| enemies.json | Enemy[] | ✅ 已接入 |
| factions.json | Faction[] | ✅ 已接入 |
| towns.json | Town[] / useWorldTowns() | ✅ 已接入 |
| interactions.json | TownInteractionPoint[] | ✅ 已接入 |
| scenes/*.json | SceneConfig / useSceneLoader() | ✅ 已接入 |
| tutorial/steps.json | TutorialStep[] | ✅ 已接入 |
| grimoire.json | ❌ 无类型/Hook | 🔧 待接通 |
| outfits.json | ❌ 无类型/Hook | 🔧 待接通 |
| memories.json | ❌ 无类型/Hook | 🔧 待接通 |
| residence.json | ❌ 无类型/Hook | 🔧 待接通 |
| books.json | ❌ 不存在 | 🔧 待新建 |
| battle.json | ❌ 不存在 | 🔧 待新建 |
| abyss.json | ❌ 不存在 | 🔧 待新建 |
| reincarnation.json | ❌ 不存在 | 🔧 待新建 |
| appraisal.json | ❌ 不存在 | 🔧 待新建 |

## 架构

### 路由 (TanStack Router)

基于文件的路由位于 `src/routes/`，按布局分组：
- `_auth/` - 公开认证路由（登录、注册、密码重置）
- `_user/` - 用户设置路由（账户、订阅、令牌）
- `_game/` - 游戏 UI 路由，按功能组织：
  - `_companion/` - 角色互动（聊天、通讯录、电话）
  - `_character/` - 角色管理（物品、装备、魔法书）
  - `_affair/` - 游戏系统（商店、锻造）
  - `_trpg/` - TRPG 组件（冒险、战斗、图书馆、深渊、转生、鉴定）
- `_test/` - 开发/测试页面
- `_embed/` - 可嵌入组件（场景编辑器）

路由树自动生成至 `src/routeTree.gen.ts`。

### 认证

Firebase 认证在 `src/routes/__root.tsx` 中管理：
- `onAuthStateChanged` 监听器设置认证状态
- 受保护路由在未认证时重定向至 `/login`
- 公开路径：`/login`、`/register`、`/forgot-password`、`/micro-web-test`
- `src/lib/api.ts` 中的 API 调用自动注入 Firebase ID 令牌

### 世界元数据系统

所有游戏内容由 `public/worlds/{worldId}/` 下的 JSON 元数据驱动：
- `useWorldLoader` 从 JSON 文件并行加载世界数据
- `WorldContext` 提供数据访问 Hook（useWorldItems、useWorldGrimoire 等）
- 两个世界：`official-intro`（教程）和 `anthromyth`（战役）
- 世界类型定义：`src/types/world-metadata.ts`
- 切换世界即加载完全不同的内容，无需修改代码

### 玩家状态

- `playerStateStore.ts` (Zustand + localStorage persist) 管理运行时玩家数据
- 包含：生命值(HP/MP/SP)、货币、等级、背包、技能装备、功能进度
- 世界元数据 = 静态内容定义（目录）；玩家状态 = 动态用户数据（进度）

### 3D 场景系统

`src/components/GaussSplattingScene/`（18 个文件）：
- 使用 @sparkjsdev/spark 进行高斯泼溅渲染
- @react-three/rapier 处理物理碰撞
- 功能：玩家控制器、虚拟摇杆、交互点、墙壁碰撞器、边界编辑器
- iOS 15 Safari 兼容：自定义 Vite 插件注入 DecompressionStream polyfill 到 spark worker

### UI 系统

- Tailwind CSS v4，自定义主题变量位于 `src/index.css`
- 毛玻璃效果通过 `liquid-glass-react` 实现
- 组件变体通过 `class-variance-authority` 管理
- 路径别名：`@/` 映射到 `src/`

## 提交规范

使用约定式提交，**首字母大写**要求：
```
feat: Add new feature      ✓
feat: add new feature      ✗
```
最大标题长度：150 个字符。

## 浏览器目标

iOS >= 14, Android >= 80, Chrome >= 80, Safari >= 14, Firefox >= 78

## 部署

通过 `wrangler` 部署到 Cloudflare Workers。三个环境：production (main)、preview、dev。GitHub Actions 处理 CI/CD。

## 重要要求

每次回复结束时，需要添加标题 "我的回答结束了，Alex"。
