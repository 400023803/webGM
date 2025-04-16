function fetchData (path, type = "dir") {
    let pathParts = path.split("/")
    let currentPath = currentGamePack
    for (let pathPart of pathParts) currentPath = currentPath[pathPart]

    let fileName = pathParts[pathParts.length - 1]
    let dotIndex = fileName.lastIndexOf(".") + 1
    if (dotIndex == 0) dotIndex = fileName.length
    let fileExt = fileName.substring(dotIndex)
    let mimeType = getMimeType(fileExt)

    if (type == "dir") return currentPath
    else if (type == "txt") return currentPath.str(0, currentPath.data.byteLength)
    else if (type == "blb") return new Blob([currentPath.data], {type: mimeType})
    else if (type == "url") return URL.createObjectURL(new Blob([currentPath.data], {type: mimeType}))
    else if (type == "buf") {
        let out = new ArrayBuffer(currentPath.data.byteLength)
        new Uint8Array(out).set(new Uint8Array(currentPath.data))
        return out
    }
}
function getMimeType (fileExt) {
    if (fileExt == "") return "application/octet-stream"
    
    else if (fileExt == "txt") return "text/plain"
    else if (fileExt == "md") return "text/markdown"
    else if (fileExt == "html") return "text/html"
    else if (fileExt == "css") return "text/css"
    else if (fileExt == "js") return "text/javascript"
    else if (fileExt == "csv") return "text/csv"
    else if (fileExt == "png") return "image/png"
    else if (fileExt == "jpg") return "image/jpeg"
    else if (fileExt == "jpeg") return "image/jpeg"
    else if (fileExt == "svg") return "image/svg+xml"
    
    else return "application/octet-stream"
}

async function getGameList () {
    let resp = await fetch(`./games/`)
    let str = await resp.text()

    let isFolder = str.startsWith("<html><head><title>localhost - /") && str.indexOf("[To Parent Directory]") > -1
    if (!isFolder) throw new Error(`Failed to load games folder`)
    let doc = new DOMParser().parseFromString(str, "text/html")
    let linkList = doc.querySelectorAll("a")
    
    let gameList = []
    for (let link of linkList) {
        if (link.innerText != "[To Parent Directory]") {
            if (link.innerText == "dumps") continue
            let gameName = link.innerText.substring(0, link.innerText.lastIndexOf(".wpck"))
            gameList.push(gameName)
        }
    }
    return gameList
}
