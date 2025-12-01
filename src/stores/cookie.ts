import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';


export const useCookieStore = defineStore('cookie', () => {
  
  const checkAuth = () => {
    return !!getCookie('token');
  };
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  }
  const getUserIdFromCookie = () => {
    const userId = getCookie('userId');
    return userId ? parseInt(userId) : null;
  }
  return { checkAuth, getCookie, getUserIdFromCookie};
});