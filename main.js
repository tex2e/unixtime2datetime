
window.onload = function () {
    // --- Setup Converter ---
    const auditlog_input  = document.querySelector("#auditlog_input");
    const auditlog_output = document.querySelector("#auditlog_output");
    // Show example.
    auditlog_input.innerText = '1560000000';
    unixtime2datetime();
    // Emit event when input changed.
    auditlog_input.addEventListener('change', unixtime2datetime);
    // Emit event when paste to input.
    auditlog_input.onkeydown = interceptKeys;

    // --- Display Timezone ---
    document.querySelector("#timezone").innerText = (new Date()).toTimeString().slice(9);
}

const tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};

function unixtime2datetime() {
    const inputText = auditlog_input.value;
    let convertedText = inputText
        .replaceAll(/[&<>]/g, function (pattern0) {
            return tagsToReplace[pattern0] || pattern0;
        })
        .replaceAll(/(?<![=])\b(\d{10,12}(?:\.\d{3})?)\b/g, function (_, pattern1) {
            // Prepend (?<![=]) to ignore numbers in attribute like pid=1234567890.
            const unixtime = parseFloat(pattern1);
            const dateTime = new Date(unixtime * 1000);
            const result = '<b>' + dateTime.toLocaleDateString() + ' ' + dateTime.toLocaleTimeString() + '</b>';
            return result;
        })
        .replaceAll(/\n/g, '<br>\n');
    auditlog_output.innerHTML = convertedText;
}

function interceptKeys(evt) {
    evt = evt || window.event; // IE support
    const c = evt.keyCode;
    const ctrlDown = evt.ctrlKey || evt.metaKey; // Mac support

    // Check for ctrl+v
    if (ctrlDown && c == 86) {
        setTimeout(function (e) {
            unixtime2datetime()
        }, 100);
    }

    return true
}
