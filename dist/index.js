'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.redis = exports.setClient = exports.getClient = undefined;

var _redis = require('redis');

var _createSubjectWithFilter = require('create-subject-with-filter');

var getClient = exports.getClient = function getClient(_ref) {
	var type = _ref.type,
	    clients = _ref.clients;

	return {
		connect: function connect() {
			return new Promise(function (resolve) {
				if (!clients[type]) {
					console.log('Creating new client');
					setClient({
						type: type,
						clients: clients,
						client: (0, _redis.createClient)({
							retry_strategy: function retry_strategy(options) {
								console.log('options', options);
								if (options.error && options.error.code === 'ECONNREFUSED') {
									// End reconnecting on a specific error and flush all commands with
									// a individual error
									if (options.attempt >= 20) {
										// End reconnecting with built in error
										return undefined;
									}
									return Math.min(options.attempt * 100, 5000);
								}
								// reconnect after
								return Math.min(options.attempt * 100, 5000);
							},
							host: process.env.IP_ADDRESS || '127.0.0.1',
							port: 6379
						})
					});
				}
				return resolve(clients[type]);
			});
		}
	};
};

var setClient = exports.setClient = function setClient(_ref2) {
	var type = _ref2.type,
	    client = _ref2.client,
	    clients = _ref2.clients;
	return clients[type] = client;
};

var redis = exports.redis = function redis() {
	var clients = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	return {
		publisherCreator: function publisherCreator() {
			return new Promise(function (resolve) {
				var _getClient = getClient({ type: 'publisher', clients: clients }),
				    connect = _getClient.connect;

				return connect().then(function (client) {
					client.on('error', function () {
						for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
							args[_key] = arguments[_key];
						}

						console.log('publish - error', args);
					});
					return resolve({
						publish: function publish(_ref3) {
							var channel = _ref3.channel,
							    data = _ref3.data;

							data = JSON.stringify(data);
							client.publish(channel, data);
							return resolve({
								meta: {
									type: 'published',
									timestamp: new Date().getTime()
								}
							});
						}
					});
				});
			});
		},
		subscriberCreator: function subscriberCreator() {
			return new Promise(function (resolve) {
				var _getClient2 = getClient({ type: 'subscriber', clients: clients }),
				    connect = _getClient2.connect;

				return connect().then(function (client) {
					var _createSubject = (0, _createSubjectWithFilter.createSubject)(),
					    allMsgs = _createSubject.subscribe,
					    filterMsgs = _createSubject.filter,
					    next = _createSubject.next;

					client.on('connect', function () {
						for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
							args[_key2] = arguments[_key2];
						}

						console.log('Connected to Redis');

						client.on('error', function () {
							for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
								args[_key3] = arguments[_key3];
							}

							console.log('subscriber - error', args);
						});

						client.on('message', function () {
							for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
								args[_key4] = arguments[_key4];
							}

							next({
								meta: {
									type: 'message',
									timestamp: new Date().getTime()
								},
								data: args
							});
						});

						next({
							meta: {
								type: 'connect',
								timestamp: new Date().getTime(),
								data: args
							}
						});
					});
					return resolve({
						subscribe: function subscribe(_ref4) {
							var channel = _ref4.channel;
							return new Promise(function (resolve) {
								client.subscribe(channel);
								return resolve({
									allMsgs: allMsgs,
									filterMsgs: filterMsgs
								});
							});
						}
					});
				});
			});
		}
	};
};