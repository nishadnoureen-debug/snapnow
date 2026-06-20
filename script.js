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
                // Ensure hamburger is visible against dark menu background
                hamburger.style.color = 'var(--white)';
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

});
