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

function formatString (...args) {
    if (args.length == 1) {
        if (typeof args[0] == "object" && args[0]?.length != undefined) return `[${args[0].map(val => formatString(val)).join(", ")}]`
        else return args[0].toString()
    } else {
        for (let i = 1; i < args.length; i++) {
            let placeholdStr = `{${i - 1}}`
            let placeholdIndex = args[0].indexOf(placeholdStr)
            args[0] = args[0].substring(0, placeholdIndex) + formatString(args[i]) + args[0].substring(placeholdIndex + placeholdStr.length)
        }
        return args[0]
    }
}
