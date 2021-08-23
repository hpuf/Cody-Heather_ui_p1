import { ViewComponent } from '../view.component.js';
import state from '../../util/state.js';
import router from '../../app.js';

FacultyDashboardComponent.prototype = new ViewComponent('faculty-dashboard');
function FacultyDashboardComponent() {

    let welcomeUserElement;

    this.render = function() {

        console.log(state);

        if (!state.authUser) {
            router.navigate('/login');
            return;
        }
        if(state.authUser.faculty === false) {
            router.navigate('/student-dashboard');
        }

        let currentUsername = state.authUser.username;

        FacultyDashboardComponent.prototype.injectStylesheet();
        FacultyDashboardComponent.prototype.injectTemplate(() => {

            welcomeUserElement = document.getElementById('welcome-user');
            welcomeUserElement.innerText = currentUsername;

            window.history.pushState('faculty-dashboard', 'Faculty Dashboard', '/faculty-dashboard');

        });

    }

}



export default new FacultyDashboardComponent();
