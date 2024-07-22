
export default class ModelInstance {
    constructor (model, data) {
        this.restEasy = model.restEasy;
        this.model = model;
        this.data = data;
    }

    async getField (fieldName) {
        let fieldType = this.model.schema [fieldName];

        if (fieldType !== null) {
            let model = this.restEasy.getModel (fieldType);
            let id = this.data [fieldName];

            return model.byId (id);
        }
        else {
            return fieldValue = this.data [fieldName];
        }
    }

    setField (fieldName, value) {
        let fieldType = this.model.schema [fieldName];

        if (fieldType !== null) {
            this.data [fieldName] = value.id;
        }
        else {
            this.data [fieldName] = value;
        }
    }

    async save () {
        if (this.data.id == undefined) {
            let response = await this.restEasy.post (this.modelName, this.data);

            this.data = response;
        }
        else {
            await this.restEasy.put (this.modelName, this.data.id, this.data);
        }
    }
}

