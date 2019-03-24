import React from "react";

import "bulma-extensions/bulma-steps/dist/css/bulma-steps.min.css";

const TransactionSteps = props => {
  let { step } = props;

  let stepList = [
    { label: "Pilih customer", icon: "far fa-user", isActive: step === 0, isComplete: true },
    { label: "Jenis layanan", icon: "fas fa-cash-register", isActive: step === 1, isComplete: step > 0 },
    { label: "Item detail", icon: "fas fa-tshirt", isActive: step === 2, isComplete: step > 1 },
    { label: "Selesai", icon: "fas fa-question", isActive: step === 3, isComplete: step > 2 }
  ];

  const StepItems = props => {
    let { icon, label, isActive, isComplete } = props;

    return (
      <div className={isComplete ? "step-item is-active is-primary" : "step-item is-primary"}>
        <div className="step-marker">
          <i className={isActive ? icon : isComplete ? "fas fa-check" : icon} />
        </div>
        <div className="step-details">
          <p className="step-title">{label}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="steps" id="stepsDemo">
      {stepList.map((item, index) => (
        <StepItems key={index} icon={item.icon} label={item.label} isActive={item.isActive} isComplete={item.isComplete} />
      ))}
    </div>
  );
};

export default TransactionSteps;
