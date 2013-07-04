function Notifications(servicesUrl) {

	var _servicesUrl = servicesUrl;
	var _socket = $.atmosphere;
	var _subscribedSocket = null;

	function _subscribe() {
		var request = new $.atmosphere.AtmosphereRequest();
		request.url = _servicesUrl + "notifications";
		request.contentType = "application/json";
		request.transport = "websocket";
		request.fallbackTransport = "long-polling";
		request.trackMessageLength = true;
		request.enableXDR = true;
		request.withCredentials = true;
		request.readResponsesHeaders = false;

		// From org.atmosphere.cpr.CometSupport.maxInactiveActivity in web.xml
		var timeoutMillis = 10000;
		request.maxReconnectOnClose = 8 * 60 * 60 * 1000 / timeoutMillis;

		request.onMessage = function(response) {
			if (response.status == 200) {
				var data = response.responseBody;
				if (data.length > 0) {
					try {
						var json = JSON.parse(data);
					} catch (e) {
						console.log("Push notification error", response, e);
						return;
					}
					console.log(json);
				} else {
					console.log("Empty or negative sized push notification response", response);
				}
			} else {
				console.log("Push notification HTTP response was not 200/OK", response);
			}
		};

		request.onError = function(response) {
			console.log(response);
		};

		request.onClose = function(response) {
			console.log(response);
		};

		request.onReconnect = function(request, response) {
			console.log(request, response);
		};

		request.onTransportFailure = function(errorMessage, request) {
			console.log(errorMessage, request);
		};

		_subscribedSocket = _socket.subscribe(request);
	}

	function _unsubscribe() {
		if (_subscribedSocket) {
			_socket.unsubscribe();
			_subscribedSocket = null;
		}
	}

	this.connect = function() {
		_subscribe();
	};

	this.disconnect = function() {
		_unsubscribe();
	};

}
