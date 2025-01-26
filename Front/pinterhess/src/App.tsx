import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/templates/Layout/Layout';
import { Authentication } from './components/pages';
import Gallery from './components/pages/Gallery/Gallery';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Layout />}>
					<Route index element={<Gallery />} />
					<Route index path='/gallery' element={<Gallery />} />
					<Route path='/auth/:type' element={<Authentication />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
