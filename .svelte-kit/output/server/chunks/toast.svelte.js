import "./dev.js";
//#region src/lib/toast.svelte.ts
var ToastManager = class {
	toasts = [];
	add(message, type = "info", duration = 4e3) {
		const id = Math.random().toString(36).substring(2, 9);
		this.toasts.push({
			id,
			type,
			message
		});
		setTimeout(() => {
			this.remove(id);
		}, duration);
	}
	remove(id) {
		this.toasts = this.toasts.filter((t) => t.id !== id);
	}
	success(message, duration) {
		this.add(message, "success", duration);
	}
	error(message, duration) {
		this.add(message, "error", duration);
	}
	info(message, duration) {
		this.add(message, "info", duration);
	}
};
var toast = new ToastManager();
//#endregion
export { toast as t };
