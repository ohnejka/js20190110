export default class Component {
  constructor({ element }) {
    this._el = element;
  }
s
  on(eventType, callback) {
    this._el.addEventListener(eventType, callback);
  }
}