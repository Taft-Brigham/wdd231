// courses array – keep exactly as you have it
const courses = [
  {
    subject: 'CSE',
    number: 110,
    title: 'Introduction to Programming',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
    technology: ['Python'],
    completed: true
  },
  {
    subject: 'WDD',
    number: 130,
    title: 'Web Fundamentals',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.',
    technology: ['HTML', 'CSS'],
    completed: true
  },
  {
    subject: 'CSE',
    number: 111,
    title: 'Programming with Functions',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
    technology: ['Python'],
    completed: true
  },
  {
    subject: 'CSE',
    number: 210,
    title: 'Programming with Classes',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
    technology: ['C#'],
    completed: true
  },
  {
    subject: 'WDD',
    number: 131,
    title: 'Dynamic Web Fundamentals',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
    technology: ['HTML', 'CSS', 'JavaScript'],
    completed: true
  },
  {
    subject: 'WDD',
    number: 231,
    title: 'Frontend Web Development I',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
    technology: ['HTML', 'CSS', 'JavaScript'],
    completed: false
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const courseListContainer  = document.getElementById('course-list');
  const totalCreditsElement  = document.getElementById('total-credits');
  const filterButtons        = document.querySelectorAll('.filter-btn');

  // Modal dialog element
  const courseDetails = document.querySelector('#course-details');

  // Close modal if user clicks the backdrop (outside content)
  courseDetails.addEventListener('click', (e) => {
    if (e.target === courseDetails) {
      courseDetails.close();
    }
  });

  function displayCourseDetails(course) {
  courseDetails.innerHTML = `
    <button type="button" class="close-modal" aria-label="Close">❌</button>

    <h2><span class="course-code">${course.subject} ${course.number}</span></h2>
    <h3>${course.title}</h3>

    <p><strong>Credits</strong>: ${course.credits}</p>
    <p><strong>Certificate</strong>: ${course.certificate}</p>
    <p>${course.description}</p>
    <p><strong>Technologies</strong>: ${course.technology.join(", ")}</p>
  `;

  courseDetails.showModal();

  const closeBtn = courseDetails.querySelector(".close-modal");
  closeBtn.addEventListener("click", () => courseDetails.close());
  closeBtn.focus();
}


  function renderCourses(filteredCourses) {
    courseListContainer.innerHTML = '';

    filteredCourses.forEach(course => {
      const card = document.createElement('div');
      card.classList.add('course-card');
      if (course.completed) card.classList.add('completed');

      card.innerHTML = `
        <h3>${course.subject} ${course.number}</h3>
        <p class="course-title">${course.title}</p>
        <p class="credits">${course.credits} credits</p>
        <p class="tech">Tech: ${course.technology.join(', ')}</p>
        ${course.completed ? '<span class="completed-badge">Completed</span>' : ''}
      `;

      // Make card open modal (mouse)
      card.addEventListener('click', () => {
        displayCourseDetails(course);
      });

      // Keyboard access: Enter/Space opens modal (recommended for accessibility)
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          displayCourseDetails(course);
        }
      });

      courseListContainer.appendChild(card);
    });

    const total = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
    totalCreditsElement.textContent = total;
  }

  function applyFilter(filterType) {
    let filtered = courses;

    if (filterType === 'WDD') {
      filtered = courses.filter(course => course.subject === 'WDD');
    } else if (filterType === 'CSE') {
      filtered = courses.filter(course => course.subject === 'CSE');
    }

    renderCourses(filtered);

    filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filterType);
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      applyFilter(button.dataset.filter);
    });
  });

  applyFilter('all');
});