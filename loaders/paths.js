let pathList = {}
function getPaths () {
    let infoText = fetchData(`paths/ALL_PATHS_INFO_MAIN.csv`, "txt")
    let lines = infoText.split("\n")
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        if (line == "") continue

        let [nameId, smooth, closed, precision] = line.split(";")
        smooth = smooth == "true", closed = closed == "true"
        precision = +precision

        pathList[nameId] = {smooth, closed, precision}
        window[nameId] = nameId
    }
}

function loadPath (nameId) {
    let {smooth, closed, precision} = pathList[nameId]

    let points = []
    let dataText = fetchData(`paths/${nameId}.csv`, "txt")
    for (let line of dataText.split("\n")) {
        if (line == "") continue

        let [x, y, speed] = line.split(";")
        x = +x, y = +y, speed = +speed
        points.push({x, y, speed})
    }

    return {smooth, closed, precision, points}
}
