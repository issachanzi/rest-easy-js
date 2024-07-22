import ModelInstance from './ModelInstance.js';

export default class Model {
    constructor (restEasy, modelName, schema) {
        this.restEasy = restEasy;
        this.modelName = modelName;
        this.schema = schema;

        init (schema);
    }

    async byId (id) {
        let data = await this.restEasy.get (this.modelName);
        let modelInstance = new ModelInstance (this, data);

        return modelInstance;
    }

    async where (query) {
        let data = await this.restEasy.get (this.modelName, undefined, query);
        let modelInstances = data.map (d => new ModelInstance (this, d));

        return modelInstances;
    }

    getModel () {
        // TODO
    }


}

