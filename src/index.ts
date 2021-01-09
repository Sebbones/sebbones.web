import { DATA_ATTRIBUTES } from './constants';
import './scss/all.scss';
import { bindTemplates } from './templateBinder';

function scroll(target: HTMLElement) {
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth'
    })
  }
}


function attachScroll() {
  var scrollTriggers = document.querySelectorAll(`[${DATA_ATTRIBUTES.scrollTo}]`);
  scrollTriggers.forEach(trigger => {
    var target = trigger.getAttribute(DATA_ATTRIBUTES.scrollTo);
    trigger.addEventListener('click', (e) => {
      scroll(document.getElementById(target));
    })
  })
}

attachScroll();
bindTemplates(document, '[x-template]');