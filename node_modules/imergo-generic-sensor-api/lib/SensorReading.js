"use strict";

const ImergoClass = require("imergo-om-base").ImergoClass;

module.exports = class SensorReading extends ImergoClass {
    constructor(config)
    {
        super(config);
    }

    initDefaults()
    {
        super.initDefaults();
        this._timestamp = Date.now();
    }

    get timestamp()
    {
        return this._timestamp;
    }

    set timestamp(value)
    {
        this._timestamp = value;
    }
};
