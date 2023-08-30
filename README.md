# Console.js

* Use
```html
<script src="console.js"></script>
<console-component/>
```
* ES6-module
```javascript
import console from 'console.js' //export a function
console() // execute it
```
* how to use the config
```html
<console-component floatTip="true"/>
```
```javascript
import console from 'console.js' //export a function
console(
    document.body,
    {
        floatTip:true
    }
) // execute it
```
* configs

| Syntax             | Description                           | default Value |
|--------------------|---------------------------------------|---------------|
| floatTip (boolean) | use tooltip if the dialog is not open | true          |
