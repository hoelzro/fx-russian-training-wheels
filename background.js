browser.runtime.onMessage.addListener(function(msg) {
    if(msg.method == 'getVocab') {
        return browser.storage.local.get('vocab').then(function(result) {
            return JSON.parse(result.vocab);
        });
    }
    return false;
});
