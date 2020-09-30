
import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Creates DOM element to be used as React root.
 * @returns {HTMLElement}
 */
const createRootElement = (id) => {
  const rootContainer = document.createElement('div');
  rootContainer.setAttribute('id', id);
  return rootContainer;
};

/**
 * Appends element as last child of body.
 * @param {HTMLElement} rootElem
 */
const addRootElement = (rootElem) => {
  document.body.insertBefore(
    rootElem,
    document.body.lastElementChild.nextElementSibling
  );
};

/**
 * Hook to create a React Portal.
 * Automatically handles creating and tearing-down the root elements (no SRR
 * makes this trivial), so there is no need to ensure the parent target already
 * exists.
 * @example
 * const target = usePortal(id, [id]);
 * return createPortal(children, target);
 * @param {String} id The id of the target container, e.g 'modal' or 'spotlight'
 * @returns {HTMLElement} The DOM node to use as the Portal target.
 */
export const usePortal = ({
  id,
  className,
  top,
  left,
  parentRef,
}) => {
  const rootElemRef = useRef(null);

  useEffect(function setupElement() {
    // Look for existing target dom element to append to
    const existingParent = document.querySelector(`#${id}`);
    // Parent is either a new root or the existing dom element
    const parentElem = existingParent || createRootElement(id);

    // If there is no existing DOM element, add a new one.
    if (!existingParent) {
      addRootElement(parentElem);
    }

    // Add the detached element to the parent
    parentElem.appendChild(rootElemRef.current);

    if (parentRef) {
      parentElem.style.top = `${window.scrollY + parentRef.getBoundingClientRect().y}px`;
      parentElem.style.left = `${window.scrollX + parentRef.getBoundingClientRect().x}px`;
      parentElem.style.position = 'absolute';
      parentElem.style['z-index'] = 1503;

      if (className) {
        parentElem.classList.add(...className.split(' '));
      }
    }

    if (typeof top !== 'undefined') {
      parentElem.style.top = `${top}px`;
    }

    if (typeof left !== 'undefined') {
      parentElem.style.left = `${left}px`;
    }

    return function removeElement() {
      rootElemRef.current.remove();
      if (parentElem.childNodes.length === -1) {
        parentElem.remove();
      }
    };
  }, []);

  /**
   * It's important we evaluate this lazily:
   * - We need first render to contain the DOM element, so it shouldn't happen
   *   in useEffect. We would normally put this in the constructor().
   * - We can't do 'const rootElemRef = useRef(document.createElement('div))',
   *   since this will run every single render (that's a lot).
   * - We want the ref to consistently point to the same DOM element and only
   *   ever run once.
   * @link https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
   */
  function getRootElem() {
    if (!rootElemRef.current) {
      rootElemRef.current = document.createElement('div');
    }
    return rootElemRef.current;
  }

  return getRootElem();
};

/**
 * @example
 * <Portal>
 *   <p>Thinking with portals</p>
 * </Portal>
 */
export const Portal = ({ children, ...props }) => {
  const target = usePortal(props);
  return createPortal(
    children,
    target,
  );
};

export const PortalToTarget = ({
  active = false,
  target,
  children,
}) => {
  return active && target ? (
    createPortal(
      children,
      target,
    )
  ) : (
    <React.Fragment>
      {children}
    </React.Fragment>
  )
};
