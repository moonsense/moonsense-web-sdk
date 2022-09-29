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

  const askForPermission = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const isSafari = navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;

    if (isSafari) {
      if ( typeof( DeviceMotionEvent ) !== "undefined" && typeof( (DeviceMotionEvent as any).requestPermission ) === "function" ) {
        e.preventDefault();
        console.debug('asking permission on safari');
        (DeviceMotionEvent as any).requestPermission().then(() => {
          console.log('Safari permission granted');
        }).catch(() => {
          console.log('Safari permission denied');
        }).finally(() => {
          window.location.href = (e.target as HTMLAnchorElement).href;
        });
      }
    }
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
          <a href="/registration" onClick={(e) => askForPermission(e)}>Registration</a>
        </li>
        <li className={addActiveClass('/sign-in')}>
          <a href="/sign-in" onClick={(e) => askForPermission(e)}>Sign In</a>
        </li>
        <li className={addActiveClass('/checkout')}>
          <a href="/checkout" onClick={(e) => askForPermission(e)}>Checkout</a>
        </li>
      </ul>
    </div>
  )
};

export default Menu;