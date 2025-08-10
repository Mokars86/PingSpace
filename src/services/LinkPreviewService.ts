import { LinkPreview } from '../types';

class LinkPreviewService {
  private cache: Map<string, LinkPreview> = new Map();
  private pendingRequests: Map<string, Promise<LinkPreview | null>> = new Map();

  // URL regex pattern
  private urlRegex = /(https?:\/\/[^\s]+)/g;

  // Extract URLs from text
  extractUrls(text: string): string[] {
    const matches = text.match(this.urlRegex);
    return matches || [];
  }

  // Get link preview with caching
  async getLinkPreview(url: string): Promise<LinkPreview | null> {
    // Check cache first
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    // Check if request is already pending
    if (this.pendingRequests.has(url)) {
      return await this.pendingRequests.get(url)!;
    }

    // Create new request
    const request = this.fetchLinkPreview(url);
    this.pendingRequests.set(url, request);

    try {
      const preview = await request;
      if (preview) {
        this.cache.set(url, preview);
      }
      return preview;
    } finally {
      this.pendingRequests.delete(url);
    }
  }

  // Fetch link preview from URL
  private async fetchLinkPreview(url: string): Promise<LinkPreview | null> {
    try {
      // Validate URL
      if (!this.isValidUrl(url)) {
        return null;
      }

      // For demo purposes, we'll simulate different types of previews
      // In a real app, you'd fetch the actual HTML and parse meta tags
      const preview = await this.simulateLinkPreview(url);
      return preview;
    } catch (error) {
      console.error('Failed to fetch link preview:', error);
      return null;
    }
  }

  // Simulate link preview (replace with actual implementation)
  private async simulateLinkPreview(url: string): Promise<LinkPreview | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const domain = this.extractDomain(url);
    
    // Simulate different types of content based on domain
    if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
      return {
        url,
        title: 'Amazing Video Title',
        description: 'This is a great video that you should definitely watch. It contains amazing content.',
        image: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        siteName: 'YouTube',
        favicon: 'https://www.youtube.com/favicon.ico',
        type: 'video',
      };
    }

    if (domain.includes('twitter.com') || domain.includes('x.com')) {
      return {
        url,
        title: 'Tweet from @username',
        description: 'This is an interesting tweet with some great insights about technology.',
        image: 'https://pbs.twimg.com/profile_images/1234567890/avatar.jpg',
        siteName: 'X (Twitter)',
        favicon: 'https://abs.twimg.com/favicons/twitter.3.ico',
        type: 'website',
      };
    }

    if (domain.includes('github.com')) {
      return {
        url,
        title: 'GitHub Repository',
        description: 'A cool open source project that does amazing things with code.',
        image: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        siteName: 'GitHub',
        favicon: 'https://github.com/favicon.ico',
        type: 'website',
      };
    }

    if (this.isImageUrl(url)) {
      return {
        url,
        title: 'Image',
        description: 'Shared image',
        image: url,
        siteName: domain,
        type: 'image',
      };
    }

    // Default website preview
    return {
      url,
      title: 'Website Title',
      description: 'This is a website with some interesting content that you might want to check out.',
      image: 'https://via.placeholder.com/400x200?text=Website+Preview',
      siteName: domain,
      favicon: `https://${domain}/favicon.ico`,
      type: 'website',
    };
  }

  // Extract domain from URL
  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return '';
    }
  }

  // Check if URL is valid
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Check if URL is an image
  private isImageUrl(url: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const lowercaseUrl = url.toLowerCase();
    return imageExtensions.some(ext => lowercaseUrl.includes(ext));
  }

  // Get multiple link previews
  async getLinkPreviews(urls: string[]): Promise<LinkPreview[]> {
    const previews = await Promise.all(
      urls.map(url => this.getLinkPreview(url))
    );
    return previews.filter((preview): preview is LinkPreview => preview !== null);
  }

  // Process message text and get previews
  async processMessageForPreviews(text: string): Promise<LinkPreview[]> {
    const urls = this.extractUrls(text);
    if (urls.length === 0) {
      return [];
    }

    // Limit to first 3 URLs to avoid spam
    const limitedUrls = urls.slice(0, 3);
    return await this.getLinkPreviews(limitedUrls);
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Remove from cache
  removeFromCache(url: string): void {
    this.cache.delete(url);
  }

  // Get cache size
  getCacheSize(): number {
    return this.cache.size;
  }

  // Check if URL is cached
  isCached(url: string): boolean {
    return this.cache.has(url);
  }

  // Preload link preview
  async preloadLinkPreview(url: string): Promise<void> {
    if (!this.isCached(url)) {
      await this.getLinkPreview(url);
    }
  }

  // Batch preload
  async preloadLinkPreviews(urls: string[]): Promise<void> {
    const uncachedUrls = urls.filter(url => !this.isCached(url));
    await Promise.all(uncachedUrls.map(url => this.preloadLinkPreview(url)));
  }
}

export default new LinkPreviewService();
