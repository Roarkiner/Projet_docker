import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/templates/Layout/Layout';
import Home from './components/pages/Home/Home';
import { Authentication } from './components/pages';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Gallery from './components/pages/Gallery/Gallery';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Layout />}>
					<Route index element={<Home />} />
					<Route path='/auth/:type' element={<Authentication />} />
					<Route path='/gallery' element={
						<ProtectedRoute>
							<Gallery />
						</ProtectedRoute>
					} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
