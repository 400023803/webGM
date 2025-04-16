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


using (var file = new FileStream(exportedObjectsFolder + System.IO.Path.DirectorySeparatorChar + "info.csv", FileMode.Create)) {
    try {
        byte[] writeData = {};
        file.Write(writeData, 0, writeData.Length);
    } catch (Exception e) {
        throw new ScriptException($"An error occurred while initializing the export.\n{e}");
    }
}

await DumpInfos();

await StopUpdater();
HideProgressBar();

GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce; // force full garbage collection
GC.Collect();

ScriptMessage("Exported successfully.");


async Task DumpInfos() {
    if (IsAppClosed)
        return;

    UndertaleGeneralInfo info = Data.GeneralInfo;
    string width = info.DefaultWindowWidth.ToString();
    string height = info.DefaultWindowHeight.ToString();

    DumpInfo(width, height);
}

void DumpInfo(string width, string height) {
    using (var file = new FileStream(exportedObjectsFolder + System.IO.Path.DirectorySeparatorChar + "info.csv", FileMode.Append)) {
        try {
            string data = $"{width};{height}\n";
            byte[] writeData = new UTF8Encoding(true).GetBytes(data);
            file.Write(writeData, 0, writeData.Length);
        } catch (Exception e) {
            throw new ScriptException($"An error occurred while exporting the info data.\n{e}");
        }
    }
}
