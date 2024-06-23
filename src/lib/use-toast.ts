import { dev } from "$app/environment";
import { useSharedStore } from "$lib/use-shared";
import { writable } from "svelte/store";

const _useToast = () => {

    const _message = writable<string | null>(null);
    const _error = writable<boolean>(false);

    return {
        close: () => _message.set(null),
        open: (text: string) => {
            _message.set(text);
            setTimeout(() => _message.set(null), 2000);
        },
        error: (text: string, time = 2000) => {
            _message.set(text);
            _error.set(true);
            if (dev) {
                console.error(text);
            }
            setTimeout(() => {
                _message.set(null)
                _error.set(false);
            }, time);
        },
        message: _message,
        isError: _error
    }
};

// readable store context
export const useToast = () => useSharedStore('toast', _useToast);