//#region src/lib/template-categories.ts
/** Kategori acara untuk template (nilai disimpan di DB kolom `templates.category`). */
var TEMPLATE_CATEGORIES = [
	{
		id: "pernikahan",
		label: "Undangan Pernikahan"
	},
	{
		id: "khitan",
		label: "Undangan Khitan"
	},
	{
		id: "aqiqah",
		label: "Undangan Aqiqah"
	},
	{
		id: "gathering",
		label: "Arisan / Gathering"
	},
	{
		id: "formal",
		label: "Formal / Perusahaan"
	},
	{
		id: "general",
		label: "Umum / lainnya"
	}
];
var DEFAULT_TEMPLATE_CATEGORY = "wedding";
function getTemplateCategoryLabel(category) {
	const id = category || "wedding";
	return TEMPLATE_CATEGORIES.find((c) => c.id === id)?.label ?? "Umum";
}
//#endregion
export { getTemplateCategoryLabel as n, DEFAULT_TEMPLATE_CATEGORY as t };
