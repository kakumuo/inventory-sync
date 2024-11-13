import React from 'react'
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router'
import { HomePage, StatisticsPage, AddItemPage, ChangesPage, SettingsPage, LoginPage, ItemPage } from './pages/types'

function App() {
  return (
    <div style={{display: 'grid', width: "100vw", height: "100vh", padding: 24, backgroundColor: "darkgray", gridTemplateRows: '100%', gridTemplateColumns: '100%'}}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/:profileId' element={<HomePage />}>
            <Route path='add_item/' element={<AddItemPage />} />
            <Route path='changes/' element={<ChangesPage />} />
            <Route path='settings/' element={<SettingsPage />} />
          </Route>
          <Route path='/:profileId/item/:itemId' element={<ItemPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
