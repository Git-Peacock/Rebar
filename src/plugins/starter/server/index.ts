import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';


const Rebar = useRebar();
// alt.log('Hello from server!');



const spawns = [
    { x: -788.31, y: -122.15, z: 19.95 },
    { x: -845.725, y: -155.81, z: 19.95 },
    { x: -817.93, y: -139.22, z: 19.95 },
    { x: -810.61, y: -134.41, z: 19.95 },
    { x: -818.87, y: -130.96, z: 28.17 },
    { x: -810.09, y: -144.58, z: 28.17 },
];

const pickup1 = new alt.Vector3({
    x: -816.7376708984375,
    y: -138.48944091796875,
    z: 28.175315856933594,
});

const pickup2 = new alt.Vector3({
    x: -811.4326171875,
    y: -135.86361694335938,
    z: 28.175315856933594,
});


const weapons = ['WEAPON_BATTLEAXE', 'WEAPON_CROWBAR', 'WEAPON_BAT'];


let switchSpawn: boolean = true;

const spawnPosition = new alt.Vector3({
    x: -864.1,
    y: -172.6,
    z: 37.8,
});






function spawnPlayer(player: alt.Player) {
    const index = Math.floor(Math.random() * spawns.length);
    player.spawn(spawns[index]);

    const weaponIndex = Math.floor(Math.random() * weapons.length);
    player.giveWeapon(weapons[weaponIndex], 999, true);
}

alt.on('playerConnect', (player) => {
    player.model = 'mp_m_freemode_01';
    spawnPlayer(player);
});




alt.on('playerDeath', (player) => {
    spawnPlayer(player);
});

alt.on("playerDisconnect", (player) =>{
    alt.log(`${player.name} disconnected`);
});

