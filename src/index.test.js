// import { assert } from 'chai'
// import { redis, createClient, setClient } from './'

// describe('redis', () => {
//     it('should finish successfully', done => {
//         assert.isFunction(redis)
//         return done()
//     })
//     it('should have a publisherCreator and subscriberCreator function', done => {
//         const { publisherCreator, subscriberCreator } = redis()
//         assert.isFunction(publisherCreator)
//         assert.isFunction(subscriberCreator)
//         return done()
//     })
// })

// // describe('publisherCreator', (done) => {
// //     it('should have a publish function', done => {
// //         const { publisherCreator } = redis()
// //         return publisherCreator()
// //         .then(({
// //             publish
// //         }) => {
// //             assert.isFunction(publish)
// //             return done()
// //         })
// //     })
// // })

// describe('subscriberCreator', () => {
//     it('should have a subscribe function', done => {
//         const { subscriberCreator } = redis()
//         return subscriberCreator()
//         // .then(({
//         //     subscribe
//         // }) => {
//         //     // console.log('Subscribe', typeof subscribe)
//         //     // assert.isFunction(subscribe)
//         //     return
//         // })
//         .catch(e => {
//             console.log('subscribeCreator - error', e)
//             return
//         })
//     })
//     // it('should have allMsgs and filterMsgs observables from subscribe function', done => {
//     //     const { subscriberCreator } = redis()
//     //     subscriberCreator()
//     //     .then(({
//     //         subscribe
//     //     }) => {
//     //         subscribe({
//     //             channel: 'fake-channel'
//     //         })
//     //         .then(({
//     //             allMsgs,
//     //             filterMsgs
//     //         }) => {
//     //             assert.isFunction(allMsgs)
//     //             assert.isFunction(filterMsgs)
//     //             return done()
//     //         })
//     //     })
//     // })
// })
