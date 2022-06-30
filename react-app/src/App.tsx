import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './App.scss';
import Checkout from "./components/Checkout/Checkout";
import Home from "./components/Home/Home";
import Menu from "./components/Menu/Menu";
import Registration from "./components/Registration/Registration";
import { moonsensePublicToken } from './api-key';
import Moonsense, { AvailableSensors, LogLevel, MoonsenseCallback, SessionConfig } from '@moonsense/moonsense-web-sdk';
import SignIn from "./components/SignIn/SignIn";
import { useEffect, useState } from "react";


export interface CommonProps {
  clientSessionGroupId: string | undefined,
}

const maxClientGroupId = 99999999;
const interactionSensors = [
  AvailableSensors.FOCUS_CHANGE,
  AvailableSensors.KEY_PRESS, 
  AvailableSensors.MOUSE_WHEEL, 
  AvailableSensors.POINTER, 
  AvailableSensors.SCROLL, 
  AvailableSensors.TEXT_CHANGE
];
const motionSensors = Object.values(AvailableSensors).filter((s) => !interactionSensors.includes(s));

const defaultMotionSessionConfig: SessionConfig = {
  duration: 20 * 1000, // 20 Seconds
  sensorTypes: motionSensors
}

const defaultInteractionSessionConfig: SessionConfig = {
  duration: 5 * 60 * 1000, // 5 minutes
  sensorTypes: interactionSensors
}

const getQueryLabels = (): string[] => {
  const queryLabels = new URLSearchParams(window.location.search).get('labels');
  
  return queryLabels ? queryLabels.split(',') : [];
}

const getMotionSessionConfig = (labels: string[] = [], clientSessionGroupId?: string): SessionConfig => {
  return {
    ...defaultMotionSessionConfig,
    labels: ['motion'].concat(getQueryLabels(), labels),
    clientSessionGroupId,
  }
}

const getInteractionSessionConfig = (labels: string[] = [], clientSessionGroupId?: string): SessionConfig => {
  return {
    ...defaultInteractionSessionConfig,
    labels: ['interaction'].concat(getQueryLabels(), labels),
    clientSessionGroupId,
  }
}

const App = () => {
  const [clientSessionGroupId, setClientSessionGroupId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!clientSessionGroupId) {
      const newId = Math.round(Math.random() * maxClientGroupId)
                        .toString()
                        .padStart(8, '0');
                        
      setClientSessionGroupId(newId)
    }
  }, [clientSessionGroupId])

  /**
   * Initialize the Moonsense SDK if is not already
   * initialized
   */
  if (!Moonsense.isInitialized()) {
    /** 
     * A callback function to be passed to the Moonsense
     * SDK to track session creation
     */
    const moonsenseCallback: MoonsenseCallback = {

      onError: (msg) => {
          if (msg.cause && 
              (msg.cause as any).response?.status &&
              (msg.cause as any).response?.status === 401) {
                alert('Token validation failed. Please verify your Moonsense Public Token');
          }
      },

      onTargetElement: (_elementId, element) => {
        const elementAttr: {inputName?: string} = {};

        if ('name' in element) {
          elementAttr.inputName = (element as unknown as {name: string}).name;
        }

        return elementAttr;
      }
    }

    Moonsense.initialize({
      logLevel: LogLevel.WARN,
      publicToken: moonsensePublicToken, // the API token for this App
      moonsenseCallback: moonsenseCallback, // The callback created above
    });
  }

  return (
    <div className="app-wrapper">
      <div className="app">
        <BrowserRouter>
          <Menu />
          <Routes>
            <Route index element={<Home />} />
            <Route path="registration" element={<Registration clientSessionGroupId={clientSessionGroupId} />} />
            <Route path="sign-in" element={<SignIn clientSessionGroupId={clientSessionGroupId} />} />
            <Route path="checkout" element={<Checkout clientSessionGroupId={clientSessionGroupId} />} />
          </Routes>
        </BrowserRouter>
      </div>
      <div className="sdk-version">
        <span>Client Session Group: <b>{clientSessionGroupId}</b></span>
        <span>SDK Version: {Moonsense.version()}</span>
      </div>
    </div>
  );
}

export default App;
export {
  getMotionSessionConfig,
  getInteractionSessionConfig
}
