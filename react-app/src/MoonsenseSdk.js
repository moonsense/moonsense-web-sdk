import { moonsensePublicToken } from './api-key';
import { Moonsense } from '@moonsense/moonsense-web-sdk';

/** 
 * A callback function to be passed to the Moonsense
 * SDK to track session creation
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

/**
 * A singleton wrapper for the Moonsense SDK instance
 */
export default class MoonsenseSdk {
    static instance = Moonsense.instance || new Moonsense({
        publicToken: moonsensePublicToken, // the API token for this App
        moonsenseCallback: myCallback, // The callback created above
    });
}