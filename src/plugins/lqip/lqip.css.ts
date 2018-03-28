export const styles = `
.lqip {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-size: 0 0;
  background-repeat: no-repeat;
  display: inline-block;
  transition: opacity .5s ease-in-out;
}

.lqip::after {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: inherit;
  z-index: 1;
  background-image: inherit;
  background-size: cover;
  background-repeat: no-repeat;
  filter: blur(15px);
  transform: scale(1.1);
}

.lqip.blur::after {
  opacity: 1;
}

.lqip img {
  transition: inherit;
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
`
