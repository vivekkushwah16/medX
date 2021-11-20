import packageJson from '{root-dir}/package.json';
global.appVersion = packageJson.version;
console.log(packageJson.version)