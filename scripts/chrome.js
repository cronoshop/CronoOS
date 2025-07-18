// Chrome App JavaScript - CronoOS 3.2

document.addEventListener('DOMContentLoaded', function() {
    const addressInput = document.getElementById('addressInput');
    const webContent = document.getElementById('webContent');
    const backBtn = document.getElementById('backBtn');
    const forwardBtn = document.getElementById('forwardBtn');

    let history = [];
    let historyIndex = -1;

    addressInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            let url = addressInput.value.trim();
            if (!url.startsWith('http')) {
                url = 'https://www.' + url;
            }
            loadUrl(url);
        }
    });

    backBtn.addEventListener('click', goBack);
    forwardBtn.addEventListener('click', goForward);


    function loadUrl(url) {
        webContent.innerHTML = `<iframe class="iframe-content" src="${url}" sandbox="allow-scripts allow-same-origin"></iframe>`;

        if (historyIndex < history.length - 1) {
            history = history.slice(0, historyIndex + 1);
        }

        history.push(url);
        historyIndex++;
        updateNavButtons();
    }

    function goBack() {
        if (historyIndex > 0) {
            historyIndex--;
            const url = history[historyIndex];
            addressInput.value = url;
            webContent.innerHTML = `<iframe class="iframe-content" src="${url}" sandbox="allow-scripts allow-same-origin"></iframe>`;
            updateNavButtons();
        }
    }

    function goForward() {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            const url = history[historyIndex];
            addressInput.value = url;
            webContent.innerHTML = `<iframe class="iframe-content" src="${url}" sandbox="allow-scripts allow-same-origin"></iframe>`;
            updateNavButtons();
        }
    }

    function updateNavButtons() {
        backBtn.disabled = historyIndex <= 0;
        forwardBtn.disabled = historyIndex >= history.length - 1;
    }

});
