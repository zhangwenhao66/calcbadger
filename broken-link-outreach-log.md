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

---

## 2026-08-16

### 起点

先读`src/data/tools.ts`确认当前真实工具清单：站点已从上轮（2026-08-09，16个工具）扩到**30个工具**——新增Calorie、World Clock、Tip、GPA、Reaction Time、Cursive Alphabet、Fraction、Time Duration、Greek Alphabet、Shape Volume、Yes-or-No Wheel、Steps-to-Miles、Math Symbols、Minecraft Circle Generator、Board Foot、Random Letter，覆盖Finance/Home Improvement/Construction/Education/Science/Health/Games/Conversion/Math/Date & Time/Reference十一个分类。工具面显著扩大，为本轮竞品缺口分析提供了更多可能的功能对应点（Fraction Calculator、Board Foot Calculator是新增的关键匹配点）。本轮OpenSEO的MCP工具不可用，全程改用`独立站/research-db/dataforseo_query.py`直连脚本。

### 1.5 竞品外链缺口分析

**方法**：用`dataforseo_query.py domain`查omnicalculator.com/inchcalculator.com/calculator.net三家外链概览（引荐域名分别27,067/15,296/23,792个），再用`dataforseo_query.py backlinks`拉omnicalculator.com和inchcalculator.com各100条最新外链明细（`--limit 100`），逐条核对`domain_from`+`url_from`+`url_to`+`anchor`，按"只链1-2个竞品页面（非几乎所有竞品都链）+真实编辑推荐/功能性引导，非付费/私人关系/一次性PR/纯品牌规模"的标准筛选。

**omnicalculator.com 100条外链明细**：绝大多数来源是DR 100-700的大型/超大型站点（space.com、harvard.edu、medicalnewstoday.com、krebsonsecurity.com等），链接自然来自omni本身内容深度和媒体曝光，CalcBadger体量差距过大难以复刻，非本轮可赢目标。发现两条潜在的功能对应点：
- `percentagecalculator.info`（链markup+percentage两个页面）——排查后发现这本身就是Omni Calculator公司自己的白标/嵌入域名（页面署名Mateusz Mucha即Omni CEO），不是真实第三方站点，**判定为不可赢类别（品牌自有资产），跳过**。
- `statisticshowto.com`（链simplify-fractions，锚文本"online calculator"，出现在"How to Calculate Odds of Winning"文章正文中）——大型权威统计教育站（Stephanie Glen创办），真实编辑引用，功能对应CalcBadger的Fraction Calculator（新上线工具）。**Cloudflare挑战页拦截curl（403 "Just a moment..."），联系页同样被拦，WebSearch也未能找到公开邮箱，本轮判定为"高置信度但暂不可达"，留待下轮用浏览器工具核实。**

**inchcalculator.com 100条外链明细**：命中率明显更高——大量来源是小型施工/园艺/健康类独立站（DR 0-280不等），单独链接inchcalculator某一个具体计算器页面，符合"真实编辑判断"筛选标准。逐条核对source page（用JSON里的`url_from`而非只看domain）后确认4个强候选：

| 来源站 | 链接的inchcalculator页面 | 对应CalcBadger工具 | 核实结果 |
|---|---|---|---|
| `www.thelawnturflaying.co.uk`（英国草坪铺设公司，报价表单页） | area-calculator | Square Footage Calculator | ✅ curl确认200存活+锚文本"Area Calculator"，页面真实营业地址+电话；找到邮箱`info@thelawnturflaying.co.uk` |
| `www.timsturf.com`（美国草皮/木屑经销商，TPI铺草指南页） | square-footage-calculator | Square Footage Calculator | ✅ curl确认200存活内容真实（TPI铺草步骤指南），但仅有Squarespace联系表单，curl拿不到邮箱 |
| `www.woodlogger.com`（木工爱好者博客，"Woodworker Reference"专区，2012年至今，56K+ FB粉丝） | board-footage-calculator | Board Foot Calculator（新上线工具） | ✅ curl确认200存活，是独立的Reference子页面（非临时博文），但仅有联系表单，curl+WebSearch均未找到公开邮箱 |
| `freeweightlosspodcast.com`（健康类博客，5篇不同文章重复链同一calorie-calculator） | calorie-calculator | Calorie Calculator | ⚠️同一目标在5篇不同文章重复出现，疑似站内侧边栏/模块化插入而非逐篇编辑判断，且未查到邮箱，本轮不追加，降低置信度 |
| `weightlossliquefier.com`（体重管理博客，calorie-calculator文章） | calorie-calculator | Calorie Calculator | ⚠️内容质量存疑（通用化健康建议文风），YMYL领域+目标是嵌入式widget非纯链接，替换门槛更高，本轮跳过 |

**本轮实际发出**：仅`thelawnturflaying.co.uk`一个目标有确认邮箱且核实充分，其余3个强候选（timsturf.com、woodlogger.com、statisticshowto.com）受限于Cloudflare挑战页/JS渲染联系表单，本沙箱的curl拿不到邮箱或联系表单填写能力，留到下轮用Browser pane处理。

### 1-5 断链检查：Mortgage/Concrete/Percentage/Date Calculator定向搜索

按上轮遗留建议，用更窄长尾词搜索（真实房产经纪人个人博客、施工小承包商"useful links"页、家庭教育资源页、婚礼/项目管理资源页等）：

- "real estate agent blog helpful links mortgage calculator resource page"
- "concrete contractor website useful links concrete calculator resources"
- "wedding planner blog helpful tools date calculator countdown resources"
- "project management blog resource page date calculator tools list"
- "site:libguides.com mortgage calculator resources real estate"
- "small business start-up resource page concrete calculator OR board foot calculator links"
- "homeschool math resource page percentage calculator links list"
- "event planning checklist blog countdown calculator OR date calculator resource links"

**结果**：全部8次搜索返回的都是竞品计算器站本身（omnicalculator/calculator.net/calcsummit/economylumberco等工具站）或大型商业内容站（Bankrate/NerdWallet/TheKnot/DigitalPM），没有一次搜到真正的第三方"资源合集页"或个人博客链接列表。这跟上轮（8/9）遗留笔记里"personal finance tools/home improvement calculators会被大站淹没"的预判一致——即使换成更窄的长尾词，WebSearch这类通用查询对这四个新工具方向依然系统性地召回竞品站而非真实候选页，**判定该方向短期内不值得用同样的搜索式方法重复尝试**。

### 处理结果

- **1.5竞品缺口分析**：调研2个竞品域名共约200条外链明细，筛选出4个高置信度目标（thelawnturflaying.co.uk / timsturf.com / woodlogger.com / statisticshowto.com），排除1个自有资产误判（percentagecalculator.info）、2个低置信度目标（freeweightlosspodcast.com模块化插入疑似、weightlossliquefier.com内容质量存疑）。
- **实际发送**：1封。收件人`info@thelawnturflaying.co.uk`，独立agent复核APPROVED（六项检查全过），Message ID `1a0093cdbdaa9a26`，From头`contact@calcbadger.com`（`--from calcbadger`）。邮件按"竞品缺口类目标"框架撰写：第一段客观描述发现对方页面的功能性引导+CalcBadger对应工具的能力，第二段给出链接+embed选项，未使用断链话术（该链接本身未失效）。
- **1-5断链检查**：Mortgage/Concrete/Percentage/Date Calculator四个新工具方向本轮再次未找到候选资源页（8次定向长尾搜索全部被竞品站/大站淹没），无失效链接可核查。

### 遗留待办（供下次运行参考）

1. **`timsturf.com`、`woodlogger.com`、`statisticshowto.com`三个高置信度目标**——功能对应确认（分别对应Square Footage/Board Foot/Fraction Calculator），但联系方式受限（Squarespace表单/JS表单/Cloudflare挑战页），curl拿不到邮箱。下次运行建议用Browser pane（非curl）打开这三个页面的联系表单直接填写提交（邮箱字段用`contact@calcbadger.com`），或用浏览器人工核实是否有隐藏邮箱。
2. Mortgage/Concrete/Percentage/Date Calculator四个方向的资源合集页搜索**已连续两轮（8/9、8/16）用不同关键词均未命中**，短期内不建议再用通用WebSearch长尾词方法重复尝试；下次可考虑换成`dataforseo_query.py backlinks`反查更多细分竞品（如dinkytown.net的mortgage calculator、omnicalculator的concrete-column等）的引荐域名，复用本轮1.5的方法而非泛搜索。
3. `freeweightlosspodcast.com`（5篇文章重复链同一calorie-calculator，疑似站内模块）如果下轮想追查，需先用浏览器确认该链接是否为侧边栏工具箱模块（会显著降低"真实编辑推荐"权重）还是逐篇正文引用。
