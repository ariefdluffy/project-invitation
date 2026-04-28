import { H as attr, U as escape_html, W as FILENAME, c as head, n as pop_element, r as push_element, u as stringify } from "../../../chunks/dev.js";
//#region src/routes/login/+page.svelte
_page[FILENAME] = "src/routes/login/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		head("1x05zx6", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Masuk - ${escape_html(data.appName)}</title>`);
			});
			$$renderer.push(`<meta name="description"${attr("content", `Masuk ke akun ${stringify(data.appName)} untuk mengelola undangan pernikahanmu`)}/>`);
			push_element($$renderer, "meta", 8, 1);
			pop_element();
		});
		$$renderer.push(`<div class="auth-page">`);
		push_element($$renderer, "div", 11, 0);
		$$renderer.push(`<div class="auth-card">`);
		push_element($$renderer, "div", 12, 1);
		$$renderer.push(`<h1>`);
		push_element($$renderer, "h1", 13, 2);
		$$renderer.push(`${escape_html(data.appName)}</h1>`);
		pop_element();
		$$renderer.push(` <p>`);
		push_element($$renderer, "p", 14, 2);
		$$renderer.push(`Masuk ke akunmu untuk mengelola undangan</p>`);
		pop_element();
		$$renderer.push(` `);
		if (form?.error) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="error-message">`);
			push_element($$renderer, "div", 17, 3);
			$$renderer.push(`${escape_html(form.error)}</div>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <form method="POST">`);
		push_element($$renderer, "form", 20, 2);
		$$renderer.push(`<div class="form-group">`);
		push_element($$renderer, "div", 21, 3);
		$$renderer.push(`<label for="email">`);
		push_element($$renderer, "label", 22, 4);
		$$renderer.push(`Email</label>`);
		pop_element();
		$$renderer.push(` <input type="email" id="email" name="email" class="form-control" placeholder="masukkan email"${attr("value", form?.email ?? "")} required=""/>`);
		push_element($$renderer, "input", 23, 4);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="form-group">`);
		push_element($$renderer, "div", 33, 3);
		$$renderer.push(`<label for="password">`);
		push_element($$renderer, "label", 34, 4);
		$$renderer.push(`Password</label>`);
		pop_element();
		$$renderer.push(` <input type="password" id="password" name="password" class="form-control" placeholder="masukkan password" required=""/>`);
		push_element($$renderer, "input", 35, 4);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <button type="submit" class="btn btn-primary">`);
		push_element($$renderer, "button", 44, 3);
		$$renderer.push(`Masuk</button>`);
		pop_element();
		$$renderer.push(`</form>`);
		pop_element();
		$$renderer.push(` <div class="auth-links">`);
		push_element($$renderer, "div", 47, 2);
		$$renderer.push(`Belum punya akun? <a href="/register">`);
		push_element($$renderer, "a", 48, 21);
		$$renderer.push(`Daftar sekarang</a>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
	}, _page);
}
_page.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
export { _page as default };
