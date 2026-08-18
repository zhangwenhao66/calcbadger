# CalcBadger — Guest Post / Outreach Email Drafts

追加记录，不覆盖。每条记录起草日期、收件渠道、状态（发送前/已发送/复核未通过）。

## 2026-08-04 — Math Sharpeners (pro@Mathsharpeners.com)

- 来源：2026-08-04首次outreach调研起草，同日处理积压并发送
- 渠道核实：`https://mathsharpeners.com/write-for-us/` 2026-08-04 curl复核HTTP 200，页面正文确认`pro@Mathsharpeners.com`仍是选题投稿邮箱，流程未变（先邮件提案选题获批，再投.doc全文，要求原创1000字+，允许contextual non-promotional dofollow链接）
- 已过`Skill(humanizer)`去AI味
- 独立复核结果：APPROVED（全新独立agent，五项检查全过）
- 发送状态：已发送 2026-08-04，Message ID 19fcb785e15c9300，From头核实为`CalcBadger <contact@calcbadger.com>`
- 邮件正文：

```
Subject: Guest post topic idea for Mathsharpeners

Hi,

I run CalcBadger (calcbadger.com), a small site with free calculators for school and everyday math questions. I'd like to pitch a topic before writing anything.

Working title: "Free Online Tools That Make Homework and Test Prep Easier"

The idea is a roundup for students and parents on which free calculator tools actually save time on homework and test prep, and how to use them without just copying an answer. I'd pull two examples from our own site: an SAT Score Calculator built on College Board's official raw-to-scaled conversion table for Practice Test #4, and a Molarity Calculator that walks through the mass/molar-mass/volume relationship from chemistry class. The article would stay general, not a pitch for our tools, and any link back would be contextual, in line with your guidelines on non-promotional links.

Open to a different angle if this one doesn't fit what you're running right now. Let me know if it's worth turning into a full draft.

Thanks,
Owen Zhang
CalcBadger
```

## 2026-08-04 — Ranch Roofing (ranchroof@gmail.com)

- 来源：2026-08-04首次outreach调研起草，同日处理积压并发送
- 渠道核实：`https://ranchroofing.com/blog/best-home-improvement-websites/` 2026-08-04 curl复核HTTP 200，页面正文确认征集网站提交依然有效，收件邮箱`ranchroof@gmail.com`未变，仅需网站名+URL+简介，非敏感信息
- 已过`Skill(humanizer)`去AI味
- 独立复核结果：APPROVED（全新独立agent，五项检查全过，确认收件人为站主Bob O'Sullivan本人）
- 发送状态：已发送 2026-08-04，Message ID 19fcb786d59de619，From头核实为`CalcBadger <contact@calcbadger.com>`
- 邮件正文：

```
Subject: Suggestion for your Best Home Improvement Websites list

Hi Bob,

I came across your "25 Best Home Improvement Websites" post and saw you're taking suggestions. I'd like to submit CalcBadger.

Website: CalcBadger
URL: https://calcbadger.com
Short description: Free calculators for home and construction projects. Two of the more useful ones are a Square Footage Calculator (room area, unit conversions, flooring waste estimates) and a Stair Calculator (riser/tread layout checked against IRC code limits) for figuring out stair cuts before buying lumber.

Let me know if you need anything else.

Thanks,
Owen Zhang
CalcBadger
```

## 2026-08-06 — Ask a Tech Teacher (askatechteacher@gmail.com)

- 来源：2026-08-06本轮新研究，resource-roundup定向搜索命中
- 渠道核实：`https://askatechteacher.com/websites-for-chemistry/`（"17 Websites for Chemistry"）2026-08-06 curl复核HTTP 200，页面正文确认列表内已有一条"Online Toolkit — science calculators and reference tools"条目，说明该榜单本身就收录计算器类工具，且页面标注"Click here for updates to this list"（榜单仍在维护）。作者Jacqui Murray为真实教育科技从业者（K-18技术教学30年，多本教材编者），Contact Me页确认真实联系邮箱`askatechteacher@gmail.com`。非付费栏目（"Advertise with AATT"是独立的广告位，未在本次pitch中涉及）。
- 事实核对：Molarity Calculator（`https://calcbadger.com/molarity-calculator/`）与`src/data/tools.ts`一致，真实已上线工具，链接308重定向至带斜杠版本确认200
- 已过`Skill(humanizer)`去AI味（草稿原本已基本干净，无破折号/AI高频词/三连排比/填充语）
- 查重：`gmail_send.py list --query "to:askatechteacher@gmail.com"` 全账号范围返回空，guest-post-outreach.json历史记录中无此渠道
- 独立复核结果：见guest-post-outreach.json本条记录
- 邮件正文：

```
Subject: Addition for your "17 Websites for Chemistry" list

Hi Jacqui,

I came across your "17 Websites for Chemistry" post and noticed you already point teachers to an "Online Toolkit" entry for science calculators. I run CalcBadger (calcbadger.com), a small site of free calculators, and we have a Molarity Calculator that might fit alongside it.

It walks through the mass, molar mass, and volume relationship (moles = mass / molar mass, then molarity = moles / volume), so students can check their work step by step instead of just getting a final number. Here's the link if you want to take a look: https://calcbadger.com/molarity-calculator/

No pressure either way, just thought it was worth flagging given the list already covers this kind of tool.

Thanks for keeping the list updated,
Owen Zhang
CalcBadger
```

## 2026-08-16 — The Lawn Turf Laying Co. (info@thelawnturflaying.co.uk)

- 来源：trafficsite-broken-link-building本轮1.5竞品外链缺口分析——查inchcalculator.com外链明细（DataForSEO backlinks，100条快照），发现`www.thelawnturflaying.co.uk`的"Get a Quote"表单页(`https://www.thelawnturflaying.co.uk/get-a-quote-for-turf-laying-fitting-garden-turf/`)在"如果不确定怎么算面积"处提示"you can use this online calculator: Area Calculator"，链接到`inchcalculator.com/area-calculator/`。这条链接目前仍存活（非断链），归类为竞品缺口类目标，不是断链置换。
- 目标筛选依据：该域名在inchcalculator 100条外链快照里只出现这一次（只链1个竞品页面，非"几乎所有竞品都链"的规模化模式），是英国本地草坪铺设公司自己的报价表单页里一句真实的功能性引导（"如果你不确定怎么算面积可以用这个在线计算器"），不是roundup型收录页，但符合"引用竞品数据/工具的真实文章+编辑推荐"类可赢类别；已用curl核实该页面200存活、内容非过期占位页（Moorhouse Rd, Oxted, Surrey真实营业地址+电话+开业时间）。
- 事实核对：CalcBadger的Square Footage Calculator（`https://calcbadger.com/square-footage-calculator/`，curl核实200）与`src/data/tools.ts`一致，公式（矩形/L形拆分/圆形/三角形面积+英制转公制换算，1 sq ft = 0.09290304 m²精确值来自NIST SP811）有对应单元测试`tests/squareFootage.test.ts`，非编造；embed版本`https://calcbadger.com/embed/square-footage-calculator/`同样curl核实200存活，随首批工具已上线。
- 功能对应确认：对方链接的inchcalculator "Area Calculator"用途正是"算铺草坪需要的面积"，与CalcBadger的Square Footage Calculator（含英制转公制/平方米换算，正对应对方页面要求"square metres"填写格式）功能真实对应，非硬凑。
- 查重：`gmail_send.py list --query "to:info@thelawnturflaying.co.uk"`全账号范围返回空；`broken-link-outreach-log.md`（8/4、8/9两轮）、`outreach-drafts.md`历史记录均无此域名/邮箱。
- 已过`Skill(humanizer)`+`Skill(avoid-ai-writing)`去AI味：无em/en dash、无AI高频词（delve/leverage/robust等）、无排比三连、无空洞背书语（未使用"worth checking out"类模板）、句长自然变化、无chatbot残留语，两项检查均为"已经很干净，未做改动"。
- 独立复核结果：全新独立agent（general-purpose）逐项核实后APPROVED——查重（gmail_send.py全账号+本地三份记录均为空）、目标页面200存活且原文确认含"you can use this online calculator: Area Calculator"引导语、CalcBadger工具真实存在且有单元测试、embed页面200存活、功能真实对应、语气非模板化、无AI写作痕迹，六项全过
- 发送状态：已发送 2026-08-16，Message ID `1a0093cdbdaa9a26`，Thread ID同，From头`--from calcbadger`（对应`contact@calcbadger.com`）
- 邮件正文：

```
Subject: Re your quote form's area calculator note

Hi,

I was looking at your turf quote form and saw the line about using an online calculator to work out the total area before entering it in square metres. I run CalcBadger (calcbadger.com), a small site of free calculators, and we have a Square Footage Calculator that handles this the same way: enter length and width (or split an L-shaped lawn into two rectangles and add them), and it converts straight to square metres alongside square feet and acres.

If it's useful, here's the link: https://calcbadger.com/square-footage-calculator/. We also have an embeddable version if you'd rather have the calculator sit directly on your quote page instead of sending customers off-site: https://calcbadger.com/embed/square-footage-calculator/.

Thanks,
Owen Zhang
CalcBadger
```

## 2026-08-16 — weekly trafficsite-guest-post-outreach run (nologin.tools retry + nosignuptools.com + coin-flip-simulator resource search)

- GSC选点：`python3 gsc_query.py calcbadger`（近28天）Top Pages里排除已在本轮14天内联系过的渠道对应工具（molarity-calculator已用2次、sat-score-calculator已用1次、stair-calculator已用1次）后，`/coin-flip-simulator/`（160次展现，平均排名13.0，落在5-40目标区间且展现量最高）是本轮未曾使用过的最佳候选，本轮新研究围绕它的resource-list/directory机会展开。

### Step 0 backlog：nologin.tools 重试成功

- 上一轮（2026-08-06）因浏览器工具在并发环境下失效未能提交，本轮用Browser pane重试，页面正常渲染（curl+截图均确认）。填写Tool Name="CalcBadger - Coin Flip Simulator"、Tool URL=`https://calcbadger.com/coin-flip-simulator/`、Description（真实功能描述，与`src/data/tools.ts`一致）、勾选"无需注册登录"确认框（属实——calcbadger.com全站工具均无需账号）、Education分类、Free/Web App/Client-Side Only标签（均属实：静态Astro站点客户端JS计算，免费，无需下载）。点击提交后页面跳转到"Tool Submitted"，`get_page_text`确认真实成功文案："Submission Received! Thank you for contributing to the community. Our team will review your submission shortly." 并给出预览页`https://nologin.tools/tool/calcbadger-com-coin-flip-simulator`（待审核通过后才会出现在公开目录）。carryover已解决，无需再留待下轮。

### 新研究：nosignuptools.com — 找到但本轮未完成（卡在截图上传）

- 来源：搜索"submit free online tool directory no signup 2026"命中，curl复核`https://nosignuptools.com/submit`HTTP 200，页面结构真实（Next.js站点，"Tool Submission Form"含Basic/Detailed/Your Information三段，Submission Guidelines明确"No Signup Required/High Quality/Publicly Accessible/Safe & Secure"四条标准，Review Process说明24-48小时人工审核），分类里有专门的"Math & STEM"选项，niche与CalcBadger高度吻合。非付费、无CAPTCHA、无需登录即可提交。
- 已用Browser pane填写Tool Name/Tool URL/Category(Math & STEM)/Short Description/Detailed Description/Mobile Friendly标签/联系人Owen Zhang/contact@calcbadger.com，并用JS fetch线上`https://calcbadger.com/apple-touch-icon.png`（180×180真实站点图标，非编造）注入Tool Icon上传框成功（截图确认图标预览正常显示）。
- 提交时表单校验提示"Upload at least one screenshot"——该站点强制要求至少一张工具截图（不同于nologin.tools/The Free Tools Directory等此前渠道），本次运行环境下Browser pane截图工具返回的图像只回传给agent本身，没有可写入本地文件系统再供页面`fetch()`读取的路径，暂时无法在不引入额外服务的情况下补齐这张截图，为避免用favicon等不真实素材冒充"截图"误导审核，本轮未强行提交。
- 判定为真实可行渠道，其余字段均已验证真实、非编造，仅缺一张`coin-flip-simulator`页面的真实截图文件。**下轮建议**：手动截一张该工具页面的图（或用其他有本地文件写入能力的环境截图）存到仓库某处，下轮直接复用同一张图重试；不算需要Owen介入的事项，纯工具能力缺口。

### 其他研究但未采用的渠道（围绕coin flip simulator/probability教学资源方向，共约8次定向搜索）

- **TCEA TechNotes Blog — "Five Free Online Coin-Flipping Tools"**（`https://blog.tcea.org/coin-flip-tools-gone-digital-online-and-free/`）：curl复核HTTP 200，博客本身活跃（近期有2026-08-05/07-17/07-07多篇新文章），但这篇具体文章发布于2021-11-17，无任何"已更新"标记，不是一份持续维护的清单，只是一篇静态旧文章，追加pitch大概率石沉大海，不符合"近几月内有真实更新证据"的质量门槛，跳过。
- **Ask a Tech Teacher — "Best Math Websites" 分类页**（`https://askatechteacher.com/great-kids-websites/math-websites/`）：curl复核确认真实存在且标注"Updated 6-7-26"（2026年6月更新，符合活跃度门槛），但该站点邮箱`askatechteacher@gmail.com`已在2026-08-06（10天前）联系过一次（chemistry list pitch），未满14天查重门槛，本轮不重复联系同一收件人，跳过。
- **Math = Love（mathequalslove.net，Sarah Carter）**：真实且非常活跃的高中数学教师个人博客，含多篇probability活动文章，联系邮箱`sarah@mathequalslove.net`已确认真实。但性质是个人教学博客/素材分享站，不是面向第三方的"收录/资源清单"型页面，冷邮件推销加自己工具链接与该博客定位不符，命中率判断偏低，不追加pitch。
- **Educators Technology — "Best Math Websites for Teachers and Students"**（2023年1月发布）：网站整体活跃（2026年仍有新文章），但这篇具体列表页无任何近期更新证据，跟TCEA同理判定过旧，跳过；其Contact页仅为通用联系表单，没有找到专门的"资源清单更新入口"。
- **ToolDirs.com**：表单存在但明确区分"free vs paid submissions"档位，且首页有"Sign In"入口，判定为偏SaaS方向的付费收录型目录，与CalcBadger"零门槛小工具"定位不完全匹配，本轮未深入核实其免费档位细节，跳过（非明确拒绝，只是优先级更低）。
- 其余"AI math tools 2026""best math blogs 2026"类listicle（Jotform/Taskade/Medium/Geleza等）判断为程序化SEO/联盟内容农场性质，缺乏真实编辑把关，不作为外链目标。

### 本轮小结

- 1个backlog渠道（nologin.tools）本轮成功提交，视觉确认真实成功文案。
- 1个新渠道（nosignuptools.com）研究属实、表单填写完成度约90%，卡在强制截图要求，未提交，已记录到下轮carryover（非Owen事项，纯工具能力缺口）。
- 围绕coin-flip-simulator做了约8次定向搜索，其余候选均因"过旧无更新证据""14天内已联系过""性质不符（个人博客非资源清单）""疑似付费/内容农场"等原因被排除，无new email pitch发出。

## 2026-08-18 — MaxAEO (nancy@maxaeo.ai) — 新资产pitch

- 来源：`trafficsite-linkable-asset-building`本轮制作了新资产Formula & Standards Source Index（`https://calcbadger.com/formula-standards-index/`），第3步要求为新发布资产搜索可能引用它的近期活跃写作者。
- 目标发现：WebSearch"how to get your website cited by ChatGPT AI Overviews cite sources 2026"命中MaxAEO Blog《Interactive Tools and AI Citations: Why Calculators Earn Durable Mentions》（`https://maxaeo.ai/blog/interactive-tools-ai-citations/`，署名Chris Han，发布于2026年7月），核心论点是"可解释、站得住的透明公式比黑箱更容易被AI搜索引用"，与CalcBadger新资产的定位（把38个计算器的132条来源引用整理成一个可摘引、可下载CSV的索引页）直接相关，非硬凑话题。
- 联系方式核实：curl抓取`https://maxaeo.ai/contact/`（200存活），页面明确列出"Sales and partnerships — For demos, paid plans, partnerships, and media or directory collaboration"对应`nancy@maxaeo.ai`（区别于`support@maxaeo.ai`产品支持邮箱），公司主体为HIII PTE. LTD.，判定为真实可核实的具名联系渠道（非纯Contact Us表单）。
- 查重：`gmail_send.py list --query "to:nancy@maxaeo.ai"`和`"maxaeo.ai"`（全账号范围）均返回空，本仓库其余外链日志文件grep同样无匹配。
- 已过`Skill(humanizer)`+`Skill(avoid-ai-writing)`去AI味：两项检查均判定邮件已经干净——无em/en dash、无AI高频词（delve/leverage/robust等）、无排比三连、无chatbot残留语、无空洞背书套话、语气具体不模板化，未做改动。
- 独立复核结果：待发送前用全新独立agent复核（见下方运行记录）。
- 邮件正文：

```
Subject: A transparent-sourcing example for your interactive-tools piece

Hi Nancy,

I read Chris Han's piece on interactive tools and AI citations, especially the line about a transparent formula you can explain and stand behind out-citing a black box. That's the whole premise behind CalcBadger.

Every calculator on the site states its formula and links to where that formula comes from. We just pulled all of those citations into one index page: 132 sources across 38 calculators, sorted by whether each one traces back to a government agency, a standards body, a peer-reviewed study, or a reference source. The full list downloads as a CSV.

Link: https://calcbadger.com/formula-standards-index/

If it's a useful example for future coverage of transparent calculator methodology, feel free to use it. Either way, the piece matched what we're building here.

Owen Zhang
CalcBadger
```
