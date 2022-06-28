// child component
const ATMDeposit = ({ onChange, isDeposit, atmMode, isValid }) => {
  return (
    <label className="label huge">
      Please specify the {atmMode} amount.
      <br></br>
      <input
        type="number"
        width="200"
        onChange={onChange}
        style={isDeposit ? { color: "green" } : { color: "red" }}
      ></input>
      <input
        type="submit"
        width="200"
        value="Submit"
        disabled={!isValid}
      ></input>
    </label>
  );
};

// parent component
const Account = () => {
  // useState causes component to be re-rendered, meaning the code below will get executed again -> this is why we want to keep track of status outside of handleSubmit
  const [totalState, setTotalState] = React.useState(0); // account total at bank
  let status = `Account Balance $ ${totalState}`;
  const [transaction, setTransaction] = React.useState(0); // state of this transaction
  const [isDeposit, setIsDeposit] = React.useState(true);
  const [atmMode, setAtmMode] = React.useState("");
  const [isValid, setIsValid] = React.useState(false);

  // Account is re-rendered on change, submission, selection
  console.log(`Account rendered with isDeposit: ${isDeposit}`);

  const handleChange = (event) => {
    const userInput = Number(event.target.value);
    console.log(`handleChange ${userInput}`);

    // validate transaction
    if (userInput <= 0) {
      return setIsValid(false);
    }

    if (atmMode === "Cash Back" && userInput > totalState) {
      setIsValid(false);
    } else {
      // enable submit button for deposits
      // enable submit button for cash backs with sufficient funds
      setIsValid(true);
    }

    // set transaction after validation
    setTransaction(userInput);
  };

  const handleSubmit = (event) => {
    let updatedTotal = isDeposit
      ? // add if deposit
        totalState + transaction
      : // subtract if cash back
        totalState - transaction;
    setTotalState(updatedTotal);

    // change back to default
    setIsValid(false);

    // shouldn't be doing the below code - should be going through the React DOM
    // document.getElementById("total").innerHTML = status;

    // prevent page from reloading
    event.preventDefault();
  };

  function handleSelection(event) {
    // grab hold of user selection
    const userSelection = event.target.value;
    console.log(userSelection);

    // setAtmMode based on user selection
    setAtmMode(userSelection);

    // change back to default
    setIsValid(false);

    // setIsDeposit based on user selection
    if (userSelection === "Deposit") {
      setIsDeposit(true);
    } else {
      setIsDeposit(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 id="total">{status}</h2>
      <label>Please select the transaction type.</label>
      <br></br>
      <select
        id="mode-selector"
        name="mode"
        onChange={(e) => handleSelection(e)}
      >
        <option id="no-selection" value=""></option>
        <option id="deposit-selection" value="Deposit">
          Deposit
        </option>
        <option id="cashback-selection" value="Cash Back">
          Cash Back
        </option>
      </select>
      <br></br>
      <br></br>
      {atmMode && (
        <ATMDeposit
          onChange={handleChange}
          isDeposit={isDeposit}
          atmMode={atmMode}
          isValid={isValid}
        ></ATMDeposit>
      )}
    </form>
  );
};
// ========================================
ReactDOM.render(<Account />, document.getElementById("root"));
