const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
// const config = require('../../config');

const databaseName = 'test';
beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true });
});

// const adminUser = {
//   email: 'bethzy16@gmail.com',
//   password: 'Password$16',
// };

// const userTest = {
//   email: 'user123@gmail.com',
//   password: 'Password$1',
// };

describe('GET /users', () => {
  it('Should return all users if is admin', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .get('/users')
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
      .get('/users')
      .expect('Content-Type', /json/)
      .expect({ message: 'requiere autenticacion' })
      .expect(401, done);
  });
  it('If not admin, it should fail with status 403', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then((res) => {
        const { token } = res.body;
        request(app)
          .post('/users')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .send({ email: 'user123@gmail.com', password: 'Password$1' })
          .then(() => {
            request(app)
              .post('/auth')
              .send({ email: 'user123@gmail.com', password: 'Password$1' })
              .then(((res) => {
                const { token } = res.body;
                request(app)
                  .get('/users')
                  .set('Authorization', `Bearer ${token}`)
                  .expect('Content-Type', /json/)
                  .expect(403, done);
              }));
          });
      });
  });
});

describe('GET /users/:uid', () => {
  it('Should respond 401 when no auth', (done) => {
    request(app)
      .get('/users/bethzy16@gmai.com')
      .expect('Content-Type', /json/)
      .expect(401, done);
  });

  it('should fail with 403 when not owner nor admin', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'user123@gmail.com', password: 'Password$1' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .get('/users/bethzy16@gmail.com')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect(403, done);
      }));
  });

  it('should fail with 404 when admin and not found', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .get('/users/hugo@gmail.com')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect(404, done);
      }));
  });

  it('should get user with Auth if is admin', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .get('/users/bethzy16@gmail.com')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            expect(res.body.email).toBe('bethzy16@gmail.com');
            done();
          });
      }));
  });

  it('should get own user', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'user123@gmail.com', password: 'Password$1' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .get('/users/user123@gmail.com')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            expect(response.body.email).toBe('user123@gmail.com');
            done();
          });
      }));
  });
});

describe('POST /users', () => {
  it('should respond with 400 when email and password missing', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .post('/users')
          .set('Authorization', `Bearer ${token}`)
          .send({})
          .expect('Content-Type', /json/)
          .expect(400)
          .then((response) => {
            expect(response.body).toEqual('Ingrese password y/o contraseña');
            done();
          });
      }));
  });

  it('should fail with 400 when invalid email', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .post('/users')
          .set('Authorization', `Bearer ${token}`)
          .send({ email: 'ol@ol', password: 'Password$1' })
          .expect('Content-Type', /json/)
          .expect(400)
          .then((response) => {
            expect(response.body).toEqual('Ingrese email y/o password validos');
            done();
          });
      }));
  });

  it('should fail with 400 when invalid password', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .post('/users')
          .set('Authorization', `Bearer ${token}`)
          .send({ email: 'gg@gmail.com', password: '123' })
          .expect('Content-Type', /json/)
          .expect(400)
          .then((response) => {
            expect(response.body).toEqual('Ingrese email y/o password validos');
            done();
          });
      }));
  });

  it('should create new user as admin', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .post('/users')
          .set('Authorization', `Bearer ${token}`)
          .send({ email: 'hola@gmail.com', password: 'Password$1' })
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            expect(typeof response.body.email).toBe('string');
            expect(typeof response.body._id).toBe('string');
            done();
          });
      }));
  });

  it('should create new admin user as admin', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .post('/users')
          .set('Authorization', `Bearer ${token}`)
          .send({ email: 'useradmin@gmail.com', password: 'Password$1', roles: ['admin'] })
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            expect(typeof response.body.email).toBe('string');
            expect(typeof response.body._id).toBe('string');
            done();
          });
      }));
  });

  it('should fail with 403 when user is already registered', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .post('/users')
          .set('Authorization', `Bearer ${token}`)
          .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
          .expect('Content-Type', /json/)
          .expect(403)
          .then((response) => {
            expect(response.body).toEqual({ message: 'El usuario ya se encuentra registrado' });
            done();
          });
      }));
  });
});
// { email: 'user123@gmail.com', password: 'Password$1' }
describe('PUT /users/:uid', () => {
  it('should fail with 401 when no auth', (done) => {
    request(app)
      .put('/users/user123@gmail.com')
      .send({ password: 'Password$2' })
      .expect('Content-Type', /json/)
      .expect(401);
    done();
  });

  it('should fail with 403 when not owner nor admin', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'user123@gmail.com', password: 'Password$1' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .put('/users/bethzy16@gmail.com')
          .set('Authorization', `Bearer ${token}`)
          .send({ password: 'Password$17' })
          .expect('Content-Type', /json/)
          .expect(403)
          .then((response) => {
            expect(response.body).toEqual('No tiene el rol de admin o no es su usuario a actualizar');
            done();
          });
      }));
  });

  it('should fail with 404 when admin and not found', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .put('/users/hello1@gmail.com')
          .set('Authorization', `Bearer ${token}`)
          .send({ password: 'Password$12' })
          .expect('Content-Type', /json/)
          .expect(404)
          .then((response) => {
            expect(response.body).toEqual('user not found in database');
            done();
          });
      }));
  });

  it('should fail with 400 when no props to update', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .put('/users/bethzy16@gmail.com')
          .set('Authorization', `Bearer ${token}`)
          .send({})
          .expect('Content-Type', /json/)
          .expect(400)
          .then((response) => {
            expect(response.body).toEqual('indicar email y/o password a actualizar');
            done();
          });
      }));
  });

  it('should fail with 403 when not admin tries to change own roles', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'user123@gmail.com', password: 'Password$1' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .put('/users/user123@gmail.com')
          .set('Authorization', `Bearer ${token}`)
          .send({ roles: ['admin'] })
          .expect('Content-Type', /json/)
          .expect(403)
          .then((response) => {
            expect(response.body).toEqual('no puede modificar sus roles');
            done();
          });
      }));
  });

  it('should update user when own data (password change)', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'user123@gmail.com', password: 'Password$1' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .put('/users/user123@gmail.com')
          .set('Authorization', `Bearer ${token}`)
          .send({ password: 'Password$11' })
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            expect(typeof response.body.email).toBe('string');
            expect(typeof response.body._id).toBe('string');
            done();
          });
      }));
  });

  it('should update user when admin', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .put('/users/user123@gmail.com')
          .set('Authorization', `Bearer ${token}`)
          .send({ password: 'Password$12' })
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            expect(typeof response.body.email).toBe('string');
            expect(typeof response.body._id).toBe('string');
            done();
          });
      }));
  });
});

describe('DELETE /users/:uid', () => {
  it('should fail with 401 when no auth', (done) => {
    request(app)
      .delete('/users/user123@gmail.com')
      .expect(401)
      .then((response) => {
        expect(response.body).toEqual({ message: 'requiere autenticacion' });
        done();
      });
  });

  it('should fail with 403 when not owner nor admin', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'user123@gmail.com', password: 'Password$12' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .delete('/users/bethzy16@gmail.com')
          .set('Authorization', `Bearer ${token}`)
          .expect(403)
          .then((response) => {
            expect(response.body).toEqual('No tiene el rol de admin o no es su usuario a eliminar');
            done();
          });
      }));
  });

  it('should fail with 404 when admin and not found', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then(((res) => {
        const { token } = res.body;
        request(app)
          .delete('/users/holi@gmail.com')
          .set('Authorization', `Bearer ${token}`)
          .expect(404)
          .then((response) => {
            expect(response.body).toEqual('user id not found in database');
            done();
          });
      }));
  });

  it('should delete own user', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then((res) => {
        const { token } = res.body;
        request(app)
          .post('/users')
          .set('Authorization', `Bearer ${token}`)
          .send({ email: 'holi1234@gmail.com', password: 'Password$1' })
          .expect('Content-Type', /json/)
          .expect(200)
          .then(() => {
            request(app)
              .post('/auth')
              .send({ email: 'holi1234@gmail.com', password: 'Password$1' })
              .then((response) => {
                request(app)
                  .delete('/users/holi1234@gmail.com')
                  .set('Authorization', `Bearer ${response.body.token}`)
                  .expect(200, done);
              });
          });
      });
  });

  it('should delete other user as admin', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'bethzy16@gmail.com', password: 'Password$16' })
      .then((res) => {
        const { token } = res.body;
        request(app)
          .post('/users')
          .set('Authorization', `Bearer ${token}`)
          .send({ email: 'test101@gmail.com', password: 'Password$1' })
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            request(app)
              .delete(`/users/${res.body._id}`)
              .set('Authorization', `Bearer ${token}`)
              .expect(200, done);
          });
      });
  });
});
