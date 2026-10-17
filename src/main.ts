/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.info('Script started successfully');

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.info('WorkAdventure Scripting API ready');

    // Mensagem de boas-vindas na Cafeteria
    WA.room.area.onEnter('cafeteriaPopup').subscribe(() => {
        currentPopup = WA.ui.openPopup("cafeteriaPopup", "☕ Bem-vindo à Cafeteria! Pegue um café ou lanche e sente-se em uma das mesas para almoçar.", []);
    });

    WA.room.area.onLeave('cafeteriaPopup').subscribe(closePopup);

    // Bootstrap do scripting API extra para carregar recursos adicionais
    bootstrapExtra().then(() => {
        console.info('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

function closePopup(){
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

export {};
