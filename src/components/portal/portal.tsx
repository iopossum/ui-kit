import { useRef, useEffect, PropsWithChildren, ReactElement, memo, FC } from 'react';
import { createPortal } from 'react-dom';

/**
 * Creates DOM element to be used as React root.
 * @returns {HTMLElement}
 */
const createRootElement = (id: string) => {
  const rootContainer = document.createElement('div');
  rootContainer.setAttribute('id', id);
  return rootContainer;
};

/**
 * Appends element as last child of body.
 * @param {HTMLElement} rootElem
 */
const addRootElement = (rootElem: HTMLElement) => {
  if (document.body.lastElementChild) {
    document.body.insertBefore(rootElem, document.body.lastElementChild.nextElementSibling);
  }
};

interface IUsePortal {
  id: string;
  className?: string;
  top?: number;
  left?: number;
  parentRef?: HTMLElement;
}

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
export const usePortal = ({ id, className, top, left, parentRef }: IUsePortal) => {
  const rootElemRef = useRef<HTMLElement | null>(null);

  useEffect(
    function setupElement() {
      // Look for existing target dom element to append to
      const existingParent = document.querySelector(`#${id}`) as HTMLElement;
      // Parent is either a new root or the existing dom element
      const parentElem = existingParent || createRootElement(id);

      // If there is no existing DOM element, add a new one.
      if (!existingParent) {
        addRootElement(parentElem);
      }

      // Add the detached element to the parent
      if (rootElemRef.current) {
        parentElem.appendChild(rootElemRef.current);
      }

      if (parentRef) {
        Object.assign(parentElem.style, {
          top: `${window.scrollY + parentRef.getBoundingClientRect().y}px`,
          left: `${window.scrollX + parentRef.getBoundingClientRect().x}px`,
          position: 'absolute',
          'z-index': 1503,
        });

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
        rootElemRef.current?.remove();
        if (parentElem.childNodes.length === -1) {
          parentElem.remove();
        }
      };
    },
    [className, id, left, top, parentRef],
  );

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
export const Portal: FC<PropsWithChildren & IUsePortal> = ({ children, ...props }) => {
  const target = usePortal(props);
  return createPortal(children, target);
};

export const PortalMemo = memo(Portal);

interface IPortalToTargetProps {
  target?: HTMLElement;
  active?: boolean;
  children: ReactElement;
}

export const PortalToTarget = ({ active = false, target, children }: IPortalToTargetProps) => {
  return active && target ? createPortal(children, target) : children;
};

export const PortalToTargetMemo = memo(PortalToTarget);
