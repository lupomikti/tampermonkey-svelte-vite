# Tampermonkey Svelte Template
## What is this template?
This template allows easy creation of UserScripts for [Tampermonkey](https://www.tampermonkey.net/) using [Svelte](https://svelte.dev/).

## Getting Started
Replace `your-project-name` with whatever you would like the name of your project to be.

```bash
npm degit lupomikti/tampermonkey-svelte-vite your-project-name
cd your-project-name
npm i
npm run dev
```

If you do not have Tampermonkey installed yet, you can get it from [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) or [the Chrome web store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo). However, only the Chrome version allows access to file URLs so it is recommended to use that for development.

*Note:* Allowing an extension access to files can have security risks. Please read and be informed about these risks prior to moving forward.

After you install Tampermonkey in Chrome, enable the `"Allow access to file URL's"` setting in the extension settings for Tampermonkey.

Copy **only** the header details from `dist/bundle.user.js`. It should look like this
```
// ==UserScript==
// @name        tampermonkey-svelte-vite -> dev
// @description Tampermonkey template that uses svelte to build UserScripts
// @namespace   https://github.com
// @version     1.0.0
// @homepage    https://github.com/lupomikti/tampermonkey-svelte-vite#readme
// @author      Lucas Shanley
// @resource    css file:///D:/tampermonkey-svelte-vite/dist/bundle.css
// @match       https://*.github.com/*
// @connect     github.com
// @run-at      document-idle
// @require     file:///D:/tampermonkey-svelte-vite/dist/bundle.user.js
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_xmlhttpRequest
// @updateURL
// @downloadURL
// ==/UserScript==
```

Add this as a new script into Tampermonkey. Remember to **only** copy the header details. Once this is done you should be able to reload your webpage and begin creating your script. When running `npm run dev` your source will be watched and changes will rebuild automatically, you will need to refresh the browser to pickup the new changes.

***IMPORTANT NOTE*** only changes to `vite.config.ts` and the files to be 
bundled will be watched and trigger a rebuild. Changes to the header will
need to be copied and pasted into Tampermonkey any time a change occurs.
Failing to do this may cause expected functionality to not behave as expected.

## Files to update

### package.json
```jsonc
{
    "name": "your-project-name",
    "description": "Your project description...",
    "author": "Your Name",
    "homepage": "https://yourhomepage.com"
    ...
}
```

### vite.config.ts
```typescript
...
const distURLBase = `https://yourdisturl.com/dist`;
...
userScriptPlugin({
    headers: {
        ...
        // Namespace of the script (ex: https://example.com)
        namespace: "https://example.com",
        ...
        // URLs you would like scripts to run on
        match: [],
        ...
        // Domains you need to make requests from
        connect: [],
        ...
    }
})
```
By default some of the metadata for your project is shared with `package.json`. This behavior is fine to alter to your needs by changing the values in `vite.config.ts`.

See [Tampermonkey Documentation](https://www.tampermonkey.net/documentation.php) for more details.

## Ready to share?
You can run `npm run build` and this will change the header details in the dist script so that they are ready to deploy for people to use. This removes the references to local scripts and creates references to web urls using `distURLBase`.

## Additional References
- [Svelte](https://svelte.dev/)
- [Tampermonkey](https://www.tampermonkey.net/documentation.php)
- [Vite](https://vitejs.dev/guide/)