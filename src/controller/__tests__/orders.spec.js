const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');

// jest.useFakeTimers();

const databaseName = 'test';
beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true });
});

describe('GET /orders', () => {
  it('Should respond 401 when no auth', (done) => {
    request(app)
      .get('/orders')
      .expect('Content-Type', /json/)
      .expect(401, done);
  });

  it('should get orders as user', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .post('/users')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .send({ email: 'user12345@gmail.com', password: 'Password$1' })
          .then(() => {
            request(app)
              .post('/auth')
              .send({ email: 'user12345@gmail.com', password: 'Password$1' })
              .then(((res) => {
                const { token } = res.body;
                request(app)
                  .get('/orders')
                  .set('Authorization', `Bearer ${token}`)
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .then((res) => {
                    expect(res.body.length > 0).toBe(true);
                    expect(Array.isArray(res.body)).toBe(true);
                    done();
                  });
              }));
          });
      }));
  });

  it('should get orders as admin', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .get('/orders')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            expect(res.body.length > 0).toBe(true);
            expect(Array.isArray(res.body)).toBe(true);
            done();
          });
      }));
  });
});

describe('GET /orders/:orderid', () => {
  it('Should respond 401 when no auth', (done) => {
    request(app)
      .get('/orders/xxxx')
      .expect('Content-Type', /json/)
      .expect(401, done);
  });

  it('should fail with 404 when admin and not found', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .get('/orders/6140cf6ff00832ad74b79c60')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect(404)
          .then((response) => {
            expect(response.body).toEqual('order id not found in database');
            done();
          });
      }));
  });

  it('should fail with 404 id invalido', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .get('/orders/6140cf6ff00832ad74b79c604t673')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect(404)
          .then((response) => {
            expect(response.body).toEqual('Ingrese id valido');
            done();
          });
      }));
  });

  it('should get order ID as user', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'user12345@gmail.com', password: 'Password$1' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .get('/orders')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            request(app)
              .get(`/orders/${response.body[0]._id}`)
              .set('Authorization', `Bearer ${token}`)
              .expect('Content-Type', /json/)
              .expect(200)
              .then((res) => {
                expect(typeof res.body).toBe('object');
                done();
              });
          });
      }));
  });

  it('should get order ID as admin', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .get('/orders')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            request(app)
              .get(`/orders/${response.body[0]._id}`)
              .set('Authorization', `Bearer ${token}`)
              .expect('Content-Type', /json/)
              .expect(200)
              .then((res) => {
                expect(typeof res.body).toBe('object');
                done();
              });
          });
      }));
  });
});

describe('POST /orders', () => {
  it('Should respond 401 when no auth', (done) => {
    request(app)
      .post('/orders')
      .send({
        userId: '614e077245623fb0537eb1a7',
        client: 'Cliente',
        products: [
          {
            qty: 20,
            productId: '6140cf6ff00832ad74b79c68',
          },
        ],
      })
      .expect('Content-Type', /json/)
      .expect(401, done);
  });

  it('should fail with 400 when bad props', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .post('/orders')
          .set('Authorization', `Bearer ${token}`)
          .send({ })
          .expect('Content-Type', /json/)
          .expect(400)
          .then((response) => {
            expect(response.body).toEqual('ingresar producto');
            done();
          });
      }));
  });

  it('should fail with 400 when empty items', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .post('/orders')
          .set('Authorization', `Bearer ${token}`)
          .send({ products: [] })
          .expect('Content-Type', /json/)
          .expect(400)
          .then((response) => {
            expect(response.body).toEqual('ingresar producto');
            done();
          });
      }));
  });

  it('should create order as user (own order)', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'user12345@gmail.com', password: 'Password$1' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .post('/orders')
          .set('Authorization', `Bearer ${token}`)
          .send({
            userId: '6154d7f34a37878652e1a6e9',
            client: 'Cliente1',
            products: [
              {
                qty: 20,
                productId: '6140cf6ff00832ad74b79c68',
              },
            ],
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            expect(res.body.client).toEqual('Cliente1');
            done();
          });
      }));
  });

  it('should create order as admin', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .post('/orders')
          .set('Authorization', `Bearer ${token}`)
          .send({
            userId: '6154d7f34a37878652e1a6e9',
            client: 'Cliente2',
            products: [
              {
                qty: 20,
                productId: '6140cf6ff00832ad74b79c68',
              },
            ],
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            expect(res.body.client).toEqual('Cliente2');
            done();
          });
      }));
  });
});

describe('PUT /orders/:orderId', () => {
  it('Should respond 401 when no auth', (done) => {
    request(app)
      .put('/orders/xxxx')
      .send({
        userId: '614e077245623fb0537eb1a7',
        client: 'Cliente',
        products: [
          {
            qty: 2,
            productId: '6140cf6ff00832ad74b79c68',
          },
        ],
      })
      .expect('Content-Type', /json/)
      .expect(401, done);
  });

  it('should fail with 404 when admin and not found', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .put('/orders/6140cf6ff00832ad74b79c60')
          .set('Authorization', `Bearer ${token}`)
          .send({
            userId: '614e077245623fb0537eb1a7',
            client: 'Cliente',
            products: [
              {
                qty: 2,
                productId: '6140cf6ff00832ad74b79c68',
              },
            ],
          })
          .expect('Content-Type', /json/)
          .expect(404)
          .then((response) => {
            expect(response.body).toEqual('order id not found in database');
            done();
          });
      }));
  });

  it('should fail with 400 when bad props', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .put('/orders/615a0cafce0fba0651bbf7b2')
          .set('Authorization', `Bearer ${token}`)
          .send({ })
          .expect('Content-Type', /json/)
          .expect(400)
          .then((response) => {
            expect(response.body).toEqual('indica dato a modificar');
            done();
          });
      }));
  });

  it('should fail with 400 when bad status', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .put('/orders/615a0cafce0fba0651bbf7b2')
          .set('Authorization', `Bearer ${token}`)
          .send({ status: 'xxxxxx' })
          .expect('Content-Type', /json/)
          .expect(400)
          .then((response) => {
            expect(response.body).toEqual('No es un estado valido');
            done();
          });
      }));
  });

  it('should update order (set status to preparing)', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .post('/orders')
          .set('Authorization', `Bearer ${token}`)
          .send({
            userId: '6154d7f34a37878652e1a6e9',
            client: 'Cliente3',
            products: [
              {
                qty: 5,
                productId: '6140cf6ff00832ad74b79c68',
              },
            ],
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            const orderId = res.body._id;
            request(app)
              .put(`/orders/${orderId}`)
              .set('Authorization', `Bearer ${token}`)
              .send({ status: 'preparing' })
              .expect(200)
              .then((response) => {
                expect(response.body.status).toBe('preparing');
                done();
              });
          });
      }));
  });
});

describe('DELETE /orders/:orderId', () => {
  it('Should respond 401 when no auth', (done) => {
    request(app)
      .delete('/orders/xxxx')
      .expect('Content-Type', /json/)
      .expect(401, done);
  });

  it('should fail with 404 when not found', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .delete('/orders/6140cf6ff00832ad74b79c60')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect(404)
          .then((response) => {
            expect(response.body).toEqual('order id not found in database');
            done();
          });
      }));
  });

  it('should delete other order as admin', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .post('/orders')
          .set('Authorization', `Bearer ${token}`)
          .send({
            userId: '6154d7f34a37878652e1a6e9',
            client: 'Cliente4',
            products: [
              {
                qty: 6,
                productId: '6140cf6ff00832ad74b79c68',
              },
            ],
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            const orderId = res.body._id;
            request(app)
              .delete(`/orders/${orderId}`)
              .set('Authorization', `Bearer ${token}`)
              .expect(200, done);
          });
      }));
  });
});
