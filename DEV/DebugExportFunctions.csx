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

string exportedFunctionsFolder = PromptChooseDirectory("Choose an export folder");
if (exportedFunctionsFolder == null)
    throw new ScriptException("The export folder was not set, stopping script.");


int functionCount = Data.Functions.Count;
SetProgressBar(null, "Functions Exported", 0, functionCount);
StartUpdater();
int scriptCount = Data.Scripts.Count;

using (var file = new FileStream(exportedFunctionsFolder + System.IO.Path.DirectorySeparatorChar + "functions.txt", FileMode.Create)) {
    try {
        byte[] writeData = {};
        file.Write(writeData, 0, writeData.Length);
    } catch (Exception e) {
        throw new ScriptException($"An error occurred while initializing the export.\n{e}");
    }
}

await DumpFunctions();

await StopUpdater();
HideProgressBar();

GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce; // force full garbage collection
GC.Collect();

ScriptMessage("Exported successfully.");


async Task DumpFunctions() {
    for (int i = 0; i < functionCount; i++) {
        if (IsAppClosed)
            return;

        UndertaleFunction function = Data.Functions[i];
        string funcName = function.Name.Content;
        bool addFunc = true;

        for (int j = 0; j < scriptCount; j++) {
            if (IsAppClosed)
                return;
            
            UndertaleScript script = Data.Scripts[j];
            string scriptName = script.Name.Content;

            if (funcName == scriptName) {
                IncProgress();
                addFunc = false;
            }
        }

        if (!addFunc) continue;
        DumpFunction(funcName);
    }
}

void DumpFunction(string name) {
    using (var file = new FileStream(exportedFunctionsFolder + System.IO.Path.DirectorySeparatorChar + "functions.txt", FileMode.Append)) {
        try {
            string data = $"{name}\n";
            byte[] writeData = new UTF8Encoding(true).GetBytes(data);
            file.Write(writeData, 0, writeData.Length);
        } catch (Exception e) {
            throw new ScriptException($"An error occurred while exporting the function data.\n{e}");
        }
    }

    IncProgress();
}
