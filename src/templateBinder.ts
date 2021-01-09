type Context = Record<string, string>

interface TemplateSource {
  template: Element;
  source: (source: any) => any;
}

export function bindTemplates(ref: ParentNode, selectors: string) {
  const templates = ref.querySelectorAll(selectors);

  // group all templates with the same datasource to prevent multiple data calls
  const tmp = Array.from(templates).reduce((pre, acc) => {
    const [src, selector] = acc.getAttribute('x-template').split(':');
    const templateSource: TemplateSource = {
      template: acc,
      source: (source) => selector && source[selector] || source
    }
    if (pre.get(src)) {
      pre.set(src, [...pre.get(src), templateSource]);
    } else {
      pre.set(src, [templateSource]);
    }
    return pre;
  }, new Map<string, TemplateSource[]>())

  tmp.forEach(async (ts, source) => {
    const data = await fetch(source).then(raw => {
      const ctype = raw.headers.get('content-type').split(';').map(x => x.trim());
      if (ctype.includes('application/json')) {
        return raw.json();
      } else {
        return raw.text();
      }
    });
    const tasks = ts.map(async ({template, source: src}) => {
      const parent = template.parentElement;
      parent.removeChild(template);
      const binder = getBuilder(template);
      const d = src(data);

      const bind = (data: any) => {
        var el = template.cloneNode(true) as HTMLElement;
        binder(el, data);
        parent.appendChild(el);
      }

      if (Array.isArray(d)) {
        d.forEach(bind);
      } else {
        bind(d);
      }

    });

    await Promise.all(tasks);
  });
}


function getBuilder(template: Element) {

  // also include the root element as a valid binding element
  const getElements = (src: Element) =>
    [src, ...Array.from(src.querySelectorAll('*'))] as HTMLElement[];

  const bindings = getElements(template).map(
    el => ({
      el,
      // find all x-bind-* bindings
      bindings: el.getAttributeNames().filter(b => b.startsWith('x-bind-'))
    })
  )
  // .filter(x => x.bindings.length)
  .map(({el, bindings}) => {
    if (bindings.length) {
      const _bindings = bindings.map(
        binding => {
          const target = binding.match(/^x-bind-(.*)$/)[1];
          const value = el.getAttribute(binding);
          const [type, assignTo] = value.match(/^(.*)@(.*)$/).slice(1) as [string, any];
          const typeMap: Record<string, (e: HTMLElement, ctx: Context) => void> = {
            style: (e, ctx) => {
              const [prop, valueType = ''] = assignTo.split('.');
              e.style[prop as any] = `${ctx[target]}${valueType}`;
            },
            el: (e: any, ctx) => {
              if (target === "*") {
                e[assignTo] = ctx;
              } else {
                e[assignTo] = ctx[target];
              }
            }
          };
          return (e: HTMLElement, ctx: Context) => typeMap[type](e, ctx);
        }
      );
      return (e: HTMLElement, ctx: Context) => {
        _bindings.forEach(b => {
          b(e, ctx);
        })
      }
    }
    return () => {}
  });

  return (el: HTMLElement, ctx: Context) => {
    const targets = getElements(el);
    targets.forEach((e, i) => {
      bindings[i](e, ctx);
    });
  }
}