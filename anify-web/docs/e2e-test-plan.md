# Anify Web E2E 测试方案

> 版本: 1.0 | 日期: 2026-02-10 | 状态: Draft

## 目录

1. [测试框架选型与配置方案](#1-测试框架选型与配置方案)
2. [测试基础设施方案](#2-测试基础设施方案)
3. [自动化 E2E 测试用例](#3-自动化-e2e-测试用例)
4. [人工测试用例](#4-人工测试用例)
5. [跨浏览器/跨设备策略](#5-跨浏览器跨设备策略)
6. [CI 集成与执行策略](#6-ci-集成与执行策略)

---

## 1. 测试框架选型与配置方案

### 1.1 框架选择: Playwright

| 评估维度 | Playwright | Cypress |
|----------|-----------|---------|
| 浏览器覆盖 | Chromium + Firefox + WebKit (原生) | Chromium + Firefox + WebKit (实验性) |
| 移动模拟 | 内建设备模拟 (iPhone, Pixel 等) | 仅视口调整 |
| OAuth 弹窗 | 支持多浏览器上下文 | 不支持跨域弹窗 |
| 网络拦截 | `page.route()` 拦截任意请求 | `cy.intercept()` |
| TypeScript | 原生一等支持 | 需额外配置 |
| CI 集成 | 原生 GitHub Actions 支持 | 需 Docker 或额外配置 |
| WebGL/Canvas | 可断言 Canvas 元素和 WebGL 上下文 | 有限支持 |

**结论: 选用 Playwright**，原因:
- 原生支持项目目标浏览器 (Chrome>=80, Firefox>=78, Safari>=14)
- Firebase `signInWithPopup` 需要多浏览器上下文处理
- iOS Safari 地址栏适配需要 WebKit 引擎测试
- 3D 场景 (Gaussian Splatting) 需要 WebGL Canvas 断言
- 与项目 TypeScript 技术栈一致

### 1.2 Playwright 配置方案

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['list'],
    ...(process.env.CI ? [['github'] as const] : []),
  ],
  use: {
    baseURL: 'http://local.anify.ai:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://local.anify.ai:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  timeout: 30_000, // 3D 场景加载较慢
});
```

### 1.3 依赖安装

```bash
pnpm add -D @playwright/test
npx playwright install
```

---

## 2. 测试基础设施方案

### 2.1 目录结构

```
tests/
  e2e/
    auth/                    # Suite 1: 认证流程
      login.spec.ts
      register.spec.ts
      forgot-password.spec.ts
    home/                    # Suite 3: 首页/仪表板
      dashboard.spec.ts
      chat-mode.spec.ts
    landing/                 # Suite 2: 入职引导
      onboarding.spec.ts
    me/                      # Suite 4: 角色/背包
      character-tab.spec.ts
      inventory-tab.spec.ts
    adventure/               # Suite 5: 文字冒险
      adventure.spec.ts
    battle/                  # Suite 6: 回合制战斗
      battle.spec.ts
    companion/               # Suite 8: 伴侣系统
      phone.spec.ts
      mail.spec.ts
      appraisal.spec.ts
    game-systems/            # Suite 7: 游戏系统页面
      quest.spec.ts
      memories.spec.ts
      books.spec.ts
      abyss.spec.ts
      reincarnation.spec.ts
      characters.spec.ts
      town.spec.ts
    panels/                  # Suite 9: 面板覆盖系统
      shop-panel.spec.ts
      forge-panel.spec.ts
      guild-panel.spec.ts
      residence-panel.spec.ts
      map-panel.spec.ts
      tasks-panel.spec.ts
      achievements-panel.spec.ts
      inventory-panel.spec.ts
      storage-panel.spec.ts
    settings/                # Suite 10: 设置
      settings.spec.ts
      account.spec.ts
      subscription.spec.ts
      tokens.spec.ts
    tutorial/                # Suite 11: 教程流程
      tutorial-flow.spec.ts
    world/                   # Suite 12: 世界元数据
      world-loading.spec.ts
    fixtures/                # 测试固件
      auth.fixture.ts
      world-data.fixture.ts
    helpers/                 # 测试辅助
      firebase-mock.ts
      api-mock.ts
      navigation.ts
    pages/                   # Page Object Models
      login.page.ts
      home.page.ts
      me.page.ts
      adventure.page.ts
      battle.page.ts
  playwright.config.ts
```

### 2.2 Firebase Auth Mock 策略

应用通过 `src/firebase.ts` 初始化 Firebase Auth，认证状态通过 `src/routes/__root.tsx` 中的 `onAuthStateChanged` 监听器流入。

**方案 A: Firebase Auth Emulator (P0 认证测试使用)**

```bash
# 启动 Firebase Auth 模拟器
firebase emulators:start --only auth
```

- 项目已支持模拟器 (参考 `firebase.ts` 中 `connectDataConnectEmulator`)
- 可通过模拟器 REST API 创建真实测试用户
- 提供最真实的 OAuth 弹窗行为测试
- 仅用于 P0 认证流程验证

**方案 B: Route-Level Mock (大部分测试使用)**

```typescript
// tests/e2e/fixtures/auth.fixture.ts
import { test as base, type Page } from '@playwright/test';

// 模拟已登录用户的测试固件
export const test = base.extend<{ authedPage: Page }>({
  authedPage: async ({ page }, use) => {
    // 在应用加载前注入 mock auth 状态
    await page.addInitScript(() => {
      window.__PLAYWRIGHT_AUTH_MOCK__ = {
        uid: 'test-user-001',
        email: 'test@anify.ai',
        emailVerified: true,
        displayName: 'Test Player',
        getIdToken: async () => 'mock-jwt-token-for-testing',
      };
    });

    // 拦截 API 调用，返回默认 mock 响应
    await page.route('**/api/**', async (route) => {
      const url = route.request().url();
      // 根据端点返回预设响应
      if (url.includes('/chat')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ response: 'Mock adventure response' }),
        });
      } else {
        await route.fulfill({ status: 200, body: '{}' });
      }
    });

    await use(page);
  },
});

export { expect } from '@playwright/test';
```

**应用端适配** (需要在 `src/routes/__root.tsx` 添加):

```typescript
// 检测 Playwright mock 并跳过真实 Firebase auth
if (window.__PLAYWRIGHT_AUTH_MOCK__) {
  // 直接使用 mock user 设置 auth 状态
  setAuthState(window.__PLAYWRIGHT_AUTH_MOCK__);
}
```

### 2.3 API Mock 策略

API 客户端位于 `src/lib/api.ts`，调用 `VITE_API_URL`。

```typescript
// tests/e2e/helpers/api-mock.ts
import type { Page } from '@playwright/test';

export async function mockApiResponses(page: Page) {
  // 拦截 player state 查询 (Data Connect)
  await page.route('**/api/player-state*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        name: 'Test Hero',
        level: 5,
        hp: 100, maxHp: 100,
        mp: 50, maxMp: 50,
        experience: 250, maxExperience: 500,
      }),
    })
  );

  // 拦截 chat endpoint (冒险模式)
  await page.route('**/api/chat', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'You look around the tavern...',
        gameState: { location: 'Tavern', npcs: ['Bartender'] },
      }),
    })
  );

  // 拦截 tutorial state
  await page.route('**/api/tutorial*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ step: 'tutorial_complete' }),
    })
  );
}

export async function mockApiError(page: Page, endpoint: string, status = 500) {
  await page.route(`**/api/${endpoint}*`, (route) =>
    route.fulfill({ status, body: JSON.stringify({ error: 'Mock error' }) })
  );
}
```

### 2.4 World Metadata

World 元数据从 `public/worlds/{worldId}/` 加载静态 JSON 文件。开发服务器会直接提供这些文件，因此 **无需 mock**。测试可直接依赖项目中的 `official-intro` 和 `anthromyth` 世界数据。

### 2.5 Page Object Models 示例

```typescript
// tests/e2e/pages/login.page.ts
import type { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;
  readonly registerLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly googleButton: Locator;
  readonly appleButton: Locator;
  readonly phoneButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.signInButton = page.getByRole('button', { name: /sign in/i });
    this.errorMessage = page.locator('[class*="error"], [role="alert"]');
    this.registerLink = page.getByText(/create one/i);
    this.forgotPasswordLink = page.getByText(/forgot password/i);
    this.googleButton = page.getByRole('button', { name: /google/i });
    this.appleButton = page.getByRole('button', { name: /apple/i });
    this.phoneButton = page.getByRole('button', { name: /phone/i });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
```

---

## 3. 自动化 E2E 测试用例

### 优先级说明

| 等级 | 含义 | 执行频率 |
|------|------|----------|
| **P0** | 关键路径 - 阻断性缺陷 | 每次 PR |
| **P1** | 核心功能 - 主要功能异常 | 每日构建 |
| **P2** | 功能完整 - 边缘场景/过滤排序 | 每周/发布前 |
| **P3** | 体验优化 - 动画/视觉/响应式 | 大版本前 |

---

### Suite 1: 认证流程 (13 cases)

**关键代码文件:**
- `src/routes/_auth/login.tsx` — 登录页面 (邮箱/OAuth/手机)
- `src/routes/_auth/register.tsx` — 注册页面
- `src/routes/_auth/forgot-password.tsx` — 忘记密码
- `src/routes/_auth/forgot-password-reset.tsx` — 重置密码
- `src/routes/__root.tsx` — 认证守卫逻辑

---

#### AUTH-001: 邮箱密码登录 - 正常流程

| 字段 | 内容 |
|------|------|
| **优先级** | P0 |
| **前置条件** | 存在已验证邮箱的测试用户；使用 Firebase Auth Emulator 或 mock |
| **步骤** | 1. 导航到 `/login` |
| | 2. 验证页面显示 "Sign in" 标题 |
| | 3. 在邮箱输入框输入有效邮箱 |
| | 4. 在密码输入框输入有效密码 |
| | 5. 点击 "Sign in" 按钮 |
| | 6. 等待页面导航完成 |
| **预期结果** | 用户被重定向到 `/` (首页)。无错误信息显示。页面包含角色信息和主界面元素。 |

---

#### AUTH-002: 邮箱密码登录 - 错误凭证

| 字段 | 内容 |
|------|------|
| **优先级** | P0 |
| **前置条件** | 无 |
| **步骤** | 1. 导航到 `/login` |
| | 2. 输入不存在的邮箱或错误密码 |
| | 3. 点击 "Sign in" |
| **预期结果** | 显示错误信息 "Login failed. Please check your email and password."。用户停留在 `/login` 页面。 |

---

#### AUTH-003: 邮箱密码登录 - 空字段

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 无 |
| **步骤** | 1. 导航到 `/login` |
| | 2. 不输入任何内容，直接点击 "Sign in" |
| **预期结果** | 显示错误信息 "Please enter both email and password."（参考 `login.tsx` 第63行）。不发起任何网络请求。 |

---

#### AUTH-004: 邮箱密码登录 - 未验证邮箱

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 存在未验证邮箱的测试用户 |
| **步骤** | 1. 导航到 `/login` |
| | 2. 输入未验证用户的邮箱和密码 |
| | 3. 点击 "Sign in" |
| **预期结果** | 显示错误信息 "Please verify your email before signing in."（参考 `login.tsx` 第76行）。用户停留在登录页。 |

---

#### AUTH-005: 注册 - 正常流程

| 字段 | 内容 |
|------|------|
| **优先级** | P0 |
| **前置条件** | 无 |
| **步骤** | 1. 导航到 `/register`（或从登录页点击 "Create one" 链接） |
| | 2. 验证页面显示 "Create account" 标题（参考 `register.tsx` 第79行） |
| | 3. 输入新邮箱地址 |
| | 4. 输入密码 (>= 6 字符) |
| | 5. 点击提交按钮 |
| **预期结果** | 显示成功信息，提示验证邮件已发送。无错误信息。 |

---

#### AUTH-006: 注册 - 邮箱已存在

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 目标邮箱已注册 |
| **步骤** | 1. 导航到 `/register` |
| | 2. 输入已存在的邮箱 |
| | 3. 输入密码并提交 |
| **预期结果** | 显示错误信息 "This email is already in use."（参考 `register.tsx` 第62行）。 |

---

#### AUTH-007: 注册 - 弱密码

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 无 |
| **步骤** | 1. 导航到 `/register` |
| | 2. 输入有效邮箱 |
| | 3. 输入短密码 (< 6 字符) |
| | 4. 提交 |
| **预期结果** | 显示错误信息 "Password should be at least 6 characters."（参考 `register.tsx` 第66行）。 |

---

#### AUTH-008: 忘记密码 - 发送重置邮件

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 目标邮箱已注册 |
| **步骤** | 1. 导航到 `/login` |
| | 2. 点击 "Forgot password?" 链接 |
| | 3. 验证已导航到 `/forgot-password`，显示 "Reset password" 标题 |
| | 4. 输入已注册邮箱 |
| | 5. 点击 "Send reset email" |
| **预期结果** | 显示成功信息 "Password reset email sent to {email}."。 |

---

#### AUTH-009: 忘记密码 - 无此账号

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 无 |
| **步骤** | 1. 导航到 `/forgot-password` |
| | 2. 输入未注册的邮箱 |
| | 3. 提交 |
| **预期结果** | 显示错误信息 "No account found with this email."。 |

---

#### AUTH-010: 手机登录 - 打开弹窗

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 无 |
| **步骤** | 1. 导航到 `/login` |
| | 2. 点击 "Continue with Phone" 按钮 |
| **预期结果** | 手机登录弹窗出现，包含 "Phone Sign In" 标题和手机号码输入框。 |

---

#### AUTH-011: 认证守卫 - 未登录重定向

| 字段 | 内容 |
|------|------|
| **优先级** | P0 |
| **前置条件** | 未登录状态 |
| **步骤** | 1. 直接导航到 `/`（受保护路由） |
| | 2. 验证被重定向到 `/login` |
| | 3. 直接导航到 `/me` |
| | 4. 验证被重定向到 `/login` |
| | 5. 直接导航到 `/adventure` |
| | 6. 验证被重定向到 `/login` |
| **预期结果** | 所有受保护路由都重定向到 `/login`。URL 变为 `/login`。 |

---

#### AUTH-012: 认证守卫 - 公开路由可访问

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 未登录状态 |
| **步骤** | 1. 导航到 `/login`，验证页面正常渲染 |
| | 2. 导航到 `/register`，验证页面正常渲染 |
| | 3. 导航到 `/forgot-password`，验证页面正常渲染 |
| | 4. 导航到 `/forgot-password-reset`，验证页面正常渲染 |
| | 5. 导航到 `/landing`，验证页面正常渲染 |
| | 6. 导航到 `/micro-web-test`，验证页面正常渲染 |
| **预期结果** | 所有 6 个公开路由（对应 `__root.tsx` 中 `publicPaths` 数组）无重定向，正常显示各自内容。 |

---

#### AUTH-013: 认证页面间导航

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 未登录状态 |
| **步骤** | 1. 导航到 `/login` |
| | 2. 点击 "Create one" 链接 → 验证到达 `/register` |
| | 3. 点击 "Sign in" 链接 → 验证返回 `/login` |
| | 4. 点击 "Forgot password?" → 验证到达 `/forgot-password` |
| | 5. 点击 "Back to Sign in" → 验证返回 `/login` |
| **预期结果** | 所有导航链接正确工作，页面正确渲染。 |

---

### Suite 2: 入职引导 (3 cases)

**关键代码文件:**
- `src/routes/landing.tsx` — 落地页和角色创建

---

#### LAND-001: 落地页渲染

| 字段 | 内容 |
|------|------|
| **优先级** | P0 |
| **前置条件** | 已认证，新用户（profile 未初始化） |
| **步骤** | 1. 导航到 `/landing` |
| | 2. 验证 "Anify" 标题可见（参考 `landing.tsx` 第104行） |
| | 3. 验证 "Your adventure awaits" 副标题 |
| | 4. 验证 CharacterCreation 组件可见 |
| **预期结果** | 落地页正确渲染，包含标题、副标题和角色创建表单。有粒子动画背景。 |

---

#### LAND-002: 角色创建 - 输入名称

| 字段 | 内容 |
|------|------|
| **优先级** | P0 |
| **前置条件** | 在落地页 |
| **步骤** | 1. 找到 CharacterCreation 组件中的名称输入框 |
| | 2. 输入角色名称（如 "TestHero"） |
| | 3. 提交表单 |
| **预期结果** | 教程推进到 `chat_intro` 步骤。用户被导航到 `/?mode=chat`。API 调用 `initializePlayer` 和 `updatePlayerProfile` 成功（mock 时验证请求发出）。 |

---

#### LAND-003: 角色创建 - 跳过教程

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 在落地页 |
| **步骤** | 1. 找到并点击 "Skip" 按钮 |
| **预期结果** | 教程标记为完成。用户被导航到 `/`。首页不显示 TutorialOverlay。角色默认名称为 "Adventurer"。 |

---

### Suite 3: 首页/仪表板 (9 cases)

**关键代码文件:**
- `src/routes/index.tsx` — 首页主组件
- `src/contexts/ChatModeContext.tsx` — 聊天模式管理
- `src/components/AppDock.tsx` — 底部导航栏

---

#### HOME-001: 首页渲染 - 普通模式

| 字段 | 内容 |
|------|------|
| **优先级** | P0 |
| **前置条件** | 已认证，教程已完成 |
| **步骤** | 1. 导航到 `/` |
| | 2. 验证角色名称在左侧状态区显示 |
| | 3. 验证等级、好感度、登录连续天数等状态可见 |
| | 4. 验证右侧菜单按钮可见（联系人、换装、场景选择、文字聊天、语音通话） |
| | 5. 验证角色图片/Live2D 区域显示 |
| **预期结果** | 首页所有 UI 元素正确渲染。AppDock 在底部可见。 |

---

#### HOME-002: 进入文字聊天模式

| 字段 | 内容 |
|------|------|
| **优先级** | P0 |
| **前置条件** | 在首页，普通模式 |
| **步骤** | 1. 点击右侧菜单中的 "对话" (MessageCircle) 按钮 |
| | 2. 等待聊天模式激活 |
| **预期结果** | 聊天输入框在底部出现。消息容器变为可见。菜单切换为聊天模式项（语音通话和关闭替代对话按钮）。AppDock 隐藏。 |

---

#### HOME-003: 进入语音模式

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 在首页，普通模式 |
| **步骤** | 1. 点击 "电话" (Phone) 按钮 |
| **预期结果** | 语音模式激活。聊天输入出现。菜单切换为语音模式项。 |

---

#### HOME-004: 退出聊天模式

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 在文字聊天模式 |
| **步骤** | 1. 点击右侧菜单中的 "X" (关闭) 按钮 |
| **预期结果** | 聊天模式关闭。AppDock 重新出现。菜单恢复为普通模式项。 |

---

#### HOME-005: 打开联系人弹窗

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 在首页 |
| **步骤** | 1. 点击 "联系人" (BookUser) 按钮 |
| **预期结果** | ContactsModal 出现。可通过点击关闭按钮或背景关闭。 |

---

#### HOME-006: 打开换装弹窗

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 在首页 |
| **步骤** | 1. 点击 "换装" (Shirt) 按钮 |
| **预期结果** | OutfitModal 出现，显示可用服装列表。 |

---

#### HOME-007: 打开场景弹窗

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 在首页 |
| **步骤** | 1. 点击 "场景选择" (Images) 按钮 |
| **预期结果** | SceneModal 出现，显示可用场景列表。 |

---

#### HOME-008: 聊天消息展开/折叠

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 在文字聊天模式 |
| **步骤** | 1. 验证消息容器默认高度（约 320px） |
| | 2. 点击展开按钮 (ChevronUp) |
| | 3. 验证容器扩展到全高 |
| | 4. 点击折叠按钮 (ChevronDown) |
| | 5. 验证容器恢复默认高度 |
| **预期结果** | 聊天容器在紧凑（320px）和全屏高度之间正确切换。 |

---

#### HOME-009: URL 驱动的聊天模式

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 已认证 |
| **步骤** | 1. 导航到 `/?mode=chat` |
| | 2. 验证文字聊天模式自动激活 |
| | 3. 导航到 `/?mode=voice` |
| | 4. 验证语音模式自动激活 |
| **预期结果** | URL 搜索参数正确触发对应聊天模式。 |

---

### Suite 4: 角色/背包 (5 cases)

**关键代码文件:**
- `src/routes/me.tsx` — Me 页面主组件
- `src/components/me/CharacterTab.tsx` — 角色标签页
- `src/components/me/EquipmentTab.tsx` — 装备标签页
- `src/components/me/GrimoireTab.tsx` — 魔导书标签页
- `src/components/me/AchievementsTab.tsx` — 成就标签页
- `src/components/me/InventoryTab.tsx` — 背包标签页

---

#### ME-001: Me 页面渲染 - 默认状态

| 字段 | 内容 |
|------|------|
| **优先级** | P0 |
| **前置条件** | 已认证 |
| **步骤** | 1. 导航到 `/me` |
| | 2. 验证头部显示角色名称和等级 |
| | 3. 验证返回按钮存在 |
| | 4. 验证显示两个分类标签: "角色" 和 "背包" |
| | 5. 验证默认在 "角色" 分类的 "装备" 子标签 |
| **预期结果** | 页面渲染角色头部信息、标签导航和装备内容。 |

---

#### ME-002: 角色分类标签切换

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 在 `/me` 页面 |
| **步骤** | 1. 验证 "角色" 分类默认激活 |
| | 2. 点击 "属性" 子标签 → 验证内容切换 |
| | 3. 点击 "装备" 子标签 → 验证装备列表 |
| | 4. 点击 "魔导书" 子标签 → 验证技能列表 |
| | 5. 点击 "成就" 子标签 → 验证成就列表 |
| **预期结果** | 每个子标签渲染对应内容。URL 更新为 `?cat=character&tab={tab}`。 |

---

#### ME-003: 背包分类标签切换

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 在 `/me` 页面 |
| **步骤** | 1. 点击 "背包" 分类标签 |
| | 2. 验证子标签变为: 装备、消耗品、材料、其他 |
| | 3. 逐个点击各子标签 |
| **预期结果** | 每个背包子标签渲染对应过滤后的物品。URL 更新为 `?cat=inventory&tab={tab}`。 |

---

#### ME-004: URL 驱动的标签状态

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 已认证 |
| **步骤** | 1. 直接导航到 `/me?cat=inventory&tab=consumable` |
| | 2. 验证 "背包" 分类激活 |
| | 3. 验证 "消耗品" 子标签激活 |
| **预期结果** | 标签状态从 URL 搜索参数正确恢复。 |

---

#### ME-005: 返回导航

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 在 `/me` 页面 |
| **步骤** | 1. 点击返回按钮 (LiquidGlass 中的 ArrowLeft) |
| **预期结果** | 导航回 `/`。 |

---

### Suite 5: 文字冒险 (12 cases)

**关键代码文件:**
- `src/routes/_game/_trpg/adventure.tsx` — 冒险主页面

---

#### ADV-001: 冒险页面渲染

| 字段 | 内容 |
|------|------|
| **优先级** | P0 |
| **前置条件** | 已认证 |
| **步骤** | 1. 导航到 `/adventure` |
| | 2. 验证角色状态栏（HP/MP/SP 进度条）可见 |
| | 3. 验证地点面板存在 |
| | 4. 验证输入框存在，占位符为 "What do you want to do?" |
| | 5. 验证侧边控制栏可见（地图、任务、战斗(禁用)、装备、物品、商店、锻造、首页） |
| **预期结果** | 冒险页面所有 UI 组件正确渲染。初始游戏状态显示默认位置和历史。 |

---

#### ADV-002: 发送动作 - API 集成

| 字段 | 内容 |
|------|------|
| **优先级** | P0 |
| **前置条件** | 在冒险页面，API 已 mock |
| **步骤** | 1. 在输入框输入 "Look around" |
| | 2. 按回车或点击发送按钮 |
| | 3. 等待 API 响应 (mock 返回) |
| **预期结果** | 用户消息以 `>` 前缀出现在历史中。API 调用期间显示加载状态。mock API 返回后，响应出现在历史中。游戏状态更新。 |

---

#### ADV-003: 发送动作 - 错误处理

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 在冒险页面，API mock 返回失败 |
| **步骤** | 1. 输入一个动作 |
| | 2. 提交 |
| **预期结果** | 错误信息 "Error: Failed to send message." 出现在历史中。输入框重新启用。 |

---

#### ADV-004: 侧边栏 - 打开地图面板

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 在冒险页面 |
| **步骤** | 1. 点击地图按钮 (🗺️) |
| **预期结果** | 地图面板通过 `usePanelStore.openPanel('map')` 打开。GamePanel 覆盖层可见。 |

---

#### ADV-005: 侧边栏 - 导航到任务

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 在冒险页面 |
| **步骤** | 1. 点击任务链接 (📋) |
| **预期结果** | 导航到 `/quest`。 |

---

#### ADV-006: 侧边栏 - 打开商店面板

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 在冒险页面 |
| **步骤** | 1. 点击商店按钮 (🛒) |
| **预期结果** | 商店面板以覆盖层形式打开。 |

---

#### ADV-007: 侧边栏 - 打开锻造面板

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 在冒险页面 |
| **步骤** | 1. 点击锻造按钮 (⚒️) |
| **预期结果** | 锻造面板以覆盖层形式打开。 |

---

#### ADV-008: 侧边栏 - 导航到装备

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 在冒险页面 |
| **步骤** | 1. 点击装备按钮 (🛡️) |
| **预期结果** | 导航到 `/me?cat=character&tab=equipment`。 |

---

#### ADV-009: 侧边栏 - 导航到物品

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 在冒险页面 |
| **步骤** | 1. 点击物品按钮 (📦) |
| **预期结果** | 导航到 `/me?cat=inventory&tab=consumable`。 |

---

#### ADV-010: 切换历史面板

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 在冒险页面 |
| **步骤** | 1. 点击历史切换按钮 (📜) |
| | 2. 验证 InputHistory 组件出现 |
| | 3. 再次点击关闭 |
| **预期结果** | 历史面板切换显示/隐藏。 |

---

#### ADV-011: 切换日志面板

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 在冒险页面 |
| **步骤** | 1. 点击日志切换按钮 (⤢) |
| | 2. 验证 LogPanel 组件出现 |
| | 3. 再次点击关闭 |
| **预期结果** | 日志面板切换显示/隐藏。与历史面板互斥。 |

---

#### ADV-012: URL 切换世界

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 已认证 |
| **步骤** | 1. 导航到 `/adventure?world=anthromyth&area=some-area` |
| | 2. 验证世界上下文切换到 "anthromyth" |
| **预期结果** | 世界正确加载。场景背景尝试加载指定区域。 |

---

### Suite 6: 回合制战斗 (8 cases)

**关键代码文件:**
- `src/routes/_game/_trpg/battle.tsx` — 战斗页面

---

#### BTL-001: 战斗页面渲染

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 已认证 |
| **步骤** | 1. 导航到 `/battle` |
| | 2. 验证敌人区域包含 "Enemies" 标题和敌人卡片 |
| | 3. 验证队伍区域包含 "Party" 标题和队员卡片 |
| | 4. 验证动作菜单: 攻击、技能、道具、防御 |
| | 5. 验证战斗日志显示 "Battle Start!" 和 "{name}'s turn" |
| | 6. 验证行动顺序显示 |
| | 7. 验证战斗控制: 暂停、自动战斗、逃跑 |
| **预期结果** | 所有战斗 UI 元素使用 mock 数据正确渲染。 |

---

#### BTL-002: 选择攻击动作

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 在战斗页面 |
| **步骤** | 1. 点击 "Attack" 动作按钮 |
| | 2. 验证攻击按钮变为主要样式 |
| | 3. 点击一个敌人 |
| **预期结果** | 战斗日志显示 "{current_turn.name} attacks {enemy.name}!"。动作重置。 |

---

#### BTL-003: 选择技能动作

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 在战斗页面 |
| **步骤** | 1. 点击 "Skill" 动作按钮 |
| | 2. 验证技能列表面板出现（6个技能） |
| | 3. 点击 "Fireball" 技能 (MP: 30, 单体目标) |
| | 4. 点击一个敌人 |
| **预期结果** | 战斗日志显示 "{name} uses Fireball on {enemy}!"。动作重置。 |

---

#### BTL-004: 技能 - MP 不足

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 在战斗页面，当前角色 MP 较低 |
| **步骤** | 1. 点击 "Skill" |
| | 2. 验证 "Meteor" 技能 (MP: 80) 在 MP < 80 时被禁用 |
| **预期结果** | MP 消耗超过当前 MP 的技能视觉上禁用且不可点击。 |

---

#### BTL-005: 防御动作

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 在战斗页面 |
| **步骤** | 1. 点击 "Defend" |
| **预期结果** | 战斗日志显示 "{name} is defending!"。无需目标选择。 |

---

#### BTL-006: 全体/自身目标技能

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 在战斗页面 |
| **步骤** | 1. 点击 "Skill" |
| | 2. 选择 "War Cry" (增益, 目标: 全体) |
| **预期结果** | 技能立即执行，无需目标选择。日志显示 "{name} uses War Cry!"。 |

---

#### BTL-007: 治疗队友选择

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 在战斗页面 |
| **步骤** | 1. 点击 "Skill" |
| | 2. 选择 "Heal" (目标: 队友) |
| | 3. 点击一个队员 |
| **预期结果** | 队员变为可点击状态（悬停效果）。日志显示 "{name} uses Heal on {ally}!"。 |

---

#### BTL-008: 行动顺序显示

| 字段 | 内容 |
|------|------|
| **优先级** | P3 |
| **前置条件** | 在战斗页面 |
| **步骤** | 1. 验证底部行动顺序条 |
| | 2. 验证第一个战斗者有琥珀色高亮 |
| | 3. 验证敌人显示红色边框、队友显示绿色边框 |
| **预期结果** | 行动顺序按速度正确排序，视觉区分明确。 |

---

### Suite 7: 游戏系统页面 (16 cases)

**关键代码文件:**
- `src/routes/_game/quest.tsx`
- `src/routes/_game/memories.tsx`
- `src/routes/_game/characters.$worldId.tsx`
- `src/routes/_game/_trpg/books.tsx`
- `src/routes/_game/_trpg/abyss.tsx`
- `src/routes/_game/_trpg/reincarnation.tsx`
- `src/routes/_game/town.$townId.tsx`

---

#### QUEST-001: 任务页面渲染

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 已认证，世界数据已加载 |
| **步骤** | 1. 导航到 `/quest` |
| | 2. 验证 "Quest Log" 标题 |
| | 3. 验证 QuestList 组件渲染 |
| | 4. 验证返回链接指向 `/explore` |
| **预期结果** | 任务页面渲染头部和任务列表（来自世界数据）。 |

---

#### QUEST-002: 任务加载状态

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 已认证 |
| **步骤** | 1. 在慢网络条件下导航到 `/quest` |
| **预期结果** | 任务加载期间显示加载旋转图标 (Loader2 动画)。 |

---

#### MEM-001: 记忆页面渲染

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 已认证 |
| **步骤** | 1. 导航到 `/memories` |
| | 2. 验证统计网格: 总数、收藏数、新增数、特殊时刻数 |
| | 3. 验证 MemoryGrid 组件渲染 |
| | 4. 验证 "Back" 头部链接 |
| **预期结果** | 记忆页面显示统计卡片和记忆网格。 |

---

#### MEM-002: 记忆过滤

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 在记忆页面，mock 数据已加载 |
| **步骤** | 1. 切换过滤器到 "conversation" 分类 |
| | 2. 验证只显示对话类记忆 |
| | 3. 切换到 "adventure" 分类 |
| | 4. 验证过滤生效 |
| **预期结果** | MemoryGrid 按分类正确过滤。 |

---

#### MEM-003: 记忆收藏切换

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 在记忆页面 |
| **步骤** | 1. 点击某条记忆的收藏按钮 |
| | 2. 验证统计中收藏数更新 |
| **预期结果** | 记忆收藏状态切换。统计数据响应式更新。 |

---

#### MEM-004: 记忆选择和已读

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 在记忆页面，有未读 (new) 记忆 |
| **步骤** | 1. 点击一条新记忆 |
| | 2. 验证被选中状态 |
| | 3. 验证 `isNew` 标记被清除 |
| **预期结果** | 记忆被选中并标记为已读。 |

---

#### CHAR-001: 角色页面渲染

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 已认证，世界数据已加载 |
| **步骤** | 1. 导航到 `/characters/anthromyth` |
| | 2. 验证角色卡片渲染 |
| | 3. 验证搜索输入框存在 |
| **预期结果** | 角色网格使用世界角色数据填充。 |

---

#### CHAR-002: 角色搜索

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 在角色页面，角色已加载 |
| **步骤** | 1. 在搜索框输入角色名称 |
| | 2. 验证过滤结果 |
| | 3. 清空搜索 |
| | 4. 验证所有角色重新显示 |
| **预期结果** | 搜索按名称、角色和描述过滤。 |

---

#### CHAR-003: 角色聊天导航

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 在角色页面 |
| **步骤** | 1. 点击某角色卡片的聊天按钮 |
| **预期结果** | 导航到 `/phone?characterId={id}&worldId={worldId}`。 |

---

#### BOOKS-001: 书籍页面渲染

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 已认证 |
| **步骤** | 1. 导航到 `/books` |
| | 2. 验证书籍网格显示 mock 书籍 |
| | 3. 验证分类过滤器可用 |
| **预期结果** | 书籍页面渲染书籍卡片，显示标题、作者、阅读进度。 |

---

#### ABYSS-001: 深渊页面渲染

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 已认证 |
| **步骤** | 1. 导航到 `/abyss` |
| | 2. 验证楼层列表显示递进 |
| | 3. 验证已通关/锁定状态 |
| **预期结果** | 深渊楼层渲染正确的通关状态、星星和解锁状态。 |

---

#### REINC-001: 转生页面渲染

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 已认证 |
| **步骤** | 1. 导航到 `/reincarnation` |
| | 2. 验证加成列表渲染 |
| | 3. 验证前世记录区域 |
| **预期结果** | 转生页面显示可用加成和前世历史。 |

---

#### TOWN-001: 城镇页面渲染

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 已认证，世界数据中有城镇数据 |
| **步骤** | 1. 导航到 `/town/{townId}` |
| | 2. 验证城镇名称覆盖层 |
| | 3. 验证 TownMap 组件渲染交互点 |
| **预期结果** | 城镇页面显示背景地图、名称、描述和交互标记。 |

---

#### TIMELINE-001: 时间线页面渲染

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 已认证 |
| **步骤** | 1. 导航到 `/timeline` |
| | 2. 验证时间线列表渲染 |
| | 3. 验证分类过滤和收藏功能可用 |
| **预期结果** | 时间线页面正确渲染记忆/事件列表，过滤器可交互。 |

**关键文件:** `src/routes/_game/timeline.tsx`

---

#### EXPLORE-001: 探索页面基础渲染

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 已认证，世界数据已加载 |
| **步骤** | 1. 导航到 `/explore?area={areaId}&world=official-intro` |
| | 2. 验证 Canvas 元素存在 |
| | 3. 验证区域名称在左上角显示 |
| | 4. 验证 GameDock 在底部出现 |
| **预期结果** | 探索页面加载，Canvas 元素渲染，侧边控制可见。（3D 场景内容由人工测试 MAN-3D-xxx 覆盖） |

**关键文件:** `src/routes/_game/_trpg/explore.tsx`

---

#### TOWN-002: 城镇交互点点击

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 在城镇页面，有交互点 |
| **步骤** | 1. 点击一个交互点 |
| | 2. 验证 SubMapModal 打开 |
| | 3. 关闭弹窗 |
| **预期结果** | SubMapModal 显示交互详情。可正常关闭。 |

---

### Suite 8: 伴侣系统 (6 cases)

**关键代码文件:**
- `src/routes/_game/_companion/phone.tsx`
- `src/routes/_game/_companion/mail.tsx`
- `src/routes/_game/_companion/appraisal.tsx`

---

#### PHONE-001: 手机页面渲染

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 已认证 |
| **步骤** | 1. 导航到 `/phone` |
| | 2. 验证角色头部信息渲染 |
| | 3. 验证消息列表显示 mock 消息 |
| | 4. 验证输入框可用 |
| **预期结果** | 手机聊天界面渲染联系人信息和消息历史。 |

---

#### PHONE-002: 发送消息

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 在手机页面 |
| **步骤** | 1. 在输入框输入消息 |
| | 2. 提交 |
| **预期结果** | 消息出现在聊天中。（响应取决于后端 mock。） |

---

#### MAIL-001: 邮件页面渲染

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 已认证 |
| **步骤** | 1. 导航到 `/mail` |
| | 2. 验证邮件列表显示 mock 邮件 |
| | 3. 验证未读指示器 |
| **预期结果** | 邮件页面渲染邮件项，显示发件人、主题、日期、已读状态。 |

---

#### MAIL-002: 邮件选择和阅读

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 在邮件页面，有未读邮件 |
| **步骤** | 1. 点击一封未读邮件 |
| | 2. 验证内容面板显示完整消息 |
| | 3. 验证附件区域（如有） |
| **预期结果** | 邮件内容正确显示。已读状态更新。 |

---

#### MAIL-003: 邮件领取附件

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 在邮件页面，有含未领取附件的邮件 |
| **步骤** | 1. 选择含附件的邮件 |
| | 2. 点击领取/收集按钮 |
| **预期结果** | 附件被领取。已领取状态更新。 |

---

#### APPR-001: 鉴定页面渲染

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 已认证 |
| **步骤** | 1. 导航到 `/appraisal` |
| | 2. 验证未鉴定物品列表 |
| | 3. 验证物品卡片显示名称、图标、类型、花费 |
| **预期结果** | 鉴定页面渲染物品选择 UI。 |

---

### Suite 9: 面板覆盖系统 (13 cases)

**关键代码文件:**
- `src/stores/panelStore.ts` — PanelType: `shop` | `forge` | `guild` | `residence` | `storage` | `tasks` | `achievements` | `character` | `inventory` | `map`
- `src/components/panels/GamePanel.tsx` — 面板渲染容器
- `src/components/panels/ShopPanel.tsx`
- `src/components/panels/ForgePanel.tsx`
- `src/components/panels/GuildPanel.tsx`
- `src/components/panels/ResidencePanel.tsx`
- `src/components/panels/MapPanel.tsx`
- `src/components/panels/TasksPanel.tsx`
- `src/components/panels/AchievementsPanel.tsx`

---

#### PANEL-001: 商店面板 - 打开和关闭

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 已认证，在有面板访问的页面（如冒险页面） |
| **步骤** | 1. 通过侧边控制栏触发 `openPanel('shop')` |
| | 2. 验证 GameOverlayPanel 出现，包含 ShopPanel |
| | 3. 验证货币显示（金币、宝石、令牌） |
| | 4. 点击背景或关闭按钮 |
| **预期结果** | 商店面板居中打开，背景点击可关闭。 |

---

#### PANEL-002: 商店面板 - 分类过滤

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 商店面板已打开 |
| **步骤** | 1. 验证所有分类: 全部、消耗品、装备、材料、特殊 |
| | 2. 点击 "消耗品" |
| | 3. 验证只显示消耗品类商品 |
| | 4. 点击 "全部" |
| | 5. 验证所有商品重新显示 |
| **预期结果** | 每个分类过滤正确工作。 |

---

#### PANEL-003: 商店面板 - 加入购物车

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 商店面板已打开，有商品 |
| **步骤** | 1. 点击某商品的添加按钮 |
| | 2. 验证购物车更新，显示物品和数量 1 |
| | 3. 再次添加同一商品 |
| | 4. 验证数量增加 |
| **预期结果** | 购物车正确跟踪物品和数量。库存限制被尊重。 |

---

#### PANEL-004: 锻造面板 - 打开

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 已认证 |
| **步骤** | 1. 触发 `openPanel('forge')` |
| | 2. 验证 ForgePanel 渲染配方列表 |
| **预期结果** | 锻造面板打开，显示来自世界数据的制作配方。 |

---

#### PANEL-005: 公会面板 - 打开

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 已认证 |
| **步骤** | 1. 触发 `openPanel('guild')` |
| | 2. 验证 GuildPanel 渲染公会任务 |
| **预期结果** | 公会面板打开，显示来自 `useWorldGuild()` 的任务列表。 |

---

#### PANEL-006: 住所面板 - 打开

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 已认证 |
| **步骤** | 1. 触发 `openPanel('residence')` |
| | 2. 验证 ResidencePanel 渲染标签页（休息、储物、日志） |
| **预期结果** | 住所面板打开，三个标签页可切换。 |

---

#### PANEL-007: 地图面板 - 打开

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 已认证 |
| **步骤** | 1. 触发 `openPanel('map')` |
| | 2. 验证 MapPanel 渲染 |
| | 3. 验证世界地图或区域地图内容 |
| **预期结果** | 地图面板打开，显示导航选项。 |

---

#### PANEL-008: 每日任务面板 - 打开

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 已认证 |
| **步骤** | 1. 触发 `openPanel('tasks')` |
| | 2. 验证 TasksPanel 渲染每日任务 |
| **预期结果** | 任务面板显示来自 `useWorldTasks()` 的任务进度。 |

---

#### PANEL-009: 成就面板 - 打开

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 已认证 |
| **步骤** | 1. 触发 `openPanel('achievements')` |
| | 2. 验证 AchievementsPanel 渲染 |
| **预期结果** | 成就面板显示来自 `useWorldAchievements()` 的成就数据。 |

---

#### PANEL-010: 面板 - 背景点击关闭

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 任意面板已打开 |
| **步骤** | 1. 点击面板外的背景区域 |
| **预期结果** | 面板关闭（`closeOnBackdropClick` 在 GamePanel.tsx 中为 true）。`panelStore.isOpen` 变为 false。 |

---

#### PANEL-011: 仓库面板 - 打开

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 已认证 |
| **步骤** | 1. 触发 `openPanel('storage')` |
| | 2. 验证 StoragePanel 渲染，包含分类过滤和容量显示 |
| | 3. 验证物品列表和详情区域 |
| **预期结果** | 仓库面板打开，显示存储容量和物品列表。 |

---

#### PANEL-012: 角色面板 - 打开

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 已认证 |
| **步骤** | 1. 触发 `openPanel('character')` |
| | 2. 验证 CharacterPanel 渲染角色信息 |
| **预期结果** | 角色面板以覆盖层形式打开（区别于 `/me` 页面的 CharacterTab）。 |

---

#### PANEL-013: 背包面板 - 打开

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 已认证 |
| **步骤** | 1. 触发 `openPanel('inventory')` |
| | 2. 验证 InventoryPanel 渲染，包含物品标签页 |
| | 3. 验证过滤和排序功能可用 |
| **预期结果** | 背包面板打开，显示物品列表和操作（使用/出售/丢弃）。 |

---

### Suite 10: 设置 (6 cases)

**关键代码文件:**
- `src/routes/_user/settings.tsx`
- `src/routes/_user/subscription-plans.tsx`
- `src/routes/_user/token-usage.tsx`
- `src/routes/_user/top-up-tokens.tsx`

---

#### SET-001: 设置页面渲染

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 已认证 |
| **步骤** | 1. 导航到 `/settings` |
| | 2. 验证设置区域列表: 显示、音频、通知、隐私、游戏、开发者、关于 |
| **预期结果** | 设置页面渲染所有区域。 |

---

#### SET-002: 设置开关切换

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 在设置页面 |
| **步骤** | 1. 切换一个布尔设置（如暗色模式、通知） |
| | 2. 验证状态在 settingsStore 中持久化 |
| **预期结果** | 开关更新 zustand store。视觉状态反映变化。 |

---

#### SET-003: 订阅计划页面

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 已认证 |
| **步骤** | 1. 导航到 `/subscription-plans` |
| | 2. 验证三个计划卡片: Starter ($10), Pro ($30), Unlimited ($99) |
| | 3. 验证 "Choose plan" 按钮 |
| | 4. 验证返回链接指向 `/token-usage` |
| **预期结果** | 计划卡片渲染正确定价。 |

---

#### SET-004: Token 用量页面

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 已认证 |
| **步骤** | 1. 导航到 `/token-usage` |
| | 2. 验证用量统计显示 |
| **预期结果** | Token 用量数据渲染（或占位符）。 |

---

#### SET-005: 账户管理页面

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 已认证 |
| **步骤** | 1. 导航到 `/account` |
| | 2. 验证用户信息显示（邮箱、显示名称） |
| | 3. 验证账户安全设置区域可用 |
| **预期结果** | 账户管理页面正确渲染用户个人信息和安全设置。 |

**关键文件:** `src/routes/_user/account.tsx`

---

#### SET-006: Token 充值页面

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **前置条件** | 已认证 |
| **步骤** | 1. 导航到 `/top-up-tokens` |
| | 2. 验证充值套餐选项显示 |
| | 3. 验证支付入口可用 |
| **预期结果** | Token 充值页面渲染套餐选项和支付按钮。 |

**关键文件:** `src/routes/_user/top-up-tokens.tsx`

---

### Suite 11: 教程流程 (3 cases)

**关键代码文件:**
- `src/contexts/TutorialContext.tsx` — 教程状态机
  - 步骤顺序: `landing` → `character_create` → `chat_intro` → `chat_respond` → `voice_transition` → `voice_call` → `equipment_check` → `explore_intro` → `tutorial_complete`
- `src/components/tutorial/TutorialOverlay.tsx` — 教程覆盖层
- `src/routes/__root.tsx` — TUTORIAL_STEP_ROUTES 映射

---

#### TUT-001: 完整教程流程 - 新用户

| 字段 | 内容 |
|------|------|
| **优先级** | P0 |
| **前置条件** | 已认证，新用户（profile 未初始化） |
| **步骤** | 1. 应用加载，验证重定向到 `/landing` |
| | 2. 输入角色名称并提交 |
| | 3. 验证导航到 `/?mode=chat` |
| | 4. 验证教程消息播放 (chat_intro 步骤) |
| | 5. 验证自动推进到 chat_respond 步骤 |
| | 6. 发送一条消息 |
| | 7. 验证推进到 voice_transition 步骤 |
| | 8. 验证语音转换消息播放 |
| | 9. 切换到语音模式（点击语音通话按钮） |
| | 10. 验证推进到 equipment_check 步骤 |
| | 11. 验证导航/提示到 `/me` |
| | 12. 验证自动推进到 explore_intro |
| | 13. 导航到 `/explore` |
| | 14. 验证教程完成覆盖层 |
| **预期结果** | 完整教程流程无错误完成。教程状态持久化到 localStorage。 |

---

#### TUT-002: 教程恢复

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 教程进行中（如在 chat_respond 步骤），用户刷新 |
| **步骤** | 1. 设置教程状态到中间步骤 |
| | 2. 重新加载页面 |
| | 3. 验证后端检查恢复教程步骤 |
| | 4. 验证用户被导航到 TUTORIAL_STEP_ROUTES 对应的正确路由 |
| **预期结果** | 教程从保存的步骤恢复，不会重新开始。 |

---

#### TUT-003: 从落地页跳过教程

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 在落地页 |
| **步骤** | 1. 点击跳过按钮 |
| | 2. 验证教程标记为完成 |
| | 3. 验证导航到 `/` |
| | 4. 验证无 TutorialOverlay 出现 |
| **预期结果** | 教程干净跳过。玩家以默认名称 "Adventurer" 初始化。 |

---

### Suite 12: 世界元数据加载 (2 cases)

**关键代码文件:**
- `src/hooks/useWorldLoader.ts` — 世界加载器（硬编码: `['official-intro', 'anthromyth']`）
- `src/contexts/WorldContext.tsx` — 世界上下文提供者

---

#### WORLD-001: 世界索引加载

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 应用启动 |
| **步骤** | 1. 验证 WorldProvider 加载世界索引 |
| | 2. 验证 `availableWorlds` 包含 "official-intro" 和 "anthromyth" |
| **预期结果** | 世界索引在应用初始化时加载。 |

---

#### WORLD-002: 世界数据加载

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **前置条件** | 已认证 |
| **步骤** | 1. 触发 `loadWorld('official-intro')` |
| | 2. 验证 currentWorld 被填充 |
| | 3. 验证 areas, characters, equipment, items, quests, dialogues, scenes 均已加载 |
| **预期结果** | 完整世界元数据加载成功。所有 getter 函数返回正确数据。 |

---

## 4. 人工测试用例

以下测试用例覆盖难以或无法自动化的功能区域。

### 4.1 3D 场景 / Gaussian Splatting

---

#### MAN-3D-001: Gaussian Splatting 场景渲染

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **测试设备** | Desktop Chrome, Mobile Safari (iOS 15+), Desktop Safari |
| **前置条件** | 已认证，世界数据中有场景数据 |
| **步骤** | 1. 导航到 `/explore?area={areaId}&world=official-intro` |
| | 2. 等待场景加载完成 |
| | 3. 目视验证 3D 场景在 Canvas 中渲染 |
| | 4. 验证场景不是黑屏/空白 |
| | 5. 检查控制台无 WebGL 错误 |
| **预期结果** | Gaussian splatting 场景正确渲染，环境可辨识。 |
| **判定标准** | 场景可见、无明显渲染错误、无控制台 WebGL 错误 |

---

#### MAN-3D-002: 玩家控制器 - WASD 移动

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **测试设备** | Desktop Chrome, Desktop Firefox, Desktop Safari |
| **前置条件** | 在 explore 页面，场景已加载 |
| **步骤** | 1. 按 W 键 → 验证玩家向前移动 |
| | 2. 按 A 键 → 验证玩家向左移动 |
| | 3. 按 S 键 → 验证玩家向后移动 |
| | 4. 按 D 键 → 验证玩家向右移动 |
| | 5. 按空格键 → 验证跳跃 |
| | 6. 方向键 → 验证相同移动行为 |
| **预期结果** | 玩家控制器响应键盘输入。移动流畅。角色保持在墙壁碰撞体内。 |
| **判定标准** | 所有方向移动正常、跳跃正常、无穿墙 |

---

#### MAN-3D-003: 虚拟摇杆 - 移动端

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **测试设备** | iPhone (Safari), Android (Chrome) |
| **前置条件** | 在 explore 页面，移动设备或模拟 |
| **步骤** | 1. 验证虚拟摇杆在屏幕上出现 |
| | 2. 触摸并拖动摇杆到各个方向 |
| | 3. 验证玩家移动方向与摇杆方向一致 |
| | 4. 释放摇杆 |
| | 5. 验证玩家停止 |
| **预期结果** | 虚拟摇杆在触摸设备上提供流畅的方向控制。 |
| **判定标准** | 摇杆可见、响应灵敏、方向准确、释放后停止 |

---

#### MAN-3D-004: 交互点触发

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **测试设备** | Desktop Chrome, Mobile Safari |
| **前置条件** | 在 explore 页面，有交互点 |
| **步骤** | 1. 移动玩家到交互点标记附近 |
| | 2. 验证标记在触发距离内变为可交互状态 |
| | 3. 点击/触摸交互点 |
| | 4. 验证触发相应动作（对话、场景切换、面板打开） |
| **预期结果** | 交互点在正确距离响应。动作正确派发。 |
| **判定标准** | 距离检测正确、点击响应正确、动作执行正确 |

---

#### MAN-3D-005: 墙壁碰撞

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **测试设备** | Desktop Chrome |
| **前置条件** | 在 explore 页面，有墙壁碰撞体 |
| **步骤** | 1. 移动玩家朝墙壁方向移动 |
| | 2. 验证玩家无法穿过墙壁 |
| | 3. 验证玩家沿墙壁平滑滑动 |
| **预期结果** | 物理碰撞阻止穿墙。无卡住状态。 |
| **判定标准** | 不穿墙、沿墙滑动流畅、无卡死 |

---

#### MAN-3D-006: 冒险页面静态 3D 背景

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **测试设备** | Desktop Chrome |
| **前置条件** | 在冒险页面，有场景数据 |
| **步骤** | 1. 导航到 `/adventure?area={areaId}` |
| | 2. 验证静态 3D 背景在 UI 后面渲染 |
| | 3. 验证 UI 元素（输入框、状态栏）在背景上可读 |
| **预期结果** | 静态背景正确渲染。UI 覆盖层清晰可读。 |
| **判定标准** | 背景可见、UI 文字可读、无遮挡 |

---

#### MAN-3D-007: iOS Safari 兼容性 (DecompressionStream polyfill)

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **测试设备** | iOS 15 Safari (真机) |
| **前置条件** | 无 |
| **步骤** | 1. 导航到 explore 页面 |
| | 2. 验证场景正常加载（vite.config.ts 中的 DecompressionStream polyfill 为此所需） |
| | 3. 验证 Safari 控制台无 worker 错误 |
| **预期结果** | 场景在 iOS 15 Safari 上正确加载（得益于 polyfill）。 |
| **判定标准** | 场景加载成功、无控制台错误 |

---

### 4.2 语音/音频

---

#### MAN-VOICE-001: 语音聊天模式激活

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **测试设备** | iPhone (Safari), Android (Chrome) |
| **前置条件** | 在首页 |
| **步骤** | 1. 点击语音通话按钮 |
| | 2. 如在 iOS 13+，验证陀螺仪权限对话框出现 |
| | 3. 授予权限 |
| | 4. 验证语音模式 UI 出现 |
| | 5. 验证麦克风访问提示（如适用） |
| **预期结果** | 语音模式激活。设备权限优雅处理。 |
| **判定标准** | 权限弹窗正确、授权后 UI 切换正确 |

---

#### MAN-VOICE-002: 冒险中语音输入

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **测试设备** | 移动设备 |
| **前置条件** | 在冒险页面 |
| **步骤** | 1. 点击麦克风按钮 (🎤) |
| | 2. 说出一个命令 |
| | 3. 验证语音输入被转录（如已实现） |
| **预期结果** | 语音输入功能正常或占位行为正确。 |
| **判定标准** | 按钮响应、权限处理正确 |

---

### 4.3 视觉/动画

---

#### MAN-VIS-001: 毛玻璃效果

| 字段 | 内容 |
|------|------|
| **优先级** | P3 |
| **测试设备** | Chrome, Safari, Firefox |
| **前置条件** | 在首页或任何有 LiquidGlass 组件的页面 |
| **步骤** | 1. 验证按钮上的毛玻璃（磨砂玻璃）效果 |
| | 2. 验证悬停/交互时的位移和色差效果 |
| | 3. 验证效果在所有目标浏览器上正确渲染 |
| **预期结果** | liquid-glass-react 效果正确渲染。无渲染伪影。 |
| **判定标准** | 效果可见、无闪烁或渲染错误 |

---

#### MAN-VIS-002: Motion 动画流畅度

| 字段 | 内容 |
|------|------|
| **优先级** | P3 |
| **测试设备** | 各浏览器 |
| **前置条件** | 各页面 |
| **步骤** | 1. 导航到落地页 → 验证粒子动画和淡入 |
| | 2. 打开/关闭面板 → 验证 AnimatePresence 过渡 |
| | 3. 在页面间导航 → 验证页面过渡 |
| **预期结果** | framer-motion (motion) 动画流畅。无卡顿。 |
| **判定标准** | 动画平滑、无跳帧、无卡顿 |

---

#### MAN-VIS-003: Loading Screen

| 字段 | 内容 |
|------|------|
| **优先级** | P3 |
| **测试设备** | 各浏览器 |
| **前置条件** | 应用加载中（auth 状态解析中） |
| **步骤** | 1. 在节流网络下加载应用 |
| | 2. 验证 "Loading..." 画面出现 |
| | 3. 验证 auth 解析后过渡到内容 |
| **预期结果** | 加载画面在初始化期间提供视觉反馈。 |
| **判定标准** | 加载画面可见、过渡平滑 |

---

### 4.4 iOS Safari 特定

---

#### MAN-IOS-001: iOS Safari 地址栏适配

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **测试设备** | iPhone iOS 18+ Safari (真机) |
| **前置条件** | 无 |
| **步骤** | 1. 在 Safari 中打开应用 |
| | 2. 验证页面自动滚动以隐藏地址栏（滚动目标约 122px 或 62px） |
| | 3. 验证 `scroll-locked` class 被应用 |
| | 4. 验证 `.app-content` 内的可滚动内容仍然可以滚动 |
| | 5. 聚焦输入框打开键盘 |
| | 6. 关闭键盘 |
| | 7. 验证滚动位置正确恢复 |
| **预期结果** | iOS Safari 透明地址栏被正确管理。键盘开关不破坏布局。 |
| **判定标准** | 地址栏隐藏、布局正确、键盘交互正常 |

---

#### MAN-IOS-002: 触摸滚动防抖

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **测试设备** | iPhone Safari |
| **前置条件** | 无 |
| **步骤** | 1. 尝试滚动页面 body（在可滚动容器外） |
| | 2. 验证滚动被阻止 |
| | 3. 尝试在可滚动容器内（如聊天消息列表）滚动 |
| | 4. 验证内部滚动正常工作 |
| **预期结果** | Body 滚动被锁定。内部可滚动元素正常工作。 |
| **判定标准** | 外部不可滚动、内部可滚动 |

---

### 4.5 响应式设计

---

#### MAN-RESP-001: 移动端布局 - 首页

| 字段 | 内容 |
|------|------|
| **优先级** | P1 |
| **测试设备** | 移动视口 (375px 宽度) |
| **前置条件** | 无 |
| **步骤** | 1. 验证角色图片适应视口 |
| | 2. 验证状态指示器不被截断 |
| | 3. 验证右侧菜单按钮可触达 |
| | 4. 验证 AppDock 在底部正确显示 |
| **预期结果** | 首页适配移动端。所有交互元素可触达。 |
| **判定标准** | 无溢出、元素可点击、布局正确 |

---

#### MAN-RESP-002: 移动端布局 - 战斗

| 字段 | 内容 |
|------|------|
| **优先级** | P2 |
| **测试设备** | 移动视口 (375px 宽度) |
| **前置条件** | 无 |
| **步骤** | 1. 导航到 `/battle` |
| | 2. 验证队员卡片在移动端垂直堆叠 (`grid-cols-1`) |
| | 3. 验证动作按钮可触摸 |
| | 4. 验证技能网格可滚动 |
| **预期结果** | 战斗页面在移动端可用。 |
| **判定标准** | 卡片堆叠正确、按钮可点击、技能可滚动 |

---

#### MAN-RESP-003: 平板布局

| 字段 | 内容 |
|------|------|
| **优先级** | P3 |
| **测试设备** | iPad 视口 (~768px) |
| **前置条件** | 无 |
| **步骤** | 1. 检查所有主要页面的平板布局 |
| | 2. 验证面板覆盖层正确适配 |
| | 3. 验证网格布局适配（如战斗 `grid-cols-3` 在 sm+ 上） |
| **预期结果** | 应用在平板尺寸上显示正确。 |
| **判定标准** | 布局合理、面板不溢出、网格列数正确 |

---

## 5. 跨浏览器/跨设备策略

### 5.1 浏览器矩阵

| 浏览器 | 最低版本 | 优先级 | 自动化方式 | 备注 |
|--------|---------|--------|-----------|------|
| Chrome Desktop | >= 80 | P0 | Playwright Chromium project | 主要开发浏览器 |
| Safari Desktop | >= 14 | P0 | Playwright WebKit project | WebGL、毛玻璃效果验证 |
| Firefox Desktop | >= 78 | P1 | Playwright Firefox project | CSS 兼容性验证 |
| Chrome Mobile (Android) | >= 80 | P1 | Playwright 设备模拟 (Pixel 7) | 触控、视口 |
| Safari Mobile (iOS) | >= 14 | P0 | WebKit 模拟 + 真机人工测试 | iOS 地址栏、陀螺仪、polyfill |
| Safari Mobile (iOS 18+) | >= 26 | P1 | 仅人工测试 | 透明地址栏适配代码 |

### 5.2 设备矩阵 (人工测试)

| 设备 | 操作系统 | 浏览器 | 优先级 | 重点测试区域 |
|------|---------|--------|--------|-------------|
| iPhone 15 Pro | iOS 18 | Safari | P0 | 地址栏适配、虚拟摇杆、3D场景、毛玻璃效果 |
| iPhone 12 | iOS 15 | Safari | P1 | DecompressionStream polyfill、向后兼容 |
| Pixel 7 | Android 14 | Chrome | P1 | 触控、视口、3D场景 |
| iPad Pro | iPadOS 17 | Safari | P2 | 平板布局、3D场景 |
| MacBook | macOS | Chrome + Safari | P0 | 主开发环境 |
| Windows PC | Windows 11 | Chrome | P2 | 跨平台验证 |

### 5.3 Playwright 项目配置

```typescript
// playwright.config.ts 中的 projects 数组
projects: [
  // 桌面浏览器
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  // 移动设备模拟
  { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
  { name: 'mobile-safari', use: { ...devices['iPhone 14'] } },
]
```

---

## 6. CI 集成与执行策略

### 6.1 执行频率

| 层级 | 执行频率 | 浏览器 | 用例范围 | 预计时间 |
|------|---------|--------|---------|---------|
| **P0 Smoke** | 每次 PR | Chrome + WebKit | 11 个 P0 用例 | ~15 分钟 |
| **P1 Core** | 每日构建 | 全部 5 个项目 | P0 + P1 (约 50 个) | ~45 分钟 |
| **P2 Full** | 每周/发布前 | 全部 5 个项目 | P0 + P1 + P2 (约 85 个) | ~2 小时 |
| **P3 Polish** | 大版本前 | 全部 + 人工补充 | 全部 + 人工用例 | ~4 小时 |

### 6.2 P0 Smoke 测试列表

以下 11 个测试构成冒烟测试套件，每次 PR 必须通过:

1. AUTH-001 — 邮箱密码登录正常流程
2. AUTH-002 — 邮箱密码登录错误凭证
3. AUTH-005 — 注册正常流程
4. AUTH-011 — 认证守卫未登录重定向
5. LAND-001 — 落地页渲染
6. LAND-002 — 角色创建输入名称
7. HOME-001 — 首页渲染普通模式
8. HOME-002 — 进入文字聊天模式
9. ME-001 — Me 页面渲染默认状态
10. ADV-001 — 冒险页面渲染
11. TUT-001 — 完整教程流程新用户

### 6.3 GitHub Actions 集成方案

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on:
  pull_request:
    branches: [main, preview]
  schedule:
    - cron: '0 2 * * *'  # 每日 2:00 UTC
  workflow_dispatch:
    inputs:
      test_level:
        description: 'Test level (p0/p1/p2/all)'
        required: false
        default: 'p0'

jobs:
  e2e-smoke:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: npx playwright install --with-deps chromium webkit
      - run: pnpm exec playwright test --grep @p0 --project=chromium --project=webkit
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report-smoke
          path: playwright-report/

  e2e-nightly:
    if: github.event_name == 'schedule' || (github.event_name == 'workflow_dispatch' && github.event.inputs.test_level != 'p0')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: npx playwright install --with-deps
      - run: pnpm exec playwright test --grep "@p0|@p1"
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report-nightly
          path: playwright-report/
```

### 6.4 测试标签约定

在测试代码中使用标签标记优先级，便于 CI 按级别筛选:

```typescript
test('@p0 AUTH-001: 邮箱密码登录正常流程', async ({ page }) => {
  // ...
});

test('@p1 AUTH-003: 邮箱密码登录空字段', async ({ page }) => {
  // ...
});
```

---

## 附录: 测试用例统计

| 类别 | 自动化用例 | 人工用例 | 总计 |
|------|-----------|---------|------|
| 认证流程 | 13 | 0 | 13 |
| 入职引导 | 3 | 0 | 3 |
| 首页/仪表板 | 9 | 0 | 9 |
| 角色/背包 | 5 | 0 | 5 |
| 文字冒险 | 12 | 0 | 12 |
| 回合制战斗 | 8 | 0 | 8 |
| 游戏系统页面 | 16 | 0 | 16 |
| 伴侣系统 | 6 | 0 | 6 |
| 面板覆盖系统 | 13 | 0 | 13 |
| 设置 | 6 | 0 | 6 |
| 教程流程 | 3 | 0 | 3 |
| 世界元数据 | 2 | 0 | 2 |
| 3D 场景 | 0 | 7 | 7 |
| 语音/音频 | 0 | 2 | 2 |
| 视觉/动画 | 0 | 3 | 3 |
| iOS Safari | 0 | 2 | 2 |
| 响应式设计 | 0 | 3 | 3 |
| **总计** | **96** | **17** | **113** |

### 优先级分布

| 优先级 | 自动化 | 人工 | 总计 |
|--------|--------|------|------|
| P0 | 11 | 0 | 11 |
| P1 | 38 | 10 | 48 |
| P2 | 46 | 4 | 50 |
| P3 | 1 | 3 | 4 |
| **总计** | **96** | **17** | **113** |

### 备注

- `src/routes/_test/` 下的 11 个开发测试路由（auth-test, chat-test, game-data-test 等）为内部开发工具，不纳入 E2E 测试范围
- `src/routes/gauss-splatting.tsx` 为独立 3D 演示页面，建议后续考虑添加基础渲染冒烟测试
