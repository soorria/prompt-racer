const clerkAuthConfig = {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_URL,
      applicationId: "convex",
    },
  ],
}

export default clerkAuthConfig
