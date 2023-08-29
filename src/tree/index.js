const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)]
const parser = document.createElement('div');
const parseHTMLString = (htmlString) => {
    parser.innerHTML = htmlString
    return parser.children
}
const getObjectFoldValue=(data)=>{
    const keys = Object.keys(data)
    const isObject=data.constructor===Object
    if (keys.length > 2) {
        return `${isObject?'{':'['} ${keys[0]}:${data[keys[0]]},${keys[1]}:${data[keys[1]]},... ${isObject?'}':']'}`
    } else {
        return `${isObject?'{':'['} ${keys.map(key => `${key}:${data[key]}`)} ${isObject?'}':']'}`
    }
}
export class Tree {
    treeElement = document.createElement('div');
    colors = ['#FFFFCC', '#CCFFFF', '#FFCCCC', '#99CCCC', '#996699', '#FFFF66']

    constructor(parent, data) {
        this.data = data
        this.parent = parent
        this.treeElement.classList.add('consoleTree')
        this.createTreeItem()
        this.parent.append(this.treeElement)
    }

    createTreeItem(parent = this.treeElement, data = this.data) {
        const color = getRandomElement(this.colors)
        const isObject=data.constructor===Object
        parent.append(...parseHTMLString(`<div style="color:${color};">${isObject?'{':'['}</div>`), ...Object.keys(data)
            .map(key => {
                const treeItemEle = parseHTMLString(`
                            <div class="consoleTree-item">
                                <div class="consoleTree-item-key">${key} :</div>
                                <div class="consoleTree-item-value"></div>
                            </div>
                    `)[0]
                const valueEle = treeItemEle.querySelector('.consoleTree-item-value')
                const value = data[key]
                if (typeof value === 'object') {
                    valueEle.classList.add('fold')
                    valueEle.innerHTML=`
                        <div class="consoleTree-item-value-fold">${getObjectFoldValue(value)}</div>
                        <div class="consoleTree-item-value-content"></div>
                    `

                    const content=valueEle.querySelector('.consoleTree-item-value-content')
                    treeItemEle.addEventListener('click', (e) => {
                        if (valueEle.classList.contains('fold')){
                            valueEle.className=valueEle.className.replaceAll('fold','unfold')
                            if (content.innerHTML===''){
                                this.createTreeItem(content,value)
                            }
                        }else if (valueEle.classList.contains('unfold')){
                            valueEle.className=valueEle.className.replaceAll('unfold','fold')
                        }
                        e.stopPropagation()
                        e.stopImmediatePropagation()
                    })
                } else {
                    valueEle.innerHTML = value.toString()
                }
                valueEle.classList.add(`consoleTree-item-value-content-${typeof value}`)
                return treeItemEle
            }), ...parseHTMLString(`<div style="color:${color};">${isObject?'}':']'}</div>`))
    }
}
