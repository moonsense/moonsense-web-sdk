/* eslint-disable react-hooks/exhaustive-deps */
import Moonsense, { Session } from "@moonsense/moonsense-web-sdk";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import { CommonProps, getInteractionSessionConfig, getMotionSessionConfig } from "../../App";
import { Utils } from "../../Utils";

const SignIn: React.FC<CommonProps> = (
  appProps
) => {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  let [sessionsStarted, setSessionsStarted] = useState(false);
  const [interactionSession, setInteractionSession] = useState<Session>();
  const navigate = useNavigate();

  const submitForm = (event: React.FormEvent) => {
    event.preventDefault();

    Moonsense.stopAllSessions();
    
    if (Utils.shouldNavigateToNextStep()) {
      navigate('/checkout'); // go to the checkout page
    } else {
      navigate(0); // reload the page
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
      const motionConfig = getMotionSessionConfig(['sign-in'], appProps.journeyId);
      Moonsense.startSession(motionConfig);

      // Create Interaction Session
      const interactionConfig = getInteractionSessionConfig(['sign-in'], appProps.journeyId);
      setInteractionSession(Moonsense.startSession(interactionConfig));
    }
  }, [sessionsStarted, appProps])

  return (
    <div className="form-wrapper sign-in">
      <h1>Sign In</h1>
      <form onSubmit={submitForm} onInvalid={submitError}>
        <div className="input-wrapper">
          <label>Email</label>
          <input
            required
            type="email" 
            name="email"  
            value={formState.email}
            onChange={handleInputUpdate}
          />
        </div>

        <div className="input-wrapper">
          <label>Password</label>
          <input 
            required
            type="password" 
            name="password"  
            value={formState.password}
            onChange={handleInputUpdate}
          />
        </div>
        <div className="actions-wrapper">
          <button type="submit">Sign In</button>
        </div>
      </form>
    </div>
  )
};

export default SignIn;
