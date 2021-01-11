export function throttleEvent(target: EventTarget, event: string, listener: EventListenerOrEventListenerObject, time: number) {
  
  let throttleTimeout;
  let interrupt = false;
  let lastHandler: NodeJS.Timeout;

  target.addEventListener(event, e => {

    clearTimeout(lastHandler);

    const propagate = () => {
      // if (emitted) return;
      // emitted = true;
      if (typeof listener === 'function') {
        listener(e);
      } else {
        listener.handleEvent(e);
      }
    }

    if (!interrupt) {
      interrupt = true;
      propagate();
      throttleTimeout = setTimeout(() => {
        interrupt = false;
        lastHandler = setTimeout(() => {
          propagate();
        }, time);
      }, time);
    }
  })
}