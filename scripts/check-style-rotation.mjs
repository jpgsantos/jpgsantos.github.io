import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const source = readFileSync('_includes/style-rotation.js', 'utf8');
const HOUR = 60 * 60 * 1000;
const styles = ['default', 'mondrian', 'editorial', 'azulejo'];

class MemoryStorage {
  constructor(initial = {}, blocked = false) {
    this.values = new Map(Object.entries(initial).map(([key, value]) => [key, String(value)]));
    this.blocked = blocked;
  }

  getItem(key) {
    if (this.blocked) throw new Error('storage blocked');
    return this.values.has(key) ? this.values.get(key) : null;
  }

  setItem(key, value) {
    if (this.blocked) throw new Error('storage blocked');
    this.values.set(key, String(value));
  }

  removeItem(key) {
    if (this.blocked) throw new Error('storage blocked');
    this.values.delete(key);
  }
}

function harness({ initial = {}, session = {}, now = 1_800_000_000_000, random = [0], blockLocal = false, blockSession = false } = {}) {
  const localStorage = new MemoryStorage(initial, blockLocal);
  const sessionStorage = new MemoryStorage(session, blockSession);
  let randomIndex = 0;
  const fakeMath = Object.create(Math);
  fakeMath.random = () => random[Math.min(randomIndex++, random.length - 1)] ?? 0;
  const window = { localStorage, sessionStorage };
  vm.runInNewContext(source, {
    window,
    Math: fakeMath,
    Date: { now: () => now },
    JSON,
    Number,
    Array,
    Object,
    String
  });
  return { api: window.__siteStyleRotation, localStorage, sessionStorage, now };
}

function record(storage, api) {
  return JSON.parse(storage.getItem(api.recordKey));
}

{
  const test = harness({ random: [0.5, 0, 0.5] });
  const selected = test.api.resolve(styles, 'default');
  const saved = record(test.localStorage, test.api);
  assert.equal(selected, 'editorial', 'first visit should receive a random supported style');
  assert.notEqual(saved.next, saved.current, 'the next style should be preselected and different');
  assert.ok(saved.rotateAt - saved.assignedAt >= 3 * HOUR);
  assert.ok(saved.rotateAt - saved.assignedAt <= 6 * HOUR);
  assert.equal(saved.lastVisitAt, test.now);
}

{
  const first = harness({ random: [0, 0, 0] });
  const selected = first.api.resolve(styles, 'default');
  const saved = record(first.localStorage, first.api);
  const revisit = harness({
    initial: Object.fromEntries(first.localStorage.values),
    now: first.now + HOUR,
    random: [0.99]
  });
  assert.equal(revisit.api.resolve(styles, 'default'), selected, 'revisit before deadline should keep the style');
  assert.equal(record(revisit.localStorage, revisit.api).rotateAt, saved.rotateAt, 'revisit should not reset the deadline');
}

{
  const assignedAt = 1_800_000_000_000 - 4 * HOUR;
  const expired = {
    version: 1,
    current: 'default',
    next: 'editorial',
    assignedAt,
    rotateAt: assignedAt + 3 * HOUR,
    lastVisitAt: assignedAt
  };
  const test = harness({
    initial: { style: 'default', 'jpgsantos-style-rotation-v1': JSON.stringify(expired) },
    random: [0, 0.25]
  });
  assert.equal(test.api.resolve(styles, 'default'), 'editorial', 'expired visit should promote the preselected style');
  assert.notEqual(record(test.localStorage, test.api).next, 'editorial');
}

{
  const test = harness({ initial: { style: 'mondrian' }, random: [0, 0] });
  assert.equal(test.api.resolve(styles, 'default'), 'mondrian', 'legacy preference should migrate without surprise rotation');
  assert.ok(record(test.localStorage, test.api).rotateAt > test.now);
}

{
  const test = harness({ random: [0, 0.75] });
  test.api.resolve(styles, 'default');
  const selected = test.api.select('editorial', styles);
  const saved = record(test.localStorage, test.api);
  assert.equal(selected, 'editorial');
  assert.equal(saved.current, 'editorial');
  assert.notEqual(saved.next, 'editorial');
  assert.ok(saved.rotateAt - saved.assignedAt >= 3 * HOUR);
}

{
  const test = harness({
    initial: { style: 'unsupported', 'jpgsantos-style-rotation-v1': '{not json' },
    random: [0.99, 0, 0]
  });
  assert.ok(styles.includes(test.api.resolve(styles, 'default')), 'malformed state should repair to a supported style');
}

{
  const test = harness({ blockLocal: true, random: [0.5, 0, 0] });
  assert.equal(test.api.resolve(styles, 'default'), 'editorial', 'blocked localStorage should fall back to sessionStorage');
  assert.equal(test.sessionStorage.getItem('style'), 'editorial');
}

{
  const assignedAt = 1_800_000_000_000 - 4 * HOUR;
  const sharedExpiredState = {
    style: 'default',
    'jpgsantos-style-rotation-v1': JSON.stringify({
      version: 1,
      current: 'default',
      next: 'mondrian',
      assignedAt,
      rotateAt: assignedAt + 3 * HOUR,
      lastVisitAt: assignedAt
    })
  };
  const firstTab = harness({ initial: sharedExpiredState, random: [0, 0] });
  const secondTab = harness({ initial: sharedExpiredState, random: [0.99, 0.99] });
  assert.equal(firstTab.api.resolve(styles, 'default'), 'mondrian');
  assert.equal(secondTab.api.resolve(styles, 'default'), 'mondrian', 'simultaneous expired tabs should promote the same preselected style');
}

{
  const assignedAt = 1_800_000_000_000 - 4 * HOUR;
  const expired = { version: 1, current: 'default', next: 'default', assignedAt, rotateAt: assignedAt + 3 * HOUR, lastVisitAt: assignedAt };
  const test = harness({
    initial: { style: 'default', 'jpgsantos-style-rotation-v1': JSON.stringify(expired) },
    random: [0, 0]
  });
  assert.equal(test.api.resolve(['default'], 'default'), 'default', 'single-style registries should remain stable');
}

console.log('style rotation ok: random first visit, distinct timed rotation, manual reset, migration, storage fallback, and simultaneous expiry');
