const request = require('supertest');
const mongoose = require('mongoose');
// const config = require('../../config');
const app = require('../../app');
const { adminEmail } = require('../../config');

const databaseName = 'test';
beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true });
});

const adminUser = {
  email: 'oli@gmail.com',
  password: 'olioli',
};

const product = {
  name: 'burguer',
  price: 50,
  image: 'https://cdn.computerhoy.com/sites/navi.axelspringer.es/public/styles/1200/public/media/image/2020/08/hamburguesa-2028707.jpg?itok=ujl3qgM9',
  type: 'carne',
};

const badProduct = {
  price: 50,
  image: 'https://cdn.computerhoy.com/sites/navi.axelspringer.es/public/styles/1200/public/media/image/2020/08/hamburguesa-2028707.jpg?itok=ujl3qgM9',
  type: 'carne',
};

describe('GET /products', () => {
  it('Should return all products', (done) => {
    request(app)
      .post('/auth')
      .send({ email: adminUser.email, password: adminUser.password })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .get('/products')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .set('token', tokenAdmin)
          .expect(200)
          .then((res) => {
            expect(res.body.length > 0).toBe(true);
            expect(Array.isArray(res.body)).toBe(true);
            res.body.forEach((product) => {
              expect(typeof product._id).toBe('string');
              expect(typeof product.name).toBe('string');
              expect(typeof product.price).toBe('number');
            });
            done();
          });
      }));
  });
  it('If there is no auth token, it should fail with status 401', (done) => {
    request(app)
      .get('/products')
      .set('Accept', 'application/json')
      .expect({ message: 'No token provided' })
      .expect(401, done);
  });
});

describe('GET /products/:uid', () => {
  it('Should return product by Id', (done) => {
    request(app)
      .post('/auth')
      .send({ email: adminUser.email, password: adminUser.password })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .post('/products')
          .set('token', tokenAdmin)
          .send(product)
          .expect(200)
          .then(((res) => {
            request(app)
              .get(`/products/${res.body._id}`)
              .set('Accept', 'application/json')
              .set('token', tokenAdmin)
              .expect('Content-Type', /json/)
              .expect(200)
              .then((res) => {
                expect(typeof res.body).toBe('object');
                const product = res.body;
                expect(typeof product._id).toBe('string');
                expect(typeof product.name).toBe('string');
                expect(typeof product.price).toBe('number');
                done();
              });
          }));
      }));
  });
  it('If there is no auth token, it should fail with status 401', (done) => {
    request(app)
      .get('/products/6146a5ff7f117b38d9cfdf68')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({ message: 'No token provided' })
      .expect(401, done);
  });
  it('If id does´nt exist, it should fail with status 404', (done) => {
    request(app)
      .post('/auth')
      .send({ email: adminUser.email, password: adminUser.password })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .get('/products/6146a5ff7f117b38d9cfdf69')
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'The product doesn´t exist' })
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
          .get('/products/invalididformat')
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'Id format is invalid' })
          .expect(404, done);
      }));
  });
});

describe('POST /products', () => {
  it('Should create a product', (done) => {
    request(app)
      .post('/auth')
      .send({ email: adminUser.email, password: adminUser.password })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .post('/products')
          .send(product)
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect(200)
          .then((res) => {
            expect(typeof res.body).toBe('object');
            expect(typeof res.body.name).toBe('string');
            expect(typeof res.body.price).toBe('number');
            expect(typeof res.body._id).toBe('string');
            done();
          });
      }));
  });
  it('If name or price is not indicated, it should fail with status 400', (done) => {
    request(app)
      .post('/auth')
      .send({ email: adminUser.email, password: adminUser.password })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .post('/products')
          .send(badProduct)
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'You didn´t enter name or price' })
          .expect(400, done);
      }));
  });
  it('If there is no auth token, it should fail with status 401', (done) => {
    request(app)
      .post('/products')
      .send(product)
      .set('Accept', 'application/json')
      .expect({ message: 'No token provided' })
      .expect(401, done);
  });
  it('If not admin, it should fail with status 403', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'user@test.com', password: 'usertest' })
      .then(((res) => {
        const tokenUser = res.body.token;
        request(app)
          .post('/products')
          .send(product)
          .set('Accept', 'application/json')
          .set('token', tokenUser)
          .expect({ message: 'you need the admin role' })
          .expect(403, done);
      }));
  });
});

describe('PUT /products/uid', () => {
  it('Should update a product by id', (done) => {
    request(app)
      .post('/auth')
      .send({ email: adminUser.email, password: adminUser.password })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .post('/products')
          .set('token', tokenAdmin)
          .send(product)
          .expect(200)
          .then(((res) => {
            request(app)
              .put(`/products/${res.body._id}`)
              .send({ name: 'updated product' })
              .set('Accept', 'application/json')
              .set('token', tokenAdmin)
              .expect('Content-Type', /json/)
              .expect(200)
              .then((res) => {
                expect(typeof res.body).toBe('object');
                const product = res.body;
                expect(typeof product._id).toBe('string');
                expect(typeof product.name).toBe('string');
                expect(typeof product.price).toBe('number');
                expect(product.name).toEqual('updated product');
                done();
              });
          }));
      }));
  });
  it('If no property to modify is indicated, it should fail with status 400', (done) => {
    request(app)
      .post('/auth')
      .send({ email: adminUser.email, password: adminUser.password })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .post('/products')
          .set('token', tokenAdmin)
          .send(product)
          .expect(200)
          .then(((res) => {
            request(app)
              .put(`/products/${res.body._id}`)
              .set('Accept', 'application/json')
              .set('token', tokenAdmin)
              .expect('Content-Type', /json/)
              .expect({ message: 'You didn´t enter property to modify' })
              .expect(400, done);
          }));
      }));
  });
  it('If there is no auth token, it should fail with status 401', (done) => {
    request(app)
      .put('/products/6148078ec652dee7e5e1d745')
      .send({ name: 'updated product' })
      .set('Accept', 'application/json')
      .expect({ message: 'No token provided' })
      .expect(401, done);
  });
  it('If not admin, it should fail with status 403', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'user@test.com', password: 'usertest' })
      .then(((res) => {
        const tokenUser = res.body.token;
        request(app)
          .put('/products/6148078ec652dee7e5e1d745')
          .send({ name: 'updated product' })
          .set('Accept', 'application/json')
          .set('token', tokenUser)
          .expect({ message: 'you need the admin role' })
          .expect(403, done);
      }));
  });
  it('If id does´nt exist, it should fail with status 404', (done) => {
    request(app)
      .post('/auth')
      .send({ email: adminUser.email, password: adminUser.password })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .put('/products/6148078ec652dee7e5e1d746')
          .send({ name: 'updated product' })
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'The product doesn´t exist' })
          .expect(404, done);
      }));
  });
  it('If id format is invalid, it should fail with status 404', (done) => {
    request(app)
      .post('/auth')
      .send({ email: adminUser.email, password: adminUser.password })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .put('/products/invalididformat')
          .send({ name: 'updated product' })
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'Id format is invalid' })
          .expect(404, done);
      }));
  });
});

describe('DELETE /products/uid', () => {
  it('should delete a product by id', (done) => {
    request(app)
      .post('/auth')
      .send({ email: adminUser.email, password: adminUser.password })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .post('/products')
          .set('token', tokenAdmin)
          .send(product)
          .expect(200)
          .then(((res) => {
            request(app)
              .delete(`/products/${res.body._id}`)
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
      .delete('/products/6154c90be6de415ae51ff845')
      .set('Accept', 'application/json')
      .expect({ message: 'No token provided' })
      .expect(401, done);
  });
  it('If not admin, it should fail with status 403', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'user@test.com', password: 'usertest' })
      .then(((res) => {
        const tokenUser = res.body.token;
        request(app)
          .delete('/products/6154c90be6de415ae51ff845')
          .set('Accept', 'application/json')
          .set('token', tokenUser)
          .expect({ message: 'you need the admin role' })
          .expect(403, done);
      }));
  });
  it('If id does´nt exist, it should fail with status 404', (done) => {
    request(app)
      .post('/auth')
      .send({ email: adminUser.email, password: adminUser.password })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .delete('/products/6154c90be6de415ae51ff846')
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'The product doesn´t exist' })
          .expect(404, done);
      }));
  });
  it('If id format is invalid, it should fail with status 404', (done) => {
    request(app)
      .post('/auth')
      .send({ email: adminUser.email, password: adminUser.password })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .delete('/products/invalidid')
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'Id format is invalid' })
          .expect(404, done);
      }));
  });
});
