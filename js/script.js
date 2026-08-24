document.addEventListener('DOMContentLoaded', () => {
    
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const hamburgerIcon = document.querySelector('.hamburger i');
    
    function updateHamburgerColor() {
        if (!hamburger) return;
        if (navLinks && navLinks.classList.contains('active')) {
            hamburger.style.color = 'var(--white)';
        } else if (navbar && navbar.classList.contains('scrolled')) {
            hamburger.style.color = 'var(--dark)';
        } else {
            hamburger.style.color = 'var(--white)';
        }
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateHamburgerColor();
    });

    // Mobile Menu Toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle icon between bars and xmark
            if (navLinks.classList.contains('active')) {
                hamburgerIcon.classList.remove('fa-bars');
                hamburgerIcon.classList.add('fa-xmark');
            } else {
                hamburgerIcon.classList.remove('fa-xmark');
                hamburgerIcon.classList.add('fa-bars');
            }
            updateHamburgerColor();
        });
    }

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburgerIcon.classList.remove('fa-xmark');
                hamburgerIcon.classList.add('fa-bars');
                updateHamburgerColor();
            }
        });
    });

    // Trigger Hero Animations on Load
    setTimeout(() => {
        document.querySelectorAll('.hero-slide-side').forEach(el => el.classList.add('visible'));
        document.querySelectorAll('.hero-fade').forEach(el => el.classList.add('visible'));
    }, 120);

    // Scroll Reveal Animation Flow (Intersection Observer)
    const revealOptions = {
        threshold: 0.08,
        rootMargin: "0px 0px -20px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active', 'active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    const revealSelectors = '.reveal, .reveal-zoom, .reveal-left, .reveal-right';
    document.querySelectorAll(revealSelectors).forEach(el => {
        revealObserver.observe(el);
    });

    // Immediately activate any reveal elements already in the viewport on initial load
    document.querySelectorAll(revealSelectors).forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('reveal-active', 'active');
        }
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

    // =========================================
    // Booking Popup Modal & Selection Logic
    // =========================================
    const bookingModal = document.getElementById('bookingModal');
    const closeBookingModalBtn = document.getElementById('closeBookingModal');
    const popupBookingForm = document.getElementById('popupBookingForm');
    const popupBookingTitle = document.getElementById('popupBookingTitle');
    const popupSelectedPackage = document.getElementById('popupSelectedPackage');
    const popupServiceSelect = document.getElementById('popupServiceSelect');

    const bookingForm = document.getElementById('bookingForm');
    const bookingFormTitle = document.getElementById('bookingFormTitle');
    const selectedPackageInput = document.getElementById('selectedPackage');

    function openBookingModal(pkgName) {
        if (bookingModal) {
            if (pkgName) {
                if (popupBookingTitle) {
                    popupBookingTitle.textContent = 'Enquire for ' + pkgName;
                }
                if (popupSelectedPackage) {
                    popupSelectedPackage.value = pkgName;
                }
                if (popupServiceSelect) {
                    let matched = false;
                    for (let i = 0; i < popupServiceSelect.options.length; i++) {
                        const optVal = popupServiceSelect.options[i].value.toLowerCase();
                        const pLow = pkgName.toLowerCase();
                        if (optVal && (optVal.includes(pLow) || pLow.includes(optVal))) {
                            popupServiceSelect.selectedIndex = i;
                            matched = true;
                            break;
                        }
                    }
                    if (!matched) popupServiceSelect.selectedIndex = 0;
                }
            } else {
                if (popupBookingTitle) {
                    popupBookingTitle.textContent = 'Book Your Session';
                }
                if (popupSelectedPackage) {
                    popupSelectedPackage.value = '';
                }
                if (popupServiceSelect) popupServiceSelect.selectedIndex = 0;
            }
            
            bookingModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                const nameInput = document.getElementById('popupName');
                if (nameInput) nameInput.focus();
            }, 300);
        }
    }

    function closeBookingModal() {
        if (bookingModal) {
            bookingModal.classList.remove('active');
            if (!confirmationModal || !confirmationModal.classList.contains('active')) {
                document.body.style.overflow = '';
            }
        }
    }

    if (closeBookingModalBtn) {
        closeBookingModalBtn.addEventListener('click', closeBookingModal);
    }
    if (bookingModal) {
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) {
                closeBookingModal();
            }
        });
    }

    // Attach open modal listener to all Book Now & Package CTA buttons
    document.querySelectorAll('.open-booking-modal, a[href="#bookingModal"], a[href="#contact"], a[href$="#contact"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const dataPkg = btn.getAttribute('data-package');
            const text = btn.textContent.trim();
            
            let packageName = '';
            if (dataPkg) {
                packageName = dataPkg;
            } else if (text.startsWith('Get ')) {
                packageName = text.replace('Get ', '').trim();
                if (packageName === 'Started') packageName = 'Marketing Retainer';
            } else if (text.startsWith('Book ')) {
                packageName = text.replace('Book ', '').trim();
                if (packageName === 'Now') packageName = 'a Session';
            } else if (text.toLowerCase().includes('customise')) {
                packageName = 'Customised Retainer';
            }

            if (bookingModal) {
                openBookingModal(packageName);
            } else {
                // Fallback to footer scroll if popup is not on page
                if (packageName) {
                    if (bookingFormTitle) bookingFormTitle.textContent = 'Enquire for ' + packageName;
                    if (selectedPackageInput) selectedPackageInput.value = packageName;
                }
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    window.scrollTo({
                        top: contactSection.offsetTop,
                        behavior: 'smooth'
                    });
                    setTimeout(() => {
                        const nameInput = document.getElementById('name');
                        if (nameInput) nameInput.focus();
                    }, 800);
                }
            }
        });
    });

    // Sync select dropdown with selectedPackage input inside popup
    if (popupServiceSelect) {
        popupServiceSelect.addEventListener('change', () => {
            if (popupSelectedPackage) {
                popupSelectedPackage.value = popupServiceSelect.value;
            }
            if (popupServiceSelect.value && popupBookingTitle) {
                popupBookingTitle.textContent = 'Enquire for ' + popupServiceSelect.value;
            }
        });
    }

    // Modal Selectors for Confirmation
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
            modalPackage.textContent = pkg ? (pkg.toLowerCase().includes('package') || pkg.toLowerCase().includes('retainer') || pkg.toLowerCase().includes('shoot') ? pkg : pkg + ' Package') : 'a Session';
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

    // Submission logic for Popup Booking Form
    // Unified Booking Data Dispatcher (FormSubmit direct email + PHP mailer fallback)
    async function dispatchBookingRequest(formData) {
        const { fullName, email, phone, date, pkg } = formData;

        // 1. Direct Email Delivery via FormSubmit to snapnowuae@gmail.com (CC: info@snapnow.ae)
        const emailPromise = fetch("https://formsubmit.co/ajax/snapnowuae@gmail.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "Name": fullName,
                "Email": email,
                "Phone": phone,
                "Event Date": date || 'Not Specified',
                "Package / Service": pkg || 'General Enquiry',
                "_subject": `New SnapNow Booking Request: ${pkg || 'General Enquiry'} from ${fullName}`,
                "_cc": "info@snapnow.ae",
                "_template": "table",
                "_captcha": "false"
            })
        }).catch(err => console.warn("Email service notice:", err));

        // 2. Local PHP Mailer (if hosting environment supports PHP)
        const phpFormData = new FormData();
        phpFormData.append('name', fullName);
        phpFormData.append('email', email);
        phpFormData.append('phone', phone);
        phpFormData.append('date', date || '');
        phpFormData.append('service', pkg || 'General Enquiry');

        const phpPromise = fetch('send_mail.php', {
            method: 'POST',
            body: phpFormData
        }).catch(err => console.warn("PHP mailer notice:", err));

        return Promise.allSettled([emailPromise, phpPromise]);
    }

    // Submission logic for Popup Booking Form
    if (popupBookingForm) {
        popupBookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameEl = popupBookingForm.querySelector('[name="name"]') || document.getElementById('popupName');
            const emailEl = popupBookingForm.querySelector('[name="email"]') || document.getElementById('popupEmail');
            const phoneEl = popupBookingForm.querySelector('[name="phone"]') || document.getElementById('popupPhone');
            const dateEl = popupBookingForm.querySelector('[name="date"]') || document.getElementById('popupDate');
            const serviceSelect = popupBookingForm.querySelector('select') || popupServiceSelect;
            const selectedPkgInput = popupBookingForm.querySelector('[name="service"], [name="selectedPackage"]') || popupSelectedPackage;

            const fullName = nameEl ? nameEl.value.trim() : '';
            const email = emailEl ? emailEl.value.trim() : '';
            const phone = phoneEl ? phoneEl.value.trim() : '';
            const date = dateEl ? dateEl.value.trim() : '';
            const serviceVal = serviceSelect ? serviceSelect.value : '';
            const pkg = (selectedPkgInput && selectedPkgInput.value) ? selectedPkgInput.value : serviceVal;

            const submitBtn = popupBookingForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit Booking Request';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Submitting...';
            }

            dispatchBookingRequest({ fullName, email, phone, date, pkg })
                .then(() => {
                    closeBookingModal();
                    showModal(fullName, pkg, email, phone, date);
                    popupBookingForm.reset();
                })
                .finally(() => {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalBtnText;
                    }
                });
        });
    }

    // Submission logic for Footer Booking Form (if present)
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameEl = bookingForm.querySelector('[name="name"]') || document.getElementById('name');
            const emailEl = bookingForm.querySelector('[name="email"]') || document.getElementById('email');
            const phoneEl = bookingForm.querySelector('[name="phone"]') || document.getElementById('phone');
            const dateEl = bookingForm.querySelector('[name="date"]') || document.getElementById('date');
            const selectedPkgInput = bookingForm.querySelector('[name="service"], [name="selectedPackage"]') || selectedPackageInput;

            const fullName = nameEl ? nameEl.value.trim() : '';
            const email = emailEl ? emailEl.value.trim() : '';
            const phone = phoneEl ? phoneEl.value.trim() : '';
            const date = dateEl ? dateEl.value.trim() : '';
            const pkg = selectedPkgInput ? selectedPkgInput.value : '';

            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit Request';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Submitting...';
            }

            dispatchBookingRequest({ fullName, email, phone, date, pkg })
                .then(() => {
                    showModal(fullName, pkg, email, phone, date);
                    bookingForm.reset();
                })
                .finally(() => {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalBtnText;
                    }
                });
        });
    }

    // =========================================
    // Portfolio Filtering Logic
    // =========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    if (filterButtons.length > 0 && portfolioCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                portfolioCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');

                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.style.display = 'flex';
                        // Add fade-in animation
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300); // match transition duration
                    }
                });
            });
        });
    }

    // =========================================
    // Lightbox / Project Details Modal Logic
    // =========================================
    const projectLightbox = document.getElementById('projectLightbox');
    const closeLightboxBtn = document.getElementById('closeLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTag = document.getElementById('lightboxTag');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxClient = document.getElementById('lightboxClient');
    const lightboxLocation = document.getElementById('lightboxLocation');
    const lightboxDate = document.getElementById('lightboxDate');
    const lightboxGear = document.getElementById('lightboxGear');
    const lightboxBookBtn = document.getElementById('lightboxBookBtn');

    if (projectLightbox && portfolioCards.length > 0) {
        portfolioCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Get data attributes from clicked card
                const title = card.getAttribute('data-title');
                const tag = card.querySelector('.portfolio-tag').textContent;
                const desc = card.getAttribute('data-desc');
                const client = card.getAttribute('data-client');
                const location = card.getAttribute('data-location');
                const date = card.getAttribute('data-date');
                const gear = card.getAttribute('data-gear');
                const imgUrl = card.getAttribute('data-img');
                const videoUrl = card.getAttribute('data-video');
                const container = projectLightbox.querySelector('.lightbox-container');

                // Clear any existing iframe or custom video overlay first
                const lightboxMedia = projectLightbox.querySelector('.lightbox-media');
                if (lightboxMedia) {
                    const existingIframe = lightboxMedia.querySelector('iframe');
                    if (existingIframe) {
                        existingIframe.remove();
                    }
                    const existingOverlay = lightboxMedia.querySelector('.lightbox-video-overlay');
                    if (existingOverlay) {
                        existingOverlay.remove();
                    }
                }

                if (videoUrl) {
                    if (container) container.classList.add('has-video');
                    
                    const directLink = card.getAttribute('data-link');
                    if (directLink) {
                        // If directLink exists (Umarul and Desert Dirt Bike), show cover photo + play button overlay
                        if (lightboxImg) lightboxImg.style.display = 'none';
                        
                        const overlayDiv = document.createElement('div');
                        overlayDiv.className = 'lightbox-video-overlay';
                        overlayDiv.style.position = 'relative';
                        overlayDiv.style.width = '100%';
                        overlayDiv.style.height = '100%';
                        overlayDiv.style.cursor = 'pointer';
                        overlayDiv.style.display = 'flex';
                        overlayDiv.style.alignItems = 'center';
                        overlayDiv.style.justifyContent = 'center';
                        overlayDiv.style.background = '#000';
                        
                        const thumbImg = document.createElement('img');
                        thumbImg.src = imgUrl;
                        thumbImg.style.width = '100%';
                        thumbImg.style.height = '100%';
                        thumbImg.style.objectFit = 'cover';
                        thumbImg.style.opacity = '0.75';
                        thumbImg.style.transition = 'opacity 0.3s ease';
                        
                        const playBtn = document.createElement('div');
                        playBtn.className = 'custom-play-btn';
                        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                        playBtn.style.position = 'absolute';
                        playBtn.style.width = '80px';
                        playBtn.style.height = '80px';
                        playBtn.style.borderRadius = '50%';
                        playBtn.style.background = 'rgba(255, 255, 255, 0.9)';
                        playBtn.style.color = '#121212';
                        playBtn.style.display = 'flex';
                        playBtn.style.alignItems = 'center';
                        playBtn.style.justifyContent = 'center';
                        playBtn.style.fontSize = '2rem';
                        playBtn.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
                        playBtn.style.transition = 'transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease';
                        playBtn.style.paddingLeft = '6px';
                        
                        overlayDiv.appendChild(thumbImg);
                        overlayDiv.appendChild(playBtn);
                        
                        overlayDiv.addEventListener('mouseenter', () => {
                            playBtn.style.transform = 'scale(1.1)';
                            playBtn.style.background = '#FFFFFF';
                            playBtn.style.boxShadow = '0 12px 30px rgba(164, 214, 94, 0.4)';
                            thumbImg.style.opacity = '0.85';
                        });
                        overlayDiv.addEventListener('mouseleave', () => {
                            playBtn.style.transform = 'scale(1)';
                            playBtn.style.background = 'rgba(255, 255, 255, 0.9)';
                            playBtn.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
                            thumbImg.style.opacity = '0.75';
                        });
                        
                        overlayDiv.addEventListener('click', () => {
                            window.open(directLink, '_blank');
                        });
                        
                        if (lightboxMedia) lightboxMedia.appendChild(overlayDiv);
                    } else {
                        // Standard iframe embed for other video projects
                        if (lightboxImg) lightboxImg.style.display = 'none';
                        
                        const iframe = document.createElement('iframe');
                        iframe.src = videoUrl;
                        iframe.setAttribute('allowtransparency', 'true');
                        iframe.setAttribute('allow', 'encrypted-media');
                        iframe.setAttribute('scrolling', 'no');
                        iframe.style.width = '100%';
                        iframe.style.height = '100%';
                        iframe.style.border = 'none';
                        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
                        
                        if (lightboxMedia) lightboxMedia.appendChild(iframe);
                    }
                } else {
                    if (lightboxImg) {
                        lightboxImg.style.display = 'block';
                        lightboxImg.src = imgUrl;
                        lightboxImg.alt = title;
                    }
                    if (container) container.classList.remove('has-video');
                }

                // Map to lightbox elements
                if (lightboxTag) lightboxTag.textContent = tag;
                if (lightboxTitle) lightboxTitle.textContent = title;
                if (lightboxDesc) lightboxDesc.textContent = desc;
                if (lightboxClient) lightboxClient.textContent = client;
                if (lightboxLocation) lightboxLocation.textContent = location;
                if (lightboxDate) lightboxDate.textContent = date;
                if (lightboxGear) lightboxGear.textContent = gear;

                // Setup CTA button text & target package
                const currentBookBtn = document.getElementById('lightboxBookBtn');
                if (currentBookBtn) {
                    currentBookBtn.textContent = `Book similar ${tag} shoot`;
                    
                    // Remove existing event listeners by replacing the node (avoids stack accumulations)
                    const newBookBtn = currentBookBtn.cloneNode(true);
                    currentBookBtn.parentNode.replaceChild(newBookBtn, currentBookBtn);
                    
                    newBookBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        // Close lightbox
                        hideLightbox();
                        
                        // Set selected package and scroll to booking form
                        const selectedPackageInput = document.getElementById('selectedPackage');
                        const bookingFormTitle = document.getElementById('bookingFormTitle');
                        if (selectedPackageInput) selectedPackageInput.value = `${tag} (Inspired by ${title})`;
                        if (bookingFormTitle) bookingFormTitle.textContent = `Book ${tag} Session`;
                        
                        const contactSection = document.getElementById('contact');
                        if (contactSection) {
                            window.scrollTo({
                                top: contactSection.offsetTop,
                                behavior: 'smooth'
                            });
                            setTimeout(() => {
                                const nameInput = document.getElementById('name');
                                if (nameInput) nameInput.focus();
                            }, 800);
                        }
                    });
                }

                // Show lightbox
                showLightbox();
            });
        });
    }

    function showLightbox() {
        if (projectLightbox) {
            projectLightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Disable body scroll
        }
    }

    function hideLightbox() {
        if (projectLightbox) {
            projectLightbox.classList.remove('active');
            document.body.style.overflow = ''; // Restore body scroll
            
            // Clear iframe or video overlay if present to stop video audio
            const lightboxMedia = projectLightbox.querySelector('.lightbox-media');
            if (lightboxMedia) {
                const iframe = lightboxMedia.querySelector('iframe');
                if (iframe) {
                    iframe.remove();
                }
                const overlay = lightboxMedia.querySelector('.lightbox-video-overlay');
                if (overlay) {
                    overlay.remove();
                }
            }
            const container = projectLightbox.querySelector('.lightbox-container');
            if (container) {
                container.classList.remove('has-video');
            }
        }
    }

    if (closeLightboxBtn) {
        closeLightboxBtn.addEventListener('click', hideLightbox);
    }

    if (projectLightbox) {
        projectLightbox.addEventListener('click', (e) => {
            if (e.target === projectLightbox) {
                hideLightbox();
            }
        });
    }

    // ESC key closes modals / lightboxes
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideLightbox();
            hideBlogModal();
        }
    });

    // =========================================
    // Blogs Filtering Logic
    // =========================================
    const blogFilterButtons = document.querySelectorAll('.blogs-filters .filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    if (blogFilterButtons.length > 0 && blogCards.length > 0) {
        blogFilterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                blogFilterButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                blogCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');

                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // =========================================
    // Blog Modal / Reading Logic
    // =========================================
    const blogModal = document.getElementById('blogModal');
    const closeBlogModalBtn = document.getElementById('closeBlogModal');
    const blogModalImg = document.getElementById('blogModalImg');
    const blogModalTag = document.getElementById('blogModalTag');
    const blogModalDate = document.getElementById('blogModalDate');
    const blogModalTitle = document.getElementById('blogModalTitle');
    const blogModalBody = document.getElementById('blogModalBody');
    const blogModalBookBtn = document.getElementById('blogModalBookBtn');

    if (blogModal && blogCards.length > 0) {
        blogCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Check if the click was inside a link or booking CTA, if so, ignore card click
                if (e.target.closest('.btn') || e.target.closest('a')) {
                    return;
                }

                const title = card.getAttribute('data-title');
                const tag = card.getAttribute('data-tag');
                const date = card.getAttribute('data-date');
                const imgUrl = card.getAttribute('data-img');
                const fullContentDiv = card.querySelector('.blog-full-content');
                const fullContentHtml = fullContentDiv ? fullContentDiv.innerHTML : '';

                // Map to modal elements
                if (blogModalImg) blogModalImg.src = imgUrl;
                if (blogModalImg) blogModalImg.alt = title;
                if (blogModalTag) blogModalTag.textContent = tag;
                if (blogModalDate) blogModalDate.innerHTML = `<i class="fa-regular fa-calendar-days"></i> ${date}`;
                if (blogModalTitle) blogModalTitle.textContent = title;
                if (blogModalBody) blogModalBody.innerHTML = fullContentHtml;

                // Setup CTA button
                const currentBlogBookBtn = document.getElementById('blogModalBookBtn');
                if (currentBlogBookBtn) {
                    currentBlogBookBtn.textContent = `Book a Session (Inspired by: ${tag})`;
                    
                    // Replace to remove previous listeners
                    const newBookBtn = currentBlogBookBtn.cloneNode(true);
                    currentBlogBookBtn.parentNode.replaceChild(newBookBtn, currentBlogBookBtn);
                    
                    newBookBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        hideBlogModal();
                        
                        const selectedPackageInput = document.getElementById('selectedPackage');
                        const bookingFormTitle = document.getElementById('bookingFormTitle');
                        if (selectedPackageInput) selectedPackageInput.value = `Blog: ${title}`;
                        if (bookingFormTitle) bookingFormTitle.textContent = `Book a Session`;
                        
                        const contactSection = document.getElementById('contact');
                        if (contactSection) {
                            window.scrollTo({
                                top: contactSection.offsetTop,
                                behavior: 'smooth'
                            });
                            setTimeout(() => {
                                const nameInput = document.getElementById('name');
                                if (nameInput) nameInput.focus();
                            }, 800);
                        }
                    });
                }

                showBlogModal();
            });
        });
    }

    function showBlogModal() {
        if (blogModal) {
            blogModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function hideBlogModal() {
        if (blogModal) {
            blogModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (closeBlogModalBtn) {
        closeBlogModalBtn.addEventListener('click', hideBlogModal);
    }

    if (blogModal) {
        blogModal.addEventListener('click', (e) => {
            if (e.target === blogModal) {
                hideBlogModal();
            }
        });
    }

    // Dynamic Hero Button Text & Destination Rotator (Retainers <-> Production Shoots)
    const heroDynamicBtn = document.getElementById('heroDynamicBtn');
    if (heroDynamicBtn) {
        const destinations = [
            { text: 'Explore Retainers', href: 'retainers.html', icon: 'fa-arrow-right' },
            { text: 'Explore Production Shoots', href: 'production.html', icon: 'fa-video' }
        ];
        let currentIndex = 0;

        setInterval(() => {
            heroDynamicBtn.classList.add('changing');
            
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % destinations.length;
                const nextDest = destinations[currentIndex];
                
                heroDynamicBtn.href = nextDest.href;
                const textSpan = heroDynamicBtn.querySelector('.dynamic-text-container');
                const iconElem = heroDynamicBtn.querySelector('.dynamic-btn-icon');
                
                if (textSpan) textSpan.textContent = nextDest.text;
                if (iconElem) {
                    iconElem.className = `fa-solid ${nextDest.icon} dynamic-btn-icon`;
                }
                
                heroDynamicBtn.classList.remove('changing');
            }, 350);
        }, 3200);
    }

    // Ensure WhatsApp floating button is present on the page
    if (!document.querySelector('.whatsapp-float')) {
        const waBtn = document.createElement('a');
        waBtn.href = 'https://wa.me/971585511617';
        waBtn.className = 'whatsapp-float';
        waBtn.target = '_blank';
        waBtn.rel = 'noopener noreferrer';
        waBtn.setAttribute('aria-label', 'Contact us on WhatsApp');
        waBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
        document.body.appendChild(waBtn);
    }
});


