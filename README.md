# Moonsense Web SDK

This repository includes sample applications that provide insight into incorporating and using the SDK.

## Documentation

The instructions provided below provide basic setup instructions for pulling the Moonsense Web SDK from the Moonsense repos and a quick overview on running the included sample application. 

For more in depth information visit the [documentation website](https://docs.moonsense.io/) for further details on [Getting Started with the Web SDK](https://docs.moonsense.io/articles/sdk/getting-started-sdk/web), [setting up credentials and applications](https://docs.moonsense.io/articles/console/getting-started) in the [Moonsense Console](https://console.moonsense.cloud/), and collecting sample data with the [Moonsense Recorder](https://docs.moonsense.io/articles/recorder/getting-started).

## Setup
- Clone this repository.
- You need a `repo_access_token` to connect to the NPM repository. This token should have been provided to you. In case you do not have one contact [support@moonsense.io](mailto:support@moonsense.io).
- Tell NPM about your `repo_access_token`. The easiest way to do this is to add the following lines to a file named `.npmrc` in the project directory. This file has already been created in the sample app, you just need to fill in the value for your `repo_access_token`.

```
@moonsense:registry=https://npm.moonsense.io/sdk/
//npm.moonsense.io/sdk/:_authToken=<repo_access_token>
```

## Integration

The SDK is setup using [Node Package Manager (NPM)](https://docs.npmjs.com/about-npm). And can be included in your project by running the following command:

- Install the package into your project
```
npm install --save @moonsense/moonsense-web-sdk
```

## Usage

The SDK requires some configuration information to be setup and associate correctly with your app. To continue, you will need to create a `publicToken` for you app on the [Moonsense Console](https://console.moonsense.cloud/).

The SDK supports integration in a number of ways including as an ES6 module or via CommonJS

### Instantiation

The SDK can be instantiated either via the `init(...)` method or
by creating a new instance of the `Moonsense(...)` object. Both can be setup with an init object as such:

```javascript
/** 
 * Setup a callback to use with the SDK.
 * 
 * The callback allows the SDK to communicate easily to
 * your app and allows you to trigger specific events 
 * within your app based on Moonsense SDK events.
 */
const myCallback = {

    /**
     * Triggered when a Moonsense Session is started
     */
    onSessionStarted: (session) => {
        console.log('Session start callback called');
    },

    /**
     * Triggered when a Moonsense Session ends
     */
    onSessionStopped: (session) => {
        console.log('Session stop callback called');
    },

    /**
     * Triggered when the Moonsense Session
     * experiences an error
     */
    onSessionError: (msg) => {
        console.warn('Session error occurred', msg);
    }
}

// The config to pass to new Moonsense(...) or init(...)
const sdkConfig = {
    // the PublicToken for this App
    publicToken: '<your_public_token>', // required

    // The callback created above
    moonsenseCallback: myCallback, // optional

    // The minimum level of logs that should 
    // be output to the console
    logLevel: 'error', // optional
}
```

#### ES6

```javascript
// Import the Moonsense SDK
import { Moonsense } from '@moonsense/moonsense-web-sdk';

// Create an instance of the SDK
const moonsenseSdk = new Moonsense(sdkConfig);

```

#### CommonJS with Require
```javascript
const moonsenseWebSdk = require('./moonsense-web-sdk.js');
const moonsenseSdk = moonsenseWebSdk.init(sdkConfig);

```

#### CommonJS via Script Tag
```html
<!-- This assumes you are hosting the sdk at root -->
<script src="/moonsense-web-sdk.js"></script>

<script>
    const moonsenseSdk = moonsenseWebSdk.init(sdkConfig);
</script>
```

### Recording

The SDK records in Sessions. A Session is defined as a single start and stop point in time. A Session is started in the following way:

```javascript
// Creates a session that will record for up to 20 seconds
const session = moonsenseSdk.startSesssion(20000);
```

A session can also be terminated early using the following:
```javascript
// Stops a specific session
session.stopSession();
```

Or all sessions can be stopped using:
```javascript
// Stops all sessions
moonsenseSdk.stopAllSessions();
```

## Included Sensors

The SDK has the capability of monitoring multiple sensors based on availability within the browser. The SDK will make a best effort to connect and monitor sensors using numerous methods based on the browser being used. 

The following sensors are currently available:

* Acceleration - monitors acceleration with gravity included
* Linear Acceleration - monitors acceleration with gravity excluded
* Pointer - monitors all touch events within the browser page
* Text Change - monitors all input fields for text changes
* Key Press - monitors for all key press events

## Sample React App Implementation

The React App implementation shows how to incorporate the Moonsense SDK into a React Application. It includes a singleton wrapper and triggering of Session creation and ending sessions based on user interaction.

More details can be found in the following folder: [react-app](react-app)


## Terms Of Service

This SDK is distributed under the [Moonsense Terms Of Service](https://www.moonsense.io/terms-of-service).

## Support

Feel free to raise an [Issue](https://github.com/moonsense/moonsense-web-sdk/issues) around bugs, usage, concerns or feedback.
