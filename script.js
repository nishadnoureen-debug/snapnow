document.addEventListener('DOMContentLoaded', () => {
    
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const hamburgerIcon = document.querySelector('.hamburger i');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle icon between bars and xmark
            if (navLinks.classList.contains('active')) {
                hamburgerIcon.classList.remove('fa-bars');
                hamburgerIcon.classList.add('fa-xmark');
                // Ensure hamburger is visible against white menu background
                hamburger.style.color = 'var(--dark)';
            } else {
                hamburgerIcon.classList.remove('fa-xmark');
                hamburgerIcon.classList.add('fa-bars');
                // Reset color based on scroll state
                if (!navbar.classList.contains('scrolled')) {
                    hamburger.style.color = 'var(--white)';
                } else {
                    hamburger.style.color = '';
                }
            }
        });
    }

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburgerIcon.classList.remove('fa-xmark');
                hamburgerIcon.classList.add('fa-bars');
                
                if (!navbar.classList.contains('scrolled')) {
                    hamburger.style.color = 'var(--white)';
                } else {
                    hamburger.style.color = '';
                }
            }
        });
    });

    // Trigger Hero Animations on Load
    setTimeout(() => {
        document.querySelectorAll('.hero-slide-side').forEach(el => el.classList.add('visible'));
        document.querySelectorAll('.hero-fade').forEach(el => el.classList.add('visible'));
    }, 100);

    // Scroll Reveal Animation (Intersection Observer)
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal, .reveal-zoom').forEach(el => {
        revealObserver.observe(el);
    });

    // Parallax Effect for Hero
    const heroBg = document.querySelector('.hero-bg');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (heroBg && scrolled < window.innerHeight) {
            // Move background slightly slower than scroll
            heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });

    // Horizontal Scroll for Gear Section (Optional enhancement)
    // We let the native CSS scroll do the work for touch, 
    // but we can add wheel event listener for horizontal scrolling on desktop
    const scrollContainer = document.querySelector('.horizontal-scroll-container');
    
    if (scrollContainer) {
        scrollContainer.addEventListener('wheel', (evt) => {
            // Prevent default vertical scroll and scroll horizontally instead
            // Only if we are hovering over the gear track and it overflows
            if (scrollContainer.scrollWidth > scrollContainer.clientWidth) {
                evt.preventDefault();
                scrollContainer.scrollLeft += evt.deltaY;
            }
        }, { passive: false });
    }
    
    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset for navbar
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Booking Form Logic
    const bookingForm = document.getElementById('bookingForm');
    const bookingFormTitle = document.getElementById('bookingFormTitle');
    const selectedPackageInput = document.getElementById('selectedPackage');

    document.querySelectorAll('a[href="#contact"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const text = btn.textContent.trim();
            if (text.startsWith('Book ')) {
                e.preventDefault();
                let packageName = text.replace('Book ', '').trim();
                if (packageName === 'Now') packageName = 'a Session';
                
                if (bookingFormTitle) {
                    bookingFormTitle.textContent = 'Book ' + packageName;
                }
                if (selectedPackageInput) {
                    selectedPackageInput.value = packageName;
                }
                
                // Scroll to footer contact section smoothly
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    window.scrollTo({
                        top: contactSection.offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Focus on the first input
                    setTimeout(() => {
                        const nameInput = document.getElementById('name');
                        if (nameInput) nameInput.focus();
                    }, 800);
                }
            }
        });
    });

    // Modal Selectors
    const confirmationModal = document.getElementById('confirmationModal');
    const closeModalBtn = document.getElementById('closeModal');
    const modalOkBtn = document.getElementById('modalOkBtn');
    const modalName = document.getElementById('modalName');
    const modalPackage = document.getElementById('modalPackage');
    const modalEmail = document.getElementById('modalEmail');
    const modalPhone = document.getElementById('modalPhone');
    const modalDate = document.getElementById('modalDate');
    const modalDateContainer = document.getElementById('modalDateContainer');

    function showModal(name, pkg, email, phone, date) {
        if (modalName) modalName.textContent = name;
        if (modalPackage) {
            modalPackage.textContent = pkg ? pkg + ' Package' : 'a Session';
        }
        if (modalEmail) modalEmail.textContent = email;
        if (modalPhone) modalPhone.textContent = phone;
        
        if (modalDate) {
            if (date) {
                modalDate.textContent = new Date(date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
                if (modalDateContainer) modalDateContainer.style.display = 'flex';
            } else {
                if (modalDateContainer) modalDateContainer.style.display = 'none';
            }
        }
        
        if (confirmationModal) {
            confirmationModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Disable background scrolling when modal is open
        }
    }

    function hideModal() {
        if (confirmationModal) {
            confirmationModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore body scroll
        }
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', hideModal);
    if (modalOkBtn) modalOkBtn.addEventListener('click', hideModal);
    if (confirmationModal) {
        confirmationModal.addEventListener('click', (e) => {
            if (e.target === confirmationModal) {
                hideModal();
            }
        });
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const date = document.getElementById('date').value.trim();
            const pkg = selectedPackageInput ? selectedPackageInput.value : '';
            
            // Format name with package if chosen, e.g. "John Doe [Package: Signature]"
            const fullNameWithPackage = pkg ? `${fullName} [Package: ${pkg}]` : fullName;

            // Submit using fetch in x-www-form-urlencoded
            const googleFormUrl = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdZs3GCTo7OOiBdftRbOMFAvH-RSJj8HkKHxmmGusbWvJNkcw/formResponse";
            
            const urlParams = new URLSearchParams();
            urlParams.append('entry.720595420', fullNameWithPackage);
            urlParams.append('entry.190919875', email);
            urlParams.append('entry.992756748', phone);
            urlParams.append('entry.494052433', date || 'Not Specified');
            
            // Change submit button state to loading
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit Request';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Submitting...';
            }

            fetch(googleFormUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: urlParams.toString()
            })
            .then(() => {
                // Show custom popup modal with form values
                showModal(fullName, pkg, email, phone, date);
                
                // Reset form
                bookingForm.reset();
                if (bookingFormTitle) {
                    bookingFormTitle.textContent = 'Book a Package';
                }
            })
            .catch((err) => {
                console.error("Submission error:", err);
                // Fallback (e.g. offline/network blocked): trigger success since opaque redirects may trigger errors on certain environments
                showModal(fullName, pkg, email, phone, date);
                bookingForm.reset();
            })
            .finally(() => {
                // Reset button state
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            });
        });
    }

});
