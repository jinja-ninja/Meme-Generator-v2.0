'use strict'

function makeId(length = 6) {
    var id = ''
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        id += possible.charAt(getRandomInt(0, possible.length))
    }

    return id
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

function getDomElement(selector) {
    return document.querySelector(`${selector}`)
}

function handleClassEl(selector, className, isAdd) {
    if (isAdd) document.querySelector(`${selector}`).classList.add(className)
    else document.querySelector(`${selector}`).classList.remove(className)
}

function removeClass(selector, className) {
    document.querySelector(selector).classList.remove(className)
}

function addClass(selector, className) {
    document.querySelector(selector).classList.add(className)
}

function setElText(selector, txt) {
    const el = document.querySelector(`${selector}`)
    el.innerText = txt
}

function setElHtml(selector, html) {
    const el = document.querySelector(selector)
    el.innerHTML = html
}

function navigateToPage(page) {
    window.location = `${page}.html`;
}

function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function createRandomArray(size) {
    var nums = []
    for (var i = 0; i < size; i++) {
        nums.push(i + 1)
    }
    nums = shuffle(nums)
    return nums
}