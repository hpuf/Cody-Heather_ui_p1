import { ViewComponent } from '../view.component.js';
import state from '../../util/state.js';
import router from '../../app.js';
import env from '../../util/env.js';

FacultyDashboardComponent.prototype = new ViewComponent('faculty-dashboard');
function FacultyDashboardComponent() {

    let welcomeUserElement;

    let abvFieldElement;
    let courseNameFieldElement;
    let courseDetailsFieldElement;
    let courseOpenDateFieldElement;
    let courseCloseDateFieldElement;
    let courseCapacityFieldElement;

    let addButtonElement;
    let addErrorMessageElement;

    let abv = '';
    let courseName = '';
    let courseDetails = '';
    let courseOpen = '';
    let courseClose = '';
    let courseCap = '';

    function updateAbv(e) {
        abv = e.target.value;
        console.log(abv);
    }

    function updateCourseName(e) {
        courseName = e.target.value;
        console.log(courseName);
    }

    function updateCourseDetails(e) {
        courseDetails = e.target.value;
        console.log(courseDetails);
    }

    function updateCourseOpen(e) {
        courseOpen = e.target.value;
        console.log(courseOpen);
    }

    function updateCourseClose(e) {
        courseClose = e.target.value;
        console.log(courseClose);
    }

    function updateCourseCap(e) {
        courseCap = e.target.value;
        console.log(courseCap);
    }

    function updateErrorMessage(errorMessage) {
        if (errorMessage) {
            addErrorMessageElement.removeAttribute('hidden');
            addErrorMessageElement.innerText = errorMessage;
        } else {
            addErrorMessageElement.setAttribute('hidden', 'true');
            addErrorMessageElement.innerText = '';
        }
    }


    function addCourse() {

        if (!abv || !courseName|| !courseDetails|| !courseOpen || !courseClose || !courseCap) {
            updateErrorMessage('Please fill out all fields');
            return;
        } else {
            updateErrorMessage('');
        }

        let courseInfo = {
            courseName: courseName,
            courseAbbreviation: abv,
            courseDetail: courseDetails,
            courseOpenDate: courseOpen,
            courseCloseDate: courseClose,
            courseCapacity: courseCap          
        };

        let status = 0;

        fetch(`${env.apiUrl}/faculty/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(courseInfo) // BECAUSE I'D KNOW >:(
        })
            .then(resp => {
                status = resp.status;
                return resp.json();
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
        }

        let currentUsername = state.authUser.username;

        FacultyDashboardComponent.prototype.injectStylesheet();
        FacultyDashboardComponent.prototype.injectTemplate(() => {

            welcomeUserElement = document.getElementById('welcome-user');
            welcomeUserElement.innerText = currentUsername;

            abvFieldElement = document.getElementById('add-form-abv');
            courseNameFieldElement = document.getElementById('add-form-course-name');;
            courseDetailsFieldElement = document.getElementById('add-form-details');
            courseOpenDateFieldElement = document.getElementById('add-form-open-date');
            courseCloseDateFieldElement = document.getElementById('add-form-close-date');;
            courseCapacityFieldElement = document.getElementById('add-form-capacity');;

            addButtonElement = document.getElementById('add-course-form-button');;
            addErrorMessageElement = document.getElementById('add-error-msg');

            abvFieldElement.addEventListener('keyup', updateAbv);
            courseNameFieldElement.addEventListener('keyup', updateCourseName);
            courseDetailsFieldElement.addEventListener('keyup', updateCourseDetails);
            courseOpenDateFieldElement.addEventListener('mousedown', updateCourseOpen);
            courseCloseDateFieldElement.addEventListener('mousedown', updateCourseClose);
            courseCapacityFieldElement.addEventListener('keyup', updateCourseCap);

            addButtonElement.addEventListener('click', addCourse);

            window.history.pushState('faculty-dashboard', 'Faculty Dashboard', '/faculty-dashboard');

        });

    }

}



export default new FacultyDashboardComponent();
