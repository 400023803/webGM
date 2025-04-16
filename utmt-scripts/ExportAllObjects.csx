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

string exportedObjectsFolder = PromptChooseDirectory("Choose an export folder");
if (exportedObjectsFolder == null)
    throw new ScriptException("The export folder was not set, stopping script.");


int objectCount = Data.GameObjects.Count;
SetProgressBar(null, "Objects Exported", 0, objectCount);
StartUpdater();

using (var file = new FileStream(exportedObjectsFolder + System.IO.Path.DirectorySeparatorChar + "objects.csv", FileMode.Create)) {
    try {
        byte[] writeData = {};
        file.Write(writeData, 0, writeData.Length);
    } catch (Exception e) {
        throw new ScriptException($"An error occurred while initializing the export.\n{e}");
    }
}

await DumpObjects();

await StopUpdater();
HideProgressBar();

GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce; // force full garbage collection
GC.Collect();

ScriptMessage("Exported successfully.");


async Task DumpObjects() {
    for (int i = 0; i < objectCount; i++) {
        if (IsAppClosed)
            break;

        UndertaleGameObject gameObj = Data.GameObjects[i];

        string name = gameObj.Name.Content;
        string visible = gameObj.Visible.ToString().ToLower();
        string persistent = gameObj.Persistent.ToString().ToLower();
        string depth = gameObj.Depth.ToString();
        string parentGameObj = ""; if (gameObj.ParentId != null) parentGameObj = gameObj.ParentId.Name.Content;
        string spriteIndex = ""; if (gameObj.Sprite != null) spriteIndex = gameObj.Sprite.Name.Content;
        string spriteCount = ""; if (gameObj.Sprite != null) spriteCount = gameObj.Sprite.Textures.Count.ToString();

        DumpObject(name, visible, persistent, depth, parentGameObj, spriteIndex, spriteCount);
    }
}

void DumpObject(string name, string visible, string persistent, string depth, string parentGameObj, string spriteIndex, string spriteCount) {
    using (var file = new FileStream(exportedObjectsFolder + System.IO.Path.DirectorySeparatorChar + "objects.csv", FileMode.Append)) {
        try {
            string data = $"{name};{visible};{persistent};{depth};{parentGameObj};{spriteIndex};{spriteCount}\n";
            byte[] writeData = new UTF8Encoding(true).GetBytes(data);
            file.Write(writeData, 0, writeData.Length);
        } catch (Exception e) {
            throw new ScriptException($"An error occurred while exporting data for object \"{name}\".\n{e}");
        }
    }

    IncProgress();
}
