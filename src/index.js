import './style.css'
import {Tree} from "./tree";

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
    constructor() {
        super();
        this.classList.add('consoleLog')
    }

    connectedCallback() {
        this.append(...this.data.map(item => {
            const span = document.createElement('div');
            (constructorMap[item.constructor] ?? constructorMap.other)(span, item);
            span.classList.add(`consoleLog-${typeof item}`)
            return span
        }))
    }
}

class ConsoleComponent extends HTMLElement {
    template = document.createElement('template')
    constructor() {
        super();
        // 创建影子DOM
        this.template.innerHTML = `
            <div id="consoleDisplayBoardMask">
                <div id="consoleDisplayBoardHeader">
                    <div class="button" data-action="close">关闭</div>
                    <div class="button" data-action="clear">清除</div>
                </div>
                <div id="consoleDisplayBoard"></div>
                <div id="consoleDisplayBoardIcon">LOG</div>
            </div>
            `
    }

    connectedCallback() {
        this.appendChild(this.template.content.cloneNode(true))
        const maskEle=document.querySelector('#consoleDisplayBoardMask')
        document.querySelector('#consoleDisplayBoardHeader').addEventListener('click',(e)=>{
            const action=e.target.getAttribute('data-action')
            if (action==='close'){
                maskEle.classList.add('hidden')
            }else if (action==='clear'){
                document.querySelector('#consoleDisplayBoard').innerHTML=''
            }
        })
        document.querySelector('#consoleDisplayBoardIcon').addEventListener('click',()=>{
            maskEle.classList.remove('hidden')
        })
        document.querySelector('#consoleDisplayBoardIcon').addEventListener('touchstart',(e)=>{
            maskEle.style.transition='all 0s'
            const move=(event)=>{
                maskEle.style.left=`${event.changedTouches[0].pageX}px`
                maskEle.style.top=`${event.changedTouches[0].pageY}px`
            }
            const end=()=>{
                document.addEventListener('touchmove',move)
                document.addEventListener('touchend',end)
                maskEle.style.transition='all 0.4s'
            }
            document.addEventListener('touchmove',move)
            document.addEventListener('touchend',end)
        })
        const consoleFns = window.console.log
        window.console.log = function (...arg) {
            consoleFns.apply(this, arg)
            const log = new ConsoleLogComponent()
            log.data = arg
            // log.setAttribute('data-inner',JSON.stringify(arg))
            document.querySelector('#consoleDisplayBoard').append(log)
        }
    }
}

window.customElements.define('console-component', ConsoleComponent)
window.customElements.define('console-log-component', ConsoleLogComponent)

export default  (parent = document.body, {fixed} = {fixed: true}) => {
    if (!document.querySelector('console-component')) {
        document.body.append(new ConsoleComponent())
    }
}
