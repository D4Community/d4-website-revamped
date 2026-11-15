import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {campusType} from './campusType'
import {teamMemberType} from './teamMemberType'
import {eventType} from './eventType'
import {galleryType} from './galleryType'
import {partnerType} from './partnerType'
import {communityPartnerType} from './communityPartnerType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    campusType,
    teamMemberType,
    eventType,
    galleryType,
    partnerType,
    communityPartnerType,
  ],
}
