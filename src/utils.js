const parser = document.createElement('div');
export const parseHTMLString = (htmlString) => {
    parser.innerHTML = htmlString
    return parser.children
}
