let roomList = {}
function getRooms () {
    let infoText = fetchData(`rooms/ALL_ROOMS_INFO_MAIN.csv`, "txt")
    let lines = infoText.split("\n")
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        if (line == "") continue

        let [nameId, width, height, speed, background] = line.split(";")
        if (width == "") width = canvasEl.width
        if (height == "") height = canvasEl.height
        width = +width, height = +height, speed = +speed

        roomList[nameId] = {width, height, speed, background}
        window[nameId] = nameId
    }
}

function loadRoomInstances () {
    let {width, height, speed, background} = Object.values(roomList)[room]
    room_width = width, room_height = height, room_speed = speed
    roomBackground = background

    let instances = []
    let roomName = Object.keys(roomList)[room]
    let dataText = fetchData(`rooms/${roomName}.csv`, "txt")
    for (let line of dataText.split("\n")) {
        if (line == "") continue

        let [nameId, x, y] = line.split(";")
        x = +x, y = +y
        instances.push({object_index: nameId, x, y})
    }

    return instances
}

function getRoomName (room) {
    if (typeof room == "string") return room
    else if (typeof room == "number") return Object.keys(roomList)[room]
}
