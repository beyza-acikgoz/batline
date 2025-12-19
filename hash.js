// hash.js
import bcrypt from "bcrypt";

const password = "Admin1234.";
const hash = await bcrypt.hash(password, 10);

console.log(hash);
