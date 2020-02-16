import img0 from '../images/contact.png';
import img1 from '../images/q.png';
import img2 from '../images/about.png';

export default [
  {
    title: 'Home',
    src: img2,
    // texts: [ 'I am a', 'frontend', '& backend', 'developer' ],
    texts: [ "I'm a web" , 'developer', '&designer' ],
    textSize: 3.9,
    lineHeight: 2.6,
    bottomY: -10.5,
    positionX: -15.5,
    lotationY: .70,
    align: "left",
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