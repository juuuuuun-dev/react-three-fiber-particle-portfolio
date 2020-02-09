import img0 from '../images/contact.png';
import img1 from '../images/cover3.png';
import img2 from '../images/about.png';

export default [
  {
    title: 'Home',
    src: img2,
    texts: [ 'I am a', 'frontend', '& backend', 'developer' ],
    textSize: 4.4,
    lineHeight: 2.8,
    bottomY: -9.6,
    lotationY: .80,
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