import navbarComponent from './components/navbar/navbar.component.js'
import loginComponent from './components/login/login.component.js'
import registerComponent from './components/register/register.component.js'
import studentDashboardComponent from './components/student-dashboard/student-dashboard.component.js';
import facultyDashboardComponent from './components/faculty-dashboard/faculty-dashboard.component.js';

import { Router } from './util/router.js'

//----------------------------------------------------------------------------

let routes = [

    {
        path: '/login',
        component: loginComponent
    },
    {
        path: '/register',
        component: registerComponent
    },
    {
        path: '/student-dashboard',
        component: studentDashboardComponent
    },
    {
        path: '/faculty-dashboard',
        component: facultyDashboardComponent
    }

]

const router = new Router(routes);

window.onload = () =>{
    navbarComponent.render();  
    router.navigate('/register');
}

export default (() => router)();