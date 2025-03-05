import { Route, Routes } from "react-router-dom";
import Blog from "../pages/blog";
import PageLayout from "../layout";
import Details from "../pages/blog/component/Details";

export default function Routers() {

    return (
      <div>
        <Routes>
          <Route element={<PageLayout />}>
            <Route path='/' element={<Blog />} />
            <Route path='/view-details' element={<Details />} />
 
          </Route>
          
         
        </Routes>
      </div>
    )
  }