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
using static UndertaleModLib.Models.UndertaleRoom;


EnsureDataLoaded();

UndertaleModTool.MainWindow mainWindow = Application.Current.MainWindow as UndertaleModTool.MainWindow;

string exportedRoomsFolder = PromptChooseDirectory("Choose an export folder");
if (exportedRoomsFolder == null)
    throw new ScriptException("The export folder was not set, stopping script.");


int roomCount = Data.Rooms.Count;
SetProgressBar(null, "Rooms Exported", 0, roomCount);
StartUpdater();

using (var infoFile = new FileStream(exportedRoomsFolder + System.IO.Path.DirectorySeparatorChar + "ALL_ROOMS_INFO_MAIN.csv", FileMode.Create)) {
    try {
        byte[] writeInfoData = {};
        infoFile.Write(writeInfoData, 0, writeInfoData.Length);
    } catch (Exception e) {
        throw new ScriptException($"An error occurred while initializing the info export.\n{e}");
    }
}

await DumpRooms();

await StopUpdater();
HideProgressBar();

GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce; // force full garbage collection
GC.Collect();

ScriptMessage("Exported successfully.");


async Task DumpRooms() {
    for (int i = 0; i < roomCount; i++) {
        if (IsAppClosed)
            break;

        UndertaleRoom room = Data.Rooms[i];

        string name = room.Name.Content;
        uint width = room.Width;
        uint height = room.Height;
        uint speed = room.Speed;
        string background = "#" + room.BackgroundColor.ToString("X").Substring(2);
        UndertalePointerList<GameObject> objects = room.GameObjects;

        DumpRoom(name, width, height, speed, background, objects);
    }
}

void DumpRoom(string name, uint width, uint height, uint speed, string background, UndertalePointerList<GameObject> objects) {
    using (var infoFile = new FileStream(exportedRoomsFolder + System.IO.Path.DirectorySeparatorChar + "ALL_ROOMS_INFO_MAIN.csv", FileMode.Append)) {
        try {
            string infoData = $"{name};{width};{height};{speed};{background}\n";
            byte[] writeInfoData = new UTF8Encoding(true).GetBytes(infoData);
            infoFile.Write(writeInfoData, 0, writeInfoData.Length);
        } catch (Exception e) {
            throw new ScriptException($"An error occurred while exporting info for room \"{name}\".\n{e}");
        }
    }
    using (var dataFile = new FileStream(exportedRoomsFolder + System.IO.Path.DirectorySeparatorChar + name + ".csv", FileMode.Create)) {
        try {
            foreach (var obj in objects) {
                string x = obj.X.ToString();
                string y = obj.Y.ToString();

                UndertaleGameObject gameObj = obj.ObjectDefinition;
                string objName = gameObj.Name.Content;

                string dataData = $"{objName};{x};{y}\n";
                byte[] writeDataData = new UTF8Encoding(true).GetBytes(dataData);
                dataFile.Write(writeDataData, 0, writeDataData.Length);
            }
        } catch (Exception e) {
            throw new ScriptException($"An error occurred while exporting data for room \"{name}\".\n{e}");
        }
    }

    IncProgress();
}
