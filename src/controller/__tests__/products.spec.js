const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const databaseName = 'test';
beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true });
});

const tokenAdmin = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNGU4ZTczY2M0MjQ0ZTBjOWQ1YTgyYSIsImlhdCI6MTYzMjk3OTU3OSwiZXhwIjoxNjMzMDY1OTc5fQ.TU3tb1EoUn_Nf58r5X5mNF4FUhcUcrQp0o5RhtMw4Rg';

const tokenUser = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNTUxYjVlNjQ4MzI3MTMzZTJkYjQxMiIsImlhdCI6MTYzMjk2NzUyNywiZXhwIjoxNjMzMDUzOTI3fQ.IdPoP6IocZHc5eDMmjSoj-xXvusRrM_WTaoBqk2uXKM';

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
      .get('/products')
      .set('Accept', 'application/json')
      .set('token', tokenAdmin)
      .expect(200, done);
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
      .get('/products/6146a5ff7f117b38d9cfdf68')
      .set('Accept', 'application/json')
      .set('token', tokenAdmin)
      .expect(200, done);
  });
  it('If there is no auth token, it should fail with status 401', (done) => {
    request(app)
      .get('/products/6146a5ff7f117b38d9cfdf69')
      .set('Accept', 'application/json')
      .expect({ message: 'No token provided' })
      .expect(401, done);
  });
  it('If id does´nt exist, it should fail with status 404', (done) => {
    request(app)
      .get('/products/6146a5ff7f117b38d9cfdf69')
      .set('Accept', 'application/json')
      .set('token', tokenAdmin)
      .expect({ message: 'The product doesn´t exist' })
      .expect(404, done);
  });
});

describe('POST /products', () => {
  it('Should create a product', (done) => {
    request(app)
      .post('/products')
      .send(product)
      .set('Accept', 'application/json')
      .set('token', tokenAdmin)
      .expect(200, done);
  });
  it('If name or price is not indicated, it should fail with status 400', (done) => {
    request(app)
      .post('/products')
      .send(badProduct)
      .set('Accept', 'application/json')
      .set('token', tokenAdmin)
      // .expect({ message: 'You didn´t enter property to modify' })
      .expect(400, done);
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
      .post('/products')
      .send(product)
      .set('Accept', 'application/json')
      .set('token', tokenUser)
      .expect({ message: 'you need the admin role' })
      .expect(403, done);
  });
});

describe('PUT /products/uid', () => {
  it('Should update a product by id', (done) => {
    request(app)
      .put('/products/6148078ec652dee7e5e1d745')
      .send({ name: 'updated product' })
      .set('Accept', 'application/json')
      .set('token', tokenAdmin)
      .expect(200, done);
  });
  it('If no property to modify is indicated, it should fail with status 400', (done) => {
    request(app)
      .put('/products/6148078ec652dee7e5e1d745')
      .set('Accept', 'application/json')
      .set('token', tokenAdmin)
      .expect({ message: 'You didn´t enter property to modify' })
      .expect(400, done);
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
      .put('/products/6148078ec652dee7e5e1d745')
      .send({ name: 'updated product' })
      .set('Accept', 'application/json')
      .set('token', tokenUser)
      .expect({ message: 'you need the admin role' })
      .expect(403, done);
  });
  it('If id does´nt exist, it should fail with status 404', (done) => {
    request(app)
      .put('/products/6148078ec652dee7e5e1d746')
      .send({ name: 'updated product' })
      .set('Accept', 'application/json')
      .set('token', tokenAdmin)
      .expect({ message: 'The product doesn´t exist' })
      .expect(404, done);
  });
});

describe('DELETE /products/uid', () => {
  // it('should delete a product by id', (done) => {
  //   request(app)
  //     .delete('/products/614b33ad34285ebbd3abefae')
  //     .set('Accept', 'application/json')
  //     .set('token', tokenAdmin)
  //     .expect(200, done);
  // });
  it('If there is no auth token, it should fail with status 401', (done) => {
    request(app)
      .delete('/products/6154c90be6de415ae51ff845')
      .set('Accept', 'application/json')
      .expect(401, done);
  });
  it('If not admin, it should fail with status 403', (done) => {
    request(app)
      .delete('/products/6154c90be6de415ae51ff845')
      .set('Accept', 'application/json')
      .set('token', tokenUser)
      .expect({ message: 'you need the admin role' })
      .expect(403, done);
  });
  it('If id does´nt exist, it should fail with status 404', (done) => {
    request(app)
      .delete('/products/6154c90be6de415ae51ff846')
      .set('Accept', 'application/json')
      .set('token', tokenAdmin)
      .expect({ message: 'The product doesn´t exist' })
      .expect(404, done);
  });
});
