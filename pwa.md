# create a app with default setting for pwa

- npx create-react-app my-app --template cra-template-pwa
- in src/index.js search for serviceWorker.unregister()
  and change it to serviceWorker.register()
  - It’s not recommended to enable service workers in development mode as it can lead to cases where the PWA only loads cached assets and not including the latest local changes.
- to run prdouction
  npm run build
  npx serve build

# Add PWA to already existing project

1 Copy the service-worker.js and serviceWorkerRegistration.js from the new created app into your src directory
2 Copy the "workbox-\*" dependencies from the package.json into your package.json dependencies
3 (Optional) If you want web-vitals, copy the web-vitals dependency from package.json into your package.json
4 add serviceWorker.register() in index.js
5 check for mainfest.json file in public folder and it should be included in index.html
<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
