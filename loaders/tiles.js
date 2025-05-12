function getTiles () {
    let folder = fetchData(`tiles`, "dir")
    
    for (let item of Object.keys(folder)) {
        let tilesetName = item.substring(0, item.indexOf(".png"))
        window[tilesetName] = tilesetName
    }
}

let loadedBackgrounds = {}
function loadBackground (name) {
    let bgUrl = fetchData(`tiles/${name}.png`, "url")
    let img = document.createElement("img")
    img.src = bgUrl
    loadedBackgrounds[name] = img
}
function drawBackground (bg, x, y) {
    if (loadedBackgrounds[bg] == undefined) loadBackground(bg)

    let img = loadedBackgrounds[bg]
    drawCtx.drawImage(img, drawScreenX + (x * drawScaleX), drawScreenY + (y * drawScaleY), img.width * drawScaleX, img.height * drawScaleY)
}
