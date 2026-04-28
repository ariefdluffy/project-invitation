import { H as attr, U as escape_html, W as FILENAME, a as attr_style, c as head, i as attr_class, n as pop_element, o as derived, r as push_element, s as ensure_array_like, u as stringify } from "../../../chunks/dev.js";
//#region src/routes/dashboard/+page.svelte
_page[FILENAME] = "src/routes/dashboard/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const stats = derived(() => [
			{
				label: "Total Undangan",
				value: data.invitations.length,
				icon: "💌"
			},
			{
				label: "Hadir",
				value: data.guestStats.attending,
				icon: "🙋‍♂️"
			},
			{
				label: "Tidak Hadir",
				value: data.guestStats.not_attending,
				icon: "🙅‍♂️"
			},
			{
				label: "Belum Respon",
				value: data.guestStats.no_response,
				icon: "⏳"
			}
		]);
		head("x1i5gj", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Dashboard - ${escape_html(data.appName)}</title>`);
			});
		});
		$$renderer.push(`<div class="dash-header">`);
		push_element($$renderer, "div", 17, 0);
		$$renderer.push(`<div>`);
		push_element($$renderer, "div", 18, 1);
		$$renderer.push(`<h1>`);
		push_element($$renderer, "h1", 19, 2);
		$$renderer.push(`Selamat Datang, ${escape_html(data.user.username)}! 👋</h1>`);
		pop_element();
		$$renderer.push(` <p class="dash-header-sub svelte-x1i5gj">`);
		push_element($$renderer, "p", 20, 2);
		$$renderer.push(`Kelola undangan pernikahanmu di sini</p>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <a href="/dashboard/create" class="btn btn-primary">`);
		push_element($$renderer, "a", 22, 1);
		$$renderer.push(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">`);
		push_element($$renderer, "svg", 23, 2);
		$$renderer.push(`<circle cx="12" cy="12" r="10">`);
		push_element($$renderer, "circle", 23, 101);
		$$renderer.push(`</circle>`);
		pop_element();
		$$renderer.push(`<path d="M12 8v8M8 12h8">`);
		push_element($$renderer, "path", 23, 133);
		$$renderer.push(`</path>`);
		pop_element();
		$$renderer.push(`</svg>`);
		pop_element();
		$$renderer.push(` Buat Undangan</a>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		if (data.user.role !== "admin" && data.user.has_access !== 1) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="dash-banner warning svelte-x1i5gj" style="animation: slideInDown 0.5s ease">`);
			push_element($$renderer, "div", 29, 1);
			$$renderer.push(`<div class="banner-content svelte-x1i5gj">`);
			push_element($$renderer, "div", 30, 2);
			$$renderer.push(`<span class="banner-icon svelte-x1i5gj">`);
			push_element($$renderer, "span", 31, 3);
			$$renderer.push(`⚠️</span>`);
			pop_element();
			$$renderer.push(` <div class="banner-text svelte-x1i5gj">`);
			push_element($$renderer, "div", 32, 3);
			$$renderer.push(`<strong class="svelte-x1i5gj">`);
			push_element($$renderer, "strong", 33, 4);
			$$renderer.push(`Akun Belum Aktif</strong>`);
			pop_element();
			$$renderer.push(` <p class="svelte-x1i5gj">`);
			push_element($$renderer, "p", 34, 4);
			$$renderer.push(`Anda belum memiliki akses untuk membuat undangan. Silakan lakukan aktivasi akun Anda.</p>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(` <a href="/dashboard/billing" class="btn btn-primary btn-sm">`);
			push_element($$renderer, "a", 37, 2);
			$$renderer.push(`Aktivasi Akun</a>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="dash-stats">`);
		push_element($$renderer, "div", 42, 0);
		$$renderer.push(`<!--[-->`);
		const each_array = ensure_array_like(stats());
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			let stat = each_array[i];
			$$renderer.push(`<div class="dash-stat"${attr_style(`animation: fadeInUp 0.5s ease ${stringify(i * .1)}s both`)}>`);
			push_element($$renderer, "div", 44, 2);
			$$renderer.push(`<h3>`);
			push_element($$renderer, "h3", 45, 3);
			$$renderer.push(`${escape_html(stat.icon)} ${escape_html(stat.label)}</h3>`);
			pop_element();
			$$renderer.push(` <div class="value">`);
			push_element($$renderer, "div", 46, 3);
			$$renderer.push(`${escape_html(stat.value)}</div>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		}
		$$renderer.push(`<!--]--></div>`);
		pop_element();
		$$renderer.push(` <div class="dash-card">`);
		push_element($$renderer, "div", 52, 0);
		$$renderer.push(`<div class="card-header svelte-x1i5gj">`);
		push_element($$renderer, "div", 53, 1);
		$$renderer.push(`<h2 class="svelte-x1i5gj">`);
		push_element($$renderer, "h2", 54, 2);
		$$renderer.push(`Undangan Terbaru</h2>`);
		pop_element();
		$$renderer.push(` `);
		if (data.invitations.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<a href="/dashboard/invitations" class="btn btn-secondary btn-sm">`);
			push_element($$renderer, "a", 56, 3);
			$$renderer.push(`Lihat Semua</a>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		pop_element();
		$$renderer.push(` `);
		if (data.invitations.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="empty-state svelte-x1i5gj">`);
			push_element($$renderer, "div", 61, 2);
			$$renderer.push(`<div class="empty-icon svelte-x1i5gj">`);
			push_element($$renderer, "div", 62, 3);
			$$renderer.push(`💍</div>`);
			pop_element();
			$$renderer.push(` <h3 class="svelte-x1i5gj">`);
			push_element($$renderer, "h3", 63, 3);
			$$renderer.push(`Belum ada undangan</h3>`);
			pop_element();
			$$renderer.push(` <p class="svelte-x1i5gj">`);
			push_element($$renderer, "p", 64, 3);
			$$renderer.push(`Mulai buat undangan pernikahan digitalmu sekarang!</p>`);
			pop_element();
			$$renderer.push(` <a href="/dashboard/create" class="btn btn-primary">`);
			push_element($$renderer, "a", 65, 3);
			$$renderer.push(`Buat Undangan Pertama</a>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="invitation-list svelte-x1i5gj">`);
			push_element($$renderer, "div", 68, 2);
			$$renderer.push(`<!--[-->`);
			const each_array_1 = ensure_array_like(data.invitations.slice(0, 5));
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let inv = each_array_1[$$index_1];
				$$renderer.push(`<div class="invitation-item svelte-x1i5gj">`);
				push_element($$renderer, "div", 70, 4);
				$$renderer.push(`<div class="inv-info svelte-x1i5gj">`);
				push_element($$renderer, "div", 71, 5);
				$$renderer.push(`<h4 class="svelte-x1i5gj">`);
				push_element($$renderer, "h4", 72, 6);
				$$renderer.push(`${escape_html(inv.bride_name)} &amp; ${escape_html(inv.groom_name)}</h4>`);
				pop_element();
				$$renderer.push(` <span class="inv-slug svelte-x1i5gj">`);
				push_element($$renderer, "span", 73, 6);
				$$renderer.push(`/${escape_html(inv.slug)}</span>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` <div class="inv-meta svelte-x1i5gj">`);
				push_element($$renderer, "div", 75, 5);
				$$renderer.push(`<span${attr_class(`badge ${stringify(inv.is_published ? "badge-success" : "badge-warning")}`)}>`);
				push_element($$renderer, "span", 76, 6);
				$$renderer.push(`${escape_html(inv.is_published ? "Published" : "Draft")}</span>`);
				pop_element();
				$$renderer.push(` <a${attr("href", `/dashboard/invitations/${stringify(inv.id)}`)} class="btn btn-secondary btn-sm">`);
				push_element($$renderer, "a", 79, 6);
				$$renderer.push(`Edit</a>`);
				pop_element();
				$$renderer.push(` `);
				if (inv.is_published) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<a${attr("href", `/invitation/${stringify(inv.slug)}`)} target="_blank" class="btn btn-secondary btn-sm">`);
					push_element($$renderer, "a", 81, 7);
					$$renderer.push(`Preview</a>`);
					pop_element();
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
			}
			$$renderer.push(`<!--]--></div>`);
			pop_element();
		}
		$$renderer.push(`<!--]--></div>`);
		pop_element();
	}, _page);
}
_page.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
export { _page as default };
