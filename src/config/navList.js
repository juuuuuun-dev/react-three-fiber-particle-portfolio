import img1 from '../assets/images/curly_braces.png';
import img2 from '../assets/images/q.png';
import img3 from '../assets/images/contact.png';

export default [
  {
    title: 'Home',
    src: img1,
    texts: ['I am a', 'web', 'developer',],
    textSize: 4.2,
    lineHeight: 3.0,
    bottomY: -11.0,
    positionX: -7,
    lotationY: 0.71,
    description: 'I am a web developer JunKata',
    animated: true,
  },
  {
    title: 'ABOUT',
    src: img2,
    texts: ['ABOUT', 'ME'],
    path: '/about',
    animated: true,
  },
  {
    title: 'CONTACT',
    src: img3,
    texts: ['COTACT', 'ME'],
    path: '/contact',
    animated: true,
  },
  {
    title: 'COOKIES',
    path: '/cookies',
    animated: false,
  }
];
