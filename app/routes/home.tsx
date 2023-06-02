import { json, type LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { Layout } from "~/components/layout";
import { UserPanel } from "~/components/user-panel";
import { getUser, requireUserId } from "~/utils/auth.server";
import { getFilteredKudos, getRecentKudos } from "~/utils/kudos.server";
import { getOtherUsers } from "~/utils/user.server";
import type { Kudo as TKudo, Profile, User, Prisma } from "@prisma/client";
import { Kudo } from "~/components/kudo";
import { SearchKudos } from "~/components/search-kudos";
import type { KudoWithRecipient } from "~/components/recent-bar";
import { RecentBar } from "~/components/recent-bar";
import { UserCircle } from "~/components/user-circle";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const sort = url.searchParams.get("sort");
  const filter = url.searchParams.get("filter");

  // 2
  let sortOptions: Prisma.KudoOrderByWithRelationInput = {};
  if (sort) {
    if (sort === "date") {
      sortOptions = { createdAt: "desc" };
    }
    if (sort === "sender") {
      sortOptions = { author: { profile: { firstName: "asc" } } };
    }
    if (sort === "emoji") {
      sortOptions = { style: { emoji: "asc" } };
    }
  }

  // 3
  let textFilter: Prisma.KudoWhereInput = {};
  if (filter) {
    textFilter = {
      OR: [
        { message: { mode: "insensitive", contains: filter } },
        {
          author: {
            OR: [
              {
                profile: {
                  is: { firstName: { mode: "insensitive", contains: filter } },
                },
              },
              {
                profile: {
                  is: { lastName: { mode: "insensitive", contains: filter } },
                },
              },
            ],
          },
        },
      ],
    };
  }

  const user = await getUser(request);
  const recentKudos = await getRecentKudos();
  const userId = await requireUserId(request);
  const users: User[] = await getOtherUsers(userId);
  const kudos: Omit<TKudo, "createdAt" | "authorId" | "recipientId">[] =
    await getFilteredKudos(userId, sortOptions, textFilter);
  return json({ users, kudos, recentKudos, user });
};

interface KudoWithProfile extends TKudo {
  author: {
    profile: Profile;
  };
}

type DataType = {
  user: User;
  users: User[];
  kudos: KudoWithProfile[];
  recentKudos: KudoWithRecipient[];
};

export default function Home() {
  const { users, kudos, recentKudos, user } =
    useLoaderData() as unknown as DataType;
  const navigate = useNavigate();
  return (
    <Layout>
      <Outlet />
      <div className="h-full flex">
        <UserPanel users={users} />
        <div className="flex-1 flex flex-col">
          <div className="w-full px-10 h-20 flex items-center justify-between gap-x- border-b-2 border-b-gray-200">
            <SearchKudos />
            <UserCircle
              className="h-14 w-14 transition duration-300 ease-in-out hover:scale-110 hover:border-2 hover:border-gray-200"
              profile={user.profile}
              onClick={() => navigate("profile")}
            />
          </div>
          <div className="flex-1 flex">
            <div className="w-full p-10 flex flex-col gap-y-4">
              {kudos.map((kudo: KudoWithProfile) => (
                <Kudo key={kudo.id} kudo={kudo} profile={kudo.author.profile} />
              ))}
            </div>
            <RecentBar kudos={recentKudos} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
