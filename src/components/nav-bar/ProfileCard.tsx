import { getAuthUser } from "~/lib/auth/user"

export default async function ProfileCard() {
  const user = await getAuthUser()

  return (
    <div className="h-10 w-10 rounded-full bg-gray-200">
      {user && typeof user.user_metadata.avatar_url === "string" && (
        // don't care about optimal images for the profile image
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.user_metadata.avatar_url} alt="avatar" className="h-10 w-10 rounded-full" />
      )}
    </div>
  )
}
