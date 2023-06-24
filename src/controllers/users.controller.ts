import UserModel from "../models/user.model";
import express, { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import bodyParser from "body-parser"
import dotenv from "dotenv"
dotenv.config();
import cookieParser from "cookie-parser";
import passport from "passport";
const JwtStrategy = require("passport-jwt").Strategy;



const app = express();
const userModel = new UserModel();
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
passport.use(JwtStrategy);
app.use(passport.initialize());


export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (getUserId(req, next)) {
            res.send("User is signed in");
            return;
        }
        else {

            const user = await userModel.signUp(req);
            sendToken(res, user);

        }

    } catch (error) {
        const err = new Error(`Unable to create (${(error as Error).message})`);
        err.name = "user already exists";
        next(err);
    }
};
export const getSignedUser = async (req: Request, res: Response, next: NextFunction) => {

    try {
        passport.authenticate("jwt", { session: false }, function (err: any, user: any, info: any) {
            if (err) {

                return next(err);
            }
            if (!user) {
                // Handle failed authentication
                return res.redirect("/login");
            }
            // Successful authentication

            console.log("auth successful");
            res.render("user", { user });

        })(req, res, next);

    } catch (error) {
        next(error);
    }
};
export const updateUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        passport.authenticate("jwt", { session: false }, async function (err: any, user: any, info: any) {
            if (err) {

                return next(err);
            }
            if (!user) {
                // Handle failed authentication
                return res.redirect("/login");
            }
            // Successful authentication
            try {
                const updatedUser = await userModel.updateCurrentUser(user.id, req);
                if (updatedUser)
                    res.send(updatedUser.name);
                else res.send("no user found");
            } catch (error) {
                next(error);
            }

        })(req, res, next);

    } catch (error) {
        next(error);
    }
};

export const updateCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.token_secret as unknown as string) as JwtPayload;
        const oldEmail = decodedToken.user.email;
        const userId= getUserId(req, next)
        if(userId){
            const user = await userModel.updateCurrentUser(userId, req);
            console.log(user.email);
            console.log(req.body.email);
    
            if (user && oldEmail !== user.email) {
                console.log("changed email");
                res.cookie("jwt", "", { httpOnly: true, maxAge: 1 });
                res.redirect("/");
            } else if (user)
                res.send(user);

        }
        else throw new Error("you can't change your profile right now. something went wrong")
    } catch (error) {
        next(error);
    }
};

const maxAge = 30 * 24 * 60 * 60;
export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (getUserId(req, next)) {
            res.send("User is already signed in");
            return;
        }
        else {
            console.log("not");
            const { email, password } = req.body;
            const user = await userModel.signIn(email, password);
            if (!user) {
                return res.render("failed");
            }
            sendToken(res, user);

        }


    } catch (error) {
        next(error)
    }
}
export const signOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.isAuthenticated()) {
            console.log("signed out");

            res.cookie("jwt", "", { httpOnly: true, maxAge: 1 });
            res.redirect("/");
        }
        else {
            console.log("already signed Up");
            res.send("user already signed Up ");

        }

    } catch (error) {
        next(error)
    }
}

function sendToken(res: Response, user: any) {
    const token = jwt.sign({ user }, process.env.token_secret as unknown as string, { expiresIn: maxAge });
    console.log(token);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect("/");

}

function getUserId(req: Request, next: NextFunction) {

    const token = req.cookies.jwt;
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.token_secret as unknown as string) as JwtPayload;
            return decodedToken.user.id;
        } catch (error) {
            next(error)
        }
    } else {
        return 0;

    }
}
