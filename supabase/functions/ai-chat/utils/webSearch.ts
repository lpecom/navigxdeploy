export async function searchWeb(query: string) {
  const searchApiKey = Deno.env.get('GOOGLE_SEARCH_API_KEY');
  const searchEngineId = Deno.env.get('GOOGLE_SEARCH_ENGINE_ID');
  
  if (!searchApiKey || !searchEngineId) {
    console.error('Google Search API configuration missing');
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${searchApiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }

    const data = await response.json();
    return data.items?.slice(0, 3).map((item: any) => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link
    }));
  } catch (error) {
    console.error('Error performing web search:', error);
    return null;
  }
}