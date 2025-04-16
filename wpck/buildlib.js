function wpck2js (fileBuf) {
    let binary = ""
    let bytes = new Uint8Array(fileBuf.data)
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
    let b64 = btoa(binary)

    let buildData = `new WPCK("${b64}")`
    return buildData
}
async function buildWithFilesystem (makeJs = false) {
    let folder = await importFolder()

    let build = packWPCK(folder.structure)
    if (makeJs) build = wpck2js(build)
    else build = build.data

    downloadBtn.onclick = function () {
        exportFile(folder.name, `wpck${makeJs ? `.js` : ``}`, build)
    }
    downloadBtn.disabled = false
    downloadBtn.focus()
}
