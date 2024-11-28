import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import EditorPage from "../pages/EditorPage";
import Stopwatch from "../pages/TestRef";
import Login from "../pages/Login";
import useUserStore from "../stores/userStore";
import DocumentLayout from "../layouts/user/DocumentLayout";
import Profile from "../pages/user/Profile";
import GuestLayout from "../layouts/guest/guestLayout";

const guessRouter = createBrowserRouter([
    {
        path: '/',
        element: <GuestLayout />,   
        children: [
            { index: true, element: <Login /> },
        ]
    },
    // not found page here not have yet
    { path: '*', element: <Navigate to='/' /> }
])

const userRouter = createBrowserRouter([
    { path: '/', element: <DocumentLayout /> },
    { path: 'profile', element: <Profile /> },
    { path: 'document/:docId/:uuid', element: <EditorPage /> }

])

const AppRoute = () => {
    const user = useUserStore(pull => pull.user)
    const selectRouter = user ? userRouter : guessRouter
    return (
        <div>
            <RouterProvider router={selectRouter} />
        </div>
    )
}

export default AppRoute