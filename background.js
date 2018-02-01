browser.runtime.onInstalled.addListener(function() {
    let builtInVocab = {
        'баг': {word: 'баг'},
        'фанат': {word: 'фанат'},
        'сосед': {word: 'сосед'}
    };
    browser.storage.local.set({
        'vocab': JSON.stringify(builtInVocab)
    });
});

browser.runtime.onMessage.addListener(function(msg) {
    if(msg.method == 'getVocab') {
        return browser.storage.local.get('vocab').then(function(result) {
            return JSON.parse(result.vocab);
        });
    }
    return false;
});
