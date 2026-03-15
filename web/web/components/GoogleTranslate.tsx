'use client';

import { useEffect } from 'react';

export default function GoogleTranslate() {
    useEffect(() => {
        if (document.querySelector('#google-translate-script')) {
            return;
        }

        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);

        (window as any).googleTranslateElementInit = () => {
            new (window as any).google.translate.TranslateElement(
                {
                    pageLanguage: 'en',
                    includedLanguages: 'en,es,fr,de,zh-CN,ar,hi,am',
                    autoDisplay: false,
                },
                'google_translate_element'
            );
        };
    }, []);

    return (
        <>
            <div id="google_translate_element" style={{ display: 'none' }}></div>
            <style dangerouslySetInnerHTML={{ __html: `
                .goog-te-banner-frame.skiptranslate {
                    display: none !important;
                }
                body {
                    top: 0px !important;
                }
                .goog-logo-link {
                    display:none !important;
                }
                .goog-te-gadget {
                    color: transparent !important;
                }
            ` }} />
        </>
    );
}
