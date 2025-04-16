let spriteList = {}
function getSprites () {
    let folder = fetchData("sprites", "dir")
    for (let item of Object.keys(folder)) window[item] = item

    let list = fetchData("sprites/sprites.csv", "txt")
    for (let line of list.split("\n")) {
        if (line == "") continue

        let [name, sprite_width, sprite_height] = line.split(";")
        sprite_width = +sprite_width, sprite_height = +sprite_height
        spriteList[name] = {sprite_width, sprite_height}
    }
}

let loadedSprites = {}
function loadSprite (name) {
    let folder = fetchData(`sprites/${name}`, "dir")
    let frames = Object.keys(folder).map(val => +val.substring(name.length + 1, val.lastIndexOf(".png")))
    frames.sort((a, b) => a - b)

    let images = []
    for (let item of frames) {
        let pngUrl = fetchData(`sprites/${name}/${name}_${item}.png`, "url")
        let img = document.createElement("img")
        img.src = pngUrl
        images.push(img)
    }

    loadedSprites[name] = {images}
}

function drawSprite (instance) {
    let sprite = instance.sprite_index
    if (sprite == -1) return
    let frame = instance.image_index
    let {x, y} = instance
    let scaleX = instance.image_xscale, scaleY = instance.image_yscale

    if (loadedSprites[sprite] == undefined) loadSprite(sprite)
    let img = loadedSprites[sprite].images[frame]
    let width = spriteList[sprite].sprite_width
    let height = spriteList[sprite].sprite_height
    drawCtx.drawImage(img, drawScreenX + (x * drawScaleX), drawScreenY + (y * drawScaleY), (width * drawScaleX) * scaleX, (height * drawScaleY) * scaleY)
}
function drawSpriteStatic (sprite, frame, x, y, scaleX = 1, scaleY = 1, angle = 0, blendColor = c_white, alpha = null) {
    if (loadedSprites[sprite] == undefined) loadSprite(sprite)

    drawCtx.translate(drawScreenX + (x * drawScaleX), drawScreenY + (y * drawScaleY))
    drawCtx.scale(scaleX, scaleY)
    drawCtx.rotate((-angle * Math.PI) / 180)
    let oldAlpha = drawCtx.globalAlpha
    if (alpha != null) drawCtx.globalAlpha = alpha

    let img = loadedSprites[sprite].images[frame]
    let width = spriteList[sprite].sprite_width
    let height = spriteList[sprite].sprite_height
    drawCtx.drawImage(img, 0, 0, width * drawScaleX, height * drawScaleY)

    drawCtx.globalAlpha = oldAlpha
    drawCtx.rotate((angle * Math.PI) / 180)
    drawCtx.scale(1 / scaleX, 1 / scaleY)
    drawCtx.translate(-(drawScreenX + (x * drawScaleX)), -(drawScreenY + (y * drawScaleY)))
}
function drawSpriteStaticPart (sprite, frame, left, top, w, h, x, y) {
    if (loadedSprites[sprite] == undefined) loadSprite(sprite)

    let img = loadedSprites[sprite].images[frame]
    drawCtx.drawImage(img, left, top, w, h, drawScreenX + (x * drawScaleX), drawScreenY + (y * drawScaleY), w * drawScaleX, h * drawScaleY)
}
