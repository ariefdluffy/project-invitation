# Change Report

## Files Modified

- src/routes/dashboard/create/+page.svelte
  - Kategori template dibuat dinamis berdasarkan data template.
  - Label langkah "Mempelai" diganti menjadi "Data".
- src/routes/demo/[id]/+page.svelte
  - Routing layout berdasarkan kategori untuk preview demo.
  - Layout khusus untuk template 3D Motion wedding.
  - Layout khusus untuk template Tema 31 inspired.
- src/routes/invitation/[slug]/+page.svelte
  - Routing layout berdasarkan kategori untuk undangan publik.
  - Layout khusus untuk template 3D Motion wedding.
  - Layout khusus untuk template Tema 31 inspired.
- src/routes/admin/templates/preview/[id]/+page.svelte
  - Routing layout berdasarkan kategori untuk admin preview.
  - Layout khusus untuk template 3D Motion wedding.
  - Layout khusus untuk template Tema 31 inspired.
- src/routes/dashboard/create/+page.server.ts
  - Validasi kategori single-name dan auto-mapping `bride_name` jika disembunyikan.
- src/routes/demo/[id]/+page.server.ts
  - Merge defaultContent dari JSON template saat data DB tidak lengkap.
  - DefaultContent diterapkan ke data dummy preview.
- src/routes/admin/templates/preview/[id]/+page.server.ts
  - DefaultContent diterapkan ke data dummy admin preview.
- src/lib/components/invitations/SimpleEventLayout.svelte
  - Layout dasar non-wedding + perbaikan runes mode ($props, $derived.by).

## Files Added

- src/lib/components/invitations/KhitanLayout.svelte
- src/lib/components/invitations/AqiqahLayout.svelte
- src/lib/components/invitations/BirthdayLayout.svelte
- src/lib/components/invitations/GatheringLayout.svelte
- src/lib/components/invitations/FormalLayout.svelte
- src/lib/components/invitations/GeneralLayout.svelte
- src/lib/components/invitations/ThreeDMotionWedding.svelte
- src/lib/components/invitations/Tema31InspiredWedding.svelte
- static/templates/pernikahan/tema-31-inspired.json

## Database Changes

- Tidak ada perubahan skema database.
- Seeder template tetap menggunakan tabel `templates` yang sudah ada dan kolom `category`.
