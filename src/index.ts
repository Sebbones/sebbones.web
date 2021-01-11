import { throttleEvent } from './events';
import { iniScrollSpy } from './scrollSpy';
import './scss/all.scss';
import { bindTemplates } from './templateBinder';

function iniNvbar() {
  const menu = document.getElementById('menu');
  const navBurger = document.getElementById('navBurger');
  const overlayNav = document.getElementById('overlayNav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 64) {
      menu.classList.add("navbar-fixed");
    } else {
      menu.classList.remove("navbar-fixed");
    }
  });

  window.addEventListener('resize', e => {
    if (window.innerWidth > 768) {
      menu.classList.remove('--expanded');
    }
  })


  navBurger.addEventListener('click', e => {
    if (menu.classList.contains('--expanded')) {
      menu.classList.remove('--expanded');      
    } else {
      menu.classList.add('--expanded');
    }
  })
}

const anchors = document.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;

anchors.forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.hash);
    target.scrollIntoView({
      behavior: 'smooth'
    });
  });
})


bindTemplates(document, '[x-template]');
iniNvbar();
iniScrollSpy(() => {
  const menu = document.getElementById('menu');
  menu.classList.remove('--expanded');
});
