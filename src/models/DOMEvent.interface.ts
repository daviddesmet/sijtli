/**
 * Defines a DOM event.
 *
 * Usage:
 * handleChange(event: DOMEvent<HTMLInputElement>) {
 *   // ...
 * }
 *
 * @export
 * @interface DOMEvent
 * @extends {Event}
 * @template T
 */
export interface DOMEvent<T extends EventTarget> extends Event {
  target: T;
}
