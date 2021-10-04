const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const databaseName = 'test';
beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true });
});

const order = {
  userId: '6148c31997a7c8ffa3d92241',
  client: 'Sandra',
  status: 'pending',
  products: [
    {
      qty: 5,
      product: '6157de2977f7dca19e92988a',
    },
  ],
};

const invalidOrder = {
  client: 'Sandra',
  status: 'pending',
  products: [
    {
      qty: 5,
      product: '6157de2977f7dca19e92988a',
    },
  ],
};

const orderWithInvalidProduct = {
  userId: '6148c31997a7c8ffa3d92241',
  client: 'Sandra',
  status: 'pending',
  products: [
    {
      qty: 5,
      product: '6157de2977f7dca19e92988b',
    },
  ],
};

describe('GET /orders', () => {
  it('Should return all orders', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'oli@gmail.com', password: 'olioli' })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .get('/orders')
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect(200)
          .then((res) => {
            expect(res.body.length > 0).toBe(true);
            expect(Array.isArray(res.body)).toBe(true);
            done();
          });
      }));
  });
  it('If there is no auth token, it should fail with status 401', (done) => {
    request(app)
      .get('/orders')
      .set('Accept', 'application/json')
      .expect({ message: 'No token provided' })
      .expect(401, done);
  });
});

describe('GET /orders/:uid', () => {
  it('Should return an order by Id', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'oli@gmail.com', password: 'olioli' })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .get('/orders/6157deba77f7dca19e9298dc')
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect(200)
          .then((res) => {
            expect(typeof res.body).toBe('object');
            done();
          });
      }));
  });
  it('If there is no auth token, it should fail with status 401', (done) => {
    request(app)
      .get('/orders/6157deba77f7dca19e9298dc')
      .set('Accept', 'application/json')
      .expect({ message: 'No token provided' })
      .expect(401, done);
  });
  it('If id does´nt exist, it should fail with status 404', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'oli@gmail.com', password: 'olioli' })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .get('/orders/6157deba77f7dca19e9298dd')
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'The order doesn´t exist' })
          .expect(404, done);
      }));
  });
  it('If id format is invalid, it should fail with status 404', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'oli@gmail.com', password: 'olioli' })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .get('/orders/6157deba77f7dca19e9298d')
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'Id format is invalid' })
          .expect(404, done);
      }));
  });
});

describe('POST /orders', () => {
  it('Should create an order', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'oli@gmail.com', password: 'olioli' })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .post('/orders')
          .send(order)
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect(200)
          .then((res) => {
            expect(typeof res.body).toBe('object');
            done();
          });
      }));
  });
  it('If userId or products is not indicated, it should fail with status 400', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'oli@gmail.com', password: 'olioli' })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .post('/orders')
          .send(invalidOrder)
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'You don´t enter products or userId' })
          .expect(400, done);
      }));
  });
  it('If id´s product is invalid, it should fail with status 404', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'oli@gmail.com', password: 'olioli' })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .post('/orders')
          .send(orderWithInvalidProduct)
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'The product doesn´t exists' })
          .expect(404, done);
      }));
  });
  it('If there is no auth token, it should fail with status 401', (done) => {
    request(app)
      .post('/users')
      .send(order)
      .set('Accept', 'application/json')
      .expect({ message: 'No token provided' })
      .expect(401, done);
  });
});

describe('PUT /orders/uid', () => {
  it('Should update a orders by id', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'oli@gmail.com', password: 'olioli' })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .put('/orders/6157deba77f7dca19e9298dc')
          .send({ client: 'newclient' })
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect(200)
          .then((res) => {
            expect(typeof res.body).toBe('object');
            done();
          });
      }));
  });
  it('If no property to modify is indicated, it should fail with status 400', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'oli@gmail.com', password: 'olioli' })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .put('/orders/6157deba77f7dca19e9298dc')
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'You didn´t enter property to modify' })
          .expect(400, done);
      }));
  });
  it('If the "status" property is invalid, it should fail with status 400', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'oli@gmail.com', password: 'olioli' })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .put('/orders/6157deba77f7dca19e9298dc')
          .send({ status: 'invalid' })
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'The status property is invalid' })
          .expect(400, done);
      }));
  });
  it('If there is no auth token, it should fail with status 401', (done) => {
    request(app)
      .put('/orders/6157deba77f7dca19e9298dc')
      .send({ client: 'newclient' })
      .set('Accept', 'application/json')
      .expect({ message: 'No token provided' })
      .expect(401, done);
  });
  it('If id does´nt exist, it should fail with status 404', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'oli@gmail.com', password: 'olioli' })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .put('/orders/6157deba77f7dca19e9298dd')
          .send({ client: 'newclient' })
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'The order doesn´t exist' })
          .expect(404, done);
      }));
  });
  it('If id format is invalid, it should fail with status 404', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'oli@gmail.com', password: 'olioli' })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .put('/orders/6157deba77f7dca19e9298d')
          .send({ client: 'newclient' })
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'Id format is invalid' })
          .expect(404, done);
      }));
  });
});

describe('DELETE /orders/uid', () => {
  it('should delete an user by id or email', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'oli@gmail.com', password: 'olioli' })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .post('/orders')
          .set('token', tokenAdmin)
          .send(order)
          .expect(200)
          .then(((res) => {
            request(app)
              .delete(`/orders/${res.body._id}`)
              .set('Accept', 'application/json')
              .set('token', tokenAdmin)
              .expect('Content-Type', /json/)
              .expect(200)
              .then((res) => {
                expect(typeof res.body).toBe('object');
                done();
              });
          }));
      }));
  });
  it('If there is no auth token, it should fail with status 401', (done) => {
    request(app)
      .delete('/orders/6154c90be6de415ae51ff845')
      .set('Accept', 'application/json')
      .expect({ message: 'No token provided' })
      .expect(401, done);
  });
  it('If id does´nt exist, it should fail with status 404', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'oli@gmail.com', password: 'olioli' })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .delete('/orders/6157deba77f7dca19e9298dd')
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'The order doesn´t exist' })
          .expect(404, done);
      }));
  });
  it('If id format is invalid, it should fail with status 404', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'oli@gmail.com', password: 'olioli' })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .delete('/orders/6157deba77f7dca19e9298d')
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'Id format is invalid' })
          .expect(404, done);
      }));
  });
});
