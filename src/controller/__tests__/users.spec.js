const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const databaseName = 'test';
beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true });
});

const adminUser = {
  email: 'oli@gmail.com',
  password: 'olioli',
};

const userTest = {
  email: 'user@test.com',
  password: 'usertest',
};

describe('GET /users', () => {
  it('Should return all users', (done) => {
    request(app)
      .post('/auth')
      .send({ email: adminUser.email, password: adminUser.password })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .get('/users')
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect(200)
          .then((res) => {
            expect(res.body.length > 0).toBe(true);
            expect(Array.isArray(res.body)).toBe(true);
            res.body.forEach((user) => {
              expect(typeof user._id).toBe('string');
              expect(typeof user.email).toBe('string');
              expect(typeof user.password).toBe('string');
            });
            done();
          });
      }));
  });

  it('If there is no auth token, it should fail with status 401', (done) => {
    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect({ message: 'No token provided' })
      .expect(401, done);
  });
  it('If not admin, it should fail with status 403', (done) => {
    request(app)
      .post('/auth')
      .send(adminUser)
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .post('/users')
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .send(userTest)
          .then(() => {
            request(app)
              .post('/auth')
              .send(userTest)
              .then(((res) => {
                const tokenUser = res.body.token;
                request(app)
                  .get('/users')
                  .set('Accept', 'application/json')
                  .set('token', tokenUser)
                  .expect({ message: 'you need the admin role' })
                  .expect(403, done);
              }));
          });
      }));
  });
});

describe('GET /users/:uid', () => {
  it('Should return an user by Id or email', (done) => {
    request(app)
      .post('/auth')
      .send(adminUser)
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .get(`/users/${userTest.email}`)
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect(200)
          .then((res) => {
            expect(typeof res.body).toBe('object');
            expect(res.body.email).toBe(userTest.email);
            done();
          });
      }));
  });
  it('If there is no auth token, it should fail with status 401', (done) => {
    request(app)
      .get('/users/614e97f41066ffbf58b4fb99')
      .set('Accept', 'application/json')
      .expect({ message: 'No token provided' })
      .expect(401, done);
  });
  it('If not admin, it should fail with status 403', (done) => {
    request(app)
      .post('/auth')
      .send(adminUser)
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .post('/users')
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .send(userTest)
          .then(() => {
            request(app)
              .post('/auth')
              .send(userTest)
              .then(((res) => {
                const tokenUser = res.body.token;
                request(app)
                  .get(`/users/${adminUser.email}`)
                  .set('Accept', 'application/json')
                  .set('token', tokenUser)
                  .expect({ message: 'you need the admin role' })
                  .expect(403, done);
              }));
          });
      }));
  });
  it('If id does´nt exist, it should fail with status 404', (done) => {
    request(app)
      .post('/auth')
      .send(adminUser)
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .get('/users/614e97f41066ffbf58b4fb98')
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'The user doesn´t exist' })
          .expect(404, done);
      }));
  });
  it('if email or id format is invalid, it should fail with status 403', (done) => {
    request(app)
      .post('/auth')
      .send(adminUser)
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .get('/users/123')
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'Email o id format is invalid' })
          .expect(404, done);
      }));
  });
});

describe('POST /users', () => {
  // it('Should create a user', (done) => {
  //   request(app)
  //     .post('/auth')
  //     .send({ email: 'oli@gmail.com', password: 'olioli' })
  //     .then(((res) => {
  //       const tokenAdmin = res.body.token;
  //       request(app)
  //         .post('/users')
  //         .send({ email: 'testuser7@gmail.com', password: 'testuser7', roles: 'user' })
  //         .set('Accept', 'application/json')
  //         .set('token', tokenAdmin)
  //         .expect(200)
  //         .then((res) => {
  //           expect(typeof res.body).toBe('object');
  //           done();
  //         });
  //     }));
  // });
  it('If email or password is not indicated, it should fail with status 400', (done) => {
    request(app)
      .post('/auth')
      .send(adminUser)
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .post('/users')
          .send({ email: 'onlyemail@gmail.com' })
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'You didn´t enter email or password' })
          .expect(400, done);
      }));
  });
  it('If there is no auth token, it should fail with status 401', (done) => {
    request(app)
      .post('/users')
      .send({ email: 'newuser@hotmail.com', password: 'password' })
      .set('Accept', 'application/json')
      .expect({ message: 'No token provided' })
      .expect(401, done);
  });
  it('If not admin, it should fail with status 403', (done) => {
    request(app)
      .post('/auth')
      .send(adminUser)
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .post('/users')
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .send(userTest)
          .then(() => {
            request(app)
              .post('/auth')
              .send(userTest)
              .then(((res) => {
                const tokenUser = res.body.token;
                request(app)
                  .post('/users')
                  .send({ email: 'user@test.com', password: 'usertest' })
                  .set('Accept', 'application/json')
                  .set('token', tokenUser)
                  .expect({ message: 'you need the admin role' })
                  .expect(403, done);
              }));
          });
      }));
  });

  it('if there is already a user with that email, it should fail with status 403', (done) => {
    request(app)
      .post('/auth')
      .send(adminUser)
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .post('/users')
          .send({ email: 'userexist@gmail.com', password: 'userexist' })
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'user already exists' })
          .expect(403, done);
      }));
  });
  it('if email format is invalid, it should fail with status 403', (done) => {
    request(app)
      .post('/auth')
      .send(adminUser)
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .post('/users')
          .send({ email: 'invalidemail', password: 'password' })
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'Email format is invalid' })
          .expect(403, done);
      }));
  });
  it('if password format is invalid, it should fail with status 403', (done) => {
    request(app)
      .post('/auth')
      .send(adminUser)
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .post('/users')
          .send({ email: 'invalid@gmail.com', password: 'invalid' })
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'Password format is invalid' })
          .expect(403, done);
      }));
  });
});

describe('PUT /users/:uid', () => {
  it('Should update a user by id or email', (done) => {
    request(app)
      .post('/auth')
      .send(adminUser)
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .put('/users/614e4cdc5f2423f2202d45cf')
          .send({ email: 'updateduser@gmail.com' })
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect(200)
          .then((res) => {
            expect(typeof res.body).toBe('object');
            done();
          });
      }));
  });
  it('Should update a user by email', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'oli@gmail.com', password: 'olioli' })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .put('/users/hector@gmail.com')
          .send({ password: 'newpassword' })
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect(200)
          .then((res) => {
            expect(typeof res.body).toBe('object');
            done();
          });
      }));
  });
  it('if no `email` or` password` or neither are provided, it should fail with status 400', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'oli@gmail.com', password: 'olioli' })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .put('/users/614e4cdc5f2423f2202d45cf')
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'You didn´t enter email or password' })
          .expect(400, done);
      }));
  });
  it('If there is no auth token, it should fail with status 401', (done) => {
    request(app)
      .put('/products/614e4cdc5f2423f2202d45cf')
      .send({ password: 'newpassword' })
      .set('Accept', 'application/json')
      .expect({ message: 'No token provided' })
      .expect(401, done);
  });
  it('if it is neither admin nor the same user, it should fail with status 403', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'user@test.com', password: 'usertest' })
      .then(((res) => {
        const tokenUser = res.body.token;
        request(app)
          .put('/users/614e4cdc5f2423f2202d45cf')
          .send({ password: 'newpassword' })
          .set('Accept', 'application/json')
          .set('token', tokenUser)
        //   .expect({ message: 'you need the admin role' })
          .expect(403, done);
      }));
  });
  it('if it is neither admin nor the same user, it should fail with status 403', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'user@test.com', password: 'usertest' })
      .then(((res) => {
        const tokenUser = res.body.token;
        request(app)
          .put('/users/user@test.com')
          .send({ roles: '6142c2998fa2c4774359b813' })
          .set('Accept', 'application/json')
          .set('token', tokenUser)
        //   .expect({ message: 'you need the admin role' })
          .expect(403, done);
      }));
  });
  it('If id does´nt exist, it should fail with status 404', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'oli@gmail.com', password: 'olioli' })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .put('/users/fakeuser@gmail.com')
          .send({ password: 'newpassword' })
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'The user doesn´t exist' })
          .expect(404, done);
      }));
  });
  it('if email or id format is invalid, it should fail with status 403', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'oli@gmail.com', password: 'olioli' })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .put('/users/123')
          .send({ password: 'newpassword' })
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'Email o id format is invalid' })
          .expect(404, done);
      }));
  });
});

describe('DELETE /users/uid', () => {
  it('should delete an user by id or email', (done) => {
    request(app)
      .post('/auth')
      .send(adminUser)
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .post('/users')
          .set('token', tokenAdmin)
          .send({ email: 'userforDelete@gmail.com', password: 'userdelete' })
          .expect(200)
          .then(((res) => {
            request(app)
              .delete(`/users/${res.body._id}`)
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
      .delete('/users/6154c90be6de415ae51ff845')
      .set('Accept', 'application/json')
      .expect({ message: 'No token provided' })
      .expect(401, done);
  });
  it('if it is neither admin nor the same user, it should fail with status 403', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'user@test.com', password: 'usertest' })
      .then(((res) => {
        const tokenUser = res.body.token;
        request(app)
          .delete('/users/mauricio@gmail.com')
          .set('Accept', 'application/json')
          .set('token', tokenUser)
          .expect({ message: 'you need the admin role' })
          .expect(403, done);
      }));
  });
  it('If id does´nt exist, it should fail with status 404', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'oli@gmail.com', password: 'olioli' })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .delete('/users/fake@gmail.com')
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'The user doesn´t exist' })
          .expect(404, done);
      }));
  });
  it('if email or id format is invalid, it should fail with status 403', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'oli@gmail.com', password: 'olioli' })
      .then(((res) => {
        const tokenAdmin = res.body.token;
        request(app)
          .delete('/users/123')
          .set('Accept', 'application/json')
          .set('token', tokenAdmin)
          .expect({ message: 'Email o id format is invalid' })
          .expect(404, done);
      }));
  });
  it('if token is invalid, it should fail with status 401', (done) => {
    request(app)
      .delete('/users/6154c90be6de415ae51ff845')
      .set('Accept', 'application/json')
      .set('token', 'invalid')
      // .expect({ message: 'invalid token' })
      .expect(401, done);
  });
});
