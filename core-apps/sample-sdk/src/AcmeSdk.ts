
import Moonsense, { LogLevel, MoonsenseCallback, Session } from '@moonsense/moonsense-web-core-sdk';
import { v4 as uuidv4 } from 'uuid';
import { HttpService } from './services/HttpService';

/**
 * The Acme SDK is a simple SDK wrapper to show an example
 * of how the Moonsense Core Web SDK can be integrated into
 * another SDK. 
 * 
 * This SDK includes a basic configuration that associates
 * Moonsense sessions with it's own verison of session called
 * an {@link AcmeSession}. The SDK also listens for bundle 
 * creation events from the Moonsense SDK and pushes them to
 * an HTTP service. 
 * 
 * A sample dev service that runs a website that utilizes the 
 * Acme SDK and provides a POST endpoint has been included in 
 * the `dev-site` folder and can be run using Node.
 */
export class AcmeSdk {
    protected static instance: AcmeSdk;
    private sessionMap:{[key: string]: AcmeSession} = {};
    private httpService: HttpService;

    private constructor(
        private config: Config
    ) {
        this.httpService = new HttpService(
            config.postBaseUrl,
            config.authUsername,
            config.authPassword,
        )

        /**
         * Setup the Moonsense SDK callback
         */
        const moonsenseCallback: MoonsenseCallback = {
            onBundleCreated: (session: Session, bundle: any): void => {
                const acmeSession = this.sessionMap[session.getLocalId()];

                // Create an object to pass to the Acme Backend
                const acmeData = {
                    acmeSessionId: acmeSession.id,
                    moonsenseSessionId: session.getLocalId(),
                    bundle
                }

                // Push the object to the backend using the HttpService
                this.httpService.post('/bundle', acmeData).then(
                    (body) => {
                        console.log(`Bundle ${body.acmeBundleId} for Acme Session ${acmeSession.id} successfully pushed to network`, body);
                        this.config.bundleCreated(acmeSession, body.acmeBundleId);
                    }
                );
                
            },
            onSessionStopped: (session: Session): void => {

                // Log that the Moonsense session has ended
                const acmeSession = this.sessionMap[session.getLocalId()];
                console.log(`Moonsense Session stopped. Acme Session Id: ${acmeSession.id}, Moonsense Session Id: ${session.getLocalId()}`);

                // Remove the Moonsense session from the tracking map
                delete this.sessionMap[session.getLocalId()];
            },
            onSessionStarted: function (session: Session): void {
                // no-op. This is being captured when startSession(...) is called
            },
            onError: function (msg: string): void {
                // Output any errors to the console
                console.error('Moonsense error', msg);
            }
        };

        // Initialize the Moonsense SDK
        Moonsense.initialize({
            moonsenseCallback, // Use the callback defined above
            bundleGenerationInterval: 1000, // Generate 1 bundle each second
        });
    }

    private startRecording(): AcmeSession {

        // Create the new AcmeSession
        const newSession: AcmeSession = {
            id: uuidv4()
        }

        // Start recording a Moonsense session
        const moonsenseSession = Moonsense.startSession({
            duration: 10000, // create a 10 second session
        });

        // Associate the Moonsense session against the AcmeSession for easy lookup later
        const moonsenseSessionId = moonsenseSession.getLocalId();
        console.log(`Moonsense session created with id: ${moonsenseSessionId}`);
        AcmeSdk.instance.sessionMap[moonsenseSessionId] = newSession;

        return newSession;
    }

    /**
     * A function for passing in a configuration to the
     * Acme SDK. The config should include all settings
     * as defined in {@link Config}
     */
    public static initialize(config: Config): void {
        // Don't allow multiple copies of the instance
        if (AcmeSdk.instance) {
            throw new Error('Acme SDK has already been initialized');
        }

        // Create the instance if one doesn't already exist
        const instance = new AcmeSdk(config);
        AcmeSdk.instance = instance;
    }


    /**
     * Starts an Acme session which in-turn starts
     * a Moonsense Session associated with it.
     */
    public static record(): AcmeSession {
        return AcmeSdk.instance.startRecording();
    }
}