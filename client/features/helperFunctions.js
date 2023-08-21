function copyTextToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
        console.log('Data copied to clipboard successfully!');
    } catch (err) {
        console.error('Unable to copy data to clipboard', err);
    } finally {
        document.body.removeChild(textarea);
    }
}

function tableToTSV(table) {
    let rows = Array.from(table.querySelectorAll('tr'));
    return rows.map(row => {
        let cells = Array.from(row.querySelectorAll('td, th'));
        return cells.map(cell => {
            // Clone the cell to not modify the original one
            let clonedCell = cell.cloneNode(true);
            // Remove all button elements from the cloned cell
            let buttons = clonedCell.querySelectorAll('button');
            buttons.forEach(button => button.textContent = "");
            return clonedCell.innerText.replace(/"/g, '""');
        }).join('\t');
    }).join('\r\n');  // Use \r\n for the line ending
}


function copyTableAsCSV(tableId) {
    let table = document.querySelector(tableId);
    let csv = tableToTSV(table);
    copyTextToClipboard(csv);
}

export {
    copyTableAsCSV
}