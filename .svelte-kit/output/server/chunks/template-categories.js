//#region src/lib/template-categories.ts
/** Kategori acara untuk template (nilai disimpan di DB kolom `templates.category`). */
var TEMPLATE_CATEGORIES = [
	{
		id: "wedding",
		label: "Pernikahan"
	},
	{
		id: "khitan",
		label: "Khitan / sunatan"
	},
	{
		id: "aqiqah",
		label: "Aqiqah"
	},
	{
		id: "anniversary",
		label: "Ulang tahun pernikahan"
	},
	{
		id: "birthday",
		label: "Ulang tahun"
	},
	{
		id: "gathering",
		label: "Arisan & gathering"
	},
	{
		id: "corporate",
		label: "Formal / perusahaan"
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
export { TEMPLATE_CATEGORIES as n, getTemplateCategoryLabel as r, DEFAULT_TEMPLATE_CATEGORY as t };
