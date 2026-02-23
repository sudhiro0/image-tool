export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Image Processing Tools',
  url: 'https://yourdomain.com',
  description: 'Free online image processing tools for resizing, converting, and creating PDFs',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '',
    contactType: 'Customer Service'
  }
}

export const toolSchema = (toolName, description, url) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: toolName,
  description: description,
  url: `https://yourdomain.com${url}`,
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  }
})

export const faqSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
})

export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `https://yourdomain.com${item.url}`
  }))
})
