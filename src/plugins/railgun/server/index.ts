
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';


const Rebar = useRebar();


function createRailgun() {
    let isTaken = false;

    // Move the marker for the Railgun into this function as well
    const marker = Rebar.controllers.useMarkerGlobal({
        type: 'CYLINDER',
        pos: new alt.Vector3({
            x: -816.7376708984375,
            y: -138.48944091796875,
            z: 27.175315856933594,
        }),
        color: new alt.RGBA(0, 255, 0, 100),
        scale: new alt.Vector3(2, 2, 1),
    });

    // Add the pickup creation function
    const pickup = Rebar.controllers.usePickupGlobal({
        pickup: 'PICKUP_WEAPON_RAILGUN',
        pos: new alt.Vector3({
            x: -816.7376708984375,
            y: -138.48944091796875,
            z: 28.175315856933594,
        }),
    });

    // We'll use the 'destroy' function from the callback to remove it
    // server/index.ts

pickup.on((player, weapon, destroy) => {
    // Make sure that nobody else can claim the railgun after it is claimed
    if (isTaken) {
        return;
    }

    isTaken = true;

    // Destroy the pickup
    destroy();

    // Destroy the marker
    marker.destroy();

    // Give the player the railgun
    player.giveWeapon('WEAPON_RAILGUN', 99, true);

    const rPlayer = Rebar.usePlayer(player);
    rPlayer.notify.showNotification(`You picked up the Railgun!`);

    // Respawn the railgun after 15 seconds
    alt.setTimeout(createRailgun, 15000); // 15 Seconds as milliseconds
});
}

createRailgun();