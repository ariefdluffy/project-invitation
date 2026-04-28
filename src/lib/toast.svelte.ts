export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
	id: string;
	type: ToastType;
	message: string;
}

class ToastManager {
	toasts = $state<Toast[]>([]);

	add(message: string, type: ToastType = 'info', duration: number = 4000) {
		const id = Math.random().toString(36).substring(2, 9);
		this.toasts.push({ id, type, message });

		setTimeout(() => {
			this.remove(id);
		}, duration);
	}

	remove(id: string) {
		this.toasts = this.toasts.filter((t) => t.id !== id);
	}

	success(message: string, duration?: number) {
		this.add(message, 'success', duration);
	}

	error(message: string, duration?: number) {
		this.add(message, 'error', duration);
	}

	info(message: string, duration?: number) {
		this.add(message, 'info', duration);
	}
}

export const toast = new ToastManager();
