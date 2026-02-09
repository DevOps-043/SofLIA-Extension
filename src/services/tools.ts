/**
 * SOFLIA Tool Library Service
 * Handles CRUD operations for public and private tools
 */

import { supabase } from '../lib/supabase';

// ==========================================
// TYPES
// ==========================================

export type ToolCategory = 
  | 'desarrollo' 
  | 'marketing' 
  | 'educacion' 
  | 'productividad' 
  | 'creatividad' 
  | 'analisis';

export type ToolStatus = 'pending' | 'approved' | 'rejected';

export interface Tool {
  id: string;
  author_id: string | null;
  name: string;
  description: string;
  icon: string;
  category: ToolCategory;
  system_prompt: string;
  starter_prompts: string[];
  status: ToolStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  usage_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserTool {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  icon: string;
  category: ToolCategory | null;
  system_prompt: string;
  starter_prompts: string[];
  is_favorite: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateUserToolInput {
  name: string;
  description?: string;
  icon?: string;
  category?: ToolCategory;
  system_prompt: string;
  starter_prompts?: string[];
}

export interface SubmitPublicToolInput {
  name: string;
  description: string;
  icon?: string;
  category: ToolCategory;
  system_prompt: string;
  starter_prompts?: string[];
}

// ==========================================
// PUBLIC TOOLS (Read-only for users)
// ==========================================

/**
 * Get all approved public tools, optionally filtered by category
 */
export async function getPublicTools(category?: ToolCategory): Promise<Tool[]> {
  let query = supabase
    .from('tools')
    .select('*')
    .eq('status', 'approved')
    .order('usage_count', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching public tools:', error);
    throw error;
  }
  
  return data || [];
}

/**
 * Get featured public tools for homepage
 */
export async function getFeaturedTools(): Promise<Tool[]> {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('status', 'approved')
    .eq('is_featured', true)
    .order('usage_count', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Error fetching featured tools:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get a single public tool by ID
 */
export async function getPublicToolById(id: string): Promise<Tool | null> {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('id', id)
    .eq('status', 'approved')
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('Error fetching tool:', error);
    throw error;
  }

  return data;
}

/**
 * Submit a new tool for admin approval
 */
export async function submitPublicTool(tool: SubmitPublicToolInput): Promise<Tool> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Debes iniciar sesión para proponer herramientas');
  }

  const { data, error } = await supabase
    .from('tools')
    .insert({
      author_id: user.id,
      name: tool.name,
      description: tool.description,
      icon: tool.icon || '🔧',
      category: tool.category,
      system_prompt: tool.system_prompt,
      starter_prompts: tool.starter_prompts || [],
      status: 'pending'
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting tool:', error);
    throw error;
  }

  return data;
}

/**
 * Increment usage counter when a tool is used
 */
export async function incrementToolUsage(toolId: string, isPublic: boolean = true): Promise<void> {
  const table = isPublic ? 'tools' : 'user_tools';
  
  const { error } = await supabase.rpc('increment_tool_usage', {
    tool_id: toolId,
    is_public: isPublic
  });

  // Fallback if RPC doesn't exist - direct update
  if (error?.code === 'PGRST202') {
    const { error: updateError } = await supabase
      .from(table)
      .update({ usage_count: supabase.rpc('usage_count + 1') as any })
      .eq('id', toolId);
    
    if (updateError) {
      console.warn('Could not increment usage:', updateError);
    }
  }
}

// ==========================================
// USER PRIVATE TOOLS
// ==========================================

/**
 * Get all tools created by the current user
 */
export async function getUserTools(): Promise<UserTool[]> {
  const { data, error } = await supabase
    .from('user_tools')
    .select('*')
    .order('is_favorite', { ascending: false })
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching user tools:', error);
    throw error;
  }

  return data || [];
}

/**
 * Create a new private tool
 */
export async function createUserTool(tool: CreateUserToolInput): Promise<UserTool> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Debes iniciar sesión para crear herramientas');
  }

  const { data, error } = await supabase
    .from('user_tools')
    .insert({
      user_id: user.id,
      name: tool.name,
      description: tool.description || null,
      icon: tool.icon || '⚙️',
      category: tool.category || null,
      system_prompt: tool.system_prompt,
      starter_prompts: tool.starter_prompts || []
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user tool:', error);
    throw error;
  }

  return data;
}

/**
 * Update an existing private tool
 */
export async function updateUserTool(id: string, updates: Partial<CreateUserToolInput>): Promise<UserTool> {
  const { data, error } = await supabase
    .from('user_tools')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating user tool:', error);
    throw error;
  }

  return data;
}

/**
 * Delete a private tool
 */
export async function deleteUserTool(id: string): Promise<void> {
  const { error } = await supabase
    .from('user_tools')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting user tool:', error);
    throw error;
  }
}

/**
 * Toggle favorite status of a private tool
 */
export async function toggleUserToolFavorite(id: string): Promise<boolean> {
  // First get current status
  const { data: current, error: fetchError } = await supabase
    .from('user_tools')
    .select('is_favorite')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching tool:', fetchError);
    throw fetchError;
  }

  const newValue = !current.is_favorite;

  const { error } = await supabase
    .from('user_tools')
    .update({ is_favorite: newValue })
    .eq('id', id);

  if (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }

  return newValue;
}

// ==========================================
// USER FAVORITES (for public tools)
// ==========================================

/**
 * Get public tools that the user has favorited
 */
export async function getUserFavoritePublicTools(): Promise<Tool[]> {
  const { data, error } = await supabase
    .from('user_favorite_tools')
    .select(`
      tool_id,
      tools (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching favorite tools:', error);
    throw error;
  }

  // Extract the tool data from the join
  return (data || [])
    .map((fav: any) => fav.tools)
    .filter((tool: Tool | null) => tool !== null && tool.status === 'approved');
}

/**
 * Add a public tool to favorites
 */
export async function addToolToFavorites(toolId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Debes iniciar sesión para guardar favoritos');
  }

  const { error } = await supabase
    .from('user_favorite_tools')
    .insert({
      user_id: user.id,
      tool_id: toolId
    });

  if (error) {
    // Ignore duplicate errors
    if (error.code !== '23505') {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  }
}

/**
 * Remove a public tool from favorites
 */
export async function removeToolFromFavorites(toolId: string): Promise<void> {
  const { error } = await supabase
    .from('user_favorite_tools')
    .delete()
    .eq('tool_id', toolId);

  if (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
}

/**
 * Check if a tool is in user's favorites
 */
export async function isToolFavorited(toolId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;

  const { data, error } = await supabase
    .from('user_favorite_tools')
    .select('id')
    .eq('tool_id', toolId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }

  return data !== null;
}

// ==========================================
// CATEGORY HELPERS
// ==========================================

export const TOOL_CATEGORIES: { value: ToolCategory; label: string; icon: string }[] = [
  { value: 'desarrollo', label: 'Desarrollo', icon: '💻' },
  { value: 'marketing', label: 'Marketing', icon: '📣' },
  { value: 'educacion', label: 'Educación', icon: '🎓' },
  { value: 'productividad', label: 'Productividad', icon: '📋' },
  { value: 'creatividad', label: 'Creatividad', icon: '🎨' },
  { value: 'analisis', label: 'Análisis', icon: '📊' },
];

export function getCategoryLabel(category: ToolCategory): string {
  return TOOL_CATEGORIES.find(c => c.value === category)?.label || category;
}

export function getCategoryIcon(category: ToolCategory): string {
  return TOOL_CATEGORIES.find(c => c.value === category)?.icon || '🔧';
}
