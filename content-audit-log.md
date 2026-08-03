# CalcBadger 内容质量审计日志

由定时任务`trafficsite-content-quality-audit`维护，记录已发布工具页的回头复核（区别于发布前的检查）。CalcBadger是工具站（交互式计算器），与其余五个内容站不同——审计维度聚焦公式正确性与组件可用性，而非长文写作维度。每个工具一条记录，用`tool_slug`标识，选取顺序按`last_audited`最早/未审计优先。

本站2026-08-02上线，首批5个计算器共116个单元测试全部通过，期望值来自权威来源。本条为首次审计。

```json
{
  "tool_slug": "cd-calculator",
  "last_audited": "2026-08-02",
  "published_date": "2026-08-02",
  "checklist": [
    "公式正确性：A = P(1 + r/n)^(nt)（APR报价）与 A = P(1 + APY)^t（APY报价）两条路径是否与教科书/监管定义一致",
    "APY换算是否符合 Regulation DD Appendix A：APY = (1 + r/n)^n − 1",
    "四舍五入/显示精度：金额2位小数，APY百分比3位小数，是否有累积误差",
    "页面内硬编码的示例与参考表（$10,000本金、4.5%档APY表、每日vs每月复利差额约85美分）数值是否仍然正确",
    "早支取罚金逻辑：页面只做文字提示不做罚金计算，需确认没有暗示计算器会算罚金"
  ],
  "findings": [
    {
      "dimension": "公式正确性（最高优先级）",
      "status": "未发现问题",
      "detail": "用Python独立重算（不参考实现代码，只用标准复利公式和Reg DD定义）：$1,000@6%/月复利/10年=1819.3967（组件与测试期望值1819.397一致）；$10,000@5%/季复利/5年=12820.3723（一致）；$2,500@4%/月复利/0.75年=2576.0078（一致）；apyFromApr(5%,12)=5.11619%、apyFromApr(4.75%,365)=4.86430%、apyFromApr(5%,1)=5%（三项均与tests/cd.test.ts期望值一致）；$5,000 APY4.5%/18个月=5341.2689（一致）。src/lib/cd.ts的cdFromApr/cdFromApy两个分支分别对应APR和APY两种报价方式，未出现重复应用复利（即APY报价不会再套用一次compounds）。页面正文断言逐条复核：worked example 10,000×(1.045)^3=11,411.66（复核结果11,411.6612，一致）；日/月复利在$10,000@4.5%/1年下的利息差=460.2496−459.3983=0.8513≈85美分（页面写'about 85 cents apart'，一致）；4.5%名义月复利换算APY=4.59398%（页面写'4.594% APY'，一致）；参考表四档APY×四个年限共16个单元格逐一复算，全部吻合。"
    },
    {
      "dimension": "单元测试覆盖准确性",
      "status": "未发现问题",
      "detail": "npm test：5个测试文件、116个测试全部通过（tests/cd.test.ts 11个）。cd.test.ts的11条期望值逐条用独立Python复算比对，全部一致（见上一条明细），测试注释本身也声明期望值来自独立计算而非从实现代码反推，核实属实。"
    },
    {
      "dimension": "内嵌组件功能",
      "status": "未发现问题",
      "detail": "src/components/CalculatorIsland.astro按slug分发，'cd-calculator'映射到CdCalculator（client:load）；src/pages/embed/[slug].astro的getStaticPaths遍历tools数组生成/embed/cd-calculator/，复用同一CalculatorIsland组件（非另一份实现，不存在embed与主页面逻辑分叉的风险）。npm run build成功生成dist/embed/cd-calculator/index.html与dist/cd-calculator/index.html，无报错。"
    },
    {
      "dimension": "引用来源时效性与外链腐烂",
      "status": "未发现问题（含一项基础设施说明）",
      "detail": "三条sources链接：investor.gov复合利息计算器页curl 200且正文含'Compound Interest'字样，内容仍对应；FDIC存款保险页curl 200且正文含'$250,000'字样，与文中'$250,000 per depositor'一致；eCFR (Regulation DD Appendix A) 链接curl返回200但WebFetch渲染发现该URL会302到unblock.federalregister.gov的人机验证页——这是eCFR/Federal Register对自动化客户端的反爬网关，不是链接失效（人类浏览器可正常访问，URL本身是eCFR标准永久链接格式title-12/chapter-X/part-1030/appendix-...），未计入'失效'。"
    },
    {
      "dimension": "SEO技术审计",
      "status": "未发现问题（一项4字符的meta description超长，判定不构成问题）",
      "detail": "线上https://calcbadger.com/cd-calculator/ 200，title'CD Calculator | CalcBadger'26字符，meta description 164字符（略超理想上限160，仅4字符，未做修改）；canonical自指正确；单一h1，6个h2无跳级且措辞贴近搜索query（如'APY vs. APR: which number did your bank give you?'）；页面含3个application/ld+json（WebApplication + FAQPage + BreadcrumbList）；robots.txt为'Allow: /'不拦截任何抓取工具含AI爬虫；sitemap-index.xml正常收录本页。"
    },
    {
      "dimension": "GEO审计（AI搜索友好度）",
      "status": "未发现问题",
      "detail": "本项目暂无自动化99分制打分工具适用于calcbadger（该打分体系用于trinity四站长文），改为对照ai-seo skill的可提取性清单与Princeton GEO九项方法人工核对：coreSummary在首屏给出可独立引用的定义与公式；各section均以直接陈述开头；含3条真实数字worked example与1个对比表；5组FAQ配FAQPage schema；3条权威来源引用（监管条文+联邦机构+FDIC）；'last reviewed 2026-08-02'时效信号明确；robots.txt放行GPTBot/ClaudeBot/PerplexityBot等。唯一弱项：作者署名只有姓名链接到/about/，无独立资质说明，但这是全站模板级设计非本工具专属问题。综合判定明显高于80分门槛，无需改动。"
    },
    {
      "dimension": "内链健康度",
      "status": "未发现问题",
      "detail": "本站目前仅5个工具，[slug].astro的相关工具区块用site-toolkit的pickRelatedGuides轮转选择、不足6个时用跨分类工具补足到relatedFinal，实测会把其余4个工具全部纳入侧栏；首页index.astro与分类页category/[category].astro都直接遍历tools数组渲染，不存在孤儿页风险。"
    },
    {
      "dimension": "Schema一致性",
      "status": "未发现问题",
      "detail": "WebApplication的dateModified取值tool.updated='2026-08-02'，与页面底部'last reviewed 2026-08-02'一致；FAQPage的items直接来自tool.faq，5条FAQ与页面渲染的FAQ区块逐一对应；BreadcrumbList三级（Home/Finance/CD Calculator）与页面顶部面包屑一致。"
    },
    {
      "dimension": "合规/敏感度",
      "status": "未发现问题",
      "detail": "工具本身在结果下方声明'Assumes interest stays in the CD until maturity, with no early withdrawal'且未暗示计算罚金；全站/terms/页含'No professional advice'条款明确覆盖financial/legal/medical/engineering/construction，Footer在每页可达。CD计算器本身不涉及需要额外风险提示的敏感场景。"
    },
    {
      "dimension": "图片/图标可用性",
      "status": "未发现问题",
      "detail": "本工具页无正文配图（表格+计算器UI为主），仅用全站favicon.svg（public/favicon.svg存在，被<link rel=\"icon\">与og:image引用），无失效图片资源。"
    }
  ],
  "actions_taken": [
    "本次审计11个维度均未发现需要修复的问题，未做任何代码改动，未触发npm run build之外的部署/IndexNow/内容发布日志流程（Step 5仅在有改动时执行，本次跳过）"
  ],
  "seo_score": "未使用自动化打分工具；静态审计全部通过（title/meta/canonical/h1层级/3处JSON-LD schema/robots.txt/sitemap均无异常），判定为健康，无需修复",
  "geo_score": "无适用于本站的99分制自动打分器；按ai-seo skill可提取性清单与Princeton GEO九项方法人工核对，估计等效90/99左右，明显超过≥80门槛，无需修复",
  "escalation": null
}
```

```json
{
  "tool_slug": "square-footage-calculator",
  "last_audited": "2026-08-03",
  "published_date": "2026-08-02",
  "checklist": [
    "公式正确性：矩形 L×W、L 形拆两矩形相加、圆 π×(d/2)²、三角形 底×高÷2 四条路径是否与初等几何定义一致",
    "单位换算是否符合 NIST SP 811 精确系数（1 ft = 0.3048 m 精确值；1 acre = 43,560 sq ft 精确值；1 sq yd = 9 sq ft 精确值）",
    "页面内硬编码的示例与参考表（12ft6in×10ft=125非126、L形20×12+8×6=288、10ft直径圆≈78.5sqft、6格房间尺寸换算表）数值是否仍然正确",
    "外部信源链接（NIST SP811、ANSI Z765）是否仍然可正常访问，ANSI Z765 是否仍是引用该机构目前有效的现行页面",
    "地板/油漆购料损耗经验值（5-10%损耗、每加仑350-400平方英尺）是否仍是行业惯常口径，不是编造的精确数字"
  ],
  "findings": [
    {
      "dimension": "公式正确性（最高优先级）",
      "status": "未发现问题",
      "detail": "用Python独立重算（不参考实现代码）：12ft6in×10ft=125sqft（页面强调'not 126'，正确）；L形20×12+8×6=288sqft（与tests/squareFootage.test.ts一致）；10ft直径圆=π×5²=78.5398sqft（页面写'≈78.5 sq ft'一致）；1 sqm=10.7639sqft、1sqft=0.09290304sqm，均与NIST精确定义（1ft=0.3048m精确值）一致；100×100ft地块=0.2296英亩，页面写'just under a quarter acre'（quarter acre=10,890sqft，10,000<10,890），正确。参考表6组数值（100/120/144/180/300/400 sqft对应9.3/11.1/13.4/16.7/27.9/37.2 m²）逐一复算全部吻合。src/lib/squareFootage.ts的rectangleAreaSqFt/circleAreaSqFt/triangleAreaSqFt/lShapeAreaSqFt四个函数分别对应页面四种形状的讲解，toFeet的TO_FEET换算表用NIST精确系数（含in=1/12、yd=3、m=1/0.3048、cm=1/30.48），无近似值误用。"
    },
    {
      "dimension": "单元测试覆盖准确性",
      "status": "未发现问题",
      "detail": "npm test：squareFootage.test.ts 13个测试全部通过（areas 5个、toFeet 4个、convertArea 3个、costEstimate 1个）。测试注释声明期望值来自'elementary geometry, hand-computed'与'exact NIST SP 811 factors'，逐条用独立Python复算比对全部一致，核实属实，非从实现输出反推。"
    },
    {
      "dimension": "内嵌组件功能",
      "status": "未发现问题",
      "detail": "src/components/calculators/SquareFootageCalculator.tsx逐行核对：四种形状分支正确调用对应lib函数，所有输入先经toFeet统一转换到英尺再计算（避免混合单位错误），cost仅在price>0时计算。CalculatorIsland.astro按slug正确分发到该组件。npm run build成功生成dist/square-footage-calculator/与dist/embed/square-footage-calculator/，无报错。"
    },
    {
      "dimension": "引用来源时效性与外链腐烂",
      "status": "发现1个真问题（已修复）",
      "detail": "NIST SP811链接curl 200且正文含'Special Publication 811'/'Conversion Factors'字样，内容对应，健康。ANSI Z765链接（`homeinnovation.com/services/accreditation/ansi_z765_square_footage_standard`）curl -sIL返回**HTTP 410 Gone**，页面标题'Not Found'，确认已失效——不是反爬网关（无302跳转到验证页），是真实下线。独立agent复核确认（沙箱内curl+WebSearch双重核实）。已替换为该机构现行页面`homeinnovation.com/services/national_standards/square_footage_method_for_calculating`（200，正文确认仍在讲ANSI Z765-2021标准现行版本与下次复审周期）。"
    },
    {
      "dimension": "SEO技术审计",
      "status": "发现1个真问题（已修复）",
      "detail": "线上https://calcbadger.com/square-footage-calculator/ 200，title'Square Footage Calculator | CalcBadger'38字符，正常；canonical自指正确；单一h1，6个h2无跳级；3个application/ld+json（WebApplication+FAQPage+BreadcrumbList）；robots.txt为'Allow: /'。**meta description 207字符**，超出Google SERP安全长度（~155-160）约30-35%，有较高截断风险（cd-calculator此前审计的164字符仅超4字符判定不改，本次207字符幅度显著更大，独立agent复核确认应修）。该description同时是页面首屏可见导语段落，精简为151字符时保留了核心含义（房间/区域测量、换算、成本估算），只删去了已在正文'The formulas, shape by shape'一节详述的形状清单细节，未造成信息丢失。"
    },
    {
      "dimension": "GEO审计（AI搜索友好度）",
      "status": "未发现问题",
      "detail": "沿用cd-calculator审计确立的人工核对方法（本站无适用于长文的99分制自动打分器）：coreSummary首屏给出可独立引用的公式与换算；4个小节均以直接陈述开头；含2条真实数字worked example（L形、100×100地块）与2个参考表；5组FAQ配FAQPage schema；'last reviewed 2026-08-02'时效信号明确；robots.txt放行AI爬虫。综合判定明显高于80分门槛，无需改动（meta description修复属SEO维度非GEO维度，但客观上也提升了AI摘要引用时的信息密度）。"
    },
    {
      "dimension": "内链健康度",
      "status": "未发现问题",
      "detail": "线上HTML核对：'More calculators'区块含指向其余5个工具（cd/stair/sat-score/molarity/bmi）的全部链接，无孤儿风险；首页/分类页遍历tools数组渲染，同cd-calculator审计时的结论。"
    },
    {
      "dimension": "Schema一致性",
      "status": "未发现问题",
      "detail": "WebApplication的dateModified='2026-08-02'与页面'last reviewed 2026-08-02'一致；FAQPage 5条FAQ与页面渲染一致；BreadcrumbList三级（Home/Home Improvement/Square Footage Calculator）与面包屑一致。meta description修改不影响schema字段（schema未单独存储description）。"
    },
    {
      "dimension": "合规/敏感度",
      "status": "未发现问题",
      "detail": "工具本身是几何计算，无需额外风险提示；全站/terms/页'No professional advice'条款已覆盖construction场景（本工具涉及地板/油漆购料估算）。"
    },
    {
      "dimension": "图片/图标可用性",
      "status": "未发现问题",
      "detail": "本工具页无正文配图（表格+计算器UI为主），仅用全站favicon，无失效图片资源。"
    }
  ],
  "actions_taken": [
    "1. sources中ANSI Z765链接从已410的accreditation旧页改为该机构现行的national_standards页（src/data/tools.ts第245行）",
    "2. meta description从207字符精简到151字符，同步更新页面首屏可见导语段落（src/data/tools.ts第155行，同一字段两处复用）",
    "两处均为定点修改，未做大范围重写；均先经独立fresh-context agent复核确认为真问题后才动手",
    "npm test 156/156通过（含并发会话新增的coin-flip-simulator 26个测试）、npm run build通过后，用git hash-object+update-index做blob级暂存只提交这两处改动（commit 60f610c），未影响同仓库另一会话正在进行中的coin-flip-simulator未提交改动",
    "push后轮询线上URL确认两处修复均已生效部署，node tools/submit-indexnow.mjs重新提交该URL（Bing 200/Yandex 202），内容发布日志.md已追加记录"
  ],
  "seo_score": "修复前：静态审计除meta description 207字符超长外全部健康；修复后：description缩短到151字符，其余维度（title/canonical/h1层级/3处JSON-LD schema/robots.txt/sitemap）保持无异常",
  "geo_score": "无适用于本站的99分制自动打分器；按ai-seo skill可提取性清单人工核对，估计等效90/99左右，明显超过≥80门槛，无需修复",
  "escalation": null
}
```
