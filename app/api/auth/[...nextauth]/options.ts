import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: {label: "Username", type: "text", placeholder: ""},
                password: {label: "Password", type: "password", placeholder:""}
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {username: credentials.identifier}
                        ]
                    })
                    if(!user) {
                        throw new Error('No user found with this email')
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if(isPasswordCorrect){
                        return user
                    }
                    else {
                        throw new Error('Incorrect Password')
                    }
                }
                catch(error) {
                    console.error("Authorization error:", error);
                    throw new Error("Unable to authorize user.");
                }
            }    
        })
    ],

    callbacks: {
        async session({session, token}) {
            if(token) {
                session.user._id = token._id
                session.user.username = token.username
            }
            return session
        },
        async jwt({token, user}) {
            if(user) {
                token._id = user._id?.toString()
                token.username = user.username;
            }
            return token
        }
    },

    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.AUTH_SECRET
}