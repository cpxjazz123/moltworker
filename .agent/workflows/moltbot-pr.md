---
description: Moltbot-pr
---

# Moltbot 部署与运维指南 (Cloudflare Sandbox)

## 1. Git 私人仓库保护
避免将代码误推送到主仓库：
1. 重命名远程源：
```bash
git remote rename origin upstream
git remote add origin git@github.com:您的用户名/moltworker.git
```
2. 确认当前分支仅指向推送私人仓库。
3. 忽略 GitHub 网页端向 `cloudflare/moltworker` 发起的 PR 建议。