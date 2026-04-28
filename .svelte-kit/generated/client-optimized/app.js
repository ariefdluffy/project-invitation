export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22')
];

export const server_loads = [0,2,3];

export const dictionary = {
		"/": [~4],
		"/admin": [5,[2]],
		"/admin/invitations": [6,[2]],
		"/admin/settings": [~7,[2]],
		"/admin/templates": [8,[2]],
		"/admin/templates/preview/[id]": [~9,[2]],
		"/admin/users": [~10,[2]],
		"/dashboard": [~11,[3]],
		"/dashboard/billing": [~12,[3]],
		"/dashboard/billing/checkout": [~13,[3]],
		"/dashboard/create": [~14,[3]],
		"/dashboard/invitations": [~15,[3]],
		"/dashboard/invitations/[id]": [~16,[3]],
		"/dashboard/media": [~17,[3]],
		"/demo/[id]": [~18],
		"/invitation/[slug]": [~19],
		"/login": [20],
		"/logout": [21],
		"/register": [22]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
export const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';