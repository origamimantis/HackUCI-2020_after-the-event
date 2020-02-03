'use strict';

import { StateManager } from './StateManager.js';
import { CanvasControl } from './CanvasControl.js';
import { Pointer } from './Pointer.js';

let accel_enabled = false;


class ToggleButton extends React.Component {
	constructor(props) {
		super(props);
		this.variants = {}
		this.variants[StateManager.CURSOR] = {
			mode: StateManager.GYRO,
			text: "Cursor"
		}
		this.variants[StateManager.GYRO] = {
			mode: StateManager.CURSOR,
			text: "Gyro"
		}
		this.variants[StateManager.PAN] = {
			mode: StateManager.CURSOR,
			text: "Pan"
		}

		this.stateSwitchEvent = new CustomEvent("stateSwitch", {detail: {state: StateManager.CURSOR}});
	}

	render() {
		let variant = this.variants[StateManager.getDrawMode()];

		return (
			<button className="bg-blue-500 m-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
				StateManager.setDrawMode(variant.mode);
				this.setState({ changed: true });
				document.querySelector("body").style.cursor = "default";
				if (variant.mode == StateManager.GYRO) {
					Pointer.show();
				} else {
					Pointer.hide();
				}
				this.stateSwitchEvent.detail.state = variant.mode;
				document.dispatchEvent(this.stateSwitchEvent);
			}}>
				{"Current mode: "  + ((variant.text == "Gyro" ) ? "Pointer" : variant.text)}
			</button>
		);	
	}
}

class IDField extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: "",
		}
	
		document.addEventListener("onServConn", (e) => {
			this.setState({id: e.detail.id});	
		});
	}

	render() {
		return (
			<h1 className = "mx-2 font-sans">Your id is: <span className = "font-bold"> {this.state.id}</span> </h1>
		);
	}
}

class PairForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {value: ''};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.pairEvent = new CustomEvent('pairRequest', { detail: {id: "000000"} })
		
	}
	
	handleChange(event) {
		this.setState({value: event.target.value});
	}
	
	handleSubmit(event) {
		event.preventDefault();
		this.pairEvent.detail.id = this.state.value;
		document.dispatchEvent(this.pairEvent);
		CanvasControl.clearCanvas();
	}


	render() {
		return (
			<form id = "pairform" onSubmit={this.handleSubmit}>
				<input key = "1" name="id" type="text" className="input_boxes m-2" value ={this.state.value} onChange={this.handleChange}></input>
				<input key = "2" type="submit" className="bg-blue-500 m-2 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" value="Pair"></input>
			</form>
		);
	}
}

class ClearButton extends React.Component {
	constructor(props){ 
		super(props);
		this.clearEvent = new Event("clearCanvas");
	} 

	render() {
		return (
			<button className="bg-blue-500 m-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
				CanvasControl.clearCanvas();
				document.dispatchEvent(this.clearEvent);
			}}>
				Clear
			</button>

		);
	}
}

class DownloadButton extends React.Component {
	constructor(props){
		super(props);
	}

	render() {
		return (
			<button className="bg-blue-500 m-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
				let canvas  = CanvasControl.getHTMLCanvas()
				var gh = canvas.toDataURL('png');
				var link = document.createElement('a');
				link.download = 'filename.png';
				link.href =  gh;
				link.click();
			}}>	
				Download
			</button>
		);
	}
}

class CopyButton extends React.Component {
        constructor(props){
                super(props);
		this.state = {
			buttonText:"Copy"
		};
        }

        render() {
                return (
                        <button className="bg-blue-500 m-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline" onClick={() => {
				let canvas  = CanvasControl.getHTMLCanvas();
				canvas.toBlob((blob) => {
					try {
						navigator.clipboard.write([new ClipboardItem({'image/png': blob})]);
					} catch (error) {

						console.log("westley");
						this.setState({
							buttonText: "Chrome only"	
						});
					}
				});
                        }}>
				{this.state.buttonText}	
                        </button>
                );
        }
}

class ReorientButton extends React.Component {
	constructor(props){
                super(props);
		this.recalibrateEvent = new Event('recalibrate');
        }

        render() {
                return (
                        <button className="bg-blue-500 m-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
				document.dispatchEvent(this.recalibrateEvent);
			}}>
                                Recalibrate Pointer
                        </button>
                );
	}
}

class RainbowShit extends React.Component {
	constructor(props){
                super(props);
		this.state = {
			value: "✔#000000"
		}
		this.handleChange = this.handleChange.bind(this);
	}        
	
	handleChange(event) {
		let color = event.target.value.substring(1)
		let colorValidation = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
		let valid = colorValidation.test(color);
		if (valid) {
			this.setState({value: "✔" + color});
			CanvasControl.setDrawColor(color);
		} else {
			this.setState({value: "❌" + color});
		}
	}

	render() {
		return (
			<input type="text" className="mx-2 text-black font-bold py-2 px-4 rounded" value ={this.state.value} onChange={this.handleChange}></input>
		);
	}
}

class ThiccOMeter extends React.Component {
	constructor(props){
                super(props);
		this.state = {
			value: 1
		}
		this.handleChange = this.handleChange.bind(this);
	}        
	
	handleChange(event) {
		this.setState({value: event.target.value});
		CanvasControl.setThickness(event.target.value);
	}

	render() {
		return (
		<label>{this.state.value + "px: "}
			<input type="range" min="1" max="100" value={this.state.value} onChange = {this.handleChange}></input>
		</label>
		);
	}
}

const domContainer = document.querySelector('#root');
ReactDOM.render([<ToggleButton />, <ClearButton />, <DownloadButton />, <CopyButton />, <ReorientButton />, <RainbowShit />, <ThiccOMeter />, <IDField />, <PairForm />], domContainer);
