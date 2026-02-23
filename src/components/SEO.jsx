import { Helmet } from 'react-helmet-async'

export default function SEO({ title, description, keywords, ogImage = '/og-image.png', canonical, schema }) {
  const siteUrl = 'https://yourdomain.com'
  const fullTitle = `${title} | Image Processing Tools`
  const metaDescription = description || 'Professional image editing, conversion, and PDF creation tools'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords.join(', ')} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical || siteUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      {canonical && <link rel="canonical" href={canonical} />}
      {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
    </Helmet>
  )
}
