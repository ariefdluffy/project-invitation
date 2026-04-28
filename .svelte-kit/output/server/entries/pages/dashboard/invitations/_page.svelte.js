import "../../../../chunks/environment.js";
import { H as attr, U as escape_html, W as FILENAME, a as attr_style, c as head, i as attr_class, n as pop_element, o as derived, r as push_element, s as ensure_array_like, u as stringify } from "../../../../chunks/dev.js";
import "../../../../chunks/toast.svelte.js";
import "../../../../chunks/client.js";
import "../../../../chunks/forms.js";
//#region src/routes/dashboard/invitations/+page.svelte
_page[FILENAME] = "src/routes/dashboard/invitations/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const isAtLimit = derived(() => data.user && data.invitations && data.user.role !== "admin" && data.invitations.length >= data.user.invitation_limit);
		function formatDate(dateStr) {
			if (!dateStr || dateStr === "0000-00-00") return null;
			try {
				const d = new Date(dateStr);
				if (isNaN(d.getTime())) return null;
				return d.toLocaleDateString("id-ID", {
					day: "numeric",
					month: "long",
					year: "numeric"
				});
			} catch (e) {
				return null;
			}
		}
		head("1yv0tks", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Undangan Saya - ${escape_html(data.appName)}</title>`);
			});
		});
		$$renderer.push(`<div class="dash-header">`);
		push_element($$renderer, "div", 40, 0);
		$$renderer.push(`<div>`);
		push_element($$renderer, "div", 41, 1);
		$$renderer.push(`<h1>`);
		push_element($$renderer, "h1", 42, 2);
		$$renderer.push(`Undangan Saya</h1>`);
		pop_element();
		$$renderer.push(` <p class="dash-header-sub svelte-1yv0tks">`);
		push_element($$renderer, "p", 43, 2);
		$$renderer.push(`Kelola semua undangan pernikahanmu</p>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		if (!isAtLimit()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<a href="/dashboard/create" class="btn btn-primary">`);
			push_element($$renderer, "a", 46, 2);
			$$renderer.push(`+ Buat Baru</a>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		pop_element();
		$$renderer.push(` `);
		if (isAtLimit()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="dash-banner warning" style="margin-bottom: 2rem;">`);
			push_element($$renderer, "div", 53, 1);
			$$renderer.push(`<div class="banner-content">`);
			push_element($$renderer, "div", 54, 2);
			$$renderer.push(`<span class="banner-icon">`);
			push_element($$renderer, "span", 55, 3);
			$$renderer.push(`💡</span>`);
			pop_element();
			$$renderer.push(` <div class="banner-text">`);
			push_element($$renderer, "div", 56, 3);
			$$renderer.push(`<strong>`);
			push_element($$renderer, "strong", 57, 4);
			$$renderer.push(`Limit Tercapai</strong>`);
			pop_element();
			$$renderer.push(` <p>`);
			push_element($$renderer, "p", 58, 4);
			$$renderer.push(`Anda telah membuat ${escape_html(data.invitations.length)} dari ${escape_html(data.user?.invitation_limit)} undangan yang diizinkan. Hubungi admin untuk menambah kuota.</p>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (!data.invitations || data.invitations.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="dash-card">`);
			push_element($$renderer, "div", 65, 1);
			$$renderer.push(`<div class="empty-state svelte-1yv0tks">`);
			push_element($$renderer, "div", 66, 2);
			$$renderer.push(`<div class="empty-icon svelte-1yv0tks">`);
			push_element($$renderer, "div", 67, 3);
			$$renderer.push(`📋</div>`);
			pop_element();
			$$renderer.push(` <h3 class="svelte-1yv0tks">`);
			push_element($$renderer, "h3", 68, 3);
			$$renderer.push(`Belum ada undangan</h3>`);
			pop_element();
			$$renderer.push(` <p class="svelte-1yv0tks">`);
			push_element($$renderer, "p", 69, 3);
			$$renderer.push(`Buat undangan pertamamu sekarang</p>`);
			pop_element();
			$$renderer.push(` <a href="/dashboard/create" class="btn btn-primary">`);
			push_element($$renderer, "a", 70, 3);
			$$renderer.push(`Buat Undangan</a>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="inv-grid svelte-1yv0tks">`);
			push_element($$renderer, "div", 74, 1);
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(data.invitations);
			for (let i = 0, $$length = each_array.length; i < $$length; i++) {
				let inv = each_array[i];
				$$renderer.push(`<div class="inv-card svelte-1yv0tks"${attr_style(`animation: fadeInUp 0.5s ease ${stringify(i * .1)}s both`)}>`);
				push_element($$renderer, "div", 76, 3);
				$$renderer.push(`<div class="inv-card-top svelte-1yv0tks">`);
				push_element($$renderer, "div", 77, 4);
				$$renderer.push(`<div class="inv-status svelte-1yv0tks">`);
				push_element($$renderer, "div", 78, 5);
				$$renderer.push(`<span${attr_class(`badge-dot ${stringify(inv.is_published ? "active" : "draft")}`, "svelte-1yv0tks")}>`);
				push_element($$renderer, "span", 79, 6);
				$$renderer.push(`</span>`);
				pop_element();
				$$renderer.push(` <span class="status-text svelte-1yv0tks">`);
				push_element($$renderer, "span", 80, 6);
				$$renderer.push(`${escape_html(inv.is_published ? "Aktif / Terbit" : "Draft / Konsep")}</span>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` <div class="inv-template-tag svelte-1yv0tks">`);
				push_element($$renderer, "div", 82, 5);
				$$renderer.push(`Template: ${escape_html(inv.template_id.replace("-", " "))}</div>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` <div class="inv-card-body svelte-1yv0tks">`);
				push_element($$renderer, "div", 85, 4);
				$$renderer.push(`<h3 class="couple-names svelte-1yv0tks">`);
				push_element($$renderer, "h3", 86, 5);
				$$renderer.push(`${escape_html(inv.bride_name)} &amp; ${escape_html(inv.groom_name)}</h3>`);
				pop_element();
				$$renderer.push(` <div class="inv-info-row svelte-1yv0tks">`);
				push_element($$renderer, "div", 87, 5);
				$$renderer.push(`<span class="info-label svelte-1yv0tks">`);
				push_element($$renderer, "span", 88, 6);
				$$renderer.push(`URL:</span>`);
				pop_element();
				$$renderer.push(` <code class="slug-text svelte-1yv0tks">`);
				push_element($$renderer, "code", 89, 6);
				$$renderer.push(`/${escape_html(inv.slug)}</code>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` `);
				if (formatDate(inv.akad_date)) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="inv-info-row svelte-1yv0tks">`);
					push_element($$renderer, "div", 92, 6);
					$$renderer.push(`<span class="info-label svelte-1yv0tks">`);
					push_element($$renderer, "span", 93, 7);
					$$renderer.push(`Acara:</span>`);
					pop_element();
					$$renderer.push(` <span class="date-text svelte-1yv0tks">`);
					push_element($$renderer, "span", 94, 7);
					$$renderer.push(`${escape_html(formatDate(inv.akad_date))}</span>`);
					pop_element();
					$$renderer.push(`</div>`);
					pop_element();
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
				pop_element();
				$$renderer.push(` <div class="inv-card-footer svelte-1yv0tks">`);
				push_element($$renderer, "div", 99, 4);
				$$renderer.push(`<a${attr("href", `/dashboard/invitations/${stringify(inv.id)}`)} class="btn-action primary svelte-1yv0tks" title="Edit Data">`);
				push_element($$renderer, "a", 100, 5);
				$$renderer.push(`<span class="svelte-1yv0tks">`);
				push_element($$renderer, "span", 101, 6);
				$$renderer.push(`✏️</span>`);
				pop_element();
				$$renderer.push(` Kelola</a>`);
				pop_element();
				$$renderer.push(` <form method="POST" action="?/duplicate" style="flex: 1;">`);
				push_element($$renderer, "form", 103, 5);
				$$renderer.push(`<input type="hidden" name="id"${attr("value", inv.id)}/>`);
				push_element($$renderer, "input", 104, 6);
				pop_element();
				$$renderer.push(` <button type="submit" class="btn-action secondary w-full svelte-1yv0tks" title="Copy data ke undangan baru">`);
				push_element($$renderer, "button", 105, 6);
				$$renderer.push(`<span class="svelte-1yv0tks">`);
				push_element($$renderer, "span", 106, 7);
				$$renderer.push(`👯</span>`);
				pop_element();
				$$renderer.push(` Duplikat</button>`);
				pop_element();
				$$renderer.push(`</form>`);
				pop_element();
				$$renderer.push(` `);
				if (inv.is_published) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<a${attr("href", `/invitation/${stringify(inv.slug)}`)} target="_blank" class="btn-action secondary svelte-1yv0tks" title="Lihat Tampilan">`);
					push_element($$renderer, "a", 110, 6);
					$$renderer.push(`<span class="svelte-1yv0tks">`);
					push_element($$renderer, "span", 111, 7);
					$$renderer.push(`👁️</span>`);
					pop_element();
					$$renderer.push(` Lihat</a>`);
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
		$$renderer.push(`<!--]-->`);
	}, _page);
}
_page.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
export { _page as default };
