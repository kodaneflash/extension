function a() {
      return false; // This will disable the check, so the extension always works
}
async function s(e) {
    const [{
        result: t
    }] = await chrome.scripting.executeScript({
        target: {
            tabId: e
        },
        func: a
    });
    return t
}
async function o(e) {
    try {
        return await chrome.tabs.sendMessage(e, {
            currentState: !0
        })
    } catch {
        return
    }
}
chrome.tabs.onActivated.addListener(async function(e) {
    try {
        const {
            tabId: t
        } = e;
        if (!t) return chrome.action.setIcon({
            path: i
        });
        if (await s(t)) return chrome.action.setIcon({
            path: c
        });
        chrome.action.setIcon({
            path: await o(t) ? n : i
        })
    } catch {
        chrome.action.setIcon({
            path: c
        })
    }
});
chrome.webNavigation.onCompleted.addListener(async function(e) {
    if (await s(e.tabId)) return chrome.action.setIcon({
        path: c
    });
    chrome.action.setIcon({
        path: await o(e.tabId) ? n : i
    })
});
chrome.action.onClicked.addListener(async function(e) {
    if (!e.id) return;
    if (await s(e.id)) {
        chrome.action.setIcon({
            path: c
        });
        return
    }
    const t = await o(e.id);
    if (t === void 0) {
        await chrome.scripting.insertCSS({
            files: ["styles.css"],
            target: {
                tabId: e.id
            }
        }), await chrome.scripting.executeScript({
            target: {
                tabId: e.id
            },
            files: ["build/main.js"]
        }), chrome.action.setIcon({
            path: n
        });
        return
    }
    t || await chrome.scripting.insertCSS({
        files: ["styles.css"],
        target: {
            tabId: e.id
        }
    }), await chrome.tabs.sendMessage(e.id, {
        toggle: !0
    }), t && await chrome.scripting.removeCSS({
        files: ["styles.css"],
        target: {
            tabId: e.id
        }
    }), chrome.action.setIcon({
        path: t ? i : n
    })
});
chrome.runtime.onMessage.addListener(async (e, {
    tab: t
}) => {
    e.close !== !0 || !(t != null && t.id) || (await chrome.tabs.sendMessage(t.id, {
        toggle: !0
    }), await chrome.scripting.removeCSS({
        files: ["styles.css"],
        target: {
            tabId: t.id
        }
    }), chrome.action.setIcon({
        path: i
    }))
});
const n = {
        16: "../icons/active/icon16.png",
        32: "../icons/active/icon32.png",
        48: "../icons/active/icon48.png",
        128: "../icons/active/icon128.png"
    },
    i = {
        16: "../icons/default/icon16.png",
        32: "../icons/default/icon32.png",
        48: "../icons/default/icon48.png",
        128: "../icons/default/icon128.png"
    },
    c = {
        16: "../icons/disabled/icon16.png",
        32: "../icons/disabled/icon32.png",
        48: "../icons/disabled/icon48.png",
        128: "../icons/disabled/icon128.png"
    };
