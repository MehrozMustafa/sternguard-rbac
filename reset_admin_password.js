import bcrypt from "bcryptjs";
import { knex } from "./src/config/db.js"; // your knex instance
import { User } from "./src/models/index.js"; // import from index.js

(async () => {
  try {
    const email = "admin@test.com";  // admin email from .env
    const newPassword = "123456";    // new password from .env

    const hashed = await bcrypt.hash(newPassword, 10);

    const updated = await User.query()
      .findOne({ email })
      .patch({ password: hashed });

    if (updated) {
      console.log(`Password for ${email} updated successfully.`);
    } else {
      console.log(`User ${email} not found.`);
    }

    await knex.destroy();
    process.exit(0);
  } catch (err) {
    console.error("Error updating password:", err);
    await knex.destroy();
    process.exit(1);
  }
})();
