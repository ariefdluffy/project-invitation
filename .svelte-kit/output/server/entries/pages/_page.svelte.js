import { H as attr, U as escape_html, W as FILENAME, a as attr_style, c as head, i as attr_class, n as pop_element, r as push_element, s as ensure_array_like, u as stringify } from "../../chunks/dev.js";
//#region src/routes/+page.svelte
_page[FILENAME] = "src/routes/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let scrollY = 0;
		let visible = false;
		const features = [
			{
				icon: "✨",
				title: "Desain Premium",
				desc: "Template elegan yang dirancang dengan penuh cinta dan perhatian detail."
			},
			{
				icon: "📱",
				title: "Responsive",
				desc: "Tampil sempurna di semua perangkat, dari smartphone hingga desktop."
			},
			{
				icon: "🎵",
				title: "Musik & Animasi",
				desc: "Tambahkan musik latar dan animasi smooth untuk pengalaman yang memorable."
			},
			{
				icon: "💌",
				title: "RSVP Online",
				desc: "Kelola daftar tamu dan ucapan selamat secara digital."
			},
			{
				icon: "🎨",
				title: "Kustomisasi",
				desc: "Sesuaikan warna, font, dan konten sesuai keinginanmu."
			},
			{
				icon: "📍",
				title: "Integrasi Maps",
				desc: "Lokasi acara terintegrasi dengan Google Maps."
			}
		];
		head("1uha8ag", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(data.appName)} - Buat Undangan Digital Premium</title>`);
			});
			$$renderer.push(`<meta name="description"${attr("content", `Buat undangan pernikahan digital yang modern, elegan, dan mudah dibagikan dengan ${stringify(data.appName)}. Pilih dari berbagai template premium.`)}/>`);
			push_element($$renderer, "meta", 48, 1);
			pop_element();
		});
		$$renderer.push(`<nav${attr_class("navbar svelte-1uha8ag", void 0, { "scrolled": scrollY > 50 })}>`);
		push_element($$renderer, "nav", 57, 0);
		$$renderer.push(`<div class="nav-container svelte-1uha8ag">`);
		push_element($$renderer, "div", 58, 1);
		$$renderer.push(`<a href="/" class="nav-logo svelte-1uha8ag">`);
		push_element($$renderer, "a", 59, 2);
		$$renderer.push(`${escape_html(data.appName)}</a>`);
		pop_element();
		$$renderer.push(` <div class="nav-links svelte-1uha8ag">`);
		push_element($$renderer, "div", 60, 2);
		$$renderer.push(`<a href="#templates" class="svelte-1uha8ag">`);
		push_element($$renderer, "a", 61, 3);
		$$renderer.push(`Template</a>`);
		pop_element();
		$$renderer.push(` <a href="#features" class="svelte-1uha8ag">`);
		push_element($$renderer, "a", 62, 3);
		$$renderer.push(`Fitur</a>`);
		pop_element();
		$$renderer.push(` `);
		if (data.user) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<a${attr("href", data.user.role === "admin" ? "/admin" : "/dashboard")} class="nav-btn svelte-1uha8ag">`);
			push_element($$renderer, "a", 64, 4);
			$$renderer.push(`Dashboard</a>`);
			pop_element();
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<a href="/login" class="nav-btn svelte-1uha8ag">`);
			push_element($$renderer, "a", 69, 4);
			$$renderer.push(`Masuk</a>`);
			pop_element();
		}
		$$renderer.push(`<!--]--></div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</nav>`);
		pop_element();
		$$renderer.push(` <section${attr_class("hero svelte-1uha8ag", void 0, { "visible": visible })}>`);
		push_element($$renderer, "section", 76, 0);
		$$renderer.push(`<div class="hero-particles svelte-1uha8ag">`);
		push_element($$renderer, "div", 77, 1);
		$$renderer.push(`<!--[-->`);
		const each_array = ensure_array_like(Array(20));
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			each_array[i];
			$$renderer.push(`<div class="particle svelte-1uha8ag"${attr_style(`--delay: ${stringify(i * .3)}s; --x: ${stringify(Math.random() * 100)}%; --y: ${stringify(Math.random() * 100)}%; --size: ${stringify(2 + Math.random() * 4)}px`)}>`);
			push_element($$renderer, "div", 79, 3);
			$$renderer.push(`</div>`);
			pop_element();
		}
		$$renderer.push(`<!--]--></div>`);
		pop_element();
		$$renderer.push(` <div class="hero-content svelte-1uha8ag">`);
		push_element($$renderer, "div", 87, 1);
		$$renderer.push(`<span class="hero-badge svelte-1uha8ag">`);
		push_element($$renderer, "span", 88, 2);
		$$renderer.push(`✨ Platform Undangan Digital #1</span>`);
		pop_element();
		$$renderer.push(` <h1 class="hero-title svelte-1uha8ag">`);
		push_element($$renderer, "h1", 89, 2);
		$$renderer.push(`Buat Undangan Pernikahan <span class="hero-gradient svelte-1uha8ag">`);
		push_element($$renderer, "span", 91, 3);
		$$renderer.push(`Digital yang Memukau</span>`);
		pop_element();
		$$renderer.push(`</h1>`);
		pop_element();
		$$renderer.push(` <p class="hero-subtitle svelte-1uha8ag">`);
		push_element($$renderer, "p", 93, 2);
		$$renderer.push(`Wujudkan momen spesialmu dengan undangan digital yang modern,
			elegan, dan mudah dibagikan ke seluruh tamu undangan.</p>`);
		pop_element();
		$$renderer.push(` <div class="hero-actions svelte-1uha8ag">`);
		push_element($$renderer, "div", 97, 2);
		$$renderer.push(`<a href="/register" class="hero-btn primary svelte-1uha8ag">`);
		push_element($$renderer, "a", 98, 3);
		$$renderer.push(`Mulai Buat Undangan <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">`);
		push_element($$renderer, "svg", 100, 4);
		$$renderer.push(`<path d="M5 12h14M12 5l7 7-7 7">`);
		push_element($$renderer, "path", 106, 22);
		$$renderer.push(`</path>`);
		pop_element();
		$$renderer.push(`</svg>`);
		pop_element();
		$$renderer.push(`</a>`);
		pop_element();
		$$renderer.push(` <a href="#templates" class="hero-btn secondary svelte-1uha8ag">`);
		push_element($$renderer, "a", 109, 3);
		$$renderer.push(`Lihat Template</a>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="hero-stats svelte-1uha8ag">`);
		push_element($$renderer, "div", 111, 2);
		$$renderer.push(`<div class="stat-item svelte-1uha8ag">`);
		push_element($$renderer, "div", 112, 3);
		$$renderer.push(`<span class="stat-number svelte-1uha8ag">`);
		push_element($$renderer, "span", 113, 4);
		$$renderer.push(`1000+</span>`);
		pop_element();
		$$renderer.push(` <span class="stat-label svelte-1uha8ag">`);
		push_element($$renderer, "span", 114, 4);
		$$renderer.push(`Undangan Dibuat</span>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="stat-divider svelte-1uha8ag">`);
		push_element($$renderer, "div", 116, 3);
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="stat-item svelte-1uha8ag">`);
		push_element($$renderer, "div", 117, 3);
		$$renderer.push(`<span class="stat-number svelte-1uha8ag">`);
		push_element($$renderer, "span", 118, 4);
		$$renderer.push(`${escape_html(data.templates.length)}</span>`);
		pop_element();
		$$renderer.push(` <span class="stat-label svelte-1uha8ag">`);
		push_element($$renderer, "span", 119, 4);
		$$renderer.push(`Template Premium</span>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="stat-divider svelte-1uha8ag">`);
		push_element($$renderer, "div", 121, 3);
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="stat-item svelte-1uha8ag">`);
		push_element($$renderer, "div", 122, 3);
		$$renderer.push(`<span class="stat-number svelte-1uha8ag">`);
		push_element($$renderer, "span", 123, 4);
		$$renderer.push(`100%</span>`);
		pop_element();
		$$renderer.push(` <span class="stat-label svelte-1uha8ag">`);
		push_element($$renderer, "span", 124, 4);
		$$renderer.push(`Murah</span>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="hero-visual svelte-1uha8ag">`);
		push_element($$renderer, "div", 128, 1);
		$$renderer.push(`<div class="phone-mockup svelte-1uha8ag">`);
		push_element($$renderer, "div", 129, 2);
		$$renderer.push(`<div class="phone-screen svelte-1uha8ag">`);
		push_element($$renderer, "div", 130, 3);
		$$renderer.push(`<div class="mockup-header svelte-1uha8ag">`);
		push_element($$renderer, "div", 131, 4);
		$$renderer.push(`<span class="mockup-label svelte-1uha8ag">`);
		push_element($$renderer, "span", 132, 5);
		$$renderer.push(`THE WEDDING OF</span>`);
		pop_element();
		$$renderer.push(` <span class="mockup-names svelte-1uha8ag">`);
		push_element($$renderer, "span", 133, 5);
		$$renderer.push(`Indri &amp; Adi</span>`);
		pop_element();
		$$renderer.push(` <span class="mockup-date svelte-1uha8ag">`);
		push_element($$renderer, "span", 134, 5);
		$$renderer.push(`04 . 04 . 2026</span>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</section>`);
		pop_element();
		$$renderer.push(` <section id="templates" class="templates-section svelte-1uha8ag">`);
		push_element($$renderer, "section", 142, 0);
		$$renderer.push(`<div class="section-container svelte-1uha8ag">`);
		push_element($$renderer, "div", 143, 1);
		$$renderer.push(`<span class="section-badge svelte-1uha8ag">`);
		push_element($$renderer, "span", 144, 2);
		$$renderer.push(`Template</span>`);
		pop_element();
		$$renderer.push(` <h2 class="section-title svelte-1uha8ag">`);
		push_element($$renderer, "h2", 145, 2);
		$$renderer.push(`Pilih Template Favoritmu</h2>`);
		pop_element();
		$$renderer.push(` <p class="section-subtitle svelte-1uha8ag">`);
		push_element($$renderer, "p", 146, 2);
		$$renderer.push(`Setiap template dirancang khusus oleh designer profesional untuk
			momen spesialmu</p>`);
		pop_element();
		$$renderer.push(` <div class="templates-grid svelte-1uha8ag">`);
		push_element($$renderer, "div", 151, 2);
		$$renderer.push(`<!--[-->`);
		const each_array_1 = ensure_array_like(data.templates);
		for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
			let template = each_array_1[i];
			$$renderer.push(`<div class="template-card svelte-1uha8ag"${attr_style(`animation-delay: ${stringify(i * .15)}s`)}>`);
			push_element($$renderer, "div", 153, 4);
			$$renderer.push(`<div class="template-preview svelte-1uha8ag"${attr_style(`background: linear-gradient(135deg, ${stringify(template.primary_color)}, ${stringify(template.secondary_color)})`)}>`);
			push_element($$renderer, "div", 154, 5);
			$$renderer.push(`<div class="template-preview-content svelte-1uha8ag">`);
			push_element($$renderer, "div", 158, 6);
			$$renderer.push(`<span class="preview-label svelte-1uha8ag"${attr_style(`color: ${stringify(template.accent_color)}`)}>`);
			push_element($$renderer, "span", 159, 7);
			$$renderer.push(`THE WEDDING OF</span>`);
			pop_element();
			$$renderer.push(` <span class="preview-names svelte-1uha8ag"${attr_style(`font-family: ${stringify(template.font_family)}, serif; color: ${stringify(template.accent_color)}`)}>`);
			push_element($$renderer, "span", 164, 7);
			$$renderer.push(`Romeo &amp; Juliet</span>`);
			pop_element();
			$$renderer.push(` <span class="preview-date svelte-1uha8ag"${attr_style(`color: ${stringify(template.accent_color)}`)}>`);
			push_element($$renderer, "span", 169, 7);
			$$renderer.push(`04 . 04 . 2026</span>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(` <div class="template-overlay svelte-1uha8ag">`);
			push_element($$renderer, "div", 175, 6);
			$$renderer.push(`<a href="/register" class="btn btn-primary">`);
			push_element($$renderer, "a", 176, 7);
			$$renderer.push(`Gunakan Template</a>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(` <div class="template-info svelte-1uha8ag">`);
			push_element($$renderer, "div", 181, 5);
			$$renderer.push(`<h3 class="svelte-1uha8ag">`);
			push_element($$renderer, "h3", 182, 6);
			$$renderer.push(`${escape_html(template.name)}</h3>`);
			pop_element();
			$$renderer.push(` <p class="svelte-1uha8ag">`);
			push_element($$renderer, "p", 183, 6);
			$$renderer.push(`${escape_html(template.description)}</p>`);
			pop_element();
			$$renderer.push(` <div class="template-colors svelte-1uha8ag">`);
			push_element($$renderer, "div", 184, 6);
			$$renderer.push(`<span class="color-dot svelte-1uha8ag"${attr_style(`background: ${stringify(template.primary_color)}`)}>`);
			push_element($$renderer, "span", 185, 7);
			$$renderer.push(`</span>`);
			pop_element();
			$$renderer.push(` <span class="color-dot svelte-1uha8ag"${attr_style(`background: ${stringify(template.secondary_color)}`)}>`);
			push_element($$renderer, "span", 189, 7);
			$$renderer.push(`</span>`);
			pop_element();
			$$renderer.push(` <span class="color-dot svelte-1uha8ag"${attr_style(`background: ${stringify(template.accent_color)}; border: 1px solid #ddd`)}>`);
			push_element($$renderer, "span", 193, 7);
			$$renderer.push(`</span>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		}
		$$renderer.push(`<!--]--></div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</section>`);
		pop_element();
		$$renderer.push(` <section id="features" class="features-section svelte-1uha8ag">`);
		push_element($$renderer, "section", 206, 0);
		$$renderer.push(`<div class="section-container svelte-1uha8ag">`);
		push_element($$renderer, "div", 207, 1);
		$$renderer.push(`<span class="section-badge svelte-1uha8ag">`);
		push_element($$renderer, "span", 208, 2);
		$$renderer.push(`Fitur</span>`);
		pop_element();
		$$renderer.push(` <h2 class="section-title svelte-1uha8ag">`);
		push_element($$renderer, "h2", 209, 2);
		$$renderer.push(`Semua yang Kamu Butuhkan</h2>`);
		pop_element();
		$$renderer.push(` <p class="section-subtitle svelte-1uha8ag">`);
		push_element($$renderer, "p", 210, 2);
		$$renderer.push(`Fitur lengkap untuk membuat undangan pernikahan digital yang
			sempurna</p>`);
		pop_element();
		$$renderer.push(` <div class="features-grid svelte-1uha8ag">`);
		push_element($$renderer, "div", 215, 2);
		$$renderer.push(`<!--[-->`);
		const each_array_2 = ensure_array_like(features);
		for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
			let feature = each_array_2[i];
			$$renderer.push(`<div class="feature-card svelte-1uha8ag"${attr_style(`animation-delay: ${stringify(i * .1)}s`)}>`);
			push_element($$renderer, "div", 217, 4);
			$$renderer.push(`<div class="feature-icon svelte-1uha8ag">`);
			push_element($$renderer, "div", 218, 5);
			$$renderer.push(`${escape_html(feature.icon)}</div>`);
			pop_element();
			$$renderer.push(` <h3 class="svelte-1uha8ag">`);
			push_element($$renderer, "h3", 219, 5);
			$$renderer.push(`${escape_html(feature.title)}</h3>`);
			pop_element();
			$$renderer.push(` <p class="svelte-1uha8ag">`);
			push_element($$renderer, "p", 220, 5);
			$$renderer.push(`${escape_html(feature.desc)}</p>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		}
		$$renderer.push(`<!--]--></div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</section>`);
		pop_element();
		$$renderer.push(` <section class="cta-section svelte-1uha8ag">`);
		push_element($$renderer, "section", 228, 0);
		$$renderer.push(`<div class="cta-bg svelte-1uha8ag">`);
		push_element($$renderer, "div", 229, 1);
		$$renderer.push(`<!--[-->`);
		const each_array_3 = ensure_array_like(Array(6));
		for (let i = 0, $$length = each_array_3.length; i < $$length; i++) {
			each_array_3[i];
			$$renderer.push(`<div class="cta-ring svelte-1uha8ag"${attr_style(`--delay: ${stringify(i * .5)}s; --size: ${stringify(200 + i * 100)}px`)}>`);
			push_element($$renderer, "div", 231, 3);
			$$renderer.push(`</div>`);
			pop_element();
		}
		$$renderer.push(`<!--]--></div>`);
		pop_element();
		$$renderer.push(` <div class="section-container cta-content svelte-1uha8ag">`);
		push_element($$renderer, "div", 237, 1);
		$$renderer.push(`<h2 class="svelte-1uha8ag">`);
		push_element($$renderer, "h2", 238, 2);
		$$renderer.push(`Siap Membuat Undangan Impianmu?</h2>`);
		pop_element();
		$$renderer.push(` <p class="svelte-1uha8ag">`);
		push_element($$renderer, "p", 239, 2);
		$$renderer.push(`Mulai buat undangan pernikahan digital yang memukau dalam hitungan
			menit</p>`);
		pop_element();
		$$renderer.push(` <a href="/register" class="hero-btn primary svelte-1uha8ag">`);
		push_element($$renderer, "a", 243, 2);
		$$renderer.push(`Buat Undangan Sekarang <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">`);
		push_element($$renderer, "svg", 245, 3);
		$$renderer.push(`<path d="M5 12h14M12 5l7 7-7 7">`);
		push_element($$renderer, "path", 251, 21);
		$$renderer.push(`</path>`);
		pop_element();
		$$renderer.push(`</svg>`);
		pop_element();
		$$renderer.push(`</a>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</section>`);
		pop_element();
		$$renderer.push(` <footer class="footer svelte-1uha8ag">`);
		push_element($$renderer, "footer", 258, 0);
		$$renderer.push(`<div class="section-container svelte-1uha8ag">`);
		push_element($$renderer, "div", 259, 1);
		$$renderer.push(`<div class="footer-content svelte-1uha8ag">`);
		push_element($$renderer, "div", 260, 2);
		$$renderer.push(`<div class="footer-brand svelte-1uha8ag">`);
		push_element($$renderer, "div", 261, 3);
		$$renderer.push(`<span class="footer-logo svelte-1uha8ag">`);
		push_element($$renderer, "span", 262, 4);
		$$renderer.push(`${escape_html(data.appName)}</span>`);
		pop_element();
		$$renderer.push(` <p class="svelte-1uha8ag">`);
		push_element($$renderer, "p", 263, 4);
		$$renderer.push(`Platform undangan pernikahan digital terbaik di Indonesia.</p>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="footer-links svelte-1uha8ag">`);
		push_element($$renderer, "div", 267, 3);
		$$renderer.push(`<a href="#templates" class="svelte-1uha8ag">`);
		push_element($$renderer, "a", 268, 4);
		$$renderer.push(`Template</a>`);
		pop_element();
		$$renderer.push(` <a href="#features" class="svelte-1uha8ag">`);
		push_element($$renderer, "a", 269, 4);
		$$renderer.push(`Fitur</a>`);
		pop_element();
		$$renderer.push(` <a href="/login" class="svelte-1uha8ag">`);
		push_element($$renderer, "a", 270, 4);
		$$renderer.push(`Masuk</a>`);
		pop_element();
		$$renderer.push(` <a href="/register" class="svelte-1uha8ag">`);
		push_element($$renderer, "a", 271, 4);
		$$renderer.push(`Daftar</a>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="footer-bottom svelte-1uha8ag">`);
		push_element($$renderer, "div", 274, 2);
		$$renderer.push(`<p>`);
		push_element($$renderer, "p", 275, 3);
		$$renderer.push(`© 2026 ${escape_html(data.appName)}. All rights reserved.</p>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</footer>`);
		pop_element();
	}, _page);
}
_page.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
export { _page as default };
