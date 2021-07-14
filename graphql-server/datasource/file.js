const customers = require('./customer.json');
const {DataSource} = require('apollo-datasource');
const _ = require('lodash');
class CustomerService extends DataSource{
    constructor(){super()}
    initialize(config){}
    getCustomers(){
        return customers;
    }
    getCustomerById(id){  
        return customers.
        filter((customer)=>customer.id == id)[0];
    }
    filterCustomers(args){
        return _.filter(customers, args);
    }
}
module.exports = CustomerService