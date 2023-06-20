
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
 
function initialize(passport:any, getUserByEmail:any) {
  const authenticateUser = async (email:string, password:string, done:any) => {
    const user = await getUserByEmail(email);
    if (user == null) {
      return done(null, false, { message: "User not found" });
    }
 
    try {
        console.log(user);
        
      if (await bcrypt.compare(`${password}${process.env.bcrypt_password}`, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Invalid credentials" });
      }
    } catch (e) {
      return done(e);
    }
  };
 
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user:any, done:any) => done(null, user.email));
  passport.deserializeUser((email:string, done:any) => {
    return done(null, getUserByEmail(email));
  });
}
 
module.exports = initialize;