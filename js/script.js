document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.innerHTML = navLinks.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when clicking a link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // 2. Sticky Navigation & Scroll Spy
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));

    // 4. Gallery Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                // First fade out
                item.style.opacity = '0';
                item.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                        // Then fade in
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0) scale(1)';
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                }, 300); // Wait for fade out
            });
        });
    });

    // 5. WhatsApp Order Form Handling
    const orderForm = document.getElementById('orderForm');
    
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const cakeType = document.getElementById('cakeType').value;
            const date = document.getElementById('date').value;
            const message = document.getElementById('message').value;
            
            // Format WhatsApp message
            const waPhone = '1234567890'; // Placeholder number
            const text = `Hi Cake O' Clock! I would like to place an inquiry:%0A%0A*Name:* ${name}%0A*Occasion/Cake Type:* ${cakeType}%0A*Required Date:* ${date}%0A*Details:* ${message}`;
            
            const waUrl = `https://wa.me/${waPhone}?text=${text}`;
            
            // Open in new tab
            window.open(waUrl, '_blank');
        });
    }

    // 6. Three.js 3D Cake Model & Parallax
    const initThreeJS = () => {
        const canvas = document.getElementById('hero-3d-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        
        // Camera setup
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 5, 15);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        canvas.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        scene.add(directionalLight);
        
        const fillLight = new THREE.DirectionalLight(0xffe6e6, 0.4);
        fillLight.position.set(-10, 10, -10);
        scene.add(fillLight);

        // Create Cake Group
        const cake = new THREE.Group();
        
        // Base Tier
        const baseGeo = new THREE.CylinderGeometry(3, 3, 2, 32);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0xfcefee, roughness: 0.7 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = -1;
        cake.add(base);

        // Middle Tier
        const midGeo = new THREE.CylinderGeometry(2.2, 2.2, 2, 32);
        const midMat = new THREE.MeshStandardMaterial({ color: 0xf3d8d6, roughness: 0.7 });
        const mid = new THREE.Mesh(midGeo, midMat);
        mid.position.y = 1;
        cake.add(mid);

        // Top Tier
        const topGeo = new THREE.CylinderGeometry(1.5, 1.5, 1.5, 32);
        const topMat = new THREE.MeshStandardMaterial({ color: 0xd4dfc7, roughness: 0.7 });
        const top = new THREE.Mesh(topGeo, topMat);
        top.position.y = 2.75;
        cake.add(top);
        
        // Position Cake
        cake.position.set(5, -1, -5); // Position to the right side
        // Adjust for mobile
        if (window.innerWidth < 768) {
            cake.position.set(0, -2, -8);
            cake.scale.set(0.7, 0.7, 0.7);
        }
        
        scene.add(cake);

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);
            cake.rotation.y += 0.005;
            renderer.render(scene, camera);
        };
        animate();

        // Handle Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            
            if (window.innerWidth < 768) {
                cake.position.set(0, -2, -8);
                cake.scale.set(0.7, 0.7, 0.7);
            } else {
                cake.position.set(5, -1, -5);
                cake.scale.set(1, 1, 1);
            }
        });
        
        // Parallax effect on scroll
        const heroContent = document.querySelector('.hero-content');
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                cake.position.y = -1 + (scrollY * 0.003);
                if (heroContent) {
                    heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
                    heroContent.style.opacity = 1 - (scrollY * 0.002);
                }
            }
        });
    };

    initThreeJS();
});
