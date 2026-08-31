const courses = [
  { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2, completed: true },
  { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, completed: true },
  { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, completed: true },
  { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, completed: true },
  { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2, completed: true },
  { subject: 'WDD', number: 231, title: 'Frontend Web Development I', credits: 2, completed: false }
];

const container = document.getElementById('courses-container');
const creditDisplay = document.getElementById('total-credits');

function displayCourses(filteredCourses) {
  container.innerHTML = '';
  
  filteredCourses.forEach(course => {
    const card = document.createElement('div');
    card.className = `course-card ${course.completed ? 'completed' : ''}`;
    card.textContent = `${course.subject} ${course.number}`;
    container.appendChild(card);
  });
  
  const total = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
  creditDisplay.textContent = `The total credits for courses listed above is ${total}`;
}

document.getElementById('all-btn').addEventListener('click', () => displayCourses(courses));
document.getElementById('cse-btn').addEventListener('click', () => displayCourses(courses.filter(c => c.subject === 'CSE')));
document.getElementById('wdd-btn').addEventListener('click', () => displayCourses(courses.filter(c => c.subject === 'WDD')));

displayCourses(courses);