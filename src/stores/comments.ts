import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useCommentsStore = defineStore('comments', () => {
  interface Comment {
  id: number;
  content: string;
  username: string;
  movieId: number;
}

const commentsByMovie = ref<Record<number, Comment[]>>({});

const listForMovie = async (movieId: number): Promise<Comment[]> => {
  const res = await fetch(`http://localhost:8080/users/getComments?movieId=${movieId}`);
  const data = await res.json();
  commentsByMovie.value[movieId] = data.comments;
  return data.comments;
};
const addComment = async (movieId: number, content: string) => {
  
    const body = {
      contentString: content
    };
    

    
    const res = await fetch(`http://localhost:8080/users/saveComment?movieId=${encodeURIComponent(movieId.toString())}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: 'include' 
    });
    console.log("Resposta status:", res.status);
    
    if (!res.ok) {
      const errorData = await res.json();
      console.log("Erro do backend:", errorData);
      throw new Error(errorData.error || 'Erro ao enviar comentário');
    }

    const data = await res.json();
    await listForMovie(movieId);
    return data;
  };
  const deleteComment = async (movieId: number, commentId: string) => {
    console.warn("deleteComment backend ainda não existe");
  };
  return { 
    commentsByMovie, 
    listForMovie, 
    addComment, 
    deleteComment,
   
  };
});