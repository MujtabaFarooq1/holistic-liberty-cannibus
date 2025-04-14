import React, { useState, useRef } from "react"
import "./HoverButton-old.scss"

export default function HoverButton(props) {

  const rippleEffect = (e) => {
    // e.preventDefault();
    var el = e.target; 
    e = e.touches ? e.touches[0] : e;

    var r = el.getBoundingClientRect(), d = Math.sqrt(Math.pow(r.width, 2) + Math.pow(r.height, 2)) * 0.8;
    el.style.cssText = "--s: 0; --o: 1;";
    var x = el.offsetTop;
    el.style.cssText = "--t: 1; --o: 0; --d: " + d + "; --x:" + (e.clientX - r.left) + "; --y:" + (e.clientY - r.top) + ";";
  }

  const classes = props.btnClassName + " btn anim-btn";

  return (
    <button 
      type={props.btnType} 
      id= {props.btnId}
      name={props.btnName} 
      anim="ripple" 
      className={classes} 
      onMouseMove={rippleEffect}
      // onMouseOver={rippleEffect} 
      onClick={props.onClick}
      disabled={props.disabled}
      >
      {props.children}
    </button>
  )

  
  // const [mouseX, setMouseX] = useState(null);
  // const [mouseY, setMouseY] = useState(null);
  // const [displayFollower, setDisplayFollower] = useState(false);

  // const hoverBtnRef = useRef();
  // const followerRef = useRef();


  // const onButtonHover = (e) => {
  //   setMouseX(e.pageX);
  //   setMouseY(e.pageY);
  //   // hoverBtnRef.current.style.background = "#FECF2F";
  //   // followerRef.current.style.opacity = "1";
  //   setDisplayFollower(true);
  //   console.log(displayFollower)

  // }
  // const stopPulse = (e) => {
  //   // hoverBtnRef.current.style.background = "#52645F";
  //   // // followerRef.current.style.opacity = "0";

  //   // setMouseX(0);
  //   // setMouseY(0);
  //   setDisplayFollower(false);
  //   console.log(displayFollower)
  // }
  // return (
  //   <div className="btn-wrap"  onMouseMove={onButtonHover} onMouseLeave={stopPulse}>
  //     <button
  //       type={props.btnType} 
  //       id= {props.btnId}
  //       name={props.btnName} 
  //       className={`anim-btn ${classes}`} 
  //       onClick={props.onClick}
  //       // onMouseMove = {onButtonHover}
  //       ref={hoverBtnRef}
  //       // onMouseLeave = {stopPulse}
  //     >
  //       {props.children}
  //     </button>
  //     {displayFollower ?
  //     // <div className="follower-pulse-new" ref={followerRef} style={{top:mouseY -10, left:mouseX -10}}></div>
  //       <div className="follower-pulse-new" ref={followerRef}></div>
  //     :null}
  //   </div>
  // )
}
