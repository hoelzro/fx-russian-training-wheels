const DEBOUNCE_TIME = 200;
let debounceTimeout;

let stemmer = new Snowball('Russian');

let currentX;
let currentY;

function stem(word) {
    stemmer.setCurrent(word);
    stemmer.stem();
    return stemmer.getCurrent();
}

// XXX implement me
function getKnownWord(stem) {
    if(stem == 'баг') {
        return Promise.resolve({ word: 'баг' });
    } else if(stem == 'фанат') {
        return Promise.resolve({ word: 'фанат' });
    } else if(stem == 'сосед') {
        return Promise.resolve({ word: 'сосед' });
    }
    return Promise.resolve(null);
}

function onSelectionSettled() {
    debounceTimeout = null;
    document.body.removeEventListener('mousemove', trackMouseMoves);
    document.body.removeEventListener('click', trackMouseMoves);

    let selection = window.getSelection().toString();
    if(selection == '') {
        return;
    }
    if(/\s/.test(selection)) {
        return;
    }
    if(!/[а-я]/i.test(selection)) {
        return;
    }
    let stemmed = stem(selection);
    getKnownWord(stemmed).then(function(knownWord) {
        if(knownWord != null) {
            let obj = {
                attributes: {
                    title: 'Ты знаешь это слово - ' + knownWord.word
                },
                getBoundingClientRect: function() {
                    return {
                        top: 5 + currentY,
                        left: 5 + currentX,
                        right: 5 + currentX,
                        bottom: 5 + currentY,
                        width: 1,
                        height: 1
                    };
                },
                clientWidth: 50,
                clientHeight: 50
            };
            tippy(obj);
            obj._tippy.show();
        }
    });
}

function trackMouseMoves(event) {
    currentX = event.x;
    currentY = event.y;
}

document.onselectionchange = function() {
    if(debounceTimeout != null) {
        clearTimeout(debounceTimeout);
    } else {
        document.body.addEventListener('mousemove', trackMouseMoves);
        document.body.addEventListener('click', trackMouseMoves);
    }
    debounceTimeout = setTimeout(onSelectionSettled, DEBOUNCE_TIME);
}
