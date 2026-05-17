/** Kategori acara untuk template (nilai disimpan di DB kolom `templates.category`). */
export const TEMPLATE_CATEGORIES = [
	{ id: 'pernikahan', label: 'Undangan Pernikahan' },
	{ id: 'khitan', label: 'Undangan Khitan' },
	{ id: 'aqiqah', label: 'Undangan Aqiqah' },
	{ id: 'formal', label: 'Formal / Perusahaan' },
	{ id: 'general', label: 'Umum / lainnya' }
] as const;

export type TemplateCategoryId = (typeof TEMPLATE_CATEGORIES)[number]['id'];

export const DEFAULT_TEMPLATE_CATEGORY: TemplateCategoryId = 'pernikahan';

export function getTemplateCategoryLabel(category: string | null | undefined): string {
	const id = (category || DEFAULT_TEMPLATE_CATEGORY) as TemplateCategoryId;
	const row = TEMPLATE_CATEGORIES.find((c) => c.id === id);
	return row?.label ?? 'Umum';
}
