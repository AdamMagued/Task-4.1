import React, {useEffect, useMemo, useState} from 'react';

const KEY = 'acl-course-pulse-v2';

// Fictional teaching records for the self-contained UI/UX exercise.
const COURSE_CATALOG = {
  CSEN701: {
    name: 'Advanced Computer Lab',
    description: 'A project-focused course built around teamwork, planning, software development, and delivery across several milestones.',
    history: [
      {year: '2025/26', instructors: ['Dr. Mariam Farouk'], tas: ['Yara Hassan', 'Omar Fawzy']},
      {year: '2024/25', instructors: ['Dr. Karim Nabil'], tas: ['Nour Adel', 'Mina Sameh']},
    ],
  },
  MATH204: {
    name: 'Linear Algebra',
    description: 'Vectors, matrices, linear systems, and mathematical methods used in technical problem solving.',
    history: [
      {year: '2025/26', instructors: ['Dr. Salma Younis'], tas: ['Layla Maher', 'Ahmed Sherif']},
      {year: '2024/25', instructors: ['Dr. Rana Hamdy'], tas: ['Youssef Tarek', 'Dina Mourad']},
    ],
  },
  CSEN401: {
    name: 'Software Engineering',
    description: 'Software requirements, architecture, implementation practices, testing, and collaborative development.',
    history: [
      {year: '2025/26', instructors: ['Dr. Tamer Elsayed'], tas: ['Rana Fathy', 'Adham Khalil']},
      {year: '2024/25', instructors: ['Dr. Hala Mansour'], tas: ['Malak Samir', 'Ali Mahmoud']},
    ],
  },
  HUMA101: {
    name: 'Critical Thinking & Communication',
    description: 'A discussion-based course about assessing arguments, presenting ideas, and communicating effectively.',
    history: [
      {year: '2025/26', instructors: ['Dr. Dina Saad'], tas: ['Mariam Hossam', 'Youssef Nader']},
      {year: '2024/25', instructors: ['Dr. Reem Taha'], tas: ['Farah Amr', 'Sara Magdy']},
    ],
  },
  CSEN202: {
    name: 'Data Structures',
    description: 'Core data organization techniques and algorithms, with a focus on choosing the right structure for each problem.',
    history: [
      {year: '2025/26', instructors: ['Dr. Amina Rashed'], tas: ['Rami Elshamy', 'Nada Wael']},
      {year: '2024/25', instructors: ['Dr. Yasser Salem'], tas: ['Hana Ehab', 'Bassel Mostafa']},
    ],
  },
};

const getCourse = code => COURSE_CATALOG[code?.toUpperCase()] || {
  name: 'Course details not yet added',
  description: 'This course does not have a profile in the example catalog.',
  history: [],
};
const readRoute = () => {
  const match = window.location.hash.match(/^#\/courses\/([^/?#]+)$/);
  return match ? decodeURIComponent(match[1]).toUpperCase() : null;
};
const seed = [
  {id: 'r1', courseCode: 'CSEN701', rating: 4, comment: 'A challenging team project. The weekly milestones helped.', owner: 'you', name: 'You', date: '2026-10-06'},
  {id: 'r2', courseCode: 'CSEN701', rating: 5, comment: 'You learn the most when your group communicates well.', owner: 'other', name: 'Farida', date: '2026-10-02'},
  {id: 'r3', courseCode: 'MATH204', rating: 3, comment: 'Useful material but the pace felt fast.', owner: 'other', name: 'Karim', date: '2026-09-28'},
  {id: 'r4', courseCode: 'CSEN401', rating: 4, comment: 'Tutorial exercises are very important.', owner: 'you', name: 'You', date: '2026-09-24'},
  {id: 'r5', courseCode: 'HUMA101', rating: 5, comment: 'Well organized and approachable.', owner: 'other', name: 'Mariam', date: '2026-09-21'},
  {id: 'r6', courseCode: 'CSEN701', rating: 3, comment: 'Good practical work, but demanding during exam week.', owner: 'other', name: 'Youssef', date: '2026-09-15'},
  {id: 'r7', courseCode: 'MATH204', rating: 5, comment: 'Excellent explanation of difficult concepts.', owner: 'other', name: 'Nadine', date: '2026-08-30'},
  {id: 'r8', courseCode: 'CSEN401', rating: 2, comment: 'More worked examples in lectures would help.', owner: 'other', name: 'Adam', date: '2026-08-17'},
  {id: 'r9', courseCode: 'CSEN202', rating: 4, comment: 'The assignments strengthened problem-solving skills.', owner: 'other', name: 'Hassan', date: '2026-08-09'},
];

function getSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(saved) ? saved : seed;
  } catch {
    return seed;
  }
}

const average = items => items.length
  ? (items.reduce((sum, review) => sum + review.rating, 0) / items.length).toFixed(1)
  : '—';
const formatDate = value => {
  if (!value) return 'Date unavailable';
  return new Intl.DateTimeFormat('en', {month: 'short', day: 'numeric', year: 'numeric'})
    .format(new Date(`${value}T12:00:00`));
};
const icons = {
  home: <><path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-6h6v6"/></>,
  reviews: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
  add: <path d="M12 4v16M4 12h16"/>,
  mine: <><path d="M12 21s-8-4.8-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.2-8 11-8 11Z"/></>,
};
const Icon = ({name}) => <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>;
const StarIcon = () => <svg className="star-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true"><path d="m12 2.5 2.9 6 6.6 1-4.8 4.7 1.1 6.6-5.8-3.1-5.8 3.1 1.1-6.6-4.8-4.7 6.6-1z" /></svg>;

function App() {
  const [reviews, setReviews] = useState(getSaved);
  const [search, setSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [courseSort, setCourseSort] = useState('default');
  const [rating, setRating] = useState('all');
  const [reviewCourse, setReviewCourse] = useState('all');
  const [editor, setEditor] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [tab, setTab] = useState('Overview');
  const [activeCourseCode, setActiveCourseCode] = useState(readRoute);

  useEffect(() => {
    const changePage = () => {
      setActiveCourseCode(readRoute());
      window.scrollTo({top: 0, behavior: 'instant'});
    };
    window.addEventListener('hashchange', changePage);
    return () => window.removeEventListener('hashchange', changePage);
  }, []);

  useEffect(() => {
    const closeOnEscape = event => event.key === 'Escape' && setEditor(null);
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(reviews));
  }, [reviews]);

  const openCourse = code => {
    const normalizedCode = code.trim().toUpperCase();
    window.location.hash = `#/courses/${encodeURIComponent(normalizedCode)}`;
    setActiveCourseCode(normalizedCode);
    window.scrollTo({top: 0, behavior: 'instant'});
  };

  const navigateTo = section => {
    if (window.location.hash) window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    setActiveCourseCode(null);
    setTab(section === 'mine' ? 'Your reviews' : section === 'reviews' ? 'Browse reviews' : 'Overview');
    window.scrollTo({top: 0, behavior: 'instant'});
  };

  const result = useMemo(() => reviews.filter(review => {
    const matchesRating = rating === 'all' || review.rating === Number(rating);
    const matchesSearch = `${review.courseCode} ${getCourse(review.courseCode).name} ${review.comment} ${review.name}`
      .toLowerCase().includes(search.trim().toLowerCase());
    return matchesRating && matchesSearch && (reviewCourse === 'all' || review.courseCode.toUpperCase() === reviewCourse);
  }), [reviews, rating, search, reviewCourse]);

  const courseList = useMemo(() => {
    const codes = [...new Set([...Object.keys(COURSE_CATALOG), ...reviews.map(review => review.courseCode.toUpperCase())])];
    return codes.map(code => {
      const courseReviews = reviews.filter(review => review.courseCode.toUpperCase() === code);
      return {code, ...getCourse(code), reviews: courseReviews, score: average(courseReviews)};
    }).filter(course => `${course.code} ${course.name}`.toLowerCase().includes(courseSearch.trim().toLowerCase())).sort((a, b) => {
      if (courseSort === 'name') return a.name.localeCompare(b.name);
      if (courseSort === 'reviews') return b.reviews.length - a.reviews.length;
      if (courseSort === 'highest' || courseSort === 'lowest') {
        if (!a.reviews.length || !b.reviews.length) return Boolean(b.reviews.length) - Boolean(a.reviews.length);
        return courseSort === 'highest' ? Number(b.score) - Number(a.score) : Number(a.score) - Number(b.score);
      }
      return 0;
    });
  }, [reviews, courseSearch, courseSort]);

  const selectedCourseReviews = reviews.filter(review => review.courseCode.toUpperCase() === activeCourseCode);
  const courseDistribution = [5, 4, 3, 2, 1].map(value => ({
    value,
    total: selectedCourseReviews.filter(review => review.rating === value).length,
  }));
  const maxCourseRatingCount = Math.max(...courseDistribution.map(item => item.total), 1);
  const ownCourseReview = selectedCourseReviews.find(review => review.owner === 'you');

  function openEditor(review = null, courseCode = '') {
    if (review && review.owner !== 'you') return;
    setError('');
    setEditor({
      id: review?.id || null,
      courseCode: review?.courseCode || courseCode,
      rating: String(review?.rating || ''),
      comment: review?.comment || '',
    });
  }

  function submit(event) {
    event.preventDefault();
    if (!editor.courseCode.trim()) return setError('Enter a course code.');
    if (!/^[1-5]$/.test(editor.rating)) return setError('Select a rating from 1 to 5 stars.');
    const normalizedCode = editor.courseCode.trim().toUpperCase();
    if (reviews.some(review => review.id !== editor.id && review.owner === 'you' && review.courseCode.toUpperCase() === normalizedCode)) {
      return setError('You have already reviewed this course. Edit your existing review instead.');
    }

    const payload = {
      courseCode: normalizedCode,
      rating: Number(editor.rating),
      comment: editor.comment.trim(),
      name: 'You',
      owner: 'you',
      date: new Date().toISOString().slice(0, 10),
    };
    if (editor.id) {
      setReviews(current => current.map(review => review.id === editor.id ? {...review, ...payload} : review));
      setNotice('Your review has been updated.');
    } else {
      setReviews(current => [{...payload, id: `r-${Date.now()}`}, ...current]);
      setNotice('Your review has been posted.');
    }
    setEditor(null);
  }

  function reset() {
    setReviews(seed);
    setSearch('');
    setCourseSearch('');
    setCourseSort('default');
    setRating('all');
    setReviewCourse('all');
    setEditor(null);
    setNotice('Example data restored.');
  }

  return <div className="review-app">
    <aside className="sidebar">
      <button className="logo" onClick={() => navigateTo('top')}>Course Review Board</button>
      <div className="side-caption">Browse</div>
      <button className={tab === 'Overview' ? 'active' : ''} onClick={() => navigateTo('top')}><Icon name="home"/>Discover</button>
      <button className={tab === 'Browse reviews' ? 'active' : ''} onClick={() => navigateTo('reviews')}><Icon name="reviews"/>Student reviews</button>
      <button onClick={() => openEditor()}><Icon name="add"/>Write a review</button>
      <div className="side-caption side-caption-lower">My activity</div>
      <button className={tab === 'Your reviews' ? 'active' : ''} onClick={() => navigateTo('mine')}><Icon name="mine"/>Your reviews</button>
      <div className="sidebar-bottom">Signed in as <strong>You</strong></div>
    </aside>

    <main className="content">
      {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss message">×</button></div>}

      {activeCourseCode ? <>
        <button type="button" className="back-link" onClick={() => navigateTo(tab === 'Overview' ? 'top' : tab === 'Your reviews' ? 'mine' : 'reviews')}><span>←</span> {tab === 'Overview' ? 'All courses' : tab === 'Your reviews' ? 'Your reviews' : 'Student reviews'}</button>
        <header className="course-hero">
          <div className="course-hero-copy">
            <p className="course-id">{activeCourseCode}</p>
            <h1>{getCourse(activeCourseCode).name}</h1>
            <p className="course-description">{getCourse(activeCourseCode).description}</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => openEditor(ownCourseReview, activeCourseCode)}>{ownCourseReview ? 'Edit your review' : 'Write a review'}</button>
            </div>
          </div>
        </header>

        <div className="course-details-grid">
          <section className="panel course-rating-panel">
            <div className="section-heading"><div><h2>Ratings</h2><p className="section-description">Reviews for {activeCourseCode}</p></div><div className="average-badge course-average-badge"><StarIcon /><strong>{average(selectedCourseReviews)}</strong><small>out of 5</small></div></div>
            <div className="distribution">{courseDistribution.map(item => <div className="distribution-row" key={item.value}><span>{item.value}</span><div className="distribution-track"><i style={{width: `${item.total / maxCourseRatingCount * 100}%`}} /></div><small>{item.total}</small></div>)}</div>
            <p className="panel-footnote">Based on {selectedCourseReviews.length} student {selectedCourseReviews.length === 1 ? 'review' : 'reviews'}.</p>
          </section>
          <section className="panel teaching-history">
            <h2>Teaching history</h2>
            <p className="section-description">Teaching teams from the last two academic years.</p>
            {getCourse(activeCourseCode).history.length ? getCourse(activeCourseCode).history.map(entry => <div className="teaching-entry" key={entry.year}>
              <h3>{entry.year}</h3>
              <div><small>Instructor{entry.instructors.length === 1 ? '' : 's'}</small><span>{entry.instructors.join(', ')}</span></div>
              <div><small>Teaching assistants</small><span>{entry.tas.join(', ')}</span></div>
            </div>) : <p className="history-empty">No example teaching records for this course yet.</p>}
          </section>

          <section className="panel course-feedback">
            <div className="section-heading"><div><h2>Course reviews</h2><p className="section-description">{selectedCourseReviews.length} student {selectedCourseReviews.length === 1 ? 'review' : 'reviews'}</p></div></div>
            {selectedCourseReviews.length ? selectedCourseReviews.map(review => <article className="course-review" key={review.id}>
              <div className="review-avatar">{review.name === 'You' ? 'Y' : review.name[0]}</div>
              <div className="course-review-body"><div className="course-review-top"><strong>{review.name === 'You' ? 'You' : review.name}<span className="rating-value">{review.rating} / 5</span></strong><time dateTime={review.date}>{formatDate(review.date)}</time></div>
                <p>{review.comment || 'No comment provided.'}</p>
                {review.owner === 'you' && <button className="text-button" onClick={() => openEditor(review)}>Edit your review</button>}
              </div>
            </article>) : <div className="empty-state"><strong>No reviews yet</strong><p>Be the first to share your experience with this course.</p><button className="text-button" onClick={() => openEditor(null, activeCourseCode)}>Write the first review</button></div>}
          </section>
        </div>
      </> : <>
        <header className="welcome-head">
          <div className="welcome-copy"><h1>{tab === 'Overview' ? 'Courses' : tab === 'Your reviews' ? 'Your reviews' : 'Student reviews'}</h1><p>{tab === 'Overview' ? 'Find a course, compare ratings, and see who teaches it.' : tab === 'Your reviews' ? 'Manage the feedback you have shared.' : 'Read what students say about their courses.'}</p></div>
          <button className="primary-button welcome-cta" onClick={() => openEditor()}>Write a review</button>
        </header>

        {tab === 'Overview' && <>

        <div className="stat-strip" aria-label="Review summary">
          <div className="summary-stat"><div><strong>{reviews.length}</strong><span>Student reviews</span></div><button className="text-button" onClick={() => navigateTo('reviews')}>View all student reviews <span aria-hidden="true">→</span></button></div>
          <div className="summary-stat"><div><strong>{new Set(reviews.filter(review => review.owner === 'you').map(review => review.courseCode.toUpperCase())).size}</strong><span>Courses you've rated</span></div><button className="text-button" onClick={() => navigateTo('mine')}>View your reviews <span aria-hidden="true">→</span></button></div>
        </div>

        <section className="course-finder" aria-label="Find a course">
          <div className="finder-field"><label htmlFor="course-search">Find a course</label><input id="course-search" value={courseSearch} onChange={event => setCourseSearch(event.target.value)} placeholder="Search by course name or code" /></div>
        </section>

        <section className="course-discovery" id="discover-courses">
          <div className="section-heading discovery-heading"><div><h2>Courses</h2><p className="section-description">Select a course for reviews and teaching history.</p></div><label className="rating-filter"><span>Sort by</span><select value={courseSort} onChange={event => setCourseSort(event.target.value)}><option value="default">Default order</option><option value="highest">Highest rated</option><option value="lowest">Lowest rated</option><option value="reviews">Most reviewed</option><option value="name">Course name A–Z</option></select></label></div>
          {courseList.length ? <div className="course-grid">{courseList.map(course => <button className="course-card" key={course.code} onClick={() => openCourse(course.code)}>
            <span className="course-code">{course.code}</span>
            <span className="course-row-copy"><strong>{course.name}</strong><small>{course.description.length > 80 ? `${course.description.slice(0, 77).replace(/\s+\S*$/, '')}…` : course.description}</small></span>
            <span className="course-row-score"><strong>{course.score}</strong><small>out of 5</small></span>
            <span className="card-reviews">{course.reviews.length} {course.reviews.length === 1 ? 'review' : 'reviews'}</span>
            <span className="course-row-open">View course</span>
          </button>)}</div> : <div className="empty-state course-empty"><strong>No courses match “{courseSearch}”</strong><p>Try a course code or a shorter search.</p></div>}
        </section>

        </>}

        {tab === 'Browse reviews' && <section className="review-list panel" id="review-list">
          <div className="section-heading reviews-heading"><div><h2>Student reviews</h2><p className="section-description">Search by course, reviewer, or comment.</p></div><button className="outline-button" onClick={reset}>Reset demo</button></div>
          <div className="review-filters"><label className="review-search"><input value={search} onChange={event => setSearch(event.target.value)} aria-label="Search reviews" placeholder="Search reviews" /></label><label className="rating-filter course-filter"><span>Course</span><select value={reviewCourse} onChange={event => setReviewCourse(event.target.value)}><option value="all">All courses</option>{[...new Set(reviews.map(review => review.courseCode.toUpperCase()))].sort().map(code => <option key={code} value={code}>{code} · {getCourse(code).name}</option>)}</select></label><label className="rating-filter"><span>Rating</span><select value={rating} onChange={event => setRating(event.target.value)}><option value="all">All ratings</option>{[5, 4, 3, 2, 1].map(value => <option key={value} value={value}>{value} stars</option>)}</select></label></div>
          <div className="review-feed">{result.map(review => <article className="review-row" key={review.id}>
            <div className="review-avatar">{review.name === 'You' ? 'Y' : review.name[0]}</div>
            <div className="review-main"><div className="review-row-meta"><button className="course-inline-link" onClick={() => openCourse(review.courseCode)}><strong>{review.courseCode}</strong><span>{getCourse(review.courseCode).name}</span></button><time dateTime={review.date}>{formatDate(review.date)}</time></div>
              <div className="review-rating"><span className="rating-value">{review.rating} / 5</span></div><p className="review-comment">{review.comment || 'No comment provided.'}</p>
              <div className="review-byline">Shared by <strong>{review.name === 'You' ? 'you' : review.name}</strong>{review.owner === 'you' && <button className="text-button" onClick={() => openEditor(review)}>Edit</button>}</div>
            </div>
          </article>)}{result.length === 0 && <div className="empty-state"><strong>No reviews found</strong><p>Try a different search, course, or rating filter.</p><button className="text-button" onClick={() => {setSearch(''); setRating('all'); setReviewCourse('all');}}>Clear filters</button></div>}</div>
          <div className="feed-footer"><span>Showing {result.length} of {reviews.length} reviews</span><button className="text-button" onClick={() => openEditor()}>Write a review</button></div>
        </section>
        }
        {tab === 'Your reviews' && <section className="review-list panel your-reviews" id="your-reviews">
          <div className="section-heading reviews-heading"><div><h2>Your reviews</h2><p className="section-description">Reviews you have shared.</p></div><button className="text-button" onClick={() => openEditor()}>Write a review</button></div>
          <div className="review-feed">{reviews.filter(review => review.owner === 'you').map(review => <article className="review-row" key={review.id}>
            <div className="review-avatar">Y</div>
            <div className="review-main"><div className="review-row-meta"><button className="course-inline-link" onClick={() => openCourse(review.courseCode)}><strong>{review.courseCode}</strong><span>{getCourse(review.courseCode).name}</span></button><time dateTime={review.date}>{formatDate(review.date)}</time></div>
              <div className="review-rating"><span className="rating-value">{review.rating} / 5</span></div><p className="review-comment">{review.comment || 'No comment provided.'}</p>
              <button className="text-button" onClick={() => openEditor(review)}>Edit your review</button>
            </div>
          </article>)}</div>
          {!reviews.some(review => review.owner === 'you') && <div className="empty-state"><strong>No reviews yet</strong><p>Your reviews will appear here after you post one.</p></div>}
        </section>
        }

        <footer className="page-footer"><span>Course Review Board</span><button onClick={reset}>Restore example data</button></footer>
      </>}
    </main>

    {editor && <div className="overlay" onMouseDown={event => event.target === event.currentTarget && setEditor(null)}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="review-dialog-title">
        <div className="modal-title"><div><h2 id="review-dialog-title">{editor.id ? 'Edit review' : 'Write a review'}</h2><p>One review per course. You can edit yours later.</p></div><button className="close-modal" onClick={() => setEditor(null)} aria-label="Close">×</button></div>
        <form onSubmit={submit}>
          <label>Course code<input autoFocus value={editor.courseCode} onChange={event => setEditor(current => ({...current, courseCode: event.target.value}))} placeholder="e.g. CSEN701" /></label>
          <fieldset className="rating-field"><legend>Overall rating</legend><div className="star-picker">{[1, 2, 3, 4, 5].map(value => <label className={Number(editor.rating) >= value ? 'selected' : ''} key={value}><input type="radio" name="rating" value={value} checked={editor.rating === String(value)} onChange={event => setEditor(current => ({...current, rating: event.target.value}))} aria-label={`${value} ${value === 1 ? 'star' : 'stars'}`} /><StarIcon /></label>)}<span className="rating-selection">{editor.rating ? `${editor.rating} of 5 stars` : 'Select a rating'}</span></div></fieldset>
          <label><span>Comment <span className="optional">(optional)</span></span><textarea value={editor.comment} rows={4} onChange={event => setEditor(current => ({...current, comment: event.target.value}))} placeholder="What should another student know?" /></label>
          {error && <div className="form-error" role="alert">{error}{error.startsWith('You have already reviewed') && <button type="button" onClick={() => openEditor(reviews.find(review => review.owner === 'you' && review.courseCode.toUpperCase() === editor.courseCode.trim().toUpperCase()))}>Edit that review</button>}</div>}
          <div className="modal-actions"><button type="button" className="outline-button" onClick={() => setEditor(null)}>Cancel</button><button type="submit" className="primary-button">{editor.id ? 'Save changes' : 'Post review'}</button></div>
        </form>
      </div>
    </div>}
  </div>;
}

export default App;
