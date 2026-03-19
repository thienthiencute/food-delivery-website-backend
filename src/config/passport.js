const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const { getUser, compareData, hashData } = require("@helpers/validationHelper");
const { userModel } = require("@models/index");

const usePassportLocalStrategy = (passport) => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: "phone",
                passwordField: "password",
                passReqToCallback: true,
            },
            async (req, phone, password, cb) => {
                try {
                    const { countryCode } = req.body.country;
                    console.log("🚀  phone:", phone);

                    // get user from database
                    const user = await getUser(countryCode, phone);
                    if (!user) {
                        return cb(null, false, { message: "Incorrect phone number." });
                    }

                    // check password
                    const isValidPassword = await compareData(password, user.password);
                    if (!isValidPassword) {
                        return cb(null, false, { message: "Incorrect password." });
                    }

                    // Return user object if authentication is successful
                    return cb(null, user);
                } catch (err) {
                    return cb(err);
                }
            },
        ),
    );

    passport.serializeUser(function (user, cb) {
        process.nextTick(function () {
            cb(null, { id: user.id, username: user.username });
        });
    });

    passport.deserializeUser(function (user, cb) {
        process.nextTick(function () {
            return cb(null, user);
        });
    });
};

const usePassportGoogleStrategy = (passport) => {
    const googleClientID = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET_ID;
    const googleRedirectUrl = process.env.GOOGLE_REDIRECT_LOGIN;

    passport.use(
        new GoogleStrategy(
            {
                clientID: googleClientID,
                clientSecret: googleClientSecret,
                callbackURL: googleRedirectUrl,
                passReqToCallback: true,
            },
            async (req, accessToken, refreshToken, profile, cb) => {
                try {
                    console.log("\n\nProfile: ", profile._json);

                    const { sub, name, picture, email } = profile._json;

                    const hashedEmail = await hashData(email);

                    // save user in database
                    const [user, created] = await userModel.findOrCreate({
                        where: { user_id: sub },
                        defaults: {
                            user_id: sub,
                            fullname: name,
                            username: name,
                            email: hashedEmail,
                            avatar_path: picture,
                            type_login: "Google",
                            password: "*",
                            country_code: "*",
                            phone_number: "*",
                        },
                    });

                    if (created) {
                        console.log("\n\nNew user created: ", user);
                        return cb(null, profile);
                    } else {
                        console.log("\n\nUser found: ", user);
                    }
                    return cb(null, profile);
                } catch (error) {
                    return cb(error);
                }
            },
        ),
    );

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
};

const usePassportFacebookStrategy = (passport) => {
    const facebookClientID = process.env.FACEBOOK_APP_ID;
    const facebookClientSecret = process.env.FACEBOOK_APP_SECRET_ID;
    const facebookRedirectUrl = process.env.FACEBOOK_REDIRECT_LOGIN;

    passport.use(
        new FacebookStrategy(
            {
                clientID: facebookClientID,
                clientSecret: facebookClientSecret,
                callbackURL: facebookRedirectUrl,
                profileFields: ["id", "displayName", "photos", "email"],
                enableProof: true,
                passReqToCallback: true,
            },
            async (req, accessToken, refreshToken, profile, cb) => {
                try {
                    console.log("\n\nProfile: ", profile._json);
                    const { id, name, picture, email } = profile._json;

                    const hashedEmail = await hashData(email);

                    // save user in database
                    const [user, created] = await userModel.findOrCreate({
                        where: { user_id: id },
                        defaults: {
                            user_id: id,
                            fullname: name,
                            username: name,
                            email: hashedEmail,
                            avatar_path: picture.data.url,
                            type_login: "Facebook",
                            password: "*",
                            country_code: "*",
                            phone_number: "*",
                        },
                    });

                    if (created) {
                        console.log("\n\nNew user created: ", user);
                        return cb(null, profile);
                    } else {
                        console.log("\n\nUser found: ", user);
                    }
                    return cb(null, profile);
                } catch (error) {
                    return cb(error);
                }
            },
        ),
    );

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
};

module.exports = {
    usePassportLocalStrategy,
    usePassportGoogleStrategy,
    usePassportFacebookStrategy,
};
