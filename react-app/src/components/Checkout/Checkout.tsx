/* eslint-disable react-hooks/exhaustive-deps */
import Moonsense, { Session } from "@moonsense/moonsense-web-sdk";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { CommonProps, getInteractionSessionConfig, getMotionSessionConfig } from "../../App";
import { Utils } from "../../Utils";

import './Checkout.scss';

interface Item {
  id: number,
  name: string,
  qty: number,
  price: number,
}

const Checkout: React.FC<CommonProps> = (
  appProps
) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false); // track order status
  const [paymentSuccess, setPaymentSuccess] = useState(false); // track order status
  const [items, setItems] = useState<Item[]>([ // create a list of items to show in cart
    {
      id: 1,
      name: 'Choco Chip',
      qty: 1,
      price: 1.49
    },
    {
      id: 2,
      name: 'Oatmeal Raisin',
      qty: 1,
      price: 1.99
    },
  ]);

  let [sessionsStarted, setSessionsStarted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const [interactionSession, setInteractionSession] = useState<Session>();
  const nagivate = useNavigate();

  const taxRate = 0.075; // establish a tax rate

  /**
   * Increments the quantity of an item
   * :16
   * @param item the item to increment
   */
  const add = (item: Item) => {
    item.qty += 1;
    setItems([...items]);
  };

  /**
   * Decrements the quantity of an item
   * 
   * @param item the item to decrement
   */
  const subtract = (item: Item) => {
    item.qty = item.qty > 0 ? item.qty - 1 : 0;
    setItems([...items]);
  };

  /**
   * Calculates the subtotal of the current items
   */
  const subtotal = () => items.reduce((prev, cur) => prev + (cur.qty * cur.price), 0);

  /**
   * Calculates the tax for the current items list
   */
  const tax = () => subtotal() * taxRate;

  /**
   * Calculates the total price of the currents items list. 
   * I.e. {@link subtotal} + {@link tax}
   */
  const total = () => subtotal() + tax();

  /**
   * Triggers the checkout modal to display
   */
  const doCheckout = () => {
    setModalOpen(true);

    if (Utils.shouldCreateSessions()) {
      // Starts recording a session with a 60 second duration and labeled 'ReactPayment'
      const transMotionConfig = getMotionSessionConfig(['payment'], appProps.clientSessionGroupId);
      Moonsense.startSession(transMotionConfig);

      // Create Interaction Session
      const interactionConfig = {
        ...getInteractionSessionConfig(['payment'], appProps.clientSessionGroupId),
        duration: 60000
      };
      setInteractionSession(Moonsense.startSession(interactionConfig));
    }
  }

  // Setup a formatter to display the amounts as USD
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  useEffect(() => {
    if (Utils.shouldCreateSessions() && !sessionsStarted && appProps.clientSessionGroupId) {
      sessionsStarted = true;
      setSessionsStarted(sessionsStarted);

      // Create the Motion Session
      const motionConfig = getMotionSessionConfig(['checkout'], appProps.clientSessionGroupId);
      Moonsense.startSession(motionConfig);

      // Create Interaction Session
      const interactionConfig = getInteractionSessionConfig(['checkout'], appProps.clientSessionGroupId);
      Moonsense.startSession(interactionConfig);
    }
  }, [sessionsStarted, appProps]);

  /**
   * Closes the order and resets the counts
   */
  const closeOrder = () => {
    Moonsense.stopAllSessions();

    // Show the payment success screen after a short delay
    setTimeout(() => {
      setOrderSuccess(false);
      setPaymentSuccess(true);

      // Close the payment success screen after a short delay
      // and reset the cart
      setTimeout(() => {
        setPaymentSuccess(false);
        setModalOpen(false);

        items.forEach((i) => i.qty = 0);
        setItems([...items]);

        // Go back to the home page
        if (Utils.shouldNavigateToNextStep()) {
          nagivate('/');
        }
      }, 750);
    }, 750);
  }

  const submitForm = (event: React.FormEvent) => {
    event.preventDefault();

    setOrderSuccess(true);
    closeOrder();

  };

  const submitError = (event: any) => {
    if (interactionSession?.inProgress()) {
      interactionSession.addCustomEvent(`InvalidFieldSubmitted`, event.target.name);
    }
    if (sliderRef.current) {
      sliderRef.current.value = '0';
    }
  }

  /**
   * Tracks the current status of the 'swipe to buy' slider
   * and triggers order success when the swipe is complete
   * 
   * @param event slider event
   */
  const sliderUpdate = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.valueAsNumber >= 99) {
      formRef.current?.requestSubmit();
    }
  }

  /**
   * Tracks the release of the 'swipe to buy' slider
   * and resets it if the slider isn't all the way
   * to the right
   * 
   * @param event slider event
   */
  const sliderRelease = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.valueAsNumber < 99) {
      event.currentTarget.value = '0';
    }
  }

  /**
   * Generates the jsx for an item in an item list
   * 
   * @param item the item to display
   */
  const renderItem = (item: Item) => (
    <div className="item" key={item.id}>
      <span className="item-name">{item.name}</span>
      <div className="item-qty">
        <button className="add" onClick={() => add(item)}>+</button>
        <span>{item.qty}</span>
        <button className="subtract" onClick={() => subtract(item)}>–</button>
      </div>
      <span className="item-price">{formatter.format(item.price * item.qty)}</span>
    </div>
  );

  /**
   * Generates the jsx for the 'swipe to buy' modal
   */
  const renderModal = () => (
    <div className="modal">
      <div className="modal-content">
        <form 
          className="details" 
          ref={formRef} 
          onSubmit={submitForm}
          onInvalid={submitError}
          >
          <div>
            <input
              required
              className="card-input"
              type="text"
              maxLength={19}
              placeholder="Enter a FAKE credit card number"
              name="creditCard"
            />
          </div>
          <div className="cc-details">
            <input
              required
              className="card-input"
              type="text"
              maxLength={4}
              placeholder="Fake Exp Date"
              name="creditCardExp"
            />
            <input
              required
              className="card-input"
              type="text"
              maxLength={3}
              placeholder="Fake CVC"
              name="creditCardCvc"
            />
          </div>
          <div className="divider"></div>
          <div className="item">
            <span><b>Total</b></span>
            <span><b>{formatter.format(total())}</b></span>
          </div>
        </form>
        <div className={`swipe-to-buy ${orderSuccess ? 'success' : ''}`}>
          <input 
            className="slider" 
            type="range" 
            min="1" 
            max="100" 
            defaultValue="0" 
            disabled={orderSuccess} 
            onInput={sliderUpdate} 
            onPointerUp={sliderRelease}
            ref={sliderRef}
            />
          <span className="background-text">{orderSuccess ? 'Success' : 'Swipe to buy'}</span>
        </div>
      </div>
    </div>
  );

  /**
   * Generates the jsx for the 'payment success' modal
   */
  const renderPaymentSuccess = () => (
    <div className="modal">
      <div className="modal-content payment-success">
        <div className="details">
          ✓ Payment Success
        </div>
      </div>
    </div>
  );

  return (
    <div className="form-wrapper checkout">
      <div className="store" >
        <h1 className="app-header">
          Cookie Shop
        </h1>
        <div className="store-details">
          <div className="item-list">
            {
              items.map((item) => renderItem(item))
            }
          </div>
          <div className="divider"></div>
          <div className="item-list">
            <div className="item">
              <span className="item-name">Subtotal</span>
              <span className="item-price">{formatter.format(subtotal())}</span>
            </div>
            <div className="item">
              <span className="item-name">Tax</span>
              <span className="item-price">{formatter.format(tax())}</span>
            </div>
          </div>
          <div className="divider"></div>
          <div className="item-list">
            <div className="item">
              <span className="item-name"><b>Total</b></span>
              <span className="item-price"><b>{formatter.format(total())}</b></span>
            </div>
          </div>
          <button className="buy" onClick={() => { doCheckout() }}>Buy</button>
        </div>
      </div>

      {
        // Display the overlay if the modal is open
        modalOpen &&
        <div className="modal-overlay">
          <div className="blur"></div>
        </div>
      }

      {
        // Render the modal if the modal is open
        modalOpen && !paymentSuccess &&
        renderModal()
      }

      {
        // Render the modal if the modal is open
        modalOpen && paymentSuccess &&
        renderPaymentSuccess()
      }
    </div>
  )
};

export default Checkout;
