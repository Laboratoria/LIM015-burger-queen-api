const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');

const databaseName = 'test';

beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true });
});

describe('POST /auth', () => {
  it('Should respond 400 for empty body', (done) => {
    request(app)
      .post('/auth')
      .send({})
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual('Ingrese password y/o contraseña');
        done();
      });
  });

  it('Should 404 if the user does not exist', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'holy@mail.com', password: 'Password$1' })
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual('user not found');
        done();
      });
  });

  it('Should respond 404 for invalid password', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$12345' })
      .expect(404, done);
  });

  it('Should respond 200 and return a token', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .expect(200)
      .then((res) => {
        expect(typeof res.body.token).toBe('string');
        done();
      });
  });
});
