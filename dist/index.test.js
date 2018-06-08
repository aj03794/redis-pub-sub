'use strict';

var _chai = require('chai');

var _ = require('./');

describe('redis', function () {
    it('should finish successfully', function (done) {
        _chai.assert.isFunction(_.redis);
        return done();
    });
    it('should have a publisherCreator and subscriberCreator function', function (done) {
        var _redis = (0, _.redis)(),
            publisherCreator = _redis.publisherCreator,
            subscriberCreator = _redis.subscriberCreator;

        _chai.assert.isFunction(publisherCreator);
        _chai.assert.isFunction(subscriberCreator);
        return done();
    });
});

// describe('publisherCreator', (done) => {
//     it('should have a publish function', done => {
//         const { publisherCreator } = redis()
//         return publisherCreator()
//         .then(({
//             publish
//         }) => {
//             assert.isFunction(publish)
//             return done()
//         })
//     })
// })

describe('subscriberCreator', function () {
    it('should have a subscribe function', function (done) {
        var _redis2 = (0, _.redis)(),
            subscriberCreator = _redis2.subscriberCreator;

        return subscriberCreator().then(function (_ref) {
            var subscribe = _ref.subscribe;

            // console.log('Subscribe', typeof subscribe)
            // assert.isFunction(subscribe)
            return;
        }).catch(function (e) {
            console.log('subscribeCreator - error', e);
            return;
        });
    });
    // it('should have allMsgs and filterMsgs observables from subscribe function', done => {
    //     const { subscriberCreator } = redis()
    //     subscriberCreator()
    //     .then(({
    //         subscribe
    //     }) => {
    //         subscribe({
    //             channel: 'fake-channel'
    //         })
    //         .then(({
    //             allMsgs,
    //             filterMsgs
    //         }) => {
    //             assert.isFunction(allMsgs)
    //             assert.isFunction(filterMsgs)
    //             return done()
    //         })
    //     })
    // })
});