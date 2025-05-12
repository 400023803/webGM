// script for UndertaleModTool
// based on script ExportAllTilesets.csx (built-in to UndertaleModTool)

using ImageMagick;
using System.Text;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using UndertaleModLib.Util;

EnsureDataLoaded();

string exportedTilesetsFolder = PromptChooseDirectory("Choose an export folder");
if (exportedTilesetsFolder == null)
    throw new ScriptException("The export folder was not set, stopping script.");

SetProgressBar(null, "Tilesets", 0, Data.Backgrounds.Count);
StartProgressBarUpdater();

TextureWorker worker = null;
using (worker = new()) {
    await DumpTilesets();
}

await StopProgressBarUpdater();
HideProgressBar();
ScriptMessage("Exported successfully.");

async Task DumpTilesets() {
    await Task.Run(() => Parallel.ForEach(Data.Backgrounds, DumpTileset));
}

void DumpTileset(UndertaleBackground tileset) {
    if (tileset.Texture != null)
        worker.ExportAsPNG(tileset.Texture, Path.Combine(exportedTilesetsFolder, $"{tileset.Name.Content}.png"));
    else
        TextureWorker.SaveImageToFile(new MagickImage(MagickColors.Transparent, 1, 1), Path.Combine(exportedTilesetsFolder, $"{tileset.Name.Content}.notex.png"));

    IncrementProgressParallel();
}
