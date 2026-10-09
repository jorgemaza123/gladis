import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(
  new URL('../lib/scroll-motion.ts', import.meta.url),
  'utf8',
);
const { observeScrollMotion } = await import(
  'data:text/javascript;base64,' +
    Buffer.from(
      ts.transpileModule(source, {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
        },
      }).outputText,
    ).toString('base64')
);

// These doubles model only browser events/geometry used by the controller.
// CSS appearance and actual scrolling still require browser verification.
class EventTargetDouble {
  listeners = new Map();
  addEventListener(type, callback) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(callback);
  }
  removeEventListener(type, callback) {
    this.listeners.get(type)?.delete(callback);
  }
  dispatch(type, event = {}) {
    for (const callback of this.listeners.get(type) || []) callback(event);
  }
  get listenerCount() {
    return [...this.listeners.values()].reduce(
      (total, entries) => total + entries.size,
      0,
    );
  }
}

class ElementDouble extends EventTargetDouble {
  children = [];
  parentElement = null;
  dataset = {};
  queryCount = 0;
  classes = new Set();
  classList = {
    add: (...names) => names.forEach((name) => this.classes.add(name)),
    contains: (name) => this.classes.has(name),
    remove: (...names) => names.forEach((name) => this.classes.delete(name)),
  };
  focused = false;
  attached = false;
  constructor({ reveal = true, top = 1200, height = 160 } = {}) {
    super();
    if (reveal) this.dataset.reveal = '';
    this.top = top;
    this.height = height;
  }
  get isConnected() {
    return this.parentElement ? this.parentElement.isConnected : this.attached;
  }
  append(...elements) {
    for (const element of elements) {
      element.remove();
      element.parentElement = this;
      this.children.push(element);
    }
  }
  remove() {
    if (this.parentElement) {
      this.parentElement.children = this.parentElement.children.filter(
        (child) => child !== this,
      );
      this.parentElement = null;
    }
  }
  contains(element) {
    return (
      this === element || this.children.some((child) => child.contains(element))
    );
  }
  matches(selector) {
    if (selector === '[data-reveal]') return 'reveal' in this.dataset;
    if (selector === '.service-visual') return this.classes.has('service-visual');
    if (selector === ':focus-within')
      return (
        this.focused || this.children.some((child) => child.matches(selector))
      );
    throw new Error(
      `Unsupported selector in the focused DOM double: ${selector}`,
    );
  }
  closest(selector) {
    return this.matches(selector)
      ? this
      : this.parentElement?.closest(selector) || null;
  }
  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }
  querySelectorAll(selector) {
    this.queryCount++;
    return this.children.flatMap((child) => [
      ...(child.matches(selector) ? [child] : []),
      ...child.querySelectorAll(selector),
    ]);
  }
  getBoundingClientRect() {
    return {
      top: this.top,
      bottom: this.top + this.height,
      height: this.height,
    };
  }
  removeAttribute(name) {
    if (!name.startsWith('data-'))
      throw new Error(`Unsupported attribute: ${name}`);
    delete this.dataset[
      name.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
    ];
  }
}

function serviceScene({ top = 1200, visualTop = 1200, visualHeight = 400 } = {}) {
  const owner = new ElementDouble({ top, height: 1200 });
  owner.dataset.reveal = 'service';
  const visual = new ElementDouble({ reveal: false, top: visualTop, height: visualHeight });
  visual.classList.add('service-visual');
  owner.append(visual);
  return { owner, visual };
}
function environment({
  reduced = false,
  hasIntersection = true,
  hasMutation = true,
} = {}) {
  const preference = new EventTargetDouble();
  preference.matches = reduced;
  preference.change = (matches) => {
    preference.matches = matches;
    preference.dispatch('change', { matches });
  };
  const intersections = [];
  const mutations = [];
  class IntersectionDouble {
    observed = new Set();
    disconnected = false;
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      intersections.push(this);
    }
    observe(element) {
      this.observed.add(element);
    }
    unobserve(element) {
      this.observed.delete(element);
    }
    disconnect() {
      this.observed.clear();
      this.disconnected = true;
    }
    cross(element, isIntersecting = true, intersectionRatio = isIntersecting ? 1 : 0) {
      if (this.disconnected || !this.observed.has(element)) return;
      this.callback([
        {
          target: element,
          isIntersecting,
          intersectionRatio,
          boundingClientRect: element.getBoundingClientRect(),
        },
      ]);
    }
  }
  class MutationDouble {
    disconnected = false;
    constructor(callback) {
      this.callback = callback;
      mutations.push(this);
    }
    observe(root, options) {
      this.root = root;
      this.options = options;
    }
    disconnect() {
      this.disconnected = true;
    }
    flush({ addedNodes = [], removedNodes = [], target = this.root } = {}) {
      if (!this.disconnected)
        this.callback([
          {
            type: 'childList',
            target,
            addedNodes,
            removedNodes,
          },
        ]);
    }
  }
  const values = {
    window: {
      innerHeight: 800,
      matchMedia: () => preference,
      ...(hasIntersection ? { IntersectionObserver: IntersectionDouble } : {}),
      ...(hasMutation ? { MutationObserver: MutationDouble } : {}),
    },
    Element: ElementDouble,
    HTMLElement: ElementDouble,
    IntersectionObserver: hasIntersection ? IntersectionDouble : undefined,
    MutationObserver: hasMutation ? MutationDouble : undefined,
  };
  const originals = new Map();
  for (const [name, value] of Object.entries(values)) {
    originals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, {
      configurable: true,
      writable: true,
      value,
    });
  }
  const root = new ElementDouble({ reveal: false });
  root.attached = true;
  let cleanup;
  return {
    root,
    preference,
    intersections,
    mutations,
    start() {
      cleanup = observeScrollMotion(root);
      return cleanup;
    },
    restore() {
      cleanup?.();
      for (const [name, descriptor] of originals) {
        if (descriptor) Object.defineProperty(globalThis, name, descriptor);
        else delete globalThis[name];
      }
    },
  };
}

let passed = 0;
function check(name, options, test) {
  const env = environment(options);
  try {
    test(env);
    passed++;
    console.log(`PASS: ${name}`);
  } finally {
    env.restore();
  }
}

check(
  'las escenas futuras se activan una sola vez al entrar',
  {},
  ({ root, start, intersections, mutations }) => {
    const scene = new ElementDouble();
    root.append(scene);
    start();
    assert.equal(root.dataset.scrollMotion, 'ready');
    const observer = intersections[0];
    assert.ok(observer.observed.has(scene));
    observer.cross(scene, false);
    assert.equal(scene.classList.contains('arrived'), false);
    observer.cross(scene);
    assert.equal(scene.classList.contains('arrived'), true);
    assert.equal(scene.dataset.motionSettled, undefined);
    assert.equal(observer.observed.has(scene), false);
    mutations[0].flush();
    assert.equal(
      observer.observed.has(scene),
      false,
      'otras mutaciones no deben volver a observar una escena recorrida',
    );
  },
);

check(
  'la hidratación asienta todo contenido visible y conserva entradas futuras',
  {},
  ({ root, start, intersections }) => {
    const initial = new ElementDouble({ top: 600 });
    const readable = new ElementDouble({ top: 100 });
    const edge = new ElementDouble({ top: 799 });
    const passedScene = new ElementDouble({ top: -800 });
    const future = new ElementDouble({ top: 800 });
    const restored = new ElementDouble();
    restored.classList.add('arrived');
    root.append(initial, readable, edge, passedScene, future, restored);
    start();
    for (const scene of [initial, readable, edge, passedScene, restored]) {
      assert.equal(scene.classList.contains('arrived'), true);
      assert.equal(scene.dataset.motionSettled, 'true');
      assert.equal(intersections[0].observed.has(scene), false);
    }
    assert.ok(intersections[0].observed.has(future));
    intersections[0].cross(future);
    assert.equal(future.classList.contains('arrived'), true);
    assert.equal(future.dataset.motionSettled, undefined);
  },
);

check(
  'el cambio de contenido registra nodos nuevos sin duplicar los existentes',
  {},
  ({ root, start, intersections, mutations }) => {
    const existing = new ElementDouble();
    root.append(existing);
    start();
    const future = new ElementDouble();
    const visible = new ElementDouble({ top: 600 });
    const wrapper = new ElementDouble({ reveal: false });
    wrapper.append(future, visible);
    root.append(wrapper);
    const initialRootQueries = root.queryCount;
    mutations[0].flush({ addedNodes: [wrapper] });
    assert.deepEqual(
      intersections[0].observed,
      new Set([existing, future]),
    );
    assert.equal(visible.classList.contains('arrived'), true);
    assert.equal(visible.dataset.motionSettled, 'true');
    assert.equal(
      root.queryCount,
      initialRootQueries,
      'una mutación no debe volver a consultar todas las escenas del root',
    );
    assert.ok(
      wrapper.queryCount > 0,
      'solo debe recorrerse la rama que acaba de añadirse',
    );
    mutations[0].flush({ addedNodes: [wrapper] });
    assert.equal(intersections[0].observed.size, 2);
  },
);

check(
  'Tab termina el movimiento de todos los contenedores del control enfocado',
  {},
  ({ root, start, intersections }) => {
    const outer = new ElementDouble();
    const inner = new ElementDouble();
    const button = new ElementDouble({ reveal: false });
    const unrelated = new ElementDouble();
    inner.append(button);
    outer.append(inner);
    root.append(outer, unrelated);
    start();
    root.dispatch('focusin', { target: button });
    for (const scene of [outer, inner]) {
      assert.equal(scene.dataset.motionSettled, 'true');
      assert.equal(scene.classList.contains('arrived'), true);
      assert.equal(intersections[0].observed.has(scene), false);
    }
    assert.equal(unrelated.classList.contains('arrived'), false);
    root.dispatch('focusin', { target: {} });
    assert.ok(intersections[0].observed.has(unrelated));
  },
);

check(
  'retirar y reinsertar una escena pendiente libera y restablece su observación',
  {},
  ({ root, start, intersections, mutations }) => {
    const scene = new ElementDouble();
    root.append(scene);
    start();
    const observer = intersections[0];
    assert.ok(observer.observed.has(scene));
    scene.remove();
    mutations[0].flush({ removedNodes: [scene] });
    assert.equal(
      observer.observed.has(scene),
      false,
      'el observador no debe retener tarjetas retiradas de la ruta',
    );
    assert.equal(scene.classList.contains('arrived'), false);
    root.append(scene);
    mutations[0].flush({ addedNodes: [scene] });
    assert.ok(
      observer.observed.has(scene),
      'la misma tarjeta pendiente debe poder animarse después de reinsertarse',
    );
    observer.cross(scene);
    assert.equal(scene.classList.contains('arrived'), true);
    assert.equal(observer.observed.has(scene), false);
  },
);

check(
  'una notificación encolada ignora la escena retirada y procesa la que sigue presente',
  {},
  ({ root, start, intersections, mutations }) => {
    const removed = new ElementDouble();
    const present = new ElementDouble();
    root.append(removed, present);
    start();
    const observer = intersections[0];
    // Model a callback queued while both cards belonged to the old route.
    const queuedEntries = [removed, present].map((target) => ({
      target,
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: target.getBoundingClientRect(),
    }));
    removed.remove();
    mutations[0].flush({ removedNodes: [removed] });
    observer.callback(queuedEntries);
    assert.equal(removed.classList.contains('arrived'), false);
    assert.equal(removed.dataset.motionSettled, undefined);
    assert.equal(present.classList.contains('arrived'), true);
    assert.equal(observer.observed.has(present), false);
  },
);

check(
  'un foco presente y una notificación por encima asientan escenas',
  {},
  ({ root, start, intersections }) => {
    const focused = new ElementDouble();
    const skipped = new ElementDouble();
    const below = new ElementDouble();
    root.append(focused, skipped, below);
    start();
    focused.focused = true;
    skipped.top = -300;
    intersections[0].cross(focused);
    intersections[0].cross(skipped, false);
    intersections[0].cross(below, false);
    assert.equal(focused.dataset.motionSettled, 'true');
    assert.equal(skipped.dataset.motionSettled, 'true');
    assert.equal(skipped.classList.contains('arrived'), true);
    assert.equal(intersections[0].observed.has(skipped), false);
    assert.equal(
      below.classList.contains('arrived'),
      false,
      'una escena futura que aún no intersecta debe seguir pendiente',
    );
    assert.equal(intersections[0].observed.has(below), true);
  },
);

check(
  'un salto que aterriza dentro de una escena no vuelve a desvanecerla',
  {},
  ({ root, start, intersections }) => {
    const landing = new ElementDouble({ height: 900 });
    const entering = new ElementDouble();
    root.append(landing, entering);
    start();
    landing.top = 80;
    entering.top = 650;
    intersections[0].cross(landing);
    intersections[0].cross(entering);
    assert.equal(landing.dataset.motionSettled, 'true');
    assert.equal(landing.classList.contains('arrived'), true);
    assert.equal(intersections[0].observed.has(landing), false);
    assert.equal(entering.dataset.motionSettled, undefined);
    assert.equal(entering.classList.contains('arrived'), true);
  },
);

check(
  'movimiento reducido inicial no prepara observadores ni activa efectos',
  { reduced: true },
  ({ root, start, intersections, mutations, preference }) => {
    const scene = new ElementDouble();
    root.append(scene);
    start();
    assert.equal(root.dataset.scrollMotion, undefined);
    assert.equal(intersections.length, 0);
    assert.equal(mutations.length, 0);
    assert.equal(scene.classList.contains('arrived'), false);
    preference.change(false);
    assert.equal(root.dataset.scrollMotion, 'ready');
    assert.ok(intersections[0].observed.has(scene));
  },
);

check(
  'cambiar la preferencia en vivo detiene y reanuda solo las escenas pendientes',
  {},
  ({ root, start, intersections, mutations, preference }) => {
    const arrived = new ElementDouble();
    const pending = new ElementDouble();
    root.append(arrived, pending);
    start();
    intersections[0].cross(arrived);
    preference.change(true);
    assert.equal(root.dataset.scrollMotion, undefined);
    assert.equal(intersections[0].disconnected, true);
    assert.equal(mutations[0].disconnected, true);
    const newScene = new ElementDouble();
    root.append(newScene);
    preference.change(false);
    assert.equal(root.dataset.scrollMotion, 'ready');
    assert.equal(arrived.dataset.motionSettled, 'true');
    assert.deepEqual(intersections[1].observed, new Set([pending, newScene]));
  },
);

check(
  'desmontar desconecta observadores y retira listeners y estado activo',
  {},
  ({ root, start, intersections, mutations, preference }) => {
    const pending = new ElementDouble();
    root.append(pending);
    const cleanup = start();
    assert.ok(root.listenerCount > 0);
    assert.ok(preference.listenerCount > 0);
    cleanup();
    assert.equal(root.dataset.scrollMotion, undefined);
    assert.equal(root.listenerCount, 0);
    assert.equal(preference.listenerCount, 0);
    assert.ok(intersections.every((observer) => observer.disconnected));
    assert.ok(mutations.every((observer) => observer.disconnected));
    preference.change(false);
    assert.equal(
      intersections.length,
      1,
      'un controlador desmontado no debe reiniciarse',
    );
    root.dispatch('focusin', { target: pending });
    assert.equal(pending.classList.contains('arrived'), false);
    cleanup();
  },
);

check(
  'sin IntersectionObserver la página conserva su estado HTML sin efectos',
  { hasIntersection: false },
  ({ root, start, intersections, mutations, preference }) => {
    const scene = new ElementDouble();
    root.append(scene);
    const cleanup = start();
    assert.equal(root.dataset.scrollMotion, undefined);
    assert.equal(scene.classList.contains('arrived'), false);
    assert.equal(intersections.length, 0);
    assert.equal(mutations.length, 0);
    preference.change(false);
    assert.equal(root.dataset.scrollMotion, undefined);
    cleanup();
    assert.equal(preference.listenerCount, 0);
  },
);

check(
  'sin MutationObserver las escenas iniciales siguen activándose',
  { hasMutation: false },
  ({ root, start, intersections, mutations }) => {
    const scene = new ElementDouble();
    root.append(scene);
    start();
    intersections[0].cross(scene);
    assert.equal(scene.classList.contains('arrived'), true);
    assert.equal(mutations.length, 0);
  },
);

check(
  'los títulos esperan su ratio mínimo aunque el observador notifique contacto parcial',
  {},
  ({ root, start, intersections }) => {
    const title = new ElementDouble();
    root.append(title);
    start();
    const observer = intersections[0];
    assert.deepEqual(observer.options.threshold, [0.18, 0.55]);
    assert.equal(observer.options.rootMargin, '0px 0px -10% 0px');
    title.top = 650;
    observer.cross(title, true, 0);
    observer.cross(title, true, 0.17);
    assert.equal(title.classList.contains('arrived'), false);
    observer.cross(title, true, 0.18);
    assert.equal(title.classList.contains('arrived'), true);
    assert.equal(title.dataset.motionSettled, undefined);
  },
);

check(
  'un artículo visible espera a que el 55 por ciento de su imagen entre',
  {},
  ({ root, start, intersections }) => {
    const { owner, visual } = serviceScene({ top: 100, visualTop: 1000 });
    root.append(owner);
    start();
    const observer = intersections[0];
    assert.equal(owner.classList.contains('arrived'), false);
    assert.equal(observer.observed.has(owner), false);
    assert.ok(observer.observed.has(visual));
    visual.top = 420;
    observer.cross(visual, true, 0.18);
    observer.cross(visual, true, 0.54);
    assert.equal(owner.classList.contains('arrived'), false);
    observer.cross(visual, true, 0.55);
    assert.equal(owner.classList.contains('arrived'), true);
    assert.equal(owner.dataset.motionSettled, undefined);
    assert.equal(visual.classList.contains('arrived'), false);
    assert.equal(observer.observed.size, 0);
    // A previously queued entry cannot settle or restart a completed entrance.
    observer.callback([{
      target: visual,
      isIntersecting: false,
      intersectionRatio: 0,
      boundingClientRect: { top: -1000, bottom: -600, height: 400 },
    }]);
    assert.equal(owner.dataset.motionSettled, undefined);
  },
);

check(
  'la hidratación y los saltos se calculan sobre la imagen del servicio',
  {},
  ({ root, start, intersections }) => {
    const visible = serviceScene({ top: -500, visualTop: 600 });
    const entering = serviceScene({ top: -500, visualTop: 1100 });
    const landing = serviceScene({ top: 1200, visualTop: 1400 });
    root.append(visible.owner, entering.owner, landing.owner);
    start();
    assert.equal(visible.owner.dataset.motionSettled, 'true');
    assert.equal(intersections[0].observed.has(visible.visual), false);
    assert.equal(entering.owner.classList.contains('arrived'), false);
    entering.visual.top = 400;
    intersections[0].cross(entering.visual, true, 0.55);
    assert.equal(entering.owner.dataset.motionSettled, undefined);
    assert.equal(entering.owner.classList.contains('arrived'), true);
    landing.visual.top = 100;
    intersections[0].cross(landing.visual, true, 0.3);
    assert.equal(landing.owner.dataset.motionSettled, 'true');
  },
);

check(
  'Tab en un CTA asienta el artículo y libera la observación de su imagen',
  {},
  ({ root, start, intersections }) => {
    const { owner, visual } = serviceScene();
    const button = new ElementDouble({ reveal: false });
    owner.append(button);
    root.append(owner);
    start();
    root.dispatch('focusin', { target: button });
    assert.equal(owner.dataset.motionSettled, 'true');
    assert.equal(intersections[0].observed.has(visual), false);
    assert.equal(intersections[0].observed.size, 0);
  },
);

check(
  'retirar y reinsertar servicios libera y restablece sus targets visuales',
  {},
  ({ root, start, intersections, mutations }) => {
    const { owner, visual } = serviceScene();
    root.append(owner);
    start();
    owner.remove();
    mutations[0].flush({ removedNodes: [owner] });
    assert.equal(intersections[0].observed.size, 0);
    intersections[0].callback([{
      target: visual,
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: visual.getBoundingClientRect(),
    }]);
    assert.equal(owner.classList.contains('arrived'), false);
    root.append(owner);
    mutations[0].flush({ addedNodes: [owner] });
    assert.ok(intersections[0].observed.has(visual));
    visual.top = 400;
    intersections[0].cross(visual, true, 0.55);
    assert.equal(owner.classList.contains('arrived'), true);
  },
);

check(
  'reemplazar una imagen pendiente desobserva el nodo antiguo sin recorrer todo el root',
  {},
  ({ root, start, intersections, mutations }) => {
    const { owner, visual } = serviceScene();
    root.append(owner);
    start();
    const rootQueries = root.queryCount;
    const replacement = new ElementDouble({ reveal: false, top: 1500 });
    replacement.classList.add('service-visual');
    visual.remove();
    owner.append(replacement);
    mutations[0].flush({ target: owner, removedNodes: [visual], addedNodes: [replacement] });
    assert.equal(root.queryCount, rootQueries);
    assert.equal(intersections[0].observed.has(visual), false);
    assert.ok(intersections[0].observed.has(replacement));
    intersections[0].callback([{
      target: visual,
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: visual.getBoundingClientRect(),
    }]);
    assert.equal(owner.classList.contains('arrived'), false);
    replacement.top = 400;
    intersections[0].cross(replacement, true, 0.55);
    assert.equal(owner.classList.contains('arrived'), true);
  },
);

check(
  'el movimiento reducido desconecta también los targets visuales y los reanuda una sola vez',
  {},
  ({ root, start, intersections, preference }) => {
    const { owner, visual } = serviceScene();
    root.append(owner);
    const cleanup = start();
    preference.change(true);
    assert.equal(intersections[0].observed.size, 0);
    preference.change(false);
    assert.ok(intersections[1].observed.has(visual));
    visual.top = 400;
    intersections[1].cross(visual, true, 0.55);
    preference.change(true);
    preference.change(false);
    assert.equal(owner.dataset.motionSettled, 'true');
    assert.equal(intersections[2].observed.size, 0);
    cleanup();
    assert.ok(intersections.every((observer) => observer.disconnected));
  },
);
check(
  'añadir contenido anidado a un servicio asentado no reinicia sus capas',
  {},
  ({ root, start, intersections, mutations }) => {
    const { owner, visual } = serviceScene({ visualTop: 500 });
    root.append(owner);
    start();
    assert.equal(owner.dataset.motionSettled, 'true');
    const caption = new ElementDouble({ reveal: false });
    visual.append(caption);
    mutations[0].flush({ target: visual, addedNodes: [caption] });
    assert.equal(owner.dataset.motionSettled, 'true');
    assert.equal(owner.classList.contains('arrived'), true);
    assert.equal(intersections[0].observed.size, 0);
  },
);
check(
  'una escena alta en landscape usa un umbral alcanzable sin esperar a salir',
  {},
  ({ root, start, intersections }) => {
    window.innerHeight = 375;
    const { owner, visual } = serviceScene({ visualHeight: 689 });
    root.append(owner);
    start();
    visual.top = 220;
    const entry = {
      target: visual,
      isIntersecting: true,
      intersectionRatio: 0.17,
      boundingClientRect: visual.getBoundingClientRect(),
      rootBounds: { height: 338 },
    };
    intersections[0].callback([entry]);
    assert.equal(owner.classList.contains('arrived'), false);
    visual.top = 200;
    intersections[0].callback([{
      ...entry,
      intersectionRatio: 0.2,
      boundingClientRect: visual.getBoundingClientRect(),
    }]);
    assert.equal(owner.classList.contains('arrived'), true);
    assert.equal(owner.dataset.motionSettled, undefined);
    assert.equal(intersections[0].observed.size, 0);
  },
);
console.log(
  `PASS: ${passed} verificaciones del ciclo de vida de animación; la apariencia y el rendimiento visual requieren navegador.`,
);
