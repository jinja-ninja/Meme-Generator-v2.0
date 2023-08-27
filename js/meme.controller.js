'use strict'

let gElCanvas
let gCtx
let gStartPos
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

function initMemeEditor(imgId) {
    DisplayMemeEditor()

    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    addListiners()
    resizeCanvas()
    setMeme(imgId)
    renderMeme()
}

function renderMeme() {
    const meme = getMeme()
    const elImg = new Image()
    if (meme.dataUrl) elImg.src = meme.dataUrl
    else elImg.src = `images/${meme.selectedImgId}.jpg`

    elImg.addEventListener('load', handleMemeLoad(meme, elImg))
    handleUserInputText()
}

function handleMemeLoad(meme, elImg) {
    gElCanvas.height = (elImg.naturalHeight / elImg.naturalWidth) * gElCanvas.width
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
    meme.lines.forEach((line, idx) => {
        if (!line.pos) line.pos = getInitialLinePos(idx)
        drawText(line, line.pos.x, line.pos.y)
        setLineDimensions(line.txt, idx)
    })
    const selectedLine = meme.lines[meme.selectedLineIdx]
    if (selectedLine) drawSelectionFrame(selectedLine.txt, selectedLine.pos.x, selectedLine.pos.y)
}

function getInitialLinePos(idx) {
    if (idx === 0) return { x: gElCanvas.width / 2, y: gElCanvas.height / 10 }
    else if (idx === 1) return { x: gElCanvas.width / 2, y: gElCanvas.height * (9 / 10) }
    else return { x: gElCanvas.width / 2, y: gElCanvas.height / 2 }
}

function resizeCanvas() {
    const elContainer = getDomElement('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
}

function addListiners() {
    addMouseListeners()
    addTouchListeners()
    addArrowKeysListener()
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderMeme()
    })
}

function onDownloadClick(elLink) {
    clearMemeFrames()
    const dataUrl = gElCanvas.toDataURL()
    elLink.href = dataUrl
    elLink.download = 'Meme'
}

function DisplayMemeEditor() {
    removeClass('.meme-editor-container', 'hide')
    addClass('.meme-editor-container', 'grid')
}

function hideMemeEditor() {
    removeClass('.meme-editor-container', 'grid')
    addClass('.meme-editor-container', 'hide')

    removeClass('.saved-memes-container', 'grid')
    addClass('.saved-memes-container', 'hide')

    removeClass('.gallery-container', 'hide')
    addClass('.gallery-container', 'grid')

    getDomElement('.filter-by-selector').value = ''
    getDomElement('.search-bar').value = ''

    onFilterClick('')
    onSearchMeme('')
}

function onSwitchLine() {
    switchLine()
    renderMeme()
}

function onDown(ev) {
    const meme = getMeme()
    const pos = getEvPos(ev)
    const click = checkClick(pos)
    // debugger
    if (!click.isLine) {
        setSeletctedLineIdx()
        renderMeme()
        return
    }

    meme.selectedLineIdx = click.lineIdx
    handleUserInputText()
    renderMeme()
    setLineDrag(true)
    gStartPos = pos
    document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
    const meme = getMeme() // This happens tons of times in a sec, is it good?
    if (meme.selectedLineIdx === null) return
    if (meme.selectedLineIdx > meme.lines.length || !meme.lines.length) return
    if (!meme.lines[meme.selectedLineIdx].isDrag) return

    const pos = getEvPos(ev)
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    moveLine(dx, dy)
    gStartPos = pos
    renderMeme()
}

function onUp() {
    const meme = getMeme()
    if (meme.selectedLineIdx === null) return
    setLineDrag(false)
    document.body.style.cursor = 'default'
}

function changePlaceholderText(text) {
    getDomElement('.user-text-input').placeholder = text
}

function clearUserTextInput() {
    const elInput = getDomElement('.user-text-input')
    elInput.value = ''
}

function clearMemeFrames() {
    const meme = getMeme()
    setSeletctedLineIdx()
    renderMeme()
}

function onSaveMeme() {
    clearMemeFrames()
    const dataUrl = gElCanvas.toDataURL()
    setImgDataUrl(dataUrl)
    saveMemeToStorage()
    setImgDataUrl(null)
}

function handleUserInputText() {
    clearUserTextInput()
    const meme = getMeme()
    if (meme.selectedLineIdx === null) return
    const lineText = getLineText()
    const elInput = getDomElement('.user-text-input')

    if (lineText === 'Enter Text Here') {
        elInput.value = ''
        elInput.placeholder = 'Enter Text Here'
    } else elInput.value = lineText
}

function getLineText() {
    const meme = getMeme()
    return meme.lines[meme.selectedLineIdx].txt
}

function onStickerClick(sticker) {
    addLine(sticker)
    renderMeme()
}

function onDeleteSelectedLine() {
    deleteSelectedLine()
    switchLine()
    clearUserTextInput()
    renderMeme()
}

function onSetTextAlignment(align) {
    setTextAlignment(align)
    renderMeme()
}

function onSetFont(font) {
    setLineFont(font)
    renderMeme()
}

function onIncreaseSize() {
    setFontSize(1)
    renderMeme()
}
function onDecreaseSize() {
    setFontSize(-1)
    renderMeme()
}

function onChangeTextColor(color) {
    setTextColor(color)
    renderMeme()
}

function onTextInput(text) {
    setLineText(text)
    renderMeme()
}

function onAddLine() {
    addLine()
    clearUserTextInput()
    renderMeme()
}

function drawSelectionFrame(text, x, y) {
    let framePadding = 10
    let measure = gCtx.measureText(text)

    gCtx.strokeStyle = 'white'
    gCtx.strokeRect((x - framePadding) - measure.actualBoundingBoxLeft,
        (y - framePadding) - measure.actualBoundingBoxAscent,
        measure.actualBoundingBoxLeft + measure.actualBoundingBoxRight + (framePadding * 2),
        measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent + (framePadding * 2));
}

function drawText(line, x, y) {
    gCtx.lineWidth = 1
    gCtx.strokeStyle = 'white'
    gCtx.fillStyle = line.color
    gCtx.font = `${line.size}px ${line.font}`
    gCtx.textAlign = `${line.align}`
    gCtx.textBaseline = 'middle'

    gCtx.fillText(line.txt, x, y)
    gCtx.strokeText(line.txt, x, y)
}

function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }
    if (TOUCH_EVS.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    } return pos
}

function onMoveLineYAxis(ev) {
    ev.preventDefault()
    if (ev.key === 'ArrowUp') moveRowYAxis(-1)
    else moveRowYAxis(1)
    renderMeme()
}

function onKeyPressed(ev) {
    ev.preventDefault()
    if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') onMoveLineYAxis(ev)
    else if (isPrintableKey(ev)) {
        addCharToLine(ev.key)
        // removeCharFromLine()
        renderMeme()
    }
    else return
}

function isPrintableKey(ev) {
    const keycode = ev.keyCode
    let valid =
        (keycode > 47 && keycode < 58) || // number keys
        keycode === 32 || keycode === 13 || // spacebar & return key(s)
        keycode === 8 || keycode === 46 || // backspace & delete key(s) 
        (keycode > 64 && keycode < 91) || // letter keys
        (keycode > 95 && keycode < 112) || // numpad keys
        (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
        (keycode > 218 && keycode < 223)   // [\]' (in order)
    return valid
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchend', onUp)
}

function addArrowKeysListener() {
    gElCanvas.addEventListener('keydown', onKeyPressed)
}

function onUploadImg() {
    // Gets the image from the canvas
    clearMemeFrames()
    const imgDataUrl = gElCanvas.toDataURL('image/jpeg')

    function onSuccess(uploadedImgUrl) {
        // Handle some special characters
        const url = encodeURIComponent(uploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${url}`)
    }

    // Send the image to the server
    doUploadImg(imgDataUrl, onSuccess)
}

// Upload the image to a server, get back a URL 
// call the function onSuccess when done
function doUploadImg(imgDataUrl, onSuccess) {
    // Pack the image for delivery
    const formData = new FormData()
    formData.append('img', imgDataUrl)

    // Send a post req with the image to the server
    const XHR = new XMLHttpRequest()
    XHR.onreadystatechange = () => {
        // If the request is not done, we have no business here yet, so return
        if (XHR.readyState !== XMLHttpRequest.DONE) return
        // if the response is not ok, show an error
        if (XHR.status !== 200) return console.error('Error uploading image')
        const { responseText: url } = XHR
        // Same as
        // const url = XHR.responseText

        // If the response is ok, call the onSuccess callback function, 
        // that will create the link to facebook using the url we got
        console.log('Got back live url:', url)
        onSuccess(url)
    }
    XHR.onerror = (req, ev) => {
        console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
    }
    XHR.open('POST', '//ca-upload.com/here/upload.php')
    XHR.send(formData)
}


function onImgInput(ev) { // Patch Solution - how to make it elegant?
    DisplayMemeEditor()

    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    addListiners()
    resizeCanvas()
    loadImageFromInput(ev, renderImg)
    createCustomMeme()
}

// Read the file from the input
// When done send the image to the callback function
function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()
    reader.onload = function (event) {
        let img = new Image()
        img.src = event.target.result
        img.onload = () => onImageReady(img)
    }
    reader.readAsDataURL(ev.target.files[0])
}

function renderImg(img) {
    setImgDataUrl(img.src)
    const meme = getMeme()
    gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width

    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
    meme.lines.forEach((line, idx) => {
        if (!line.pos) line.pos = getInitialLinePos(idx)
        drawText(line, line.pos.x, line.pos.y)
        setLineDimensions(line.txt, idx)
    })
    const selectedLine = meme.lines[meme.selectedLineIdx]
    drawSelectionFrame(selectedLine.txt, selectedLine.pos.x, selectedLine.pos.y)
    // Draw the img on the canvas
    // gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}
