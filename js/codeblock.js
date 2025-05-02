const successIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-check-lg" viewBox="0 0 16 16">
    <path d="M13.485 1.85a.5.5 0 0 1 1.065.02.75.75 0 0 1-.02 1.065L5.82 12.78a.75.75 0 0 1-1.106.02L1.476 9.346a.75.75 0 1 1 1.05-1.07l2.74 2.742L12.44 2.92a.75.75 0 0 1 1.045-.07z"/>
</svg>`
const errorIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-x-lg" viewBox="0 0 16 16">
    <path d="M2.293 2.293a1 1 0 0 1 1.414 0L8 6.586l4.293-4.293a1 1 0 0 1 1.414 1.414L9.414 8l4.293 4.293a1 1 0 0 1-1.414 1.414L8 9.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L6.586 8 2.293 3.707a1 1 0 0 1 0-1.414z"/>
</svg>`
const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-clipboard2-pulse-fill" viewBox="0 0 16 16">
    <path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5"/>
    <path d="M4.085 1H3.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1h-.585q.084.236.085.5V2a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 2v-.5q.001-.264.085-.5M9.98 5.356 11.372 10h.128a.5.5 0 0 1 0 1H11a.5.5 0 0 1-.479-.356l-.94-3.135-1.092 5.096a.5.5 0 0 1-.968.039L6.383 8.85l-.936 1.873A.5.5 0 0 1 5 11h-.5a.5.5 0 0 1 0-1h.191l1.362-2.724a.5.5 0 0 1 .926.08l.94 3.135 1.092-5.096a.5.5 0 0 1 .968-.039Z"/>
</svg>`
const changeIcon = (button, isSuccess) => {
    button.innerHTML = isSuccess ? successIcon : errorIcon
    setTimeout(() => {
        button.innerHTML = copyIcon
    }, 1500)
}
const getCodeFromTable = (codeBlock) => {
    return [...codeBlock.querySelectorAll('tr')]
        .map(row => row.querySelector('td:last-child')?.innerText ?? '')
        .join('')
}
const getNonTableCode = (codeBlock) => {
    return codeBlock.textContent.trim()
}

export const initCodeBlock = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const pre = entry.target.parentNode
            const clipboardBtn = pre.querySelector('.clipboard-button')
            const label = pre.querySelector('.code-label')
            if (clipboardBtn) {
                clipboardBtn.style.right = entry.isIntersecting ? '5px' : `-${entry.boundingClientRect.right - pre.clientWidth + 5}px`
            }
            if (label) {
                label.style.right = entry.isIntersecting ? '0px' : `-${entry.boundingClientRect.right - pre.clientWidth}px`
            }
        })
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 1.0
    })

    document.querySelectorAll('pre code').forEach(codeBlock => {
        const pre = codeBlock.parentNode
        pre.style.position = 'relative'

        const copyBtn = document.createElement('div')
        copyBtn.className = 'clipboard-button'
        copyBtn.innerHTML = copyIcon
        copyBtn.setAttribute('aria-label', 'Copy code to clipboard')
        pre.appendChild(copyBtn)

        copyBtn.addEventListener('click', () => {
            const isTable = codeBlock.querySelector('table')
            const codeToCopy = isTable ? getCodeFromTable(codeBlock) : getNonTableCode(codeBlock)
            navigator.clipboard.writeText(codeToCopy).then(() => changeIcon(copyBtn, true)).catch((error) => {
                console.error('Failed to copy text: ', error)
                changeIcon(copyBtn, false)
            })
        })

        const langClass = codeBlock.className.match(/language-(\w+)/)
        const lang = langClass ? langClass[1] : 'default'
        const label = document.createElement('span')
        label.className = `code-label label-${lang}`
        label.textContent = lang.toUpperCase()
        pre.appendChild(label)

        let ticking = false
        pre.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    copyBtn.style.right = `-${pre.scrollLeft}px`
                    label.style.right = `-${pre.scrollLeft}px`
                    ticking = false
                })
                ticking = true
            }
        })
    })
}