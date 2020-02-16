import img0 from '../images/contact.png';
import img1 from '../images/q.png';
import img2 from '../images/about.png';

export default [
  {
    title: 'Home',
    src: img2,
    // texts: [ 'I am a', 'frontend', '& backend', 'developer' ],
    texts: [ 'I am a', 'web', 'developer', '& designer' ],
    textSize: 4.2,
    lineHeight: 2.4,
    bottomY: -9.8,
    positionX: -12.5,
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