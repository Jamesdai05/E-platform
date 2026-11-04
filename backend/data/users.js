import 'dotenv/config';
import bcrypt from 'bcrypt';

// Seed accounts get their password from the environment, never from the code
const { SEED_PASSWORD } = process.env;
if (!SEED_PASSWORD) {
  throw new Error('Set SEED_PASSWORD in your environment before seeding the database');
}
const seedPasswordHash = bcrypt.hashSync(SEED_PASSWORD, 10);


const users= [
  {
    name:"Admin user",
    email:"admin@email.com",
    password:seedPasswordHash,
    isAdmin:true,
  },

  {
    name:"John Green",
    email:"jonh_green@email.com",
    password:seedPasswordHash
  },

  {
    name:"Jacky Chan",
    email:"jacky_chan@email.com",
    password:seedPasswordHash
  },

  {
    name:"John Doe",
    email:"john@email.com",
    password:seedPasswordHash
  },

]


export default users;