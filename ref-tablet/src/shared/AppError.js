class AppError {

	constructor(status, code, url) {
		this._status = status;
		this._code = code;
		this._url = url;
	}

	get status() {
		return this._status;
	}

	set status(value) {
		this._status = value;
	}

	get code() {
		return this._code;
	}

	set code(value) {
		this._code = value;
	}

	get url() {
		return this._url;
	}

	set url(value) {
		this._url = value;
	}
}

export default AppError;