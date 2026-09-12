# CalcBadger — SERP-ranked outreach log

This file is specific to the `serp-ranked-outreach` task (SERP-verified target selection: search the target keyword, see who Google actually ranks, filter by real content-quality gates). Kept separate from `broken-link-outreach-log.md` and `outreach-drafts.md` (guest-post-outreach) by design, so the three targeting logics' conversion rates can be compared independently.

Fields per entry: date, target keyword, target type, target URL, contact method, AI review result, send status, 10-day verification result.

CalcBadger is one of the two sites (with DialWick) under the 2026-09-04 "capacity concentration" rule's fixed rotating slot. This is the first run in which `serp-ranked-outreach` specifically has given CalcBadger its fixed slot.

---

## 2026-09-12 — BarrierBoss (barrierbossusa.com)

| 字段 | 内容 |
|---|---|
| 日期 | 2026-09-12 |
| 目标关键词 | `how many bags of concrete for a fence post`（真实DataForSEO SERP查询；本次是CalcBadger固定优先名额，角度是嵌入组件主动投放，非站内GSC striking-distance词） |
| 目标类型 | 内容文章（嵌入报价） |
| 目标 URL | https://barrierbossusa.com/blogs/news/how-much-concrete-per-fence-post |
| 目标性质 | BarrierBoss，围栏制造商/电商站的博客，作者署名"Barrier Bob"（品牌人格，非真实姓名） |
| 质量门槛 | ✅ `dateModified` 2026-09-01（11天前），正文确实在回答该关键词的搜索意图 |
| 具体缺口 | 文章标题写"Step-by-Step Calculator"但正文只是静态文字演算（1个算例：10英寸直径、30英寸深→约3袋），文章内`<article>`范围内无`<input>`/`<iframe>`实际交互工具（站内导航栏"Fence Calculator"是另一个围栏定价工具，与本文无关） |
| 贡献物 | https://calcbadger.com/concrete-calculator/ 及可嵌入版 https://calcbadger.com/embed/concrete-calculator/ （用同一套0.375 ft³/50磅袋、QUIKRETE 3倍直径规则数据，与目标文章自己引用的数字完全一致） |
| 联系方式 | 邮件 orders@barrierbossusa.com（站内唯一公开邮箱，/pages/contact-us、/pages/about-us、页脚均确认） |
| AI 复核 | ✅ 可以发送（独立复核agent逐条核实：正文确实只有1个算例且无嵌入工具；CalcBadger自家数字与tools.ts一致；两个工具URL均200；查重干净） |
| 发送状态 | ✅ 已发送 2026-09-12（Gmail msg `1a095db9ce686bc2`；已回读投递From头确认为`CalcBadger <contact@calcbadger.com>`） |
| 10天后验证 | ⏳ 待 2026-09-22 之后回查（目标页面是否真的加上嵌入工具或链接 + `dataforseo_query.py backlinks calcbadger.com` 确认dofollow） |

### 本次运行累计记账（外链记账纪律，2026-08-25起硬性）

| 指标 | 数值 |
|---|---|
| 累计已发送 | 1 |
| 累计已验证到手（dofollow） | 0（本轮首次发送，未到10天验证窗口） |
| 转化率 | 待验证（首次运行，n=1，10天后才有第一个数据点） |
