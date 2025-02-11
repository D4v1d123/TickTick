function spinner (idSpinner) {
    return `
    <div id="${idSpinner}" class="loading-window window-fade hidden">
        <div class="spinner"></div>
    </div>
    `
}

export { spinner }