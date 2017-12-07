process.env.NODE_ENV = 'test';
const assert = require('assert');
const mongoose = require('mongoose');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

const Event = require('../model/event.model');
const Player = require('../model/player.model');

chai.use(chaiHttp);

let testId;


describe('Remove all Events from the database', () => {
    Event.remove({})
        .then(() => {
            eventList.save()
                .then(() => {
                    done();
                })
        })
});

describe('/GET event', () => {
    it('Get all events from the list', (done) => {
        chai.request(server)
            .get('/api/event')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            })
    });

});


describe('/POST event', () => {
    it('Post an event', (done) => {
        let event = {
            "pokemonName": "Pikachu",
            "time": "2017-12-06T19:00:00.000Z",
            "pastDate": "2017-12-06T19:00:00.000Z",
            "player": [],
            "gymName": "Goldenrod",
            "gymColor": "Blauw"
        };
        chai.request(server)
            .post('/api/event')
            .send(event)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('pokemonName');
                res.body.gym[0].should.have.property('gymName');
                res.body.gym[0].should.have.property('gymColor');
                res.body.should.have.property('time');
                res.body.should.have.property('pastDate');
                testId = res.body._id
                done();
            });
    });
});

describe('/GET/:id event', () => {
    it('Get a book by the given id', (done) => {


        chai.request(server)
            .get('/api/event/' + testId)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.a('object');
                res.body.should.have.property('pokemonName');
                res.body.gym[0].should.have.property('gymName');
                res.body.gym[0].should.have.property('gymColor');
                res.body.should.have.property('time');
                res.body.should.have.property('pastDate');
                res.body.should.have.property('_id').eql(testId);
                done();
            })
    });

});

describe('/PUT/:id event', () => {
    it('it should update an event by given id', (done) => {
        let eventUpdate = {
            "pokemonName": "Pikachu update",
            "time": "2017-12-06T19:00:00.000Z",
            "pastDate": "2017-12-06T19:00:00.000Z",
            "player": [],
            "gym": [{
                "gymName": "Goldenrod",
                "gymColor": "Rood"
            }]
        };

        chai.request(server)
            .put('/api/event/' + testId)
            .send(eventUpdate)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('pokemonName').eql('Pikachu');
                res.body.gym[0].should.have.property('gymColor').eql('Blauw');
                done();

            })
    })
});
describe('/DELETE/:id event', () => {
    it('Delete event by the given id', (done) => {

        chai.request(server)
            .delete('/api/event/' + testId)
            .end((err, res) => {
                console.log(res.body)
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();

            })
    })
});