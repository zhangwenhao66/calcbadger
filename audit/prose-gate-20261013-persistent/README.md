2026-10-13：notes 按原始字节入库，清单 notes_path 使用仓库内相对路径；SHA 校验用于防止证据被静默替换。采用独立 notes 文件，便于查看逐篇差异并继续使用现有 --verify 接口。清单不再依赖本机 automation-runtime。

复现八站时，使用 FactCrumbs 的 audit/prose-gate-20261013-persistent/replay.py：

```sh
python3 <factcrumbs>/audit/prose-gate-20261013-persistent/replay.py --scripts <kit>/domains/seo/scripts/scripts --repo <站点仓库> --output <回执目录>
```

每个 --repo 对应一个站，可重复传入八站。逐篇运行 prose、bridge scan；有候选时必须校验仓库 notes SHA 并运行 --verify。缺文件、清单漏项、解析失败或候选数不一致均不会通过。DialWick 冻结，排除本次八站检查，其队列记录原样保留。
