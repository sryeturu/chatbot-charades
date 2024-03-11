import './globals.css';
import { Cutive, Inter } from 'next/font/google';
import type { Metadata } from 'next'
import Script from 'next/script';
 
export const metadata: Metadata = {
    title: "ChatBot Charades - AI word guessing game",
    description: "Test your wordplay skills with ChatBot Charades. Give clever prompts to make the chatbot say the hidden word. Can you outsmart the AI and master the art of linguistic creativity?",
    alternates: {
        canonical: "https://chatbotcharades.com",
    },
}

const cutive = Cutive({
    subsets: ['latin'],
    variable: '--font-cutive',
    weight: '400',
});

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${cutive.variable}`}>
            <Script>
                {`
                    <script type="text/javascript">
                    (function(window, document, dataLayerName, id) {
                    window[dataLayerName]=window[dataLayerName]||[],window[dataLayerName].push({start:(new Date).getTime(),event:"stg.start"});var scripts=document.getElementsByTagName('script')[0],tags=document.createElement('script');
                    function stgCreateCookie(a,b,c){var d="";if(c){var e=new Date;e.setTime(e.getTime()+24*c*60*60*1e3),d="; expires="+e.toUTCString();f="; SameSite=Strict"}document.cookie=a+"="+b+d+f+"; path=/"}
                    var isStgDebug=(window.location.href.match("stg_debug")||document.cookie.match("stg_debug"))&&!window.location.href.match("stg_disable_debug");stgCreateCookie("stg_debug",isStgDebug?1:"",isStgDebug?14:-1);
                    var qP=[];dataLayerName!=="dataLayer"&&qP.push("data_layer_name="+dataLayerName),isStgDebug&&qP.push("stg_debug");var qPString=qP.length>0?("?"+qP.join("&")):"";
                    tags.async=!0,tags.src="https://chatbotcharades.containers.piwik.pro/"+id+".js"+qPString,scripts.parentNode.insertBefore(tags,scripts);
                    !function(a,n,i){a[n]=a[n]||{};for(var c=0;c<i.length;c++)!function(i){a[n][i]=a[n][i]||{},a[n][i].api=a[n][i].api||function(){var a=[].slice.call(arguments,0);"string"==typeof a[0]&&window[dataLayerName].push({event:n+"."+i+":"+a[0],parameters:[].slice.call(arguments,1)})}}(i[c])}(window,"ppms",["tm","cm"]);
                    })(window, document, 'dataLayer', 'dbde1a13-f9ea-4aab-8a8d-10602b933749');
                    </script>
                `}
            </Script>
            <body>{children}</body>
        </html>
    );
}
