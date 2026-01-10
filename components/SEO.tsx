import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    keywords?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description = "Top-tier clinical wear for professionals. Premium scrubs, lab coats, and medical accessories by Aryan.",
    image = "/og-image.jpg", // Default OG image if you have one
    url,
    type = 'website',
    keywords = "scrubs, medical apparel, clinical wear, lab coats, doctor uniform, nurse uniform"
}) => {
    const siteTitle = "CRUBS BY ARYAN";
    const fullTitle = `${title} | ${siteTitle}`;

    // Ensure absolute URL for social cards
    const siteUrl = 'https://crubs-by-aryan.vercel.app'; // Or your actual domain
    const canonicalUrl = url ? `${siteUrl}${url}` : siteUrl;
    const absoluteImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={absoluteImage} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={canonicalUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={absoluteImage} />
        </Helmet>
    );
};

export default SEO;
