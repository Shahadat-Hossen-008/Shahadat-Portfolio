import { GlobalConfig } from 'payload'
import { createGlobalSeoTab } from '../tabs/seo/global/index'

export const SiteConfig: GlobalConfig = {
  slug: 'siteConfig',
  label: 'Site Config',
  admin: {
    group: 'Site',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        createGlobalSeoTab,
        {
          name: 'tracking',
          label: 'Tracking',
          fields: [
            {
              name: 'googleTagManagerID',
              label: 'Google Tag Manager ID',
              type: 'text',
              admin: {
                description:
                  'The Google Tag Manager ID for the site. This is used to load the GTM script on every page.',
              },
              validate: (value: string | null | undefined) => {
                if (!value) return true
                const gtmPattern = /^GTM-[A-Z0-9]+$/
                return gtmPattern.test(value)
                  ? true
                  : 'Invalid Google Tag Manager ID format. Expected: GTM-XXXXXXX'
              },
            },
          ],
        },
      ],
    },
  ],
}
