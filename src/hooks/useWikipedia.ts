import { useState, useEffect } from 'react';

export function useWikipedia(siteName: string, country: string) {
  const [data, setData] = useState<{ extract: string; images: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchWiki() {
      try {
        setLoading(true);
        // 1. Search for the clearest Wikipedia match
        const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(siteName + ' ' + country)}&utf8=&format=json&origin=*`);
        const searchData = await searchRes.json();
        
        if (searchData.query?.search?.length > 0) {
          const title = searchData.query.search[0].title;
          
          // 2. Fetch the introductory extract and main image
          const extractRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&exintro=1&explaintext=1&piprop=original|thumbnail&pithumbsize=1200&titles=${encodeURIComponent(title)}&format=json&origin=*`);
          const extractData = await extractRes.json();
          const pages = extractData.query?.pages || {};
          const pageId = Object.keys(pages)[0];
          const extract = pages[pageId]?.extract;
          const mainImage = pages[pageId]?.thumbnail?.source || pages[pageId]?.original?.source;

          // 3. Fetch images for gallery via search in commons, which often yields better visual results than just page embedded images
          const imagesRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(title + " " + country)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json&origin=*`);
          const imagesData = await imagesRes.json();
          const imagePages = imagesData.query?.pages || {};
          
          let validImages: string[] = [];
          if (mainImage) validImages.push(mainImage);

          if (Object.keys(imagePages).length > 0) {
            const moreImages = Object.values(imagePages)
              // @ts-ignore
              .map((p: any) => p.imageinfo?.[0]?.thumburl || p.imageinfo?.[0]?.url)
              .filter((url: string | undefined) => {
                if (!url) return false;
                const lower = url.toLowerCase();
                // ONLY accept proper image formats
                return lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png');
              })
              .filter((url: string) => {
                const lower = url.toLowerCase();
                // Filter out icons, maps, flags, logos
                return !lower.includes('flag') && 
                       !lower.includes('map') && 
                       !lower.includes('locator') && 
                       !lower.includes('logo') && 
                       !lower.includes('symbol') && 
                       !lower.includes('icon') &&
                       !lower.includes('coa') && // coat of arms
                       !lower.includes('blank');
              });
            validImages = [...validImages, ...moreImages];
            // remove duplicates
            validImages = Array.from(new Set(validImages)).slice(0, 8);
          }

          if (isMounted) {
             setData({
               extract: extract || '',
               images: validImages
             });
          }
        } else {
             if (isMounted) setData(null);
        }
      } catch (e) {
        console.error("Wiki fetch error", e);
        if (isMounted) setData(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (siteName) {
      fetchWiki();
    }
    
    return () => { isMounted = false; };
  }, [siteName, country]);

  return { wikiData: data, wikiLoading: loading };
}
