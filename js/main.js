topbar.config({
    barColors: {
        '0': 'rgba(27, 192, 128, 0.75)',
        '1.0': 'rgba(27, 192, 128, 1)'
    }
})
const complete = () => {
    if (!window.initTocAndViewer || !window.toggleSummary) {
        import('./article.js').then(({ initTocAndViewer, toggleAISummary }) => {
            window.initTocAndViewer = initTocAndViewer
            window.toggleSummary = toggleAISummary
            initTocAndViewer()
        })
    }
    if (!window.decryptContent) {
        import('./crypto.js').then(({ decryptContent }) => {
            window.decryptContent = decryptContent
        })
    }
    if (!window.initCodeBlock) {
        import('./codeblock.js').then(({ initCodeBlock }) => {
            if (!window.initCodeBlock) window.initCodeBlock = initCodeBlock
            initCodeBlock()
        })
    }
    if (!window.MetingJSElementHooked) {
        import('./player.js').then(({ MetingJSElementHooked }) => {
            if (window.customElements && !window.customElements.get('meting-js-hooked')) {
                window.MetingJSElementHooked = MetingJSElementHooked
                window.customElements.define('meting-js-hooked', MetingJSElementHooked)
            }
        })
    }
    window.initTocAndViewer && window.initTocAndViewer()
    window.initCodeBlock && window.initCodeBlock()
    topbar.hide()
}
const send = () => {
    tocbot.destroy()
    topbar.show()
}
document.addEventListener('DOMContentLoaded', complete)
document.addEventListener('pjax:complete', complete)
document.addEventListener('pjax:send', send)