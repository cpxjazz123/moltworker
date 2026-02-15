# 测试用最简 Dockerfile - 验证 Cloudflare Sandbox 基础功能
# 如果这个镜像也不能工作，问题可能在账户配置或 Cloudflare 服务端
# Build trigger: 2026-02-15-rebuild
FROM docker.io/cloudflare/sandbox:0.7.2

# 不添加任何自定义内容，只使用官方基础镜像
# 构建后通过 wrangler tail 检查是否有 "Version retrieved: 0.7.2" 日志
# 如果有，说明基础镜像正常，问题在自定义层
# 如果没有，说明是账户或服务配置问题
# Build trigger: 2026-02-15-225504
# Build: 1771156707
# Build: 1771157306
