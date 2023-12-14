const publish = document.querySelector("#publish");
const config = document.querySelector("#config");
const url = document.querySelector("#url");
const apiKey = document.querySelector("#apiKey");
const template = document.querySelector("#template");

async function restoreOptions() {
    const options = await browser.storage.sync.get(["publish", "url", "apiKey", "template"]);

    if (options.publish) {
        publish.checked = true;
        config.style.display = 'block';
        url.value = options.url || '';
        apiKey.value = options.apiKey || '';
        template.value = options.template || '';
    } else {
        publish.checked = false;
        config.style.display = 'none';
        url.value = '';
        apiKey.value = '';
        template.value = '';
    }
}

async function togglePublish(event) {
    if (event.target.checked) {
        config.style.display = 'block';
        await browser.storage.sync.set({ "publish": true });

        const options = await browser.storage.sync.get(["url", "apiKey", "template"]);

        url.value = options.url || '';
        apiKey.value = options.apiKey || '';
        template.value = options.template || '';
    } else {
        config.style.display = 'none';
        await browser.storage.sync.set({ "publish": false });
        await browser.storage.sync.remove("url");
        await browser.storage.sync.remove("apiKey");
        await browser.storage.sync.remove("template");
    }
}

async function urlChanged(event) {
    await browser.storage.sync.set({ "url": event.target.value });
}

async function apiKeyChanged(event) {
    await browser.storage.sync.set({ "apiKey": event.target.value });
}

async function templateChanged(event) {
    await browser.storage.sync.set({ "template": event.target.value });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
publish.addEventListener('change', togglePublish);
url.addEventListener('input', urlChanged);
apiKey.addEventListener('input', apiKeyChanged);
template.addEventListener('input', templateChanged);
