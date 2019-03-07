import Table from '../Table/Table.js';
import Portfolio from '../Portfolio/Portfolio.js';
import TradeWidget from '../TradeWidget/TradeWidget.js';
import DataService from '../../services/DataService.js';
import Filter from '../Filter/Filter.js';

export default class App {
  constructor({ element }) {
    this._el = element;
    this._userBalance = 10000;

    this._render();

    this._initPortfolio();
    this._initTradeWidget();
    this._initFilter();
    this._initTable();
    console.log('here')
  }

  async _initTable() {
    // DataService.getCurrencies().then(data => {
    //   this._data = data;
    //   this._initTable(data);
    // })
    let data = await DataService.getCurrencies();
    this._data = data;

    this._table = new Table({
      data,
      element: this._el.querySelector('[data-element="table"]'),
    })

    this._table.on('rowClick', e => {
      this._tradeItem(e.detail);
    })
  }

  _initPortfolio() {
    this._portfolio = new Portfolio({
      element: this._el.querySelector('[data-element="portfolio"]'),
      balance: this._userBalance,
    });
  }

  _initTradeWidget() {
    this._tradeWidget = new TradeWidget({
      element: this._el.querySelector('[data-element="trade-widget"]'),
    });

    this._tradeWidget.on('buy', e => {
      const { item, amount } = e.detail;
      this._portfolio.addItem(item, amount);
    })
  }

  _tradeItem(id) {
    const coin = this._data.find(coin => coin.id === id);
    this._tradeWidget.trade(coin);
  }

  _initFilter() {
    this._filter = new Filter({
      element: this._el.querySelector('[data-element="filter"]'),
    })

    this._filter.on('filter', e => {
      const filterValue = e.detail;
      const filteredData = this._data.filter(item => {
        return item.name.toLowerCase().includes(filterValue);
      })
      this._table.displayData(filteredData);
    })
  }

  _render() {
    this._el.innerHTML = `
      <div class="row">
          <div class="col s12">
              <h1>Tiny Crypto Market</h1>
          </div>
      </div>
      <div class="row portfolio-row">
          <div class="col s6 offset-s6" data-element="portfolio"></div>
      </div>
      <div class="row" data-element="filter"></div>
      <div class="row">
          <div class="col s12" data-element="table"></div>
      </div>
      <div data-element="trade-widget"></div>
    `
  }
}