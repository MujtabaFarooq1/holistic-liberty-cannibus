import React from "react";
import "./EmailInput.scss";
import { Strings } from "../../../resources";
import HoverButton from "./../HoverButton"

export default function EmailInput(props) {
  const {
    autoCapitalize,
    placeholder,
    value,
    onChange,
    onBlur,
    errorMessage,
    disabled,
    buttonTitle,
    containerClass,
    onSubmit,
  } = props;

  const renderError = () => {
    return <div className={`input-error ${errorMessage ? "" : "hide"}`}>{errorMessage ? errorMessage : Strings.enter_email}</div>
  }

  const renderElement = () => {
    let inputClasses = ["InputElement"]

    if (errorMessage) {
      inputClasses.push("Invalid")
    }
    if (disabled) {
      inputClasses.push("Disabled")
    }
    return (
      <input
        autoCapitalize={autoCapitalize}
        className={inputClasses.join(" ")}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        type={"input", "email"}
        disabled={disabled}
      />
    )
  }

  return (

    <div
      className={
        containerClass ? `${containerClass} email-input-container` : "email-input-container"
      }
    >
      <div className="email-content">
        <div className={disabled ? "TextInput Disabled" : "TextInput"}>
          {renderElement()}
        </div>

        <HoverButton 
          onClick={() => onSubmit(value)}>
            {buttonTitle ? buttonTitle : Strings.go}
        </HoverButton>
      </div>

      {renderError()}
    </div>

  )
}
