let gameInfo = {}
function getInfo () {
    let info = fetchData("info/info.csv", "txt")

    let lines = info.split("\n")
    let [width, height] = lines[0].split(";")
    if (width == "") width = canvasEl.width
    if (height == "") height = canvasEl.height
    width = +width, height = +height
    gameInfo = {width, height}
}
