import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const ServerConfig = Rebar.useServerConfig();

ServerConfig.set('disablePistolWhip', true);
ServerConfig.set('disableVehicleEngineAutoStart', true);
ServerConfig.set('disableVehicleEngineAutoStop', true);
ServerConfig.set('disableVehicleSeatSwap', true);
ServerConfig.set('hideAreaName', true);
ServerConfig.set('hideHealthArmour', true);
ServerConfig.set('hideMinimapInPage', true);
ServerConfig.set('hideMinimapInVehicle', true);
ServerConfig.set('hideMinimapOnFoot', true);
ServerConfig.set('hideStreetName', true);
ServerConfig.set('hideVehicleClass', true);
ServerConfig.set('hideVehicleName', true);
ServerConfig.set('disableAmbientNoise', true);
ServerConfig.set('disableDriveBys', true);