window.addEventListener('scroll', function() {
    let navbar = document.querySelector('header nav');
    if (window.scrollY > 0) {
        navbar.classList.add('sticky');
    } else {
        navbar.classList.remove('sticky');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    let announcementBar = document.getElementById('announcement-bar');
    let prevScrollPos = window.scrollY;

    window.onscroll = function() {
        let currentScrollPos = window.scrollY;
        if (prevScrollPos > currentScrollPos) {
            announcementBar.style.top = '0';
        } else {
            announcementBar.style.top = '-50px';
        }
        prevScrollPos = currentScrollPos;
    };
});


gsap.registerPlugin(ScrollTrigger);

let masks = gsap.utils.toArray(".img-mask");

gsap.to(masks[1], {
  height: "0%",
  ease: "none",
  scrollTrigger: {
    trigger: ".revealer",
    start: "top top",
    pin: true,
    end: "+=100%",
    scrub: 0.5
  }
});


const horizontalSections = gsap.utils.toArray('section.horizontal')

horizontalSections.forEach(function (sec, i) {	
  
  let thisPinWrap = sec.querySelector('.pin-wrap');
  let thisAnimWrap = thisPinWrap.querySelector('.animation-wrap');
  
  let getToValue = () => -(thisAnimWrap.scrollWidth - window.innerWidth); 

  gsap.fromTo(thisAnimWrap, { 
    x: () => thisAnimWrap.classList.contains('to-right') ? 0 : getToValue() 
  }, { 
    x: () => thisAnimWrap.classList.contains('to-right') ? getToValue() : 0, 
    ease: "none",
    scrollTrigger: {
      trigger: sec,		
      start: "top top",
      end: () => "+=" + (thisAnimWrap.scrollWidth - window.innerWidth),
      pin: thisPinWrap,
      invalidateOnRefresh: true,
      scrub: true,    
    }
  });

});	

function animateFrom(elem, direction) {
  direction = direction || 1;
  let x = 0,
      y = direction * 100;
  if(elem.classList.contains("gs_reveal_fromLeft")) {
    x = -100;
    y = 0;
  } else if (elem.classList.contains("gs_reveal_fromRight")) {
    x = 100;
    y = 0;
  }
  elem.style.transform = "translate(" + x + "px, " + y + "px)";
  elem.style.opacity = "0";
  gsap.fromTo(elem, {x: x, y: y, autoAlpha: 0}, {
    duration: 1.25, 
    x: 0,
    y: 0, 
    autoAlpha: 1, 
    ease: "expo", 
    overwrite: "auto"
  });
}

function hide(elem) {
  gsap.set(elem, {autoAlpha: 0});
}

document.addEventListener("DOMContentLoaded", function() {
  gsap.registerPlugin(ScrollTrigger);
  
  gsap.utils.toArray(".gs_reveal").forEach(function(elem) {
    hide(elem); // assure that the element is hidden when scrolled into view
    
    ScrollTrigger.create({
      trigger: elem,
      onEnter: function() { animateFrom(elem) }, 
      onEnterBack: function() { animateFrom(elem, -1) },
      onLeave: function() { hide(elem) } 
    });
  });
});



//Morphing text animation
const elts = {
	text1: document.getElementById("text1"),
	text2: document.getElementById("text2")
};


const texts = [
	"Feel And Look",
	"Your Most Beautiful!",
	"-Charlotte T."
];

const morphTime = 1;
const cooldownTime = 0.25;

let textIndex = texts.length - 1;
let time = new Date();
let morph = 0;
let cooldown = cooldownTime;

elts.text1.textContent = texts[textIndex % texts.length];
elts.text2.textContent = texts[(textIndex + 1) % texts.length];

function doMorph() {
	morph -= cooldown;
	cooldown = 0;
	
	let fraction = morph / morphTime;
	
	if (fraction > 1) {
		cooldown = cooldownTime;
		fraction = 1;
	}
	
	setMorph(fraction);
}

function setMorph(fraction) {
	
	elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
	elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
	
	fraction = 1 - fraction;
	elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
	elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
	
	elts.text1.textContent = texts[textIndex % texts.length];
	elts.text2.textContent = texts[(textIndex + 1) % texts.length];
}

function doCooldown() {
	morph = 0;
	
	elts.text2.style.filter = "";
	elts.text2.style.opacity = "100%";
	
	elts.text1.style.filter = "";
	elts.text1.style.opacity = "0%";
}


function animate() {
	requestAnimationFrame(animate);
	
	let newTime = new Date();
	let shouldIncrementIndex = cooldown > 0;
	let dt = (newTime - time) / 1000;
	time = newTime;
	
	cooldown -= dt;
	
	if (cooldown <= 0) {
		if (shouldIncrementIndex) {
			textIndex++;
		}
		
		doMorph();
	} else {
		doCooldown();
	}
}

animate();

