import type { Profile } from '@prisma/client'

interface props {
  profile: Profile
  className?: string
  onClick?: (...args: any) => any
}

export function UserCircle({ profile, onClick, className }: props) {
  return (
    <div
      className={`${className} cursor-pointer bg-blue-700 rounded-full flex justify-center items-center`}
      onClick={onClick}
    >
      <h2 className='text-white text-2xl'>
        {profile.firstName.charAt(0).toUpperCase()}
        {profile.lastName.charAt(0).toUpperCase()}
      </h2>
    </div>
  )
}