import './style.css'
import {Tree} from "./tree";
import {parseHTMLString} from "./utils";

const constructorMap = {
    [Function]: (element) => {
        element.innerHTML = 'ƒ Number() { [native code] }'
    },
    [Object]: (element, data) => {
        new Tree(element, data)
    },
    [Array]: (element, data) => {
        new Tree(element, data)
    },
    other: (element, data) => {
        element.innerHTML = data
    }
}

class ConsoleLogComponent extends HTMLElement {
    constructor(opt) {
        super();
        this.classList.add('consoleLog')
        this.opt = opt
    }

    connectedCallback() {
        const invoke = parseHTMLString('<span class="invoke">...</span>')[0]
        this.append(
            ...parseHTMLString('<span class="point">·</span>'),
            ...this.data.map(item => {
                const span = document.createElement('div');
                (constructorMap[item.constructor] ?? constructorMap.other)(span, item);
                span.classList.add(`consoleLog-${typeof item}`)
                return span
            }),
            invoke
        )
        this.opt?.type && this.classList.add(this.opt?.type)
        invoke.addEventListener('click', () => {
            const str = `<div style="position: fixed;left: 50%;top:50%;transform: translate(-50%,-50%);width: 80vw;max-height: 70vw;background-color: #666666;padding: 3vh 5vw;">
                <div>invoke</div>
                ${this.invoke.map(item => {
                return `<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${item}</div>`
            })}
                </div>`
            const dom = parseHTMLString(str)[0]
            dom.addEventListener('click', (e) => {
                dom.remove()
                e.stopPropagation()
            })
            this.append(dom)
        })
    }
}

class ConsoleComponent extends HTMLElement {
    template = document.createElement('template')
    config={
        floatTip:true
    }
    constructor() {
        super();

        // 创建影子DOM
        this.template.innerHTML = `
            <div id="consoleDisplayBoardMask" style="left: 100px;top: 300px;">
                <div id="consoleDisplayBoardHeader">
                    <div class="button" data-action="close">关闭</div>
                    <div class="button" data-action="clear">清除</div>
                </div>
                <div id="consoleDisplayBoard"></div>
                <div id="consoleDisplayBoardIcon">LOG</div>
            </div>
            `
        document.body.append(this.float)
    }
    float=parseHTMLString('<div id="consoleFloat" class="hidden"></div>')[0]
    floatTimer
    createLog(args, opt) {
        const log = new ConsoleLogComponent(opt)
        log.data = args
        log.invoke = (new Error()).stack.split("\n").slice(3)
        document.querySelector('#consoleDisplayBoard').append(log)
        if (this.config.floatTip){
            this.float.innerHTML=args.join(' ')
            this.float.classList.remove('hidden')
            clearTimeout(this.floatTimer)
            this.floatTimer=setTimeout(()=>{
                this.float.classList.add('hidden')
            },1000)
        }
    }

    connectedCallback() {
        this.appendChild(this.template.content.cloneNode(true))
        this.config.floatTip=JSON.parse(this.getAttribute('floatTip'))
        const maskEle = document.querySelector('#consoleDisplayBoardMask')
        maskEle.classList.add('hidden')
        document.querySelector('#consoleDisplayBoardHeader').addEventListener('click', (e) => {
            const action = e.target.getAttribute('data-action')
            if (action === 'close') {
                maskEle.classList.add('hidden')
            } else if (action === 'clear') {
                document.querySelector('#consoleDisplayBoard').innerHTML = ''
            }
        })
        document.querySelector('#consoleDisplayBoardIcon').addEventListener('click', () => {
            maskEle.classList.remove('hidden')
        })
        document.querySelector('#consoleDisplayBoardIcon').addEventListener('touchstart', (e) => {
            maskEle.style.transition = 'all 0s'
            const move = (event) => {
                maskEle.style.left = `${event.changedTouches[0].pageX}px`
                maskEle.style.top = `${event.changedTouches[0].pageY}px`
            }
            const end = () => {
                document.addEventListener('touchmove', move)
                document.addEventListener('touchend', end)
                maskEle.style.transition = 'all 0.4s'
            }
            document.addEventListener('touchmove', move)
            document.addEventListener('touchend', end)
        })
        const consoleLog = window.console.log
        window.console.trace =
            window.console.table =
                window.console.dir =
        window.console.log = (...args) => {
            consoleLog.apply(this, args)
            this.createLog(args)
        }
        const consoleClear = window.console.clear
        window.console.clear=()=>{
            consoleClear.apply(this)
            document.querySelector('#consoleDisplayBoard').innerHTML = ''
        }
        const consoleError = window.console.error
        window.console.error = (...args) => {
            consoleError.apply(this, args)
            this.createLog(args, {
                type: 'error'
            })
        }
        window.addEventListener('error', (e) => {
            console.log(e)
            this.createLog([e.message], {
                type: 'error'
            })
        })
    }
}

window.customElements.define('console-component', ConsoleComponent)
window.customElements.define('console-log-component', ConsoleLogComponent)

export default (parent = document.body, config = {floatTip:true}) => {
    if (!document.querySelector('console-component')) {
        const dom=new ConsoleComponent()
        dom.setAttribute('floatTip',JSON.stringify(config.floatTip))
        document.body.append(dom)
    }
}
