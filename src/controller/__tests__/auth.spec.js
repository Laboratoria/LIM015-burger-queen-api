const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const databaseName = 'test';
beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true });
});

const user = {
  email: 'usertest@gmail.com',
  password: 'usertest',
};

const badUser = {
  email: 'usertest@gmail.com',
};

describe('GET /products', () => {
  it('Should return a token', (done) => {
    request(app)
      .post('/auth')
      .send(user)
      .set('Accept', 'application/json')
      .expect(200, done);
  });
  it('If email or price is not indicated, it should fail with status 400', (done) => {
    request(app)
      .post('/auth')
      .send(badUser)
      .set('Accept', 'application/json')
    //   .expect({ message: 'You didn´t enter email or password' })
      .expect(400, done);
  });
});
