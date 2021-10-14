"use strict";

const ImergoClass = require("imergo-om-base").ImergoClass;
const SensorReadingEvent = require('./SensorReadingEvent');
const SensorState = require('./SensorState');

module.exports = class Sensor extends ImergoClass {
    constructor(config)
    {
        super(config);
    }

    initDefaults()
    {
        super.initDefaults();
        this._frequency = 5000;
        this._state = SensorState.IDLE;
        this._reading = null;
        this._onerror = () => { };
        this._onchange = () => { };
        this._onstatechange = () => { };
    }

    get frequency()
    {
        return this._frequency;
    }

    set frequency(value)
    {
        this._frequency = value;
    }

    get state()
    {
        return this._state;
    }

    set state(value)
    {
        this._state = value;
    }

    get reading()
    {
        return this._reading;
    }

    set reading(value)
    {
        this._reading = value;
        if (this.state === SensorState.ACTIVE) {
            this.onchange(new SensorReadingEvent({
                reading: this.reading
            }));
        }
    }

    get onerror()
    {
        return this._onerror;
    }

    set onerror(fun)
    {
        if(typeof fun !== "function")
        {
            throw new TypeError(`${fun} is not an EventHandler function.`)
        }
        this._onerror = fun;
    }

    get onchange()
    {
        return this._onchange;
    }

    set onchange(fun)
    {
        if(typeof fun !== "function")
        {
            throw new TypeError(`${fun} is not an EventHandler function.`)
        }
        this._onchange = fun;
    }

    get onstatechange()
    {
        return this._onstatechange;
    }

    set onstatechange(fun)
    {
        if(typeof fun !== "function")
        {
            throw new TypeError(`${fun} is not an EventHandler function.`)
        }
        this._onstatechange = fun;
    }

    start()
    {
        return new Promise((resolve, reject) =>
        {
            this.state = SensorState.ACTIVE;
            resolve();
        });
    }

    stop()
    {
        return new Promise((resolve, reject) =>
        {
            this.state = SensorState.IDLE;
            resolve();
        });
    }
};
