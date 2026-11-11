# Farflung 关键词数据分析与建站决策（2026-11-11）

数据来源：webcafe-keyword-sync 每日关键词库（`dailyReport/20261022 ~ 20261111`），farflung 官方站点与前端 bundle 实测。

## 1. 关键词全景

| 词 | 首次出现 | 热度变化 | 最新结论（库内） |
|---|---|---|---|
| `farflung game` | 2026-10-08 | ×1.37（10-22） | 不值得做：官网+仿站占满首页 |
| `farflung` | 2026-10-16 | ×6.09（11-01）→ ×5.30（11-09，近7天+1%） | **值得做**（11-09）：GPTs×5.3 超阈值；#1 是 2026-10 注册的新站，证明新站可竞争 |
| 库内长尾 | — | 0 个内页候选 | 长尾空白，需自行派生 |

**关键判断**：主词是品牌词，"play"意图被官网（farflung.game，2026-10-01 注册）和仿站（farflunggame.com/.net、farflung.online、playlin.io、wordleverse.net 等 17/20 精确匹配）占据。**但 SERP 里没有任何"answers / hints / reset time / unlimited"意图的结果** —— 这正是 Krillion Clues 验证过的 companion 空位。

## 2. 自派生长尾矩阵（站内页面映射）

| 长尾 | 意图 | 对应页面 |
|---|---|---|
| farflung answers today | 今日答案 | `/`（首屏）+ `/archive/<date>/` |
| farflung hints / clues | 无剧透提示 | `/hints/` |
| farflung archive / past answers | 历史答案 | `/archive/` |
| farflung unlimited | 无限模式（官方 FAQ 明确"not yet"） | `/farflung-unlimited/` |
| farflung reset time / when does farflung reset | 重置时间 | `/farflung-reset-time/` |
| farflung tiers / scoring / rarity | 计分规则 | `/tiers/` + `/how-to-play/` |
| farflung how to play | 规则 | `/how-to-play/` |
| farflung practice | 练习 | `/farflung-unlimited/` 内 |

## 3. 游戏事实（实测官方数据）

- 每日 **5 题**，世界地图插针答国家；答案分 5 档稀有度：tourist(Common) / traveller(Uncommon) / wayfarer(Rare) / uncharted(Elusive) / farflung(最稀有)；未命中=lost。
- **每日重置：本地时间午夜**（官方 FAQ 原文 "At midnight, your local time"）——与 Krillion 的固定 05:00 UTC 不同，倒计时必须按用户本地时钟做（客户端 JS）。
- 题库为静态文件 `days/1/<date>.json`（base64 + XOR `farflung: no peeking` 混淆），可解码；index 文件会**预先列出到 2026-11-16 的未来日期**——采集器必须硬性过滤未来日期，绝不提前发布答案。
- 档案免费回看仅限最近 7 天，更早需官方 Plus（订阅）——官方自己就是订阅模式（$5 讨论）。
- 无官方答案 API；社区：r/farflung、@playfarflung。

## 4. 竞争与风险

- 竞品全是 "play" 页（10 月新站竞速），**无人做 companion 内容** → 先发优势窗口存在，但需要尽快上线并保持每日更新。
- 官方对第三方站态度：FAQ 明言"非官方站的 prompts、answers、rulings 不是我们的"。答案列表我们采用**点击揭示 + 派生摘要**（对齐 krillionclues 模式），README/Footer 明示非官方 + 许可未确认 + 接受 takedown。
- 数据许可：官方题库无再分发授权，商业化前建议联系 hello@farflung.game 确认。

## 5. 期望内容模型（站点 = 每日数据驱动的订阅型内容）

1. **每日自动更新**（GitHub Actions 23:30 UTC 采集 + 校验 + 提交 + 触发部署）→ 内容每天自动增长，符合"订阅站"回访逻辑。
2. **首屏 hint-first**：答案数/首字母集合/最常见答案字数——不泄露答案，SEO 可收录，玩家可用。
3. **档案页即长尾落地页**：`/archive/<date>/` 每天新增 1 个收录页，46 页起量并持续增长。
4. **Evergreen 三件套**：unlimited / reset-time / tiers 承接稳定搜索意图，无时效性衰减。
5. **订阅化路径**（后续）：邮件每日提示信 → streak 工具 → 与 krillionclues 合并为 Daily Games Hub。

## 6. 结论

farflung 是当前库内 `farflung` 主词 ×5.3 高位、SERP companion 空白、官方数据管线可自动化、且官方自身订阅化验证了付费意愿的最佳标的。以 krillion-companion 产品模式复刻，数据侧比 krillion 更简单（静态日文件 vs 官方 API），维护成本低。
