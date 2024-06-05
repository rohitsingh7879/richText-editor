import NextAuth from "next-auth"
import Githubprovider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "603351346779-a4skrlsnl40bv9q4b814l252tdfhumo2.apps.googleusercontent.com" as string,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "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" as string,
        }),
        Githubprovider({
            clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "Ov23liKDkgFTL92Yf3dS" as string,
            clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET || "4705723d5bf067c43726bff17bac73c0bc00f15b" as string,
        })
    ],
}

export default NextAuth(authOptions)