const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');

const databaseName = 'test';
beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true });
});

describe('GET /products', () => {
  it('Should return all product with auth', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .get('/products')
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
  it('If there is no auth token, it should fail with status 401', (done) => {
    request(app)
      .get('/products')
      .expect('Content-Type', /json/)
      .expect({ message: 'requiere autenticacion' })
      .expect(401, done);
  });
});

describe('GET /products/:productid', () => {
  it('Should respond 401 when no auth', (done) => {
    request(app)
      .get('/users/xxxx')
      .expect('Content-Type', /json/)
      .expect(401, done);
  });

  it('should fail with 404 and not found product', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .get('/products/6140cf6ff00832ad74b79c60')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect(404)
          .then((response) => {
            expect(response.body).toEqual('product id not found in database');
            done();
          });
      }));
  });

  it('should get product id', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .post('/products')
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'Hamburguesa Olga', price: 10 })
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            request(app)
              .get(`/products/${response.body._id}`)
              .expect(200);
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
          .get('/products/6140cf6ff00832ad74b79c604t673')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect(404)
          .then((response) => {
            expect(response.body).toEqual('Ingrese id valido');
            done();
          });
      }));
  });
});

describe('POST /products', () => {
  it('Should respond 401 when no auth', (done) => {
    request(app)
      .post('/products')
      .send({ name: 'Hamburguesa B', price: 12 })
      .expect('Content-Type', /json/)
      .expect(401, done);
  });

  it('should respond with 400 when name and price', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .post('/products')
          .set('Authorization', `Bearer ${token}`)
          .send({})
          .expect('Content-Type', /json/)
          .expect(400)
          .then((response) => {
            expect(response.body).toEqual('indicar nombre o precio');
            done();
          });
      }));
  });

  it('should fail with 403 when not admin', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .post('/users')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .send({ email: 'user1234@gmail.com', password: 'Password$1' })
          .then(() => {
            request(app)
              .post('/auth')
              .send({ email: 'user1234@gmail.com', password: 'Password$1' })
              .then(((res) => {
                const { token } = res.body;
                request(app)
                  .post('/products')
                  .set('Authorization', `Bearer ${token}`)
                  .send({ name: 'Hamburguesa A', price: 12 })
                  .expect('Content-Type', /json/)
                  .expect(403)
                  .then((response) => {
                    expect(response.body).toEqual({ message: 'requires administrator role' });
                    done();
                  });
              }));
          });
      }));
  });

  it('should create product as admin', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .post('/products')
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'Hamburguesa Keyla', price: 50 })
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            expect(response.body.name).toEqual('Hamburguesa Keyla');
            expect(response.body.price).toEqual(50);
            done();
          });
      }));
  });
});

describe('PUT /products/:uid', () => {
  it('should fail with 401 when no auth', (done) => {
    request(app)
      .put('/products/6140cf6ff00832ad74b79c68')
      .expect('Content-Type', /json/)
      .expect(401);
    done();
  });

  it('should fail with 403 when not owner nor admin', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .post('/products')
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'Hamburguesa Yup', price: 12 })
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            const idProduct = res.body._id;
            request(app)
              .post('/auth')
              .send({ email: 'user1234@gmail.com', password: 'Password$1' })
              .then(((res) => {
                const { token } = res.body;
                request(app)
                  .put(`/products/${idProduct}`)
                  .set('Authorization', `Bearer ${token}`)
                  .send({ price: 100 })
                  .expect('Content-Type', /json/)
                  .expect(403, done);
              }));
          });
      }));
  });

  it('should fail with 404 and not found product', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .put('/products/6140cf6ff00832ad74b79c60')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect(404)
          .then((response) => {
            expect(response.body).toEqual('product id not found in database');
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
          .post('/products')
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'Hamburguesa Test', price: 100 })
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            const idProduct = res.body._id;
            request(app)
              .put(`/products/${idProduct}`)
              .set('Authorization', `Bearer ${token}`)
              .send({})
              .expect('Content-Type', /json/)
              .expect(400, done);
          });
      }));
  });

  it('should update product as admin', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .post('/products')
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'Hamburguesa Test1', price: 60 })
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            const idProduct = res.body._id;
            request(app)
              .put(`/products/${idProduct}`)
              .set('Authorization', `Bearer ${token}`)
              .send({ price: 40 })
              .expect('Content-Type', /json/)
              .expect(200, done);
          });
      }));
  });
});

describe('DELETE /products/:productId', () => {
  it('should fail with 401 when no auth', (done) => {
    request(app)
      .delete('/products/xxx')
      .expect(401)
      .then((response) => {
        expect(response.body).toEqual({ message: 'requiere autenticacion' });
        done();
      });
  });

  it('should fail with 403 when not admin', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .post('/products')
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'Hamburguesa C', price: 12 })
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            const idProduct = res.body._id;
            request(app)
              .post('/auth')
              .send({ email: 'user1234@gmail.com', password: 'Password$1' })
              .then(((res) => {
                const { token } = res.body;
                request(app)
                  .delete(`/products/${idProduct}`)
                  .set('Authorization', `Bearer ${token}`)
                  .expect('Content-Type', /json/)
                  .expect(403, done);
              }));
          });
      }));
  });

  it('should fail with 404 and not found product', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .delete('/products/6140cf6ff00832ad74b79c60')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect(404)
          .then((response) => {
            expect(response.body).toEqual('product id not found in database');
            done();
          });
      }));
  });

  it('should delete other product as admin', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .post('/products')
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'Hamburguesa Test3', price: 60 })
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            const idProduct = res.body._id;
            request(app)
              .delete(`/products/${idProduct}`)
              .set('Authorization', `Bearer ${token}`)
              .expect('Content-Type', /json/)
              .expect(200, done);
          });
      }));
  });
});
