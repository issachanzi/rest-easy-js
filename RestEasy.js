import Model from './Model.js';
import ModelInstance from './ModelInstance.js';

export default class RestEasy {
    constructor (schema, apiBaseUrl) {
        this.schema = schema;
        this.apiBaseUrl = apiBaseUrl;
        this.authorization = null;

        if(! apiBaseUrl.endsWith ('/')) {
            this.apiBaseUrl += '/';
        }

        this.model = Object.keys (schema).map (this.getModel);
    }

    getModel (modelName) {
        // Use prototype syntax to dynamically create model classes for each
        // model class in the schema.

        let schema = this.schema [modelName];
        let model = new Model (this, modelName, schema);

        // Define constructor
        let result = new function (modelInstance) {
            if (modelInstance != undefined) {
                this.modelInstance = modelInstance;
            }
            else {
                this.modelInstance = new ModelInstance (model, {});
            }
        };

        // Define static byId method
        result.byId = async function (id) {
            new result (await model.byId (id));
        }
        // TODO

        // Define static where method
        result.where = async function (query) {
            let modelInstances = await model.where (query);

            return modelInstances.map (
                modelInstance => new result (modelInstance)
            );
        }

        // Define save method
        // Use prototype to define instance method
        result.prototype.save = async function () {
            await this.modelInstance.save ();
        }

        // getters 'n' setters
        Object.keys (schema).forEach (schemaField => {
            Object.defineProperty (result.prototype, schemaField, {
                enumerable: true,
                get: async function () {
                    return this.modelInstance.getField (schemaField);
                },
                set: function (value) {
                    this.modelInstance.setField (schemaField, value);
                }
            });
        });
    }

    async get (modelName, id, query) {
        let url = this.apiBaseUrl + modelName;
        if (id != undefined) {
            url += '/' + id;
        }
        if (query != undefined) {
            url += queryString (query);
        }

        return this.sendRequest (url, 'GET');
    }

    async post (modelName, body) {
        let url = this.apiBaseUrl + modelName;

        return this.sendRequest (modelName, 'POST', body);

    }

    async put (modelName, id, body) {
        let url = this.apiBaseUrl + modelName + '/' + id;

        return this.sendRequest (url, 'PUT', body);
    }

    async delete (modelName, id) {
        let url = this.apiBaseUrl + modelName + '/' + id;

        return this.sendRequest (url, 'DELETE');
    }


    async sendRequest (url, method, body) {
        let headers = {
            method: method,
            Authorization : this.authorization
        };
        let options = {
            headers: headers
        };

        if (body != undefined) {
            options.body = JSON.stringify (body);
        }

        let response = await fetch (url, options);

        return response.json ();
    }
}

