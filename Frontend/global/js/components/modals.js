function errorModal (idModal, title, description, textButton) {
    return `
    <div id="${idModal}" class="pop-up-dialog window-fade hidden">
      <div class="pop-up-content">
        <div class="pop-up-header">
          <h3>${title}</h3>
        </div>
        <div class="pop-up-body">
          <p style="margin: 0;">${description}</p>
        </div>
        <div class="pop-up-footer">
          <button id="btn-close-pop-up" class="btn-primary font" type="button">${textButton}</button>
        </div>
      </div>
    </div>
    `
}

export { errorModal }
