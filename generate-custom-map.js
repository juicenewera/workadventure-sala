import fs from 'fs';
import path from 'path';

const WIDTH = 50;
const HEIGHT = 36;
const TILE_SIZE = 32;

// Template base com tilesets do WorkAdventure
const originalOffice = JSON.parse(fs.readFileSync('office.tmj', 'utf8'));
const tilesets = originalOffice.tilesets;

// Funções utilitárias de grid
function createGrid(w, h, fill = 0) {
    return new Array(w * h).fill(fill);
}

function setTile(grid, x, y, val) {
    if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
        grid[y * WIDTH + x] = val;
    }
}

function fillRect(grid, x1, y1, w, h, val) {
    for (let dy = 0; dy < h; dy++) {
        for (let dx = 0; dx < w; dx++) {
            setTile(grid, x1 + dx, y1 + dy, val);
        }
    }
}

// Inicializar camadas
const startLayer = createGrid(WIDTH, HEIGHT, 0);
const collisionsLayer = createGrid(WIDTH, HEIGHT, 0);
const floor1 = createGrid(WIDTH, HEIGHT, 0);
const floor2 = createGrid(WIDTH, HEIGHT, 0);
const walls1 = createGrid(WIDTH, HEIGHT, 0);
const walls2 = createGrid(WIDTH, HEIGHT, 0);
const furniture1 = createGrid(WIDTH, HEIGHT, 0);
const furniture2 = createGrid(WIDTH, HEIGHT, 0);
const furniture3 = createGrid(WIDTH, HEIGHT, 0);
const above1 = createGrid(WIDTH, HEIGHT, 0);

// ID constantes de tiles
const TILE_START = 2; // WA_Special_Zones start
const TILE_COLLISION = 3; // WA_Special_Zones collision

// Pisos
const FLOOR_WOOD = 725;        // Piso de madeira clássico
const FLOOR_CARPET_BLUE = 2461; // Carpete azul executivo (cinema / RPG)
const FLOOR_CARPET_RED = 2462;  // Carpete nobre
const FLOOR_TILES = 735;        // Cerâmica / refeitório
const FLOOR_DARK = 2848;        // Piso escuro de cinema

// Paredes (WA_Room_Builder)
const WALL_TOP = 479;
const WALL_MID = 578;
const WALL_BOT = 685;
const WALL_CORNER_L = 477;
const WALL_CORNER_R = 485;

// Móveis e Decorações
const TABLE_WOOD_TOP = 1567;
const TABLE_WOOD_MID = 1568;
const TABLE_WOOD_BOT = 1569;
const TABLE_WOOD_RIGHT = 1570;

const CHAIR_UP = 1494;
const CHAIR_DOWN = 1495;
const CHAIR_LEFT = 1496;
const CHAIR_RIGHT = 1497;
const CHAIR_OFFICE = 1525;

const PLANT_BIG_TOP = 133;
const PLANT_BIG_BOT = 143;
const PLANT_SMALL = 167;

const COMPUTER = 111;
const LAPTOP = 121;
const COFFEE_MACHINE = 2339;
const BOOKSHELF_TOP = 2366;
const BOOKSHELF_BOT = 2391;
const TV_SCREEN = 155;

// ==========================================
// 1. PISO GERAL E CORREDORES
// ==========================================
// Preencher todo o piso interno navegável com piso de madeira nobre
fillRect(floor1, 1, 1, WIDTH - 2, HEIGHT - 2, FLOOR_WOOD);

// Paredes perimetrais externas
for (let x = 0; x < WIDTH; x++) {
    setTile(walls1, x, 0, WALL_TOP);
    setTile(walls1, x, 1, WALL_BOT);
    setTile(collisionsLayer, x, 0, TILE_COLLISION);
    setTile(collisionsLayer, x, 1, TILE_COLLISION);

    setTile(walls1, x, HEIGHT - 1, WALL_BOT);
    setTile(collisionsLayer, x, HEIGHT - 1, TILE_COLLISION);
}
for (let y = 0; y < HEIGHT; y++) {
    setTile(walls1, 0, y, WALL_MID);
    setTile(walls1, WIDTH - 1, y, WALL_MID);
    setTile(collisionsLayer, 0, y, TILE_COLLISION);
    setTile(collisionsLayer, WIDTH - 1, y, TILE_COLLISION);
}

// ==========================================
// 2. SALA CENTRAL REDONDA (MESA DE RPG)
// x: 18 a 31, y: 2 a 17
// ==========================================
// Carpete nobre na sala de RPG
fillRect(floor2, 18, 2, 14, 15, FLOOR_CARPET_BLUE);

// Paredes da sala central
for (let x = 18; x <= 31; x++) {
    setTile(walls1, x, 2, WALL_TOP);
    setTile(walls1, x, 3, WALL_BOT);
    setTile(collisionsLayer, x, 2, TILE_COLLISION);
    setTile(collisionsLayer, x, 3, TILE_COLLISION);
}
for (let y = 3; y <= 16; y++) {
    // Paredes laterais com portas
    if (y !== 9 && y !== 10) {
        setTile(walls1, 18, y, WALL_MID);
        setTile(collisionsLayer, 18, y, TILE_COLLISION);
        setTile(walls1, 31, y, WALL_MID);
        setTile(collisionsLayer, 31, y, TILE_COLLISION);
    }
}
// Parede sul da sala de RPG com porta ampla no centro
for (let x = 18; x <= 31; x++) {
    if (x < 23 || x > 26) {
        setTile(walls1, x, 17, WALL_BOT);
        setTile(collisionsLayer, x, 17, TILE_COLLISION);
    }
}

// Mesa gigante de RPG no centro (x: 23 a 26, y: 7 a 12)
fillRect(furniture1, 23, 7, 4, 6, TABLE_WOOD_MID);
// Borda e itens decorativos de RPG
setTile(furniture2, 23, 7, TABLE_WOOD_TOP);
setTile(furniture2, 26, 7, TABLE_WOOD_TOP);
setTile(furniture2, 24, 8, LAPTOP);
setTile(furniture2, 25, 9, COMPUTER); // grid de mapa
setTile(furniture2, 24, 11, TABLE_WOOD_BOT);
setTile(furniture2, 25, 11, TABLE_WOOD_BOT);

// Colisão na mesa de RPG
fillRect(collisionsLayer, 23, 7, 4, 6, TILE_COLLISION);

// 10 Cadeiras ao redor da mesa de RPG:
// Topo (3 cadeiras)
setTile(furniture2, 23, 6, CHAIR_DOWN);
setTile(furniture2, 24, 6, CHAIR_DOWN);
setTile(furniture2, 25, 6, CHAIR_DOWN);
// Base (3 cadeiras)
setTile(furniture2, 23, 13, CHAIR_UP);
setTile(furniture2, 24, 13, CHAIR_UP);
setTile(furniture2, 25, 13, CHAIR_UP);
// Esquerda (2 cadeiras)
setTile(furniture2, 22, 8, CHAIR_RIGHT);
setTile(furniture2, 22, 11, CHAIR_RIGHT);
// Direita (2 cadeiras)
setTile(furniture2, 27, 8, CHAIR_LEFT);
setTile(furniture2, 27, 11, CHAIR_LEFT);

// Plantas nos 4 cantos da sala de RPG
setTile(furniture1, 19, 4, PLANT_BIG_TOP);
setTile(furniture1, 19, 5, PLANT_BIG_BOT);
setTile(collisionsLayer, 19, 5, TILE_COLLISION);

setTile(furniture1, 30, 4, PLANT_BIG_TOP);
setTile(furniture1, 30, 5, PLANT_BIG_BOT);
setTile(collisionsLayer, 30, 5, TILE_COLLISION);

setTile(furniture2, 19, 16, PLANT_SMALL);
setTile(furniture2, 30, 16, PLANT_SMALL);

// ==========================================
// 3. SALA DE CINEMA (À DIREITA DA SALA CENTRAL)
// x: 33 a 48, y: 2 a 17
// ==========================================
// Carpete escuro de cinema
fillRect(floor2, 33, 2, 15, 15, FLOOR_DARK);

// Paredes norte e sul
for (let x = 33; x <= 48; x++) {
    setTile(walls1, x, 2, WALL_TOP);
    setTile(walls1, x, 3, WALL_BOT);
    setTile(collisionsLayer, x, 2, TILE_COLLISION);
    setTile(collisionsLayer, x, 3, TILE_COLLISION);

    if (x < 39 || x > 42) {
        setTile(walls1, x, 17, WALL_BOT);
        setTile(collisionsLayer, x, 17, TILE_COLLISION);
    }
}
// Telão de Cinema na parede norte (x: 37 a 44, y: 4)
for (let x = 37; x <= 44; x++) {
    setTile(furniture1, x, 4, TV_SCREEN);
    setTile(collisionsLayer, x, 4, TILE_COLLISION);
}

// Fileiras de poltronas confortáveis de cinema
// Fileira 1 (y: 8)
for (let x = 36; x <= 45; x++) {
    if (x !== 40 && x !== 41) { // corredor central
        setTile(furniture2, x, 8, CHAIR_UP);
    }
}
// Fileira 2 (y: 11)
for (let x = 36; x <= 45; x++) {
    if (x !== 40 && x !== 41) {
        setTile(furniture2, x, 11, CHAIR_UP);
    }
}
// Fileira 3 (y: 14)
for (let x = 36; x <= 45; x++) {
    if (x !== 40 && x !== 41) {
        setTile(furniture2, x, 14, CHAIR_UP);
    }
}

// Plantas decorativas no cinema
setTile(furniture2, 34, 4, PLANT_SMALL);
setTile(furniture2, 47, 4, PLANT_SMALL);

// ==========================================
// 4. ALA DE ESCRITÓRIOS (À ESQUERDA)
// x: 2 a 16, y: 2 a 17
// Três escritórios privativos:
// Escritório 1: y: 2 a 6
// Escritório 2: y: 7 a 11
// Escritório 3: y: 12 a 17
// ==========================================
// Divisórias horizontais entre escritórios
for (let x = 2; x <= 16; x++) {
    // Divisória norte
    setTile(walls1, x, 2, WALL_TOP);
    setTile(walls1, x, 3, WALL_BOT);
    setTile(collisionsLayer, x, 2, TILE_COLLISION);
    setTile(collisionsLayer, x, 3, TILE_COLLISION);

    // Divisória entre Escritório 1 e 2 (y = 7)
    if (x < 14) {
        setTile(walls1, x, 7, WALL_BOT);
        setTile(collisionsLayer, x, 7, TILE_COLLISION);
    }
    // Divisória entre Escritório 2 e 3 (y = 12)
    if (x < 14) {
        setTile(walls1, x, 12, WALL_BOT);
        setTile(collisionsLayer, x, 12, TILE_COLLISION);
    }
    // Parede sul da ala de escritórios
    if (x < 14) {
        setTile(walls1, x, 17, WALL_BOT);
        setTile(collisionsLayer, x, 17, TILE_COLLISION);
    }
}
// Parede leste separando do corredor
for (let y = 3; y <= 16; y++) {
    if (y !== 5 && y !== 10 && y !== 15) { // portas dos escritórios
        setTile(walls1, 16, y, WALL_MID);
        setTile(collisionsLayer, 16, y, TILE_COLLISION);
    }
}

// Móveis Escritório 1 (Diretoria)
fillRect(furniture1, 5, 4, 3, 2, TABLE_WOOD_MID);
fillRect(collisionsLayer, 5, 4, 3, 2, TILE_COLLISION);
setTile(furniture2, 6, 4, COMPUTER);
setTile(furniture2, 6, 3, CHAIR_DOWN);
setTile(furniture2, 5, 6, CHAIR_UP);
setTile(furniture2, 7, 6, CHAIR_UP);
setTile(furniture1, 2, 4, BOOKSHELF_TOP);
setTile(furniture1, 2, 5, BOOKSHELF_BOT);
setTile(collisionsLayer, 2, 5, TILE_COLLISION);

// Móveis Escritório 2 (Desenvolvimento / Reunião)
fillRect(furniture1, 5, 9, 3, 2, TABLE_WOOD_MID);
fillRect(collisionsLayer, 5, 9, 3, 2, TILE_COLLISION);
setTile(furniture2, 5, 9, COMPUTER);
setTile(furniture2, 7, 9, LAPTOP);
setTile(furniture2, 6, 8, CHAIR_OFFICE);
setTile(furniture2, 6, 11, CHAIR_OFFICE);
setTile(furniture1, 2, 9, PLANT_BIG_TOP);
setTile(furniture1, 2, 10, PLANT_BIG_BOT);
setTile(collisionsLayer, 2, 10, TILE_COLLISION);

// Móveis Escritório 3 (Criativo / Lounge Privado)
fillRect(furniture1, 5, 14, 3, 2, TABLE_WOOD_MID);
fillRect(collisionsLayer, 5, 14, 3, 2, TILE_COLLISION);
setTile(furniture2, 6, 14, LAPTOP);
setTile(furniture2, 6, 13, CHAIR_DOWN);
setTile(furniture2, 6, 16, CHAIR_UP);
setTile(furniture1, 13, 14, BOOKSHELF_TOP);
setTile(furniture1, 13, 15, BOOKSHELF_BOT);
setTile(collisionsLayer, 13, 15, TILE_COLLISION);

// ==========================================
// 5. REFEITÓRIO / MESAS DE ALMOÇO (AO SUL / FRENTE)
// x: 2 a 47, y: 22 a 34
// ==========================================
// Piso cerâmico claro / madeira clara para área de alimentação
fillRect(floor2, 2, 22, 46, 12, FLOOR_TILES);

// Balcão e Cafeteria na lateral esquerda (x: 4 a 10, y: 23 a 24)
for (let x = 4; x <= 10; x++) {
    setTile(furniture1, x, 23, TABLE_WOOD_TOP);
    setTile(furniture1, x, 24, TABLE_WOOD_BOT);
    setTile(collisionsLayer, x, 23, TILE_COLLISION);
    setTile(collisionsLayer, x, 24, TILE_COLLISION);
}
setTile(furniture2, 5, 23, COFFEE_MACHINE);
setTile(furniture2, 7, 23, LAPTOP); // cardápio / tablet
setTile(furniture1, 11, 23, PLANT_BIG_TOP);
setTile(furniture1, 11, 24, PLANT_BIG_BOT);
setTile(collisionsLayer, 11, 24, TILE_COLLISION);

// Mesas de Almoço 1 a 4:
// Mesa 1 (x: 14 a 18, y: 25 a 26)
fillRect(furniture1, 14, 25, 5, 2, TABLE_WOOD_MID);
fillRect(collisionsLayer, 14, 25, 5, 2, TILE_COLLISION);
for (let x = 14; x <= 18; x += 2) {
    setTile(furniture2, x, 24, CHAIR_DOWN);
    setTile(furniture2, x, 27, CHAIR_UP);
}

// Mesa 2 (x: 23 a 27, y: 25 a 26)
fillRect(furniture1, 23, 25, 5, 2, TABLE_WOOD_MID);
fillRect(collisionsLayer, 23, 25, 5, 2, TILE_COLLISION);
for (let x = 23; x <= 27; x += 2) {
    setTile(furniture2, x, 24, CHAIR_DOWN);
    setTile(furniture2, x, 27, CHAIR_UP);
}

// Mesa 3 (x: 32 a 36, y: 25 a 26)
fillRect(furniture1, 32, 25, 5, 2, TABLE_WOOD_MID);
fillRect(collisionsLayer, 32, 25, 5, 2, TILE_COLLISION);
for (let x = 32; x <= 36; x += 2) {
    setTile(furniture2, x, 24, CHAIR_DOWN);
    setTile(furniture2, x, 27, CHAIR_UP);
}

// Mesa 4 (x: 40 a 44, y: 25 a 26)
fillRect(furniture1, 40, 25, 5, 2, TABLE_WOOD_MID);
fillRect(collisionsLayer, 40, 25, 5, 2, TILE_COLLISION);
for (let x = 40; x <= 44; x += 2) {
    setTile(furniture2, x, 24, CHAIR_DOWN);
    setTile(furniture2, x, 27, CHAIR_UP);
}

// Plantas de ambiente no refeitório
setTile(furniture2, 2, 33, PLANT_SMALL);
setTile(furniture2, 47, 33, PLANT_SMALL);
setTile(furniture2, 21, 33, PLANT_SMALL);
setTile(furniture2, 30, 33, PLANT_SMALL);

// ==========================================
// 6. PONTO DE SPAWN (HALL CENTRAL)
// x: 24 a 25, y: 19 a 20
// ==========================================
setTile(startLayer, 24, 19, TILE_START);
setTile(startLayer, 25, 19, TILE_START);
setTile(startLayer, 24, 20, TILE_START);
setTile(startLayer, 25, 20, TILE_START);

// ==========================================
// 7. ZONAS E OBJETOS INTERATIVOS DO WORKADVENTURE
// ==========================================
const objects = [
    // Ponto de Spawn principal
    {
        id: 1,
        name: "start",
        type: "area",
        visible: true,
        x: 24 * TILE_SIZE,
        y: 19 * TILE_SIZE,
        width: 2 * TILE_SIZE,
        height: 2 * TILE_SIZE,
        properties: [
            { name: "start", type: "bool", value: true }
        ]
    },
    // SALA DE RPG (Mesa Central)
    {
        id: 2,
        name: "mesaRPG",
        type: "area",
        visible: true,
        x: 21 * TILE_SIZE,
        y: 5 * TILE_SIZE,
        width: 8 * TILE_SIZE,
        height: 10 * TILE_SIZE,
        properties: [
            { name: "jitsiRoom", type: "string", value: "MesaDeRPG" },
            { name: "focusable", type: "bool", value: true },
            { name: "jitsiTrigger", type: "string", value: "onaction" },
            { name: "zoom_margin", type: "float", value: 1.2 }
        ]
    },
    // Lousa interativa / Tabuleiro da Mesa de RPG
    {
        id: 3,
        name: "tabuleiroRPG",
        type: "area",
        visible: true,
        x: 23 * TILE_SIZE,
        y: 7 * TILE_SIZE,
        width: 4 * TILE_SIZE,
        height: 6 * TILE_SIZE,
        properties: [
            { name: "openWebsite", type: "string", value: "https://excalidraw.com" },
            { name: "openWebsiteTrigger", type: "string", value: "onaction" },
            { name: "openWebsitePolicy", type: "string", value: "fullscreen" }
        ]
    },
    // SALA DE CINEMA - Zona de Vídeo e Áudio Coletivo
    {
        id: 4,
        name: "cinemaZone",
        type: "area",
        visible: true,
        x: 34 * TILE_SIZE,
        y: 5 * TILE_SIZE,
        width: 13 * TILE_SIZE,
        height: 11 * TILE_SIZE,
        properties: [
            { name: "jitsiRoom", type: "string", value: "CinemaPipoca" },
            { name: "focusable", type: "bool", value: true },
            { name: "jitsiTrigger", type: "string", value: "onaction" }
        ]
    },
    // Telão do Cinema (abre vídeo / live)
    {
        id: 5,
        name: "telaoCinema",
        type: "area",
        visible: true,
        x: 37 * TILE_SIZE,
        y: 4 * TILE_SIZE,
        width: 8 * TILE_SIZE,
        height: 2 * TILE_SIZE,
        properties: [
            { name: "openWebsite", type: "string", value: "https://www.youtube.com/embed/jfKfPfyJRdk" },
            { name: "openWebsiteTrigger", type: "string", value: "onaction" }
        ]
    },
    // ESCRITÓRIO 1 (Diretoria)
    {
        id: 6,
        name: "escritorio1",
        type: "area",
        visible: true,
        x: 2 * TILE_SIZE,
        y: 3 * TILE_SIZE,
        width: 14 * TILE_SIZE,
        height: 4 * TILE_SIZE,
        properties: [
            { name: "jitsiRoom", type: "string", value: "EscritorioDiretoria" },
            { name: "focusable", type: "bool", value: true }
        ]
    },
    // ESCRITÓRIO 2 (Desenvolvimento)
    {
        id: 7,
        name: "escritorio2",
        type: "area",
        visible: true,
        x: 2 * TILE_SIZE,
        y: 8 * TILE_SIZE,
        width: 14 * TILE_SIZE,
        height: 4 * TILE_SIZE,
        properties: [
            { name: "jitsiRoom", type: "string", value: "EscritorioDevs" },
            { name: "focusable", type: "bool", value: true }
        ]
    },
    // ESCRITÓRIO 3 (Criativo)
    {
        id: 8,
        name: "escritorio3",
        type: "area",
        visible: true,
        x: 2 * TILE_SIZE,
        y: 13 * TILE_SIZE,
        width: 14 * TILE_SIZE,
        height: 4 * TILE_SIZE,
        properties: [
            { name: "jitsiRoom", type: "string", value: "EscritorioCriativo" },
            { name: "focusable", type: "bool", value: true }
        ]
    },
    // REFEITÓRIO - MESA DE ALMOÇO 1
    {
        id: 9,
        name: "mesaAlmoco1",
        type: "area",
        visible: true,
        x: 13 * TILE_SIZE,
        y: 24 * TILE_SIZE,
        width: 7 * TILE_SIZE,
        height: 4 * TILE_SIZE,
        properties: [
            { name: "jitsiRoom", type: "string", value: "MesaAlmoco1" }
        ]
    },
    // REFEITÓRIO - MESA DE ALMOÇO 2
    {
        id: 10,
        name: "mesaAlmoco2",
        type: "area",
        visible: true,
        x: 22 * TILE_SIZE,
        y: 24 * TILE_SIZE,
        width: 7 * TILE_SIZE,
        height: 4 * TILE_SIZE,
        properties: [
            { name: "jitsiRoom", type: "string", value: "MesaAlmoco2" }
        ]
    },
    // REFEITÓRIO - MESA DE ALMOÇO 3
    {
        id: 11,
        name: "mesaAlmoco3",
        type: "area",
        visible: true,
        x: 31 * TILE_SIZE,
        y: 24 * TILE_SIZE,
        width: 7 * TILE_SIZE,
        height: 4 * TILE_SIZE,
        properties: [
            { name: "jitsiRoom", type: "string", value: "MesaAlmoco3" }
        ]
    },
    // CAFETERIA - Mensagem de café
    {
        id: 12,
        name: "cafeteriaPopup",
        type: "area",
        visible: true,
        x: 4 * TILE_SIZE,
        y: 23 * TILE_SIZE,
        width: 7 * TILE_SIZE,
        height: 2 * TILE_SIZE,
        properties: [
            { name: "silent", type: "bool", value: false }
        ]
    }
];

// Montar objeto final TMJ
function makeLayer(name, data, id) {
    return {
        id,
        name,
        type: "tilelayer",
        visible: true,
        opacity: 1,
        x: 0,
        y: 0,
        width: WIDTH,
        height: HEIGHT,
        data
    };
}

const customMap = {
    compressionlevel: -1,
    height: HEIGHT,
    width: WIDTH,
    infinite: false,
    layers: [
        makeLayer("start", startLayer, 1),
        makeLayer("collisions", collisionsLayer, 2),
        {
            id: 3,
            name: "floor",
            type: "group",
            visible: true,
            opacity: 1,
            x: 0,
            y: 0,
            layers: [
                makeLayer("floor1", floor1, 31),
                makeLayer("floor2", floor2, 32)
            ]
        },
        {
            id: 4,
            name: "walls",
            type: "group",
            visible: true,
            opacity: 1,
            x: 0,
            y: 0,
            layers: [
                makeLayer("walls1", walls1, 41),
                makeLayer("walls2", walls2, 42)
            ]
        },
        {
            id: 5,
            name: "furniture",
            type: "group",
            visible: true,
            opacity: 1,
            x: 0,
            y: 0,
            layers: [
                makeLayer("furniture1", furniture1, 51),
                makeLayer("furniture2", furniture2, 52),
                makeLayer("furniture3", furniture3, 53)
            ]
        },
        {
            id: 6,
            name: "floorLayer",
            type: "objectgroup",
            visible: true,
            opacity: 1,
            x: 0,
            y: 0,
            objects
        },
        {
            id: 7,
            name: "above",
            type: "group",
            visible: true,
            opacity: 1,
            x: 0,
            y: 0,
            layers: [
                makeLayer("above1", above1, 71)
            ]
        }
    ],
    nextlayerid: 100,
    nextobjectid: 20,
    orientation: "orthogonal",
    renderorder: "right-down",
    tiledversion: "1.10.2",
    tileheight: TILE_SIZE,
    tilewidth: TILE_SIZE,
    tilesets,
    type: "map",
    version: "1.10"
};

fs.writeFileSync('office.tmj', JSON.stringify(customMap, null, 2));
console.log('office.tmj customizado gerado com sucesso!');
