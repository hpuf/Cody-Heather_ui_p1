import { ViewComponent } from '../view.component.js';
import env from '../../util/env.js';
import state from '../../util/state.js';
import router from '../../app.js';


StudentDashboardComponent.prototype = new ViewComponent('student-dashboard');
function StudentDashboardComponent() {

    let welcomeUserElement;

    let abvFieldElement;

    let enrollButtonElement;
    let enrollErrorMessageElement;

    let abv = '';

    function updateAbv(e) {
        abv = e.target.value;
        console.log(abv);
    }

    function updateErrorMessage(errorMessage) {
        if (errorMessage) {
            enrollErrorMessageElement.removeAttribute('hidden');
            enrollErrorMessageElement.innerText = errorMessage;
        } else {
            enrollErrorMessageElement.setAttribute('hidden', 'true');
            enrollErrorMessageElement.innerText = '';
        }
    }

         function enroll(){
        if (!abv) {
            updateErrorMessage('Please fill out all fields');
            return;
        } else {
            updateErrorMessage('');
        }

        let enrollInfo ={
            courseAbbreviation: abv
        };

        let status = 0;

        fetch(`${env.apiUrl}/student/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': state.token
            },
            body: JSON.stringify(enrollInfo)
        })
            .then(resp => {
                status = resp.status;
                console.log(resp);
                return resp().json;
            })
            .then(payload => {
                if (status >= 400 && status < 500) {
                    updateErrorMessage(payload.message);
                }else if (status >= 500) {
                    updateErrorMessage('The server encountered an error, please try again later.');
                }
            })
            .catch(err => console.error(err));

    }

    this.render = function() {

        console.log(state);

        if (!state.authUser) {
            router.navigate('/login');
            return;
        }else if(state.authUser.faculty === true) {
            router.navigate('/faculty-dashboard');
        }

        let currentUsername = state.authUser.username;

        StudentDashboardComponent.prototype.injectStylesheet();
        StudentDashboardComponent.prototype.injectTemplate(() => {

            welcomeUserElement = document.getElementById('welcome-user');
            welcomeUserElement.innerText = currentUsername;

            abvFieldElement = document.getElementById('enroll-form-abv');
            enrollErrorMessageElement = document.getElementById('enroll-error-msg');

            enrollButtonElement = document.getElementById('enroll-course-form-button');

            abvFieldElement.addEventListener('keyup', updateAbv);

            enrollButtonElement.addEventListener('click', enroll);

            window.history.pushState('student-dashboard', 'Student Dashboard', '/student-dashboard');

        });

    }

}

export default new StudentDashboardComponent();
