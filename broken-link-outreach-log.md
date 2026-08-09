# CalcBadger 断链置换外链日志

`trafficsite-broken-link-building` 定时任务的执行记录。

---

## 2026-08-04（首次运行）

### 检查过的资源页

| 资源页 | 外链数 | 真实失效 |
|---|---|---|
| https://npc.libguides.com/mathematics-guide/online-resources （Northland Pioneer College, Mathematics Online Resources） | 22 | 0 |
| https://guides.stlcc.edu/math/websites （St. Louis Community College, Mathematics Websites） | 33 | 0 |
| https://libguides.brooklyn.cuny.edu/c.php?g=512836&p=3586908 （Brooklyn College, Tools & Calculators） | 11 | **2** |
| https://pgcc.libguides.com/math/webresources （Prince George's Community College, Internet Resources） | 11 | 0 |

合计核查 77 条外链。

### 发现的真实失效链接

均在 Brooklyn College 的 "Tools & Calculators" 页上：

1. **https://www.microsoft.com/en-us/download/details.aspx?id=17786** —— 真实 404（`Error 404 - Not Found`），锚文本 "Microsoft Mathematics 4.0"。微软已下架该下载页
2. **http://integrals.wolfram.com/index.jsp?...** —— 真实 404（`404 Not Found`），锚文本 "Wolfram Mathematica: Online Integrator"。该子站已退役

### 处理结果

**本站本次跳过，未发出任何邮件。**

原因：两条失效链接指向的都是**符号代数运算工具**——Microsoft Mathematics 是分步求解代数/三角/微积分方程的桌面软件，Wolfram Online Integrator 是符号积分器。CalcBadger 目前上线的 8 个工具是 CD 复利、面积（square footage）、楼梯、SAT 分数、摩尔浓度、BMI、抛硬币、温度换算，**没有任何代数求解器或积分器**。拿面积计算器去顶替一个符号积分器属于硬性原则 2 明确禁止的硬凑，如实放弃。

### 排除的误报

`403` 若干（Cloudflare/WAF 拦 curl）、`0`（沙箱网络）均不计为失效，沿用 FactCrumbs/WarCrumbs 首次运行总结的口径：**本沙箱里只有干净的 404、或"200 但落地是占位页/域名出售页"才算证据**。

另：`https://www.geogebra.org/?lang=en` 被脚本标为疑似 soft-404，人工复核后确认是页面正文里恰好含 "page not found" 字样的正常页面，**不是失效链接**。

### 遗留待办

数学类 libguides 收录的是 Desmos/GeoGebra/Khan Academy 这类**大型平台**，跟 CalcBadger 的单一用途计算器不是一个层级，即使有断链也难匹配。下次换方向：找家装/施工类的 "useful links" 页（对应 square footage、stair 两个工具）、或化学教师个人站的资源页（对应 molarity），这类页面链接腐烂率更高且收的就是单一用途工具。本次已试过搜索施工类资源页，返回的全是竞品计算器站本身（omnicalculator/inchcalculator 等），不是资源合集页，未能形成候选。

---

## 2026-08-09

### 起点

先读 `src/data/tools.ts` 确认当前真实工具清单：站点已从上次（2026-08-04，8 个工具）扩到 **16 个工具**——CD、Square Footage、Stair、SAT Score、Molarity、BMI、Coin Flip、Temperature、Length、Weight、Mortgage、Time、Concrete、Percentage、Volume、Date Calculator，覆盖 Finance/Home Improvement/Construction/Education/Science/Health/Games/Conversion/Math/Date & Time 十个分类。本轮按遗留建议方向重新搜索。

### 检查过的资源页（约 20+ 个，合计核查外链 150+ 条）

| 资源页 | 方向 | 结果 |
|---|---|---|
| `cnu.libguides.com/e-ref/tools`（Christopher Newport University, E-Reference Tools） | 通用计算器/参考工具合集 | 2 条真 404/失效（见下），但都是货币换算器类，CalcBadger 无对应工具 |
| `hfhs-hf233.libguides.com/library_resources`（Homewood-Flossmoor HS） | 综合图书馆资源 | 外链几乎全是数据库登录页（Gale/EBSCO），无计算器类目标 |
| `readysetresearch.libguides.com/math` | 数学资源 | 1 条疑似失效（NCTM Illuminations，见下），但 403 来自 Cloudflare 挑战页非可靠证据，且主题泛化不对应任何计算器 |
| `mr-ku.com/links-and-resources/teaching-chemistry-links`（个人教师 Google Sites） | 化学教师链接页 | 内容明显是 2013 年代遗留页面，未逐条核实（判断价值低，未再深挖） |
| `ferris.libguides.com`（financial calculators + loans 两页）、`sfcollege.libguides.com/personal-finance/websites`、`coloradocollege.libguides.com`（financial literacy） | 个人理财资源 | 检查约 35 条外链，仅 `navigatingyourfinancialfuture.org` 连接超时（非干净 404，判定不计） |
| `jefferson.kctcs.libguides.com/money/buyingahouse`（买房指南，直接对应 mortgage 计算器） | 房贷/购房资源 | 外链（dinkytown.net/mortgage、forbes.com、listenmoneymatters.com）全部存活 |
| `redwoods.libguides.com`、`national.libguides.com`、`bsu.libguides.com`、`resources.nu.edu`、`ocean.libguides.com`、`libguides.lib.msu.edu`（统计/概率资源，对应 Coin Flip 概率计算器） | 概率统计资源 | 约 40 条外链检查，全部存活 |
| `ashland.extension.wisc.edu/families-finances/financial/`（威斯康星大学推广办公室理财教育页） | 理财教育 | **1 条确认死链**：`choosetosave.org/ballpark`（见下），但主题是退休储蓄测算表，CalcBadger 无退休计算器 |
| `sfa.ufl.edu/resources/calculators`、`financialliteracy.psu.edu/resources`、`researchguides.cpcc.edu`（理财素养资源） | 理财教育 | 约 60 条外链检查，全部存活 |
| `rockstarmathteacher.blogspot.com`（个人数学教师博客） | 教学资源 | 外链均为博客站内页/图片，无外部计算器类目标 |
| `libguides.gptc.edu`、`redwoods.libguides.com/construction-trades`、`southeast.kctc.libguides.com`、`libguides.olympic.edu`、`durhamtech.libguides.com`、`cccc.libguides.com`（建筑/木工类图书馆资源，对应 Stair/Concrete 计算器） | 施工/木工资源 | 约 30 条外链检查（多为行业协会官网 AGC/NAHB/ASA/木工协会等），全部存活，且这类链接本身就不是"计算器"性质，即使失效也不构成合理置换 |
| `mathtothe7thpower.blogspot.com/p/links-to-resources.html` | 数学教师链接页 | 被 Google 反爬虫拦截（302 到 google.com/sorry），无法核实，放弃 |

### 发现的真实/疑似失效链接及处理

1. **`http://www.oanda.com/channels/products/products.shtml`**（CNU 页面，锚文本 "Oanada Currency Converter"）—— 干净 404。**CalcBadger 无货币换算器工具，跳过。**
2. **`https://www.itools.com/`**（CNU 页面，锚文本 "iTools"）—— 沙箱内连接异常（`000`），不满足"干净 404"标准，且该工具本身也是货币/通用工具聚合站，非单一计算器，即使确认死链也难对应，未继续追查。
3. **`http://www.choosetosave.org/ballpark/`**（威斯康星推广办公室页面，锚文本 "Ballpark Estimate"，退休储蓄测算表）—— **确认死链**：不止沙箱内连接失败，用 `dns.google` 公共 DNS 独立核实，`choosetosave.org` 的权威域名服务器返回 "lame delegation / REFUSED"，即该域名的 DNS 委派本身已损坏，不是沙箱网络问题，是真实生产环境不可达。但该资源是退休规划工具，CalcBadger 现有 16 个工具里最接近的是 CD Calculator（存款到期测算），性质不同（一个是"退休需要存多少钱"的长期规划工具，一个是"这笔存款到期值多少钱"的确定性计算），拿 CD 计算器顶替属于硬凑，**放弃**。
4. **`http://illuminations.nctm.org/`**（readysetresearch 页面，通用链接无锚文本细节）—— curl 返回 Cloudflare "Attention Required" 403 挑战页，不满足"干净 404"标准（历史教训：403/WAF 拦截不计为失效），且该链接就算失效，指向的是 NCTM 课程资源合集，不是计算器，**跳过**。

### 处理结果

**本次仍未形成任何待发送草稿，`outreach-drafts.md` 未修改。**

原因：本轮系统性核查了理财教育/统计概率/施工木工/化学教师四个方向共 20+ 个资源合集页、150+ 条外链，命中的失效链接（choosetosave.org 退休测算表、oanda 货币换算器）均不对应 CalcBadger 现有工具，符合硬性原则第 2 条（不能硬凑）主动放弃。这类图书馆 LibGuides 页面普遍由在职馆员定期维护，链接存活率明显高于普通博客/论坛资源页，是本次低命中率的主要原因。

### 遗留待办（供下次运行参考）

- 已系统排查的四个方向（理财/统计/施工/化学）短期内不建议重复搜索同一批 LibGuides，命中率已证明很低。
- `mathtothe7thpower.blogspot.com` 等 Blogspot 页面会被 Google 反爬虫拦截 curl 请求（302 到 `google.com/sorry`），下次需要用浏览器工具（Claude in Chrome / Browser pane）而非 curl 核实，不能直接判定为不可用。
- CalcBadger 新增的 Mortgage、Concrete、Percentage、Date Calculator 四个工具本次尚未找到对应主题的资源合集页做定向搜索（本次搜索结果多次被大型平台如 Bankrate/NerdWallet/Calculator.net 淹没，未找到中小型、非竞品的资源列表页）。下次可尝试更窄的长尾词，如具体地区的房产经纪人个人博客、具体品类的项目管理/活动策划小博客，避开"personal finance tools""home improvement calculators"这类会被大站占满结果页的宽泛搜索词。
- `choosetosave.org` 的死链（DNS lame delegation，已用 dns.google 独立验证）如果 CalcBadger 未来上线退休储蓄类计算器，可回头用这条线索去 `ashland.extension.wisc.edu/families-finances/financial/` 页面 pitch。
