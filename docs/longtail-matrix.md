# Farflung Clues 长尾关键词矩阵与页面规划（2026-11-12）

数据来源：webcafe 关键词库（farflung 两份记录、krillion 系横向证据）、farflung.game SERP 竞品页标题挖掘（10-22 / 11-01 / 11-09 三次抓取）。

## 1. 库内事实

- `farflung` ×5.30 高位（11-09"值得做"）；`farflung game` ×1.37（10-22"不值得做"——play 意图已饱和）。
- **farflung 自身长尾在库内为 0 个内页候选**——空白即机会，但需求需用横向证据验证。
- SERP 竞品页标题已暴露的真实长尾：`farflung unlimited`（wordleverse.net、wordleunlimited.io、farflunggame.com 三个站都在做）、`farflung geography game`、`daily map quiz`。

## 2. 横向证据（krillion 系同模式词的库内结论）

| 模式词（krillion 侧） | 库内结论 | 迁移到 farflung 的判断 |
|---|---|---|
| `krillion unlimited` ×6.92 | 可以试试（做内页）；SERP 全是小站内页 | **farflung unlimited 同样有量**：3 个竞品已在做，但都是泛游戏站内页，我们的专题页相关度更高 |
| `games like krillion` ×0.875 | **值得做**（新站首页）；SERP #1 是 alldle.net 合集页 | `games like farflung` 完全空白，我们的 `/farflung-unlimited/` 已有雏形，需升级为真合集页 |
| `the endless dive game`（krillion 无限模式名）×0.454 | 可以试试 | farflung 无限模式上线时第一时间建页（官方已承诺） |
| krillion reset time / answers today / hints | krillionclues 的核心页面模式 | farflung 侧我们已覆盖 reset-time / hints / archive |
| `krillion game` ×8.38 Breakout | 值得做 | `farflung game` 已饱和（结论"不值得做"）——不要做 |

## 3. 长尾矩阵（按优先级）

### P0 — 已覆盖，保持每日更新（流量基本盘）
| 长尾 | 页面 | 状态 |
|---|---|---|
| farflung answers today / farflung answer today | `/` + `/archive/<date>/` | ✅ 每日自动新增 |
| farflung hints / farflung clues | `/hints/` | ✅ |
| farflung archive / farflung past answers | `/archive/` | ✅ |
| farflung how to play | `/how-to-play/` | ✅ |
| farflung reset time / when does farflung reset | `/farflung-reset-time/` | ✅（"本地午夜"是差异点，竞品没写清） |
| farflung tiers / farflung scoring / farflung rarity | `/tiers/` | ✅ |
| farflung unlimited / farflung practice / farflung endless | `/farflung-unlimited/` | ✅ 骨架已有，见 P1 升级 |

### P1 — 新页面（证据充分，立即做）
| 长尾 | 规划页面 | 依据 |
|---|---|---|
| `games like farflung` / `farflung alternatives` / `daily geography games` | `/games-like-farflung/` 合集页 | krillion 同模式词"值得做"；SERP 合集页（alldle、dailydles）流量验证；我们作为 farflung 站做这个合集有天然相关度 |
| `farflung practice` / `practice farflung online` | `/farflung-practice/`（并入或分拆 unlimited 页） | krillion practice/endless 模式有独立量；我们已收集 38 天题库，可做真实的"盲玩练习"引导 |
| `farflung plus` / `farflung subscription` / `is farflung plus worth it` | `/farflung-plus/` 评测页 | 官方有 Plus 订阅（bundle 里有 checkout/archive/ads 逻辑）；krillion 侧 "$5 subscription worth it" 出现在 SERP，证明付费讨论有搜索量 |
| `farflung streak` / `farflung stats` | 挂在 how-to-play 或独立小节 | 官方有 streak 机制；竞品未覆盖 |

### P2 — 内容扩展（长青内页，逐周做）
| 长尾方向 | 页面规划 |
|---|---|
| `farflung tips` / `farflung strategy` / `how to get farflung (rare answers)` | `/tips/`：按稀有度档位给找 gem 的方法论（岛屿/微国家/飞地），用我们 38 天数据举例 |
| `farflung gems` / `farflung rare answers list` | `/gems/`：每日 farflung 档答案精选（自带剧透门槛） |
| `farflung vs [竞品]`（vs Worldle / Globle / Tradle） | `/vs-worldle/` 等对比页：地理 daily 游戏横评，竞品词借力 |
| `farflung compass` / expedition / prompt 机制词 | 并入 how-to-play 扩展节 |
| `farflung classroom`（官方 SERP 出现教室场景 Facebook 帖） | `/teachers/`：教师/课堂使用指南——官方社区有真实需求信号 |

### P3 — 观察哨（等信号出现再做）
| 词 | 触发条件 |
|---|---|
| `farflung app` / `farflung mobile` | 官方 FAQ 说计划出 app——上线即建页 |
| `farflung redeal` / `farflung corrected` | bundle 里有 redeal 机制（index.json 的 redeal 字段），用户面词汇出现时建页 |
| `farflung answers [月]`（如 farflung answers november） | archive 量起来后按月做归档索引页 |
| `one in a farflung`（对齐 krillion 的 one in a krillion ×1.02） | 社区出现该说法时跟进 |

## 4. 不要做的

- `farflung game` / `farflung online` / `play farflung`：play 意图被官网+10 个仿站锁死（库内 17-18/20 精确匹配），结论"不值得做"。只在页面正文自然提及，不做专项页面。
- 任何伪装官方的页面/措辞：官方 FAQ 明确切割，保持 non-official 标注。

## 5. 内容节奏建议

- 每天（自动）：+1 个 archive 日期页（SEO 页面数随天数线性增长）。
- 本周：P1 的 games-like-farflung + farflung-plus 两页（每个页面 800-1200 词）。
- 每周 1-2 篇 P2 内页，优先 tips（复用已有数据举例，边际成本最低）。
- GSC 提交 sitemap 后，用 krillion 项目同款 gsc-request-indexing 脚本对重点页面手动请求收录。
