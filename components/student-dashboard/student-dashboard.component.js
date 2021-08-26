import { ViewComponent } from '../view.component.js';
import env from '../../util/env.js';
import state from '../../util/state.js';
import router from '../../app.js';


StudentDashboardComponent.prototype = new ViewComponent('student-dashboard');
function StudentDashboardComponent() {

    let welcomeUserElement;

    let enrollAbvFieldElement;
    let withdrawAbvFieldElement;

    let enrollButtonElement;
    let enrollErrorMessageElement;
    let withdrawButtonElement;
    let withdrawErrorMessageElement;

    let abv = '';

    function updateAbv(e) {
        abv = e.target.value;
        console.log(abv);
    }

    function updateEnrollErrorMessage(errorMessage) {
        if (errorMessage) {
            enrollErrorMessageElement.removeAttribute('hidden');
            enrollErrorMessageElement.innerText = errorMessage;
        } else {
            enrollErrorMessageElement.setAttribute('hidden', 'true');
            enrollErrorMessageElement.innerText = '';
        }
    }

    function updateWithdrawErrorMessage(errorMessage) {
        if (errorMessage) {
            withdrawErrorMessageElement.removeAttribute('hidden');
            withdrawErrorMessageElement.innerText = errorMessage;
        } else {
            withdrawErrorMessageElement.setAttribute('hidden', 'true');
            withdrawErrorMessageElement.innerText = '';
        }
    }

    function enroll() {

        if (!abv) {
            updateEnrollErrorMessage('Please fill out all fields');
            return;
        } else {
            updateEnrollErrorMessage('');
        }

        let enrollInfo = {
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
                console.log(resp);
                status = resp.status;
                return resp;
            })
            .then(payload => {
                if (status >= 400 && status < 500) {
                    updateEnrollErrorMessage(payload.message);
                }else if (status >= 500) {
                    updateEnrollErrorMessage('The server encountered an error, please try again later.');
                }
            })
            .catch(err => console.error(err));

    }

    function withdraw() {

        if (!abv) {
            updateWithdrawErrorMessage('Please fill out all fields');
            return;
        } else {
            updateWithdrawErrorMessage('');
        }

        let withdrawInfo = {
            courseAbbreviation: abv
        };

        let status = 0;

        fetch(`${env.apiUrl}/student/courses`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': state.token
            },
            body: JSON.stringify(withdrawInfo)
        })
            .then(resp => {
                console.log(resp);
                status = resp.status;
                return resp;
            })
            .then(payload => {
                if (status >= 400 && status < 500) {
                    updateWithdrawErrorMessage(payload.message);
                }else if (status >= 500) {
                    updateWithdrawErrorMessage('The server encountered an error, please try again later.');
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

            enrollAbvFieldElement = document.getElementById('enroll-form-abv');
            withdrawAbvFieldElement = document.getElementById('withdraw-form-abv');

            enrollErrorMessageElement = document.getElementById('enroll-error-msg');
            withdrawErrorMessageElement = document.getElementById('withdraw-error-msg');

            enrollButtonElement = document.getElementById('enroll-course-form-button');
            withdrawButtonElement = document.getElementById('withdraw-course-form-button');

            enrollAbvFieldElement.addEventListener('keyup', updateAbv);
            withdrawAbvFieldElement.addEventListener('keyup', updateAbv);

            enrollButtonElement.addEventListener('click', enroll);
            withdrawButtonElement.addEventListener('click', withdraw);

            window.history.pushState('student-dashboard', 'Student Dashboard', '/student-dashboard');

        });

    }

}

export default new StudentDashboardComponent();
