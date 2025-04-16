// script for UndertaleModTool
// based on script ExportAllRoomsToPng.csx (built-in to UndertaleModTool)

using System;
using System.Text;
using System.Text.Json;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Controls;
using System.Runtime;

using UndertaleModLib;
using UndertaleModLib.Util;
using UndertaleModLib.Models;


EnsureDataLoaded();

UndertaleModTool.MainWindow mainWindow = Application.Current.MainWindow as UndertaleModTool.MainWindow;

string exportedSpritesFolder = PromptChooseDirectory("Choose an export folder");
if (exportedSpritesFolder == null)
    throw new ScriptException("The export folder was not set, stopping script.");


int spriteCount = Data.Sprites.Count;
SetProgressBar(null, "Sprites Exported", 0, spriteCount);
StartUpdater();

using (var file = new FileStream(exportedSpritesFolder + System.IO.Path.DirectorySeparatorChar + "sprites.csv", FileMode.Create)) {
    try {
        byte[] writeData = {};
        file.Write(writeData, 0, writeData.Length);
    } catch (Exception e) {
        throw new ScriptException($"An error occurred while initializing the export.\n{e}");
    }
}

await DumpSprites();

await StopUpdater();
HideProgressBar();

GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce; // force full garbage collection
GC.Collect();

ScriptMessage("Exported successfully.");


async Task DumpSprites() {
    for (int i = 0; i < spriteCount; i++) {
        if (IsAppClosed)
            break;

        UndertaleSprite sprite = Data.Sprites[i];

        string name = sprite.Name.Content;
        string width = sprite.Width.ToString();
        string height = sprite.Height.ToString();

        DumpSprite(name, width, height);
    }
}

void DumpSprite(string name, string width, string height) {
    using (var file = new FileStream(exportedSpritesFolder + System.IO.Path.DirectorySeparatorChar + "sprites.csv", FileMode.Append)) {
        try {
            string data = $"{name};{width};{height}\n";
            byte[] writeData = new UTF8Encoding(true).GetBytes(data);
            file.Write(writeData, 0, writeData.Length);
        } catch (Exception e) {
            throw new ScriptException($"An error occurred while exporting data for sprite \"{name}\".\n{e}");
        }
    }

    IncProgress();
}
