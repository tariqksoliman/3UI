# 3UI

## [Live Demo!](https://tariqksoliman.github.io/3UI/) Click and Drag Around

The plan is to have new HTML tags that define 3D attributes of their contents. Someone would then be able to make a 3D webpage soley through HTML and CSS.

It uses THREE.js' CSS3DRenderer to convert the page into 3D.  

Barely started enough to even add instructions.

## Possible Usage

```html
<x3UI-page cam='scroll free' focus>
    <x3UI-div pos='0,0,0' rot='0,0,0' rotp='0,0,0'>
        Hello World!
    </x3UI-div>
</x3UI-page>
```
* **x3UI-div:** a 3D div.
    * **pos:** x,y,z coordinates for the top center of the div relative to its parent x3UI element.
    * **rot:** x,y,z degrees to rotate the div relative to its center.
    * **rotp:** x,y,z degrees to rotate the div relative to its parent's center (if it doesn't have a parent, it rotates about the world origin).  
    * **focus:** the camera will try to focus the first x3UI-div with the focus attribute. Focusing means that the camera will move to the div and fit the div to the screen such that that div's width fills the client's width and the top of the div matches the top of the client.

#

```npm run dev```