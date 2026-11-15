import {PinIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const campusType = defineType({
  name: 'campus',
  title: 'Campus',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Shown under the campus name on the team page.',
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'orderRank',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      active: 'isActive',
    },
    prepare(selection) {
      const {title, active} = selection
      return {
        title,
        subtitle: active ? 'Active' : 'Inactive',
      }
    },
  },
})
