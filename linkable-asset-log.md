# CalcBadger — Linkable Asset Log

## 2026-08-18 — Formula & Standards Source Index

**做了什么**：把 backlog 第 3 条「Formula & Standards Source Index」做成了真正发布的页面，不是占位表格。

页面：https://calcbadger.com/formula-standards-index/

- 新建 `src/lib/sourceIndex.ts`：从 `tools.ts` 的 38 个计算器、132 条 `sources` 字段动态提取全部引用，按域名分类到四个来源类型（Government & regulatory agency / International standards body / Peer-reviewed research / Reference work or industry source），手工核对每个域名归类（如 `www.nist.gov`→Government、`www.bipm.org`→International standards body、`doi.org`→Peer-reviewed research、`en.wikipedia.org`→Reference work）。分类逻辑是纯函数，不是写死的静态数据，站内每新增一个工具/来源，这个页面和 CSV 会在下次构建时自动纳入，不需要手动维护。
- 页面统计全部由 Astro frontmatter 在构建时从 `tools` 数组实时计算（`totalTools`/`totalSources`/`totalDomains`/`primaryCount`/`primaryPct`），不是写死的数字，避免了"文字描述的统计数字会随站点增长而过时变成编造"的风险。
- 硬性规格执行：`coreSummary`位置的头条数字是**"38 个计算器引用 132 个来源，覆盖 66 个不同域名；其中 76 条（58%）来自政府机构、国际标准组织或同行评审研究，而非二手转述网站"**；页面底部有「Cite this」引用格式块（含发布日期+最后编译日期+URL）+ 全部 132 行数据的 CSV 下载（`/data/formula-standards-sources.csv`，同样由 `src/pages/data/formula-standards-sources.csv.ts` 这个 Astro 端点在构建时从 `tools.ts` 实时生成，不是手工导出的静态快照）。
- 内链：38 篇工具页的「Sources & standards」区块底部各加一句指回新索引页的链接（`Every calculator's sources, in one place: Formula & Standards Source Index.`）；全站页脚导航加了一个「Sources」入口。
- 单元测试 `tests/sourceIndex.test.ts`（7 项）：验证提取的行数与 `tools.ts` 实际来源总数一致、每个来源域名都能落到四个已知分类之一（不会静默 fallback 到未分类）、CSV 输出行数正确、CSV 对含逗号字段正确加引号转义。`npm test` 全站 43 个测试文件、835 项测试全过。

**去AI味检查**：先过 `Skill(humanizer)` 自查发现"rather than a regulated number"与"In short"框里的"rather than a secondhand explainer site"两处"rather than"句式在相邻段落重复，已把后一处改成"None of them set a regulated number."两个独立分句；除此之外正文（intro段、In short统计句、四段"What counts as each type"定义）判定为已经干净，无 em/en dash、无 AI 高频词、无排比三连、无空洞强调词。再过 `Skill(avoid-ai-writing)` 复核同一批文本，判定无 P0/P1 问题，仅记录一条 P2 观察（四段类型定义均以"[类型名] covers..."开头，判定为词典式并列定义的合理重复，不是填充词，未改）。

**验证**：`npm run build` 通过，94 个页面全部生成，`/formula-standards-index/index.html` 与 `/data/formula-standards-sources.csv`（133 行，含表头）均在 `dist/` 里确认生成。本地起 `astro preview` 用 Browser pane 实测：首页渲染正确、"In short"统计句与手算结果一致（132/38/66/76/58%）、38 个计算器按分类分组列出全部 132 条来源+类型徽章、CSV 下载 200 且 `Content-Type: text/csv`、页脚新增「Sources」链接、`bmi-calculator` 等工具页底部新增的反向链接正常渲染，全程 0 console error。**本页非交互工具（无计算逻辑，只是数据索引/合集页），按 SKILL.md 规则不需要额外的"部署后真实操作交互"验证步骤**，走的是原创数据研究/合集页标准流程。

**backlog 状态**：#3 已标记 `[已发布]`。

### 第2步：未加链接提及回收

WebSearch（`"calcbadger.com" -site:calcbadger.com`、`"CalcBadger" calculator formula source`）均未找到任何提及 calcbadger.com 但未加链接的第三方内容，站点 2026-08-02 才建，属预期内的空结果。

### 第3步：新资产主动 pitch

搜索"如何被 ChatGPT/AI Overviews 引用"相关近期内容，找到 MaxAEO Blog《Interactive Tools and AI Citations: Why Calculators Earn Durable Mentions》（`https://maxaeo.ai/blog/interactive-tools-ai-citations/`，署名 Chris Han，2026 年 7 月发布），核心论点是"可解释、站得住的透明公式比黑箱更容易被 AI 搜索引用"，与本次新资产（把 132 条来源引用整理成可摘引、可下载的索引页）直接相关。联系方式核实：`curl` 抓取 `https://maxaeo.ai/contact/` 确认 `nancy@maxaeo.ai` 是页面上明确列出的"Sales and partnerships"具名联系渠道（非纯 Contact Us 表单），公司主体 HIII PTE. LTD.。

### 第3.5步：主动投放到发现平台

评估后判定本次资产（一个引用来源索引/合集页）不适合投 Show HN——它对本站运营有 GEO/外链价值，但对"不认识 CalcBadger 的技术受众"缺乏独立可玩性/新颖性（不是一个交互工具，是站内引用的整理表），硬投大概率被判定营销性质而沉底或被 flag，不符合 SKILL.md"不要为了投一下硬凑"的要求，本轮跳过。也未找到与"计算器透明度/引用索引"这个细分主题真实相关、允许分享外部资源的非 Reddit 专业社区，本轮无投放。

### 第4步：去AI味 + 独立复核

pitch 邮件过 `Skill(humanizer)` + `Skill(avoid-ai-writing)` 后判定已经干净，存入 `outreach-drafts.md`。独立复核 agent（全新实例）核实：查重（`gmail_send.py` 全账号范围 `to:nancy@maxaeo.ai` 与 `maxaeo.ai` 均为空）、邮件里"132 sources across 38 calculators"等数字与线上页面实测一致、CSV 端点 200 存活、Chris Han 文章原文确实包含邮件引用的核心论点、`nancy@maxaeo.ai` 确系 MaxAEO 联系页真实列出的渠道、语气非模板化无 AI 写作痕迹。

（复核与发送结果见下方"运行小结"。）
