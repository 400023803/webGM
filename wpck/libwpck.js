function packWPCK (structure) {
    let items = []
    function structure2items (structure, path = []) {
        let keys = Object.keys(structure)
        for (let key of keys) {
            let obj = structure[key]
            let isFile = obj instanceof FileBuf || obj instanceof FileBufWriter
            let id = items.push({
                path,
                name: key,
                type: isFile ? "FILE" : "FOLD",
                data: isFile ? obj : null,
            }) - 1
            if (!isFile) structure2items(obj, [...path, id])
        }
    }
    structure2items(structure)

    let endian = Endian.BIG
    let itemBlocks = new Array(items.length)
        for (let i = 0x00; i < items.length; i++) {
            let item = items[i]
            let pathLength = item.path.length
            let nameLength = item.name.length
            let typeId = item.type == "FILE" ? 0x00 : 0x01
            let dataLength = item.type == "FILE" ? item.data.data.byteLength : 0x00
            
            let blockSize =
                IntSize.U16 +
                IntSize.U16 +
                (IntSize.U16 * pathLength) +
                IntSize.U8 +
                (0x01 * nameLength) +
                IntSize.U8 +
                IntSize.U32 +
                IntSize.U32
            itemBlocks[i] = {
                blockSize,
                pathLength,
                path: item.path,
                nameLength,
                name: item.name,
                typeId,
                dataLength,
                data: item.data?.data || null,
            }
        }
    let itemBlockOffsets = new Array(items.length)
        for (let i = 0x00; i < items.length; i++) {
            let itemBlockOffset = (0x0C + (IntSize.U32 * items.length)) + itemBlocks.slice(0, i).reduce((acc, val) => acc + val.blockSize + 1, 0)
            itemBlockOffsets[i] = itemBlockOffset
        }
    let itemDataOffsets = new Array(items.length)
        for (let i = 0x00; i < items.length; i++) {
            let offset = ((0x0C + (IntSize.U32 * items.length)) + itemBlocks.reduce((acc, val) => acc + val.blockSize + 1, 0)) + itemBlocks.slice(0, i).reduce((acc, val) => acc + val.dataLength, 0)
            itemDataOffsets[i] = offset
        }
    
    let fileSize = itemDataOffsets.at(-1) + itemBlocks.at(-1).dataLength
    let fileBufWriter = new FileBufWriter(new ArrayBuffer(fileSize))
        fileBufWriter.str(0x00, "ML3F-WPCK")
        fileBufWriter.int(0x09, 0x01, endian, IntSize.U8)
        fileBufWriter.int(0x0A, items.length, endian, IntSize.U16)
        for (let i = 0x00; i < items.length; i++) {
            let offset = itemBlockOffsets[i]
                fileBufWriter.int(0x0C + (IntSize.U32 * i), offset, endian, IntSize.U32)
            let dataOffset = itemDataOffsets[i]
            let itemBlock = itemBlocks[i]
                fileBufWriter.int(offset, itemBlock.blockSize, endian, IntSize.U8)
                fileBufWriter.int(offset + 0x01, i, endian, IntSize.U16)
                fileBufWriter.int(offset + 0x03, itemBlock.pathLength, endian, IntSize.U16)
                for (let j = 0x00; j < itemBlock.pathLength; j++) fileBufWriter.int((offset + 0x05) + (j * IntSize.U16), itemBlock.path[j], endian, IntSize.U16)
                    offset += itemBlock.path.length * IntSize.U16
                fileBufWriter.int(offset + 0x05, itemBlock.nameLength, endian, IntSize.U8)
                fileBufWriter.str(offset + 0x06, itemBlock.name)
                    offset += itemBlock.nameLength
                fileBufWriter.int(offset + 0x06, itemBlock.typeId, endian, IntSize.U8)
                fileBufWriter.int(offset + 0x07, itemBlock.dataLength, endian, IntSize.U32)
                fileBufWriter.int(offset + 0x0B, itemBlock.typeId == 0x00 ? dataOffset : 0x00, endian, IntSize.U32)
            if (itemBlock.typeId == 0x00) fileBufWriter.buf(dataOffset, itemBlock.data)
        }
    let outBuf = fileBufWriter.data
    let outFileBuf = new FileBuf(outBuf)
    return outFileBuf
}
function unpackWPCK (fileBuf) {
    let endian = Endian.BIG
    let magic = fileBuf.str(0x00, 0x09)
        FileBuf.expectVal(magic, `ML3F-WPCK`, `Invalid file magic (expected "ML3F-WPCK", got "${magic}")`)
    let version = fileBuf.int(0x09, IntSize.U8, endian)
        FileBuf.expectVal(version, 0x01, `Invalid file version (expected 0x01, got ${version})`)
    let itemCount = fileBuf.int(0x0A, IntSize.U16, endian)
    let itemOffsets = new Array(itemCount)
        let itemOffsetsBuf = fileBuf.buf(0x0C, itemCount * IntSize.U32)
        for (let i = 0x00; i < itemCount; i++) {
            let itemOffset = itemOffsetsBuf.int(i * IntSize.U32, IntSize.U32, endian)
            itemOffsets[i] = itemOffset
        }
    let items = new Array(itemCount)
        for (let i = 0x00; i < itemCount; i++) {
            let itemOffset = itemOffsets[i]
            let blockSize = fileBuf.int(itemOffset, IntSize.U8, endian)
            let block = fileBuf.buf(itemOffset + 0x01, blockSize)
                let index = block.int(0x00, IntSize.U16, endian)
                let pathLength = block.int(0x02, IntSize.U16, endian)
                let pathBuf = block.buf(0x04, pathLength * IntSize.U16, endian)
                    let path = new Array(pathLength)
                    for (let j = 0x00; j < pathLength; j++) {
                        let pathPart = pathBuf.int(j * IntSize.U16, IntSize.U16, endian)
                        path[j] = pathPart
                    }
                    let curIndex = 0x04 + (pathLength * IntSize.U16)
                let nameLength = block.int(0x00 + curIndex, IntSize.U8, endian)
                let name = block.str(0x01 + curIndex, nameLength)
                    curIndex += 0x01 + nameLength
                let typeId = block.int(0x00 + curIndex, IntSize.U8, endian)
                    let type = null
                    if (typeId == 0x00) type = "FILE"
                    else if (typeId == 0x01) type = "FOLD"
                let dataLength = block.int(0x01 + curIndex, IntSize.U32, endian)
                let dataOffset = block.int(0x05 + curIndex, IntSize.U32, endian)
                let data = null
                    if (typeId == 0x00) data = fileBuf.buf(dataOffset, dataLength)
            items[index] = {
                path,
                name,
                type,
                data,
            }
        }
    let structure = {}
        for (let i = 0; i < items.length; i++) {
            let item = items[i]
            let currentPath = structure
            for (let pathPart of item.path) currentPath = currentPath[items[pathPart].name]
            if (item.type == "FILE") currentPath[item.name] = item.data
            else if (item.type == "FOLD") currentPath[item.name] = {}
        }
    return structure
}

/*
**FINF # ML3F-WPCK format

**INFO

FLG endian : "EBIG
FLG start : !HEAD

**DATA

*HEAD

STR[9] magic : "ML3F-WPCK
U8 version : "0x01
U16 itemCount
U32[itemCount] itemOffset : ~ITEM

*ITEM

U8 blockSize # size does not include this field
U16 index
U16 pathLength # number of items, not number of bytes
U16[pathLength] pathIndexes
U8 nameLength
STR[nameLength] name
U8 type = 0x00 - .file, 0x01 - .fold
U32 dataLength
U32 dataOffset : .file - ~FILE : .fold - "0x00

*FILE

BYT[^dataLength] data

**ENDF
*/
