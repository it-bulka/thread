import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import {
  onWhDeleteMemberFromOrganization,
  onWhOrganisationCreated,
  onWhOrganisationInvitationCreated,
  onWhOrganisationMemberCreated,
  onWhOrganizationDelete,
  onWhOrganizationUpdate,
  onWhUserDeleted,
  onWhUserUpdated,
} from '@/services/webhooks';

export async function POST(req: Request) {

  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  const eventType = evt.type;

  switch (eventType) {
    case 'user.deleted':
      return await onWhUserDeleted({ authId: evt.data.id ?? '' })

    case 'user.updated':
      return await onWhUserUpdated({
        authId: evt.data.id,
        image: evt.data.image_url,
      })

    case "organization.created":
      const { id, name, image_url, logo_url, created_by, slug } = evt.data;
      return await onWhOrganisationCreated({
        id,
        name,
        username: slug || '',
        image: logo_url || image_url,
        bio: "org bio",
        createdById: created_by
      })

    case 'organizationInvitation.created':
      return await onWhOrganisationInvitationCreated()

    case 'organizationMembership.created':
      const { organization, public_user_data } = evt?.data;
      return await onWhOrganisationMemberCreated({
        communityId: organization.id,
        memberId: public_user_data.user_id
      })

    case 'organizationMembership.deleted':
      return await onWhDeleteMemberFromOrganization({
        communityId: evt?.data.id,
        userId: evt?.data.public_user_data.user_id
      })

    case 'organization.updated':
      return await onWhOrganizationUpdate({
        communityId: evt.data.id,
        name: evt.data.name,
        username: evt.data.slug || '',
        image: evt.data.logo_url || evt.data.image_url
      })

    case 'organization.deleted':
      return await onWhOrganizationDelete(evt?.data.id || '')

    default:
      return new Response('', { status: 200 })
  }
}
