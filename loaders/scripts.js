let loadedScripts = {}
function loadScript (name) {
    console.debug(`[debug] Loading script "${name}"`)

    if (Object.keys(loadedScripts).indexOf(name) == -1) {
        let typeName = name.substring(0, name.indexOf("_")).toLowerCase()
        let type = (typeName == "obj" || typeName == "blt") ? "Object" : "Script"
        let text = fetchData(`scripts/gml_${type}_${name}.gml`, "txt")
        text = correctScriptSyntax(text)

        loadedScripts[name] = text
        window[name] = function (...args) {
            setupScriptArgs(...args)
            if (this.runContext != undefined) runContextCopy = this.runContext
            let fixedText = `let self = all[${runContextCopy}]\nwith (self) {\n${text}}\n`

            try {
                return new Function(fixedText)()
            } catch (er) {
                console.warn(`Error running script "${name}"`)
                console.error(er)
                console.log([fixedText])
                console.log(argument)
                console.warn("Pausing game...")
                
                endMainTickLoop()
                stopAllSounds()
            }
        }
    }
}
function correctScriptSyntax (gmlScript) {
    gmlScript = correctLabel(gmlScript, "if ", function (gmlScript, labelStr, labelIndex, newlineIndex) {
        let beforeStr = gmlScript.substring(0, labelIndex + labelStr.length)
        let middleStr = gmlScript.substring(labelIndex + labelStr.length, newlineIndex)
        let afterStr = gmlScript.substring(newlineIndex)
        return `${beforeStr}(${middleStr})${afterStr}`
    })
    gmlScript = correctLabel(gmlScript, "else if ", function (gmlScript, labelStr, labelIndex, newlineIndex) {
        let beforeStr = gmlScript.substring(0, labelIndex + labelStr.length)
        let middleStr = gmlScript.substring(labelIndex + labelStr.length, newlineIndex)
        let afterStr = gmlScript.substring(newlineIndex)
        return `${beforeStr}(${middleStr})${afterStr}`
    })
    gmlScript = correctLabel(gmlScript, "while ", function (gmlScript, labelStr, labelIndex, newlineIndex) {
        let beforeStr = gmlScript.substring(0, labelIndex + labelStr.length)
        let middleStr = gmlScript.substring(labelIndex + labelStr.length, newlineIndex)
        let afterStr = gmlScript.substring(newlineIndex)
        return `${beforeStr}(${middleStr})${afterStr}`
    })
    gmlScript = correctLabel(gmlScript, "switch ", function (gmlScript, labelStr, labelIndex, newlineIndex) {
        let beforeStr = gmlScript.substring(0, labelIndex + labelStr.length)
        let middleStr = gmlScript.substring(labelIndex + labelStr.length, newlineIndex)
        let afterStr = gmlScript.substring(newlineIndex)
        return `${beforeStr}(${middleStr})${afterStr}`
    })
    gmlScript = correctLabel(gmlScript, "repeat ", function (gmlScript, labelStr, labelIndex, newlineIndex) {
        let beforeStr = gmlScript.substring(0, labelIndex)
        let middleStr = gmlScript.substring(labelIndex + labelStr.length, newlineIndex)
        let afterStr = gmlScript.substring(newlineIndex)
        return `${beforeStr}for (let _ = 0; _ < (${middleStr}); _++)${afterStr}`
    })
    gmlScript = correctLabel(gmlScript, "with ", function (gmlScript, labelStr, labelIndex, newlineIndex) {
        let beforeStr = gmlScript.substring(0, labelIndex)
        let middleStr = gmlScript.substring(labelIndex + labelStr.length + 1, newlineIndex - 1)
        let afterStr = gmlScript.substring(newlineIndex)

        if (middleStr.toLowerCase().startsWith("obj_")) return `${beforeStr}for (let __ of all.filter(val => val?.object_index == ("${middleStr}"))) with (__)${afterStr}`
        else return `${beforeStr}with (all[${middleStr}])${afterStr}`
    })
    gmlScript = correctLabel(gmlScript, "} until ", function (gmlScript, labelStr, labelIndex, newlineIndex) {
        let beforeStr = gmlScript.substring(0, labelIndex + 2)
        let middleStr = gmlScript.substring(labelIndex + 8, newlineIndex)
        let afterStr = gmlScript.substring(newlineIndex)

        if (middleStr.endsWith(";")) middleStr = middleStr.substring(0, middleStr.length - 1)
        return `${beforeStr}while (!(${middleStr}))${afterStr}`
    })

    gmlScript = correctLabel(gmlScript, "exit", function (gmlScript, labelStr, labelIndex, newlineIndex) {
        let beforeStr = gmlScript.substring(0, labelIndex)
        let afterStr = gmlScript.substring(labelIndex + labelStr.length)
        return `${beforeStr}return${afterStr}`
    })

    if (!gmlScript.startsWith("(async function () {")) {
        let scriptLines = gmlScript.split("\n")
        for (let i = 0; i < scriptLines.length; i++) {
            let lineAll = scriptLines[i]
            let charIndex = lineAll.search(/[^ ]/)
            if (charIndex == -1) continue
            let lineStart = lineAll.substring(0, charIndex)
            let lineMain = lineAll.substring(charIndex)
            
            let equalsIndex = lineMain.indexOf("] = ") + 1
            if (equalsIndex == 0) equalsIndex = lineMain.indexOf(" ")
            if (equalsIndex == -1) continue
            if (!lineMain.substring(equalsIndex).startsWith(" = ")) continue
            let varName = lineMain.substring(0, equalsIndex)
            let varNameNoArr = varName
            let varNameNoArrIndex = varNameNoArr.indexOf("[")
            if (varNameNoArrIndex > -1) varNameNoArr = varNameNoArr.substring(0, varNameNoArrIndex)
            
            if (varName.indexOf(".") > -1) {
                if (varNameNoArrIndex > -1) scriptLines[i] = `${lineStart}{ let ___ = false; try { ___ = ${varName} == undefined } catch (er) { ${varNameNoArr} = [] }; ${lineMain} }`
                continue
            }

            scriptLines[i] = `${lineStart}{ let ___ = false; try { ___ = ${varNameNoArr} == undefined } catch (er) { self.${varNameNoArr} = [] }; if (!___) { self.${lineMain} } else { self.${varNameNoArr} = []; ${lineMain} } }`
        }
        gmlScript = scriptLines.join("\n")
    }

    gmlScript = gmlScript.replaceAll("\\", "\\\\")

    return gmlScript
}
function correctLabel (gmlScript, labelStr, callback) {
    let labelIndex = gmlScript.indexOf(labelStr)
    while (labelIndex > -1) {
        let lastNewline = gmlScript.lastIndexOf("\n", labelIndex) + 1
        let isValid = gmlScript.substring(lastNewline, labelIndex).search(/[^ ]/) == -1
        if (isValid) {
            let newlineIndex = gmlScript.indexOf("\n", labelIndex)
            if (newlineIndex == -1) newlineIndex = gmlScript.length
    
            gmlScript = callback(gmlScript, labelStr, labelIndex, newlineIndex)
        }

        labelIndex = gmlScript.indexOf(labelStr, gmlScript.indexOf("\n", labelIndex))
    }
    return gmlScript
}
function isScriptEmpty (type, name, instanceIndex, isInherited = false) {
    let nameId = all[instanceIndex].object_index
    let object = objectList[nameId]
    let evNameObjList = object.eventList?.[type]
    if (evNameObjList == undefined || isInherited) {
        evNameObjList = object.inheritEventList?.[type]
        nameId = object.parentObj
    }

    if (evNameObjList == undefined) return true
    let evName = evNameObjList.find(val => val[name] != undefined)?.[name]
    if (evName == undefined) return true

    let gmlScriptName = `${nameId}_${evName}`
    if (loadedScripts[gmlScriptName] == undefined) loadScript(gmlScriptName)
    let gmlScript = loadedScripts[gmlScriptName]
    return gmlScript == ""
}

function execScript (name, ...args) {
    if (typeof name == "string") return window[name].call({runContext: this.runContext}, ...args)
    else if (typeof name == "function") return name.call({runContext: this.runContext}, ...args)
    else throw new Error(`Error executing script "${name}" - Invalid data type "${typeof name}"`)
}
function setupScriptArgs (...args) {
    argument_count = args.length
    argument = args
    for (let i = 0; i < args.length; i++) window[`argument${i}`] = args[i]
}

let scriptList = []
function getScripts () {
    let folder = fetchData(`scripts`, "dir")
    
    for (let item of Object.keys(folder)) {
        let name = item.substring(item.indexOf("_") + 1, item.lastIndexOf(".gml"))
        let funcName = name.substring(name.indexOf("_") + 1)
        
        scriptList.push(funcName)
        window[funcName] = function (...args) {
            loadScript(funcName)
            return execScript.call({runContext: this.runContext}, funcName, ...args)
        }
    }
}

function fireEventsOneInstance (type, names = "default", instanceIndex, isInherited = false) {
    if (typeof names == "string") names = [names]

    let object = objectList[all[instanceIndex]?.object_index]
    if (object == undefined) return
    let nameId = all[instanceIndex].object_index
    let evNameObjList = object.eventList?.[type]
    if (evNameObjList == undefined || isInherited) {
        evNameObjList = object.inheritEventList?.[type]
        nameId = object.parentObj
    }

    if (evNameObjList == undefined) return
    for (let name of names) {
        for (let evNameObj of evNameObjList) {
            if (evNameObj[name] != undefined) {
                all[instanceIndex].currentEventType = type
                all[instanceIndex].currentEventSubtype = names
                execScript.call({runContext: instanceIndex}, `${nameId}_${evNameObj[name]}`)
            }
        }
    }
}
function fireEventsAllInstances (type, names = "default", instancesList = all) {
    if (typeof names == "string") names = [names]

    for (let name of names) {
        for (let j = 0; j < instancesList.length; j++) {
            if (instancesList[j] == null) continue
            let i = instancesList[j].id
            
            let nameId = all[i]?.object_index
            let object = objectList[nameId]
            let evNameObjList = object?.eventList?.[type]
            
            if (evNameObjList == undefined) continue
            for (let evNameObj of evNameObjList) {
                if (evNameObj[name] != undefined) {
                    all[i].currentEventType = type
                    all[i].currentEventSubtype = names
                    execScript.call({runContext: i}, `${nameId}_${evNameObj[name]}`)
                }
            }
        }
    }
}
