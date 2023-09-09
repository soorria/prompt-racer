// eslint-disable-next-line import/no-anonymous-default-export
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_URL,
      applicationID: "convex",
    },
  ],
}
