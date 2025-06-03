const utils = {
    setupSidebarToggle() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const profileSidebar = document.getElementById('profileSidebar');
        const mainContent = document.querySelector('.main-content');
        const toggleIcon = document.getElementById('toggleIcon');

        if (mainContent) {
            mainContent.classList.add('full-width');
        }
        
        if (toggleIcon) {
            toggleIcon.classList.remove('fa-chevron-left');
            toggleIcon.classList.add('fa-chevron-right');
        }
        
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', function() {
                profileSidebar.classList.toggle('collapsed');
                profileSidebar.classList.toggle('expanded');
                mainContent.classList.toggle('full-width');
                
                if (profileSidebar.classList.contains('collapsed')) {
                    toggleIcon.classList.remove('fa-chevron-left');
                    toggleIcon.classList.add('fa-chevron-right');
                } else {
                    toggleIcon.classList.remove('fa-chevron-right');
                    toggleIcon.classList.add('fa-chevron-left');
                }
            });
        } else {
            console.warn('Sidebar toggle button not found');
        }

        let lastScrollTop = 0;
        let scrollThreshold = 5; 
        let scrollTimeout;
        
        window.addEventListener('scroll', function() {
            if (!profileSidebar) return;
            
            clearTimeout(scrollTimeout);
            
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (currentScrollTop > lastScrollTop && currentScrollTop > scrollThreshold) {
                if (!profileSidebar.classList.contains('collapsed')) {
                    profileSidebar.classList.add('collapsed');
                    profileSidebar.classList.remove('expanded'); 
                    mainContent.classList.add('full-width');
                    
                    if (toggleIcon) {
                        toggleIcon.classList.remove('fa-chevron-left');
                        toggleIcon.classList.add('fa-chevron-right');
                    }
                }
            }
            
            lastScrollTop = currentScrollTop;
        }, false);
    }
};