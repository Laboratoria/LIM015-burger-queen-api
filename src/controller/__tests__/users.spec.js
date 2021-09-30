// const request = require('supertest');
// const mongoose = require('mongoose');
// const app = require('../../app');

// const databaseName = 'test';
// beforeAll(async () => {
//   const url = `mongodb://127.0.0.1/${databaseName}`;
//   await mongoose.connect(url, { useNewUrlParser: true });
// });

// const user = {
//   email: 'testuser@gmail.com',
//   password: 'testuser',
// };

// const badUser = {
//   email: 'testuser@gmail.com',
// };

// const tokenAdmin = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNGU4ZTczY2M0MjQ0ZTBjOWQ1YTgyYSIsImlhdCI6MTYzMjk3OTU3OSwiZXhwIjoxNjMzMDY1OTc5fQ.TU3tb1EoUn_Nf58r5X5mNF4FUhcUcrQp0o5RhtMw4Rg';

// const tokenUser = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNTUxYjVlNjQ4MzI3MTMzZTJkYjQxMiIsImlhdCI6MTYzMjk2NzUyNywiZXhwIjoxNjMzMDUzOTI3fQ.IdPoP6IocZHc5eDMmjSoj-xXvusRrM_WTaoBqk2uXKM';

// describe('GET /users', () => {
//   it('Should return all users', (done) => {
//     request(app)
//       .get('/users')
//       .set('Accept', 'application/json')
//       .set('token', tokenAdmin)
//       .expect(200, done);
//   });
//   it('If there is no auth token, it should fail with status 401', (done) => {
//     request(app)
//       .get('/users')
//       .set('Accept', 'application/json')
//       .expect({ message: 'No token provided' })
//       .expect(401, done);
//   });
//   it('If not admin, it should fail with status 403', (done) => {
//     request(app)
//       .get('/users')
//       .set('Accept', 'application/json')
//       .set('token', tokenUser)
//       .expect({ message: 'you need the admin role' })
//       .expect(403, done);
//   });
// });

// describe('GET /users/:uid', () => {
//   it('Should return an user by Id', (done) => {
//     request(app)
//       .get('/users/614e97f41066ffbf58b4fb99')
//       .set('Accept', 'application/json')
//       .set('token', tokenAdmin)
//       .expect(200, done);
//   });
//   it('If there is no auth token, it should fail with status 401', (done) => {
//     request(app)
//       .get('/users/614e97f41066ffbf58b4fb99')
//       .set('Accept', 'application/json')
//       .expect({ message: 'No token provided' })
//       .expect(401, done);
//   });
//   it('If not admin, it should fail with status 403', (done) => {
//     request(app)
//       .get('/users/614e97f41066ffbf58b4fb99')
//       .set('Accept', 'application/json')
//       .set('token', tokenUser)
//       .expect({ message: 'you need the admin role' })
//       .expect(403, done);
//   });
//   it('If id does´nt exist, it should fail with status 404', (done) => {
//     request(app)
//       .get('/users/614e97f41066ffbf58b4fb98')
//       .set('Accept', 'application/json')
//       .set('token', tokenAdmin)
//       .expect({ message: 'The user doesn´t exist' })
//       .expect(404, done);
//   });
// });

// describe('POST /signUp', () => {
//   it('Should create a user', (done) => {
//     request(app)
//       .post('/signUp')
//       .send(user)
//       .set('Accept', 'application/json')
//       .set('token', tokenAdmin)
//       .expect(200, done);
//   });
//   // it('If email or password is not indicated, it should fail with status 400', (done) => {
//   //   request(app)
//   //     .post('/users')
//   //     // .send(badUser)
//   //     .set('Accept', 'application/json')
//   //     .set('token', tokenAdmin)
//   //     // .expect({ message: 'You didn´t enter property to modify' })
//   //     .expect(400, done);
//   // });
//   // it('If there is no auth token, it should fail with status 401', (done) => {
//   //   request(app)
//   //     .post('/users')
//   //     // .send(user)
//   //     .set('Accept', 'application/json')
//   //     .expect({ message: 'No token provided' })
//   //     .expect(401, done);
//   // });
//   // it('If not admin, it should fail with status 403', (done) => {
//   //   request(app)
//   //     .post('/users')
//   //     // .send(user)
//   //     .set('Accept', 'application/json')
//   //     .set('token', tokenUser)
//   //     // .expect({ message: 'you need the admin role' })
//   //     .expect(403, done);
//   // });
// });
