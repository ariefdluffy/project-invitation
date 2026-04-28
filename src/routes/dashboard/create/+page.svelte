<script lang="ts">
  import type { PageData, ActionData } from "./$types";
  import {
    DEFAULT_TEMPLATE_CATEGORY,
    getTemplateCategoryLabel,
  } from "$lib/template-categories";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let currentStep = $state(1);
  let selectedTemplateId = $state("");
  let selectedTemplate = $state<string | null>(null);
  let categoryFilter = $state<string | "all">("all");

  // Form values as states for auto-fill
  let groomName = $state("");
  let brideName = $state("");
  let groomFullName = $state("");
  let brideFullName = $state("");
  let groomParents = $state("");
  let brideParents = $state("");
  let quote = $state("");
  let quoteSource = $state("");
  let slug = $state("");

  const selectedTemplateObj = $derived(
    data.templates.find((t) => t.id === selectedTemplateId),
  );
  const selectedCategory = $derived.by(() =>
    (
      selectedTemplateObj?.category ||
      DEFAULT_TEMPLATE_CATEGORY ||
      "wedding"
    ).toLowerCase(),
  );
  const isWeddingCategory = $derived.by(
    () =>
      selectedCategory === "wedding" ||
      selectedCategory === "pernikahan" ||
      selectedCategory === "anniversary",
  );
  const isChildParentCategory = $derived.by(
    () => selectedCategory === "khitan" || selectedCategory === "aqiqah",
  );
  const isSingleNameCategory = $derived.by(() =>
    ["birthday", "gathering", "formal", "corporate", "general"].includes(
      selectedCategory,
    ),
  );
  const showSecondaryPerson = $derived.by(
    () => isWeddingCategory || isChildParentCategory,
  );
  const showSocialFields = $derived.by(() => isWeddingCategory);
  const step2Title = $derived.by(() =>
    isWeddingCategory ? "Data Mempelai" : "Data Acara",
  );
  const primaryTitle = $derived.by(() => {
    if (isChildParentCategory) return "👦 Anak";
    if (isSingleNameCategory) return "🎉 Tamu Utama";
    return "🤵 Mempelai Pria";
  });
  const secondaryTitle = $derived.by(() => {
    if (isChildParentCategory) return "👪 Orang Tua";
    return "👰 Mempelai Wanita";
  });
  const primaryNameLabel = $derived.by(() => {
    if (isChildParentCategory) return "Nama Anak *";
    if (isSingleNameCategory) return "Nama Acara / Tamu Utama *";
    return "Nama Panggilan *";
  });
  const secondaryNameLabel = $derived.by(() => {
    if (isChildParentCategory) return "Nama Orang Tua *";
    return "Nama Panggilan *";
  });
  const primaryFullNameLabel = $derived.by(() =>
    isChildParentCategory ? "Nama Lengkap Anak" : "Nama Lengkap",
  );
  const secondaryFullNameLabel = $derived.by(() =>
    isChildParentCategory ? "Nama Lengkap Orang Tua" : "Nama Lengkap",
  );
  const primaryParentsLabel = $derived.by(() =>
    isChildParentCategory ? "Keterangan Orang Tua" : "Nama Orang Tua",
  );
  const secondaryParentsLabel = $derived.by(() =>
    isChildParentCategory ? "Keterangan Keluarga" : "Nama Orang Tua",
  );
  const primaryEventLabel = $derived.by(() =>
    isWeddingCategory ? "Akad Nikah" : "Acara Utama",
  );
  const secondaryEventLabel = $derived.by(() =>
    isWeddingCategory ? "Resepsi" : "Sesi Lanjutan",
  );
  const quoteLabel = $derived.by(() =>
    isWeddingCategory ? "Kutipan / Ayat" : "Kutipan / Tema",
  );
  const storyLabel = $derived.by(() =>
    isWeddingCategory ? "Love Story" : "Deskripsi Acara",
  );
  const storyPlaceholder = $derived.by(() =>
    isWeddingCategory
      ? "Ceritakan kisah cinta kalian..."
      : "Deskripsikan acara secara singkat...",
  );

  $effect(() => {
    if (selectedTemplateObj && selectedTemplateObj.defaultContent) {
      const content = selectedTemplateObj.defaultContent;
      // Auto-fill form with template defaults
      if (content.groom_name) groomName = content.groom_name;
      if (content.bride_name) brideName = content.bride_name;
      if (content.groom_full_name) groomFullName = content.groom_full_name;
      if (content.bride_full_name) brideFullName = content.bride_full_name;
      if (content.groom_parents) groomParents = content.groom_parents;
      if (content.bride_parents) brideParents = content.bride_parents;
      if (content.quote) quote = content.quote;
      if (content.quote_source) quoteSource = content.quote_source;

      // For non-wedding (e.g. Aqiqah), content might use child_name
      if (content.child_name) groomName = content.child_name;
      if (content.parent_name) brideName = content.parent_name;
      if (content.title && !quote) quote = content.title;
    }
  });

  const templateCategories = $derived(() => {
    const categories = new Set<string>();
    for (const template of data.templates) {
      categories.add(template.category || DEFAULT_TEMPLATE_CATEGORY);
    }
    return Array.from(categories).sort();
  });

  const filteredTemplates = $derived(
    categoryFilter === "all"
      ? data.templates
      : data.templates.filter(
          (t) => (t.category || DEFAULT_TEMPLATE_CATEGORY) === categoryFilter,
        ),
  );

  $effect(() => {
    if (
      selectedTemplateId &&
      !filteredTemplates.some((t) => t.id === selectedTemplateId)
    ) {
      selectedTemplateId = "";
    }
  });

  let bankAccounts = $state([{ bank: "", number: "", name: "" }]);
  let dressColors = $state(["#8B6914", "#D4A574", "#FDF6E3"]);
  let showToast = $state(false);
  let previewingTemplate = $state(null);

  function addBankAccount() {
    bankAccounts = [...bankAccounts, { bank: "", number: "", name: "" }];
  }
  function removeBankAccount(index: number) {
    bankAccounts = bankAccounts.filter((_, i) => i !== index);
  }

  function addDressColor() {
    dressColors = [...dressColors, "#000000"];
  }
  function removeDressColor(index: number) {
    dressColors = dressColors.filter((_, i) => i !== index);
  }

  $effect(() => {
    if (form?.error) {
      showToast = true;
      const timer = setTimeout(() => {
        showToast = false;
      }, 5000);
      return () => clearTimeout(timer);
    }
  });
</script>

<svelte:head>
  <title>Buat Undangan - {data.appName}</title>
</svelte:head>

<div class="dash-header">
  <div>
    <h1>Buat Undangan Baru</h1>
    <p class="dash-header-sub">
      Pilih template sesuai jenis acara, lalu isi detail undangan digital Anda.
    </p>
  </div>
</div>

<!-- Progress Steps -->
<div class="steps-bar">
  {#each ["Template", "Data", "Acara", "Detail"] as step, i}
    <button
      class="step-item"
      class:active={currentStep === i + 1}
      class:completed={currentStep > i + 1}
      onclick={() => (currentStep = i + 1)}
      type="button"
    >
      <span class="step-num">{i + 1}</span>
      <span class="step-label">{step}</span>
    </button>
  {/each}
</div>

{#if showToast && form?.error}
  <div class="error-message" style="margin-bottom: 1.5rem">{form.error}</div>
{/if}

<form method="POST" class="create-form">
  <!-- Step 1: Template -->
  <div class="step-content" class:visible={currentStep === 1}>
    <div class="step-header-row">
      <h2 class="step-title">Pilih Template</h2>
      <p class="step-subtitle">
        Saring menurut jenis acara — field di langkah berikutnya tetap fleksibel
        untuk berbagai undangan.
      </p>
    </div>

    <div
      class="template-category-bar"
      role="tablist"
      aria-label="Kategori template"
    >
      <button
        type="button"
        class="category-chip"
        class:category-chip--active={categoryFilter === "all"}
        onclick={() => (categoryFilter = "all")}
      >
        Semua
      </button>
      {#each templateCategories() as categoryId}
        <button
          type="button"
          class="category-chip"
          class:category-chip--active={categoryFilter === categoryId}
          onclick={() => (categoryFilter = categoryId)}
        >
          {getTemplateCategoryLabel(categoryId)}
        </button>
      {/each}
    </div>

    {#if filteredTemplates.length === 0}
      <p class="template-empty">
        Tidak ada template di kategori ini. Pilih &ldquo;Semua&rdquo; atau
        kategori lain.
      </p>
    {/if}

    <div class="template-selector">
      {#each filteredTemplates as template}
        <label
          class="template-option"
          class:selected={selectedTemplateId === template.id}
        >
          <input
            type="radio"
            name="template_id"
            value={template.id}
            bind:group={selectedTemplateId}
            onchange={() => (selectedTemplate = template.id)}
            required
          />
          <div class="template-thumb-container">
            <img
              src={template.thumbnail}
              alt={template.name}
              class="template-img"
            />
            {#if selectedTemplateId === template.id}
              <div class="selected-overlay">
                <span class="check-icon">✓</span>
              </div>
            {/if}
          </div>
          <div class="template-opt-info">
            <div class="info-top">
              <div class="info-top-text">
                <span class="template-category-pill"
                  >{getTemplateCategoryLabel(template.category)}</span
                >
                <h4>{template.name}</h4>
              </div>
              <button
                type="button"
                class="btn-preview"
                onclick={(e) => {
                  e.preventDefault();
                  previewingTemplate = template;
                }}
              >
                🔍 Preview
              </button>
            </div>
            <p>{template.description}</p>
          </div>
        </label>
      {/each}
    </div>
  </div>

  <!-- Preview Modal -->
  {#if previewingTemplate}
    <div class="modal-backdrop" onclick={() => (previewingTemplate = null)}>
      <div class="preview-modal" onclick={(e) => e.stopPropagation()}>
        <div class="modal-header">
          <h3>Preview: {previewingTemplate.name}</h3>
          <button
            type="button"
            class="close-btn"
            onclick={() => (previewingTemplate = null)}>✕</button
          >
        </div>
        <div class="modal-body demo-body">
          <div class="iframe-container">
            <iframe
              title="Template Demo"
              src="/demo/{previewingTemplate.id}"
              frameborder="0"
            ></iframe>
          </div>
          <div class="preview-details">
            <p>{previewingTemplate.description}</p>
            <div class="color-chips">
              <span
                class="chip"
                style="background: {previewingTemplate.primary_color}"
                title="Primary"
              ></span>
              <span
                class="chip"
                style="background: {previewingTemplate.secondary_color}"
                title="Secondary"
              ></span>
              <span
                class="chip"
                style="background: {previewingTemplate.accent_color}"
                title="Accent"
              ></span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary w-full"
            onclick={() => {
              selectedTemplate = previewingTemplate.id;
              previewingTemplate = null;
            }}
          >
            Pilih Template Ini
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Step 2: Bride & Groom / Event -->
  <div class="step-content" class:visible={currentStep === 2}>
    <h2 class="step-title">{step2Title}</h2>
    <div class="form-row">
      {#if showSecondaryPerson && isWeddingCategory}
        <div class="form-col">
          <h3 class="col-title">{secondaryTitle}</h3>
          <div class="form-group">
            <label for="bride_name">{secondaryNameLabel}</label>
            <input
              type="text"
              id="bride_name"
              name="bride_name"
              class="form-control"
              placeholder="cth: Fatimah"
              bind:value={brideName}
              required
            />
          </div>
          <div class="form-group">
            <label for="bride_full_name">{secondaryFullNameLabel}</label>
            <input
              type="text"
              id="bride_full_name"
              name="bride_full_name"
              class="form-control"
              placeholder="cth: Siti Fatimah Az-Zahra"
              bind:value={brideFullName}
            />
          </div>
          <div class="form-group">
            <label for="bride_parents">{secondaryParentsLabel}</label>
            <input
              type="text"
              id="bride_parents"
              name="bride_parents"
              class="form-control"
              placeholder="cth: Putri dari Bpk. Ahmad & Ibu Siti"
              bind:value={brideParents}
            />
          </div>
          {#if showSocialFields}
            <div class="form-group">
              <label for="bride_instagram">Instagram</label>
              <input
                type="text"
                id="bride_instagram"
                name="bride_instagram"
                class="form-control"
                placeholder="cth: @fatimah_zahra"
              />
            </div>
            <div class="form-group">
              <label for="bride_photo">Foto Mempelai Wanita (URL)</label>
              <input
                type="text"
                id="bride_photo"
                name="bride_photo"
                class="form-control"
                placeholder="https://image-hosting.com/foto-wanita.jpg"
              />
            </div>
          {/if}
        </div>
      {/if}
      <div class="form-col">
        <h3 class="col-title">{primaryTitle}</h3>
        <div class="form-group">
          <label for="groom_name">{primaryNameLabel}</label>
          <input
            type="text"
            id="groom_name"
            name="groom_name"
            class="form-control"
            placeholder="cth: Yusuf"
            bind:value={groomName}
            required
          />
        </div>
        <div class="form-group">
          <label for="groom_full_name">{primaryFullNameLabel}</label>
          <input
            type="text"
            id="groom_full_name"
            name="groom_full_name"
            class="form-control"
            placeholder="cth: Muhammad Yusuf Pratama"
            bind:value={groomFullName}
          />
        </div>
        <div class="form-group">
          <label for="groom_parents">{primaryParentsLabel}</label>
          <input
            type="text"
            id="groom_parents"
            name="groom_parents"
            class="form-control"
            placeholder="cth: Putra dari Bpk. Ridwan & Ibu Aminah"
            bind:value={groomParents}
          />
        </div>
        {#if showSocialFields}
          <div class="form-group">
            <label for="groom_instagram">Instagram</label>
            <input
              type="text"
              id="groom_instagram"
              name="groom_instagram"
              class="form-control"
              placeholder="cth: @yusuf_pratama"
            />
          </div>
          <div class="form-group">
            <label for="groom_photo">Foto Mempelai Pria (URL)</label>
            <input
              type="text"
              id="groom_photo"
              name="groom_photo"
              class="form-control"
              placeholder="https://image-hosting.com/foto-pria.jpg"
            />
          </div>
        {/if}
      </div>
      {#if showSecondaryPerson && !isWeddingCategory}
        <div class="form-col">
          <h3 class="col-title">{secondaryTitle}</h3>
          <div class="form-group">
            <label for="bride_name">{secondaryNameLabel}</label>
            <input
              type="text"
              id="bride_name"
              name="bride_name"
              class="form-control"
              placeholder="cth: Nama Orang Tua"
              bind:value={brideName}
              required
            />
          </div>
          <div class="form-group">
            <label for="bride_full_name">{secondaryFullNameLabel}</label>
            <input
              type="text"
              id="bride_full_name"
              name="bride_full_name"
              class="form-control"
              placeholder="cth: Nama Lengkap Orang Tua"
              bind:value={brideFullName}
            />
          </div>
          <div class="form-group">
            <label for="bride_parents">{secondaryParentsLabel}</label>
            <input
              type="text"
              id="bride_parents"
              name="bride_parents"
              class="form-control"
              placeholder="cth: Keterangan keluarga"
              bind:value={brideParents}
            />
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Step 3: Event -->
  <div class="step-content" class:visible={currentStep === 3}>
    <h2 class="step-title">Detail Acara</h2>
    <div class="form-group">
      <label for="slug">URL Undangan *</label>
      <div class="input-prefix">
        <span>/invitation/</span>
        <input
          type="text"
          id="slug"
          name="slug"
          class="form-control"
          placeholder="indri-adi"
          bind:value={slug}
          required
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-col">
        <h3 class="col-title">{primaryEventLabel}</h3>
        <div class="form-group">
          <label for="akad_date">Tanggal</label>
          <input
            type="date"
            id="akad_date"
            name="akad_date"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label for="akad_time">Waktu</label>
          <input
            type="text"
            id="akad_time"
            name="akad_time"
            class="form-control"
            placeholder="cth: 09.00 WIB - Selesai"
          />
        </div>
      </div>
      <div class="form-col">
        <h3 class="col-title">{secondaryEventLabel}</h3>
        <div class="form-group">
          <label for="resepsi_date">Tanggal</label>
          <input
            type="date"
            id="resepsi_date"
            name="resepsi_date"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label for="resepsi_time">Waktu</label>
          <input
            type="text"
            id="resepsi_time"
            name="resepsi_time"
            class="form-control"
            placeholder="cth: 10.00 WIB - Selesai"
          />
        </div>
      </div>
    </div>
    <div class="form-group">
      <label for="venue_name">Nama Tempat</label>
      <input
        type="text"
        id="venue_name"
        name="venue_name"
        class="form-control"
        placeholder="cth: Grand Ballroom Hotel Mulia"
      />
    </div>
    <div class="form-group">
      <label for="venue_address">Alamat Lengkap</label>
      <textarea
        id="venue_address"
        name="venue_address"
        class="form-control"
        placeholder="cth: Jl. Asia Afrika No.1, Senayan, Jakarta Pusat"
      ></textarea>
    </div>
    <div class="form-group">
      <label for="venue_map_url">Link Google Maps</label>
      <input
        type="url"
        id="venue_map_url"
        name="venue_map_url"
        class="form-control"
        placeholder="https://maps.app.goo.gl/..."
      />
    </div>
  </div>

  <!-- Step 4: Details -->
  <div class="step-content" class:visible={currentStep === 4}>
    <h2 class="step-title">Detail Tambahan</h2>
    <div class="form-group">
      <label for="quote">{quoteLabel}</label>
      <textarea
        id="quote"
        name="quote"
        class="form-control"
        placeholder="Masukkan kutipan atau ayat suci"
        bind:value={quote}
      ></textarea>
    </div>
    <div class="form-group">
      <label for="quote_source">Sumber Kutipan</label>
      <input
        type="text"
        id="quote_source"
        name="quote_source"
        class="form-control"
        placeholder="cth: QS Ar-Rum : 21"
        bind:value={quoteSource}
      />
    </div>
    <div class="form-group">
      <label for="love_story">{storyLabel}</label>
      <textarea
        id="love_story"
        name="love_story"
        class="form-control"
        rows="5"
        placeholder={storyPlaceholder}
      ></textarea>
    </div>
    <div class="form-group">
      <label for="music_url"
        >Link Musik Background (MP3/Soundcloud/Youtube)</label
      >
      <input
        type="text"
        id="music_url"
        name="music_url"
        class="form-control"
        placeholder="cth: https://www.bensound.com/music.mp3 (Kosongkan untuk pakai musik default)"
      />
    </div>

    <h3 class="col-title" style="margin-top: 2rem; margin-bottom: 1rem;">
      🎨 Media Utama
    </h3>
    <div class="form-group">
      <label for="background_image">Background Halaman Depan (URL Foto)</label>
      <p
        class="dash-header-sub"
        style="margin-bottom:0.5rem; font-size: 0.8rem;"
      >
        Pisahkan dengan ENTER (baris baru) jika ingin memasukkan lebih dari satu
        foto. Foto akan dipilih secara acak saat undangan dibuka.
      </p>
      <textarea
        id="background_image"
        name="background_image"
        class="form-control"
        rows="3"
        placeholder="/uploads/foto1.jpg&#10;/uploads/foto2.jpg"
      ></textarea>
    </div>

    <div class="form-group">
      <label for="gallery_images">Galeri Pre-Wedding (URL Foto)</label>
      <p
        class="dash-header-sub"
        style="margin-bottom:0.5rem; font-size: 0.8rem;"
      >
        Pisahkan dengan ENTER (baris baru). Foto-foto ini akan ditampilkan di
        bagian Galeri undangan.
      </p>
      <textarea
        id="gallery_images"
        name="gallery_images"
        class="form-control"
        rows="5"
        placeholder="/uploads/galeri1.jpg&#10;/uploads/galeri2.jpg"
      ></textarea>
    </div>

    <!-- Bank Accounts -->
    <div class="form-section">
      <div class="section-header">
        <h3>Rekening (Wedding Gift)</h3>
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          onclick={addBankAccount}>+ Tambah</button
        >
      </div>
      {#each bankAccounts as account, i}
        <div class="bank-row">
          <input
            type="text"
            class="form-control"
            placeholder="Nama Bank"
            bind:value={account.bank}
          />
          <input
            type="text"
            class="form-control"
            placeholder="No. Rekening"
            bind:value={account.number}
          />
          <input
            type="text"
            class="form-control"
            placeholder="Atas Nama"
            bind:value={account.name}
          />
          {#if bankAccounts.length > 1}
            <button
              type="button"
              class="btn btn-danger btn-sm"
              onclick={() => removeBankAccount(i)}>✕</button
            >
          {/if}
        </div>
      {/each}
      <input
        type="hidden"
        name="bank_accounts"
        value={JSON.stringify(bankAccounts)}
      />
    </div>

    {#if isWeddingCategory}
      <!-- Dress Code -->
      <div class="form-section">
        <div class="section-header">
          <h3>Dress Code Colors</h3>
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            onclick={addDressColor}>+ Tambah</button
          >
        </div>
        <div class="color-picker-row">
          {#each dressColors as color, i}
            <div class="color-picker-item">
              <input type="color" bind:value={dressColors[i]} />
              {#if dressColors.length > 1}
                <button
                  type="button"
                  class="color-remove"
                  onclick={() => removeDressColor(i)}>✕</button
                >
              {/if}
            </div>
          {/each}
        </div>
        <input
          type="hidden"
          name="dress_code_colors"
          value={JSON.stringify(dressColors)}
        />
      </div>
    {/if}
  </div>

  <!-- Navigation Buttons -->
  <div class="step-nav">
    {#if currentStep > 1}
      <button
        type="button"
        class="btn btn-secondary"
        onclick={() => currentStep--}
      >
        ← Sebelumnya
      </button>
    {:else}
      <div></div>
    {/if}

    {#if currentStep < 4}
      <button
        type="button"
        class="btn btn-primary"
        onclick={() => currentStep++}
      >
        Selanjutnya →
      </button>
    {:else}
      <button type="submit" class="btn btn-success"> 💍 Buat Undangan </button>
    {/if}
  </div>
</form>

<style>
  .steps-bar {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    background: var(--dash-surface);
    border: 1px solid var(--dash-border);
    border-radius: 12px;
    padding: 0.75rem;
  }
  .step-item {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    color: var(--dash-text-muted);
    font-size: 0.85rem;
    transition: all 0.3s;
  }
  .step-item.active {
    background: var(--dash-accent);
    color: white;
  }
  .step-item.completed {
    color: var(--color-success);
  }
  .step-num {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid currentColor;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    flex-shrink: 0;
  }
  .step-item.active .step-num {
    background: white;
    color: var(--dash-accent);
    border-color: white;
  }
  .step-label {
    display: none;
  }
  @media (min-width: 600px) {
    .step-label {
      display: inline;
    }
  }

  .step-content {
    display: none;
    animation: fadeInUp 0.4s ease;
  }
  .step-content.visible {
    display: block;
  }
  .step-title {
    font-family: var(--font-serif);
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
    color: var(--dash-text);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  @media (max-width: 700px) {
    .form-row {
      grid-template-columns: 1fr;
    }
  }
  .col-title {
    font-size: 1rem;
    margin-bottom: 1rem;
    color: var(--dash-text);
  }

  .input-prefix {
    display: flex;
    align-items: center;
    background: var(--dash-bg);
    border: 1px solid var(--dash-border);
    border-radius: 10px;
    overflow: hidden;
  }
  .input-prefix span {
    padding: 0 0.75rem;
    color: var(--dash-text-muted);
    font-size: 0.9rem;
    white-space: nowrap;
  }
  .input-prefix .form-control {
    border: none;
    border-left: 1px solid var(--dash-border);
    border-radius: 0;
  }

  .step-header-row {
    margin-bottom: 1rem;
  }
  .step-subtitle {
    color: var(--dash-text-muted);
    font-size: 0.9rem;
    line-height: 1.55;
    margin-top: 0.35rem;
    max-width: 42rem;
  }

  .template-category-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    margin-bottom: 1.25rem;
    padding-bottom: 0.25rem;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
  }

  .category-chip {
    flex-shrink: 0;
    border: 1px solid var(--dash-border);
    background: rgba(255, 255, 255, 0.03);
    color: var(--dash-text-muted);
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.4rem 0.75rem;
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: all var(--transition-base);
    font-family: inherit;
  }

  .category-chip:hover {
    border-color: rgba(108, 99, 255, 0.45);
    color: var(--dash-text);
  }

  .category-chip--active {
    background: var(--dash-accent);
    border-color: var(--dash-accent);
    color: #fff;
  }

  .template-empty {
    color: var(--dash-text-muted);
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  .template-selector {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  .template-option {
    cursor: pointer;
    border: 1px solid var(--dash-border);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s;
    background: var(--dash-surface);
    display: flex;
    flex-direction: column;
  }
  .template-option.selected {
    border-color: var(--dash-accent);
    box-shadow: 0 0 0 4px rgba(108, 99, 255, 0.15);
  }
  .template-option input {
    display: none;
  }
  .template-thumb-container {
    height: 200px;
    position: relative;
    overflow: hidden;
  }
  .template-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }
  .template-option:hover .template-img {
    transform: scale(1.05);
  }
  .selected-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(108, 99, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .check-icon {
    background: var(--dash-accent);
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  .template-opt-info {
    padding: 1.25rem;
    flex: 1;
  }
  .info-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
    gap: 0.5rem;
  }
  .info-top-text {
    min-width: 0;
    flex: 1;
  }
  .template-category-pill {
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--dash-accent);
    background: rgba(108, 99, 255, 0.12);
    border: 1px solid rgba(108, 99, 255, 0.25);
    padding: 0.2rem 0.45rem;
    border-radius: 6px;
    margin-bottom: 0.35rem;
  }
  .template-opt-info h4 {
    font-size: 1.1rem;
    margin: 0;
  }
  .btn-preview {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--dash-border);
    color: var(--dash-text-muted);
    font-size: 0.75rem;
    padding: 0.35rem 0.6rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-preview:hover {
    background: var(--dash-bg);
    color: var(--dash-text);
  }
  .template-opt-info p {
    font-size: 0.85rem;
    color: var(--dash-text-muted);
    line-height: 1.5;
    margin: 0;
  }

  /* Modal Styles */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  .preview-modal {
    background: var(--dash-surface);
    width: 100%;
    max-width: 600px;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    animation: modalFadeIn 0.3s ease;
  }
  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  .modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--dash-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .modal-header h3 {
    margin: 0;
    font-family: var(--font-serif);
  }
  .close-btn {
    background: none;
    border: none;
    color: var(--dash-text-muted);
    font-size: 1.25rem;
    cursor: pointer;
  }
  .modal-body.demo-body {
    padding: 0;
    background: #f1f5f9;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .iframe-container {
    width: 100%;
    max-width: 414px;
    height: 750px;
    margin: 1.5rem auto;
    border-radius: 40px;
    overflow: hidden;
    border: 10px solid #1e293b;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
    background: white;
  }
  .iframe-container iframe {
    width: 100%;
    height: 100%;
  }
  .preview-details {
    padding: 1.5rem;
    background: var(--dash-surface);
    width: 100%;
    border-top: 1px solid var(--dash-border);
  }
  .color-chips {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  .chip {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  .modal-footer {
    padding: 1.5rem;
    border-top: 1px solid var(--dash-border);
  }

  .form-section {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--dash-border);
  }
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  .section-header h3 {
    font-size: 1rem;
  }

  .bank-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr auto;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  @media (max-width: 700px) {
    .bank-row {
      grid-template-columns: 1fr;
    }
  }

  .color-picker-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  .color-picker-item {
    position: relative;
  }
  .color-picker-item input[type="color"] {
    width: 50px;
    height: 50px;
    border: 2px solid var(--dash-border);
    border-radius: 10px;
    cursor: pointer;
    padding: 2px;
  }
  .color-remove {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 18px;
    height: 18px;
    background: var(--color-danger);
    color: white;
    border-radius: 50%;
    font-size: 0.65rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .step-nav {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--dash-border);
  }

  .dash-header-sub {
    color: var(--dash-text-muted);
    font-size: 0.95rem;
    margin-top: 0.25rem;
  }
</style>
