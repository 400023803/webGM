# About webGM
webGM is a web-based GameMaker game interpreter.
It is currently being developed for Undertale, but should support other games.
Please note it is still being developed, so games will probably crash/freeze somewhere.

## Usage
Use Up/Down/Enter to navigate menus (like the game select menu).
If a game doesn't open in a new window when you select it, then check your popup blocker settings.

## Games
Games in webGM are customized dumps of the GameMaker project files (ex. `data.win`).
They are re-packed into a custom `.wpck` file format I made - it just stores a file/folder structure as one file.
(I use this format instead of `.zip` because I don't need external libraries for it).

### How to add games:
1. In the `/games/dumps` folder, create a new folder with the name of the game.
    - Inside this folder, create the folders `fonts`, `info`, `objects`, `rooms`, `scripts`, `sounds`, and `sprites`.
    - Also create the folder `music` inside the `sounds` folder.
2. Download [UndertaleModTool](https://github.com/UnderminersTeam/UndertaleModTool). I'm not associated with it, but it's a good tool.
    - Open the game's `data.win` file in UndertaleModTool.
    - Run these scripts in UTMT (in the "*Resource Unpackers*" category): `ExportFontData`, `ExportAllCode`, `ExportAllSounds`, and `ExportAllSprites`.
        - `ExportFontData`: Click "*Select All*". Copy the contents of the export folder to the `fonts` folder.
        - `ExportAllCode`: Copy the contents of the export folder to the `scripts` folder.
        - `ExportAllSounds`: Click "*Yes*" to export both types of sounds. Copy the contents of the "*Exported Sounds*" folder to the `sounds` folder, and copy the contents of the "*External Sounds*" folder to the `sounds/music` folder.
        - `ExportAllSprites`: Click "*Yes*". Click "*Yes*" again to export the sprites into their own folders. Copy the contents of the export folder to the `sprites` folder.
    - Run these scripts in UTMT (in the `/utmt-scripts/` folder here - select "*Run other script...*" in UTMT): `ExportGameInfo`, `ExportAllObjects`, `ExportAllRooms`, and `ExportSpriteInfo`.
        - `ExportGameInfo`: Select the `info` folder.
        - `ExportAllObjects`: Select the `objects` folder.
        - `ExportAllRooms`: Select the `rooms` folder.
        - `ExportSpriteInfo`: Select the `sprites` folder.
3. Pack the game dump into a `.wpck` file.
    - Open webGM
    - Select the option `[builtin util] Pack game dump`.
        - Select the main game dump folder.
        - Export the `.wpck` file to `/games`.
4. Reload webGM, and select the name of the game.
    - If you don't see the name of the game, try closing and reopening webGM.
    - If you still don't see it, make sure you followed the steps correctly.
5. The game should launch in a new window.
    - If the game doesn't open when you click on it, check your popup blocker settings.
    - If it still doesn't open, make sure you followed the steps correctly.

**NOTE:**
This is still in development. Games will probably crash/freeze.
If a game freezes, the main webGM page probably will too. You'll need to re-open both.
