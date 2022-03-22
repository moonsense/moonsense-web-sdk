# Moonsense Web Core SDK

This repository includes sample applications that provide insight into incorporating and using the SDK.

## Documentation

The instructions provided below provide basic setup instructions for pulling the Moonsense Web Core SDK from the Moonsense repos and a quick overview on running the included sample application. 

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
npm install --save @moonsense/moonsense-web-core-sdk
```

## Usage

The SDK supports integration in a number of ways including as an ES6 module or via CommonJS

### Instantiation

The SDK can be instantiated either via the `initialize(...)` method.

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
     * Triggered when a sensor data Bundle is created inside a session
     * /
    onBundleCreated: (session, bundle) => {
        console.log('Bundle created callback called');
    }

    /**
     * Triggered when the Moonsense Session
     * experiences an error
     */
    onSessionError: (msg) => {
        console.warn('Session error occurred', msg);
    }
}

// The config to pass to new Moonsense(...)
const sdkConfig = {

    // The callback created above
    moonsenseCallback: myCallback, // optional

    // The minimum level of logs that should 
    // be output to the console
    logLevel: 'error', // optional

    /**
     * **[Optional]** A list of defuault sensors the `Session` should record.
     * 
     * Defaults to all sensors
     * 
     * **Note**: Requesting the sensor does not mean that the sensor will be recorded.
     * Sensor availability is subject to platform and device capabilities as well
     * as permissions given to the implementing application.
     */
    sensorTypes: Array<AvailableSensors>,

    /**
     * **[Optional]** The requested sampling rate, in hertz, used by the 
     * SDK for sensors that support it, such as the Accelerometer. 
     * E.g., a value of 20 means that the SDK will try to sample 
     * data 20 times per second. 
     * 
     * Defaults to 25hz
     */
    globalSamplingRate: number,

    /**
     * **[Optional]** The rate, in milliseconds, at which a bundle is generated from the
     * accumulated data for the session and flushed.
     * The actual rate seen is subject to data availability, 
     * network availability, etc...
     * 
     * Defaults to 1000ms
     */
    bundleGenerationInterval: number,
}
```

#### ES6

```javascript
// Import the Moonsense SDK
import { Moonsense } from '@moonsense/moonsense-web-sdk';

// Create an instance of the SDK
Moonsense.initialize(sdkConfig);

```

#### CommonJS with Require
```javascript
const moonsenseWebSdk = require('./moonsense-web-sdk.js');
moonsenseWebSdk.Moonsense.initialize(sdkConfig);

```

#### CommonJS via Script Tag
```html
<!-- This assumes you are hosting the sdk at root -->
<script src="/moonsense-web-sdk.js"></script>

<script>
    MoonsenseSdk.Moonsense.initialize(sdkConfig);
</script>
```

### Recording

The SDK records in Sessions. A Session is defined as a single start and stop point in time. A Session is started in the following way:

```javascript
// Creates a session that will record for up to 20 seconds
const session = moonsenseSdk.startSesssion({
    /**
     * The maximum length of time to record a session in milliseconds
     */
    duration: 20000,

    /**
     * **[Optional]** A list of labels to apply to the session when it's created.
     * 
     * Defaults to all sensors
     */
    labels: ['Label1', 'Label2'],

    /**
     * **[Optional]** A list of sensors to use for this specific Session.
     * 
     * Defaults to all SdkConfig.sensorTypes if set, otherwise defaults to all sensors
     */
    sensorTypes: [AvailableSensors.ACCELEROMETER],
});
```

A session can also be terminated early using the following:
```javascript
// Stops a specific session
session.stopSession();
```

Or all sessions can be stopped using:
```javascript
// Stops all sessions
MoonsenseSdk.Moonsense.stopAllSessions();
```

### Backgrounding and Data Transfer

When the SDK determines that the implementating page is going in the background due to switching tabs or closing the page, the SDK performs a flush of all sensors. When receiving this data, it's best to use the [Beacon API](https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API) to transfer the data to your backend as using XHR/Fetch requests may be cancelled by the browser. 

To determine if the page has moved to the background, the following can be used in the bundle callback method:

```javascript
    if (document.visibilityState === 'hidden') {
        // Page is in the background.
        // Send data over Beacon API.
    } else {
        // Page is rendering or in the foreground.
        // Send data using standard approach.
    }
```

## Included Sensors

The SDK has the capability of monitoring multiple sensors based on availability within the browser. The SDK will make a best effort to connect and monitor sensors using numerous methods based on the browser being used. 

The following sensors are currently available:

* Acceleration - monitors acceleration with gravity included
* Linear Acceleration - monitors acceleration with gravity excluded
* Pointer - monitors all touch events within the browser page
* Text Change - monitors all input fields for text changes
* Key Press - monitors for all key press events

## Sample SDK App Implementation

A simple SDK wrapper has been created to show an example usage of the Moonsense Web Core SDK.

More details can be found in the following folder: [sample-sdk](sample-sdk)

## Terms Of Service

This SDK is distributed under the [Moonsense Terms Of Service](https://www.moonsense.io/terms-of-service).

## Support

Feel free to raise an [Issue](https://github.com/moonsense/moonsense-web-sdk/issues) around bugs, usage, concerns or feedback.