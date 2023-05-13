var edited = Array();
var condition = Array();

const elementsWithoutColorEffect = [
    'IMG',
    'video',
    'audio',
    'canvas',
    'svg',
    'progress',
    'meter',
    'br',
    'hr'
];


function checkcolor(element, checkstr) {
    let arr = ['color', 'background-color', 'fill', 'stroke', 'stop-color', 'flood-color',
        'lighting-color', 'background', 'background-image',];
    let arr1 = ['color', 'backgroundColor', 'fill', 'stroke', 'stopColor', 'floodColor',
        'lightingColor', 'background', 'backgroundImage',];
if (elementsWithoutColorEffect.includes( element.tagName )){
    console.log(element.tagName);
    console.log("no color effect");
}
    let style = getComputedStyle(element);
    let falg = true;

    for (let i = 0; i < arr.length; i++) {

        let color = style.getPropertyValue(arr[i]);
        const pattern = /rgb.?\(.*?\)/g;
        // const pattern1 = /rgba\(.*?\)/g;
        const matches = color.match(pattern);
        // const matches1 = color.match(pattern1);
        // if (matches1 != null){
        // matches.concat(matches1);
        // }
        if (matches == null) {
            continue;
        }

        for (let j = 0; j < matches.length; j++) {
            color = matches[j].match(/\d+/g);
            red = parseInt(color[0]);
            green = parseInt(color[1]);
            blue = parseInt(color[2]);
            // console.log(red, green, blue);
            if (red != 0 && green == 0 && blue == 0) {
                const regex = /repeating-linear-gradient\(\d+deg, transparent, transparent 10px, rgb\(0, 0, 0\) 12px, rgb\(0, 0, 0\) 2px\)/g;
                const match = element.style.backgroundImage.replace(regex, '');
                element.style.backgroundImage = match + ' repeating-linear-gradient(0deg,transparent,transparent 10px,#000 12px,#000 2px)';

                // console.log("fuck");
                edited.push(element);
                falg = false;
            }
            else if ((red > (blue / 3)) && green == 0 && blue != 0) {
                const regex = /repeating-linear-gradient\(\d+deg, transparent, transparent 10px, rgb\(0, 0, 0\) 12px, rgb\(0, 0, 0\) 2px\)/g;
                const match = element.style.backgroundImage.replace(regex, '');
                element.style.backgroundImage = match + ' repeating-linear-gradient(45deg,transparent,transparent 10px,#000 12px,#000 2px)';

                edited.push(element);
                // console.log("fuck");

                falg = false;

            }
            else if (red == 0 && green != 0 && blue == 0) {
                const regex = /repeating-linear-gradient\(\d+deg, transparent, transparent 10px, rgb\(0, 0, 0\) 12px, rgb\(0, 0, 0\) 2px\)/g;
                const match = element.style.backgroundImage.replace(regex, '');
                element.style.backgroundImage = match + ' repeating-linear-gradient(90deg,transparent,transparent 10px,#000 12px,#000 2px)';

                edited.push(element);
                // console.log("fuck");

                falg = false;


            }
            else if ((green > (blue / 3)) && red == 0 && blue != 0) {
                const regex = /repeating-linear-gradient\(\d+deg, transparent, transparent 10px, rgb\(0, 0, 0\) 12px, rgb\(0, 0, 0\) 2px\)/g;
                const match = element.style.backgroundImage.replace(regex, '');
                element.style.backgroundImage = match + ' repeating-linear-gradient(135deg,transparent,transparent 10px,#000 12px,#000 2px)';

                edited.push(element);
                // console.log("fuck");

                falg = false;


            }
            else if (Math.abs(red - green) > 20 && blue == 0) {
                const regex = /repeating-linear-gradient\(\d+deg, transparent, transparent 10px, rgb\(0, 0, 0\) 12px, rgb\(0, 0, 0\) 2px\)/g;
                const match = element.style.backgroundImage.replace(regex, '');

                element.style.backgroundImage = match + ' repeating-linear-gradient(30deg,transparent,transparent 10px,#000 12px,#000 2px)';
                edited.push(element);
                // console.log("fuck");

                falg = false;

            }
            else if (Math.abs(red - green) > 20 && red != 0) {
                const regex = /repeating-linear-gradient\(\d+deg, transparent, transparent 10px, rgb\(0, 0, 0\) 12px, rgb\(0, 0, 0\) 2px\)/g;
                const match = element.style.backgroundImage.replace(regex, '');
                element.style.backgroundImage = match + ' repeating-linear-gradient(110deg,transparent,transparent 10px,#000 12px,#000 2px)';

                edited.push(element);
                // console.log("fuck");
                falg = false

            }
            else {
                console.log('no fuck')


            }

        }

    }
    console.log(falg);
    if (element.style.backgroundImage && falg === true) {
        console.log(element.style.backgroundImage);
        let background = element.style.backgroundImage;
        if (background.includes('repeating-linear-gradient') && background.includes('transparent, transparent 10px, rgb(0, 0, 0) 12px, rgb(0, 0, 0) 2px')) {
            const regex = /repeating-linear-gradient\(\d+deg, transparent, transparent 10px, rgb\(0, 0, 0\) 12px, rgb\(0, 0, 0\) 2px\)/g;
            console.log("removed");
            const match = background.replace(regex, '');
            // if (element.tagName == 'BODY' || element.tagName == 'HTML') {
            //     console.log("here  ", getComputedStyle(element));
            //     console.log(element.tagName);
            //     console.log(checkstr);
            //     for (let k in arr) {
            //         console.log(element.style[k]);
            //     }
            // }
            element.style.backgroundImage = match;

        }
    }
}
// var injectScript = function (element) {
//     var node = document.createElement('script');
//     var jscode = "(" + "let html = '<div style=\'width: 100%; height: 100%; background-image: repeating-linear-gradient(45deg,transparent,transparent 10px,#000 12px,#000 2px);\'>'" + element.innerHTML + "'</div>';elements[i].innerHTML = html; + ')();';";
//     node.innerHTML = jscode;
//     document.body.appendChild(node);
// };


(() => {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {


        Arr = document.querySelectorAll("*");
        var elements = Array.from(Arr);
        for (let j = 0; j < elements.length; j++) {
            if (elements[j].tagName == "BODY") {
                var count = j;
                break;
            }
        }

        console.log(document.getElementsByTagName("html"));

        for (let i = count; i < elements.length; i++) {

            checkcolor(elements[i], 'first');
        }
        let isCheckingColor = false;


        const observer = new MutationObserver((mutations) => {
            console.log(mutations)
            observer.disconnect();
            // Check for changes in the DOM here
            // console.log(mutations.length);
            if (isCheckingColor) {

                for (let i = 0; i < mutations.length; i++) {
                    if (mutations[i] instanceof Element) {
                        checkcolor(mutations[i].target, 'mutation');
                    }


                    // console.log(mutations);
                    // console.log(edited);
                    // edited = Array();
                    console.log("------------------------------------------------------------------------")


                }

            }
            isCheckingColor = true;



            console.log("bahir");


            // mutations.forEach((mutation) => {
            //     if (mutation.type === 'attributes') {
            //         // console.log('The ' + mutation.attributeName + ' attribute was modified.');
            //         checkcolor(mutation.target);
            //     }
            // else if (mutation.type === 'childList') {
            //     console.log('A child node has been added or removed.');
            // }
            // });

            // for (let i = count; i < elements.length; i++) {
            //     checkcolor(elements[i]);
            // }

            observer.observe(document.body, {
                subtree: true,
                childList: true,
                attributes: true,
                characterData: true,
                attributeFilter: ['style', 'class']
                // repeat: 3000 // Check for changes every second
            });

        });


        observer.observe(document.body, {
            subtree: true,
            childList: true,
            attributes: true,
            characterData: true,
            attributeFilter: ['style', 'class']
            // repeat: 3000 // Check for changes every second
        });


        // {// // Select the node that will be observed for mutations
        // // const targetNode = document.body;

        // // // Options for the observer (which mutations to observe)
        // // const config = { childList: true, subtree: true };

        // // // Callback function to execute when mutations are observed
        // // const callback = function (mutationsList, observer) {
        // //     for (let mutation of mutationsList) {
        // //         if (mutation.type === 'childList') {
        // //             console.log('A child node has been added or removed.');
        // //         }
        // //         else{
        // //             console.log('The ' + mutation.attributeName + ' attribute was modified.');
        // //             checkcolor(mutation.target);
        // //         }
        // //     }
        // // };

        // // // Create a new observer instance
        // // const observer = new MutationObserver(callback);

        // // // Start observing the target node for configured mutations
        // // observer.observe(targetNode, config);
        // }
        if (request.message === "hello") {
            console.log("hello");
            sendResponse({ message: "hi" });
        }
        return true;
    });
})();
console.log("hello from content.js");

body = document.querySelector("body");
body.style.border = "5px solid blue";
