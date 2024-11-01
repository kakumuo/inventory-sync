import React from 'react'
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router'
import { HomePage, StatisticsPage, AddItemPage, ChangesPage, SettingsPage } from './pages/types'

function App() {
  return (
    <div style={{display: 'grid', width: "100vw", height: "100vh", padding: 24, backgroundColor: "darkgray"}}>
      <BrowserRouter>
        <Routes>
          <Route path='/' Component={HomePage} />
          <Route path='/add_item/' Component={AddItemPage} />
          <Route path='/changes/' Component={ChangesPage} />
          <Route path='/settings/' Component={SettingsPage} />
          <Route path='/statistics/' Component={StatisticsPage} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
