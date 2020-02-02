import img0 from '../images/contact.png';
import img1 from '../images/cover3.png';
import img2 from '../images/about.png';

export default [
  {
    title: 'Home',
    src: img2,
    texts: [ 'I AM A WEB', 'DEVELOPER', 'I MAKE A', 'MISTAKES' ],
    textSize: 5.8,
    lineHeight: 4,
    topText: 'DEVELOPER',
    bottomText: 'WHO OFTEN',
    description: 'descriptionです',
    // topText: 'CONTINUE',
    // bottomText: 'LEARNING',
  },
  {
    title: 'ABOUT',
    src: img1,
    texts: [ 'ABOUT', 'ME' ],
    topText: 'ABOUT',
    bottomText: 'ME',
    path: "/about",
    description: "ABOUT descriptionです",
  },
  {
    title: 'CONTACT',
    src: img0,
    texts: [ 'COTACT', 'ME' ],
    topText: 'CONTACT',
    bottomText: 'ME',
    path: "/contact",
    description: "CONTACT descriptionです",
  },
];