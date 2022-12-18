// @ts-ignore
db.createUser({
  user: 'Admin1',
  pwd: 'Admin1',
  roles: [
    {
      role: 'dbOwner',
      db: 'mevn-db',
    },
  ],
})
