import { createClient } from 'redis'
import { createSubject } from 'create-subject-with-filter'

export const getClient = ({
	type,
	clients
}) => {
	return {
		connect: () => new Promise(resolve => {
			if (!clients[type]) {
				console.log('Creating new client')
				setClient({
					type,
					clients,
					client: createClient({
						retry_strategy: function (options) {
							console.log('options', options)
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
						host: process.env[2] === 'dev' ? '127.0.0.1' : 'main.local',
						port: 6379
					})
				})
			}
			return resolve(clients[type])
		})
	}
}

export const setClient = ({ type, client, clients }) => clients[type] = client

export const redis = (
	clients = {}
) => {
	return {
		publisherCreator: () => new Promise(resolve => {
			const { connect } = getClient({ type: 'publisher', clients })
			return connect().then(client => {
				client.on('error', (...args) => {
					console.log('publish - error', args)
				})
				return resolve({
					publish: ({
						channel,
						data
					}) => {
						data = JSON.stringify(data)
						client.publish(channel, data)
						return resolve({
							meta: {
								type: 'published',
								timestamp: new Date().getTime()
							}
						})
					}
				})
			})
		}),
		subscriberCreator: () => new Promise(resolve => {
			const { connect } = getClient({ type: 'subscriber', clients })
			return connect().then(client => {
				const {
					subscribe: allMsgs,
					filter: filterMsgs,
					next
				} = createSubject()
		
				client.on('connect', (...args) => {
					console.log('Connected to Redis')
		
					client.on('error', (...args) => {
						console.log('subscriber - error', args)
					})
					
					client.on('message', (...args) => {
						next({
							meta: {
								type: 'message',
								timestamp: new Date().getTime()
							},
							data: args
						})
					})
		
					next({
						meta: {
							type: 'connect',
							timestamp: new Date().getTime(),
							data: args
						}
					})
				})
				return resolve({
					subscribe: ({
						channel
					}) => new Promise(resolve => {
						client.subscribe(channel)
						return resolve({
							allMsgs,
							filterMsgs
						})
					})
				})
			})
		}) 
	}
}