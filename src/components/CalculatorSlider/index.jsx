import React, { useState, useRef, useEffect, useLayoutEffect } from "react"
import { gsap, CSSPlugin } from "gsap"
import Draggable from "gsap/Draggable"

import { Strings } from "../../resources"

import EarningImage from "./lowerslider.png"
import "./CalculatorSlider.scss"

const percentageValue = {
  49: {
    from: 1,
    to: 49,
    percentage: 1,
  },
  149: {
    from: 50,
    to: 149,
    percentage: 5,
  },
  299: {
    from: 150,
    to: 299,
    percentage: 10,
  },
  599: {
    from: 300,
    to: 599,
    percentage: 15,
  },
  999: {
    from: 600,
    to: 999,
    percentage: 20,
  },
  1000: {
    from: 1000,
    to: 2500,
    percentage: 25,
  },
}

function CalculatorSlider() {
  let minValue = 1
  let maxValue = 49
  let startMin = 1

  const iniState = {
    knobWidth: 0,
    knobOffset: 0,
    containerWidth: 0,
    containerX: 0,
    stepWidth: 0,
  }

  const [loading, setLoading] = useState(true)
  const [size, setSize] = useState([0, 0])
  const [
    { knobWidth, knobOffset, containerWidth, containerX, stepWidth },
    setState,
  ] = useState(iniState)
  const [calculatedCredits, setCalculatedCredits] = React.useState(0)

  // refs
  const container = useRef(null)
  const knobRef = useRef(null)
  const knob = useRef(null)
  const step = useRef(null)
  const upperTooltipRef = useRef(null)
  const lowerTooltipRef = useRef(null)
  // scroll refs
  const lastScroll = React.useRef(0)
  const ticking = React.useRef(false)
  const scrollerRef = React.useRef()

  useLayoutEffect(() => {
    const onPageLoad = () => {
      setLoading(false)
    }

    // Check if the page has already loaded
    if (document.readyState === "complete") {
      onPageLoad()
    } else {
      window.addEventListener("load", onPageLoad)
      // Remove the event listener when component unmounts
      return () => window.removeEventListener("load", onPageLoad)
    }
  }, [])

  useLayoutEffect(() => {
    function updateSize() {
      setSize(window.innerWidth)
    }
    window.addEventListener("resize", updateSize)
    updateSize()
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  useEffect(() => {
    if (!loading) {
      const { left, width } = container.current.getBoundingClientRect()

      setState(prevState => ({
        ...prevState,
        knobWidth: knobRef.current.clientWidth,
        knobOffset: (knobRef.current.clientWidth - 15) / 2,
        stepWidth: step.current.clientWidth,
        containerWidth: width,
        containerX: left,
      }))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  useEffect(() => {
    if (knobWidth && containerWidth && stepWidth && !knob.current) {
      gsap.registerPlugin(CSSPlugin, Draggable)
      Draggable.create(knobRef.current, {
        type: "x",
        bounds: {
          left: -knobOffset,
          width: containerWidth + knobWidth,
        },
        cursor: "pointer",
        onDrag: updateRange,
      })

      Draggable.create(container.current, {
        bounds: container.current,
        cursor: "pointer",
        onPress: setKnob,
      })

      knob.current = Draggable.get(knobRef.current)
      init(startMin)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [knobWidth, containerWidth, stepWidth, startMin])

  function init(start) {
    gsap.set(knob.current.target, { x: getPosition(start) })

    knob.current.update()
    updateRange()
  }

  function calcCredits(key, value) {
    let percentageObject = percentageValue[key]
    setCalculatedCredits(
      Math.round(
        ((percentageObject.percentage / 100) * Math.round(value) + Number.EPSILON) * 100
      ) / 100
    )
  }

  function getValue(position) {
    let pos
    let keyToCheck = 1000
    ticking.current = false
    if (position < stepWidth * 1) {
      pos = position
      keyToCheck = 49
    } else if (position < stepWidth * 2) {
      pos = position - stepWidth
      keyToCheck = 149
    } else if (position < stepWidth * 3) {
      pos = position - stepWidth * 2
      keyToCheck = 299
    } else if (position < stepWidth * 4) {
      pos = position - stepWidth * 3
      keyToCheck = 599
    } else if (position < stepWidth * 5) {
      pos = position - stepWidth * 4
      keyToCheck = 999
    } else if (position <= stepWidth * 6) {
      pos = position - stepWidth * 5
      keyToCheck = 1000
    } else {
      pos = stepWidth
    }

    let ratio = pos / stepWidth

    let value =
      (percentageValue[keyToCheck].to - percentageValue[keyToCheck].from) *
        ratio +
      percentageValue[keyToCheck].from

    if (!ticking.current) {
      if (lastScroll.current > value) {
        scrollerRef.current.scrollLeft -= 5
      }
      if (lastScroll.current < value) {
        scrollerRef.current.scrollLeft += 5
      }
      lastScroll.current = value
      ticking.current = false
    }

    ticking.current = true

    if (value > 2500) value = 2500
    calcCredits(keyToCheck, value)
    return value
  }

  function getPosition(value) {
    let ratio = (value - minValue) / (maxValue - minValue)
    let position = ratio * stepWidth - knobOffset

    return position
  }

  function setKnob(event) {
    const mouseX = this.pointerX - containerX

    if (size < 1000 || mouseX > containerWidth || mouseX < -5) return

    gsap.set(knob.current.target, {
      x: mouseX - knobOffset,
      onComplete: function () {
        knob.current.startDrag(event)
      },
    })

    updateRange()
  }

  function getRange(knob) {
    let range = knob.x + knobOffset

    range = range < 1 ? 1 : range > containerWidth ? containerWidth : range

    return Math.ceil(range)
  }

  function updateRange() {
    const range1 = getRange(knob.current)
    const value1 = Math.round(getValue(range1))
    upperTooltipRef.current.innerHTML = value1
  }

  return (
    <>
      <div className="heading">
        <h1>{Strings.calc_title}</h1>
        <p>{Strings.calc_subtitle}</p>
      </div>
      <div className="section-container" ref={scrollerRef}>
        <div className="calculatorSection">
          <div id="container" className="calculator" ref={container}>
            <div className="knob" id="knob1" ref={knobRef}>
              <div className="tooltips upper">
                {Strings.calc_spend}{" "}
                <span id="upperTooltip" ref={upperTooltipRef}></span>
              </div>
              <div className="tooltips lower">
                <img src={EarningImage} alt="earnings" />
                {Strings.calc_earn}{" "}
                <span id="lowerTooltip" ref={lowerTooltipRef}>
                  {calculatedCredits}
                </span>
              </div>
            </div>
            {/* steps */}
            <div className="steps">
              <div className="steps-container">
                <div className="step" ref={step}>
                  <p className="upper_value">{Strings.calc_49_upper}</p>
                  <p className="lower_value">{Strings.calc_49_lower}</p>
                </div>
                <div className="step">
                  <p className="upper_value">{Strings.calc_149_upper}</p>
                  <p className="lower_value">{Strings.calc_149_lower}</p>
                </div>
                <div className="step">
                  <p className="upper_value">{Strings.calc_299_upper}</p>
                  <p className="lower_value">{Strings.calc_299_lower}</p>
                </div>
                <div className="step">
                  <p className="upper_value">{Strings.calc_599_upper}</p>
                  <p className="lower_value">{Strings.calc_599_lower}</p>
                </div>
                <div className="step">
                  <p className="upper_value">{Strings.calc_999_upper}</p>
                  <p className="lower_value">{Strings.calc_999_lower}</p>
                </div>
                <div className="step">
                  <p className="upper_value">{Strings.calc_1000_upper}</p>
                  <p className="lower_value">{Strings.calc_1000_lower}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bottomImage">
        <div className="content">{Strings.calc_equal}</div>
        <div className="image">
          <img src={EarningImage} alt="" />
        </div>
      </div>
    </>
  )
}

export default CalculatorSlider
