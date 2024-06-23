// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {

	type UserType = {
		displayName: string | null;
		photoURL: string | null;
		uid: string;
		email: string | null;
	};

	type ImageType = {
		id: string;
		url: string;
		createdAt: Date;
		createdBy: string;
	};

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
