import type {
  ContentModule,
  Page,
  Section,
  LayoutPreset,
  PublicTheme,
  Asset,
  Work,
  MarketplaceItem,
  License,
  User,
  Album,
  Category,
  PressLogo,
  PressArticle,
  BlogPost,
  SiteBranding
} from '../types';

import {
  mockUser,
  mockLicense,
  mockAssets,
  mockWorks,
  mockLayoutPresets,
  mockContentModules,
  mockPages,
  mockSections,
  mockThemes,
  mockMarketplaceItems,
  mockCategories,
  mockAlbums,
  mockPressLogos,
  mockPressArticles,
  mockBlogPosts,
  mockBranding
} from '../data/mockData';

// Inicializar almacenamiento local/session para persistencia en el prototipo
const STORAGE_PREFIX = 'prisma_editor_';

function getStored<T>(key: string, defaultValue: T): T {
  const data = sessionStorage.getItem(STORAGE_PREFIX + key);
  if (!data) return defaultValue;
  try {
    return JSON.parse(data) as T;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  sessionStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
}

// Estados persistidos en sesión
let modulesState = getStored<ContentModule[]>('modules', mockContentModules);
let pagesState = getStored<Page[]>('pages', mockPages);
let sectionsState = getStored<Section[]>('sections', mockSections);
let themesState = getStored<PublicTheme[]>('themes', mockThemes);
let assetsState = getStored<Asset[]>('assets', mockAssets);
let worksState = getStored<Work[]>('works', mockWorks);
let marketplaceState = getStored<MarketplaceItem[]>('marketplace', mockMarketplaceItems);
let licenseState = getStored<License>('license', mockLicense);
let userState = getStored<User>('user', mockUser);
let categoriesState = getStored<Category[]>('categories', mockCategories);
let albumsState = getStored<Album[]>('albums', mockAlbums);
let pressLogosState = getStored<PressLogo[]>('pressLogos', mockPressLogos);
let pressArticlesState = getStored<PressArticle[]>('pressArticles', mockPressArticles);
let blogPostsState = getStored<BlogPost[]>('blogPosts', mockBlogPosts);
let brandingState = getStored<SiteBranding>('branding', mockBranding);

// Latencia simulada
const delay = () => new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 150));

export const mockApi = {
  user: {
    get: async (): Promise<User> => {
      await delay();
      return userState;
    },
    update: async (user: User): Promise<User> => {
      await delay();
      userState = user;
      setStored('user', userState);
      return userState;
    }
  },

  license: {
    get: async (): Promise<License> => {
      await delay();
      return licenseState;
    }
  },

  modules: {
    list: async (): Promise<ContentModule[]> => {
      await delay();
      return [...modulesState].sort((a, b) => a.order - b.order);
    },
    get: async (key: string): Promise<ContentModule | undefined> => {
      await delay();
      return modulesState.find(m => m.key === key);
    },
    update: async (key: string, fields: ContentModule['fields'], items?: any[]): Promise<ContentModule> => {
      await delay();
      modulesState = modulesState.map(m => {
        if (m.key === key) {
          return { ...m, fields, items };
        }
        return m;
      });
      setStored('modules', modulesState);
      return modulesState.find(m => m.key === key)!;
    }
  },

  pages: {
    list: async (): Promise<Page[]> => {
      await delay();
      return [...pagesState].sort((a, b) => a.order - b.order);
    },
    update: async (pages: Page[]): Promise<Page[]> => {
      await delay();
      pagesState = pages;
      setStored('pages', pagesState);
      return pagesState;
    },
    save: async (page: Page): Promise<Page> => {
      await delay();
      const exists = pagesState.some(p => p.id === page.id);
      if (exists) {
        pagesState = pagesState.map(p => p.id === page.id ? page : p);
      } else {
        pagesState.push(page);
      }
      setStored('pages', pagesState);
      return page;
    }
  },

  sections: {
    list: async (): Promise<Section[]> => {
      await delay();
      return [...sectionsState].sort((a, b) => a.order - b.order);
    },
    update: async (sections: Section[]): Promise<Section[]> => {
      await delay();
      sectionsState = sections;
      setStored('sections', sectionsState);
      return sectionsState;
    },
    updatePreset: async (sectionId: string, presetId: string): Promise<Section> => {
      await delay();
      sectionsState = sectionsState.map(s => s.id === sectionId ? { ...s, presetId } : s);
      setStored('sections', sectionsState);
      return sectionsState.find(s => s.id === sectionId)!;
    },
    save: async (section: Section): Promise<Section> => {
      await delay();
      const exists = sectionsState.some(s => s.id === section.id);
      if (exists) {
        sectionsState = sectionsState.map(s => s.id === section.id ? section : s);
      } else {
        sectionsState.push(section);
      }
      setStored('sections', sectionsState);
      return section;
    },
    delete: async (id: string): Promise<boolean> => {
      await delay();
      sectionsState = sectionsState.filter(s => s.id !== id);
      setStored('sections', sectionsState);
      return true;
    }
  },

  themes: {
    list: async (): Promise<PublicTheme[]> => {
      await delay();
      return themesState;
    },
    getActive: async (): Promise<PublicTheme> => {
      await delay();
      return themesState.find(t => t.active) || themesState[0]!;
    },
    setActive: async (id: string): Promise<PublicTheme> => {
      await delay();
      themesState = themesState.map(t => ({ ...t, active: t.id === id }));
      setStored('themes', themesState);
      return themesState.find(t => t.active)!;
    }
  },

  presets: {
    list: async (): Promise<LayoutPreset[]> => {
      await delay();
      return mockLayoutPresets;
    }
  },

  assets: {
    list: async (): Promise<Asset[]> => {
      await delay();
      return assetsState;
    },
    upload: async (asset: Omit<Asset, 'id'>): Promise<Asset> => {
      await delay();
      const newAsset: Asset = {
        ...asset,
        id: `asset-${Date.now()}`
      };
      assetsState = [newAsset, ...assetsState];
      setStored('assets', assetsState);
      return newAsset;
    },
    update: async (id: string, name: string, category: string): Promise<Asset> => {
      await delay();
      assetsState = assetsState.map(a => a.id === id ? { ...a, name, category } : a);
      setStored('assets', assetsState);
      return assetsState.find(a => a.id === id)!;
    },
    delete: async (id: string): Promise<boolean> => {
      await delay();
      assetsState = assetsState.filter(a => a.id !== id);
      setStored('assets', assetsState);
      return true;
    }
  },

  works: {
    list: async (): Promise<Work[]> => {
      await delay();
      return worksState;
    },
    get: async (id: string): Promise<Work | undefined> => {
      await delay();
      return worksState.find(w => w.id === id);
    },
    save: async (work: Work): Promise<Work> => {
      await delay();
      const exists = worksState.some(w => w.id === work.id);
      if (exists) {
        worksState = worksState.map(w => w.id === work.id ? work : w);
      } else {
        worksState = [work, ...worksState];
      }
      setStored('works', worksState);
      return work;
    },
    delete: async (id: string): Promise<boolean> => {
      await delay();
      worksState = worksState.filter(w => w.id !== id);
      setStored('works', worksState);
      return true;
    }
  },

  categories: {
    list: async (): Promise<Category[]> => {
      await delay();
      return [...categoriesState].sort((a, b) => a.order - b.order);
    },
    save: async (category: Category): Promise<Category> => {
      await delay();
      const exists = categoriesState.some(c => c.id === category.id);
      if (exists) {
        categoriesState = categoriesState.map(c => c.id === category.id ? category : c);
      } else {
        categoriesState = [...categoriesState, category];
      }
      setStored('categories', categoriesState);
      return category;
    },
    delete: async (id: string): Promise<boolean> => {
      await delay();
      categoriesState = categoriesState.filter(c => c.id !== id);
      setStored('categories', categoriesState);
      return true;
    },
    updateOrder: async (categories: Category[]): Promise<Category[]> => {
      await delay();
      categoriesState = categories;
      setStored('categories', categoriesState);
      return categoriesState;
    }
  },

  albums: {
    list: async (): Promise<Album[]> => {
      await delay();
      return albumsState;
    },
    get: async (id: string): Promise<Album | undefined> => {
      await delay();
      return albumsState.find(a => a.id === id);
    },
    save: async (album: Album): Promise<Album> => {
      await delay();
      const exists = albumsState.some(a => a.id === album.id);
      if (exists) {
        albumsState = albumsState.map(a => a.id === album.id ? album : a);
      } else {
        albumsState = [album, ...albumsState];
      }
      setStored('albums', albumsState);
      return album;
    },
    delete: async (id: string): Promise<boolean> => {
      await delay();
      albumsState = albumsState.filter(a => a.id !== id);
      setStored('albums', albumsState);
      return true;
    }
  },

  press: {
    listLogos: async (): Promise<PressLogo[]> => {
      await delay();
      return pressLogosState;
    },
    saveLogo: async (logo: PressLogo): Promise<PressLogo> => {
      await delay();
      const exists = pressLogosState.some(l => l.id === logo.id);
      if (exists) {
        pressLogosState = pressLogosState.map(l => l.id === logo.id ? logo : l);
      } else {
        pressLogosState = [...pressLogosState, logo];
      }
      setStored('pressLogos', pressLogosState);
      return logo;
    },
    deleteLogo: async (id: string): Promise<boolean> => {
      await delay();
      pressLogosState = pressLogosState.filter(l => l.id !== id);
      setStored('pressLogos', pressLogosState);
      return true;
    },
    listArticles: async (): Promise<PressArticle[]> => {
      await delay();
      return pressArticlesState;
    },
    getArticle: async (id: string): Promise<PressArticle | undefined> => {
      await delay();
      return pressArticlesState.find(a => a.id === id);
    },
    saveArticle: async (article: PressArticle): Promise<PressArticle> => {
      await delay();
      const exists = pressArticlesState.some(a => a.id === article.id);
      if (exists) {
        pressArticlesState = pressArticlesState.map(a => a.id === article.id ? article : a);
      } else {
        pressArticlesState = [article, ...pressArticlesState];
      }
      setStored('pressArticles', pressArticlesState);
      return article;
    },
    deleteArticle: async (id: string): Promise<boolean> => {
      await delay();
      pressArticlesState = pressArticlesState.filter(a => a.id !== id);
      setStored('pressArticles', pressArticlesState);
      return true;
    }
  },

  blog: {
    list: async (): Promise<BlogPost[]> => {
      await delay();
      return blogPostsState;
    },
    get: async (id: string): Promise<BlogPost | undefined> => {
      await delay();
      return blogPostsState.find(p => p.id === id);
    },
    save: async (post: BlogPost): Promise<BlogPost> => {
      await delay();
      const exists = blogPostsState.some(p => p.id === post.id);
      if (exists) {
        blogPostsState = blogPostsState.map(p => p.id === post.id ? post : p);
      } else {
        blogPostsState = [post, ...blogPostsState];
      }
      setStored('blogPosts', blogPostsState);
      return post;
    },
    delete: async (id: string): Promise<boolean> => {
      await delay();
      blogPostsState = blogPostsState.filter(p => p.id !== id);
      setStored('blogPosts', blogPostsState);
      return true;
    }
  },

  branding: {
    get: async (): Promise<SiteBranding> => {
      await delay();
      return brandingState;
    },
    save: async (branding: SiteBranding): Promise<SiteBranding> => {
      await delay();
      brandingState = branding;
      setStored('branding', brandingState);
      return brandingState;
    }
  },

  marketplace: {
    list: async (): Promise<MarketplaceItem[]> => {
      await delay();
      return marketplaceState;
    },
    install: async (id: string): Promise<MarketplaceItem> => {
      await delay();
      marketplaceState = marketplaceState.map(item => {
        if (item.id === id) {
          // Si era 'available' pasa a 'installed', si era 'update' pasa a 'installed'
          return { ...item, state: 'installed' };
        }
        return item;
      });
      setStored('marketplace', marketplaceState);

      // Si se instala un theme, agregarlo a la lista de temas disponibles si no existe
      const item = marketplaceState.find(it => it.id === id);
      if (item && item.kind === 'theme') {
        const themeExists = themesState.some(t => t.name === item.name);
        if (!themeExists) {
          const newTheme: PublicTheme = {
            id: `theme-${Date.now()}`,
            name: item.name,
            thumbnailUrl: item.thumbnailUrl,
            active: false,
            tokens: {
              bg: '#EAEAEA',
              fg: '#121212',
              primary: '#6366F1',
              accent: '#3B82F6',
              border: '#D1D5DB',
              fontFamily: 'Geist, sans-serif',
              radius: '4px',
              spacing: 'normal'
            },
            presetMap: {
              'hero': 'hero-minimal',
              'gallery': 'gallery-grid',
              'about': 'about-classic',
              'exhibitions': 'exhibitions-timeline'
            }
          };
          themesState = [...themesState, newTheme];
          setStored('themes', themesState);
        }
      }
      return marketplaceState.find(it => it.id === id)!;
    }
  }
};
