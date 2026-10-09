# 维基百科引用机会记录 — CalcBadger

记录 `trafficsite-wikipedia-outreach` 任务每次排查的结果。**本文件只做发现与建议，不代表已经在维基百科做过任何编辑。**

## 2026-08-03 排查结论：本站结构上不适用本渠道，建议永久跳过

本站是**工具站**（计算器 / 单位换算 / 生成器），页面即功能，没有可被当作参考来源引用的文章型内容。首批 5 个工具（cd / square footage / stair / sat score / molarity）全部是计算器页面。

维基百科方面有两条独立的规则同时挡住这个渠道：

1. **WP:RS 不适用**：计算器页面不提出可供核查的事实主张，没有东西可以被"引用为来源"。
2. **WP:ELNO 明确不鼓励外部链接指向在线计算器/工具站**，这类链接被归为推广性外链，是巡查编辑者的常规清理对象。

本站真正的外链主武器是"Embed this calculator"嵌入组件署名链接（`/embed/<slug>/` 已随首批工具上线），跟维基百科渠道无关。

**建议：后续运行 `trafficsite-wikipedia-outreach` 时直接跳过 CalcBadger**，以及将来矩阵里新增的任何工具站。这不是"本次没找到"，是渠道与站型不匹配，重复排查没有意义。

---

## 2026-08-04：按上条建议跳过

本站站型（工具站）没有变化，跳过理由（WP:RS 不适用 + WP:ELNO 排斥计算器类外链）不受站龄影响，本次未做任何排查。

---

## 2026-09-03 复查：结构未变，继续跳过

实地检查`calcbadger/src/pages/`确认本站仍是纯工具站结构（计算器/单位换算/生成器页面+embed组件），没有新增文章型内容板块。08-03排查结论（WP:RS不适用+WP:ELNO排斥计算器类外链）不受影响，本次未做维基百科端排查。若本站将来加入文章型内容（如公式原理讲解类长文），下次应重新评估。


<!-- run:20261009T141607+0800 -->
## 2026-10-09 近期样本实查

当前核查以词条修订和本站实际内容为准，历史站龄门槛、缺作者页或计算器一律禁止的推断不沿用。本轮是近期样本筛查，非全站穷尽审计；不推进最后有效提交日期。

- CalcBadger：本站 `cd-calculator`；维基条目 [Certificate of deposit](https://en.wikipedia.org/w/index.php?oldid=1376817146)，修订 1376817146。结论：CN涉及条款/续存/法律效力，计算器本身不证明，EL资格另核。合格引用建议0、Talk留言0、新提交0、公开上线0。

参考来源资格与外部资源价值分别判断；本站来源更详尽本身不构成可靠来源资格。独立审查已完成，无对外草稿，英文写作链不适用。未编辑维基正文、未新增机会键或虚构回执。证据：`/Users/zhangwh/.codex/automation-runtime/runs/trafficsite-wikipedia-outreach/20261009T141607+0800/screening-results.json`、`/Users/zhangwh/.codex/automation-runtime/runs/trafficsite-wikipedia-outreach/20261009T141607+0800/wiki-current.json`、`/Users/zhangwh/.codex/automation-runtime/runs/trafficsite-wikipedia-outreach/20261009T141607+0800/followup-20261009T1515-receipt.json`。
