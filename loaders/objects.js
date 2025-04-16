const eventKeyTypes = {
    "0": "vk_nokey",
    "1": "vk_anykey",
    "8": "vk_backspace",
    "9": "vk_tab",
    "13": "vk_enter",
    "13": "vk_return",
    "16": "vk_shift",
    "17": "vk_control",
    "18": "vk_alt",
    "19": "vk_pause",
    "27": "vk_escape",
    "32": "vk_space",
    "33": "vk_pageup",
    "34": "vk_pagedown",
    "35": "vk_end",
    "36": "vk_home",
    "37": "vk_left",
    "38": "vk_up",
    "39": "vk_right",
    "40": "vk_down",
    "44": "vk_printscreen",
    "45": "vk_insert",
    "46": "vk_delete",
    "48": "Digit0",
    "49": "Digit1",
    "50": "Digit2",
    "51": "Digit3",
    "52": "Digit4",
    "53": "Digit5",
    "54": "Digit6",
    "55": "Digit7",
    "56": "Digit8",
    "57": "Digit9",
    "65": "A",
    "66": "B",
    "67": "C",
    "68": "D",
    "69": "E",
    "70": "F",
    "71": "G",
    "72": "H",
    "73": "I",
    "74": "J",
    "75": "K",
    "76": "L",
    "77": "M",
    "78": "N",
    "79": "O",
    "80": "P",
    "81": "Q",
    "82": "R",
    "83": "S",
    "84": "T",
    "85": "U",
    "86": "V",
    "87": "W",
    "88": "X",
    "89": "Y",
    "90": "Z",
    "96": "vk_numpad0",
    "97": "vk_numpad1",
    "98": "vk_numpad2",
    "99": "vk_numpad3",
    "100": "vk_numpad4",
    "101": "vk_numpad5",
    "102": "vk_numpad6",
    "103": "vk_numpad7",
    "104": "vk_numpad8",
    "105": "vk_numpad9",
    "106": "vk_multiply",
    "107": "vk_add",
    "109": "vk_subtract",
    "110": "vk_decimal",
    "111": "vk_divide",
    "112": "vk_f1",
    "113": "vk_f2",
    "114": "vk_f3",
    "115": "vk_f4",
    "116": "vk_f5",
    "117": "vk_f6",
    "118": "vk_f7",
    "119": "vk_f8",
    "120": "vk_f9",
    "121": "vk_f10",
    "122": "vk_f11",
    "123": "vk_f12",
    "160": "vk_lshift",
    "161": "vk_rshift",
    "162": "vk_lcontrol",
    "163": "vk_rcontrol",
    "164": "vk_lalt",
    "165": "vk_ralt",
}
const eventMouseTypes = {
    "0": "LeftButton",
    "1": "RightButton",
    "2": "MiddleButton",
    "3": "NoButton",
    "4": "LeftPressed",
    "5": "RightPressed",
    "6": "MiddlePressed",
    "7": "LeftReleased",
    "8": "RightReleased",
    "9": "MiddleReleased",
    "10": "MouseEnter",
    "11": "MouseLeave",
    "16": "Joystick1Left",
    "17": "Joystick1Right",
    "18": "Joystick1Up",
    "19": "Joystick1Down",
    "21": "Joystick1Button1",
    "22": "Joystick1Button2",
    "23": "Joystick1Button3",
    "24": "Joystick1Button4",
    "25": "Joystick1Button5",
    "26": "Joystick1Button6",
    "27": "Joystick1Button7",
    "28": "Joystick1Button8",
    "31": "Joystick2Left",
    "32": "Joystick2Right",
    "33": "Joystick2Up",
    "34": "Joystick2Down",
    "36": "Joystick2Button1",
    "37": "Joystick2Button2",
    "38": "Joystick2Button3",
    "39": "Joystick2Button4",
    "40": "Joystick2Button5",
    "41": "Joystick2Button6",
    "42": "Joystick2Button7",
    "43": "Joystick2Button8",
    "50": "GlobLeftButton",
    "51": "GlobRightButton",
    "52": "GlobMiddleButton",
    "53": "GlobLeftPressed",
    "54": "GlobRightPressed",
    "55": "GlobMiddlePressed",
    "56": "GlobLeftReleased",
    "57": "GlobRightReleased",
    "58": "GlobMiddleReleased",
    "60": "MouseWheelUp",
    "61": "MouseWheelDown",
}
const eventGestureTypes = {
    "0": "Tap",
    "1": "DoubleTap",
    "2": "DragStart",
    "3": "DragMove",
    "4": "DragEnd",
    "5": "Flick",
    "6": "PinchStart",
    "7": "PinchIn",
    "8": "PinchOut",
    "9": "PinchEnd",
    "10": "RotateStart",
    "11": "Rotating",
    "12": "RotateEnd",
    "64": "GlobalTap",
    "65": "GlobalDoubleTap",
    "66": "GlobalDragStart",
    "67": "GlobalDragMove",
    "68": "GlobalDragEnd",
    "69": "GlobalFlick",
    "70": "GlobalPinchStart",
    "71": "GlobalPinchIn",
    "72": "GlobalPinchOut",
    "73": "GlobalPinchEnd",
    "74": "GlobalRotateStart",
    "75": "GlobalRotating",
    "76": "GlobalRotateEnd",
}
const eventOtherTypes = {
    "0": "OutsideRoom",
    "1": "IntersectBoundary",
    "2": "GameStart",
    "3": "GameEnd",
    "4": "RoomStart",
    "5": "RoomEnd",
    "6": "NoMoreLives",
    "7": "AnimationEnd",
    "8": "EndOfPath",
    "9": "NoMoreHealth",
    "10": "User0",
    "11": "User1",
    "12": "User2",
    "13": "User3",
    "14": "User4",
    "15": "User5",
    "16": "User6",
    "17": "User7",
    "18": "User8",
    "19": "User9",
    "20": "User10",
    "21": "User11",
    "22": "User12",
    "23": "User13",
    "24": "User14",
    "25": "User15",
    "26": "User16",
    "40": "OutsideView0",
    "41": "OutsideView1",
    "42": "OutsideView2",
    "43": "OutsideView3",
    "44": "OutsideView4",
    "45": "OutsideView5",
    "46": "OutsideView6",
    "47": "OutsideView7",
    "50": "BoundaryView0",
    "51": "BoundaryView1",
    "52": "BoundaryView2",
    "53": "BoundaryView3",
    "54": "BoundaryView4",
    "55": "BoundaryView5",
    "56": "BoundaryView6",
    "57": "BoundaryView7",
    "58": "AnimationUpdate",
    "59": "AnimationEvent",
    "60": "AsyncImageLoaded",
    "61": "AsyncSoundLoaded",
    "62": "AsyncHTTP",
    "63": "AsyncDialog",
    "66": "AsyncIAP",
    "67": "AsyncCloud",
    "68": "AsyncNetworking",
    "69": "AsyncSteam",
    "70": "AsyncSocial",
    "71": "AsyncPushNotification",
    "72": "AsyncSaveAndLoad",
    "73": "AsyncAudioRecording",
    "74": "AsyncAudioPlayback",
    "75": "AsyncSystem",
}
const eventTypes = {
    Create: {
        "0": "default",
    },
    Destroy: {
        "0": "default",
    },
    Alarm: {},
    Step: {
        "0": "Step",
        "1": "BeginStep",
        "2": "EndStep",
    },
    Collision: {},
    Keyboard: eventKeyTypes,
    Mouse: eventMouseTypes,
    Other: eventOtherTypes,
    Draw: {
        "0": "Draw",
        "64": "DrawGUI",
        "65": "Resize",
        "72": "DrawBegin",
        "73": "DrawEnd",
        "74": "DrawGUIBegin",
        "75": "DrawGUIEnd",
        "76": "PreDraw",
        "77": "PostDraw",
    },
    KeyPress: eventKeyTypes,
    KeyRelease: eventKeyTypes,
    Trigger: {},
    CleanUp: {},
    Gesture: eventGestureTypes,
    PreCreate: {},
}

let objectList = {}
function getObjects () {
    let infoText = fetchData(`objects/objects.csv`, "txt")
    for (let line of infoText.split("\n")) {
        if (line == "") continue

        let [nameId, visible, persistent, depth, parentObj, sprite_index, image_number] = line.split(";")
        if (parentObj == "") parentObj = null
        if (sprite_index == "") sprite_index = -1
        if (image_number == "") image_number = 0
        visible = visible == "true", persistent = persistent == "true"
        depth = +depth, image_number = +image_number
        let {sprite_width, sprite_height} = spriteList[sprite_index] || {sprite_width: null, sprite_height: null}
        objectList[nameId] = {visible, persistent, parentObj, depth, sprite_index, image_number, sprite_width, sprite_height, eventList: {}, inheritEventList: {}}

        for (let script of scriptList) {
            let u1 = script.lastIndexOf("_")
            let u2 = script.lastIndexOf("_", u1 - 1)
            let scName = script.substring(0, u2)
            let evType = script.substring(u2 + 1, u1)
            let evSubtype = script.substring(u1 + 1)
            if (eventTypes[evType] == undefined) continue
            let evSubtypeName = eventTypes[evType][evSubtype] || evSubtype

            if (scName == nameId) {
                if (objectList[nameId].eventList[evType] == undefined) objectList[nameId].eventList[evType] = []
                objectList[nameId].eventList[evType].push({
                    [evSubtypeName]: `${evType}_${evSubtype}`,
                })
            }
        }

        Object.defineProperty(window, nameId, {
            get () {
                return all.find(val => val?.object_index == nameId) || nameId
            }
        })
    }

    for (let objName of Object.keys(objectList)) {
        let obj = objectList[objName]
        let parentObj = objectList[obj.parentObj]
        if (parentObj != null) {
            for (let evType of Object.keys(parentObj.eventList)) {
                for (let evSubtypeObj of (parentObj.eventList[evType] || [])) {
                    if (obj.inheritEventList[evType] == undefined) objectList[objName].inheritEventList[evType] = []
                    objectList[objName].inheritEventList[evType].push(evSubtypeObj)
                }
            }
        }
    }
}

let vkKeys = {}
function getKeys () {
    let keys = Object.keys(eventKeyTypes)
    let vals = Object.values(eventKeyTypes)
    for (let i = 0; i < vals.length; i++) {
        if (vals[i].startsWith("vk_")) {
            vkKeys[vals[i]] = +keys[i]
            window[vals[i]] = +keys[i]
        }
    }
}
