import React, { Suspense } from 'react'
import './globals.css'
import TopLoadingBar from '../../components/TopLoadingBar'
import AuthProvider from '../../components/AuthProvider'
import ServiceWorkerCleanup from '../../components/ServiceWorkerCleanup'
import ErrorSuppressor from '../../components/ErrorSuppressor'
import NotificationPermission from '../../components/NotificationPermission'
import CapacitorInit from '../../components/CapacitorInit'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  metadataBase: new URL('https://thebharatai.vercel.app'),
  title: {
    default: 'Bharat AI - Free AI Chatbot & Assistant Made in India | Advanced AI Tools',
    template: '%s | Bharat AI'
  },
  description: 'Bharat AI: India\'s most advanced free AI chatbot and assistant. Chat with AI, analyze images, generate content, get instant answers. Powered by cutting-edge Indian AI technology. No credit card required. Try now!',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
  },
  keywords: [
    // Primary Keywords
    'Bharat AI',
    'free AI chatbot',
    'AI assistant India',
    'Indian AI chatbot',
    'best AI chatbot India',
    
    // AI Tool Keywords
    'free AI tools',
    'AI chat online',
    'artificial intelligence chatbot',
    'conversational AI',
    'AI assistant free',
    'chatbot India',
    'AI helper',
    
    // Use Case Keywords
    'AI for students',
    'AI homework help',
    'AI writing assistant',
    'AI image analysis',
    'AI content generator',
    'AI question answering',
    
    // Technology Keywords
    'machine learning India',
    'natural language processing',
    'generative AI',
    'AI technology India',
    'Indian tech innovation',
    
    // Location Keywords
    'AI made in India',
    'Indian artificial intelligence',
    'India AI startup',
    'Bharat artificial intelligence',
    
    // Alternative Searches
    'ChatGPT alternative India',
    'free ChatGPT India',
    'AI like ChatGPT',
    'best free AI assistant',
    
    // Developer Keywords
    'Sagar Gupta AI',
    'Indian AI developer',
    'AI innovation India'
  ],
  authors: [{ name: 'Sagar Gupta', url: 'https://github.com/thesagargupta' }],
  creator: 'Sagar Gupta',
  publisher: 'Bharat AI',
  applicationName: 'Bharat AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://thebharatai.vercel.app',
    title: 'Bharat AI - Free AI Chatbot Made in India | Best AI Assistant',
    description: 'India\'s most advanced free AI chatbot. Chat with AI, analyze images, generate content instantly. No signup required. Experience the future of Indian AI technology.',
    siteName: 'Bharat AI',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Bharat AI - India\'s Advanced Free AI Chatbot and Assistant',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bharat AI - Free AI Chatbot Made in India',
    description: 'India\'s most advanced free AI assistant. Chat, analyze images, generate content. Powered by cutting-edge AI technology.',
    images: ['/logo.png'],
    creator: '@thesagargupta',
    site: '@bharatai',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
  verification: {
    google: 'd4268790a4f3d218', // Google Search Console verification
    // yandex: 'yandex-verification-code',
    // bing: 'bing-verification-code',
  },
  alternates: {
    canonical: 'https://thebharatai.vercel.app',
    languages: {
      'en-IN': 'https://thebharatai.vercel.app',
      'en': 'https://thebharatai.vercel.app',
    },
  },
  category: 'technology',
  classification: 'Artificial Intelligence',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Bharat AI',
  },
}

export default function RootLayout({ children }) {
  // Structured Data (JSON-LD) for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://thebharatai.vercel.app/#website',
        'url': 'https://thebharatai.vercel.app',
        'name': 'Bharat AI',
        'description': 'India\'s most advanced free AI chatbot and assistant',
        'inLanguage': 'en-IN',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': 'https://thebharatai.vercel.app/chat?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'WebApplication',
        '@id': 'https://thebharatai.vercel.app/#webapp',
        'name': 'Bharat AI',
        'url': 'https://thebharatai.vercel.app',
        'applicationCategory': 'BusinessApplication',
        'applicationSubCategory': 'Artificial Intelligence',
        'operatingSystem': 'Any',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'INR',
          'availability': 'https://schema.org/InStock'
        },
        'description': 'Free AI chatbot and assistant made in India. Chat with AI, analyze images, generate content instantly.',
        'featureList': [
          'AI Chat',
          'Image Analysis',
          'Content Generation',
          'Question Answering',
          'Multi-language Support',
          'Free to Use'
        ],
        'screenshot': 'https://thebharatai.vercel.app/logo.png',
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.8',
          'ratingCount': '1000',
          'bestRating': '5',
          'worstRating': '1'
        }
      },
      {
        '@type': 'Organization',
        '@id': 'https://thebharatai.vercel.app/#organization',
        'name': 'Bharat AI',
        'url': 'https://thebharatai.vercel.app',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://thebharatai.vercel.app/logo.png',
          'width': 512,
          'height': 512
        },
        'foundingDate': '2024',
        'foundingLocation': {
          '@type': 'Place',
          'address': {
            '@type': 'PostalAddress',
            'addressCountry': 'IN'
          }
        },
        'founder': {
          '@type': 'Person',
          'name': 'Sagar Gupta',
          'url': 'https://github.com/thesagargupta'
        },
        'sameAs': [
          'https://github.com/thesagargupta'
        ]
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://thebharatai.vercel.app/#software',
        'name': 'Bharat AI Chatbot',
        'applicationCategory': 'ChatApplication',
        'operatingSystem': 'Web Browser',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'INR'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.8',
          'ratingCount': '1000'
        }
      }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        {/* SEO Meta Tags */}
        <meta name="theme-color" content="#4F46E5" />
        <meta name="color-scheme" content="light dark" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo.png" />
        <link rel="shortcut icon" href="/logo.png" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://thebharatai.vercel.app" />
        
        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Preconnect to improve performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body>
        <CapacitorInit />
        <AuthProvider>
          <Suspense fallback={null}>
            <TopLoadingBar />
          </Suspense>
          <ServiceWorkerCleanup />
          <ErrorSuppressor />
          <NotificationPermission />
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#333',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                fontFamily: 'inherit',
                fontSize: '14px',
                padding: '14px 20px',
                maxWidth: '500px',
                minWidth: '300px',
                textAlign: 'center',
              },
              success: {
                style: {
                  background: '#f0fdf4',
                  color: '#166534',
                  border: '1px solid #bbf7d0',
                },
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#f0fdf4',
                },
              },
              error: {
                style: {
                  background: '#fef2f2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                },
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fef2f2',
                },
              },
              loading: {
                style: {
                  background: '#fef3c7',
                  color: '#d97706',
                  border: '1px solid #fde68a',
                },
                iconTheme: {
                  primary: '#f59e0b',
                  secondary: '#fef3c7',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
