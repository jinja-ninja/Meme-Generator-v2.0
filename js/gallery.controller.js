'use strict'

function onInit() {
    renderImages()
    renderWordsCloud()
}

function renderWordsCloud() {
    const words = getWordsMap()
    const elWordsCloud = getDomElement('.word-cloud-container')
    let strHTML = Object.keys(words).map(word =>
        `<span style="font-size:clamp(0.7em, ${words[word] * 2 + 'px'},2em)" 
        onclick="onWordCloudClick(this.innerText)">${word}</span>` // Why can't i do words.word?
    ).join('')
    elWordsCloud.innerHTML = strHTML
}

function renderImages() {
    const images = getImages()
    const strHTMLs = images.map(image =>
        `<img src="${image.url}" data-id="${image.id}" 
        onclick="onSelectImg(this.getAttribute('data-id'))">`).join('')

    setElHtml('.gallery-container', strHTMLs)
}

function onSelectImg(imgId) {
    createCustomMeme()
    initMemeEditor(imgId)
    document.body.scrollTop = document.documentElement.scrollTop = 0
}

function onSelectSavedMeme(id) {
    initMemeEditor(id)
    setMemeToSelectedFromSaved(id)
    setImgDataUrl('')
    renderMeme()
    document.body.scrollTop = document.documentElement.scrollTop = 0
}

function onClickFlexible() {
    const totalImages = getImages().length
    initMemeEditor(getRandomInt(1, totalImages))
}

function onFilterClick(key) {
    setFilterTheme(key) // Ask how to do it smarter
    renderImages()
}

function onWordCloudClick(key) {
    getDomElement('.search-bar').value = key
    onSearchMeme(key)
}

function onSetLang() {
    document.body.classList.toggle('rtl')
    setLang()
    if (getCurrentLang()) getDomElement('.change-lang').innerText = 'EN'
    else getDomElement('.change-lang').innerText = 'עב'
}

function onSearchMeme(key) {
    setFilterSearch(key)
    updateKeywordsCountMap(key)
    renderWordsCloud()
    renderImages()
}

function onInitSavedMemes() {
    removeClass('.saved-memes-container', 'hide')
    addClass('.saved-memes-container', 'grid')

    removeClass('.gallery-container', 'grid')
    removeClass('.meme-editor-container', 'grid')

    addClass('.gallery-container', 'hide')
    addClass('.meme-editor-container', 'hide')

    // getDomElement('.gallery-container').style.display = 'none'
    // getDomElement('.meme-editor-container').style.display = 'none'
    renderSavedMemes()
}

function renderSavedMemes() {
    const memes = getSavedMemes()
    let strHTMLs
    if (!memes) strHTMLs = 'No Saved Memes'
    else strHTMLs = memes.map((meme, idx) =>
        `<img src="${meme.dataUrl}" data-id="${idx}" 
        onclick="onSelectSavedMeme(${idx})">`).join('')

    setElHtml('.saved-memes-container', strHTMLs)
}