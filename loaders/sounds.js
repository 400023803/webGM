function getMusic () {
    let folder = fetchData(`sounds/music`, "dir")

    for (let item of Object.keys(folder)) {
        let musName = item.substring(0, item.lastIndexOf("."))
        window[musName] = `sounds/music_${item}`
    }
}
function getSounds () {
    let folder = fetchData(`sounds`, "dir")

    for (let item of Object.keys(folder)) {
        if (item == "music") continue

        let musName = item.substring(0, item.lastIndexOf("."))
        window[musName] = `sounds_${item}`
    }
}

let playingSounds = []
function playSound (name, priority, loop) {
    let dir = name.substring(0, name.indexOf("_"))
    name = name.substring(name.indexOf("_") + 1)
    let sndBuf = fetchData(`${dir}/${name}`, "buf")
    
    let acx = new AudioContext()
    let source = acx.createBufferSource()
    
    let gain = acx.createGain()
    acx.decodeAudioData(sndBuf).then(function (buf) {
        source.buffer = buf
    })
    source.start()

    source.loop = loop
    source.connect(gain)
    gain.connect(acx.destination)

    let id = playingSounds.push({name, acx, source, gain}) - 1
    return id
}
function setSoundPitch (sound, pitch) {
    let data = null
    if (typeof sound == "string") {
        sound = sound.substring(sound.indexOf("_") + 1)
        data = playingSounds.find(val => val.name == sound)
    } else if (typeof sound == "number") data = playingSounds[sound]

    data.source.playbackRate.value = pitch
}
function setSoundGain (sound, vol, time) {
    let data = null
    if (typeof sound == "string") {
        sound = sound.substring(sound.indexOf("_") + 1)
        data = playingSounds.find(val => val.name == sound)
    } else if (typeof sound == "number") data = playingSounds[sound]
    
    data.gain.gain.linearRampToValueAtTime(vol, data.acx.currentTime + (time / 1000))
}
function stopSound (sound) {
    let data = null
    if (typeof sound == "string") {
        sound = sound.substring(sound.indexOf("_") + 1)
        let index = playingSounds.findIndex(val => val.name == sound)
        if (index == -1) return
        data = playingSounds[index]
        sound = index
    } else if (typeof sound == "number") data = playingSounds[sound]
    
    data.source.stop()
    playingSounds.splice(sound, 1)
}

function stopAllSounds () {
    for (let sound of playingSounds) {
        try { sound.source.stop() }
        catch (er) {}
    }
    playingSounds = []
}
