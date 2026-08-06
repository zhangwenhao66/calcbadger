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
