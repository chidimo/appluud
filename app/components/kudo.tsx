// app/components/kudo.tsx

import { UserCircle } from "~/components/user-circle";
import type { Profile, Kudo as TKudo } from "@prisma/client";
import { colorMap, backgroundColorMap, emojiMap } from "~/utils/constants";

type Props = {
  profile: Profile |null;
  kudo: Partial<TKudo>;
};

export function Kudo({ profile, kudo }: Props) {
    if (!profile) return null;
    
  return (
    <div
      className={`flex ${
        backgroundColorMap[kudo.style?.backgroundColor ?? "RED"]
      } p-4 rounded-xl w-full gap-x-2 relative`}
    >
      <div>
        <UserCircle profile={profile} className="h-16 w-16" />
      </div>
      <div className="flex flex-col">
        <p
          className={`${
            colorMap[kudo.style?.textColor ?? "WHITE"]
          } font-bold text-lg whitespace-pre-wrap break-all`}
        >
          {profile.firstName} {profile.lastName}
        </p>
        <p
          className={`${
            colorMap[kudo.style?.textColor ?? "WHITE"]
          } whitespace-pre-wrap break-all`}
        >
          {kudo.message}
        </p>
      </div>
      <div className="absolute bottom-4 right-4 bg-white rounded-full h-10 w-10 flex items-center justify-center text-2xl">
        {emojiMap[kudo.style?.emoji ?? "THUMBSUP"]}
      </div>
    </div>
  );
}
