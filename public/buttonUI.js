'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { StateManager } from './StateManager.js';
import { CanvasControl } from './CanvasControl.js';
import { Pointer } from './Pointer.js';

var accel_enabled = false;

var ToggleButton = function (_React$Component) {
	_inherits(ToggleButton, _React$Component);

	function ToggleButton(props) {
		_classCallCheck(this, ToggleButton);

		var _this = _possibleConstructorReturn(this, (ToggleButton.__proto__ || Object.getPrototypeOf(ToggleButton)).call(this, props));

		_this.variants = {};
		_this.variants[StateManager.CURSOR] = {
			mode: StateManager.GYRO,
			text: "Cursor"
		};
		_this.variants[StateManager.GYRO] = {
			mode: StateManager.CURSOR,
			text: "Gyro"
		};
		_this.variants[StateManager.PAN] = {
			mode: StateManager.CURSOR,
			text: "Pan"
		};

		_this.stateSwitchEvent = new CustomEvent("stateSwitch", { detail: { state: StateManager.CURSOR } });
		return _this;
	}

	_createClass(ToggleButton, [{
		key: 'render',
		value: function render() {
			var _this2 = this;

			var variant = this.variants[StateManager.getDrawMode()];

			return React.createElement(
				'button',
				{ className: 'bg-blue-500 m-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: function onClick() {
						StateManager.setDrawMode(variant.mode);
						_this2.setState({ changed: true });
						document.querySelector("body").style.cursor = "default";
						if (variant.mode == StateManager.GYRO) {
							Pointer.show();
						} else {
							Pointer.hide();
						}
						_this2.stateSwitchEvent.detail.state = variant.mode;
						document.dispatchEvent(_this2.stateSwitchEvent);
					} },
				"Current mode: "  + ((variant.text == "Gyro" ) ? "Pointer" : variant.text)
			);
		}
	}]);

	return ToggleButton;
}(React.Component);

var IDField = function (_React$Component2) {
	_inherits(IDField, _React$Component2);

	function IDField(props) {
		_classCallCheck(this, IDField);

		var _this3 = _possibleConstructorReturn(this, (IDField.__proto__ || Object.getPrototypeOf(IDField)).call(this, props));

		_this3.state = {
			id: ""
		};

		document.addEventListener("onServConn", function (e) {
			_this3.setState({ id: e.detail.id });
		});
		return _this3;
	}

	_createClass(IDField, [{
		key: 'render',
		value: function render() {
			return React.createElement(
				'h1',
				{ className: 'mx-2 font-sans' },
				'Your id is: ',
				React.createElement(
					'span',
					{ className: 'font-bold' },
					' ',
					this.state.id
				),
				' '
			);
		}
	}]);

	return IDField;
}(React.Component);

var PairForm = function (_React$Component3) {
	_inherits(PairForm, _React$Component3);

	function PairForm(props) {
		_classCallCheck(this, PairForm);

		var _this4 = _possibleConstructorReturn(this, (PairForm.__proto__ || Object.getPrototypeOf(PairForm)).call(this, props));

		_this4.state = { value: '' };
		_this4.handleChange = _this4.handleChange.bind(_this4);
		_this4.handleSubmit = _this4.handleSubmit.bind(_this4);

		_this4.pairEvent = new CustomEvent('pairRequest', { detail: { id: "000000" } });

		return _this4;
	}

	_createClass(PairForm, [{
		key: 'handleChange',
		value: function handleChange(event) {
			this.setState({ value: event.target.value });
		}
	}, {
		key: 'handleSubmit',
		value: function handleSubmit(event) {
			event.preventDefault();
			this.pairEvent.detail.id = this.state.value;
			document.dispatchEvent(this.pairEvent);
			CanvasControl.clearCanvas();
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'form',
				{ id: 'pairform', onSubmit: this.handleSubmit },
				React.createElement('input', { key: '1', name: 'id', type: 'text', className: 'input_boxes m-2', value: this.state.value, onChange: this.handleChange }),
				React.createElement('input', { key: '2', type: 'submit', className: 'bg-blue-500 m-2 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded', value: 'Pair' })
			);
		}
	}]);

	return PairForm;
}(React.Component);

var ClearButton = function (_React$Component4) {
	_inherits(ClearButton, _React$Component4);

	function ClearButton(props) {
		_classCallCheck(this, ClearButton);

		var _this5 = _possibleConstructorReturn(this, (ClearButton.__proto__ || Object.getPrototypeOf(ClearButton)).call(this, props));

		_this5.clearEvent = new Event("clearCanvas");
		return _this5;
	}

	_createClass(ClearButton, [{
		key: 'render',
		value: function render() {
			var _this6 = this;

			return React.createElement(
				'button',
				{ className: 'bg-blue-500 m-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: function onClick() {
						CanvasControl.clearCanvas();
						document.dispatchEvent(_this6.clearEvent);
					} },
				'Clear'
			);
		}
	}]);

	return ClearButton;
}(React.Component);

var DownloadButton = function (_React$Component5) {
	_inherits(DownloadButton, _React$Component5);

	function DownloadButton(props) {
		_classCallCheck(this, DownloadButton);

		return _possibleConstructorReturn(this, (DownloadButton.__proto__ || Object.getPrototypeOf(DownloadButton)).call(this, props));
	}

	_createClass(DownloadButton, [{
		key: 'render',
		value: function render() {
			return React.createElement(
				'button',
				{ className: 'bg-blue-500 m-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: function onClick() {
						var canvas = CanvasControl.getHTMLCanvas();
						var gh = canvas.toDataURL('png');
						var link = document.createElement('a');
						link.download = 'filename.png';
						link.href = gh;
						link.click();
					} },
				'Download'
			);
		}
	}]);

	return DownloadButton;
}(React.Component);

var CopyButton = function (_React$Component6) {
	_inherits(CopyButton, _React$Component6);

	function CopyButton(props) {
		_classCallCheck(this, CopyButton);

		var _this8 = _possibleConstructorReturn(this, (CopyButton.__proto__ || Object.getPrototypeOf(CopyButton)).call(this, props));

		_this8.state = {
			buttonText: "Copy"
		};
		return _this8;
	}

	_createClass(CopyButton, [{
		key: 'render',
		value: function render() {
			var _this9 = this;

			return React.createElement(
				'button',
				{ className: 'bg-blue-500 m-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline', onClick: function onClick() {
						var canvas = CanvasControl.getHTMLCanvas();
						canvas.toBlob(function (blob) {
							try {
								navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
							} catch (error) {

								console.log("westley");
								_this9.setState({
									buttonText: "Chrome only"
								});
							}
						});
					} },
				this.state.buttonText
			);
		}
	}]);

	return CopyButton;
}(React.Component);

var ReorientButton = function (_React$Component7) {
	_inherits(ReorientButton, _React$Component7);

	function ReorientButton(props) {
		_classCallCheck(this, ReorientButton);

		var _this10 = _possibleConstructorReturn(this, (ReorientButton.__proto__ || Object.getPrototypeOf(ReorientButton)).call(this, props));

		_this10.recalibrateEvent = new Event('recalibrate');
		return _this10;
	}

	_createClass(ReorientButton, [{
		key: 'render',
		value: function render() {
			var _this11 = this;

			return React.createElement(
				'button',
				{ className: 'bg-blue-500 m-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: function onClick() {
						document.dispatchEvent(_this11.recalibrateEvent);
					} },
				'Recalibrate Pointer'
			);
		}
	}]);

	return ReorientButton;
}(React.Component);

var RainbowShit = function (_React$Component8) {
	_inherits(RainbowShit, _React$Component8);

	function RainbowShit(props) {
		_classCallCheck(this, RainbowShit);

		var _this12 = _possibleConstructorReturn(this, (RainbowShit.__proto__ || Object.getPrototypeOf(RainbowShit)).call(this, props));

		_this12.state = {
			value: "✔#000000"
		};
		_this12.handleChange = _this12.handleChange.bind(_this12);
		return _this12;
	}

	_createClass(RainbowShit, [{
		key: 'handleChange',
		value: function handleChange(event) {
			var color = event.target.value.substring(1);
			var colorValidation = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
			var valid = colorValidation.test(color);
			if (valid) {
				this.setState({ value: "✔" + color });
				CanvasControl.setDrawColor(color);
			} else {
				this.setState({ value: "❌" + color });
			}
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement('input', { type: 'text', className: 'mx-2 text-black font-bold py-2 px-4 rounded', value: this.state.value, onChange: this.handleChange });
		}
	}]);

	return RainbowShit;
}(React.Component);

var ThiccOMeter = function (_React$Component9) {
	_inherits(ThiccOMeter, _React$Component9);

	function ThiccOMeter(props) {
		_classCallCheck(this, ThiccOMeter);

		var _this13 = _possibleConstructorReturn(this, (ThiccOMeter.__proto__ || Object.getPrototypeOf(ThiccOMeter)).call(this, props));

		_this13.state = {
			value: 1
		};
		_this13.handleChange = _this13.handleChange.bind(_this13);
		return _this13;
	}

	_createClass(ThiccOMeter, [{
		key: 'handleChange',
		value: function handleChange(event) {
			this.setState({ value: event.target.value });
			CanvasControl.setThickness(event.target.value);
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'label',
				null,
				this.state.value + "px: ",
				React.createElement('input', { type: 'range', min: '1', max: '100', value: this.state.value, onChange: this.handleChange })
			);
		}
	}]);

	return ThiccOMeter;
}(React.Component);

var domContainer = document.querySelector('#root');
ReactDOM.render([React.createElement(ToggleButton, null), React.createElement(ClearButton, null), React.createElement(DownloadButton, null), React.createElement(CopyButton, null), React.createElement(ReorientButton, null), React.createElement(RainbowShit, null), React.createElement(ThiccOMeter, null), React.createElement(IDField, null), React.createElement(PairForm, null)], domContainer);
