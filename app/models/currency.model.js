const knex = require('knex')({
    client: 'mysql',
    version: '5.7',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'root',
      password : '',
      database : 'tester'
    },
    pool:{min:0, max:5}
  });

// constructor
const Currency = function(currency) {
    this.number = currency.number;
    this.alpha3 = currency.alpha3;
    this.langEN = currency.langEN;
    this.symbol_decimal = currency.symbol_decimal;
    this.symbol_hex = currency.symbol_hex;
    this.is_active = currency.is_active;
    this.is_deleted = currency.is_deleted;
    this.timestamp = currency.timestamp;
};

//Adding a new currency
Currency.create = (newCurrency, result) => {
    //adding a currency
    async function createCurrency() {
        try {
            const rows = await knex('currency').insert(newCurrency);
            result(null, { lang: 'EN', message: 'Added Currency Successfully', success: 1, data: {...newCurrency}});
        } catch (err) {
            result(err, null);
        }
    }
    createCurrency();
}

//Getting all currency
Currency.getAll = (result) => {
    //getting all currency
    async function getAllCurrencies() {
        try {
            const currencies = await knex('currency').where({is_deleted: 0, is_active: 1}).select();
            result(null, { lang: 'EN', message: 'All currencies', success: 1, data: currencies });
        } catch (err) {
            result(err, null);
        }
    }
    getAllCurrencies();
}

//Getting currency by number
Currency.getById = (number, result) => {
    //getting currency by number
    async function getCurrencyByNumber() {
        try {
            const currency = await knex('currency').where({number: number}).select();
            result(null, { lang: 'EN', message: 'Currency', success: 1, data: currency });
        } catch (err) {
            result(err, null);
        }
    }
    getCurrencyByNumber();
}

//Update currency by number
Currency.update = (number, newCurrency, result) => {
    //updating currency
    async function updateCurrency() {
        try {
            const currency = await knex('currency').where({number: number}).update(newCurrency);
            result(null, { lang: 'EN', message: 'Currency Updated Successfully', success: 1, data: currency });
        } catch (err) {
            result(err, null);
        }
    }
    updateCurrency();
}

//Delete currency by number
Currency.delete = (number, result) => {
    //deleting currency
    async function deleteCurrency() {
        try {
            const currency = await knex('currency').where({number: number}).update(
                {
                    is_deleted: 1,
                    timestamp: new Date()
                }
            );
            result(null, { lang: 'EN', message: 'Currency Deleted Successfully', success: 1, data: currency });
        } catch (err) {
            result(err, null);
        }
    }
    deleteCurrency();
}

//Delete currency by number
Currency.toogleStatus = (number, result) => {
    //deleting currency
    async function activateOrDeactivateCurrency() {
        try {
            //checking the current status of that currency
            const check = await knex('currency').where({number: number}).select();
            //if the currency is active, then deactivate it
            if(check[0].is_active === 1) {
                const currency = await knex('currency').where({number: number}).update(
                    {
                        is_active: 0,
                        timestamp: new Date()
                    }
                );
                result(null, { lang: 'EN', message: 'Currency Deactivated Successfully', success: 1, data: currency });
            }
            //if the currency is deactive, then activate it
            else {
                const currency = await knex('currency').where({number: number}).update(
                    {
                        is_active: 1,
                        timestamp: new Date()
                    }
                );
                result(null, { lang: 'EN', message: 'Currency Activated Successfully', success: 1, data: currency });
            }
        } catch (err) {
            result(err, null);
        }
    }
    activateOrDeactivateCurrency();
}

//Active all currencies
Currency.activate = (result) => {
    //deleting currency
    async function activateCurrencies() {
        try {
            const currency = await knex('currency').update(
                {
                    is_active: 1,
                    timestamp: new Date()
                }
            );
            result(null, { lang: 'EN', message: 'All currencies activated', success: 1});
        } catch (err) {
            result(err, null);
        }
    }
    activateCurrencies();
}

//Deactive all currencies
Currency.deactivate = (result) => {
    //deleting currency
    async function deactivateCurrencies() {
        try {
            const currency = await knex('currency').update(
                {
                    is_active: 0,
                    timestamp: new Date()
                }
            );
            result(null, { lang: 'EN', message: 'All currencies deactivated', success: 1});
        } catch (err) {
            result(err, null);
        }
    }
    deactivateCurrencies();
}

module.exports = Currency;