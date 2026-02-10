class LinkTree {
    constructor() {
        this.links = {
            website: 'https://minecraft-tools-wiki.vercel.app/',
            modrinth: 'https://modrinth.com/user/Vanilama-modded',
            curseforge: 'https://www.curseforge.com/members/vanilama/projects',
            mcfiles: 'https://drive.google.com/drive/folders/1vBRGisZKlpO1clAqOW7-MXbw01vDIXXN?usp=sharing',
            oldwebsite: 'https://minecraft-tools-wiki.super.site/',
            github: 'https://linktr.ee/vanilama',
            coffee: 'https://linktr.ee/vanilama'
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.animateOnLoad();
        this.setupIntersectionObserver();
    }

    setupEventListeners() {
        document.querySelectorAll('.link-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.playHoverEffect();
            });
        });

        document.querySelectorAll('.social-link').forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleSocialClick(link);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    }

    handleSocialClick(link) {
        this.createRippleEffect(link);
    }

    createRippleEffect(element) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = rect.width / 2;
        const y = rect.height / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x - size/2}px;
            top: ${y - size/2}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    playHoverEffect() {
    }

    animateOnLoad() {
        const cards = document.querySelectorAll('.link-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('loading');
        });

        const profileSection = document.querySelector('.profile-section');
        profileSection.style.animationDelay = '0.2s';
        profileSection.classList.add('loading');
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.link-card').forEach(card => {
            observer.observe(card);
        });
    }

    handleTabNavigation(e) {
        const focusableElements = document.querySelectorAll('.link-card, .social-link');
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
        
        if (e.shiftKey) {
            if (currentIndex > 0) {
                e.preventDefault();
                focusableElements[currentIndex - 1].focus();
            }
        } else {
            if (currentIndex < focusableElements.length - 1) {
                e.preventDefault();
                focusableElements[currentIndex + 1].focus();
            }
        }
    }

    updateProfileInfo(name, bio, avatar) {
        if (name) document.querySelector('.profile-name').textContent = name;
        if (bio) document.querySelector('.profile-bio').textContent = bio;
        if (avatar) document.querySelector('.avatar').src = avatar;
    }

    addLink(type, title, description, icon, url) {
        this.links[type] = url;
        
        const linksSection = document.querySelector('.links-section');
        const newCard = document.createElement('a');
        newCard.className = 'link-card';
        newCard.dataset.link = type;
        newCard.href = url;
        newCard.target = '_blank';
        newCard.rel = 'noopener noreferrer';
        
        newCard.innerHTML = `
            <div class="link-icon">
                <i class="${icon}"></i>
            </div>
            <div class="link-content">
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
            <i class="fas fa-external-link-alt"></i>
        `;
        
        linksSection.appendChild(newCard);
        
        newCard.addEventListener('mouseenter', () => {
            this.playHoverEffect();
        });
        
        setTimeout(() => {
            newCard.style.animationDelay = '0s';
            newCard.classList.add('loading');
        }, 100);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .link-card:focus,
    .social-link:focus {
        outline: none;
    }
    
    .visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    const linkTree = new LinkTree();
    
    window.linkTree = linkTree;
    (function loadAndApplyBackground(){
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = 'background.png';

        img.onload = () => {
            try{
                const col = getAverageColor(img);
                const hsl = rgbToHsl(col.r, col.g, col.b);

                const primary = `hsl(${Math.round(hsl.h)}, 64%, ${Math.min(64, Math.max(36, Math.round(hsl.l*100 + 8))) }%)`;
                const accent = `hsl(${Math.round((hsl.h + 28) % 360)}, 62%, ${Math.min(58, Math.max(34, Math.round(hsl.l*100 + 2))) }%)`;

                document.documentElement.style.setProperty('--primary-color', primary);
                document.documentElement.style.setProperty('--accent-color', accent);
                document.documentElement.style.setProperty('--bg-image', `url('/background.png')`);
                document.body.classList.add('has-bg');
            }catch(e){
            }
        };

        img.onerror = () => {
        };

        function getAverageColor(image){
            const w = 32, h = 32;
            const canvas = document.createElement('canvas');
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, w, h);
            const data = ctx.getImageData(0,0,w,h).data;
            let r=0,g=0,b=0,count=0;
            for(let i=0;i<data.length;i+=4){
                const alpha = data[i+3]/255;
                if(alpha < 0.2) continue;
                r += data[i]*alpha; g += data[i+1]*alpha; b += data[i+2]*alpha; count += alpha;
            }
            if(count === 0) return {r:34,g:40,b:60};
            return {r:Math.round(r/count), g:Math.round(g/count), b:Math.round(b/count)};
        }

        function rgbToHsl(r,g,b){
            r/=255; g/=255; b/=255;
            const max = Math.max(r,g,b), min = Math.min(r,g,b);
            let h=0, s=0, l=(max+min)/2;
            if(max !== min){
                const d = max-min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch(max){
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return {h: h*360, s: s, l: l};
        }
    })();
    
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`LinkTree loaded in ${loadTime}ms`);
        });
    }
    
    document.documentElement.style.scrollBehavior = 'smooth';
});
