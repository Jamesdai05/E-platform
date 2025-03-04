import bcrypt from 'bcrypt';

const users= [
  {
    name:"Admin user",
    email:"admin@email.com",
    password:bcrypt.hashSync("abc123456",10),
    isAdmin:true,
  },

  {
    name:"John Green",
    email:"jonh_green@email.com",
    password:bcrypt.hashSync("abc123456",10)
  },

  {
    name:"Jacky Chan",
    email:"jacky_chan@email.com",
    password:bcrypt.hashSync("abc123456",10)
  },

  {
    name:"John Doe",
    email:"john@email.com",
    password:bcrypt.hashSync("a123456",10)
  },

]


export default users;