import HttpService from './HttpService.js';

const COINS_URL = 'https://api.coinpaprika.com/v1/coins';
const getSingleCoinUrl = (id) => `https://api.coinpaprika.com/v1/coins/${id}/ohlcv/latest/`;

const DataService = {
   _sendRequest(url) {
     let promise = new MyPromise((resolve, reject) => {
        HttpService.sendRequest(url, data => {
          resolve(data);
        }, err => {
          reject(err);
        });
     });

     return promise;
   },

   getCurrencies(callback) {

    let promise = this._sendRequest(COINS_URL);

    promise.then(result => {
      console.log(result)
    }, err => {
      console.error('2', err);
    })

    promise.catch(err => {
      console.error(err);
    })




    // HttpService.sendRequest(COINS_URL, data => {
    //   data = data.slice(0, 10);
    //   const coinsIds = data.map(coin => coin.id);
    //   const coinsIdMap = coinsIds.reduce((acc, id) => {
    //     acc[getSingleCoinUrl(id)] = id;
    //     return acc;
    //   }, {})

    //   HttpService._sendMultipleRequests(Object.keys(coinsIdMap), coins => {
    //     const dataWithPrice = data.map(item => {
    //       let itemUrl = getSingleCoinUrl(item.id);
    //       let itemPriceData = coins.find(coin => coin.url === itemUrl).data[0];

    //       item.price = itemPriceData.close;
    //       return item;
    //     });

    //     callback(dataWithPrice);
    //   })
    // })
  },
  getCurrenciesPrices(data, callback) {
    const coinsIds = data.map(coin => coin.id);
    const coinsIdMap = coinsIds.reduce((acc, id) => {
      acc[getSingleCoinUrl(id)] = id;
      return acc;
    }, {})

    HttpService._sendMultipleRequests(Object.keys(coinsIdMap), coins => {
      const dataWithPrice = data.map(item => {
        let itemUrl = getSingleCoinUrl(item.id);
        let itemPriceData = coins.find(coin => coin.url === itemUrl).data[0];

        item.price = itemPriceData.close;
        return item;
      });

      callback(dataWithPrice);
    })

  }
}

class MyPromise {
  constructor(behaviourFunction) {
    this._result = null
    this._status = 'pending'
    this._successCallbacks = []
    this._errorCallbacks = []

    behaviourFunction(this._resolve.bind(this), this._reject.bind(this));
  }

  _resolve(data) {
    this._status = 'fulfilled';
    this._result = data;
    this._successCallbacks.forEach(callback => callback(data));
  }

  _reject(error) {
    this._status = 'rejected';
    this._result = error;
    this._errorCallbacks.forEach(callback => callback(error));
  }

  then(successCallback, errorCallback) {
    if (this._status === 'fulfilled') { 
      successCallback(this._result);
    } else if (this._status === 'rejected') { 
      errorCallback(this._result);
    } else {
      this._successCallbacks.push(successCallback);
      this._errorCallbacks.push(errorCallback);
    }
  }

  catch(errorCallback) {
    if (this._status === 'rejected') { 
      errorCallback(this._result);
    } else {
      this._errorCallbacks.push(errorCallback);
    }
  }
};

export default DataService;