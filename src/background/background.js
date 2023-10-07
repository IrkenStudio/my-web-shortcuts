// import {bro} from "../scripts/main";

import setter from '../scripts/setter?script'


// let mwsCSS = `

// .MWSbordered{
//     outline: 2px solid red !important;
// }

// .clicked{
//     position:relative
// }

// .clicked::after {
//   content: attr(data-index); /* Display the data-index attribute as content */
//   position: absolute;
//   bottom: 5px;
//   right: 5px;
//   width: 15px;
//   height: 15px;
//   background-color: yellow;
//   color: black;
//   border: 2px solid black;
//   font-size: 12px;

//   display:flex;
//   justify-content:center;
//   align-items:center;
//   text-align: center;
// }


// .clicked::before {
//   content: attr(data-keyboardShortcut); /* Display the data-index attribute as content */
//   position: absolute;
//   bottom: 5px;
//   right: 5px;
//   width: 15px;
//   height: 15px;
//   background-color: grey;
//   color: black;
//   border: 2px solid black;
//   font-size: 12px;
//   text-align: center;
// }
// :root{
//     cursor:pointer !important;
// }

// `


let mwsCSS = ``
// console.log(scriptPath);


function turnOffSelector(tab) {
    chrome.scripting.removeCSS({
        target: { tabId: tab.id },
        css: mwsCSS,
    })
    chrome.tabs.sendMessage(tab.id, { action: "turnOffSelector" });

}

chrome.action.onClicked.addListener( async (tab) => {

    // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? undefined : 'ON';

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
        tabId: tab.id,
        text: nextState
    });

    if (nextState === 'ON') {
        // Insert the CSS file when the user turns the extension on
        await
            chrome.scripting.insertCSS({
                target: { tabId: tab.id },
                css: mwsCSS,
            }).then(() => {
                // chrome.scripting.executeScript({
                //     target: { tabId: tab.id },
                //     func: bro
                // });
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: [setter]
                });

                chrome.tabs.sendMessage(tab.id, { message: "start" });

            }
            )
    } else if (nextState === undefined) {
        // Remove the CSS file when the user turns the extension off
        turnOffSelector(tab)

    }
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.msg === "NewShortcuts"){
            (async () => {
                const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
                const response = await chrome.tabs.sendMessage(tab.id, { msg: "NewShortcuts" });
                // do something with response here, not outside the function
                // console.log(response);
            })();
        }
        if (request.action == "turnOffSelector") {
            turnOffSelector()

            
        }
            // sendResponse({ farewell: "goodbye" });

    }
);
chrome.runtime.onInstalled.addListener(details => {
    console.log("BRooooo Hiiii you just installed meee");
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.runtime.setUninstallURL('https://www.heyprakhar.xyz');
    }
});