import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import MoviesView from '@/views/MoviesView.vue'
import TvViews from '@/views/TvViews.vue'
import TVDetailsView from '@/views/TVDetailsView.vue'
import MovieDetailsView from '@/views/MovieDetailsView.vue'
import Register from '@/components/FormsComponent.vue'
import CantinhoView from '@/views/CantinhoView.vue' 
import ProfileView from '@/views/ProfileView.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/filmes', name: 'Movies', component: MoviesView },
  { path: '/movie/:movieId', name: 'MovieDetails', component: MovieDetailsView, props: true },
  { path: '/cadastro', name: 'Register', component: Register },
  { path: '/cantinho', name: 'Cantinho', component: CantinhoView },
  { path: '/profile/', name: 'Profile', component: ProfileView},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;