// server/index.ts
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { Character } from '@Shared/types/character.js';
import { Account } from '@Shared/types/account.js';

const Rebar = useRebar();
const ServerConfig = Rebar.useServerConfig();

type AccountExtended = Account & { username: string };


ServerConfig.set('hideMinimapInPage', true);

// Take careful note that this function is async
alt.on('playerConnect', async (player) => {
    // When the player connects, we do something here
    // all code below should go here for this section

    player.pos = new alt.Vector3(0,0,100);

    player.frozen = true;
    player.visible = false;
    player.dimension = 10000;

    await alt.Utils.wait(1000); // Wait 1 second before freezing camera
    const rPlayer = Rebar.usePlayer(player);

    rPlayer.world.freezeCamera(true);
    rPlayer.webview.show('Authentication', 'page');
    rPlayer.world.setScreenBlur(200);
    rPlayer.world.disableControls();

        //BUILDING A FORM IM TUTORIAL

});

function finish(player: alt.Player) {
    player.frozen = false;
    player.visible = true;
    player.dimension = 0;
    player.model = 'mp_m_freemode_01';
    player.spawn(
        new alt.Vector3({
            x: -864.1437377929688,
            y: -172.6201934814453,
            z: 37.799232482910156,
        }),
    );

    const rPlayer = Rebar.usePlayer(player);
    rPlayer.world.freezeCamera(false);
    rPlayer.world.clearScreenBlur(200);
    rPlayer.world.enableControls();
    rPlayer.webview.hide('Authentication');
}


async function handleLogin(player: alt.Player, document: AccountExtended) {
    const account = Rebar.document.account.useAccountBinder(player).bind(document);
    const characters = await account.getCharacters();
    const db = Rebar.database.useDatabase();
    console.log(characters);
    if (characters.length <= 0) {
        // Grab the account identifier
        const accountId = account.getField<AccountExtended>('_id');
    
        // Grab the username
        const username = account.getField<AccountExtended>('username');
    
        // Create the character entry with account_id, and name
        const _id = await db.create<Character>(
            { account_id: accountId, name: username },
            Rebar.database.CollectionNames.Characters,
        );
    
        // Grab the created document
        const document = await db.get<Character>({ _id }, Rebar.database.CollectionNames.Characters);
    
        // Bind the character document to the player
        Rebar.document.character.useCharacterBinder(player).bind(document);
    
        // We're done!
        return;
    }
    
    // Otherwise, if they have a character. Grab the first result and bind it
    Rebar.document.character.useCharacterBinder(player).bind(characters[0]);
    finish(player);
    
}
alt.onRpc('authenticate:login', async (player: alt.Player, username: string, password: string) => {
    const db = Rebar.database.useDatabase();
    const results = await db.getMany<AccountExtended>({ username }, Rebar.database.CollectionNames.Accounts);

    if (results.length <= 0) {
        const pbkdf2Password = Rebar.utility.password.hash(password);
        const _id = await db.create({ username, password: pbkdf2Password }, Rebar.database.CollectionNames.Accounts);
        const document = await db.get<AccountExtended>({ _id }, Rebar.database.CollectionNames.Accounts);
        await handleLogin(player, document); // Callong the handle login function
        return true;
    }

    const document = results[0];
    if (!Rebar.utility.password.check(password, document.password)) {
        return false;
    }

    // Calling the handle login function
    await handleLogin(player, document);
    return true;
});