import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

// Elevator Top
const elevatorTopSpot = new alt.Vector3({
    x: -815.67236328125,
    y: -134.51853942871094,
    z: 27.17535400390625,
});

// Elevator Bottom
const elevatorBottomSpot = new alt.Vector3({
    x: -815.7911376953125,
    y: -134.67520141601562,
    z: 18.95029067993164,
});

const elevatorTop = Rebar.controllers.useInteraction(new alt.ColshapeSphere(elevatorTopSpot.x, elevatorTopSpot.y, elevatorTopSpot.z, 2), "player");
elevatorTop.on((player) => {
    // Teleport to the bottom
    player.pos = elevatorBottomSpot;
});

const elevatorBottom = Rebar.controllers.useInteraction(new alt.ColshapeSphere(elevatorBottomSpot.x, elevatorBottomSpot.y, elevatorBottomSpot.z, 2), "player");
elevatorBottom.on((player) => {
    // Teleport to the bottom
    player.pos = elevatorTopSpot;
});

Rebar.controllers.useTextLabelGlobal({
    pos: elevatorTopSpot,
    
    text: `E - Use Elevator`,
});
    
Rebar.controllers.useTextLabelGlobal({
    pos: elevatorBottomSpot,
    text: `E - Use Elevator`,
});
 

Rebar.controllers.useMarkerGlobal({
    pos: elevatorBottomSpot,
    type: 'UPSIDE_DOWN_CONE',
    color: new alt.RGBA(255, 255, 0, 100),
    scale: new alt.Vector3(1, 1, 1),
});

Rebar.controllers.useMarkerGlobal({
    pos: elevatorTopSpot,
    type: 'UPSIDE_DOWN_CONE',
    color: new alt.RGBA(255, 255, 0, 100),
    scale: new alt.Vector3(1, 1, 1),
});