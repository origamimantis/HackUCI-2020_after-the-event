"use strict";
const ImergoClass = require("imergo-om-base").ImergoClass;

module.exports = class SensorReadingEvent extends ImergoClass {
    constructor(config)
    {
        super(config);
    }

    initDefaults()
    {
        super.initDefaults();
        this._reading = null;
    }

    get reading()
    {
        return this._reading;
    }

    set reading(value)
    {
        this._reading = value;
    }
};
