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
using static UndertaleModLib.Models.UndertalePath;


EnsureDataLoaded();

UndertaleModTool.MainWindow mainWindow = Application.Current.MainWindow as UndertaleModTool.MainWindow;

string exportedPathsFolder = PromptChooseDirectory("Choose an export folder");
if (exportedPathsFolder == null)
    throw new ScriptException("The export folder was not set, stopping script.");


int pathCount = Data.Paths.Count;
SetProgressBar(null, "Paths Exported", 0, pathCount);
StartUpdater();

using (var infoFile = new FileStream(exportedPathsFolder + System.IO.Path.DirectorySeparatorChar + "ALL_PATHS_INFO_MAIN.csv", FileMode.Create)) {
    try {
        byte[] writeData = {};
        infoFile.Write(writeData, 0, writeData.Length);
    } catch (Exception e) {
        throw new ScriptException($"An error occurred while initializing the info export.\n{e}");
    }
}

await DumpPaths();

await StopUpdater();
HideProgressBar();

GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce; // force full garbage collection
GC.Collect();

ScriptMessage("Exported successfully.");


async Task DumpPaths() {
    for (int i = 0; i < pathCount; i++) {
        if (IsAppClosed)
            break;

        UndertalePath path = Data.Paths[i];

        string name = path.Name.Content;
        string smooth = path.IsSmooth.ToString().ToLower();
        string closed = path.IsClosed.ToString().ToLower();
        string precision = path.Precision.ToString();
        UndertaleSimpleList<PathPoint> points = path.Points;

        DumpPath(name, smooth, closed, precision, points);
    }
}

void DumpPath(string name, string smooth, string closed, string precision, UndertaleSimpleList<PathPoint> points) {
    using (var infoFile = new FileStream(exportedPathsFolder + System.IO.Path.DirectorySeparatorChar + "ALL_PATHS_INFO_MAIN.csv", FileMode.Append)) {
        try {
            string data = $"{name};{smooth};{closed};{precision}\n";
            byte[] writeData = new UTF8Encoding(true).GetBytes(data);
            infoFile.Write(writeData, 0, writeData.Length);
        } catch (Exception e) {
            throw new ScriptException($"An error occurred while exporting info for path \"{name}\".\n{e}");
        }
    }
    using (var dataFile = new FileStream(exportedPathsFolder + System.IO.Path.DirectorySeparatorChar + name + ".csv", FileMode.Create)) {
        try {
            foreach (var point in points) {
                string x = point.X.ToString();
                string y = point.Y.ToString();
                string speed = point.Speed.ToString();

                string dataData = $"{x};{y};{speed}\n";
                byte[] writeDataData = new UTF8Encoding(true).GetBytes(dataData);
                dataFile.Write(writeDataData, 0, writeDataData.Length);
            }
        } catch (Exception e) {
            throw new ScriptException($"An error occurred while exporting data for path \"{name}\".\n{e}");
        }
    }

    IncProgress();
}
