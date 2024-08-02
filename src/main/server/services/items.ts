import * as alt from 'alt-server';
import { useServices } from './index.js';

export interface ItemService {
    /**
     * Add an item to the given player with a given quantity based on a common id
     *
     * Additionally, a sobject data may be passed if necessary.
     *
     * @memberof ItemService
     */
    add: (player: alt.Player, id: string, quantity: number, data?: Object) => Promise<boolean>;

    /**
     * Subtract an item quanatiy from the given player with a given quantity based on a common id
     *
     * @memberof ItemService
     */
    sub: (player: alt.Player, id: string, quantity: number) => Promise<boolean>;

    /**
     * Check if the player has enough of an item based on a common id
     *
     * @memberof ItemService
     */
    has: (player: alt.Player, id: string, quantity: number) => Promise<boolean>;

    /**
     * Remove an item from the player based on a unique identifier
     *
     * @memberof ItemService
     */
    remove: (player: alt.Player, uid: string) => Promise<boolean>;
}

declare global {
    interface RebarServices {
        itemService: Partial<ItemService>;
    }
}

declare module 'alt-server' {
    export interface ICustomEmitEvent {
        playerItemAdd: (...args: Parameters<ItemService['add']>) => void;
        playerItemSub: (...args: Parameters<ItemService['sub']>) => void;
        playerItemRemove: (...args: Parameters<ItemService['remove']>) => void;
    }
}

export function useItemService(): ItemService {
    async function add(...args: Parameters<ItemService['add']>) {
        const services = useServices().get('itemService');
        if (services.length <= 0) {
            return false;
        }

        for (let service of services) {
            if (typeof service.add !== 'function') {
                continue;
            }

            const result = await service.add(...args);
            if (!result) {
                return false;
            }
        }

        alt.emit('playerItemAdd', ...args);
        return true;
    }

    async function sub(...args: Parameters<ItemService['sub']>) {
        const services = useServices().get('itemService');
        if (services.length <= 0) {
            return false;
        }

        for (let service of services) {
            if (typeof service.sub !== 'function') {
                continue;
            }

            const result = await service.sub(...args);
            if (!result) {
                return false;
            }
        }

        alt.emit('playerItemSub', ...args);
        return true;
    }

    async function has(...args: Parameters<ItemService['has']>) {
        const services = useServices().get('itemService');
        if (services.length <= 0) {
            return false;
        }

        for (let service of services) {
            if (typeof service.has !== 'function') {
                continue;
            }

            const result = await service.has(...args);
            if (!result) {
                return false;
            }
        }

        return true;
    }

    async function remove(...args: Parameters<ItemService['remove']>) {
        const services = useServices().get('itemService');
        if (services.length <= 0) {
            return false;
        }

        for (let service of services) {
            if (typeof service.remove !== 'function') {
                continue;
            }

            const result = await service.remove(...args);
            if (!result) {
                return false;
            }
        }

        alt.emit('playerItemRemove', ...args);
        return true;
    }

    return {
        add,
        sub,
        has,
        remove,
    };
}