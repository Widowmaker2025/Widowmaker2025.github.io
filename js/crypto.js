const aesDecrypt = (data, key) => {
    if (key.length > 32) key = key.slice(0, 32)
    const cypherKey = CryptoJS.enc.Utf8.parse(key)
    CryptoJS.pad.ZeroPadding.pad(cypherKey, 4)
    const iv = CryptoJS.SHA256(key).toString()
    const cfg = { iv: CryptoJS.enc.Utf8.parse(iv) }
    const decrypted = CryptoJS.AES.decrypt(data, cypherKey, cfg)
    return decrypted.toString(CryptoJS.enc.Utf8)
}
export const decryptContent = (hash) => {
    const pwd = document.getElementById(`pwd-${hash}`).value
    const data = document.getElementById(`data-${hash}`).value
    if (!pwd || !data) return
    loadJs('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js').then(() => {
        let res = undefined
        try {
            const _res = aesDecrypt(data, pwd)
            res = _res
        } catch (_) {
            alertify.error('解密失败')
            document.getElementById(`pwd-${hash}`).value = ''
            return
        }
        if (!res) {
            alertify.error('解密失败')
            document.getElementById(`pwd-${hash}`).value = ''
            return
        }
        alertify.success('解密成功')
        document.getElementById(`secret-content-${hash}`).remove()
        loadJs('https://cdnjs.cloudflare.com/ajax/libs/marked/14.1.3/marked.min.js').then(() => {
            const id = `decrypted-content-${hash}`
            const contianer = document.getElementById(id)
            contianer.innerHTML += marked.parse(res)
            contianer.querySelectorAll("h1, h2, h3, h4, h5").forEach(h => {
                h.id = h.innerText.trim().replace(/ /g, '-')
            })
            contianer.querySelectorAll('pre').forEach(pre => pre.classList.add('z-code'))
            import('./codeblock.js').then(({ initCodeBlock }) => {
                tocbot.destroy()
                initTocAndViewer(id)
                initCodeBlock()
            })
        }).catch(_ => alertify.error('marked error:\n' + _))
    }).catch(_ => alertify.error('CryptoJS error:\n' + _))
}
const loadedJsSet = new Set()
const loadJs = (src) => {
    if (loadedJsSet.has(src)) return Promise.resolve()
    loadedJsSet.add(src)
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load js'))
        document.head.appendChild(script)
    })
}