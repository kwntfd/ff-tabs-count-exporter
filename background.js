async function updateTabsCount(tabId, isRemoved) {
    let length = await getTabsCount(tabId, isRemoved);

    updateBadgeText(length);
    updateMetrics(length);
}

async function getTabsCount(tabId, isRemoved) {
    let tabs = await browser.tabs.query({});
    let length = tabs.length;

    if (isRemoved && tabId && tabs.map((t) => { return t.id; }).includes(tabId)) {
        length--;
    }

    return length;
}

function updateBadgeText(tabsCount) {
    browser.action.setBadgeBackgroundColor({ color: "#387CC0" });
    browser.action.setBadgeTextColor({ color: "#FFFFFF" });
    browser.action.setBadgeText({ text: tabsCount.toString() });
}

async function updateMetrics(tabsCount) {
    const config = await browser.storage.sync.get(["publish", "url", "apiKey", "template"]);

    if ((config.publish) && (config.url) && (config.apiKey) && (config.template)) {
        const body = config.template.replace(/\$?\{tabs\}/, tabsCount);
        const response = await fetch(config.url, {
            method: 'POST',
            body,
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'text/plain',
            },
        });

        console.log(response);
    }
}

browser.tabs.onRemoved.addListener(
    (tabId) => {
        updateTabsCount(tabId, true);
    });

browser.tabs.onCreated.addListener(
    (tabId) => {
        updateTabsCount(tabId, false);
    });

updateTabsCount();
