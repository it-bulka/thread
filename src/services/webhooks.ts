import { createCommunity, deleteCommunity, type ICreateCommunity, IUpdateCommunityInfo, updateCommunityInfo } from '@/services/communities';
import { addMemberToCommunity, deleteMemberFromCommunity, IAddMemberToCommunity, IDeleteMemberFromCommunity } from '@/services/communityMembership';
import { deleteUser, syncUserImageFromClerk } from '@/services/user';
import { NextResponse } from 'next/server';
import { handleApiError } from '@/lib/handleError';

interface IUserUpdated {
  authId: string;
  image: string;
}
export const onWhUserUpdated = handleApiError(async (params: IUserUpdated) => {
  const result = await syncUserImageFromClerk(params)
  if (!result.ok) return NextResponse.json({ message: result.error }, { status: 500 })
  return NextResponse.json({ message: "User updated" }, { status: 200 })
})


export const onWhOrganisationCreated = handleApiError(async (params: ICreateCommunity) => {
  const result = await createCommunity(params)
  if (!result.ok) return NextResponse.json({ message: result.error }, { status: 500 })
  return NextResponse.json({ message: "User created" }, { status: 201 });
})

export const onWhOrganisationInvitationCreated = handleApiError(async () => {
  {/*TODO: add invitation notification*/}
  return NextResponse.json({ message: "Invitation created" },{ status: 201 })
})

export const onWhOrganisationMemberCreated = handleApiError(async (params: IAddMemberToCommunity) => {
  const result = await addMemberToCommunity(params)
  if (!result.ok) return NextResponse.json({ message: result.error }, { status: 500 })
  return NextResponse.json({ message: "Invitation accepted" },{ status: 201 })
})


export const onWhDeleteMemberFromOrganization = handleApiError(async (params: IDeleteMemberFromCommunity) => {
  const result = await deleteMemberFromCommunity(params)
  if (!result.ok) return NextResponse.json({ message: result.error }, { status: 500 })
  return NextResponse.json({ message: "Member removed" },{ status: 201 })
})

export const onWhOrganizationUpdate = handleApiError(async (params: IUpdateCommunityInfo) => {
  const result = await updateCommunityInfo(params)
  if (!result.ok) return NextResponse.json({ message: result.error }, { status: 500 })
  return NextResponse.json({ message: "Community info updated" },{ status: 201 })
})


export const onWhOrganizationDelete = handleApiError(async (communityId: string) => {
  const result = await deleteCommunity(communityId)
  if (!result.ok) return NextResponse.json({ message: result.error }, { status: 500 })
  return NextResponse.json({ message: "Community deleted" },{ status: 201 })
})


export const onWhUserDeleted = handleApiError(async (params: { authId: string }) => {
  const result = await deleteUser({ userId: params.authId })
  if (!result.ok) return NextResponse.json({ message: result.error }, { status: 500 })
  return NextResponse.json({ message: "User deleted" }, { status: 200 })
})