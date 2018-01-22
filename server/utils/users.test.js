const expect = require('expect');

const { Users } = require('./users');

describe('Users', () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: '1',
        name: 'Ricky',
        room: 'The Office'
      }, {
        id: '2',
        name: 'Stephen',
        room: 'The Office'
      }, {
        id: '3',
        name: 'Warren',
        room: 'Idiot Abroad'
      }
    ];
  });

  it('should remove a user', () => {
    const userToRemove = users.users[2];
    const id = userToRemove.id;
    const user = users.removeUser(id);

    expect(user).toEqual(userToRemove);
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user', () => {
    const id = '999';
    const user = users.removeUser(id);

    expect(user).toBeFalsy();
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    const id = users.users[1].id;
    const user = users.getUser(id);

    expect(user).toEqual(users.users[1]);
  });

  it('should not find user', () => {
    const id = '999';
    const user = users.getUser(id);

    expect(user).toBeFalsy();
  });

  it('should add new user', () => {
    const users = new Users();
    const user = {
      id: '123',
      name: 'Karl',
      room: 'Idiot Abroad'
    };
    const responseUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should get user names for The Office room', () => {
    const userList = users.getUserList('The Office');

    expect(userList).toEqual(['Ricky', 'Stephen']);
  });

  it('should get user names for Idiot Abroad room', () => {
    const userList = users.getUserList('Idiot Abroad');

    expect(userList).toEqual(['Warren']);
  });
});
