browser.storage.local.get('vocab').then(function(result) {
    let num_words = document.querySelector('#num_words');

    if('vocab' in result) {
        let vocab = JSON.parse(result.vocab);

        num_words.innerText = Object.keys(vocab).length.toString();
    } else {
        num_words.innerText = '0';
    }
});

browser.storage.sync.get('import_url').then(function(result) {
    if('import_url' in result) {
        let import_url = document.querySelector('#import_url');
        import_url.value = result.import_url;
    }
});

let import_button = document.querySelector('#import_button');
import_button.addEventListener('click', function() {
    let import_url = document.querySelector('#import_url');
    browser.storage.sync.set({'import_url': import_url.value});
    fetch(import_url.value).then(res => res.text()).then(function(text) {
        let lines = text.split("\n");
        let stemmer = new Snowball('Russian');

        let vocab = {};

        // XXX do this in the background?
        for(let word of lines) {
            stemmer.setCurrent(word);
            stemmer.stem();
            let stemmed = stemmer.getCurrent();

            vocab[stemmed] = {
                'word': word
            };
        }
        browser.storage.local.set({'vocab': JSON.stringify(vocab)});

        let num_words = document.querySelector('#num_words');
        num_words.innerText = Object.keys(vocab).length.toString();
    });
});
