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
