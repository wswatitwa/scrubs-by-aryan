import React, { useEffect } from 'react';

interface SocialFeedProps {
    postUrl?: string;
    pageId?: string;
    pageUrl?: string;
}

const SocialFeed: React.FC<SocialFeedProps> = ({ postUrl, pageId, pageUrl }) => {
    useEffect(() => {
        // Reparse XFBML when component mounts or URL changes
        // @ts-ignore
        if (window.FB) {
            // @ts-ignore
            window.FB.XFBML.parse();
        }
    }, [postUrl, pageId, pageUrl]);

    if (!postUrl && !pageId && !pageUrl) return null;

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/5">
            <div className="flex flex-col items-center gap-8 text-center mb-12">
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                    Live <span className="text-blue-600">Feed.</span>
                </h2>
                <p className="text-white/40 font-bold tracking-widest text-xs uppercase">Latest Updates from our Community</p>
            </div>

            <div className="flex justify-center">
                {postUrl ? (
                    <div
                        className="fb-post"
                        data-href={postUrl}
                        data-width="300"
                        data-show-text="true"
                    ></div>
                ) : (
                    pageUrl && (
                        <div
                            data-href={pageUrl}
                            data-tabs="timeline"
                            data-width="300"
                            data-height=""
                            data-small-header="false"
                            data-adapt-container-width="true"
                            data-hide-cover="false"
                            data-show-facepile="true">
                            <blockquote cite={pageUrl} className="fb-xfbml-parse-ignore">
                                <a href={pageUrl}>CRUBS</a>
                            </blockquote>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default SocialFeed;
