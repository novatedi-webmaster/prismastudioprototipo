import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { ContentModule, Page, Section, ContentField } from '../types';
import { mockApi } from '../mock-api';

interface ModuleContextType {
  modules: ContentModule[];
  pages: Page[];
  sections: Section[];
  loading: boolean;
  updateModuleFields: (key: string, fields: ContentField[], items?: any[]) => Promise<void>;
  reorderPages: (pages: Page[]) => Promise<void>;
  reorderSections: (sections: Section[]) => Promise<void>;
  savePage: (page: Page) => Promise<void>;
  saveSection: (section: Section) => Promise<void>;
  deleteSection: (id: string) => Promise<void>;
  refreshAll: () => Promise<void>;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export function ModuleProvider({ children }: { children: ReactNode }) {
  const [modules, setModules] = useState<ContentModule[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshAll = async () => {
    setLoading(true);
    try {
      const [m, p, s] = await Promise.all([
        mockApi.modules.list(),
        mockApi.pages.list(),
        mockApi.sections.list()
      ]);
      setModules(m);
      setPages(p);
      setSections(s);
    } catch (err) {
      console.error('Failed to load module data', err);
    } finally {
      setLoading(false);
    }
  };

  const updateModuleFields = async (key: string, fields: ContentField[], items?: any[]) => {
    try {
      await mockApi.modules.update(key, fields, items);
      await refreshAll();
    } catch (err) {
      console.error('Failed to update module', err);
    }
  };

  const reorderPages = async (updatedPages: Page[]) => {
    try {
      await mockApi.pages.update(updatedPages);
      await refreshAll();
    } catch (err) {
      console.error('Failed to reorder pages', err);
    }
  };

  const reorderSections = async (updatedSections: Section[]) => {
    try {
      await mockApi.sections.update(updatedSections);
      await refreshAll();
    } catch (err) {
      console.error('Failed to reorder sections', err);
    }
  };

  const savePage = async (page: Page) => {
    try {
      await mockApi.pages.save(page);
      await refreshAll();
    } catch (err) {
      console.error('Failed to save page', err);
    }
  };

  const saveSection = async (section: Section) => {
    try {
      await mockApi.sections.save(section);
      await refreshAll();
    } catch (err) {
      console.error('Failed to save section', err);
    }
  };

  const deleteSection = async (id: string) => {
    try {
      await mockApi.sections.delete(id);
      await refreshAll();
    } catch (err) {
      console.error('Failed to delete section', err);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  return (
    <ModuleContext.Provider value={{
      modules,
      pages,
      sections,
      loading,
      updateModuleFields,
      reorderPages,
      reorderSections,
      savePage,
      saveSection,
      deleteSection,
      refreshAll
    }}>
      {children}
    </ModuleContext.Provider>
  );
}

export function useModules() {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error('useModules must be used within a ModuleProvider');
  }
  return context;
}
