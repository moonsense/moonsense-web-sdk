import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import './Menu.scss';

const Menu: React.FC<{}> = () => {
  const location = useLocation();
  let menuClass = 'breadcrumbs';

  useEffect(() => {
    // update state on location updates
  }, [location])

  if (location.pathname === '/'){
    menuClass = 'buttons';
  }

  const addActiveClass = (linkPath: string): string => {
    if (location.pathname === linkPath) {
      return 'active';
    }

    return '';
  }

  return (
    <div className={`menu ${menuClass}`}>
      {location.pathname === '/' && (
        <>
          <h1>Sample Web Flow</h1>
          <h3>Select a Starting Page</h3>
        </>
      )}
      <ul className={`menu-items ${menuClass}`} >
        <li className={addActiveClass('/registration')}>
          <a href="/registration">Registration</a>
        </li>
        <li className={addActiveClass('/sign-in')}>
          <a href="/sign-in">Sign In</a>
        </li>
        <li className={addActiveClass('/checkout')}>
          <a href="/checkout">Checkout</a>
        </li>
      </ul>
    </div>
  )
};

export default Menu;