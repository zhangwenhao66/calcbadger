// 自动生成，勿手改。由 独立站/tools/gen-image-dims.py 扫描 public/ 产出。
// 用途：给 <img> 补 width/height（消除 CLS + 给图片搜索尺寸信号），并喂给 Article schema 的 ImageObject。
// 新增图片后重跑本脚本。查不到的路径返回 undefined，模板需容错。

export const IMAGE_DIMS: Record<string, { w: number; h: number }> = {
 "/apple-touch-icon.png": {
  "h": 180,
  "w": 180
 },
 "/favicon.svg": {
  "h": 32,
  "w": 32
 }
};

export function imgDims(src?: string) {
	if (!src) return undefined;
	let key = src.split('?')[0].split('#')[0];
	// 模板里常传绝对 URL（如 `${SITE_ORIGIN}/images/x.jpg`），而本表的键是站内相对路径。
	// 2026-08-27 首次接入时就栽在这：查不到 → 宽高 undefined → schema 静默退回裸 URL，
	// 构建不报错、页面也正常，只有去看产物才发现 ImageObject 根本没生成。两种形式都认。
	const m = key.match(/^https?:\/\/[^/]+(\/.*)$/);
	if (m) key = m[1];
	return IMAGE_DIMS[key];
}
