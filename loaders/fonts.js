function getFonts () {
    let folder = fetchData(`fonts`, "dir")
    
    for (let item of Object.keys(folder)) {
        if (item.endsWith(".png")) {
            let fontName = item.substring(0, item.indexOf(".png"))
            window[fontName] = fontName
        }
    }
}

let fontCache = {}
let currentFont = null
function setFont (name) {
    if (fontCache[name] != undefined) {
        currentFont = fontCache[name]
        return
    }

    let pngUrl = fetchData(`fonts/${name}.png`, "url")
    let pngImg = document.createElement("img")
    pngImg.src = pngUrl
    let csvText = fetchData(`fonts/glyphs_${name}.csv`, "txt")

    currentFont = {pngImg, csvText}
    fontCache[name] = currentFont
}

function overlayImgData (imgData, bgImgData, colorOverride = null) {
    for (let j = 0; j < imgData.data.length; j += 4) {
        let fromData = bgImgData.data.slice(j, j + 4)
        let toData = imgData.data.slice(j, j + 4)
        if (toData.filter(val => val != 0).length == 0) {
            imgData.data[j + 0] = fromData[0]
            imgData.data[j + 1] = fromData[1]
            imgData.data[j + 2] = fromData[2]
            imgData.data[j + 3] = fromData[3]
        } else if (colorOverride != null) {
            let colArr = []
            for (let i = 1; i < colorOverride.length; i += 2) colArr.push(parseInt(colorOverride[i + 0] + colorOverride[i + 1], 16))
            
            imgData.data[j + 0] = colArr[0]
            imgData.data[j + 1] = colArr[1]
            imgData.data[j + 2] = colArr[2]
            imgData.data[j + 3] = 255
        }
    }
    return imgData
}
function drawText (mainX, mainY, str, isTest = false, testColorOverride = null) {
    if (typeof str == "number") str = `${str}`
    if (str == "") return
    
    let charCanvas = document.createElement("canvas")
    let charCtx = charCanvas.getContext("2d", {willReadFrequently: true})
    charCtx.imageSmoothingEnabled = false
    charCtx.drawImage(currentFont.pngImg, 0, 0)
    let outCanvas = document.createElement("canvas")
    let outCtx = outCanvas.getContext("2d", {willReadFrequently: true})
    outCtx.imageSmoothingEnabled = false

    let [fontName, fontSize, isBold, isItalic, charset, antialias, scaleX, scaleY] = currentFont.csvText.substring(0, currentFont.csvText.indexOf("\n")).split(";")
    fontSize = +fontSize

    let drawX = 0
    let drawY = 0
    let widthTotal = [0]
    let heightMax = 0
    for (let i = 0; i < str.length; i++) {
        if (str[i] == "\n") {
            drawX = 0
            drawY += fontSize
            widthTotal.push(0)
            heightMax = 0
            continue
        }

        let code = str[i].charCodeAt(0)
        let dataLineIndex = currentFont.csvText.indexOf(`\n${code};`) + 1
        let [sCode2, sX, sY, sW, sH, sShift, sOffset] = currentFont.csvText.substring(dataLineIndex, currentFont.csvText.indexOf("\n", dataLineIndex)).split(";").map(val => +val)

        drawX += sOffset
        let origImgData = outCtx.getImageData(drawX, drawY, sW, sH)
        let charImgData = charCtx.getImageData(sX, sY, sW, sH)
        charImgData = overlayImgData(charImgData, origImgData, drawCtx.fillStyle)

        widthTotal[widthTotal.length - 1] = Math.max(widthTotal[widthTotal.length - 1], drawX + charImgData.width)
        heightMax = Math.max(heightMax, charImgData.height)
        
        outCtx.putImageData(charImgData, drawX, drawY)
        drawX += sShift - sOffset
    }
    let widthMax = 0
    for (let widthTotalPart of widthTotal) widthMax = Math.max(widthMax, widthTotalPart)
    heightMax += drawY
    if (textAlignH == fa_right) mainX -= widthMax * drawScaleX
    else if (textAlignH == fa_center) mainX -= (widthMax / 2) * drawScaleX

    let imgData = outCtx.getImageData(0, 0, widthMax, heightMax)
    if (testColorOverride != null) {
        let colArr = []
        for (let i = 1; i < testColorOverride.length; i += 2) colArr.push(parseInt(testColorOverride[i] + testColorOverride[i + 1], 16))
        colArr.push(255)
    
        for (let i = 0; i < imgData.data.length; i += 4) {
            if (imgData.data[i + 3] == 0) continue
            
            imgData.data[i + 0] = colArr[0]
            imgData.data[i + 1] = colArr[1]
            imgData.data[i + 2] = colArr[2]
            imgData.data[i + 3] = colArr[3]
        }
    }
    outCanvas.width = widthMax
    outCanvas.height = heightMax
    outCtx.imageSmoothingEnabled = false
    outCtx.putImageData(imgData, 0, 0)

    if (isTest) return {outCanvas, widthMax, heightMax, mainXAdd: mainX, mainYAdd: mainY}
    else drawCtx.drawImage(outCanvas, drawScreenX + (mainX * drawScaleX), drawScreenY + (mainY * drawScaleY), widthMax * drawScaleX, heightMax * drawScaleY)
}
function drawTextTransformed (mainX, mainY, str, scaleX = 1, scaleY = 1, angle = 0, c1 = drawCtx.fillStyle, c2 = drawCtx.fillStyle, c3 = drawCtx.fillStyle, c4 = drawCtx.fillStyle, alpha = null) {
    if (typeof str == "number") str = `${str}`
    if (str == "") return

    let {outCanvas, widthMax, heightMax, mainXAdd, mainYAdd} = drawText(0, 0, str, true, c1)
    mainX += mainXAdd, mainY += mainYAdd
    
    drawCtx.translate(drawScreenX + (mainX * drawScaleX), drawScreenY + (mainY * drawScaleY))
    drawCtx.scale(scaleX, scaleY)
    drawCtx.rotate((-angle * Math.PI) / 180)
    let oldAlpha = drawCtx.globalAlpha
    if (alpha != null) drawCtx.globalAlpha = alpha

    drawCtx.drawImage(outCanvas, 0, 0, widthMax * drawScaleX, heightMax * drawScaleY)

    drawCtx.globalAlpha = oldAlpha
    drawCtx.rotate((angle * Math.PI) / 180)
    drawCtx.scale(1 / scaleX, 1 / scaleY)
    drawCtx.translate(-(drawScreenX + (mainX * drawScaleX)), -(drawScreenY + (mainY * drawScaleY)))
}
