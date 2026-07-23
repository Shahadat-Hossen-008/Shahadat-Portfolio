import { fingerprint } from '@/lib/fingerprint'
import { APIError, type CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Admin',
  },
  access: {
    read: () => true,
  },
  defaultPopulate: {
    alt: true,
    url: true,
    width: true,
    height: true,
    filename: true,
    mimeType: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'hash',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
  ],
  upload: true,
  hooks: {
    beforeChange: [
      // Remove any client-provided URL. Payload manages this field automatically.
      ({ data }) => {
        delete data?.['url']
        return data
      },
    ],
    beforeValidate: [
      // Generate hash
      async ({ data, req, operation }) => {
        //If nothing is provided, do nothing
        if (!req.file) {
          return
        }
        const payload = req.payload
        const uploadedFileBytes = req.file.data
        const uploadedFileMimeType = req.file.mimetype
        let fileHash: string
        try {
          // Everything else: hash the RAW BYTES exactly as uploaded
          fileHash = fingerprint(uploadedFileBytes)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          payload.logger.error(`[Media Hooks] Could not hash file: ${errorMessage}`)
          throw new APIError('Failed to validate file hash', 400)
        }

        const existingMediaWithSameHash = await payload.find({
          collection: 'media',
          where: {
            hash: { equals: fileHash },
          },
          limit: 1,
          depth: 0,
        })
        // Prevent creation of new file if hash already exists
        //!Todo: add support when update then not allow existing files
        //!queryResults.docs[0].id !== originalDoc.id
        if (existingMediaWithSameHash.totalDocs > 0 && operation === 'create') {
          throw new APIError(
            `A file with the same hash already exists: ${existingMediaWithSameHash.docs[0]?.id}`,
            400,
          )
        }

        //Return the hash
        return {
          ...data,
          hash: fileHash,
        }
      },
    ],
  },
}
