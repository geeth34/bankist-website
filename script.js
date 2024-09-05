'use strict'

// Elements
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const sect1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// 'Open account' window 
const openModal = () =>
{
    overlay.classList.remove('hidden');
    modal.classList.remove('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

const closeModal = () =>
{
    overlay.classList.add('hidden');
    modal.classList.add('hidden');
};

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => 
{
    console.log(e);
    if(e.key === 'Escape' && !modal.classList.contains('hidden'))
        closeModal();
});

// implement smooth scrolling 

// 1) 'Learn more' button 
btnScrollTo.addEventListener('click', (e) => sect1.scrollIntoView({behavior : 'smooth'}));

// 2) navigation buttons 
document.querySelector('.nav__links').addEventListener('click', (e) =>
{
    e.preventDefault();
    console.log(e.target);  // event origin 
    
    // to ignore clicks outside the buttons
    if(e.target.classList.contains('nav__link'))
    {    
        const id = e.target.getAttribute('href'); 
        // getAttribute() gives the 'relative' url 
        console.log(id);

        // smooth scroll to respective section
        document.querySelector(id).scrollIntoView({behavior : 'smooth'});
    };
});

// building the tabbed component inside 'Operations' section
tabsContainer.addEventListener('click', (e) =>
{
    const clicked = e.target.closest('.operations__tab');
    console.log(clicked); // the closest parent element with class 'operations__tab' will be returned 

    if(!clicked)
        return;

    tabs.forEach((t) => t.classList.remove('operations__tab--active'));
    tabsContent.forEach((c) => c.classList.remove('operations__content--active'));

    clicked.classList.add('operations__tab--active');
    console.log(clicked.dataset.tab);

    // display content associated to the active tab 
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

// using Intersection observer API 

// 1) menu fade animation 
const nav = document.querySelector('nav');
// handler function for mouseover and mouseout events on 'nav' elements
const handleHover = (e, opacity) =>
{
    if(e.target.classList.contains('nav__link')) 
    {
        const hovered = e.target;
        console.log(hovered);

        const siblings = hovered.closest('.nav').querySelectorAll('.nav__link');
        console.log(siblings);

        const logo = hovered.closest('.nav').querySelector('img');
        
        // fade elements NOT hovered over 
        siblings.forEach((el) => 
        {
            if(el !== hovered)
                el.style.opacity = opacity;
        });
        logo.style.opacity = opacity;
    };
};

// when the mouse is hovered 'over'
nav.addEventListener('mouseover', (e) =>
{
    handleHover(e, 0.5);
});

// when the mouse is moved 'away' 
nav.addEventListener('mouseout', (e) =>
{
    handleHover(e, 1);
});

// 2) implement sticky navigation 
// the navigation bar becomes sticky when the header moves completely out of the view (threshold = 0)

const header = document.querySelector('.header');
const stickyNav = (entries) =>
{
    console.log(entries);
    const [entry] = entries;  // entries[0]

    // if the header is not intersecting the viewport then 'isIntersecting' = false
    if(!entry.isIntersecting)
        nav.classList.add('sticky');
    else    
        nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, 
{
    root : null,
    threshold : 0,  // when the header intersects the viewport at 0% 
    rootMargin : '-90px', // 90px 'before' the threshold
});

headerObserver.observe(header);

// 3) revealing the sections on scroll
const allSections = document.querySelectorAll('.section');
const revealSection = (entries, observer) =>
{
    console.log(entries, observer);
    const [entry] = entries;
    console.log(entry);

    if(!entry.isIntersecting)
        return;

    entry.target.classList.remove('section--hidden');
    // unobserving the event after observe
    observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, 
{
    root : null,
    threshold : 0.15,  // when 15% of the section is visible
});

// observing the sections
allSections.forEach((section) => 
{
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
});

// 4) lazy loading images
// load the actual image only on scroll

const imgTargets = document.querySelectorAll('img[data-src]');
console.log(imgTargets);

const loadImg = (entries, observer) =>
{
    const [entry] = entries;
    console.log(entry);

    if(!entry.isIntersecting)
        return;

    // replace the low resolution images with actual ones
    entry.target.src = entry.target.dataset.src;
    
    entry.target.addEventListener('load', () => 
    {    
        entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, 
{
    root : null,
    threshold : 0,
    rootMargin : '200px',  // image gets loaded 200px before intersecting the viewport
});
imgTargets.forEach((img) => imgObserver.observe(img));

// building slider componenet 
const slider = function()
{
    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const maxSlide = slides.length;
    const dotContainer = document.querySelector('.dots');

    // current slide position (index)
    let curSlide = 0;

    // Functions 

    // set position of each slide
    const goToSlide = (slide) =>
    {
        slides.forEach((s, i) =>
        {
            s.style.transform = `translateX(${100 * (i - slide)}%)`;
            /* say, 
            default slide = 0,
            i = 0 => (0 - 0) * 100 = 0%
            i = 1 => (1 - 0) * 100 = 100%
            i = 2 => (2 - 0) * 100 = 200%
            i = 3 => (3 - 0) * 100 = 300%
            */
        });
    };

    // dots (buttons) representing slide position/number
    const createDots = () =>
    {
        slides.forEach((_, i) => dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`));
    };

    // activate the dot representing the active slide 
    const activateDot = (slide) =>
    {
        document.querySelectorAll('.dots__dot').forEach((dot) => dot.classList.remove('dots__dot--active'));
        document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
    };

    // navigate to next slide 
    const nextSlide = () =>
    {
        if(curSlide === maxSlide - 1)
            curSlide = 0;
        else
            curSlide++;

        // update the current slide and respective dot 
        goToSlide(curSlide);
        activateDot(curSlide);
    };

    // navigate to previous slide 
    const prevSlide = () =>
    {
        if(curSlide === 0)
            curSlide = maxSlide - 1;
        else
            curSlide--;

        goToSlide(curSlide);
        activateDot(curSlide);
    };   

    const init = () =>
    {
        createDots();
        // setting the first slide as default
        goToSlide(0);
        activateDot(0);
    };
    init();

    // Event handlers 

    // slide navigation
    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);
    document.addEventListener('keydown', (e) =>
    {
        console.log(e);
        if(e.key === 'ArrowLeft')
            prevSlide();
        e.key === 'ArrowRight' && nextSlide();
    });

    // activate the dots 
    dotContainer.addEventListener('click', (e) =>
    {
        if(e.target.classList.contains('dots__dot'))
        {
            const {slide} = e.target.dataset;

            goToSlide(slide);
            activateDot(slide);
        }
    });
};

slider();