import React, { Component } from "react";
import { Helmet } from "react-helmet";
import ResultsList from "../ResultsList/resultsList";
import * as styles from "./searcher.module.css";
import data from "../../static/data.json";
import { DateTime } from "luxon";

class Searcher extends Component {
  state = {
    location: "",
    activity: "",
    freeDateFrom: "",
    freeDateTo: "",
    travellersQuantityLimit: "",
    options: [],
    results: [],
  };

  inputNames = [
    {
      labelName: "location",
      inputPlaceHolder: "Where are you going?",
    },
    {
      labelName: "activity",
      inputPlaceHolder: "What do you want to do?",
    },
    {
      labelName: "dates",
      inputPlaceHolder: "From?",
    },
    {
      labelName: "dates",
      inputPlaceHolder: "To?",
    },
    {
      labelName: "travellers",
      inputPlaceHolder: "How many?",
    },
  ];

  blockCheckboxes = [
    { name: "tour with guide", searchName: "tourWithGuide" },
    { name: "tour with driver", searchName: "tourWithDriver" },
    { name: "food & drink", searchName: "foodAndDrink" },
    { name: "sport & fitness", searchName: "sportAndFitness" },
    { name: "atr experience", searchName: "art" },
    { name: "entertainment & night life", searchName: "entertainment" },
    { name: "spa beauty & relaxation", searchName: "spa" },
    { name: "boat tour", searchName: "boatTour" },
    { name: "territory exploration", searchName: "territiryExplortion" },
  ];

  deleteSpacing = (query) => {
    return query
      .split("")
      .filter((letter) => letter !== " ")
      .join("");
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    if (target.placeholder === "To?") {
      this.setState({ freeDateTo: value });
    } else if (target.placeholder === "From?") {
      this.setState({ freeDateFrom: value });
    } else if (target.name === "travellers") {
      this.setState({ travellersQuantityLimit: value });
    } else if (target.type === "checkbox") {
      this.setState((prevState) => {
        if (prevState.options.includes(name)) {
          return {
            options: [...prevState.options.filter((elem) => elem !== name)],
          };
        }
        return { options: [...prevState.options, name] };
      });
    } else {
      this.setState({ [name]: value });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (
      !Object.entries(this.state).find(
        (item) =>
          item[1] !== "" && item[1].length !== 0 && item[0] !== "results"
      )
    ) {
      alert("Put just something");
      this.setState({ results: [] });
      return;
    }
    let results;
    let cloneData = [...data];
    for (let key in this.state) {
      if (
        (this.state[key] !== "" && key !== "options" && key !== "results") ||
        (this.state.options.length !== 0 && key === "options")
      ) {
        results = cloneData.filter((item) => {
          switch (key) {
            case "location":
              return (
                this.deleteSpacing(item[key].toLowerCase()) ===
                this.deleteSpacing(this.state[key].toLowerCase())
              );
            case "activity":
              const searchWordResult = item[key]["description"]
                .toLowerCase()
                .indexOf(this.state[key].toLowerCase());
              if (searchWordResult !== -1) {
                return item;
              }
              return (
                this.deleteSpacing(item[key]["name"].toLowerCase()) ===
                this.deleteSpacing(this.state[key].toLowerCase())
              );
            case "freeDateFrom":
              return (
                DateTime.fromISO(item[key]) <=
                  DateTime.fromISO(this.state[key]) &&
                DateTime.fromISO(item["freeDateTo"]) >=
                  DateTime.fromISO(this.state[key])
              );
            case "freeDateTo":
              return (
                DateTime.fromISO(item[key]) >= DateTime.fromISO(this.state[key])
              );
            case "travellersQuantityLimit":
              return Number(item[key]) >= Number(this.state[key]);
            case "options":
              let optionsResult = this.state[key].filter(
                (opt) => item[key][opt] === "true"
              );
              return this.state[key].length === optionsResult.length;
            default:
              break;
          }
        });
        if (results) {
          cloneData = [...results];
        }
      }
    }
    console.log(results);
    results
      ? this.setState({ results: [...results] })
      : this.setState({ results: [] });
  };

  render() {
    const {
      location,
      activity,
      freeDateFrom,
      freeDateTo,
      travellersQuantityLimit,
      results,
    } = this.state;
    const arrStateValues = [
      location,
      activity,
      freeDateFrom,
      freeDateTo,
      travellersQuantityLimit,
    ];
    return (
      <>
        <Helmet>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
          />
        </Helmet>
        <form className={styles.form} onSubmit={this.handleSubmit}>
          <ul className={styles.labelList}>
            {this.inputNames.map((item, ind) => (
              <li key={item.inputPlaceHolder}>
                <label
                  className={styles.label}
                  htmlFor={item.labelName}
                  key={item.inputPlaceHolder}
                  id={item.labelName === "dates" ? "labelDate" : null}
                >
                  {item.labelName}
                  {item.inputPlaceHolder === "From?" ? (
                    <p className={styles.datesPlaceholder}>
                      {this.state.freeDateFrom
                        ? this.state.freeDateFrom
                        : "From?"}
                    </p>
                  ) : null}
                  {item.inputPlaceHolder === "To?" ? (
                    <p className={styles.datesPlaceholder}>
                      {this.state.freeDateTo ? this.state.freeDateTo : "To?"}
                    </p>
                  ) : null}
                  <input
                    className={styles.input}
                    type={
                      item.labelName === "dates"
                        ? "date"
                        : item.labelName === "travellers"
                        ? "number"
                        : "text"
                    }
                    placeholder={item.inputPlaceHolder}
                    name={item.labelName}
                    value={arrStateValues[ind]}
                    onChange={this.handleChange}
                  />
                </label>
              </li>
            ))}
            <li>
              {" "}
              <button className="button" type="submit">
                <i className="fa fa-search"></i>
              </button>
            </li>
          </ul>

          <ul className={styles.checboxList}>
            {this.blockCheckboxes.map((item) => (
              <li key={item.name} className={styles.checboxListItem}>
                <label className={styles.inputDescription} key={item.name}>
                  <input
                    key={item.name}
                    onChange={this.handleChange}
                    name={item.searchName}
                    type="checkbox"
                    className="checkbox"
                  />
                  {item.name}
                </label>
              </li>
            ))}
          </ul>
        </form>
        {results.length > 0 ? <ResultsList results={results} /> : null}
      </>
    );
  }
}

export default Searcher;
