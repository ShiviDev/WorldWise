import { BrowserRouter, Routes, Route } from "react-router-dom"
import Product from './pages/Product'
import Pricing from './pages/Pricing'
import Homepage from './pages/Homepage'
import PageNotFound from "./pages/PageNotFound"
import { Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Form from "./components/Form"
import AppLayout from "./pages/AppLayout"
import City from "./components/City"
import CityList from "./components/CityList"
import CountriesList from "./components/CountriesList"
import { CitiesProvider } from "./contexts/CitiesContext"
import { AuthProvider } from "./contexts/FakeAuthContext"
import ProtectedRoute from "./pages/ProtectedRoute"

function App() {

  return (
    <CitiesProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<Homepage />} />
            <Route path="product" element={<Product />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="login" element={<Login />} />
            <Route path="app" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>}>
              <Route index element={<Navigate replace to='cities' />} />
              <Route path="cities" element={<CityList />} />
              <Route path="cities/:id" element={<City />} />
              <Route path="countries" element={<CountriesList />} />
              <Route path="form" element={<Form />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </CitiesProvider>
  )
}

export default App
