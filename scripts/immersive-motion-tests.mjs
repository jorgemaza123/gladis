import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../lib/immersive-motion.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText;
const { createImmersiveMotion, motionProgress } = await import(
  'data:text/javascript;base64,' + Buffer.from(compiled).toString('base64')
);
const c4Source = await readFile(new URL('../lib/c4-motion.ts', import.meta.url), 'utf8');
const { c4MotionRange } = await import('data:text/javascript;base64,' + Buffer.from(ts.transpileModule(c4Source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText).toString('base64'));

class Events {
  listeners = new Map();
  addEventListener(type, callback, options) {
    const listeners = this.listeners.get(type) || new Map();
    listeners.set(callback, options);
    this.listeners.set(type, listeners);
  }
  removeEventListener(type, callback) { this.listeners.get(type)?.delete(callback); }
  dispatch(type, event = {}) {
    for (const callback of this.listeners.get(type)?.keys() || []) callback(event);
  }
  count(type) { return this.listeners.get(type)?.size || 0; }
  get countAll() { return [...this.listeners.values()].reduce((sum, listeners) => sum + listeners.size, 0); }
}

function environment({ width = 1440, height = 900, reduced = false, io = true, ro = true } = {}) {
  const browser = new Events();
  Object.assign(browser, {
    innerWidth: width, innerHeight: height, scrollY: 0, location: { hash: '' },
    CSS: { supports: () => false }, performance,
  });
  const queries = new Map();
  browser.matchMedia = (query) => {
    if (!queries.has(query)) {
      const media = new Events();
      media.matches = query.includes('reduced-motion') ? reduced :
        query.includes('fine') || query.includes('hover') ? width >= 961 : width < 961;
      queries.set(query, media);
    }
    return queries.get(query);
  };
  const frames = new Map();
  let nextFrame = 0;
  browser.requestAnimationFrame = (callback) => { frames.set(++nextFrame, callback); return nextFrame; };
  browser.cancelAnimationFrame = (id) => frames.delete(id);
  const page = new Events();
  Object.assign(page, { visibilityState: 'visible', activeElement: null });
  class Element extends Events {
    dataset = {};
    attributes = new Map();
    styles = new Map();
    parent = null;
    reads = 0;
    id = '';
    className = '';
    constructor(top = 1000, height = 800) {
      super(); this.top = top; this.height = height;
      this.style = {
        setProperty: (name, value, priority = '') => this.styles.set(name, { value, priority }),
        getPropertyValue: (name) => this.styles.get(name)?.value || '',
        getPropertyPriority: (name) => this.styles.get(name)?.priority || '',
        removeProperty: (name) => this.styles.delete(name),
      };
    }
    append(element) { element.parent = this; }
    contains(element) { return !!element && (element === this || this.contains(element.parent)); }
    getBoundingClientRect() {
      this.reads++;
      return { top: this.top - browser.scrollY, height: this.height, bottom: this.top + this.height - browser.scrollY };
    }
    getAttribute(name) {
      if (name.startsWith('data-')) return this.dataset[name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] ?? null;
      return this.attributes.get(name) ?? null;
    }
    setAttribute(name, value) {
      if (name.startsWith('data-')) this.dataset[name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value;
      else this.attributes.set(name, value);
    }
    hasAttribute(name) { return this.getAttribute(name) !== null; }
    removeAttribute(name) {
      if (name.startsWith('data-')) delete this.dataset[name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())];
      else this.attributes.delete(name);
    }
  }
  const root = new Element(0, 12000);
  const first = new Element(); first.id = 'one'; root.append(first);
  const second = new Element(2200, 900); second.id = 'two'; root.append(second);
  const button = new Element(1050, 44); first.append(button);
  page.getElementById = (id) => [first, second, root].find((element) => element.id === id) || null;
  const intersections = [];
  const resizes = [];
  class Intersection {
    targets = new Set();
    constructor(callback, options) { this.callback = callback; this.options = options; intersections.push(this); }
    observe(element) { this.targets.add(element); }
    disconnect() { this.targets.clear(); }
    cross(element, isIntersecting) { if (this.targets.has(element)) this.callback([{ target: element, isIntersecting }]); }
  }
  class Resize {
    targets = new Set();
    constructor(callback) { this.callback = callback; resizes.push(this); }
    observe(element) { this.targets.add(element); }
    disconnect() { this.targets.clear(); }
    emit() { if (this.targets.size) this.callback([]); }
  }
  if (io) browser.IntersectionObserver = Intersection;
  if (ro) browser.ResizeObserver = Resize;
  const globals = { window: browser, document: page, Element, IntersectionObserver: Intersection, ResizeObserver: Resize };
  const previous = new Map(Object.keys(globals).map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  Object.entries(globals).forEach(([name, value]) => Object.defineProperty(globalThis, name, { configurable: true, value }));
  return {
    browser, page, queries, frames, root, first, second, button, intersections, resizes,
    flush() {
      const pending = [...frames.values()]; frames.clear(); pending.forEach((callback) => callback());
      assert.ok(frames.size <= 1, 'maximum one pending frame');
    },
    scroll(y) { browser.scrollY = y; browser.dispatch('scroll'); },
    media(query, matches) { const media = queries.get(query); media.matches = matches; media.dispatch('change'); },
    restore() {
      for (const [name, descriptor] of previous) {
        if (descriptor) Object.defineProperty(globalThis, name, descriptor);
        else delete globalThis[name];
      }
    },
    assertClean() {
      assert.equal(browser.countAll + page.countAll + root.countAll, 0);
      assert.equal([...queries.values()].reduce((sum, media) => sum + media.countAll, 0), 0);
      assert.equal(frames.size, 0);
      assert.ok(intersections.every((observer) => !observer.targets.size));
      assert.ok(resizes.every((observer) => !observer.targets.size));
      assert.equal(root.getAttribute('data-motion-debug'), null);
    },
  };
}

let checks = 0;
function check(name, run, options) {
  const env = environment(options);
  let controller;
  try {
    controller = createImmersiveMotion(env.root, { debug: true });
    run(env, controller);
    checks++;
    console.log(`PASS ENGINE: ${name}`);
  } finally {
    controller?.destroy();
    env.assertClean();
    env.restore();
  }
}

assert.equal(motionProgress(-10, 0, 100), 0);
assert.equal(motionProgress(50, 0, 100), 0.5);
assert.equal(motionProgress(200, 0, 100), 1);
assert.equal(motionProgress(1, 1, 1), 0);
assert.equal(motionProgress(2, 1, 1), 1);

check('0 before entry, intermediate, endpoint 1 and reverse use real scroll', (env, controller) => {
  controller.register({ element: env.first });
  assert.equal(controller.snapshot().sections[0].progress, 0);
  env.intersections.at(-1).cross(env.first, true);
  env.scroll(950); env.flush();
  assert.equal(controller.snapshot().sections[0].progress, 0.5);
  env.scroll(2000); env.flush();
  assert.equal(controller.snapshot().sections[0].progress, 1);
  env.intersections.at(-1).cross(env.first, true);
  env.scroll(440); env.flush();
  assert.equal(controller.snapshot().sections[0].progress, 0.2);
  const state = controller.snapshot();
  env.flush();
  assert.equal(controller.snapshot().stats.frames, state.stats.frames, 'no timer/loop after stopping');
});

check('sections share one live IO, RO, scroll listener and pending RAF', (env, controller) => {
  controller.register({ element: env.first }); controller.register({ element: env.second });
  assert.equal(env.intersections.filter((observer) => observer.targets.size).length, 1);
  assert.equal(env.resizes.filter((observer) => observer.targets.size).length, 1);
  assert.equal(env.browser.count('scroll'), 1);
  assert.equal([...env.browser.listeners.get('scroll').values()][0].passive, true);
  for (let i = 0; i < 20; i++) env.scroll(150 + i);
  assert.equal(env.frames.size, 1);
  const reads = env.first.reads + env.second.reads;
  env.flush();
  assert.equal(env.first.reads + env.second.reads, reads, 'scroll frames do not measure sections');
});

check('offscreen sections stop tracking and fast jumps settle skipped endpoints', (env, controller) => {
  controller.register({ element: env.first }); env.flush();
  env.scroll(3000);
  env.intersections.at(-1).cross(env.first, false); env.flush();
  assert.equal(env.browser.count('scroll'), 0);
  assert.equal(controller.snapshot().sections[0].progress, 1);
  const frames = controller.snapshot().stats.frames;
  env.scroll(5000); env.flush();
  assert.equal(controller.snapshot().stats.frames, frames);
});

check('resize batches measurements and responsive range recalculates at breakpoint', (env, controller) => {
  controller.register({ element: env.first, range: (device) => ({ start: device.breakpoint === 'mobile' ? 0.5 : 1 }) });
  env.flush();
  const reads = env.first.reads;
  env.browser.innerHeight = 800; env.browser.dispatch('resize');
  env.browser.dispatch('resize');
  assert.equal(env.frames.size, 1); env.flush();
  assert.equal(env.first.reads, reads + 1);
  env.browser.innerWidth = 390; env.browser.innerHeight = 844; env.browser.dispatch('resize');
  env.scroll(578); env.flush();
  assert.equal(controller.snapshot().device.breakpoint, 'mobile');
  assert.equal(controller.snapshot().sections[0].progress, 0);
});

check('details height changes and upstream layout invalidate one shared geometry cache', (env, controller) => {
  controller.register({ element: env.first }); controller.register({ element: env.second }); env.flush();
  env.first.height += 300; env.second.top += 300;
  const reads = env.second.reads;
  env.resizes.at(-1).emit(); env.root.dispatch('toggle');
  assert.equal(env.frames.size, 1); env.flush();
  assert.equal(env.second.reads, reads + 1);
  env.intersections.at(-1).cross(env.second, true);
  env.scroll(1600); env.flush();
  assert.equal(controller.snapshot().sections[1].progress, 0);
});

check('reduced motion suspends sensors/RAF, shows settled content and resumes once', (env, controller) => {
  controller.register({ element: env.first }); env.scroll(400);
  env.media('(prefers-reduced-motion: reduce)', true);
  assert.equal(env.frames.size, 0); assert.equal(env.browser.count('scroll'), 0);
  assert.ok(env.intersections.every((observer) => !observer.targets.size));
  assert.ok(env.resizes.every((observer) => !observer.targets.size));
  assert.equal(env.first.dataset.motionSafe, 'reduced');
  assert.equal(env.first.style.getPropertyValue('--motion-progress'), '1.00000');
  env.media('(prefers-reduced-motion: reduce)', false);
  assert.equal(env.browser.count('scroll'), 1);
  assert.equal(env.intersections.filter((observer) => observer.targets.size).length, 1);
});

for (const width of [1440, 390]) {
  check(`initial reduced motion is settled at ${width}px without sensors`, (env, controller) => {
    controller.register({ element: env.first });
    assert.equal(controller.snapshot().status, 'reduced');
    assert.equal(env.intersections.length, 0); assert.equal(env.resizes.length, 0);
    assert.equal(env.frames.size, 0); assert.equal(env.browser.count('scroll'), 0);
    assert.equal(env.first.dataset.motionSafe, 'reduced');
  }, { width, reduced: true });
}

check('hidden document pauses observers/RAF and stale callbacks cannot restart it', (env, controller) => {
  controller.register({ element: env.first }); env.scroll(200);
  const old = env.intersections.at(-1);
  env.page.visibilityState = 'hidden'; env.page.dispatch('visibilitychange');
  assert.equal(env.frames.size, 0); assert.equal(env.browser.count('scroll'), 0);
  old.callback([{ target: env.first, isIntersecting: true }]);
  assert.equal(env.frames.size, 0);
  env.page.visibilityState = 'visible'; env.page.dispatch('visibilitychange');
  assert.equal(env.browser.count('scroll'), 1);
});

check('hash and keyboard focus settle content immediately, with no replay from zero', (env, controller) => {
  controller.register({ element: env.first });
  env.browser.location.hash = '#one'; env.browser.dispatch('hashchange');
  assert.equal(env.first.dataset.motionSafe, 'anchor');
  env.scroll(500); env.flush(); assert.equal(env.first.dataset.motionSafe, undefined);
  env.root.dispatch('focusin', { target: env.button });
  assert.equal(env.first.dataset.motionSafe, 'focus');
  env.scroll(550); env.flush(); assert.equal(env.first.dataset.motionSafe, 'focus');
  env.root.dispatch('focusout', { relatedTarget: null });
  assert.equal(env.first.dataset.motionSafe, undefined);
  env.browser.location.hash = '#%invalid'; assert.doesNotThrow(() => env.browser.dispatch('hashchange'));
});

for (const width of [430, 390, 375, 360, 768, 820, 960]) {
  check(`native viewport ${width}px uses the same controller without wheel/touch interception`, (env, controller) => {
    controller.register({ element: env.first });
    env.intersections.at(-1).cross(env.first, true); env.scroll(950); env.flush();
    assert.equal(controller.snapshot().sections[0].progress, 0.5);
    assert.equal(controller.snapshot().device.breakpoint, width <= 760 ? 'mobile' : 'tablet');
    for (const type of ['wheel', 'touchmove', 'keydown']) assert.equal(env.browser.count(type), 0);
  }, { width });
}

check('pointer and hover changes use the same shared device source', (env, controller) => {
  controller.register({ element: env.first });
  env.media('(pointer: fine)', false); env.media('(pointer: coarse)', true); env.media('(hover: hover)', false);
  assert.equal(controller.snapshot().device.pointer, 'coarse');
  assert.equal(controller.snapshot().device.hover, false);
  assert.equal(env.queries.size, 4);
});

check('fallback without IO/RO/timelines remains functional and layout refresh is explicit', (env, controller) => {
  controller.register({ element: env.first }); env.scroll(950); env.flush();
  assert.equal(controller.snapshot().sections[0].progress, 0.5);
  assert.equal(controller.snapshot().features.viewTimeline, false);
  env.first.height = 1000; controller.refresh(); env.flush();
  assert.ok(controller.snapshot().sections[0].progress < 0.5);
  env.scroll(5000); env.flush(); assert.equal(env.frames.size, 0);
}, { io: false, ro: false });

check('unregister restores authored attributes/styles and releases the final registration', (env, controller) => {
  env.first.style.setProperty('--motion-progress', '0.7', 'important');
  env.first.dataset.motionSection = 'authored';
  const unregister = controller.register({ element: env.first });
  unregister(); unregister();
  assert.equal(env.first.style.getPropertyValue('--motion-progress'), '0.7');
  assert.equal(env.first.style.getPropertyPriority('--motion-progress'), 'important');
  assert.equal(env.first.dataset.motionSection, 'authored');
  env.assertClean();
});

check('Home route unmount destroys references, listeners, pending frames and diagnostics', (env, controller) => {
  const unregister = controller.register({ element: env.first });
  controller.register({ element: env.second }); env.scroll(150);
  controller.destroy(); controller.destroy();
  unregister();
  env.assertClean(); assert.equal(controller.snapshot().sections.length, 0);
  assert.equal(env.first.getAttribute('data-motion-section'), null);
  assert.equal(env.first.style.getPropertyValue('--motion-progress'), '');
  assert.throws(() => controller.register({ element: env.first }), /destroyed/);
});

check('initial hidden document creates no tracking until it becomes visible', (env, controller) => {
  env.page.visibilityState = 'hidden';
  controller.register({ element: env.first });
  assert.equal(env.intersections.length, 0); assert.equal(env.resizes.length, 0);
  assert.equal(env.frames.size, 0); assert.equal(env.browser.count('scroll'), 0);
  assert.equal(controller.snapshot().sections[0].progress, 0);
  env.browser.location.hash = '#one'; env.browser.dispatch('hashchange');
  assert.equal(env.first.style.getPropertyValue('--motion-progress'), '0.00000');
  env.page.visibilityState = 'visible'; env.page.dispatch('visibilitychange');
  assert.equal(env.intersections.filter((observer) => observer.targets.size).length, 1);
});

check('new state never overwrites the existing reveal system settled attribute', (env, controller) => {
  env.first.dataset.motionSettled = 'true';
  const unregister = controller.register({ element: env.first });
  env.root.dispatch('focusin', { target: env.button });
  assert.equal(env.first.dataset.motionSafe, 'focus');
  assert.equal(env.first.dataset.motionSettled, 'true');
  env.root.dispatch('focusout', { relatedTarget: null });
  env.media('(prefers-reduced-motion: reduce)', true);
  assert.equal(env.first.dataset.motionSettled, 'true');
  unregister();
  assert.equal(env.first.dataset.motionSettled, 'true');
});

const integration = await readFile(new URL('../components/home-motion.tsx', import.meta.url), 'utf8');
assert.match(integration, /process\.env\.NODE_ENV !== 'production'/);
assert.match(integration, /querySelector<HTMLElement>\('#completa-tu-evento'\)/);
assert.match(integration, /if \(!section\) return;/);
assert.match(integration, /import\('@\/lib\/immersive-motion'\)/);
assert.match(integration, /if \(disposed\) return;/);
assert.match(integration, /return null;/);
assert.doesNotMatch(source, /MutationObserver|setInterval|setTimeout|preventDefault|Lenis/);
console.log(`PASS ENGINE: ${checks} integration checks; no production demo, new clock, dependencies or layout styling.`);

for (const [width, height, fraction] of [[1440, 900, .55], [768, 1024, .4], [390, 844, .5]]) {
  check(`C4 ${width}: exact quarters, reversal and details resize cannot replay the entrance`, (env, controller) => {
    env.first.id = 'completa-tu-evento';
    controller.register({ element: env.first, range: (device) => c4MotionRange(env.first.height, device) });
    assert.equal(controller.snapshot().sections.length, 1);
    assert.equal(controller.snapshot().sections[0].id, 'completa-tu-evento');
    const device = controller.snapshot().device;
    const range = c4MotionRange(env.first.height, device);
    const start = env.first.top - height * range.start;
    const distance = height * fraction;
    env.intersections.at(-1).cross(env.first, true);
    for (const p of [0, .25, .5, .75, 1, .75, .5, .25, 0, 1]) {
      env.scroll(start + distance * p); env.flush();
      assert.ok(Math.abs(controller.snapshot().sections[0].progress - p) < .0001);
    }
    env.first.height += 1800;
    env.resizes.at(-1).emit(); env.root.dispatch('toggle'); env.flush();
    assert.equal(controller.snapshot().sections[0].progress, 1, 'expanded families keep settled entrance');
    env.first.height -= 1800;
    env.resizes.at(-1).emit(); env.flush();
    assert.equal(controller.snapshot().sections[0].progress, 1);
    env.scroll(start + distance / 2); env.flush();
    assert.equal(controller.snapshot().sections[0].progress, .5, 'reverse still works after native reflow');
  }, { width, height });
}
check('C4 direct family hash and keyboard focus settle decoration without masking content', (env, controller) => {
  env.first.id = 'completa-tu-evento'; env.second.parent = env.first;
  env.second.id = 'familia-personalizados';
  env.browser.location.hash = '#familia-personalizados';
  controller.register({ element: env.first, range: (device) => c4MotionRange(env.first.height, device) });
  assert.equal(env.first.dataset.motionSafe, 'anchor');
  env.root.dispatch('focusin', { target: env.button });
  assert.equal(env.first.dataset.motionSafe, 'focus');
  env.scroll(500); env.flush();
  assert.equal(env.first.dataset.motionSafe, 'focus');
  env.root.dispatch('focusout', { relatedTarget: null });
  assert.equal(env.first.dataset.motionSafe, undefined);
});
check('C4 reduced is settled at 1 with no motion sensors; route unmount cleans completely', (env, controller) => {
  const unregister = controller.register({ element: env.first, range: (device) => c4MotionRange(env.first.height, device) });
  assert.equal(controller.snapshot().sections[0].progress, 1);
  assert.equal(env.first.dataset.motionSafe, 'reduced');
  assert.equal(env.frames.size + env.browser.count('scroll') + env.intersections.length + env.resizes.length, 0);
  unregister(); env.assertClean();
}, { reduced: true });
const c4Css = await readFile(new URL('../app/immersive-motion.css', import.meta.url), 'utf8');
const c4Svg = await readFile(new URL('../components/c4-directory-entrance.tsx', import.meta.url), 'utf8');
assert.match(c4Svg, /aria-hidden="true"/);
assert.match(c4Css, /prefers-reduced-motion: reduce/);
assert.match(c4Css, /#completa-tu-evento \.c4-ribbon-rule \{ opacity: \.35; \}/);
assert.doesNotMatch(c4Css, /will-change|animation:|transition:|filter:|position: sticky/);
assert.doesNotMatch(c4Source, /addEventListener|requestAnimationFrame|Observer/);
assert.doesNotMatch(integration, /#como-cotizar|mesa-invitation/);
console.log('PASS C4: desktop/tablet/mobile quarters, reverse, details reflow, hash, focus, reduced, route cleanup and static fallback.');

const occasionSource = await readFile(new URL('../lib/occasion-motion.ts', import.meta.url), 'utf8');
const { occasionMotionRange, occasionVisualPhase } = await import('data:text/javascript;base64,' + Buffer.from(ts.transpileModule(occasionSource, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText).toString('base64'));

for (const [width, height] of [[1440, 900], [768, 1024], [390, 844], [360, 800], [960, 600]]) {
  check(`Ocasiones ${width}x${height}: six states, reverse and no work after stopping`, (env, controller) => {
    env.first.id = 'ocasiones';
    const geometry = { height: env.first.height, layoutTop: 200, layoutHeight: 1000, stageHeight: 500 };
    controller.register({ element: env.first, range: (device) => occasionMotionRange(geometry, device) });
    const range = occasionMotionRange(geometry, controller.snapshot().device);
    const start = env.first.top - height * range.start;
    const end = env.first.top + geometry.height - height * range.end;
    env.intersections.at(-1).cross(env.first, true);
    for (const p of [0, .2, .4, .6, .8, 1, .8, .6, .4, .2, 0, 1]) {
      env.scroll(start + (end - start) * p); env.flush();
      assert.ok(Math.abs(controller.snapshot().sections[0].progress - p) < .0001);
    }
    const frames = controller.snapshot().stats.frames;
    env.flush(); assert.equal(controller.snapshot().stats.frames, frames);
    for (const name of ['wheel', 'touchmove', 'keydown']) assert.equal(env.browser.count(name), 0);
  }, { width, height });
}
check('C4 and Ocasiones share one controller, deactivate outside bounds and refresh together', (env, controller) => {
  env.first.id = 'completa-tu-evento'; env.second.id = 'ocasiones';
  controller.register({ element: env.first, range: (d) => c4MotionRange(env.first.height, d) });
  controller.register({ element: env.second, range: (d) => occasionMotionRange({ height: env.second.height, layoutTop: 200, layoutHeight: 1000, stageHeight: 500 }, d) });
  assert.equal(env.intersections.filter((o) => o.targets.size).length, 1);
  assert.equal(env.resizes.filter((o) => o.targets.size).length, 1);
  env.scroll(2500);
  env.intersections.at(-1).cross(env.first, false);
  env.intersections.at(-1).cross(env.second, true);
  env.flush();
  const states = controller.snapshot().sections;
  assert.equal(states[0].active, false); assert.equal(states[0].progress, 1);
  assert.equal(states[1].active, true);
  env.second.top += 350;
  env.resizes.at(-1).emit(); env.flush();
  assert.ok(controller.snapshot().sections[1].progress < states[1].progress, 'opening upstream C4 family recalculates the section position');
});
check('Ocasiones direct hash and focus settle immediately; leaving route removes registrations', (env, controller) => {
  env.first.id = 'ocasiones'; env.browser.location.hash = '#ocasiones';
  controller.register({ element: env.first });
  assert.equal(env.first.dataset.motionSafe, 'anchor');
  env.root.dispatch('focusin', { target: env.button });
  assert.equal(env.first.dataset.motionSafe, 'focus');
  controller.destroy(); env.assertClean();
});
check('Ocasiones reduced is complete with no RAF or tracking', (env, controller) => {
  env.first.id = 'ocasiones';
  const remove = controller.register({ element: env.first });
  assert.equal(env.first.dataset.motionSafe, 'reduced');
  assert.equal(controller.snapshot().sections[0].progress, 1);
  assert.equal(env.frames.size + env.browser.count('scroll'), 0);
  remove(); env.assertClean();
}, { reduced: true });
const occasionCss = await readFile(new URL('../app/occasion-motion.css', import.meta.url), 'utf8');
const occasionGrid = await readFile(new URL('../components/occasion-grid.tsx', import.meta.url), 'utf8');
assert.match(integration, /querySelector<HTMLElement>\('#ocasiones'\)/);
assert.match(occasionCss, /@media \(max-width: 375px\)/);
assert.match(occasionCss, /@media \(max-height: 699px\)/);
assert.match(occasionCss, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(occasionCss, /#ocasiones:is\(:target, \[data-motion-safe\]\) \.occasion-stage-image--b \{ visibility: visible; \}/);
assert.match(occasionGrid, /occasions\.map/);
assert.doesNotMatch(occasionSource, /addEventListener|requestAnimationFrame|Observer/);
assert.doesNotMatch(occasionCss, /will-change|animation:|transition:|filter:|backdrop-filter/);
// Read the authored intervals: each viewport must hand over to opaque B at the
// first stable gate, while preserving opaque photographic cover.
const revealIntervals = [...occasionCss.matchAll(/--occasion-reveal-start: ([\d.]+);\s*--occasion-reveal-distance: ([\d.]+);/g)]
  .map((match) => [Number(match[1]), Number(match[2])]);
assert.equal(revealIntervals.length, 4, 'desktop, tablet, mobile and narrow flow intervals');
for (const [start, distance] of revealIntervals) {
  const fraction = (progress) => Math.max(0, Math.min(1, (progress - start) / distance));
  assert.ok(fraction(start) === 0, 'the incoming photograph starts fully clipped');
  assert.ok(fraction(.4) >= .9999, 'C covers A by 40%');
  assert.equal(fraction(.5), 1, 'C remains complete at 50%');
  for (const progress of [.3, .7, .3, .1, .9, .1, .35, .4, .45, .5, .55, .6, .65]) {
    assert.ok(fraction(progress) >= 0 && fraction(progress) <= 1);
  }
}
assert.match(occasionCss, /\.occasion-stage-image \{[^}]*opacity: 1; visibility: hidden;/);
assert.doesNotMatch(occasionCss, /occasion-crossfade|opacity: var\(--occasion-reveal\)/);
assert.match(occasionCss, /clip-path: inset\(0 calc\(\(1 - var\(--occasion-reveal\)\) \* 100%\) 0 0\)/);
assert.match(occasionCss, /clip-path: inset\(0 0 calc\(\(1 - var\(--occasion-reveal\)\) \* 100%\) 0\)/);
assert.match(occasionCss, /\.occasion-stage-image \{[^}]*clip-path: none !important;/);
assert.match(occasionCss, /--occasion-context-b: clamp\(0, \(var\(--motion-progress\) - \.685\) \/ \.002, 1\)/);
console.log('PASS OCASIONES: original progress/reverse, native fallback, coexistence, hash/focus, reduced and cleanup retained.');

const phasePhotos = { a: ['a'], ac: ['a', 'c'], c: ['c'], cb: ['c', 'b'], b: ['b'] };
for (const [progress, phase] of [[0, 'a'], [.25, 'a'], [.35, 'ac'], [.4, 'c'], [.5, 'c'], [.6, 'c'], [.65, 'cb'], [.7, 'b'], [1, 'b']]) {
  assert.equal(occasionVisualPhase(progress), phase);
}
for (let i = 0; i <= 1000; i++) {
  const phase = occasionVisualPhase(i / 1000);
  assert.ok(phasePhotos[phase].length <= 2);
  assert.ok(!phasePhotos[phase].includes('a') || !phasePhotos[phase].includes('b'));
}
for (const [width, height] of [[1440, 900], [768, 1024], [390, 844], [375, 812], [360, 800]]) {
  check(`three environments ${width}: full reverse, jumps and stopped intervals use one section`, (env, controller) => {
    const geometry = { height: env.first.height, layoutTop: 200, layoutHeight: 1000, stageHeight: 500 };
    let phase;
    controller.register({ element: env.first, range: (d) => occasionMotionRange(geometry, d), onProgress: (p) => { phase = occasionVisualPhase(p); } });
    const range = occasionMotionRange(geometry, controller.snapshot().device);
    const start = env.first.top - height * range.start;
    const end = env.first.top + geometry.height - height * range.end;
    env.intersections.at(-1).cross(env.first, true);
    for (const p of [0, .25, .35, .5, .65, .75, 1, .75, .65, .5, .35, .25, 0, .1, .5, .9, .5, .1, .9, .1]) {
      env.scroll(start + (end - start) * p); env.flush();
      assert.equal(phase, occasionVisualPhase(p));
      assert.ok(phasePhotos[phase].length <= 2);
      const frames = controller.snapshot().stats.frames;
      env.flush(); assert.equal(controller.snapshot().stats.frames, frames);
    }
    assert.equal(controller.snapshot().sections.length, 1);
  }, { width, height });
}
const occasionStage = await readFile(new URL('../components/occasion-stage.tsx', import.meta.url), 'utf8');
check('three environments reduced starts at final B without any motion tracking', (env, controller) => {
  let phase;
  controller.register({ element: env.first, onProgress: (p) => { phase = occasionVisualPhase(p); } });
  assert.equal(phase, 'b');
  assert.equal(env.first.dataset.motionSafe, 'reduced');
  assert.equal(env.frames.size + env.browser.count('scroll') + env.intersections.length + env.resizes.length, 0);
}, { reduced: true });
assert.match(occasionStage, /const planes = \['a', 'c', 'b'\]/);
assert.match(occasionStage, /aria-hidden="true"/);
assert.match(occasionGrid, /\['reuniones-familiares', 'boda', 'fin-ano-empresas'\]/);
assert.match(integration, /onProgress: \(progress\) =>/);
assert.match(integration, /removeAttribute\('data-occasion-phase'\)/);
assert.match(occasionCss, /--occasion-second-start: \.6;/);
assert.match(occasionCss, /--occasion-second-start: \.64;/);
assert.match(occasionCss, /\.occasion-stage-context--c \{ grid-area: 1 \/ 1; \}/);
assert.match(occasionCss, /\.occasion-stage-image--b \{ visibility: visible !important; \}/);
console.log('PASS THREE ENVIRONMENTS: A/AC/C/CB/B, 1001 paint-budget samples, full reversal/jumps, constant opacity, CSS clipping, safe/reduced and narrow flow contracts.');

const companySource = await readFile(new URL('../lib/company-motion.ts', import.meta.url), 'utf8');
const { companyMotionRange } = await import('data:text/javascript;base64,' + Buffer.from(ts.transpileModule(companySource, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText).toString('base64'));
for (const [width, height, fraction] of [[1440, 900, .55], [768, 1024, .5], [390, 844, .65], [360, 800, .65], [1024, 600, .55]]) {
  check(`Empresas ${width}x${height}: quarters, reverse, jumps, stops and upstream reflow`, (env, controller) => {
    controller.register({ element: env.first, range: (d) => companyMotionRange(env.first.height, d) });
    const range = companyMotionRange(env.first.height, controller.snapshot().device);
    const start = env.first.top - height * range.start;
    const end = env.first.top + env.first.height - height * range.end;
    assert.ok(Math.abs(end - start - height * fraction) < .0001);
    env.intersections.at(-1).cross(env.first, true);
    for (const p of [0, .25, .5, .75, 1, .75, .5, .25, 0, 1, 0, .25, .75, .25]) {
      env.scroll(start + (end - start) * p); env.flush();
      assert.ok(Math.abs(controller.snapshot().sections[0].progress - p) < .0001);
      const frames = controller.snapshot().stats.frames;
      env.flush(); assert.equal(controller.snapshot().stats.frames, frames);
    }
    env.first.height += 100; env.first.top += 240;
    env.resizes.at(-1).emit(); env.flush();
    env.scroll(start + 240 + height * fraction * .5); env.flush();
    assert.ok(Math.abs(controller.snapshot().sections[0].progress - .5) < .0001, 'height change never stretches the entrance');
    for (const type of ['wheel', 'touchmove', 'keydown']) assert.equal(env.browser.count(type), 0);
  }, { width, height });
}
check('Empresas focus settles CTA immediately and heading anchor is preserved', (env, controller) => {
  env.first.className = 'company-gateway wrap';
  controller.register({ element: env.first, range: (d) => companyMotionRange(env.first.height, d) });
  env.root.dispatch('focusin', { target: env.button });
  assert.equal(env.first.dataset.motionSafe, 'focus');
  env.scroll(900); env.flush(); assert.equal(env.first.dataset.motionSafe, 'focus');
  env.root.dispatch('focusout', { relatedTarget: null });
  env.second.parent = env.first; env.browser.location.hash = '#two'; env.browser.dispatch('hashchange');
  assert.equal(env.first.dataset.motionSafe, 'anchor');
  controller.destroy(); env.assertClean();
});
check('C4, Ocasiones and Empresas coexist in one controller and unregister cleanly', (env, controller) => {
  const third = new Element(3400, 533); third.className = 'company-gateway wrap'; env.root.append(third);
  controller.register({ element: env.first, range: (d) => c4MotionRange(env.first.height, d) });
  controller.register({ element: env.second, range: (d) => occasionMotionRange({ height: env.second.height, layoutTop: 200, layoutHeight: 1000, stageHeight: 500 }, d) });
  const remove = controller.register({ element: third, range: (d) => companyMotionRange(third.height, d) });
  assert.equal(controller.snapshot().sections.length, 3);
  assert.equal(env.intersections.filter((o) => o.targets.size).length, 1);
  assert.equal(env.resizes.filter((o) => o.targets.size).length, 1);
  assert.equal(env.browser.count('scroll'), 1);
  env.scroll(3400); env.intersections.at(-1).cross(env.first, false); env.intersections.at(-1).cross(third, true); env.flush();
  assert.equal(controller.snapshot().sections[0].active, false);
  assert.equal(controller.snapshot().sections[2].progress, 1);
  remove(); assert.equal(third.getAttribute('data-motion-section'), null);
  assert.equal(third.style.getPropertyValue('--motion-progress'), '');
  controller.destroy(); env.assertClean();
});
check('Empresas reduced has final composition without tracking', (env, controller) => {
  controller.register({ element: env.first, range: (d) => companyMotionRange(env.first.height, d) });
  assert.equal(env.first.dataset.motionSafe, 'reduced');
  assert.equal(controller.snapshot().sections[0].progress, 1);
  assert.equal(env.frames.size + env.browser.count('scroll') + env.intersections.length + env.resizes.length, 0);
}, { width: 390, height: 844, reduced: true });
const companyCss = await readFile(new URL('../app/company-motion.css', import.meta.url), 'utf8');
const home = await readFile(new URL('../components/home-experience.tsx', import.meta.url), 'utf8');
const gateway = home.slice(home.indexOf('function CompanyGateway()'), home.indexOf('export function HomeExperience'));
// Keep the server Home's resource tree stable: a second direct CSS import shifts
// development useId paths in the untouched ServiceExplorer during hydration.
assert.match(integration, /import '@\/app\/company-motion\.css'/);
assert.doesNotMatch(home, /import '@\/app\/company-motion\.css'/);
assert.match(integration, /querySelector<HTMLElement>\('\.company-gateway'\)/);
assert.match(integration, /if \(company\) controller.register/);
assert.equal((integration.match(/createImmersiveMotion\(root/g) || []).length, 1);
assert.match(gateway, /aria-labelledby="company-gateway-title"/);
assert.match(gateway, /className="company-coordination-rule" data-motion-decoration aria-hidden="true"/);
assert.match(gateway, /<Link className="button" href="\/empresas">Ver soluciones para empresas/);
assert.doesNotMatch(gateway, /data-reveal|<img|<svg|style=|minHeight|data-motion-content[^>]*>Ver soluciones/);
assert.match(companyCss, /@media \(max-width: 960px\)/);
assert.match(companyCss, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(companyCss, /\[data-motion-safe\] \.company-coordination-rule/);
assert.doesNotMatch(companySource, /addEventListener|requestAnimationFrame|Observer/);
assert.doesNotMatch(companyCss, /min-height|padding:|padding-block:|margin:|font-size|line-height|sticky|will-change|animation:|transition:|filter:|clip-path|\.button/);
console.log('PASS EMPRESAS: quarters, reverse/jumps/stops, native mobile, reflow, shared C4/occasion controller, focus/hash, reduced, static HTML/CTA and cleanup.');
