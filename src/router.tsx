import { Route, Routes } from 'react-router-dom'
import { GuestRoute, LoginPage, ProtectedRoute } from '@/Auth'
import { WatchlistPage, ListsPage, ListDetailPage } from '@/Collection'
import { ROUTES, NotFoundPage, ShellLayout } from '@/Common'
import { HomePage, MovieDetailPage } from '@/Movies'
import { SettingsPage } from '@/Preferences'
import { SearchPage } from '@/Search'
import {
  TVShowLayoutPage,
  TVShowDetailPage,
  SeasonDetailPage,
} from '@/TVShows'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<ShellLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.SEARCH} element={<SearchPage />} />
          <Route path={ROUTES.MOVIE_DETAIL} element={<MovieDetailPage />} />
          <Route path={ROUTES.TV_SHOW} element={<TVShowLayoutPage />}>
            <Route index element={<TVShowDetailPage />} />
            <Route path={ROUTES.TV_SEASON} element={<SeasonDetailPage />} />
          </Route>
          <Route path={ROUTES.WATCHLIST} element={<WatchlistPage />} />
          <Route path={ROUTES.LISTS} element={<ListsPage />} />
          <Route path={ROUTES.LIST_DETAIL} element={<ListDetailPage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}