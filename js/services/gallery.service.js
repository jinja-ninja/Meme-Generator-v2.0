'use strict'

let gCurrLang = true // true: EN, false: HE
let gImgs
let gImgId = 1
let gFilterBy = { theme: '', search: '' }

const gTrans = {
    logo: {
        en: 'Meme Generator',
        he: 'מחולל הממים'
    },
    search: {
        en: 'Search Meme',
        he: 'חפש מם'
    },
    btnFlex: {
        en: `I'm flexible`,
        he: 'גמיש אנוכי'
    },
    'select-theme-all': {
        en: `Select Theme`,
        he: 'בחר נושא'
    },
    'select-theme-kids': {
        en: `Kids`,
        he: 'ילדים'
    },
    'select-theme-beach': {
        en: `Beach`,
        he: 'חוף'
    },
    'select-theme-dogs': {
        en: `Dogs`,
        he: 'כלבים'
    },
    'select-theme-evil': {
        en: `Evil`,
        he: 'רשע'
    },
    'saved-memes': {
        en: `SAVED`,
        he: 'שמורים'
    }
}

_createImages()
function _createImages() {
    const images = [
        addImage(['arms', 'spread', 'woman']),
        addImage(['donald', 'trump', 'politics']),
        addImage(['dogs', 'kiss', 'love']),
        addImage(['kid', 'dogs', 'sleep']),
        addImage(['kid', 'win', 'beach', 'sea']),
        addImage(['cat', 'keyboard', 'sleep']),
        addImage(['tell', 'me', 'more', 'charly', 'choclate']),
        addImage(['evil', 'toddler', 'laughing', 'beach', 'sea']),
        addImage(['what', 'would', 'you', 'do', 'haim']),
        addImage(['but', 'why', 'you']),
        addImage(['aliens', 'history', 'channel']),
        addImage(['dr', 'evil', 'vilan']),
        addImage(['kids', 'dancing', 'africa']),
    ]
    gImgs = images
}

function addImage(keywords) {
    const img = {
        url: `images/${gImgId}.jpg`,
        id: gImgId++,
        keywords
    }
    return img
}

function getImages() { // Made a potato salad here
    let filteredImages = filterImages(gFilterBy.theme)
    let imagesToShow = searchMeme(filteredImages, gFilterBy.search)
    return imagesToShow
}

function getWordsMap() {
    return gKeywordSearchCountMap
}

function getCurrentLang() {
    return gCurrLang
}

function setFilterTheme(filterBy = '') {
    gFilterBy.theme = filterBy
}

function setFilterSearch(search = '') {
    gFilterBy.search = search
}

function setLang() {
    gCurrLang = !gCurrLang
    doTrans()
}

function getTrans(transKey) {
    // get from gTrans
    const transMap = gTrans[transKey] // {'en':,'es:','he':}
    // if key is unknown return 'UNKNOWN'
    if (!transMap) return 'UNKNOWN'
    let transTxt
    if (gCurrLang) transTxt = transMap['en']
    else transTxt = transMap['he']
    // let transTxt = transMap[gCurrLang]
    // If translation not found - use english
    if (!transTxt) transTxt = transMap.en
    return transTxt
}

function doTrans() {
    const els = document.querySelectorAll('[data-trans]')
    els.forEach(el => {
        const transKey = el.dataset.trans
        const transTxt = getTrans(transKey)
        if (el.placeholder) el.placeholder = transTxt
        else el.innerText = transTxt
    })
}

function clearFilter() {
    gImgId = 1
    _createImages()
}

function searchMeme(images, key) {
    const filteredImages = images.filter(img => img.keywords.find(keyword => keyword.includes(key)))
    return filteredImages
}

function filterImages(filterBy) { // Must Be a Better Way
    const filteredImages = []
    if (filterBy === '') {
        clearFilter()
        return gImgs
    }
    gImgs.filter(img => {
        if (img.keywords.includes(filterBy.toLowerCase())) filteredImages.push(img)
    })
    return filteredImages
}

function getSavedMemes() {
    return loadSavedMemesFromStorage()
}

function loadSavedMemesFromStorage() {
    return loadFromStorage('savedMems')
}