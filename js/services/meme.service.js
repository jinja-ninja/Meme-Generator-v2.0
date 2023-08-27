'use strict'

const FONT_DIFF = 5

let gKeywordSearchCountMap = { 'you': 12, 'cat': 16, 'kid': 2, 'dog': 9, 'politics': 1, 'evil': 5 } //How to do it with whole words??
let gMeme = { // How to make it without the double initialization in lines?
    dataUrl: null,
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [{
        txt: 'Enter Text Here',
        size: 40,
        color: 'black',
        font: 'Impact',
        align: 'center',
        isDrag: false,
        isSticker: false
    }]
}

function getMeme() {
    return gMeme
}

function updateKeywordsCountMap(keyword) {
    if (keyword === '') return
    else if (gKeywordSearchCountMap[keyword] === undefined) gKeywordSearchCountMap[keyword] = 0
    else gKeywordSearchCountMap[keyword] += 1
}

function setMeme(imgId) {
    gMeme.selectedImgId = imgId
    gMeme.dataUrl = null
}

function setSeletctedLineIdx() {
    gMeme.selectedLineIdx = null
}

function setTextAlignment(align) {
    gMeme.lines[gMeme.selectedLineIdx].align = align
}

function setLineDrag(bool) {
    gMeme.lines[gMeme.selectedLineIdx].isDrag = bool
}

function setLineFont(font) {
    gMeme.lines[gMeme.selectedLineIdx].font = font
}
function setFontSize(diff) {
    gMeme.lines[gMeme.selectedLineIdx].size += diff * FONT_DIFF
}

function setTextColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

function setLineText(text) {
    gMeme.lines[gMeme.selectedLineIdx].txt = text
}

function addCharToLine(char) {
    gMeme.lines[gMeme.selectedLineIdx].txt += char
}

function switchLine() {
    gMeme.selectedLineIdx++
    if (gMeme.selectedLineIdx === gMeme.lines.length) gMeme.selectedLineIdx = 0
}

function addLine(text = undefined) {
    gMeme.selectedLineIdx += 1
    if (text) {
        gMeme.lines = [...gMeme.lines, _createLine(text)]
        gMeme.lines[gMeme.selectedLineIdx].isSticker = true
    } else gMeme.lines = [...gMeme.lines, _createLine()]
}

function addSticker(sticker = undefined) {
    if (gMeme.selectedSticker === undefined) gMeme.selectedSticker = 0
    else gMeme.selectedSticker++

    gMeme.stickers = []
}

function moveRowYAxis(diff) {
    gMeme.lines[gMeme.selectedLineIdx].pos.y += diff * 10
}

function moveLine(dx, dy) {
    gMeme.lines[gMeme.selectedLineIdx].pos.x += dx
    gMeme.lines[gMeme.selectedLineIdx].pos.y += dy
}

function setImgDataUrl(url) {
    gMeme.dataUrl = url
}

function _createLine(text = undefined) {
    return {
        txt: text ? text : 'Enter Text Here',
        size: 40,
        color: 'black',
        font: 'Impact',
        align: 'center',
        isDrag: false,
        isSticker: false
    }
}

function createCustomMeme() {
    gMeme.selectedLineIdx = 0
    gMeme.lines = [_createLine()]
}

function getMemsFromStorage() {
    let savedMems = loadFromStorage('savedMems')
    if (!savedMems || !savedMems.length) savedMems = []
    return savedMems
}

function saveMemeToStorage() {
    const savedMems = getMemsFromStorage()
    savedMems.push(structuredClone(gMeme))
    saveToStorage('savedMems', savedMems)
}

function deleteSelectedLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
}

function checkClick(clickedPos) {
    const click = { isLine: false }
    gMeme.lines.forEach((line, idx) => {
        const lineStartX = line.pos.x - (line.width / 2)
        const lineStartY = line.pos.y - (line.height / 2)

        if (clickedPos.x > lineStartX && clickedPos.x < (lineStartX + line.width)
            && clickedPos.y > lineStartY && clickedPos.y < (lineStartY + line.height)) {
            click.isLine = true
            click.lineIdx = idx
            return click
        }
    })
    return click
}

function setLineDimensions(text, lineIdx) {
    let measure = gCtx.measureText(text)
    gMeme.lines[lineIdx].height = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent
    gMeme.lines[lineIdx].width = measure.actualBoundingBoxLeft + measure.actualBoundingBoxRight
}

function setMemeToSelectedFromSaved(id) {
    gMeme = loadSavedMemesFromStorage()[id]
}
