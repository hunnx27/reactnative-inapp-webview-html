(function(){

	var promiseChain = Promise.resolve();

	var callbacks = {};
	var callbacks2 = {};

	var init = function() {

		const guid = function() {
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			}
			return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
		}

		window.webViewBridge = {
			/**
			 * send message to the React-Native WebView onMessage handler
			 * @param targetFunc - name of the function to invoke on the React-Native side
			 * @param data - data to pass
			 * @param success - success callback
			 * @param error - error callback
			 */
			send: function(targetFunc, data, success, error) {

				var msgObj = {
					targetFunc: targetFunc,
					data: data || {}
				};

				if (success || error) {
					msgObj.msgId = guid();
				}

				var msg = JSON.stringify(msgObj);
				promiseChain = promiseChain.then(function () {
					return new Promise(async function (resolve, reject) {
						const aaa = guid();
						var suc2 = success;
						callbacks2[msgObj.msgId] = {
							onsuccess: success,
							onerror: error,
							hello:'hihihi2'
						};
						console.log(success.toString());
						if (msgObj.msgId) {
							callbacks[msgObj.msgId] = {
								onsuccess: success,
								onerror: error,
								hello:'hihihi2'
							};
							console.log('callbacks : ');
							console.log(callbacks)
							console.log('in if');
						}
						console.log('after if');
						console.log(msg)
						window.ReactNativeWebView.postMessage(msg);
						resolve();
					})
				}).catch(function (e) {
					console.error('rnBridge send failed ' + e.message);
				});
			},

		}

        const setMessage = (data) =>{
			console.log('##SETMESSAGE WEB');
            console.log(data);
            document.getElementById("txt").innerHTML = data;
        };

		document.addEventListener('message', function(e) {
			console.log('##SETMESSAGE event EMSSAGE LISTEN!');
			console.log("message received from react native");

			var message;
            setMessage('message : ' + e.data);
        
			try {
				message = JSON.parse(e.data)
			}
			catch(err) {
				console.error("failed to parse message from react-native " + err);
				return;
			}

			console.log('####################')
			console.log(message.args);
			console.log(callbacks);
			console.log(message.isSuccessfull)
			console.log('####################')
			//trigger callback
			if (message.args && callbacks[message.msgId]) {
				console.log('####TRIGGER');
				if (message.isSuccessfull) {
					console.log('##########success');
					console.log(message.msgId)
					console.log(message.args)
					callbacks[message.msgId].onsuccess.apply(null, eval(message.args));
				}
				else {
					callbacks[message.msgId].onerror.apply(null, eval(message.args));
				}
				delete callbacks[message.msgId];
			}

		});
	};

	init();
}());