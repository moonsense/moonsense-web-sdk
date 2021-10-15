import { useState, } from 'react';
import MoonsenseSdk from './MoonsenseSdk';
import './App.css';

function App() {
  // Setup state tracking objects
  const [modalOpen, setModalOpen] = useState(false); // track checkout modal status
  const [orderSuccess, setOrderSuccess] = useState(false); // track order status
  const [paymentSuccess, setPaymentSuccess] = useState(false); // track order status
  const [items, setItems] = useState([ // create a list of items to show in cart
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


  /**
   * A Moonsense singleton for generating and
   * controlling active recording Sessions
   */
  const moonsense = MoonsenseSdk.instance;

  const taxRate = 0.075; // establish a tax rate

  // Setup a formatter to display the amounts as USD
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  /**
   * Increments the quantity of an item
   * :16
   * @param item the item to increment
   */
  const add = (item) => {
    item.qty += 1;
    setItems([...items]);
  };

  /**
   * Decrements the quantity of an item
   * 
   * @param item the item to decrement
   */
  const subtract = (item) => {
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

    // Starts recording a session with a 60 second duration and labeled 'ReactPayment'
    moonsense.startSession(60000, ['ReactPayment']);
  }

  /**
   * Closes the order and resets the counts
   */
  const closeOrder = () => {
    moonsense.stopAllSessions();

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
      }, 750);
    }, 750);
  }

  /**
   * Tracks the current status of the 'swipe to buy' slider
   * and triggers order success when the swipe is complete
   * 
   * @param event slider event
   */
  const sliderUpdate = (event) => {
    if (event.target.value >= 99) {
      setOrderSuccess(true);
      closeOrder();
    }
  }

  /**
   * Generates the jsx for an item in an item list
   * 
   * @param item the item to display
   */
  const renderItem = (item) => (
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
        <div className="details">
          <div className="item">
            <span>Card</span>
            <span>xxxx xxxx xxxx 3981</span>
          </div>
          <div className="item">
            <span><b>Total</b></span>
            <span><b>{formatter.format(total())}</b></span>
          </div>
        </div>
        <div className={`swipe-to-buy ${orderSuccess ? 'success' : ''}`}>
          <input className="slider" type="range" min="1" max="100" defaultValue="0" disabled={orderSuccess} onInput={sliderUpdate} />
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
    <div className="app">
      <div className={`store ${modalOpen ? 'blur' : ''}`} >
        <h1 className="app-header">
          Cookie Shop
        </h1>
        <div className="item-list">
          {
            items.map( (item) => renderItem(item))
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
        <button className="buy" onClick={() => {doCheckout()}}>Buy</button>
      </div>

      {
        // Display the overlay if the modal is open
        modalOpen &&
        <div className="modal-overlay"></div>
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
  );
}

export default App;
