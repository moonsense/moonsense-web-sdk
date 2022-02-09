# Sample Core SDK Application Dev Website

This is application serves as both a simple webserver to serve a sample website the integrates the AcmeSdk and provides a POST endpoint for the AcmeSdk to send bundle output.

The site serves files in the [public](public) folder when requested. More details on each of the files is below. The site is also configured for SSL. The files `cert.pem` and `key.pem` are used by the Node server to provide access to sensors which require SSL to be provided. The certificates are self-signed and therefore will need to be marked as trusted in order to visit the site. They should not be used for anything other than viewing this site locally.

## Setup

To use the site, the AcmeSdk project must be built first. 

After AcmeSdk is built, start the node server by running the following inside the `dev-site` directory:

```
node index.js
```

## File Layout

The public folder includes the website as viewed from the browser.

- `acme-sdk.js` is a symlink to the file created by the AcmeSdk build file. This will automatically be updated as the AcmeSdk is rebuilt. If the symlink does not work for you, copy <project_dir>/src/dist/acme-sdk.js to <project_dir>/dev-site/public/acme-sdk.js
- `use-sdk.js` provides the instrumentation to instantiate the AcmeSdk and wire the website's 'Record' button to the SDK's record function. The credentials set in the SDK's initialization in this file are setup to be compatible with the authorization expected in `index.js`s
- `index.html` is the main page used to serve the website and provides the HTML interface
