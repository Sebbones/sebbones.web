import { DATA_ATTRIBUTES } from "./constants";
import { throttleEvent } from "./events";

export function iniScrollSpy(onNav?: (target: Element) => void) {
  var scrollTriggers = document.querySelectorAll(`[${DATA_ATTRIBUTES.scrollTo}]`);

  const elements = Array.from(scrollTriggers).map(t => ({ trigger: t as HTMLElement, target: document.getElementById(t.getAttribute(DATA_ATTRIBUTES.scrollTo))}));

  elements.forEach(({trigger, target}) => {
    trigger.addEventListener('click', () => {
      if (target) {
        window.scrollTo(
          {
            top: target.offsetTop - 100,
            behavior: 'smooth'
          }
        );
        if (onNav) {
          onNav(target);
        }
      } 
    })
  })

  const listener = () => {
    elements.forEach(({trigger, target}) => {
      const range = {
        min: target.offsetTop / 2,
        max: target.offsetTop + target.clientHeight
      }

      console.log(window.scrollY, range);

      const scrollActive = trigger.dataset['scrollActive'];

      if (window.scrollY > range.min && window.scrollY < range.max) {
        if (scrollActive) {
          trigger.classList.add(scrollActive);
        }
      } else {
        trigger.classList.remove(scrollActive)
      }
    })
  }

  throttleEvent(window, 'scroll', listener, 50);
}