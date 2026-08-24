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

---

## 2026-08-21

### 第一部分：验证10天前旧pitch

按规则重新读了本文件全部历史记录：`已发出`的邮件只有一条（8/16 `info@thelawnturflaying.co.uk`），发送日期在10天验证窗口（2026-08-11之前）之外；8/4、8/9两轮均未实际发出任何邮件（都是"跳过"结论）。**没有符合"发送日期在2026-08-11之前"条件的记录，第一部分按规则跳过。**

### 第二部分：新断链置换机会

先读`src/data/tools.ts`确认当前真实工具清单：站点已从上轮（8/16，30个工具）扩到**约45个工具**，新增覆盖Real Estate（prorated-rent-calculator）、Food & Drink（keg-calculator）、Text Tools（glitch-text-generator/small-text-generator/sentence-counter/wingdings-translator）等新分类，以及Construction新增asphalt-calculator/topsoil-calculator/conduit-fill-calculator/rounding-calculator。

**WebSearch定向搜索**（6次，覆盖electrical/landscaping/homebrewing/property-management/asphalt/board-foot六个新工具方向）：结果与8/16遗留笔记预判一致——全部召回的是竞品计算器工具站本身（southwire/conduit-fill-calculator.com/asphapro/boardcalculate等）或大型内容站，**没有一次命中真正的第三方资源合集/链接列表页**，追加两轮（elementary teacher/homeschool/libguides construction/apartment tenant/homebrewing roundup/electrician apprenticeship方向）同样零命中。判定WebSearch通用查询法对这批新工具方向系统性失效，不再重复投入。

**1.5竞品外链缺口分析**（延续8/16方法，本轮扩大样本）：用`dataforseo_query.py backlinks`对omnicalculator.com/inchcalculator.com各拉150条`--mode one_per_domain`外链明细，逐条核对`url_from`+`url_to`+`anchor`；另外对calculator.net（此前两轮未查过）首次拉取100条`one_per_domain`外链明细。按"只链1-2个竞品+真实编辑判断"标准筛选出20个候选资源页，主题分布：Topsoil Calculator对应5个（rainbowgardens.biz/garden-center、dirtcheep.ca、southlandlawns.com/soil-calculator、redigreen.net/soil-blend-yardage-calculator、mrmulchmrtopsoil.com/mulch-calculator——均为独立土壤/景观供应商主页或专页，非大站）、Concrete Calculator对应12个（bluestarredimix、cornerstonedfw、teaguerental、carryduffconcrete、talonconagg、whistleredimix、dbrmx、dumpstermaxx、bwreadymix、concretepumping.ie、centralmixconcrete、kwikmix——均为独立预拌混凝土/搅拌站公司主页，calculator.net外链画像里这类小型建材公司占比明显高于大媒体/大平台，是本轮最主要的候选来源）、Fraction Calculator对应2个（pivotordie.com/how-to-read-a-tape-measure、statisticshowto.com/how-to-calculate-odds-of-winning——后者是8/16遗留的"高置信度但暂不可达"目标，本轮再次尝试）、Rounding Calculator对应1个（dr-aart.nl/Arithmetic-rounding-off.html，锚文本"significant figures calculator"，跟CalcBadger新上线的rounding-calculator主题相符）。排除的候选：caseystoneco.com/midillinoisquarry.com/youngssandandgravel.com（石料/砂石供应商链的是limestone/gravel材料计算器，跟Topsoil Calculator的"soil-texture密度预设"范围不符，判定硬凑跳过）、veransa.com/mudcontrolgrids.com（mulch/tile计算器，无对应工具）、triplejinc.com（landscaping公司但候选页是contact-us页，资源页价值弱，跳过）。

**死链批量扫描**：把20个候选资源页写入`candidates.txt`，跑`broken_link_scan.py --file candidates.txt --timeout 15 --workers 12`。结果：14个页面成功抓取（0 DEAD、1 SOFT即`whistleredimix.com`站内Yelp链接403，不计），6个页面因SSL握手失败（`urlopen error EOF...`）或403被脚本判定"资源页本身抓取失败"（`dirtcheep.ca`/`cornerstonedfw.com`/`pivotordie.com`/`dr-aart.nl`/`teaguerental.com`/`centralmixconcrete.com`）；**用curl+浏览器UA独立复核`dirtcheep.ca`（返回200）和`cornerstonedfw.com`（返回406，WAF拦截）**，证实这6个"抓取失败"是脚本urllib在本沙箱对部分站点TLS/UA的假阴性，不是网站真的不可达——但这也意味着这6个页面本轮**未能核实出站链接**，不能排除有真实死链，只是本次工具链条件下拿不到证据。

在成功抓取的14个页面里，发现2条技术意义上的DEAD链接：
1. `www.dbrmx.com/order-now` 页面上的一个`href`本身就是一段未编码的地址字符串（`https://3777 Westminster Dr, London, ON N6E 3Y3`），DNS解析失败——这是对方页面自己的编码bug（大概率是想链Google Maps但漏加`https://maps.google.com/?q=`前缀），不是指向任何计算器/资源的链接，**跟CalcBadger任何工具都不构成主题对应，放弃**。
2. `concretepumping.ie` 页面上的`http://www.klasikthemes.com`死链——核实是WordPress主题版权/致谢链接（页脚"Powered by"类型），指向已下架的主题商店，**跟混凝土计算器毫无主题关联，硬性规则4/5双重不满足，放弃**。

**本轮结论：20个候选资源页里0个产出可发送的断链置换机会**——两条真实DEAD链接均因主题不对应被主动放弃，符合硬性规则2/4（不能硬凑）。未触发规则7-9的邮件撰写/复核/发送流程（没有草稿产生）。

### 遗留待办（供下次运行参考）

1. **6个SSL握手失败的候选页**（`dirtcheep.ca`/`cornerstonedfw.com`/`pivotordie.com`/`dr-aart.nl`/`teaguerental.com`/`centralmixconcrete.com`）实际可访问（curl验证），下轮若要复用同一批候选，`broken_link_scan.py`需要换更宽容的TLS/UA配置重试，或改用curl逐条探测出站链接，本次未做（时间/范围限制）。
2. `statisticshowto.com/how-to-calculate-odds-of-winning/`连续两轮（8/16、8/21）均因Cloudflare挑战页/403拿不到内容，**已确认不是死链问题而是访问受限问题**，是否值得继续追（该页锚文本直接对应CalcBadger Fraction Calculator）留给下轮判断是否值得上浏览器工具核实，或直接放弃转向其他候选。
3. Real Estate/Food & Drink/Text Tools三个较新分类（prorated-rent-calculator/keg-calculator/glitch-text-generator等）本轮WebSearch和竞品缺口分析均未找到任何候选资源页（竞品外链画像里没有覆盖这些细分主题的小型独立站），下次可尝试换更细分的竞品（如`steadily.com`房产测算工具、`brewersfriend.com`酿造计算器）反查外链，而非继续用宽泛关键词WebSearch。
4. Concrete Calculator候选资源池明显比其他工具丰富（calculator.net外链画像里独立预拌混凝土公司占比高），但本轮14个成功抓取的页面出站链接数普遍很少（多数1-2条，且多是自己的社交媒体/联系页），命中率低是样本本身链接密度低导致，不是候选质量问题——下次同类"公司主页"型候选，可以改抓该公司网站下的"服务页/关于我们页"而非纯首页，出站链接数可能更多。

---

## 2026-08-24（第五次运行）

### 第一部分：验证10天前旧pitch

按本轮任务说明，上层会话已统一处理：CalcBadger唯一发出的邮件在8/16（`info@thelawnturflaying.co.uk`），距今仅8天，不满10天验证窗口，本次运行不重复验证。

### 第二部分：新断链置换机会

先读`src/data/tools.ts`确认当前真实工具清单：站点已从上轮（8/21，约45个工具）扩到**57个工具**，14个分类（Construction/Conversion/Date & Time/Education/Finance/Food & Drink/Games/Health/Home Improvement/Math/Real Estate/Reference/Science/Text Tools）。

**遗留待办1：6个SSL握手失败候选页重新抓取**——用browser UA（Chrome 126 on macOS）+curl（非Python urllib）逐个重试`dirtcheep.ca`/`cornerstonedfw.com`/`pivotordie.com/how-to-read-a-tape-measure`/`dr-aart.nl/Arithmetic-rounding-off.html`/`teaguerental.com`/`centralmixconcrete.com`：
- 5个恢复200正常访问（`centralmixconcrete.com`本次是`curl: (60) SSL certificate problem: certificate has expired`——这是该站**自己域名证书过期**，不是出站链接死链问题，跟我们的置换机会无关，标记放弃跟踪）。
- 对5个可访问页面逐个提取出站链接（跳过站内链接）：`dirtcheep.ca`（3条：aweditycreative本地建站商、Facebook、inchcalculator soil-calculator）、`cornerstonedfw.com`（0条外部链接，页面本身无出站资源链接）、`pivotordie.com`（2条：Akismet隐私政策、inchcalculator inch-fraction-calculator）、`dr-aart.nl`（1条：omnicalculator sig-fig）、`teaguerental.com`（6条：calculator.net concrete-calculator、Facebook、2条Google Maps地址、2条Thryv隐私/条款页）。**全部存活，0条死链**——这5个页面链的都是活的竞品计算器工具或纯品牌/地图/政策页，本轮确认这条carryover线索彻底关闭，不再是可挖掘方向。

**遗留待办2：`statisticshowto.com/how-to-calculate-odds-of-winning/`第三次尝试**——`curl -A "Chrome/126..." -L` 仍返回`HTTP 403`（Cloudflare拦截）。连续三轮（8/16、8/21、8/24）均无法用curl访问，判定本沙箱工具链下这个目标不可持续追踪，**本轮起放弃**，不再列入下轮遗留待办。

**遗留待办3：Real Estate/Food & Drink/Text Tools三个新分类的竞品反查**——按建议方向用`dataforseo_query.py backlinks`查了两个新竞品域名：

- `steadily.com`（房产测算工具，主打landlord/rental）：`--mode one_per_domain --limit 120`拉取（引荐域名总数3198，样本4%）未直接命中`prorat`关键词（one_per_domain模式按域名最高权重页采样，未必包含目标细分页）。改用**页面级精确查询**（`backlinks`命令`target`参数支持完整URL）直接查steadily.com站内已确认存在的对应页`/blog/prorated-rent-calculator-everything-you-need-to-know`（`--mode as_is --limit 50`），命中全部4条外链，全部命中CalcBadger的Prorated Rent Calculator：
  - `councilbluffspropertymanagementinc.com/blog/how-do-you-calculate-prorated-rent-in-council-bluffs-ia`——curl 200存活，但`datePublished`/`dateModified`均为2025-01-22，超过12个月未更新（站点sitemap显示其他页面2026-03仍在更新，站点本身非僵尸，但**这篇具体文章**不满足硬性规则3"近12个月有真实更新迹象"）。
  - `righthousepm.com/blog/how-do-you-calculate-prorated-rent-in-orlando-fl`——curl 200存活，`datePublished`/`dateModified`均为2025-01-28，同样超过12个月，同样理由不满足。
  - `creatingrealestatesolutions.com/blog/figuring-out-a-prorated-rent-calculator-move-out/`——curl 200存活，`dateModified`2025-02-18，超过12个月，不满足。
  - `cashforhousesfl.com/blog/the-importance-of-prorated-rent-calculator-move-out/`——**curl返回404，页面已不存在**，链接来源页本身已消失，无法联系。
  - 另外，前两个标题格式"How Do You Calculate Prorated Rent in [City] [State]"高度疑似同一物业管理加盟网络（Property Management Inc系）按城市换词的模板化内容，即使时间不过期也可能因内容非本地编辑控制、难以获得真正的编辑响应而降低命中率。**四个候选全部放弃**：3个因硬性规则3的12个月更新窗口不满足，1个因目标页已404无法联系。
- `brewersfriend.com`（自酿啤酒工具站）：`--mode one_per_domain --limit 150`。命中的keg相关外链（keg-carbonation-calculator、CO2 line length等）全部是**精细的自酿工艺技术计算器**（麦芽糖化、酵母接种率、CO2管路压力），跟CalcBadger的`keg-calculator`（读`src/lib/kegCalculator.ts`确认：算的是聚会用桶的"能倒多少杯/需要几桶"，面向party planning而非自酿工艺）功能定位不同，**不构成主题对应，硬性规则2排除**。

**顺带发现：Pool Calculator候选**（非本轮主动搜索目标，是复用8/16/8/21已缓存的omnicalculator/inchcalculator外链JSON做关键词扫描时命中）：读`src/lib/pool.ts`确认CalcBadger的Pool Calculator同时算泳池体积（加仑）和盐氯化投放量（ppm），理论上能对应两类候选，但逐一核实：
  - `clarkespoolwater.net/water-chart.html`（inchcalculator pool-volume-calculator）——Weebly建站，页面近乎空白（仅"Water Chart"标题+1条外链+Weebly版权信息），无发布/更新日期证据，无法核实活跃度，且无法定位联系邮箱，跳过。
  - `cashblog.com/cost-of-maintaining-a-pool/`（inchcalculator pool-volume-calculator，锚文本"pool volume calculator"）——`dateModified: 2022-12-26`，接近4年未更新，明显不满足硬性规则3，跳过。
  - `forgedbysalt.com/saltwater-pools-how-much-salt/`（omnicalculator pool-salt）——`dateModified: 2025-07-09`，超过12个月（约13.5个月）；且该竞品链接是**Omni Calculator官方embed组件**（`<div class="omni-calculator">`嵌入widget+品牌角标），不是普通文字超链接，置换难度和验证标准都更高。判定不满足硬性规则3，跳过。

### 本轮结论

**0封邮件发出，`outreach-drafts.md`未修改。** 本轮系统性验证了3条上轮遗留线索（SSL重试候选、statisticshowto.com、Real Estate/Food & Drink/Text Tools新方向），并追加发现Pool Calculator候选3个：
- SSL重试候选：5个页面确认无死链，该方向确认关闭。
- statisticshowto.com：三次尝试均被Cloudflare拦截，本轮起放弃追踪。
- 竞品反查新方向：用页面级精确查询成功定位到steadily.com的prorated-rent-calculator对应页的4条外链（此前one_per_domain抽样方法未能命中，本轮验证"按已知竞品具体页面URL做`--mode as_is`精确查询"比泛域名抽样更有效，可作为下轮方法论沉淀），但4个候选全部因12个月更新窗口不满足（3个）或目标页已404（1个）被放弃；brewersfriend.com方向因功能定位不匹配（工艺技术vs聚会用量）被排除。
- Pool Calculator 3个候选：均因更新时间超过12个月或内容/联系方式门槛不满足被放弃。

### 遗留待办（供下次运行参考）

1. **方法论沉淀**：反查已知竞品的"具体功能页URL"（`--mode as_is --limit 50`）比泛域名`one_per_domain`抽样更容易命中细分主题的真实候选（本轮steadily.com案例4/4命中主题相关，虽然最终都因时效性被放弃）。下轮可对inchcalculator/omnicalculator/calculator.net也用同样方法精确查询CalcBadger对应的细分工具页（如inchcalculator的keg/pizza/gpa类页面，若存在的话），而非只做泛域名抽样。
2. Real Estate/Food & Drink/Text Tools三个分类**连续三轮（8/16、8/21、8/24）竞品反查/WebSearch均未产出可发送候选**，本轮虽首次找到4个主题精确匹配的候选但全部因时效性/页面消失被放弃——说明这个细分领域存在真实候选但普遍时效性差（多为2025年初的一次性文章，未持续更新），下轮如果继续投入这三个分类，建议直接放宽到"发布未满12个月"的更新竞品博客（如查询发布日期在2025-09之后的prorated rent/keg/text tool相关文章），而非依赖外链数据反查（外链数据本身有滞后性，热文章的外链需要时间积累，新文章反而外链少查不到）。
3. Text Tools分类（glitch-text-generator/small-text-generator/sentence-counter/wingdings-translator）**四轮以来完全没有找到任何候选**，竞品（omnicalculator/inchcalculator/calculator.net）本身可能都不覆盖这类文本工具，导致反查外链天然没有信号——下轮建议换成直接反查专做文本工具的竞品（如`lingojam.com`、`fontvilla.com`等文本生成器站）的外链，而非继续套用施工/理财类竞品的方法论。
4. `centralmixconcrete.com`（8/21候选之一）本轮确认SSL证书已过期，这是它自己域名的问题，不是我们的置换机会，下轮无需再重试这个域名。
