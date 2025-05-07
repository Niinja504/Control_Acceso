import React from 'react'

const Routing = () => {
  return (
    <BrowserRouter>
    <AuthProvider>

        <Routes>

          <Route element={<PublicRoute />}>
          </Route>
          <Route path="*" element={
            <>
              <p>
                <h1>Error 404</h1>
                <Link to="/">Volver al Inicio</Link>
              </p>
            </>
          }/>
        </Routes>

      </AuthProvider>
    </BrowserRouter>
  )
}

export default Routing