/* eslint-disable react-hooks/exhaustive-deps */
import Moonsense, { Session } from "@moonsense/moonsense-web-sdk";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getInteractionSessionConfig, getMotionSessionConfig, CommonProps } from "../../App";
import { Utils } from "../../Utils";

const Registration: React.FC<CommonProps> = (
  appProps
) => {
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    password: '',
  });

  let [sessionsStarted, setSessionsStarted] = useState(false);
  const [interactionSession, setInteractionSession] = useState<Session>();
  const nagivate = useNavigate();

  const submitForm = (event: React.FormEvent) => {
    event.preventDefault();

    Moonsense.stopAllSessions();
    
    if (Utils.shouldNavigateToNextStep()) {
      nagivate('/sign-in');
    }

  };

  const submitError = (event: any) => {
    if (interactionSession?.inProgress()) {
      interactionSession.addCustomEvent(`InvalidFieldSubmitted`, event.target.name);
    }
  }

  const handleInputUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value
    });
  }

  useEffect(() => {
    if (Utils.shouldCreateSessions() && !sessionsStarted && appProps.journeyId) {
      sessionsStarted = true;
      setSessionsStarted(sessionsStarted);

      // Create the Motion Session
      const motionConfig = getMotionSessionConfig(['registration'], appProps.journeyId);
      Moonsense.startSession(motionConfig);

      // Create Interaction Session
      const interactionConfig = getInteractionSessionConfig(['registration'], appProps.journeyId);
      setInteractionSession(Moonsense.startSession(interactionConfig));
    }
  }, [sessionsStarted, appProps])

  return (
    <div className="form-wrapper registration">
      <h1>Registration</h1>
      <form onSubmit={submitForm} onInvalid={submitError}>
        <div className="input-wrapper">
          <label>First Name*</label>
          <input 
            required
            type="text" 
            name="firstName" 
            value={formState.firstName}
            onChange={handleInputUpdate}
          />
        </div>
        <div className="input-wrapper">
          <label>Last Name*</label>
          <input 
            required
            type="text" 
            name="lastName"  
            value={formState.lastName}
            onChange={handleInputUpdate}
          />
        </div>
        <div className="input-wrapper">
          <label>Address</label>
          <input 
            type="text" 
            name="address"  
            value={formState.address}
            onChange={handleInputUpdate}
          />
        </div>
        <div className="input-wrapper">
          <label>Email*</label>
          <input
            required
            type="email" 
            name="email"  
            value={formState.email}
            onChange={handleInputUpdate}
          />
        </div>

        <div className="input-wrapper">
          <label>Password*</label>
          <input 
            required
            type="password" 
            name="password"  
            value={formState.password}
            onChange={handleInputUpdate}
          />
        </div>
        <div className="notice-wrapper">
          * field required
        </div>
        <div className="actions-wrapper">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
};

export default Registration;
