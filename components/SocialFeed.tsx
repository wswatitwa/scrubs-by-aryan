import React, { useEffect } from 'react';

interface SocialFeedProps {
    postUrl?: string;
}

const SocialFeed: React.FC<SocialFeedProps> = ({ postUrl }) => {
    useEffect(() => {
        // Reparse XFBML when component mounts or URL changes
        // @ts-ignore
        if (window.FB) {
            // @ts-ignore
            window.FB.XFBML.parse();
        }
    }, [postUrl]);

    if (!postUrl) return null;

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/5">
            <div className="flex flex-col items-center gap-8 text-center mb-12">
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                    Live <span className="text-blue-600">Feed.</span>
                </h2>
                <p className="text-white/40 font-bold tracking-widest text-xs uppercase">Latest Updates from our Community</p>
            </div>

            <div className="flex justify-center">
                <div
                    className="fb-post"
                    data-href={postUrl}
                    data-width="500"
                    data-show-text="true"
                ></div>
            </div>
        </div>
    );
};

export default SocialFeed;
