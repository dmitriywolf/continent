import Glide from './../../../node_modules/@glidejs/glide';

const carousel = () => {
  const configPartners = {
    type: 'carousel',
    startAt: 0,
    perView: 3,
    breakpoints: {
      990: {
        perView: 2,
      },
      575: {
        perView: 1,
      },
    },
  };
  new Glide('.glide--thanks-federal', configPartners).mount();
  new Glide('.glide--thanks-parents', configPartners).mount();
};

export default carousel;