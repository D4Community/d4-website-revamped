import {UsersIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const teamMemberType = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: 'designation',
      title: 'Designation',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'group',
      title: 'Group',
      type: 'string',
      options: {
        list: [
          {title: 'Organizer', value: 'organizer'},
          {title: 'Co-Organizer', value: 'co-organizer'},
          {title: 'Leads', value: 'leads'},
          {title: 'Core', value: 'core'},
          {title: 'Volunteer', value: 'volunteer'},
          {title: 'Campus team', value: 'campus'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'campus',
      title: 'Campus',
      type: 'reference',
      to: [{type: 'campus'}],
      description: 'Set on a campus lead, or on a campus team member.',
      hidden: ({document}) => document?.group !== 'campus' && document?.group !== 'leads',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const group = (context.document as {group?: string})?.group
          if (group === 'campus' && !value) return 'Campus is required for campus team members'
          return true
        }),
    }),
    defineField({
      name: 'description',
      title: 'About',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      validation: (Rule) => Rule.regex(/^[+()\-\d\s]{7,20}$/, {
        name: 'phone number',
      }),
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (Rule) => Rule.max(120),
        }),
      ],
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'github',
      title: 'GitHub',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'twitter',
      title: 'Twitter / X',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'medium',
      title: 'Medium',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'portfolio',
      title: 'Portfolio / Website',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (Rule) =>
        Rule.custom((endDate, context) => {
          const startDate = (context.document as {startDate?: string})?.startDate
          if (!endDate || !startDate) return true
          return endDate >= startDate
            ? true
            : 'End date must be on or after start date'
        }),
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
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'designation',
      media: 'image',
      group: 'group',
      active: 'isActive',
      campusName: 'campus.name',
    },
    prepare(selection) {
      const {title, subtitle, media, group, active, campusName} = selection
      const groupLabel = group ? String(group).toUpperCase() : 'UNASSIGNED'
      const statusLabel = active ? 'Active' : 'Inactive'
      const campusLabel = campusName ? ` • ${campusName}` : ''

      return {
        title,
        subtitle: `${subtitle || 'No designation'} • ${groupLabel}${campusLabel} • ${statusLabel}`,
        media,
      }
    },
  },
})
