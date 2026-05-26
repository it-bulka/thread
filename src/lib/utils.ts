import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/services';
import { redirect } from 'next/navigation';
import { Pages } from '@/consts';
import { IUserRes } from '@/types';
import { useSearchParams } from 'next/navigation';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const checkExistedUser = async (redirectToOnboard: boolean = true): Promise<Pick<IUserRes, 'username' | 'name' | 'bio' | 'image' | 'authId' | 'threads'> | null> => {
  const user = await currentUser();
  if (!user) redirect(Pages.SIGN_IN)

  const userInfoResult = await fetchUser(user.id);
  if (!userInfoResult.ok) throw new Error(userInfoResult.error)
  const userInfo = userInfoResult.data

  if (!userInfo?.onboarded && redirectToOnboard) redirect(Pages.ONBOARDING);

  const userData = {
    authId: user.id,
    username: userInfo ? userInfo?.username : user.username ?? '',
    name: userInfo ? userInfo?.name : user.firstName ?? '',
    bio: userInfo ? userInfo?.bio : '',
    image: userInfo ? userInfo?.image : user.imageUrl,
    threads: userInfo?.threads || []
  }

  return userData
}

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${time} - ${formattedDate}`;
}

interface IUpdateSearchParams {
  query: string
  value: string
  type?: 'update' | 'add'
}

interface IDeleteSearchParams {
  query: string
  type: 'delete'
}

interface IChangeSearchParams {
  (params: IUpdateSearchParams | IDeleteSearchParams): string
}
export const useChangeSearchParams = (): IChangeSearchParams => {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())

  const updateSearchParam: IChangeSearchParams = (args) => {
    const { type, query } = args
    if (type === 'delete') {
      params.delete(query)
    }


    if (type === 'add') {
      params.delete(query, args.value)
    }

    if (type === 'update') {
      params.delete(query)
      params.set(query, args.value)
    }

    return params.toString()
  }

  return updateSearchParam
}