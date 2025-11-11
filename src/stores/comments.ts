import { ref } from 'vue';
import { defineStore } from 'pinia';

const COMMENTS_KEY = 'tmdb:app:comments';

function loadJSON(key: string, fallback: any) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

interface Comment {
  id: string;
  movieId: number;
  author: string;
  email?: string | null;
  content: string;
  createdAt: string;
}

export const useCommentsStore = defineStore('comments', () => {
  // commentsByMovie: Record<number, Comment[]>
  const commentsByMovie = ref<Record<number, Comment[]>>(loadJSON(COMMENTS_KEY, {}));

  const save = () => {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(commentsByMovie.value));
  };

  const listForMovie = (movieId: number): Comment[] => {
    return commentsByMovie.value[movieId] ? [...commentsByMovie.value[movieId]] : [];
  };

  const addComment = (movieId: number, author: string, content: string, email?: string | null) => {
    if (!movieId || !content?.trim()) return null;
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const c: Comment = {
      id,
      movieId,
      author: author || 'Anon',
      email: email || null,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    if (!commentsByMovie.value[movieId]) commentsByMovie.value[movieId] = [];
    commentsByMovie.value[movieId].unshift(c);
    save();
    return c;
  };

  const deleteComment = (movieId: number, commentId: string) => {
    if (!commentsByMovie.value[movieId]) return;
    commentsByMovie.value[movieId] = commentsByMovie.value[movieId].filter((c) => c.id !== commentId);
    save();
  };

  // placeholders for future backend integration:
  // - methods can be adapted to call API and sync local state

  return { commentsByMovie, listForMovie, addComment, deleteComment, save };
});