const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const databaseName = 'test';
beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true });
});

const user = {
  email: 'user@test.com',
  password: 'usertest',
};

const badUser = {
  email: 'user@test.com',
};

describe('GET /auth', () => {
  it('Should return a token', (done) => {
    request(app)
      .post('/auth')
      .send(user)
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(typeof res.body).toBe('object');
        // eslint-disable-next-line no-prototype-builtins
        expect(res.body.hasOwnProperty('token')).toBe(true);
        done();
      });
  });
  it('If email or password is not indicated, it should fail with status 400', (done) => {
    request(app)
      .post('/auth')
      .send(badUser)
      .set('Accept', 'application/json')
      .expect({ message: 'You didn´t enter email or password' })
      .expect(400, done);
  });
  it('If user not found, it should fail with status 404', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'fakeuser@gmail.com', password: 'password' })
      .set('Accept', 'application/json')
      .expect({ mesagge: 'user not found' })
      .expect(404, done);
  });
  it('If the password does not match, it should fail with status 404', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'user@test.com', password: 'fakepassword' })
      .set('Accept', 'application/json')
      .expect({ token: null, message: 'Invalid password' })
      .expect(401, done);
  });
});
