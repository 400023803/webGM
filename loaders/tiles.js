function getTiles () {
    let folder = fetchData(`tiles`, "dir")
    
    for (let item of Object.keys(folder)) {
        let tilesetName = item.substring(0, item.lastIndexOf("."))
        window[tilesetName] = tilesetName
    }
}
