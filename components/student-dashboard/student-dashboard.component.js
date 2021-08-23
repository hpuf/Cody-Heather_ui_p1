import { ViewComponent } from '../view.component.js';
import state from '../../util/state.js';
import router from '../../app.js';

StudentDashboardComponent.prototype = new ViewComponent('student-dashboard');
function StudentDashboardComponent() {

    let welcomeUserElement;

    this.render = function() {

        console.log(state);

        if (!state.authUser) {
            router.navigate('/login');
            return;
        }

        let currentUsername = state.authUser.username;

        StudentDashboardComponent.prototype.injectStylesheet();
        StudentDashboardComponent.prototype.injectTemplate(() => {

            welcomeUserElement = document.getElementById('welcome-user');
            welcomeUserElement.innerText = currentUsername;

            window.history.pushState('student-dashboard', 'Student Dashboard', '/student-dashboard');

        });

    }

}

export default new StudentDashboardComponent();
