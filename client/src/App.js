import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from './components/AuthProvider';
import AuthRequired from './components/AuthRequired';
import Layout from './components/Layout';
import Feed from './components/Feed';
import ArticleView from './components/ArticleView';
import Search from "./components/Search";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Accounts from "./components/Accounts";
import NotFound from "./components/NotFound";
import Favorite from "./components/Favorite";
import Country from "./components/Country";
import Windmil from "./components/Windmil";
import Beach from "./components/Beach";
import Private from "./components/Private";
import Best from "./components/Best";
import Hanok from "./components/Hanok";
import ArticleCreate from "./components/ArticleCreate";
import ArticleList from "./components/ArticleList";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={
            <AuthRequired>
              <Layout />
            </AuthRequired>
          }>
            {/* 홈 */}
            <Route index element={<Feed />} />
            <Route path="/create" element={<ArticleCreate />} />
            {/* 메뉴 */}
            <Route path="/hanok" element={<Hanok />} />
            <Route path="/best" element={<Best />} />
            <Route path="/country" element={<Country />} />
            <Route path="/windmill" element={<Windmil />} />
            <Route path="/beach" element={<Beach />} />
            <Route path="/private" element={<Private />} />
            
            <Route path="favorite" element={<Favorite />} />
            <Route path="search" element={<Search />} />
            
            <Route path="article/:articleId">
              <Route index element={<ArticleView />} />
            </Route>

            <Route path="profile/:username">
              <Route index element={<Profile />} />
            </Route>

            <Route path="accounts/edit" element={<Accounts />} />
          </Route>
          <Route path="/" element={<Layout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App;